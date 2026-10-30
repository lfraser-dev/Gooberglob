/* =====================================================
   MISSION 8 - ENDING CINEMATIC: the exploder, the chain of charges, Gustav dies
===================================================== */
const M8END = { dur: 14.2, cuts: [2.7, 10.6] };
function m8EndOnce(k, cond, fn) { M8END.fired = M8END.fired || {}; if (cond && !M8END.fired[k]) { M8END.fired[k] = 1; try { fn(); } catch (e) {} } }
function m8PlayEnding(done) {
    M8END.start = performance.now(); M8END.fired = {}; M8END.done = done; M8END.running = true;
    canvas.style.cursor = 'pointer';
    const skip = function (e) { if (!M8END.running) return; if (e.type === 'keydown' && e.code !== 'Space' && e.code !== 'Enter' && e.code !== 'Escape') return; if (performance.now() - M8END.start < 800) return; m8EndFinish(); };
    M8END.skip = skip; window.addEventListener('keydown', skip); canvas.addEventListener('mousedown', skip);
    if (!CS2.grain) CS2.grain = cs2Grain();
    cancelAnimationFrame(M8END.raf); M8END.raf = requestAnimationFrame(m8EndFrame);
}
function m8EndFinish() { if (!M8END.running) return; M8END.running = false; cancelAnimationFrame(M8END.raf); window.removeEventListener('keydown', M8END.skip); canvas.removeEventListener('mousedown', M8END.skip); canvas.style.cursor = ''; const d = M8END.done; M8END.done = null; if (d) d(); }
function m8EndFrame(now) {
    if (!M8END.running) return;
    const t = (now - M8END.start) / 1000, w = canvas.width, h = canvas.height; let flash = 0;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    try { const U = w / 1600, hv = h / U; ctx.save(); ctx.scale(U, U); if (t < M8END.cuts[0]) flash = m8EndShotA(t, hv); else flash = m8EndShotB(t - M8END.cuts[0], hv, t); ctx.restore(); ddpBloom(w, h); } catch (e) { DDP.err = e; console.error(e); ctx.setTransform(1, 0, 0, 1, 0, 0); }
    ctx.save(); ctx.globalAlpha = .08; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    const vg = ctx.createRadialGradient(w / 2, h * .52, w * .24, w / 2, h * .52, w * .74); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    const cd = t - M8END.cuts[0]; if (cd >= 0 && cd < .25) flash = Math.max(flash, 1 - cd / .25);
    if (flash > 0) { ctx.fillStyle = 'rgba(255,240,210,' + Math.min(.95, flash) + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = Math.round(h * .07); ctx.fillStyle = '#050605'; ctx.fillRect(0, 0, w, bar); ctx.fillRect(0, h - bar - 22, w, bar + 22);
    const caps = [[.35, 'SGT. HOLLIS: "ALL CLEAR, SIR. SHE\'S ALL YOURS."'], [1.75, '"NOW."'], [3.3, 'FOUR CHARGES.'], [5.0, 'ONE GUN.'], [7.4, 'THE BEACH WILL SLEEP TONIGHT.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; });
    if (ci >= 0 && t < M8END.cuts[1]) { const c = caps[ci], n = Math.min(c[1].length, Math.floor((t - c[0]) * 34)); ctx.textAlign = 'center'; ctx.fillStyle = '#efe6c6'; ctx.font = '700 16px "Special Elite", "Courier New", monospace'; ctx.fillText(c[1].slice(0, n) + (n < c[1].length && Math.floor(t * 3) % 2 ? '▌' : ''), w / 2, h - bar - 22 + bar * .62 + 4); }
    if (t > M8END.cuts[1]) m8EndCard(t - M8END.cuts[1], w, h);
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8);
    const fa = Math.max(1 - t / .6, (t - (M8END.dur - .8)) / .8); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + Math.min(1, fa) + ')'; ctx.fillRect(0, 0, w, h); }
    ctx.restore();
    if (t >= M8END.dur) { m8EndFinish(); return; }
    M8END.raf = requestAnimationFrame(m8EndFrame);
}

/* ---- shot A: the exploder in the treeline ---- */
function m8EndShotA(t, hv) {
    const push = cs2E(cs2C((t - 1.9) / .22, 0, 1)), pd = t - 2.12, sh = ddpShakeAt(t, pd > 0 ? 6 * Math.max(0, 1 - pd / .5) : .2);
    m8EndOnce('creak', t > 1.85, function () { playTone(160, 90, .25, .06, 'square'); });
    m8EndOnce('click', pd > 0, function () { playTone(1800, 900, .05, .06, 'square'); });
    ctx.save(); ddpCam(hv, sh[0] - 10, sh[1] - 80, 1.42 + t * .04, 0);
    // forest floor at night
    const g = ctx.createLinearGradient(0, 0, 0, hv); g.addColorStop(0, '#0a0e0a'); g.addColorStop(.5, '#141a12'); g.addColorStop(1, '#1e2418'); ctx.fillStyle = g; ctx.fillRect(-800, -400, 3200, hv + 800);
    for (let i = 0; i < 160; i++) { const x = ddpR(i * 3.3) * 1900 - 150, y = ddpR(i * 5.7) * hv, r = 6 + ddpR(i + 1) * 22; ctx.fillStyle = ['rgba(60,70,40,.5)', 'rgba(80,60,34,.45)', 'rgba(20,26,16,.6)', 'rgba(110,100,60,.25)'][i % 4]; ctx.beginPath(); ctx.ellipse(x, y, r, r * .45, ddpR(i) * 3, 0, 7); ctx.fill(); }
    for (let i = 0; i < 30; i++) { const x = ddpR(i + 77) * 1800 - 100, y = ddpR(i + 99) * hv; ctx.strokeStyle = 'rgba(40,30,18,.7)'; ctx.lineWidth = 2 + ddpR(i) * 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 30 + ddpR(i + 4) * 60, y + (ddpR(i + 5) - .5) * 30); ctx.stroke(); }
    // cables away to the gun
    ctx.lineCap = 'round'; [[0, '#1a1410'], [14, '#2a1c10']].forEach(function (c) { ctx.strokeStyle = c[1]; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(960 + c[0], hv * .5); ctx.bezierCurveTo(1100, hv * .44 + c[0], 1300, hv * .62, 1900, hv * .4 + c[0]); ctx.stroke(); ctx.strokeStyle = 'rgba(150,170,210,.18)'; ctx.lineWidth = 1.4; ctx.stroke(); });
    // the exploder: wooden dynamo box
    const bx = 600, by = hv * .42, bw = 380, bh = 230;
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.beginPath(); ctx.ellipse(bx + bw / 2 + 30, by + bh + 10, bw * .62, 26, 0, 0, 7); ctx.fill();
    const wg = ctx.createLinearGradient(bx, by, bx + bw, by + bh); wg.addColorStop(0, '#7a5230'); wg.addColorStop(.5, '#5a3a20'); wg.addColorStop(1, '#2a1a0c'); ctx.fillStyle = wg; ctx.fillRect(bx, by, bw, bh);
    ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip(); ctx.strokeStyle = 'rgba(30,16,6,.45)'; ctx.lineWidth = 1; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.moveTo(bx, by + 10 + i * 16); for (let x = bx; x < bx + bw; x += 20) ctx.quadraticCurveTo(x + 10, by + 10 + i * 16 + Math.sin(x * .05 + i) * 3, x + 20, by + 10 + i * 16 + Math.sin(x * .03 + i) * 2); ctx.stroke(); } ctx.restore();
    ctx.fillStyle = 'rgba(160,190,240,.18)'; ctx.fillRect(bx, by, bw, 6); ctx.fillRect(bx, by, 6, bh);
    [[bx, by], [bx + bw - 26, by], [bx, by + bh - 26], [bx + bw - 26, by + bh - 26]].forEach(function (p) { ctx.fillStyle = '#9a7a3a'; ctx.fillRect(p[0], p[1], 26, 26); ctx.fillStyle = 'rgba(255,230,160,.35)'; ctx.fillRect(p[0], p[1], 26, 3); ctx.fillStyle = '#3a2a10'; [[6, 6], [20, 6], [6, 20], [20, 20]].forEach(function (q) { ctx.beginPath(); ctx.arc(p[0] + q[0], p[1] + q[1], 2, 0, 7); ctx.fill(); }); });
    ctx.fillStyle = '#c8b070'; ctx.fillRect(bx + 80, by + 120, 220, 60); ctx.strokeStyle = '#3a2a10'; ctx.lineWidth = 2; ctx.strokeRect(bx + 80, by + 120, 220, 60); ctx.fillStyle = '#2a1e0c'; ctx.textAlign = 'center'; ctx.font = '700 20px "Stardos Stencil", Impact'; ctx.fillText('EXPLODER, DYNAMO', bx + 190, by + 148); ctx.font = '700 15px monospace'; ctx.fillText('Mk VII · No. 2 CDO', bx + 190, by + 170);
    // terminals
    [bx + bw - 70, bx + bw - 34].forEach(function (x, i) { ctx.fillStyle = '#2a2016'; ctx.fillRect(x - 10, by - 14, 20, 16); const gg = ctx.createRadialGradient(x - 3, by - 22, 1, x, by - 18, 11); gg.addColorStop(0, '#ffe6a0'); gg.addColorStop(1, '#8a6420'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, by - 18, 10, 0, 7); ctx.fill(); });
    // plunger rod + T handle
    const rodTop = by - 180 + push * 160, rx = bx + 150;
    ctx.fillStyle = '#4a4e52'; ctx.fillRect(rx - 7, rodTop, 14, by - rodTop); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(rx - 4, rodTop, 3, by - rodTop); ctx.fillStyle = '#2a2016'; ctx.fillRect(rx - 26, by - 8, 52, 10);
    const tg = ctx.createLinearGradient(0, rodTop - 24, 0, rodTop + 4); tg.addColorStop(0, '#9a6a3a'); tg.addColorStop(1, '#4a2a10'); ctx.fillStyle = tg; ctx.beginPath(); ctx.roundRect(rx - 130, rodTop - 26, 260, 28, 12); ctx.fill(); ctx.fillStyle = 'rgba(255,220,170,.25)'; ctx.fillRect(rx - 120, rodTop - 24, 240, 4);
    // two gloved hands + smock sleeves from above
    [-1, 1].forEach(function (sd) { const hx = rx + sd * 84, hy = rodTop - 12, ex = hx + sd * 300, ey = hy - 330;
        ctx.save(); const ag = ctx.createLinearGradient(hx, hy, ex, ey); ag.addColorStop(0, '#3e3c24'); ag.addColorStop(1, '#16160e'); ctx.fillStyle = ag; ctx.beginPath(); ctx.moveTo(hx - 30, hy - 18); ctx.lineTo(hx + 30, hy - 18); ctx.lineTo(ex + 70, ey); ctx.lineTo(ex - 70, ey); ctx.closePath(); ctx.fill(); ctx.clip(); ctx.fillStyle = 'rgba(110,70,34,.55)'; for (let i = 0; i < 14; i++) { const q = ddpR(i + sd * 13); ctx.beginPath(); ctx.ellipse(hx + (ex - hx) * q + (ddpR(i + 3) - .5) * 60, hy + (ey - hy) * q, 22, 9, ddpR(i) * 3, 0, 7); ctx.fill(); } ctx.fillStyle = 'rgba(60,80,40,.5)'; for (let i = 0; i < 10; i++) { const q = ddpR(i + sd * 29); ctx.beginPath(); ctx.ellipse(hx + (ex - hx) * q + (ddpR(i + 7) - .5) * 60, hy + (ey - hy) * q, 18, 8, ddpR(i + 1) * 3, 0, 7); ctx.fill(); } ctx.restore();
        ctx.fillStyle = '#3a3824'; ctx.beginPath(); ctx.ellipse(hx + sd * 10, hy - 22, 36, 14, sd * -.5, 0, 7); ctx.fill();
        ctx.fillStyle = '#16120e'; ctx.beginPath(); ctx.roundRect(hx - 34, hy - 30, 68, 40, 16); ctx.fill(); for (let f = 0; f < 4; f++) { ctx.fillStyle = '#1e1a14'; ctx.beginPath(); ctx.roundRect(hx - 30 + f * 15, hy - 4, 14, 22, 6); ctx.fill(); ctx.fillStyle = 'rgba(160,190,240,.14)'; ctx.fillRect(hx - 28 + f * 15, hy - 2, 10, 3); } ctx.fillStyle = '#1e1a14'; ctx.beginPath(); ctx.ellipse(hx - sd * 30, hy - 10, 10, 16, sd * .6, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(160,190,240,.16)'; ctx.fillRect(hx - 28, hy - 28, 56, 4); });
    if (pd > 0) { ddpFlashGlow(bx + bw - 52, by - 18, 120 * Math.max(0, 1 - pd / .3), 1); for (let i = 0; i < 10; i++) { const a = ddpR(i) * 6.28, d = pd * 300; ctx.fillStyle = 'rgba(255,230,150,' + Math.max(0, 1 - pd * 3) + ')'; ctx.fillRect(bx + bw - 52 + Math.cos(a) * d, by - 18 + Math.sin(a) * d, 3, 3); } }
    // moonlight from top-left
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const mg = ctx.createRadialGradient(200, -200, 50, 200, -200, 1400); mg.addColorStop(0, 'rgba(120,140,200,.16)'); mg.addColorStop(1, 'rgba(120,140,200,0)'); ctx.fillStyle = mg; ctx.fillRect(-800, -400, 3200, hv + 800); ctx.restore();
    ctx.restore();
    return pd > .45 ? Math.min(1, (pd - .45) / .12) : 0;
}

/* ---- shot B: Gustav goes up ---- */
const M8END_BLASTS = [[0, -170, -62, .9], [.45, -40, -128, 1.0], [.85, 36, -112, 1.1]];
function m8EndShotB(b, hv, t) {
    const P = ddpEnsure(), gx = 840, gy = hv * .64, s = 1.15, mega = 1.3, md = b - mega;
    M8END_BLASTS.forEach(function (q, i) { m8EndOnce('b' + i, b > q[0], function () { playExplosionSound(1.2 + i * .2); }); });
    m8EndOnce('mega', md > 0, function () { playExplosionSound(2.6); playDistantArtillery(); setTimeout(function () { try { playExplosionSound(1.8); } catch (e) {} }, 420); setTimeout(function () { try { playExplosionSound(1.4); } catch (e) {} }, 900); });
    for (let i = 0; i < 9; i++) { const ct = 2 + i * .55; m8EndOnce('c' + i, b > ct, function () { playExplosionSound(.5 + ddpR(i) * .5); }); }
    let shake = .4; M8END_BLASTS.forEach(function (q) { const d = b - q[0]; if (d > 0 && d < .6) shake = Math.max(shake, 7 * (1 - d / .6)); }); if (md > 0) shake = Math.max(shake, 22 * Math.max(0, 1 - md / 2.2) + 1.2);
    const sh = ddpShakeAt(b, shake); ctx.save(); ddpCam(hv, sh[0], sh[1], 1.0 + b * .008 + (md > 0 && md < .5 ? .05 * (1 - md / .5) : 0), 0);
    const hz = hv * .5;
    ddpNightSky(hz, t, 0, {});
    // hills + tunnel lamps
    ctx.fillStyle = '#10141c'; ctx.beginPath(); ctx.moveTo(-800, hz + 20); for (let x = -800; x <= 2400; x += 40) ctx.lineTo(x, hz - 60 - Math.sin(x * .004) * 70 - ddpR(x) * 14); ctx.lineTo(2400, hz + 40); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#05060a'; ctx.beginPath(); ctx.moveTo(380, hz + 6); ctx.lineTo(380, hz - 34); ctx.quadraticCurveTo(440, hz - 70, 500, hz - 34); ctx.lineTo(500, hz + 6); ctx.fill(); [392, 488].forEach(function (x) { ddpFlashGlow(x, hz - 40, 30, .5 + .2 * Math.sin(t * 7)); });
    // yard ground
    const yg = ctx.createLinearGradient(0, hz, 0, hv); yg.addColorStop(0, '#2a2622'); yg.addColorStop(.4, '#1e1c18'); yg.addColorStop(1, '#0e0d0b'); ctx.fillStyle = yg; ctx.fillRect(-800, hz, 3200, hv);
    ctx.strokeStyle = 'rgba(160,160,150,.3)'; ctx.lineWidth = 2; [gy + 2, gy + 10].forEach(function (y) { ctx.beginPath(); ctx.moveTo(-800, y); ctx.lineTo(2400, y); ctx.stroke(); });
    // floodlight pools until the lights die
    const lightsOn = md < .05;
    if (lightsOn) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; [[gx - 260, gy + 20], [gx + 300, gy + 26]].forEach(function (p) { const lg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 240); lg.addColorStop(0, 'rgba(255,200,130,.22)'); lg.addColorStop(1, 'rgba(255,200,130,0)'); ctx.fillStyle = lg; ctx.beginPath(); ctx.ellipse(p[0], p[1], 240, 60, 0, 0, 7); ctx.fill(); }); ctx.restore(); }
    // watchtower + searchlight (it falls after the big one)
    const tf = md > .3 ? cs2E(cs2C((md - .3) / 1.1, 0, 1)) : 0; ctx.save(); ctx.translate(1390, gy + 30); ctx.rotate(tf * 1.25); ctx.strokeStyle = '#0c0c0e'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-18, -190); ctx.moveTo(30, 0); ctx.lineTo(18, -190); ctx.moveTo(-26, -40); ctx.lineTo(24, -110); ctx.moveTo(24, -40); ctx.lineTo(-24, -110); ctx.stroke(); ctx.fillStyle = '#0c0c0e'; ctx.fillRect(-34, -224, 68, 36); ctx.beginPath(); ctx.moveTo(-40, -224); ctx.lineTo(0, -250); ctx.lineTo(40, -224); ctx.fill(); ctx.restore();
    if (lightsOn) ddpSearch(1390, gy - 176, Math.PI + .5 + Math.sin(t * .8) * .35, 900, .2, 70);
    // the gun
    const elA = .34, drop = md > 0 ? cs2C(md / .9, 0, 1) : 0, bounce = md > .9 ? Math.sin((md - .9) * 14) * Math.exp(-(md - .9) * 4) * .04 : 0, el = elA - (elA + .3) * (drop * drop) + bounce;
    const jx = md > 0 && md < 1.2 ? (ddpR(Math.floor(b * 40)) - .5) * 10 * (1 - md / 1.2) : 0;
    ddpGustav(gx + jx, gy, s, t, { el: el, lights: lightsOn, haze: .12, rim: .45 });
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(96,104,160,.62)'; ctx.fillRect(-800, hz - 420, 3200, hv); ctx.restore();
    if (lightsOn) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; [[gx - 280, gy - 150], [gx + 260, gy - 140]].forEach(function (p) { ddpFlashGlow(p[0], p[1], 160, .35); }); ctx.restore(); }
    // burnt + glowing after the big one
    if (md > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(60,40,30,' + Math.min(.7, md * .6) + ')'; ctx.beginPath(); ctx.ellipse(gx, gy - 70, 270, 90, 0, 0, 7); ctx.fill(); ctx.restore(); }
    // first three charges
    M8END_BLASTS.forEach(function (q, i) { const d = b - q[0]; if (d < 0) return; const x = gx + q[1] * s, y = gy + q[2] * s; if (d < .2) ddpFlashGlow(x, y, 400 * (1 - d / .2) + 80, 1); ddpBlast(x, y, q[3], Math.min(d, 3), 31 + i, 1); if (d > .4) ddpFire(x, y + 10, .35, t, i * 3); });
    // the ammunition room: everything at once
    if (md > 0) {
        const ax = gx + 40, ay = gy - 70;
        if (md < .35) ddpFlashGlow(ax, ay, 2000 * (1 - md / .35) + 300, 1);
        if (md < 1.3) { const R = 140 + md * 1300, a = .5 * (1 - md / 1.3); ctx.fillStyle = 'rgba(255,240,220,' + a * .25 + ')'; ctx.beginPath(); ctx.ellipse(ax, gy, R, R * .5, 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = 'rgba(255,240,220,' + a + ')'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(ax, gy, R, R * .5, 0, Math.PI, 0); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(ax, gy + 8, R * 1.1, R * .07, 0, 0, 7); ctx.stroke(); }
        const up = 1 - Math.pow(1 - cs2C(md / 3.2, 0, 1), 2), H = 560 * up, cap = 180 + up * 260;
        for (let i = 0; i < 16; i++) { const q = i / 15, r = (90 + q * 70) * (.6 + up * .6), x = ax + Math.sin(i * 2.1 + md) * 22 * q, y = ay - q * H; ctx.globalAlpha = .88; ctx.drawImage(i % 3 === 0 ? P.dark : P.smoke, x - r, y - r, r * 2, r * 2); }
        for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + md * .35, r = cap * (.45 + ddpR(i) * .22), x = ax + Math.cos(a) * cap * .65, y = ay - H + Math.sin(a) * cap * .22; ctx.globalAlpha = .85; ctx.drawImage(i % 2 ? P.smoke : P.dark, x - r, y - r * .75, r * 2, r * 1.5); } ctx.globalAlpha = 1;
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fb = Math.min(1, md * 3), fa = Math.max(0, 1 - md / 2.4); ctx.globalAlpha = fa; ctx.drawImage(P.fire, ax - 320 * fb, ay - 340 * fb, 640 * fb, 480 * fb); ctx.globalAlpha = fa * .7; ctx.drawImage(P.fire, ax - cap * .6, ay - H * .5 - cap * .4, cap * 1.2, cap); ctx.globalAlpha = fa * .3; ctx.drawImage(P.fire, ax - cap * .8, ay - H - cap * .4, cap * 1.6, cap * .8); if (md < .5) { ctx.globalAlpha = 1 - md / .5; ctx.drawImage(P.white, ax - 220, ay - 240, 440, 320); } ctx.restore(); ctx.globalAlpha = 1;
        // cook-offs along the wreck
        for (let i = 0; i < 9; i++) { const d = b - (2 + i * .55); if (d < 0) continue; const x = gx + (ddpR(i * 7) - .5) * 440 * s, y = gy - 40 - ddpR(i * 3) * 70; ddpBlast(x, y, .5 + ddpR(i) * .4, Math.min(d, 3), 50 + i, .8); }
        // fires that keep burning
        [[-200, -60], [-90, -80], [20, -120], [130, -70], [220, -60]].forEach(function (p, i) { if (md > .3 + i * .15) ddpFire(gx + p[0] * s, gy + p[1] * s, .42 + ddpR(i) * .25, t, i * 5); });
        if (md > .8) ddpSmoke(ax, ay - 40, 2.2, t, 4, 120, 700, .8);
        // debris: armour plates and burning bits, with trails
        for (let i = 0; i < 28; i++) { const a = -Math.PI / 2 + (ddpR(i + 21) - .5) * 2.4, v = 420 + ddpR(i + 2) * 700, gr = 640, dk = Math.min(md, 3.5), vx = Math.cos(a) * v, vy = Math.sin(a) * v, x = ax + vx * dk, y = ay + vy * dk + gr * dk * dk; if (y > gy + 40) continue;
            for (let j = 1; j < 6; j++) { const tt = Math.max(0, dk - j * .06); ctx.globalAlpha = .3 * (1 - j / 6); const r = 6 + j * 5; ctx.drawImage(P.smoke, ax + vx * tt - r, ay + vy * tt + gr * tt * tt - r, r * 2, r * 2); } ctx.globalAlpha = 1;
            ddpM8Chunk(x, y, 5 + ddpR(i + 8) * 10, dk * (3 + i % 4), 2); if (i % 3 === 0) ddpFlashGlow(x, y, 22, .7); }
        // the yard glows orange
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; const og = ctx.createRadialGradient(ax, ay, 0, ax, ay, 1100); og.addColorStop(0, 'rgba(255,140,60,' + (.3 * Math.max(0, 1 - md / 1.5) + .1) * Math.min(1, md * 2) + ')'); og.addColorStop(1, 'rgba(255,120,40,0)'); ctx.fillStyle = og; ctx.fillRect(-800, -400, 3200, hv + 800); ctx.restore();
    }
    // foreground: our treeline and the section watching
    const duck = md > 0 ? cs2C(md / .3, 0, 1) * (1 - cs2C((md - 3.5) / 1, 0, 1)) : 0;
    [[230, .93, 0], [330, .95, 1], [430, .92, 2], [150, .96, 3], [530, .95, 4]].forEach(function (m, i) { const stand = i === 2 && md > 4.6; ddpMan(m[0] + 60, hv * m[1] + 30, 2.9, t + i, { dir: 1, run: 0, crouch: stand ? 0 : 1, fall: duck * (i % 2 ? .25 : .15), haze: 0 }); });
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(40,46,70,.75)'; ctx.fillRect(-800, hv * .8, 3200, hv); ctx.restore();
    ctx.fillStyle = '#05070a'; [[-60, 60], [70, 34], [1560, 70], [1470, 30]].forEach(function (tr) { ctx.beginPath(); ctx.moveTo(tr[0] - tr[1] * .5, hv + 40); ctx.lineTo(tr[0] - tr[1] * .3, -300); ctx.lineTo(tr[0] + tr[1] * .3, -300); ctx.lineTo(tr[0] + tr[1] * .5, hv + 40); ctx.fill(); });
    for (let i = 0; i < 420; i++) { const side = i % 2, x = side ? 1440 + ddpR(i) * 260 + Math.pow(ddpR(i + 9), 2) * -200 : -80 + ddpR(i) * 260 + Math.pow(ddpR(i + 9), 2) * 200, y = -300 + Math.pow(ddpR(i + 3), 1.4) * (hv * .8), r = 14 + ddpR(i + 5) * 30; ctx.fillStyle = ddpR(i + 7) > .85 ? '#0e1410' : '#05070a'; ctx.beginPath(); ctx.ellipse(x, y, r, r * .7, ddpR(i) * 3, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#05070a'; ctx.fillRect(-800, hv * .985, 3200, 100); for (let i = 0; i < 140; i++) { const x = ddpR(i + 300) * 1900 - 150, hh = 30 + ddpR(i + 301) * 90; ctx.beginPath(); ctx.moveTo(x - 7, hv + 4); ctx.quadraticCurveTo(x + (ddpR(i + 302) - .5) * 30, hv - hh * .5, x + (ddpR(i + 303) - .5) * 40, hv - hh); ctx.lineTo(x + 7, hv + 4); ctx.fill(); }
    if (md > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,130,50,' + .08 * Math.min(1, md * 2) + ')'; ctx.fillRect(-800, hv * .7, 3200, hv); ctx.restore(); }
    ctx.restore();
    return md > 0 && md < .2 ? .9 * (1 - md / .2) : 0;
}
function m8EndCard(d, w, h) {
    const k = cs2C(d / .25, 0, 1), sc = cs2L(3, 1, cs2E(k));
    m8EndOnce('stamp', d > 0, function () { playExplosionSound(1); playTone(160, 50, .5, .1, 'square'); });
    ctx.save(); ctx.fillStyle = 'rgba(0,0,0,' + .35 * k + ')'; ctx.fillRect(0, 0, w, h); ctx.translate(w / 2, h * .45); ctx.rotate(-.04); ctx.scale(sc, sc); ctx.globalAlpha = k;
    ctx.fillStyle = 'rgba(8,8,5,.88)'; ctx.fillRect(-w, -96, w * 2, 192);
    const tape = function (y) { ctx.save(); ctx.beginPath(); ctx.rect(-w, y, w * 2, 15); ctx.clip(); ctx.fillStyle = '#d6a91c'; ctx.fillRect(-w, y, w * 2, 15); ctx.fillStyle = '#16140f'; for (let x = -w - 40; x < w + 40; x += 40) { ctx.beginPath(); ctx.moveTo(x, y + 15); ctx.lineTo(x + 20, y + 15); ctx.lineTo(x + 34, y); ctx.lineTo(x + 14, y); ctx.closePath(); ctx.fill(); } ctx.restore(); };
    tape(-96); tape(81);
    ctx.textAlign = 'center'; ctx.fillStyle = '#d9c88c'; ctx.font = '700 15px "Special Elite", "Courier New", monospace'; ctx.fillText('— OPERATION DEADFALL · 14 JUNE 1944 · 02:41 —', 0, -56);
    ctx.fillStyle = '#f4ecd0'; ctx.strokeStyle = '#000'; ctx.lineWidth = 7; ctx.font = '700 66px "Stardos Stencil", Impact, sans-serif'; ctx.strokeText('SCHWERER GUSTAV', 0, 10); ctx.fillText('SCHWERER GUSTAV', 0, 10);
    ctx.save(); ctx.rotate(-.12); ctx.strokeStyle = '#c0281a'; ctx.lineWidth = 5; ctx.strokeRect(-150, 22, 300, 52); ctx.fillStyle = '#d8301e'; ctx.font = '700 40px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('DESTROYED', 0, 62); ctx.restore();
    ctx.restore();
}
