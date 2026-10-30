
// ===== Battle FX: real fireballs, shockwaves, sparks, scorch marks, soft smoke, tracers, dynamic lighting, glass HUD =====
const BFX = { sparks: [], scorch: [], spr: {}, lc: null, lg: null, on: true };
function bfxSprite(name, size, draw) { if (BFX.spr[name]) return BFX.spr[name]; const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size); BFX.spr[name] = c; return c; }
function bfxGlow() { return bfxSprite('glow', 128, function (g, S) { const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.55)'); gr.addColorStop(.6, 'rgba(255,255,255,.15)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, S, S); }); }
function bfxFire() { return bfxSprite('fire', 128, function (g, S) { const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2); gr.addColorStop(0, 'rgba(255,250,225,1)'); gr.addColorStop(.22, 'rgba(255,214,110,.95)'); gr.addColorStop(.5, 'rgba(240,120,35,.75)'); gr.addColorStop(.78, 'rgba(160,50,15,.3)'); gr.addColorStop(1, 'rgba(90,20,5,0)'); g.fillStyle = gr; g.fillRect(0, 0, S, S); }); }
function bfxPuff(col) { return bfxSprite('puff' + col, 128, function (g, S) { for (let i = 0; i < 22; i++) { const a = Math.random() * 6.28, r = Math.random() * S * .22, x = S / 2 + Math.cos(a) * r, y = S / 2 + Math.sin(a) * r, rr = S * (.14 + Math.random() * .16); const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, col.replace('A', .32)); gr.addColorStop(1, col.replace('A', 0)); g.fillStyle = gr; g.fillRect(0, 0, S, S); } }); }
function bfxScorchSpr(k) { return bfxSprite('scorch' + k, 128, function (g, S) { const c = S / 2; let gr = g.createRadialGradient(c, c, 0, c, c, c); gr.addColorStop(0, 'rgba(12,10,8,.75)'); gr.addColorStop(.45, 'rgba(22,18,14,.5)'); gr.addColorStop(1, 'rgba(30,26,20,0)'); g.fillStyle = gr; g.fillRect(0, 0, S, S);
        g.strokeStyle = 'rgba(14,12,9,.45)'; for (let i = 0; i < 18; i++) { const a = i / 18 * 6.28 + Math.random() * .3, r0 = S * .12, r1 = S * (.3 + Math.random() * .2); g.lineWidth = 1 + Math.random() * 3; g.beginPath(); g.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0); g.lineTo(c + Math.cos(a) * r1, c + Math.sin(a) * r1); g.stroke(); }
        g.fillStyle = 'rgba(70,60,48,.35)'; for (let i = 0; i < 26; i++) { const a = Math.random() * 6.28, r = S * (.2 + Math.random() * .25); g.fillRect(c + Math.cos(a) * r, c + Math.sin(a) * r, 2 + Math.random() * 3, 2 + Math.random() * 3); } }); }
function bfxRnd(seed) { let s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function bfxView() { if ((selectedGameMode === 'skirmish' || selectedGameMode === 'pointControl') && typeof SKIRMISH_VIEW_WIDTH !== 'undefined') return [cameraX || 0, cameraY || 0, SKIRMISH_VIEW_WIDTH, SKIRMISH_VIEW_HEIGHT]; return [0, 0, canvas.width, canvas.height]; }
(function () {
    // ---- explosions get debris sparks + a scorch mark ----
    const _ce = createExplosion; createExplosion = function (x, y, strength) { const s = strength == null ? 1 : strength; const r = _ce.apply(this, arguments); try { const e = explosions[explosions.length - 1]; if (e) e.seed = (Math.random() * 1e9) | 0;
            for (let i = 0; i < 4 + 8 * s; i++) { const a = Math.random() * 6.28, v = 4 + Math.random() * 8 * s; BFX.sparks.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 14 + Math.random() * 16, max: 30 }); }
            if (BFX.sparks.length > 400) BFX.sparks.splice(0, BFX.sparks.length - 400);
            if (s >= .6) { BFX.scorch.push({ x: x, y: y, r: 22 + 20 * s, a: Math.random() * 6.28, k: (Math.random() * 3) | 0, t: performance.now() }); if (BFX.scorch.length > 70) BFX.scorch.shift(); } } catch (e) {} return r; };
    // ---- the fireball itself ----
    drawExplosions = function () { const G = bfxGlow(), F = bfxFire(), P = bfxPuff('rgba(40,36,32,A)'); explosions.forEach(function (e) { const p = 1 - e.life / e.maxLife, s = e.strength || 1, R = bfxRnd(e.seed || 7); ctx.save();
            // ground light + white flash
            ctx.globalCompositeOperation = 'lighter'; const big = Math.min(1, Math.max(0, (s - .5) / .7)), crowd = Math.min(1, 6 / Math.max(1, explosions.length)); const fl = Math.max(0, 1 - p / .22) * big * crowd; if (fl > 0) { const z = 150 * s * (1 + p); ctx.globalAlpha = fl * .55; ctx.drawImage(G, e.x - z / 2, e.y - z / 2, z, z); }
            ctx.globalCompositeOperation = 'source-over'; const gz = 200 * s; ctx.globalAlpha = (1 - p) * .12 * crowd; ctx.drawImage(F, e.x - gz / 2, e.y - gz / 2, gz, gz);
            // fireball lobes
            const n = 6; for (let i = 0; i < n; i++) { const a = R() * 6.28, d = (6 + R() * 22) * s * Math.min(1, p * 3), rr = (11 + R() * 10) * s * (.6 + p * 1.0); const al = Math.max(0, 1 - p * 1.5); if (al <= 0) break; ctx.globalAlpha = al * (.45 + .4 * crowd); ctx.drawImage(F, e.x + Math.cos(a) * d - rr, e.y + Math.sin(a) * d - rr, rr * 2, rr * 2); }
            // shockwave ring
            if (p < .5 && big > 0) { ctx.globalCompositeOperation = 'source-over'; const rr = 10 + p / .5 * 70 * s; ctx.globalAlpha = (1 - p / .5) * .4 * big * crowd; ctx.strokeStyle = 'rgba(255,236,200,1)'; ctx.lineWidth = Math.max(1, 7 * s * (1 - p / .55)); ctx.beginPath(); ctx.arc(e.x, e.y, rr, 0, 6.29); ctx.stroke(); }
            // rolling smoke taking over
            ctx.globalCompositeOperation = 'source-over'; if (p > .25) { for (let i = 0; i < 4; i++) { const a = R() * 6.28, d = (10 + R() * 18) * s * p, rr = (22 + R() * 18) * s * (.5 + p); ctx.globalAlpha = Math.min(1, (p - .25) * 2.2) * (1 - p) * 1.2; ctx.drawImage(P, e.x + Math.cos(a) * d - rr, e.y + Math.sin(a) * d - rr, rr * 2, rr * 2); } }
            ctx.restore(); });
        // sparks
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; for (let i = BFX.sparks.length - 1; i >= 0; i--) { const q = BFX.sparks[i]; q.x += q.vx; q.y += q.vy; q.vx *= .9; q.vy *= .9; q.life--; if (q.life <= 0) { BFX.sparks.splice(i, 1); continue; } const k = q.life / q.max; ctx.strokeStyle = 'rgba(255,' + (180 + 70 * k | 0) + ',' + (90 * k | 0) + ',' + Math.min(1, k * 1.6) + ')'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(q.x - q.vx * 2.2, q.y - q.vy * 2.2); ctx.stroke(); } ctx.restore(); };
    // ---- scorch marks under the tracks ----
    const _dt = drawTrackMarks; drawTrackMarks = function () { const now = performance.now(); ctx.save(); BFX.scorch.forEach(function (s) { const age = (now - s.t) / 1000, al = Math.max(0, 1 - Math.max(0, age - 40) / 20); if (al <= 0) return; ctx.save(); ctx.globalAlpha = al * .85; ctx.translate(s.x, s.y); ctx.rotate(s.a); ctx.drawImage(bfxScorchSpr(s.k), -s.r, -s.r, s.r * 2, s.r * 2); ctx.restore(); }); ctx.restore(); return _dt.apply(this, arguments); };
    // ---- soft smoke ----
    drawSmoke = function () { const P = bfxPuff('rgba(38,40,36,A)'); ctx.save(); smokeParticles.forEach(function (sm) { if (sm.rot == null) { sm.rot = Math.random() * 6.28; sm.life0 = sm.life; } const age = 1 - sm.life / (sm.life0 || 80), z = sm.size * (2.2 + age * 1.4); ctx.globalAlpha = Math.min(.75, sm.life / 70); ctx.translate(sm.x, sm.y); ctx.rotate(sm.rot + age * .6); ctx.drawImage(P, -z / 2, -z / 2, z, z); ctx.rotate(-(sm.rot + age * .6)); ctx.translate(-sm.x, -sm.y); }); ctx.restore(); };
    // ---- glowing fire particles ----
    drawFireParticles = function () { const F = bfxFire(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; fireParticles.forEach(function (pt) { const a = Math.min(1, pt.life / 15); if (pt.type === 'spark') { ctx.globalAlpha = a; ctx.fillStyle = '#fff0a0'; ctx.fillRect(pt.x, pt.y, pt.size, pt.size); return; } const z = pt.size * 1.9; ctx.globalAlpha = a * .32; ctx.drawImage(F, pt.x - z / 2, pt.y - z / 2, z, z); }); ctx.restore(); };
    // ---- shell tracers ----
    const _ds = drawShells; drawShells = function () { const r = _ds.apply(this, arguments); const G = bfxGlow(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; shells.forEach(function (s) { const vx = s.vx || 0, vy = s.vy || 0; const gr = ctx.createLinearGradient(s.x - vx * 2.4, s.y - vy * 2.4, s.x, s.y); gr.addColorStop(0, 'rgba(255,160,60,0)'); gr.addColorStop(1, 'rgba(255,230,160,.9)'); ctx.strokeStyle = gr; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(s.x - vx * 2.4, s.y - vy * 2.4); ctx.lineTo(s.x, s.y); ctx.stroke(); ctx.globalAlpha = .35; ctx.drawImage(G, s.x - 10, s.y - 10, 20, 20); ctx.globalAlpha = 1; }); ctx.restore(); return r; };
    // ---- lighting: darken a touch, let fire / flashes / explosions light the ground ----
    const AMB = { town: .26, trenches: .22, snow: .12, bocage: .24 };
    const _dm = drawMuzzleFlashes; drawMuzzleFlashes = function () { const r = _dm.apply(this, arguments); try { bfxLight(); } catch (e) { BFX.err = e; } return r; };
    function bfxLight() { if (!BFX.on || !gameRunning || typeof m8IsLarge === 'function' && m8IsLarge()) return; if (selectedGameMode !== 'skirmish' && selectedGameMode !== 'pointControl') return;
        const V = bfxView(), K = .5, W = Math.ceil(V[2] * K), H = Math.ceil(V[3] * K); if (!BFX.lc) { BFX.lc = document.createElement('canvas'); BFX.lg = BFX.lc.getContext('2d'); } if (BFX.lc.width !== W || BFX.lc.height !== H) { BFX.lc.width = W; BFX.lc.height = H; }
        const g = BFX.lg, G = bfxGlow(), A = AMB[selectedMap] == null ? .22 : AMB[selectedMap]; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H); g.fillStyle = 'rgba(10,14,26,' + A + ')'; g.fillRect(0, 0, W, H);
        const L = []; const add = function (x, y, rad, k, col) { if (x < V[0] - rad || x > V[0] + V[2] + rad || y < V[1] - rad || y > V[1] + V[3] + rad) return; L.push([x, y, rad, k, col]); };
        explosions.forEach(function (e) { const p = 1 - e.life / e.maxLife; add(e.x, e.y, 260 * (e.strength || 1), (1 - p), '255,160,70'); });
        muzzleFlashes.forEach(function (f) { add(f.x, f.y, 150, f.life / (f.maxLife || 6), '255,200,110'); });
        for (let i = 0; i < fireParticles.length; i += 5) { const p = fireParticles[i]; add(p.x, p.y, 70, Math.min(1, p.life / 20) * .6, '255,140,50'); }
        const tk = [player].concat(enemies, allies); const t = performance.now() / 1000; tk.forEach(function (q, i) { if (q && q.burning) add(q.x, q.y, 150, .7 + .25 * Math.sin(t * 13 + i * 3), '255,130,40'); });
        (typeof wrecks !== 'undefined' ? wrecks : []).forEach(function (w, i) { if (w && w.life > 300) add(w.x, w.y, 110, .35 + .12 * Math.sin(t * 9 + i), '255,120,40'); });
        shells.forEach(function (s) { add(s.x, s.y, 60, .5, '255,210,140'); });
        (typeof flameEffects !== 'undefined' ? flameEffects : []).forEach(function (f) { if (f.source) add(f.source.x + Math.cos(f.angle || 0) * 80, f.source.y + Math.sin(f.angle || 0) * 80, 200, .8, '255,140,40'); });
        g.globalCompositeOperation = 'destination-out'; L.forEach(function (l) { const z = l[2] * 2 * K; g.globalAlpha = Math.min(1, l[3]); g.drawImage(G, (l[0] - V[0]) * K - z / 2, (l[1] - V[1]) * K - z / 2, z, z); }); g.globalAlpha = 1;
        // vignette
        g.globalCompositeOperation = 'source-over'; const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.42)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
        ctx.save(); ctx.globalAlpha = 1; ctx.drawImage(BFX.lc, V[0], V[1], V[2], V[3]);
        // warm light spill
        ctx.globalCompositeOperation = 'lighter'; L.forEach(function (l) { if (l[2] < 100) return; const z = l[2] * 1.3; ctx.globalAlpha = Math.min(1, l[3]) * .12; ctx.drawImage(bfxTint(l[4]), l[0] - z / 2, l[1] - z / 2, z, z); }); ctx.restore(); }
    function bfxTint(col) { return bfxSprite('t' + col, 128, function (g, S) { const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2); gr.addColorStop(0, 'rgba(' + col + ',1)'); gr.addColorStop(.4, 'rgba(' + col + ',.35)'); gr.addColorStop(1, 'rgba(' + col + ',0)'); g.fillStyle = gr; g.fillRect(0, 0, S, S); }); }
    // clear decals between battles
    if (typeof startGame === 'function') { const _sg = startGame; startGame = function () { BFX.sparks.length = 0; BFX.scorch.length = 0; return _sg.apply(this, arguments); }; }
    // ---- battle HUD in the same dark-glass style as the menus ----
    setInterval(function () { document.body.classList.toggle('inbattle', !!(typeof gameRunning !== 'undefined' && gameRunning)); }, 200);
    const st = document.createElement('style'); st.textContent =
        'body.inbattle{background:radial-gradient(ellipse at 50% 30%,#1a1d14,#070806 75%) fixed !important;}' +
        'body.inbattle h1{background:linear-gradient(180deg,rgba(0,0,0,.6),rgba(0,0,0,0)) !important;border-bottom:0 !important;box-shadow:none !important;font-size:30px !important;letter-spacing:.3em !important;padding:10px 16px 4px !important;text-shadow:0 3px 18px rgba(0,0,0,.7) !important;}body.inbattle h1::before,body.inbattle h1::after{display:none !important;}' +
        'body.inbattle #gameInfo .infoBox,body.inbattle #pointScoreBar{background:linear-gradient(180deg,rgba(30,32,22,.88),rgba(12,14,9,.88)) !important;border:1px solid rgba(232,200,120,.3) !important;border-radius:8px !important;box-shadow:0 6px 18px rgba(0,0,0,.45) !important;transform:none !important;color:rgba(239,230,200,.75) !important;letter-spacing:.12em;}' +
        'body.inbattle #gameInfo .infoBox span,body.inbattle #pointScoreBar span{color:#ffd27a !important;}body.inbattle #abilityStatus{border-color:rgba(160,230,140,.45) !important;}' +
        'body.inbattle #battleMessage{color:#f6eed4 !important;letter-spacing:.4em !important;text-shadow:0 2px 14px rgba(255,170,80,.35) !important;}' +
        'body.inbattle #canvasViewport{border-radius:10px;box-shadow:0 0 0 1px rgba(232,200,120,.3),0 20px 60px rgba(0,0,0,.7) !important;}' +
        'body.inbattle #radioText{background:rgba(12,14,9,.9) !important;border:1px solid rgba(232,200,120,.35) !important;border-radius:8px !important;}';
    document.head.appendChild(st);
})();
