/* =====================================================
   3D SKIRMISH: heavier combat + positional sound.
   - Damage you can see: engine smoke and fire, a thrown track (one side's track gone, the hull lists),
     sparks from a jammed turret ring, a smoking jammed gun, a badly hurt tank smoking all over.
   - Hits that read: ricochets spark and glance off, penetrations leave scorched holes in the armour,
     hit markers for your own shots, a red flash and a direction marker when you are hit.
   - Destructible cover: houses, shops, huts, farms, ruins, hedgerows and sandbags take shell damage,
     show holes where they're hit, and finally collapse into rubble (AI routes and collision update; synced online).
   - Sound: everything placed in 3D around the camera, muffled and delayed by distance (sound travels 343 m/s):
     cannon (the game's own recording), explosions, armour clangs, ricochet whines, shell whistles that pass you,
     collapsing buildings, the engines of nearby tanks, your tracks and turret traverse, a distant battle.
===================================================== */
const SK3F = { decals: [], falling: [], marks: [], hitFlash: 0, hitDir: null, inShells: false, texts: [], stats: { cannon: 0, boom: 0, clang: 0, rico: 0, whiz: 0, collapse: 0, holes: 0 } };
const SK3_HP = { building: 380, shop: 300, civic: 320, ruinBuilding: 220, snowCabin: 230, farm: 300, bocageHut: 200, hedgerow: 170, sk3Sandbag: 90, wreck: 160, sk3Church: 1400, townhall: 1600 };

/* ---------- the sound engine ---------- */
const SK3S = { out: null, cannon: null, loading: false, eng: new Map(), lastAmb: 0, trk: null, tur: null, whizzed: new WeakSet(), shDist: new WeakMap() };
function sk3SCtx() { if (typeof audioContext === 'undefined' || !audioContext || audioContext.state !== 'running') return null; return audioContext; }
function sk3SOut(c) { if (SK3S.out) return SK3S.out; const g = c.createGain(), comp = c.createDynamicsCompressor(); g.gain.value = .85; comp.threshold.value = -14; comp.ratio.value = 4; g.connect(comp); comp.connect(c.destination); SK3S.out = g;
    // the cannon recording the 2D game uses
    if (!SK3S.cannon && !SK3S.loading && typeof CANNON_SOUND_DATA !== 'undefined') { SK3S.loading = true; fetch(CANNON_SOUND_DATA).then(function (r) { return r.arrayBuffer(); }).then(function (b) { return c.decodeAudioData(b); }).then(function (buf) { SK3S.cannon = buf; }).catch(function () {}); }
    if (!SK3S.noise) { const n = c.sampleRate * 2, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; SK3S.noise = b; }
    return g; }
// a sound source placed in the world: returns { at (start time), inp (connect here) }, or null if too far / no audio
function sk3SPlace(x, y, z, o) { const c = sk3SCtx(); if (!c || !SK3D.on || !TK3.cam) return null; o = o || {}; const out = sk3SOut(c), cam = TK3.cam.position, dist = Math.hypot(x - cam.x, y - cam.y, z - cam.z); if (dist > (o.max || 700)) return null;
    const p = c.createPanner(); p.panningModel = 'HRTF'; p.distanceModel = 'inverse'; p.refDistance = o.ref || 7; p.rolloffFactor = o.roll || 1.1; p.maxDistance = 2000;
    if (p.positionX) { p.positionX.value = x; p.positionY.value = y; p.positionZ.value = z; } else p.setPosition(x, y, z);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = Math.max(500, 16000 * Math.exp(-dist / (o.muf || 110))); const g = c.createGain(); g.gain.value = o.vol == null ? 1 : o.vol;
    g.connect(lp); lp.connect(p); p.connect(out); return { at: c.currentTime + (o.nodelay ? 0 : dist / 343) + .005, inp: g, c: c, dist: dist }; }
function sk3SNoise(S, dur, f0, f1, type, q, vol, attack) { const c = S.c, src = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); src.buffer = SK3S.noise; src.loop = true; fl.type = type || 'lowpass'; fl.Q.value = q || .8; fl.frequency.setValueAtTime(f0, S.at); fl.frequency.exponentialRampToValueAtTime(Math.max(30, f1), S.at + dur);
    g.gain.setValueAtTime(.0001, S.at); g.gain.exponentialRampToValueAtTime(vol, S.at + (attack || .006)); g.gain.exponentialRampToValueAtTime(.0001, S.at + dur); src.connect(fl); fl.connect(g); g.connect(S.inp); src.start(S.at, Math.random()); src.stop(S.at + dur + .05); }
function sk3STone(S, dur, f0, f1, type, vol, attack) { const c = S.c, o = c.createOscillator(), g = c.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f0, S.at); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), S.at + dur);
    g.gain.setValueAtTime(.0001, S.at); g.gain.exponentialRampToValueAtTime(vol, S.at + (attack || .005)); g.gain.exponentialRampToValueAtTime(.0001, S.at + dur); o.connect(g); g.connect(S.inp); o.start(S.at); o.stop(S.at + dur + .05); }
function sk3SndCannon(x, y, z, own, big) { const S = sk3SPlace(x, y, z, { ref: own ? 14 : 9, vol: own ? 1 : .95, nodelay: own, muf: 140 }); if (!S) return; SK3F.stats.cannon++;
    if (SK3S.cannon) { const s = S.c.createBufferSource(); s.buffer = SK3S.cannon; s.playbackRate.value = (big ? .82 : 1) * (.94 + Math.random() * .1); s.connect(S.inp); s.start(S.at); }
    else sk3SNoise(S, 1.1, 2400, 120, 'lowpass', .7, .9, .003);
    sk3STone(S, .55, big ? 62 : 75, 28, 'sine', own ? .9 : .6, .004); sk3SNoise(S, 1.8, 420, 70, 'lowpass', .6, .25, .02); }
function sk3SndBoom(x, y, z, s) { s = Math.max(.4, Math.min(2.4, s || 1)); const S = sk3SPlace(x, y, z, { ref: 10 * s, vol: .9, muf: 120 }); if (!S) return; SK3F.stats.boom++;
    sk3SNoise(S, .9 + s * .4, 1800 * Math.sqrt(s), 90, 'lowpass', .8, .7 * Math.min(1, s), .004); sk3STone(S, .7 + s * .2, 70, 26, 'sine', .8 * Math.min(1, s), .004); if (s > 1.2) sk3SNoise(S, 2.6, 300, 60, 'lowpass', .5, .3, .05); }
function sk3SndClang(x, y, z, pen) { const S = sk3SPlace(x, y, z, { ref: 8, vol: .8 }); if (!S) return; SK3F.stats.clang++;
    sk3STone(S, .22, 620 + Math.random() * 80, 430, 'square', .16); sk3STone(S, .3, 930 + Math.random() * 120, 700, 'triangle', .18); sk3SNoise(S, .12, 6000, 1500, 'bandpass', 1.2, .5, .002); if (pen) sk3SNoise(S, .4, 900, 120, 'lowpass', .7, .5, .004); }
function sk3SndRico(x, y, z) { const S = sk3SPlace(x, y, z, { ref: 8, vol: .75 }); if (!S) return; SK3F.stats.rico++; const f = 2300 + Math.random() * 900;
    sk3STone(S, .55, f, f * .32, 'sine', .3, .003); sk3STone(S, .5, f * 1.5, f * .5, 'sine', .08, .003); sk3SNoise(S, .08, 7000, 2000, 'bandpass', 1, .5, .002); }
function sk3SndWhiz(x, y, z) { const S = sk3SPlace(x, y, z, { ref: 5, vol: .8, nodelay: true }); if (!S) return; SK3F.stats.whiz++; sk3SNoise(S, .45, 3600, 700, 'bandpass', 3, .5, .02); sk3STone(S, .4, 1400, 500, 'sine', .07, .03); }
function sk3SndCollapse(x, y, z) { const S = sk3SPlace(x, y, z, { ref: 16, vol: 1, muf: 150 }); if (!S) return; SK3F.stats.collapse++; sk3SNoise(S, 3, 380, 50, 'lowpass', .8, .8, .05); sk3STone(S, 1.2, 50, 22, 'sine', .7, .02);
    for (let i = 0; i < 9; i++) { const S2 = { c: S.c, inp: S.inp, at: S.at + .1 + Math.random() * 2 }; sk3SNoise(S2, .15 + Math.random() * .2, 3000, 600, 'bandpass', 1.5, .3 * Math.random() + .1, .003); } }
function sk3SndDistant() { const c = sk3SCtx(); if (!c || !TK3.cam) return; const cam = TK3.cam.position, a = Math.random() * 6.28, d = 350 + Math.random() * 400, x = cam.x + Math.cos(a) * d, z = cam.z + Math.sin(a) * d;
    const S = sk3SPlace(x, 10, z, { ref: 60, vol: .55, max: 2000, muf: 260, nodelay: true }); if (!S) return;
    if (Math.random() < .6) { sk3SNoise(S, 1.6, 500, 50, 'lowpass', .7, .5, .02); sk3STone(S, 1.2, 55, 25, 'sine', .4, .02); }
    else for (let i = 0; i < 6 + Math.random() * 10; i++) { const S2 = { c: S.c, inp: S.inp, at: S.at + i * .085 }; sk3SNoise(S2, .06, 2400, 700, 'bandpass', 1.4, .35, .002); } }
// looping engine for another tank: two detuned saws, low-passed, placed on the tank
function sk3SEngine(tk) { const c = sk3SCtx(); if (!c) return null; let e = SK3S.eng.get(tk); if (e) return e; const out = sk3SOut(c), p = c.createPanner(); p.panningModel = 'HRTF'; p.distanceModel = 'inverse'; p.refDistance = 6; p.rolloffFactor = 1.3;
    const o1 = c.createOscillator(), o2 = c.createOscillator(), lp = c.createBiquadFilter(), g = c.createGain(); o1.type = o2.type = 'sawtooth'; lp.type = 'lowpass'; lp.frequency.value = 260; g.gain.value = 0; o1.connect(lp); o2.connect(lp); lp.connect(g); g.connect(p); p.connect(out); o1.start(); o2.start();
    e = { p: p, o1: o1, o2: o2, lp: lp, g: g, lx: tk.x, ly: tk.y, v: 0 }; SK3S.eng.set(tk, e); return e; }
function sk3SEngineStop(tk) { const e = SK3S.eng.get(tk); if (!e) return; const c = e.g.context, t = c.currentTime; e.g.gain.setTargetAtTime(0, t, .15); setTimeout(function () { try { e.o1.stop(); e.o2.stop(); e.p.disconnect(); } catch (x) {} }, 900); SK3S.eng.delete(tk); }
function sk3SStopAll() { SK3S.eng.forEach(function (e, tk) { sk3SEngineStop(tk); }); ['trk', 'tur'].forEach(function (k) { const n = SK3S[k]; if (n) { try { n.g.gain.value = 0; n.o.stop(); } catch (e) {} SK3S[k] = null; } }); }
function sk3SFrame(dt) { const c = sk3SCtx(); if (!c || !TK3.cam) return; sk3SOut(c); const L = c.listener, cam = TK3.cam, fw = new THREE.Vector3(); cam.getWorldDirection(fw); const t = c.currentTime;
    if (L.positionX) { L.positionX.setTargetAtTime(cam.position.x, t, .02); L.positionY.setTargetAtTime(cam.position.y, t, .02); L.positionZ.setTargetAtTime(cam.position.z, t, .02); L.forwardX.setTargetAtTime(fw.x, t, .02); L.forwardY.setTargetAtTime(fw.y, t, .02); L.forwardZ.setTargetAtTime(fw.z, t, .02); L.upX.value = 0; L.upY.value = 1; L.upZ.value = 0; }
    else { L.setPosition(cam.position.x, cam.position.y, cam.position.z); L.setOrientation(fw.x, fw.y, fw.z, 0, 1, 0); }
    // engines of the three nearest other tanks
    const others = [].concat(allies || [], enemies || []).filter(function (k) { return k && !k.destroyed; }).map(function (k) { return [k, Math.hypot(sk3X(k.x) - cam.position.x, sk3Z(k.y) - cam.position.z)]; }).filter(function (q) { return q[1] < 90; }).sort(function (a, b) { return a[1] - b[1]; }).slice(0, 3).map(function (q) { return q[0]; });
    SK3S.eng.forEach(function (e, tk) { if (others.indexOf(tk) < 0) sk3SEngineStop(tk); });
    others.forEach(function (tk) { const e = sk3SEngine(tk); if (!e) return; const sp = Math.hypot(tk.x - e.lx, tk.y - e.ly) / Math.max(dt, .001) * SK3D.S; e.lx = tk.x; e.ly = tk.y; e.v += (Math.min(12, sp) - e.v) * Math.min(1, dt * 4); const heavy = tk.className === 'HEAVY' ? -6 : tk.className === 'LIGHT' ? 7 : 0, base = 30 + heavy + e.v * 2.4, x = sk3X(tk.x), z = sk3Z(tk.y);
        if (e.p.positionX) { e.p.positionX.setTargetAtTime(x, t, .05); e.p.positionY.setTargetAtTime(1.2, t, .05); e.p.positionZ.setTargetAtTime(z, t, .05); } else e.p.setPosition(x, 1.2, z);
        e.o1.frequency.setTargetAtTime(base, t, .1); e.o2.frequency.setTargetAtTime(base * 2.02, t, .1); e.lp.frequency.setTargetAtTime(180 + e.v * 40, t, .1); e.g.gain.setTargetAtTime(.05 + e.v * .012, t, .1); });
    // your tracks clatter with speed, your turret whines while it traverses
    const out = sk3SOut(c), loop = function (k, type, f, fl) { let n = SK3S[k]; if (n) return n; const o = c.createOscillator(), b = c.createBiquadFilter(), g = c.createGain(); o.type = type; o.frequency.value = f; b.type = 'bandpass'; b.frequency.value = fl; b.Q.value = 2; g.gain.value = 0; o.connect(b); b.connect(g); g.connect(out); o.start(); n = SK3S[k] = { o: o, b: b, g: g }; return n; };
    const me = player, v = me && !me.destroyed ? Math.abs(me.skV || 0) * 60 * SK3D.S : 0, tr = loop('trk', 'square', 20, 900); tr.o.frequency.setTargetAtTime(6 + v * 3.2, t, .08); tr.g.gain.setTargetAtTime(Math.min(.09, v * .012), t, .08);
    const turn = me && !me.destroyed ? Math.abs(sk3Wrap((me.turretAngle || 0) - (SK3S.lastTur == null ? me.turretAngle || 0 : SK3S.lastTur))) / Math.max(dt, .001) : 0; SK3S.lastTur = me ? me.turretAngle : 0; const tw = loop('tur', 'sawtooth', 160, 420); tw.o.frequency.setTargetAtTime(150 + turn * 60, t, .05); tw.g.gain.setTargetAtTime(turn > .05 ? .028 : 0, t, .06);
    // a distant battle every few seconds
    const now = performance.now(); if (now > SK3S.lastAmb) { SK3S.lastAmb = now + 3500 + Math.random() * 6000; sk3SndDistant(); } }

/* ---------- visible damage on the 3D tanks ---------- */
function sk3DamageFx(st, t, dt) { const r = Math.random, now = Date.now();
    SK3D.models.forEach(function (m, tk) { if (m.dead || !tk || tk.destroyed) return; const cd = tk.componentDamage || {}, cb = tk.componentBroken || {}, hpk = tk.maxHealth ? tk.health / tk.maxHealth : 1; m.g.updateMatrixWorld(true); const sp = m.spec, top = sp.hull[0][1], back = sp.hull[0][2];
        const at = function (lx, ly, lz) { return m.g.localToWorld(new THREE.Vector3(lx, ly, lz)); };
        // engine: grey smoke when hurt, thick black smoke and flames when wrecked or burning
        const eng = Math.max(cd.engine || 0, cb.engine ? 100 : 0, tk.burning ? 100 : 0); if (eng > 30 || hpk < .35) { const p = at(back * .7, top + .1, 0), k = Math.max(eng / 100, (.35 - hpk) * 2.5), black = eng >= 100 || hpk < .2;
            if (r() < dt * (3 + k * 14)) st.smoke.emit({ x: p.x, y: p.y, z: p.z, vx: (r() - .5) * .6 + .5, vy: 1.6 + r() * 1.4, vz: (r() - .5) * .6, life: 3 + r() * 3, s0: .4, s1: 2.6 + k * 2, c0: black ? [.05, .045, .04, .7] : [.45, .44, .42, .35], c1: [.3, .29, .28, 0], drag: .6, rv: .3 });
            if ((tk.burning || eng >= 100) && r() < dt * 30) tk3Fire(st.fire, p.x, p.y, p.z, .55, dt, 18); }
        // a thrown track: that side's track is gone and the hull lists towards it
        const trk = cb.tracks || tk.tracksDisabled; if (trk !== m.trkGone) { m.trkGone = trk; if (m.tracks && m.tracks.length) { const side = (tk.name || '').length % 2; if (m.tracks[side]) m.tracks[side].visible = !trk; m.listSide = side ? 1 : -1; } if (trk) { const p = at(0, .4, 0); for (let i = 0; i < 18; i++) st.spark.emit({ x: p.x, y: p.y, z: p.z, vx: (r() - .5) * 6, vy: 2 + r() * 4, vz: (r() - .5) * 6, life: .4, len: .3, w: .04, c: [10, 6, 2, 1], g: 10, fade: 1 }); } }
        if (m.trkGone) m.g.rotation.x += (m.listSide || 1) * .045;
        // jammed turret ring: sparks and a wisp of smoke at the ring
        if ((cb.turret || (tk.turretDisabledUntil && now < tk.turretDisabledUntil)) && r() < dt * 6) { const p = at(sp.tur.x, top + .05, sp.tur.w * .5); st.spark.emit({ x: p.x, y: p.y, z: p.z, vx: (r() - .5) * 4, vy: 1 + r() * 3, vz: (r() - .5) * 4, life: .35, len: .25, w: .03, c: [12, 7, 3, 1], g: 9, fade: 1 }); st.smoke.emit({ x: p.x, y: p.y, z: p.z, vy: .8, life: 1.6, s0: .2, s1: 1, c0: [.5, .5, .5, .3], c1: [.5, .5, .5, 0] }); }
        // jammed gun: smoke curling out of the muzzle
        if ((tk.gunJammed || cb.gun) && r() < dt * 5) { try { const md = exMuzzle(m); st.smoke.emit({ x: md[0].x, y: md[0].y, z: md[0].z, vx: md[1].x * .4, vy: .7, vz: md[1].z * .4, life: 2, s0: .15, s1: .9, c0: [.55, .55, .55, .35], c1: [.6, .6, .6, 0], drag: .8 }); } catch (e) {} } }); }
// a scorched hole where a shell went into a tank (or a bright scar where it glanced off)
function sk3HoleOnTank(tk, wx, wz, glance) { const m = SK3D.models.get(tk); if (!m || m.dead) return; const sp = m.spec, h0 = sp.hull[0][0], h1 = sp.hull[0][1], x0 = sp.hull[0][2], x1 = sp.hull[0][3], hw = sp.wid / 2;
    m.g.updateMatrixWorld(true); const lp = m.g.worldToLocal(new THREE.Vector3(wx, (h0 + h1) / 2 * m.k, wz)); let lx = lp.x, lz = lp.z; const sx = lx > 0 ? x1 : -x0 < 0 ? x0 : x0, kx = Math.abs(lx) / Math.max(.01, Math.abs(lx > 0 ? x1 : x0)), kz = Math.abs(lz) / hw, k = Math.max(kx, kz, .01); lx /= k; lz /= k;
    const front = kx >= kz, ny = h0 + (h1 - h0) * (.3 + Math.random() * .45), g = new THREE.Group(); g.position.set(lx + (front ? Math.sign(lx) * .03 : 0), ny, lz + (front ? 0 : Math.sign(lz) * .03)); g.rotation.y = front ? (lx > 0 ? Math.PI / 2 : -Math.PI / 2) : (lz > 0 ? 0 : Math.PI);
    if (!glance) { const hole = new THREE.Mesh(new THREE.CircleGeometry(.11 + Math.random() * .05, 10), new THREE.MeshBasicMaterial({ color: 0x0a0806 })); hole.position.z = .012; g.add(hole); }
    const scar = new THREE.Mesh(new THREE.CircleGeometry(glance ? .2 : .3, 12), new THREE.MeshStandardMaterial({ color: glance ? 0x8a8a84 : 0x2a2420, roughness: .6, metalness: glance ? .6 : .1, transparent: true, opacity: .85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); if (glance) scar.scale.set(1.8, .5, 1); g.add(scar);
    m.body.add(g); m.holes = m.holes || []; m.holes.push(g); if (m.holes.length > 12) { const o = m.holes.shift(); m.body.remove(o); } SK3F.stats.holes++; }
function sk3TankNear(x2, y2, pad) { let best = null, bd = 1e9; [player].concat(allies || [], enemies || []).forEach(function (t) { if (!t || t.destroyed) return; const d = Math.hypot(t.x - x2, t.y - y2); if (d < (t.size || 24) * (pad || 1.7) && d < bd) { bd = d; best = t; } }); return best; }
// a hit on a tank at game point (x2, y2) with the 2D game's verdict text
// online: the host works out the verdict on a joiner's shell and sends it to that joiner only
function sk3SendMark(slot, mk) { try { const c = (DUEL.conns || []).find(function (q) { return q && q.slot === slot; }); if (c) duelSendTo(duelFastOf(c), { t: 'hm', tx: mk.text, col: mk.col }); } catch (e) {} }
function sk3ShowMark(m) { if (!m || !m.tx) return; if (SK3D.on && SK3F.marks) SK3F.marks.push({ text: m.tx, col: m.col || '#ffd27a', at: performance.now() }); else { try { if (player) hitTexts.push({ x: player.x, y: player.y - 60, text: m.tx, life: 80, maxLife: 80, color: m.col || '#ffd27a', size: 18, stroke: true, vy: .4 }); } catch (e) {} } }
function sk3TankHit(x2, y2, text) { const st = SK3D.st; if (!st) return; const tk = sk3TankNear(x2, y2), x = sk3X(x2), z = sk3Z(y2), y = (st.hgt ? st.hgt(x, z) : 0) + 1.3, rico = /RICOCHET/.test(text);
    if (tk) sk3HoleOnTank(tk, x, z, rico);
    if (rico) { sk3SndRico(x, y, z); const a = Math.random() * 6.28; st.trac.emit({ x: x, y: y, z: z, vx: Math.cos(a) * 60, vy: 18 + Math.random() * 20, vz: Math.sin(a) * 60, life: .3, len: 2.4, w: .07, c: [14, 10, 5, 1], fade: 1 }); for (let i = 0; i < 26; i++) { const b = a + (Math.random() - .5) * 1.2, v = 6 + Math.random() * 14; st.spark.emit({ x: x, y: y, z: z, vx: Math.cos(b) * v, vy: 2 + Math.random() * 8, vz: Math.sin(b) * v, life: .3 + Math.random() * .3, len: .5, w: .04, c: [14, 10, 5, 1], g: 9, fade: 1 }); } }
    else sk3SndClang(x, y, z, true);
    SK3F.texts.push({ x: x2, y: y2, text: text, at: performance.now() }); }

/* ---------- destructible cover ---------- */
function sk3ObHit(o, x2, y2, dmg) { if (!o || o.sk3gone || !SK3_HP[o.type]) return; o.sk3hp = (o.sk3hp == null ? SK3_HP[o.type] : o.sk3hp) - dmg; sk3ObHole(o, x2, y2);
    if (o.sk3hp <= 0) { sk3Collapse(o); if (typeof DUEL !== 'undefined' && DUEL.active && DUEL.role === 'host') duelBroadcast({ t: 'ob', i: obstacles.indexOf(o) }); }
    else if (typeof DUEL !== 'undefined' && DUEL.active && DUEL.role === 'host') duelBroadcast({ t: 'oh', i: obstacles.indexOf(o), x: Math.round(x2), y: Math.round(y2) }); }
// a shell hole in a wall where it struck, with brick showing round it and a puff of dust
function sk3ObHole(o, x2, y2) { const st = SK3D.st; if (!st || !o.sk3) return; const S = TK3.scene, dl = Math.abs(x2 - o.x), dr = Math.abs(o.x + o.width - x2), dt2 = Math.abs(y2 - o.y), db = Math.abs(o.y + o.height - y2), mn = Math.min(dl, dr, dt2, db);
    let x = sk3X(Math.max(o.x, Math.min(o.x + o.width, x2))), z = sk3Z(Math.max(o.y, Math.min(o.y + o.height, y2))), ry = 0; if (mn === dl) { x = sk3X(o.x) - .06; ry = Math.PI / 2; } else if (mn === dr) { x = sk3X(o.x + o.width) + .06; ry = Math.PI / 2; } else if (mn === dt2) z = sk3Z(o.y) - .06; else z = sk3Z(o.y + o.height) + .06;
    const tall = o.sk3.h || 3, y = Math.min(tall - .8, .9 + Math.random() * Math.min(4, tall)), soft = o.type === 'hedgerow' || o.type === 'sk3Sandbag', g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry;
    if (!soft) { const hole = new THREE.Mesh(new THREE.CircleGeometry(.7 + Math.random() * .5, 9), new THREE.MeshBasicMaterial({ color: 0x0c0a08 })); hole.position.z = .02; g.add(hole); const ring = new THREE.Mesh(new THREE.CircleGeometry(1.6 + Math.random() * .6, 9), new THREE.MeshStandardMaterial({ color: o.type === 'snowCabin' ? 0x3a2a1c : 0x8a5644, roughness: .95, polygonOffset: true, polygonOffsetFactor: -4 })); g.add(ring); S.add(g); o.sk3.decals.push(g); SK3F.decals.push(g); if (SK3F.decals.length > 260) { const old = SK3F.decals.shift(); S.remove(old); } }
    const dc = soft ? [.35, .3, .2] : [.62, .56, .5]; for (let i = 0; i < 16; i++) st.dust.emit({ x: x, y: y, z: z, vx: (Math.random() - .5) * 3, vy: Math.random() * 2, vz: (Math.random() - .5) * 3, life: 1.6 + Math.random(), s0: .6, s1: 2.6, c0: [dc[0], dc[1], dc[2], .55], c1: [dc[0], dc[1], dc[2], 0], drag: 1.6 });
    for (let i = 0; i < 8; i++) st.dust.emit({ x: x, y: y, z: z, vx: (Math.random() - .5) * 6, vy: 2 + Math.random() * 4, vz: (Math.random() - .5) * 6, life: 1, s0: .14, s1: .1, c0: [dc[0] * .6, dc[1] * .55, dc[2] * .5, 1], c1: [dc[0] * .6, dc[1] * .55, dc[2] * .5, 0], g: 12 }); }
function sk3Collapse(o) { if (!o || o.sk3gone) return; o.sk3gone = true; o.sk3was = o.type; o.type = 'sk3Rubble'; // no longer solid for tanks, shells and the AI
    try { navCache = { key: '', grids: {} }; } catch (e) {} SK3G.key = null;
    const st = SK3D.st; if (!st || !o.sk3) return; const S = TK3.scene, x = sk3X(o.x + o.width / 2), z = sk3Z(o.y + o.height / 2), w = o.width * SK3D.S, d = o.height * SK3D.S, h = o.sk3.h || 3, R = Math.random;
    // the building sinks and crumbles into a dust cloud over ~1.4 s
    SK3F.falling.push({ o: o, t0: performance.now(), h: h, ranges: o.sk3.ranges.map(function (q) { const pos = q.mesh.geometry.attributes.position, ys = new Float32Array(q.b - q.a); for (let i = q.a; i < q.b; i++) ys[i - q.a] = pos.getY(i); return { mesh: q.mesh, a: q.a, b: q.b, ys: ys }; }), groups: o.sk3.groups.slice() });
    o.sk3.decals.forEach(function (g) { S.remove(g); });
    if (o.sk3.tall) { const i = SK3D.tall.indexOf(o.sk3.tall); if (i >= 0) SK3D.tall.splice(i, 1); }
    const dc = o.sk3was === 'hedgerow' ? [.36, .32, .22] : [.6, .55, .48]; for (let i = 0; i < 70; i++) { const a = R() * 6.28, rr = R() * Math.max(w, d) * .5; st.dust.emit({ x: x + Math.cos(a) * rr, y: R() * h, z: z + Math.sin(a) * rr, vx: Math.cos(a) * (2 + R() * 4), vy: .5 + R() * 3, vz: Math.sin(a) * (2 + R() * 4), life: 4 + R() * 3, s0: 2, s1: 7 + R() * 5, c0: [dc[0], dc[1], dc[2], .6], c1: [dc[0], dc[1], dc[2], 0], drag: .9, fadeIn: .1 }); }
    for (let i = 0; i < 40; i++) st.dust.emit({ x: x + (R() - .5) * w, y: h * R(), z: z + (R() - .5) * d, vx: (R() - .5) * 8, vy: 3 + R() * 6, vz: (R() - .5) * 8, life: 1.4, s0: .25, s1: .2, c0: [.3, .26, .22, 1], c1: [.3, .26, .22, 0], g: 12 });
    // what's left: a rubble heap (and a stump of wall for buildings)
    const L = { ST: [], W: [] }; if (o.sk3was === 'hedgerow') { sk3Rubble(L, x, z, Math.min(Math.max(w, d) * .25, 3), R); } else { sk3Rubble(L, x, z, Math.max(1.5, Math.min(w, d) * .48), R); for (let k = 0; k < 4; k++) sk3Rubble(L, x + (R() - .5) * w * .8, z + (R() - .5) * d * .8, 1 + R() * 1.5, R); if (h > 4 && SK3D.mats) sk3Ruin(S, SK3D.mats.ruin, SK3D.mats.dark, x, z, w * .9, d * .9, 1.5 + R() * 2.5, 0, R); }
    if (SK3D.mats) { sk3Mesh(L.ST, SK3D.mats.plain, null); sk3Mesh(L.W, SK3D.mats.plain, null); }
    if (h > 4) st.fires.push([x + (R() - .5) * w * .3, .6, z + (R() - .5) * d * .3, 1 + R() * .6, 0, 1]);
    sk3SndCollapse(x, h * .4, z); if (player) { const dd = Math.hypot(sk3X(player.x) - x, sk3Z(player.y) - z); if (dd < 50) TK3.shake = Math.max(TK3.shake, .6 * (1 - dd / 50)); } }
function sk3Falling(dt) { for (let i = SK3F.falling.length - 1; i >= 0; i--) { const f = SK3F.falling[i], p = Math.min(1, (performance.now() - f.t0) / 1400), e = p * p;
        f.ranges.forEach(function (q) { const pos = q.mesh.geometry.attributes.position; for (let k = q.a; k < q.b; k++) { const y0 = q.ys[k - q.a]; pos.setY(k, p >= 1 ? -500 : y0 * (1 - e) - e * 3); } pos.needsUpdate = true; });
        f.groups.forEach(function (g) { g.position.y = -e * f.h; g.scale.y = Math.max(.05, 1 - e); if (p >= 1) TK3.scene.remove(g); });
        if (p >= 1) SK3F.falling.splice(i, 1); } }

/* ---------- HUD: hit markers, being-hit flash and direction ---------- */
function sk3FxHud() { const c = SK3D.hud; if (!c || !player) return; const g = c.getContext('2d'), now = performance.now();
    if (SK3F.hitFlash > 0) { const a = Math.min(.5, SK3F.hitFlash); const gr = g.createRadialGradient(550, 350, 200, 550, 350, 620); gr.addColorStop(0, 'rgba(160,0,0,0)'); gr.addColorStop(1, 'rgba(160,10,0,' + a + ')'); g.fillStyle = gr; g.fillRect(0, 0, 1100, 700); }
    if (SK3F.hitDir && now - SK3F.hitDir.at < 1600) { const rel = SK3F.hitDir.a - SK3D.yaw, a = Math.max(0, 1 - (now - SK3F.hitDir.at) / 1600); g.save(); g.translate(550, 350); g.rotate(rel + Math.PI / 2); g.strokeStyle = 'rgba(255,60,40,' + a + ')'; g.lineWidth = 7; g.beginPath(); g.arc(0, 0, 150, -Math.PI / 2 - .32, -Math.PI / 2 + .32); g.stroke(); g.fillStyle = 'rgba(255,60,40,' + a + ')'; g.beginPath(); g.moveTo(0, -172); g.lineTo(-11, -156); g.lineTo(11, -156); g.fill(); g.restore(); }
    SK3F.marks = SK3F.marks.filter(function (m) { return now - m.at < 1300; }); SK3F.marks.forEach(function (m, i) { const a = 1 - (now - m.at) / 1300; g.globalAlpha = a; g.textAlign = 'center'; g.font = 'bold 18px "Stardos Stencil", Impact, sans-serif'; g.fillStyle = m.col; g.shadowColor = '#000'; g.shadowBlur = 5; g.fillText(m.text, 550, 300 - i * 22 - (1 - a) * 14); g.shadowBlur = 0; g.globalAlpha = 1; });
    if (SK3F.marks.length && now - SK3F.marks[SK3F.marks.length - 1].at < 220) { g.strokeStyle = SK3F.marks[SK3F.marks.length - 1].col; g.lineWidth = 2.5; [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (d) { g.beginPath(); g.moveTo(550 + d[0] * 9, 350 + d[1] * 9); g.lineTo(550 + d[0] * 18, 350 + d[1] * 18); g.stroke(); }); } }

/* ---------- hooks ---------- */
(function () {
    // the 3D builder records which merged geometry belongs to each obstacle, so one house can be knocked down later
    const _mesh = sk3Mesh; sk3Mesh = function (list, mat, uv) { const offs = [0]; list.forEach(function (g, i) { offs.push(offs[i] + (g.index ? g.index.count : g.attributes.position.count)); }); const m = _mesh.apply(this, arguments); list.sk3mesh = m; list.sk3offs = offs; return m; };
    const _ruin = sk3Ruin; sk3Ruin = function () { const g = _ruin.apply(this, arguments); if (SK3F.groupLog) SK3F.groupLog.push(g); return g; };
    const _bw = sk3BuildWorld; sk3BuildWorld = function (st) { SK3F.decals = []; SK3F.falling = []; SK3F.track = []; const r = _bw.apply(this, arguments); SK3F.groupLog = null;
        // turn each obstacle's recorded list slices into vertex ranges in the merged meshes
        (SK3F.track || []).forEach(function (q) { const o = q.o, ranges = []; Object.keys(q.from).forEach(function (k) { const list = q.L[k], a = q.from[k], b = q.to[k]; if (b > a && list.sk3mesh && list.sk3offs) ranges.push({ mesh: list.sk3mesh, a: list.sk3offs[a], b: list.sk3offs[b] }); }); o.sk3 = { ranges: ranges, groups: q.groups, decals: [], h: q.h, tall: q.tall }; if (o.sk3gone) { o.sk3gone = false; sk3Collapse(o); } });
        SK3F.track = null; return r; };
    // a shell that strikes cover damages it (single player, and the host of an online battle)
    const _so = shellHitsObstacle; shellHitsObstacle = function (x1, y1, x2, y2) { const o = _so.apply(this, arguments); if (o && SK3F.inShells) { const sh = (shells || []).find(function (s) { return Math.abs(s.oldX - x1) < .01 && Math.abs(s.oldY - y1) < .01; }); SK3F.pend.push([o, x2, y2, sh ? (sh.damage || 30) * (sh.specialExplosion ? 2 : 1) : 30]); } return o; };
    const _us = updateShells; updateShells = function () { const live = SK3D.on && SK3D.ready && !(typeof DUEL !== 'undefined' && DUEL.active && DUEL.role !== 'host'); if (!live) { const r0 = _us.apply(this, arguments); if (SK3D.on && SK3D.ready) try { sk3Whistles(); } catch (e) {} return r0; }
        const dh = typeof DUEL !== 'undefined' && DUEL.active && DUEL.role === 'host', mine = (shells || []).filter(function (s) { return s.sk3mine || (dh && s.os != null && s.os !== DUEL.mySlot); }); SK3F.inShells = true; SK3F.pend = []; let r; try { r = _us.apply(this, arguments); } finally { SK3F.inShells = false; }
        SK3F.pend.forEach(function (q) { sk3ObHit(q[0], q[1], q[2], q[3]); }); try { sk3Whistles(); } catch (e) {}
        // your own shell that just landed: hit marker
        mine.forEach(function (s) { if ((shells || []).indexOf(s) >= 0) return; const tk = sk3TankNear(s.x + s.vx, s.y + s.vy, 2.2), own = s.sk3mine ? player : (DUEL.tanks || [])[s.os]; if (!tk || tk === own) return; const marks = s.sk3mine ? SK3F.marks : { push: function (mk) { sk3SendMark(s.os, mk); } }; const tx = SK3F.texts.filter(function (q) { return performance.now() - q.at < 120 && Math.hypot(q.x - s.x, q.y - s.y) < 90; }).pop(), txt = tx ? tx.text : '';
            marks.push(tk.destroyed ? { text: 'TARGET DESTROYED', col: '#ffb24a', at: performance.now() } : /RICOCHET/.test(txt) ? { text: 'RICOCHET', col: '#cfd8e0', at: performance.now() } : /NO PENETRATION/.test(txt) ? { text: 'NO PENETRATION', col: '#cfd8e0', at: performance.now() } : /HE BLAST/.test(txt) ? { text: 'HE BLAST · NO PENETRATION', col: '#ffb070', at: performance.now() } : /PENETRATED/.test(txt) ? { text: 'PENETRATED' + (/REAR/.test(txt) ? ' · REAR' : /SIDE/.test(txt) ? ' · SIDE' : ' · FRONT'), col: '#ff6a4a', at: performance.now() } : { text: 'HIT' + (/REAR/.test(txt) ? ' · REAR' : /SIDE/.test(txt) ? ' · SIDE' : /FRONT/.test(txt) ? ' · FRONT ARMOUR' : ''), col: '#ff6a4a', at: performance.now() }); });
        return r; };
    const _cs = createShell; createShell = function (tank) { const n = (shells || []).length, r = _cs.apply(this, arguments); if (tank === player) for (let k = n; k < shells.length; k++) shells[k].sk3mine = true; return r; };
    // the 2D game's verdict on each tank hit (ricochet / front / side / rear)
    const _ht = createHitText; createHitText = function (x, y, text) { const r = _ht.apply(this, arguments); if (SK3D.on && SK3D.ready && /RICOCHET|HIT|ARMOR/.test(String(text))) { try { sk3TankHit(x, y, String(text)); } catch (e) {} if (typeof DUEL !== 'undefined' && DUEL.active && DUEL.role === 'host') duelBroadcast({ t: 'th', x: Math.round(x), y: Math.round(y), k: /RICOCHET/.test(text) ? 1 : 0, tx: String(text).slice(0, 40) }); }
        else if (!SK3D.on && typeof DUEL !== 'undefined' && DUEL.active && DUEL.role === 'host' && text) duelBroadcast({ t: 'th', x: Math.round(x), y: Math.round(y), k: /RICOCHET/.test(text) ? 1 : 0, tx: String(text).slice(0, 40), d2: 1 }); return r; };
    // being hit: red flash + direction
    const _di = addDamageIndicator; addDamageIndicator = function (a) { const r = _di.apply(this, arguments); if (SK3D.on) { SK3F.hitDir = { a: a, at: performance.now() }; SK3F.hitFlash = .55; } return r; };
    // online: the host tells everyone about cover damage and tank hits
    if (typeof duelOnData === 'function') { const _od = duelOnData; duelOnData = function (m, c) { if (m && m.t === 'hm') { DUEL.lastRx = Date.now(); if (DUEL.role !== 'host') sk3ShowMark(m); return; } if (m && (m.t === 'ob' || m.t === 'oh' || m.t === 'th')) { DUEL.lastRx = Date.now(); if (c) c.lastRx = Date.now(); if (DUEL.role === 'host') return; const o = obstacles[m.i | 0];
                if (m.t === 'ob') { if (o) sk3Collapse(o); } else if (m.t === 'oh') { if (o && SK3D.ready) sk3ObHole(o, m.x, m.y); } else if (SK3D.on && SK3D.ready) { try { sk3TankHit(m.x, m.y, m.tx || (m.k ? 'RICOCHET!' : 'HIT')); } catch (e) {} } else if (m.tx) { try { _ht(m.x, m.y, m.tx); } catch (e) {} } return; } return _od.apply(this, arguments); }; }
    // positional sound replaces the flat 2D sounds while 3D is on
    const quiet = function () { return SK3D.on && SK3D.ready && !(typeof EXE !== 'undefined' && EXE.on); };
    ['playCannonSound', 'playImpactSound', 'playExplosionSound', 'playMGSound'].forEach(function (n) { if (typeof window[n] !== 'function') return; const f = window[n]; window[n] = function () { if (quiet()) return; return f.apply(this, arguments); }; });
    const _mz = sk3Muzzle; sk3Muzzle = function (t) { const r = _mz.apply(this, arguments); try { const m = SK3D.models.get(t); if (m) { const md = exMuzzle(m); sk3SndCannon(md[0].x, md[0].y, md[0].z, t === player, t.className === 'HEAVY'); } } catch (e) {} return r; };
    const _bm = sk3Boom; sk3Boom = function (x2, y2, s) { const r = _bm.apply(this, arguments); try { const x = sk3X(x2), z = sk3Z(y2); sk3SndBoom(x, (SK3D.st && SK3D.st.hgt ? SK3D.st.hgt(x, z) : 0) + 1, z, s); } catch (e) {} return r; };
    const _sp = sk3Sparks; sk3Sparks = function (x2, y2) { const r = _sp.apply(this, arguments); try { if (!SK3D.ready) return r; const x = sk3X(x2), z = sk3Z(y2); sk3SndClang(x, 1.3, z, false); } catch (e) {} return r; };
    const _ip = sk3Impact; sk3Impact = function (st, x, z) { const r = _ip.apply(this, arguments); try { sk3SndBoom(x, (st.hgt ? st.hgt(x, z) : 0) + .5, z, .55); } catch (e) {} return r; };
    // every 3D frame: falling buildings, tank damage, shell whistles, sound
    const sc = TK3.list[SK3D.idx], _up = sc.update; sc.update = function (st, t, dt) { const r = _up.apply(this, arguments); try { sk3Falling(dt); sk3DamageFx(st, t, dt); SK3F.hitFlash = Math.max(0, SK3F.hitFlash - dt * 1.2); sk3SFrame(dt); } catch (e) { SK3F.err = e; } return r; };
    const _hud = sk3Hud; sk3Hud = function () { const r = _hud.apply(this, arguments); try { sk3FxHud(); } catch (e) {} return r; };
    const _stop = sk3Stop; sk3Stop = function () { try { sk3SStopAll(); } catch (e) {} SK3F.marks = []; SK3F.hitDir = null; return _stop.apply(this, arguments); };
})();
// shells that pass close by whistle (not your own)
function sk3Whistles() { const cam = TK3.cam && TK3.cam.position; if (!cam) return; (shells || []).forEach(function (s) { if (s.sk3mine || SK3S.whizzed.has(s)) return; const x = sk3X(s.x), z = sk3Z(s.y), prev = SK3S.shDist.get(s); SK3S.shDist.set(s, [x, z]); if (!prev) return;
    // closest the shell came to the listener since last frame (works even when it moves 30 m per frame)
    const dx = x - prev[0], dz = z - prev[1], L2 = dx * dx + dz * dz || 1, u = Math.max(0, Math.min(1, ((cam.x - prev[0]) * dx + (cam.z - prev[1]) * dz) / L2)), px = prev[0] + dx * u, pz = prev[1] + dz * u;
    if (u < 1 && Math.hypot(px - cam.x, pz - cam.z) < 14) { SK3S.whizzed.add(s); sk3SndWhiz(px, 1.8, pz); } }); }
