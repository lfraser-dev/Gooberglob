/* =====================================================
   3D SKIRMISH extras:
   - Settings (O, or the button on the setup screen): master volume for the whole game, mouse sensitivity, invert Y.
   - Co-axial machine gun (hold Q): fast tracer fire that shreds hedges and sandbags but can't kill a tank; overheats.
   - Commander's binoculars (B): look around independently of the gun, zoom with the wheel, rangefinder,
     and spotting — enemies you look at stay marked for 12 s even far away.
   - Time of day (day / dusk / night) and weather (clear / rain; heavy snowfall on the snow map).
     Night has parachute flares; rain has lightning and thunder. Visibility limits how far enemy tags show.
     Online, the host's choice is sent to everyone.
===================================================== */
const SK3C = { vol: 80, sens: 1, inv: false, tod: 'day', wx: 'clear', gq: 'auto', fps: false };
(function () { try { Object.assign(SK3C, JSON.parse(localStorage.getItem('tankers_sk3cfg') || '{}')); } catch (e) {} })();
function sk3CSave() { try { localStorage.setItem('tankers_sk3cfg', JSON.stringify(SK3C)); } catch (e) {} sk3CApplyVol(); }

/* ---------- master volume: every sound in the game goes through one gain ---------- */
const SK3V = { node: null, ctx: null };
function sk3CApplyVol() { const c = typeof audioContext !== 'undefined' ? audioContext : null; if (!c) return; if (!SK3V.node || SK3V.ctx !== c) { SK3V.ctx = c; SK3V.node = c.createGain(); SK3V.node.__sk3 = true; SK3V.connect.call(SK3V.node, c.destination); } SK3V.node.gain.setTargetAtTime(Math.pow(SK3C.vol / 100, 1.6), c.currentTime, .05); }
(function () { const P = window.AudioNode && AudioNode.prototype; if (!P || P.__sk3patched) return; P.__sk3patched = true; SK3V.connect = P.connect;
    P.connect = function (dest) { if (dest && typeof AudioDestinationNode !== 'undefined' && dest instanceof AudioDestinationNode && !this.__sk3) { if (!SK3V.node || SK3V.ctx !== dest.context) { SK3V.ctx = dest.context; SK3V.node = dest.context.createGain(); SK3V.node.__sk3 = true; SK3V.connect.call(SK3V.node, dest); SK3V.node.gain.value = Math.pow(SK3C.vol / 100, 1.6); } return SK3V.connect.apply(this, [SK3V.node].concat([].slice.call(arguments, 1))); } return SK3V.connect.apply(this, arguments); };
    if (typeof playCannonSound === 'function') { const _pc = playCannonSound; playCannonSound = function () { if (SK3C.vol >= 99 || SK3D.on) return _pc.apply(this, arguments); try { const a = new Audio(CANNON_SOUND_DATA); a.volume = .82 * Math.pow(SK3C.vol / 100, 1.6); a.play().catch(function () {}); } catch (e) {} }; } })();

/* ---------- time of day + weather ---------- */
function sk3Tod() { return typeof DUEL !== 'undefined' && DUEL.active && DUEL.three ? (DUEL.tod || 'day') : SK3C.tod; }
function sk3Wx() { return typeof DUEL !== 'undefined' && DUEL.active && DUEL.three ? (DUEL.wx || 'clear') : SK3C.wx; }
function sk3LookFor(kind) { const L = JSON.parse(JSON.stringify(SK3_LOOK[kind])), tod = sk3Tod(), wx = sk3Wx(), snow = kind === 'snow';
    if (tod === 'dusk') Object.assign(L, { sky: ['#2a3046', '#c98e6c', '#5a4a46'], fog: '#857470', fogD: L.fogD * 1.1, sun: [.62, .16, .5], sunCol: '#ffc49a', sunI: 2.1, hemi: [.82, '#8e96b8', '#5e5048'], grade: Object.assign(L.grade, { tint: [1.05, .98, .94], sat: .92, bloom: .3, expo: 1 }), fill: .45, fillCol: '#ffd2a8' });
    if (tod === 'night') Object.assign(L, { sky: ['#04060c', '#18202e', '#0a0d14'], fog: snow ? '#1c2230' : '#10141c', fogD: L.fogD * 1.3, sun: [-.35, .55, -.45], sunCol: '#a8bce6', sunI: snow ? .9 : .8, hemi: [snow ? .7 : .62, '#5a6a92', '#16161c'], grade: Object.assign(L.grade, { expo: 1.45, sat: .62, tint: [.84, .94, 1.16], bloom: .55, vig: .5 }), fill: .32, fillCol: '#a8b8e0', rim: .22, night: true });
    if (wx === 'rain') { L.wet = !snow; L.sky = L.sky.map(function (h) { const c = new THREE.Color(h), g = (c.r + c.g + c.b) / 3; c.lerp(new THREE.Color(g, g, g * 1.04), .7).multiplyScalar(tod === 'night' ? .9 : .72); return '#' + c.getHexString(); });
        L.fogD *= snow ? 2.1 : 1.7; L.fog = tod === 'night' ? L.fog : (snow ? '#b4b8c0' : '#8a8c90'); L.sunI *= .42; L.hemi = [L.hemi[0] * 1.08, L.hemi[1], L.hemi[2]]; L.grade = Object.assign(L.grade, { sat: (L.grade.sat || 1) * .8, bloom: (L.grade.bloom || .2) + .08 }); L.rain = true; }
    return L; }
// how far away an enemy's name tag shows: depends on light, weather, spotting and whether it just fired
function sk3TagRange(t, foe) { if (!foe) return 170; const now = performance.now(), night = sk3Tod() === 'night', rain = sk3Wx() === 'rain', spotted = now < (t.sk3Spot || 0), lit = now < (t.sk3Reveal || 0) || (SK3X.flare && Math.hypot(sk3X(t.x) - SK3X.flare.x, sk3Z(t.y) - SK3X.flare.z) < 90);
    if (spotted) return 520; if (night) return lit ? 260 : 55; if (rain) return lit ? 220 : 110; return 170; }

/* ---------- machine gun ---------- */
const SK3X = { bullets: [], fire: {}, heat: 0, over: false, cd: {}, n: 0, sentOn: false, flare: null, nextFlare: 0, nextBolt: 0, rainSnd: null };
const SK3_MGDMG = { hedgerow: 3.2, sk3Sandbag: 2.4, bocageHut: 1.6, snowCabin: 1.3, farm: .9, wreck: .6, ruinBuilding: .8, building: .25, shop: .3, civic: .25 };
function sk3MgAuth() { return !(typeof DUEL !== 'undefined' && DUEL.active && DUEL.role !== 'host'); }
function sk3MgFireOne(t, own) { const a = (t.turretAngle || 0) + (Math.random() - .5) * .028, off = (t.size || 26) * 1.15, sx = t.x + Math.cos(t.turretAngle) * off - Math.sin(t.turretAngle) * 5, sy = t.y + Math.sin(t.turretAngle) * off + Math.cos(t.turretAngle) * 5;
    SK3X.bullets.push({ x: sx, y: sy, vx: Math.cos(a) * 26, vy: Math.sin(a) * 26, life: 36, o: t, n: SK3X.n++, own: own });
    const st = SK3D.st, m = SK3D.models.get(t); if (st && m && SK3D.ready) { try { const md = exMuzzle(m), side = new THREE.Vector3(-md[1].z, 0, md[1].x).multiplyScalar(.35 * m.k), p = md[0].clone().add(side).addScaledVector(md[1], -.6 * m.k); st.fire.emit({ x: p.x, y: p.y, z: p.z, life: .05, s0: .45, s1: .7, c0: [10, 7, 3, 1], c1: [4, 1.5, .3, 0], add: 1 }); sk3SndMG(p.x, p.y, p.z, own); } catch (e) {} }
    if (!own) t.sk3Reveal = performance.now() + 2500; }
function sk3SndMG(x, y, z, own) { const S = sk3SPlace(x, y, z, { ref: own ? 10 : 6, vol: own ? .55 : .6, nodelay: own }); if (!S) return; sk3SNoise(S, .07, 4200, 900, 'bandpass', 1.1, .7, .002); sk3STone(S, .05, 180, 80, 'square', .2, .002); }
function sk3MgStep() { if (!SK3D.on || !gameRunning) return; const duel = typeof DUEL !== 'undefined' && DUEL.active;
    // your gun: hold Q (overheats after ~5 s of fire, cools when you let go)
    const want = !!keys.q && player && !player.destroyed && !player.repairing && !SK3D.bino && !SK3D.map; if (SK3X.over && SK3X.heat < .35) SK3X.over = false; const on = want && !SK3X.over;
    if (on) { SK3X.cd.me = (SK3X.cd.me || 0) - 1; if (SK3X.cd.me <= 0) { SK3X.cd.me = 6; sk3MgFireOne(player, true); SK3X.heat += .021; if (SK3X.heat >= 1) { SK3X.over = true; try { showRadioText('MACHINE GUN OVERHEATED — LET IT COOL', true); } catch (e) {} } } } else SK3X.heat = Math.max(0, SK3X.heat - .0045);
    if (duel && on !== SK3X.sentOn) { SK3X.sentOn = on; const msg = { t: 'mgf', s: DUEL.mySlot, on: on ? 1 : 0 }; if (DUEL.role === 'host') duelBroadcast(msg); else duelSend(msg); }
    // other players' guns online
    if (duel) Object.keys(SK3X.fire).forEach(function (s) { if (!SK3X.fire[s] || +s === DUEL.mySlot) return; const t = DUEL.tanks[+s]; if (!t || t.destroyed) return; SK3X.cd[s] = (SK3X.cd[s] || 0) - 1; if (SK3X.cd[s] <= 0) { SK3X.cd[s] = 6; sk3MgFireOne(t, false); } });
    // bullets
    const auth = sk3MgAuth(), st = SK3D.st, tanks = [player].concat(allies || [], enemies || []);
    for (let i = SK3X.bullets.length - 1; i >= 0; i--) { const b = SK3X.bullets[i], x2 = b.x + b.vx, y2 = b.y + b.vy; let done = false;
        const o = shellHitsObstacle(b.x, b.y, x2, y2); if (o) { done = true; sk3MgImpact(x2, y2, o); if (auth) sk3MgCover(o, x2, y2); }
        if (!done && typeof sk3InfBulletHit === 'function' && sk3InfBulletHit(b, x2, y2)) done = true;
        if (!done) for (const t of tanks) { if (!t || t === b.o || t.destroyed) continue; if (Math.hypot(t.x - x2, t.y - y2) < (t.size || 24) * .9) { done = true; sk3MgPing(x2, y2); if (auth) { const d = String(t.className).toUpperCase() === 'LIGHT' ? 1.1 : .5; t.health = Math.min(t.health, Math.max(1, t.health - d)); } break; } }
        b.x = x2; b.y = y2; if (--b.life <= 0 && !done) { done = true; if (st) { const x = sk3X(x2), z = sk3Z(y2), h = st.hgt ? st.hgt(x, z) : 0; st.dust.emit({ x: x, y: h + .1, z: z, vy: .6, life: .6, s0: .2, s1: .6, c0: [.5, .45, .38, .4], c1: [.5, .45, .38, 0] }); } }
        if (done) SK3X.bullets.splice(i, 1); } }
function sk3MgCover(o, x2, y2) { const per = SK3_MGDMG[o.type]; if (!per || o.sk3gone || !SK3_HP[o.type]) return; o.sk3hp = (o.sk3hp == null ? SK3_HP[o.type] : o.sk3hp) - per;
    if (o.sk3hp <= 0) { sk3Collapse(o); if (typeof DUEL !== 'undefined' && DUEL.active && DUEL.role === 'host') duelBroadcast({ t: 'ob', i: obstacles.indexOf(o) }); } }
function sk3MgImpact(x2, y2, o) { const st = SK3D.st; if (!st || !SK3D.ready) return; const x = sk3X(x2), z = sk3Z(y2), y = (st.hgt ? st.hgt(x, z) : 0) + 1.1 + Math.random() * 1.2, soft = o && (o.type === 'hedgerow' || o.type === 'sk3Forest' || o.type === 'bocageHut'), dc = soft ? [.32, .4, .2] : [.6, .55, .48];
    for (let i = 0; i < 4; i++) st.dust.emit({ x: x, y: y, z: z, vx: (Math.random() - .5) * 3, vy: Math.random() * 2.5, vz: (Math.random() - .5) * 3, life: .7, s0: .15, s1: .5, c0: [dc[0], dc[1], dc[2], .6], c1: [dc[0], dc[1], dc[2], 0], drag: 2 });
    if (!soft && Math.random() < .5) st.spark.emit({ x: x, y: y, z: z, vx: (Math.random() - .5) * 6, vy: Math.random() * 4, vz: (Math.random() - .5) * 6, life: .2, len: .2, w: .02, c: [12, 8, 3, 1], g: 8, fade: 1 }); }
function sk3MgPing(x2, y2) { const st = SK3D.st; if (!st || !SK3D.ready) return; const x = sk3X(x2), z = sk3Z(y2), y = (st.hgt ? st.hgt(x, z) : 0) + 1.3; for (let i = 0; i < 5; i++) st.spark.emit({ x: x, y: y, z: z, vx: (Math.random() - .5) * 8, vy: Math.random() * 5, vz: (Math.random() - .5) * 8, life: .25, len: .25, w: .025, c: [14, 10, 5, 1], g: 9, fade: 1 });
    if (Math.random() < .5) { const S = sk3SPlace(x, y, z, { ref: 5, vol: .4 }); if (S) sk3STone(S, .08, 1800 + Math.random() * 900, 1200, 'triangle', .12, .002); } }
function sk3MgDraw(st, dt) { const L = dt + .004; SK3X.bullets.forEach(function (b) { const x = sk3X(b.x), z = sk3Z(b.y), y = (st.hgt ? st.hgt(x, z) : 0) + 1.75, sp = Math.hypot(b.vx, b.vy) || 1, bright = b.n % 4 === 0;
        st.trac.emit({ x: x, y: y, z: z, vx: b.vx / sp * .001, vy: 0, vz: b.vy / sp * .001, life: L, len: bright ? 3.2 : 1.6, w: bright ? .05 : .025, c: bright ? [16, 5, 2, 1] : [6, 4.5, 2.5, .5], fade: 0 }); }); }

/* ---------- binoculars ---------- */
function sk3Bino(on) { SK3D.bino = !!on && !!player && !player.destroyed; if (SK3D.bino) { SK3D.byaw = SK3D.yaw; SK3D.bpitch = 0; SK3D.binoFov = SK3D.binoFov || 18; if (SK3D.scope) sk3SetScope(false); } else if (TK3.cam) { TK3.cam.userData.hfov = -1; } }
function sk3BinoSpot() { if (!SK3D.bino || !TK3.cam) return; const cam = TK3.cam.position, fov = (SK3D.binoFov || 18) * Math.PI / 180, now = performance.now(), maxD = sk3Tod() === 'night' ? 160 : sk3Wx() === 'rain' ? 260 : 520;
    (enemies || []).forEach(function (e) { if (!e || e.destroyed) return; const x = sk3X(e.x), z = sk3Z(e.y), d = Math.hypot(x - cam.x, z - cam.z), lit = now < (e.sk3Reveal || 0) || (SK3X.flare && Math.hypot(x - SK3X.flare.x, z - SK3X.flare.z) < 90); if (d > (lit ? 520 : maxD)) return; const a = Math.atan2(z - cam.z, x - cam.x), diff = Math.abs(sk3Wrap(a - SK3D.byaw)); if (diff > fov * .6) return;
        // line of sight: no solid cover in between
        const px = player.x, py = player.y, n = Math.ceil(Math.hypot(e.x - px, e.y - py) / 24); for (let k = 2; k < n - 1; k++) { const qx = px + (e.x - px) * k / n, qy = py + (e.y - py) * k / n; if (tankHitsObstacle({ x: qx, y: qy, size: 3 }, qx, qy)) return; }
        if (!(now < (e.sk3Spot || 0))) { try { showRadioText('ENEMY SPOTTED — ' + String(e.name || 'TANK').toUpperCase() + ', ' + Math.round(d) + ' M', true); } catch (x) {} } e.sk3Spot = now + 12000; }); }
function sk3BinoRange() { const cam = TK3.cam; if (!cam || !SK3D.st) return null; const dir = new THREE.Vector3(); cam.getWorldDirection(dir); let best = null;
    (enemies || []).concat(allies || []).forEach(function (e) { if (!e || e.destroyed) return; const v = new THREE.Vector3(sk3X(e.x) - cam.position.x, 1.5 - cam.position.y, sk3Z(e.y) - cam.position.z), d = v.length(); if (v.normalize().dot(dir) > Math.cos(Math.max(.012, (SK3D.binoFov || 18) * Math.PI / 180 * .06)) && (!best || d < best)) best = d; });
    if (best) return best; if (dir.y < -.002) return Math.min(999, (cam.position.y - 0) / -dir.y); return null; }

/* ---------- night flares, rain, lightning ---------- */
function sk3Weather(st, t, dt) { const cam = SK3D.camP; if (!cam || SK3D.map) return; const r = Math.random, now = performance.now(), tod = sk3Tod(), wx = sk3Wx();
    if (wx === 'rain') { if (st.map === 'snow') { if (st.flakes) for (let i = 0; i < dt * 1100; i++) st.flakes.emit({ x: cam.x + (r() - .5) * 50, y: cam.y + 2 + r() * 20, z: cam.z + (r() - .5) * 50, vx: 2.4, vy: -3 - r() * 1.5, vz: .8, life: 6, len: .22, w: .06, c: [1, 1, 1, .9], fade: 1 }); }
        else if (st.rain) { for (let i = 0, nR = dt * 2600 * (typeof sk3QPart === 'function' ? sk3QPart() : 1); i < nR; i++) st.rain.emit({ x: cam.x + (r() - .5) * 46, y: cam.y + 4 + r() * 16, z: cam.z + (r() - .5) * 46, vx: 1.8, vy: -24 - r() * 6, vz: .6, life: 1.1, len: 1.2, w: .022, c: [.75, .78, .86, tod === 'night' ? .35 : .5], fade: 0 }); for (let i = 0; i < dt * 60; i++) { const x = cam.x + (r() - .5) * 26, z = cam.z + (r() - .5) * 26; st.dust.emit({ x: x, y: (st.hgt ? st.hgt(x, z) : 0) + .04, z: z, vy: .6, life: .25, s0: .05, s1: .35, c0: [.8, .82, .88, .35], c1: [.8, .82, .88, 0] }); } }
        if (now > SK3X.nextBolt) { SK3X.nextBolt = now + 14000 + r() * 22000; { TK3.flash = Math.max(TK3.flash || 0, 1.4); if (st.L && st.L.dir) { const L = st.L.dir, i0 = L.intensity; L.intensity = i0 + 5; setTimeout(function () { L.intensity = i0 + 2; }, 70); setTimeout(function () { L.intensity = i0; }, 180); }
                setTimeout(function () { const S = sk3SPlace(cam.x + (r() - .5) * 600, 80, cam.z + (r() - .5) * 600, { ref: 200, vol: .8, nodelay: true, max: 3000, muf: 400 }); if (S) { sk3SNoise(S, 4, 260, 40, 'lowpass', .7, .7, .3); sk3STone(S, 2.5, 46, 22, 'sine', .5, .2); } }, 900 + r() * 3000); } }
        if (!SK3X.rainSnd) { const c = sk3SCtx(); if (c) { const out = sk3SOut(c), src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain(); src.buffer = SK3S.noise; src.loop = true; bp.type = 'bandpass'; bp.frequency.value = st.map === 'snow' ? 600 : 2600; bp.Q.value = .5; g.gain.value = st.map === 'snow' ? .05 : .13; src.connect(bp); bp.connect(g); g.connect(out); src.start(); SK3X.rainSnd = { src: src, g: g }; } } }
    if (tod === 'night') { const f = SK3X.flare;
        if (!f && now > SK3X.nextFlare) { const a = r() * 6.28, d = 40 + r() * 110; SK3X.flare = { x: cam.x + Math.cos(a) * d, z: cam.z + Math.sin(a) * d, y: 70, t0: now }; SK3X.nextFlare = now + 26000 + r() * 16000; if (!st.flareL) return; const S = sk3SPlace(SK3X.flare.x, 2, SK3X.flare.z, { ref: 20, vol: .5 }); if (S) { sk3STone(S, .5, 900, 240, 'sine', .15); sk3SNoise(S, .3, 3000, 800, 'bandpass', 1, .3); } }
        if (f) { const age = (now - f.t0) / 1000; f.y = Math.max(4, 70 - age * 2.2); const k = age < 1 ? age : age > 26 ? Math.max(0, 1 - (age - 26) / 2) : 1; st.flareL.position.set(f.x, f.y, f.z); st.flareL.intensity = k * (3.4 + Math.sin(t * 31) * .3 + r() * .4);
            st.fire.emit({ x: f.x, y: f.y, z: f.z, life: dt + .004, s0: 2.2, c0: [16, 14, 10, 1], c1: [16, 14, 10, 1], add: 1 }); if (r() < dt * 10) st.smoke.emit({ x: f.x, y: f.y + .4, z: f.z, vx: .8, vy: .6, life: 6, s0: .4, s1: 2.4, c0: [.6, .6, .62, .35], c1: [.6, .6, .62, 0] }); if (age > 28) { SK3X.flare = null; st.flareL.intensity = 0; } } } }

/* ---------- HUD: machine gun heat, binoculars, spotted marks ---------- */
function sk3ExtraHud() { const c = SK3D.hud; if (!c || !player || !TK3.cam) return; const g = c.getContext('2d'), now = performance.now(), cam = TK3.cam, v = new THREE.Vector3();
    if (SK3X.heat > .02 || SK3X.over) { g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(500, 386, 100, 7); g.fillStyle = SK3X.over ? '#ff4a2a' : SK3X.heat > .7 ? '#ffb040' : '#e8dcb8'; g.fillRect(501, 387, 98 * Math.min(1, SK3X.heat), 5); g.font = 'bold 10px "Special Elite", monospace'; g.textAlign = 'center'; g.fillStyle = SK3X.over ? '#ff7a5a' : '#e8dcb8'; g.fillText(SK3X.over ? 'MG OVERHEATED' : 'MG', 550, 404); }
    // spotted enemies: red diamonds with distance, even far away
    (enemies || []).forEach(function (e) { if (!e || e.destroyed || !(now < (e.sk3Spot || 0))) return; v.set(sk3X(e.x), 3.5, sk3Z(e.y)).project(cam); if (v.z >= 1 || v.z <= -1) return; const x = (v.x + 1) * 550, y = (1 - v.y) * 350, d = Math.hypot(e.x - player.x, e.y - player.y) * SK3D.S, a = Math.min(1, (e.sk3Spot - now) / 2000);
        g.globalAlpha = a; g.strokeStyle = '#ff5a3a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y - 9); g.lineTo(x + 7, y); g.lineTo(x, y + 9); g.lineTo(x - 7, y); g.closePath(); g.stroke(); g.font = 'bold 11px "Special Elite", monospace'; g.fillStyle = '#ffb0a0'; g.textAlign = 'center'; g.fillText(Math.round(d) + ' m', x, y - 13); g.globalAlpha = 1; });
    if (SK3D.bino) {
        g.strokeStyle = 'rgba(20,20,20,.85)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(400, 350); g.lineTo(700, 350); g.moveTo(550, 260); g.lineTo(550, 440); g.stroke(); for (let i = -5; i <= 5; i++) if (i) { g.beginPath(); g.moveTo(550 + i * 22, 344); g.lineTo(550 + i * 22, 356); g.stroke(); }
        const rng = sk3BinoRange(); g.font = 'bold 14px "Special Elite", monospace'; g.textAlign = 'center'; g.fillStyle = '#d8f0c8'; g.fillText('RANGE ' + (rng ? Math.round(rng) + ' m' : '---'), 550, 560); g.font = '11px "Special Elite", monospace'; g.fillStyle = 'rgba(216,240,200,.75)'; g.fillText('x' + (72 / (SK3D.binoFov || 18)).toFixed(1) + '  ·  WHEEL ZOOM  ·  B TO PUT DOWN', 550, 580); } }
// draw the binocular frame with a single even-odd fill (simpler and robust)
function sk3BinoFrame(g) { let m = SK3X.mask; if (!m) { m = SK3X.mask = document.createElement('canvas'); m.width = 1100; m.height = 700; const c = m.getContext('2d'); c.fillStyle = 'rgba(0,0,0,.94)'; c.fillRect(0, 0, 1100, 700); c.globalCompositeOperation = 'destination-out'; [470, 630].forEach(function (x) { const gr = c.createRadialGradient(x, 350, 200, x, 350, 252); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.beginPath(); c.arc(x, 350, 252, 0, Math.PI * 2); c.fill(); }); }
    g.drawImage(m, 0, 0, 1100, 700); }

/* ---------- settings panel ---------- */
function sk3CfgOpen(on) { let p = document.getElementById('sk3Cfg'); if (!on) { if (p) p.style.display = 'none'; return; } try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) {}
    if (!p) { p = document.createElement('div'); p.id = 'sk3Cfg'; p.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:120;width:min(420px,92vw);background:rgba(18,20,14,.97);border:2px solid #c8a040;padding:18px 22px;color:#e8dcb8;font:14px "Special Elite",monospace;letter-spacing:.06em;box-shadow:0 10px 40px rgba(0,0,0,.6)'; document.body.appendChild(p); }
    const row = function (lab, html) { return '<div style="margin:12px 0"><div style="font-size:12px;letter-spacing:.2em;color:#ffcf6a;margin-bottom:6px">' + lab + '</div>' + html + '</div>'; }, pick = function (key, opts) { return opts.map(function (o) { return '<button data-k="' + key + '" data-v="' + o[0] + '" style="margin:0 6px 6px 0;padding:6px 12px;font:13px Special Elite,monospace;cursor:pointer;background:' + (SK3C[key] === o[0] ? '#c8a040;color:#1a1a10' : '#2a2a20;color:#e8dcb8') + ';border:1px solid #c8a040">' + o[1] + '</button>'; }).join(''); };
    p.innerHTML = '<div style="font:20px Stardos Stencil,Impact,sans-serif;letter-spacing:.2em;margin-bottom:6px">3D SETTINGS</div>' +
        row('MASTER VOLUME · <span id="sk3VolV">' + SK3C.vol + '%</span>', '<input id="sk3Vol" type="range" min="0" max="100" value="' + SK3C.vol + '" style="width:100%">') +
        row('MOUSE SENSITIVITY · <span id="sk3SensV">' + SK3C.sens.toFixed(2) + 'x</span>', '<input id="sk3Sens" type="range" min="0.3" max="2.5" step="0.05" value="' + SK3C.sens + '" style="width:100%">') +
        row('GRAPHICS QUALITY', pick('gq', [['auto', 'AUTO'], ['low', 'LOW'], ['med', 'MEDIUM'], ['high', 'HIGH']]) + '<label style="cursor:pointer;display:block;margin-top:4px"><input id="sk3Fps" type="checkbox"' + (SK3C.fps ? ' checked' : '') + '> SHOW FRAME RATE</label>') +
        row('MOUSE', '<label style="cursor:pointer"><input id="sk3Inv" type="checkbox"' + (SK3C.inv ? ' checked' : '') + '> INVERT UP / DOWN</label>') +
        row('TIME OF DAY <small style="opacity:.7">(NEXT BATTLE)</small>', pick('tod', [['day', 'DAY'], ['dusk', 'DUSK'], ['night', 'NIGHT']])) +
        row('WEATHER <small style="opacity:.7">(NEXT BATTLE)</small>', pick('wx', [['clear', 'CLEAR'], ['rain', 'RAIN / SNOWSTORM']])) +
        '<div style="font-size:11px;opacity:.7;margin-top:10px">ONLINE: THE HOST\'S TIME AND WEATHER ARE USED.<br>Q MACHINE GUN · B BINOCULARS · G ARTILLERY · O SETTINGS</div><button id="sk3CfgX" style="margin-top:14px;width:100%;padding:9px;font:15px Stardos Stencil,Impact,sans-serif;letter-spacing:.2em;background:#c8a040;color:#1a1a10;border:0;cursor:pointer">DONE</button>';
    p.style.display = 'block';
    document.getElementById('sk3Vol').oninput = function () { SK3C.vol = +this.value; document.getElementById('sk3VolV').textContent = SK3C.vol + '%'; sk3CSave(); };
    document.getElementById('sk3Sens').oninput = function () { SK3C.sens = +this.value; document.getElementById('sk3SensV').textContent = SK3C.sens.toFixed(2) + 'x'; sk3CSave(); };
    document.getElementById('sk3Inv').onchange = function () { SK3C.inv = this.checked; sk3CSave(); };
    document.getElementById('sk3Fps').onchange = function () { SK3C.fps = this.checked; sk3CSave(); };
    p.querySelectorAll('button[data-k]').forEach(function (b) { b.onclick = function () { SK3C[b.getAttribute('data-k')] = b.getAttribute('data-v'); sk3CSave(); sk3CfgOpen(true); }; });
    document.getElementById('sk3CfgX').onclick = function () { sk3CfgOpen(false); }; }

/* ---------- hooks ---------- */
(function () {
    // machine gun steps with the battle (60 a second); remote players' guns online
    const _us = updateShells; updateShells = function () { const r = _us.apply(this, arguments); try { sk3MgStep(); } catch (e) { SK3X.err = e; } return r; };
    if (typeof duelOnData === 'function') { const _od = duelOnData; duelOnData = function (m, c) { if (m && m.t === 'mgf') { DUEL.lastRx = Date.now(); if (c) c.lastRx = Date.now(); if (DUEL.role === 'host') { if (!c || !(c.slot > 0)) return; SK3X.fire[c.slot] = !!m.on; duelBroadcast({ t: 'mgf', s: c.slot, on: m.on ? 1 : 0 }, c); } else SK3X.fire[m.s | 0] = !!m.on; return; } return _od.apply(this, arguments); }; }
    if (typeof duelBroadcastStart === 'function') { const _bs = duelBroadcastStart; duelBroadcastStart = function () { DUEL.tod = SK3C.tod; DUEL.wx = SK3C.wx; return _bs.apply(this, arguments); }; }
    // per-frame visuals
    const sc = TK3.list[SK3D.idx], _up = sc.update; sc.update = function (st, t, dt) { const r = _up.apply(this, arguments); try { sk3MgDraw(st, dt); sk3Weather(st, t, dt); sk3BinoSpot(); } catch (e) { SK3X.err = e; } return r; };
    const _bw = sk3BuildWorld; sk3BuildWorld = function (st) { const r = _bw.apply(this, arguments); st.rain = sk3Wx() === 'rain' && st.map !== 'snow' ? tk3Streaks(3200, { normal: true }) : null; if (sk3Wx() === 'rain' && st.map === 'snow' && !st.flakes) st.flakes = tk3Streaks(3200, { normal: true }); st.flareL = sk3Tod() === 'night' ? tk3PL('#fff1d6', 0, 230, 0, -50, 0) : null; SK3X.flare = null; SK3X.nextFlare = performance.now() + 4000; SK3X.nextBolt = performance.now() + 8000; return r; };
    const _hud = sk3Hud; sk3Hud = function () { const r = _hud.apply(this, arguments); try { if (SK3D.bino) sk3BinoFrame(SK3D.hud.getContext('2d')); sk3ExtraHud(); } catch (e) {} return r; };
    const _mz = sk3Muzzle; sk3Muzzle = function (t) { if (t) t.sk3Reveal = performance.now() + 3000; return _mz.apply(this, arguments); };
    const _st = sk3Start; sk3Start = function () { SK3X.bullets = []; SK3X.fire = {}; SK3X.heat = 0; SK3X.over = false; SK3X.sentOn = false; SK3D.bino = false; return _st.apply(this, arguments); };
    const _stop = sk3Stop; sk3Stop = function () { SK3D.bino = false; SK3X.bullets = []; sk3CfgOpen(false); if (SK3X.rainSnd) { try { SK3X.rainSnd.src.stop(); } catch (e) {} SK3X.rainSnd = null; } return _stop.apply(this, arguments); };
    // keys: B binoculars, O settings (Q is read straight from the held keys)
    window.addEventListener('keydown', function (e) { if (!SK3D.on || e.repeat) return; const tg = e.target; if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA')) return; const k = e.key.toLowerCase();
        if (k === 'b') { e.preventDefault(); sk3Bino(!SK3D.bino); } else if (k === 'o') { e.preventDefault(); const p = document.getElementById('sk3Cfg'); sk3CfgOpen(!(p && p.style.display === 'block')); } }, true);
    // the setup screen and the online lobby get the time/weather choice and a settings button
    const _bd = sk3Badge; sk3Badge = function () { const r = _bd.apply(this, arguments); const b = document.getElementById('sk3Badge'); if (b && !document.getElementById('sk3CfgBtn')) { const btn = document.createElement('button'); btn.id = 'sk3CfgBtn'; btn.textContent = '⚙ 3D SETTINGS · TIME · WEATHER'; btn.style.cssText = 'margin-top:8px;padding:6px 14px;font:13px Special Elite,monospace;letter-spacing:.12em;background:#c8a040;color:#1a1a10;border:0;cursor:pointer'; btn.onclick = function () { sk3CfgOpen(true); }; b.appendChild(btn); } return r; };
    if (typeof duelBuild === 'function') { const _db = duelBuild; duelBuild = function () { const r = _db.apply(this, arguments); try { const d = document.getElementById('duel3d'); if (d && !document.getElementById('duel3dCfg')) { const b = document.createElement('button'); b.id = 'duel3dCfg'; b.style.cssText = 'width:100%;margin-top:6px'; b.textContent = '⚙ TIME · WEATHER · SETTINGS (3D)'; b.onclick = function () { sk3CfgOpen(true); }; d.appendChild(b); } } catch (e) {} return r; }; }
    // hint line mentions the new keys
    window.addEventListener('load', function () { try { sk3CApplyVol(); } catch (e) {} });
})();
