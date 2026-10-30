/* =====================================================
   MISSION 10 ENDING — MGB 314 runs for home as the pens go up behind her
===================================================== */
const M10E = { dur: 16.5, cut: 6.6, cut2: 13.2 };
function m10PlayEnding(done) {
    const E = M10E; E.t0 = performance.now(); E.done = done; E.fired = {}; canvas.style.cursor = '';
    if (!CS2.grain) CS2.grain = cs2Grain();
    E.skip = function (e) { if (e.code === 'Space' || e.code === 'Escape') { e.preventDefault(); E.t0 -= 60000; } }; window.addEventListener('keydown', E.skip);
    cancelAnimationFrame(E.raf); E.raf = requestAnimationFrame(m10EndFrame);
}
function m10EOnce(k, cond, fn) { if (cond && !M10E.fired[k]) { M10E.fired[k] = 1; try { fn(); } catch (e) {} } }
function m10EndFrame(now) {
    const E = M10E, t = (now - E.t0) / 1000, w = canvas.width, h = canvas.height, U = w / 1600, hv = h / U;
    if (t >= E.dur) { window.removeEventListener('keydown', E.skip); if (E.done) E.done(); return; }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); ctx.scale(U, U);
    let flash = 0;
    try { if (t < E.cut) flash = m10EShotA(t, hv); else flash = m10EShotB(t - E.cut, hv, t); } catch (e) { DDP.err = e; }
    ctx.restore(); try { ddpBloom(w, h); } catch (e) {}
    ctx.save(); ctx.globalAlpha = .08; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    const vg = ctx.createRadialGradient(w / 2, h * .52, w * .24, w / 2, h * .52, w * .74); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    if (flash > 0) { ctx.fillStyle = 'rgba(255,230,190,' + Math.min(.85, flash) + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = Math.round(h * .062); ctx.fillStyle = '#050605'; ctx.fillRect(0, 0, w, bar); ctx.fillRect(0, h - bar, w, bar);
    const caps = [[.6, 'MGB 314 · 02:58 · FULL AHEAD, FORTY KNOTS.'], [2.0, 'BEHIND THEM, THE TIME PENCILS RUN OUT.'], [7.0, 'THREE U-BOATS AT THEIR BERTHS.'], [9.6, 'TWENTY FEET OF CONCRETE ABOVE THEM. IT DID NOT HELP.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; }); if (ci >= 0 && t < E.cut2) { const c = caps[ci], n = Math.min(c[1].length, Math.floor((t - c[0]) * 34)); ctx.textAlign = 'center'; ctx.fillStyle = '#efe6c6'; ctx.font = '700 16px "Special Elite", "Courier New", monospace'; ctx.fillText(c[1].slice(0, n), w / 2, h - bar - 14); }
    if (t > E.cut2) { const k = Math.min(1, (t - E.cut2) / .8); ctx.fillStyle = 'rgba(0,0,0,' + .55 * k + ')'; ctx.fillRect(0, 0, w, h); ctx.save(); ctx.globalAlpha = k; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd24a'; ctx.font = '700 ' + Math.round(w * .045) + 'px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('THE PENS ARE BURNING', w / 2, h * .44); ctx.fillStyle = '#e8e0c0'; ctx.font = Math.round(w * .014) + 'px "Special Elite", monospace'; ctx.fillText('U-255 · U-618 · U-981 — SUNK AT THEIR BERTHS' + (M10.tanker && M10.tanker.mined ? ' · TANKER ROSENHEIM ABLAZE' : ''), w / 2, h * .44 + w * .03); ctx.fillStyle = '#9fb27a'; ctx.fillText('OPERATION DEEP WATER — COMPLETE', w / 2, h * .44 + w * .055); ctx.restore(); }
    const fa = Math.max(Math.max(0, 1 - t / .8), Math.max(0, (t - (E.dur - 1)) / 1)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + Math.min(1, fa) + ')'; ctx.fillRect(0, 0, w, h); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8);
    E.raf = requestAnimationFrame(m10EndFrame);
}
function m10EBays(cx, hz, s, t, times, P) { // blasts inside each bay of a Keroman painted at (cx,hz,s)
    let flash = 0; times.forEach(function (bt, b) { const k = t - bt; if (k < 0) return; const bx = cx + (-500 + b * 260 + 100) * s, by = hz - 120 * s;
        m10EOnce('b' + P + b, true, function () { playExplosionSound(1.6); playTone(70, 30, 1, .12, 'sawtooth'); });
        if (k < .25) flash = Math.max(flash, .55 * (1 - k / .25));
        ddpBlast(bx, by, 1.6 * s, k * .8, b * 7 + 3, 1); if (k > .6) { ddpFire(bx, hz - 30 * s, 1.4 * s, t, b + 1); ddpSmoke(bx, hz - 200 * s, 1.2 * s, t, b * 3, -80, 360, .8); }
        ddpFlashGlow(bx, by, 380 * s * (k < 1 ? 1.3 - k * .3 : 1), Math.max(.35, 1 - k * .5)); });
    return flash; }
function m10EShotA(t, hv) {
    const hz = hv * .56; dqSky(hz, t, t * 20, { moonX: 300, moonY: hz - 380, warm: t > 1.8 ? 1 : 0 });
    // the coast and the pens far behind
    ctx.fillStyle = '#080a0e'; ctx.beginPath(); ctx.moveTo(600, hz + 2); for (let x = 600; x <= 1800; x += 30) ctx.lineTo(x, hz - 10 - Math.sin(x * .02) * 4); ctx.lineTo(1800, hz + 2); ctx.fill();
    const kx = 1220, ks = .3; dqKeroman(kx, hz, ks, t, { dmg: t > 1.8 ? 1 : 0, subs: [1, 1, 0, 1] });
    const flash = m10EBays(kx, hz, ks, t, [1.8, 2.5, 99, 3.2], 'A');
    if (t > 1.8) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const k = Math.min(1, (t - 1.8) / 1.5), g = ctx.createRadialGradient(kx, hz - 40, 10, kx, hz, 700); g.addColorStop(0, 'rgba(255,150,60,' + .35 * k + ')'); g.addColorStop(1, 'rgba(255,120,40,0)'); ctx.fillStyle = g; ctx.fillRect(kx - 700, hz - 500, 1400, 900); ctx.restore(); }
    dqSea(hz, hv + 40, t, t * 120, { moonX: 300 });
    if (t > 1.8) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 50; i++) { const y = hz + 4 + Math.pow(ddpR(i), 1.4) * (hv - hz) * .7, x = kx + (ddpR(i * 3) - .5) * (60 + (y - hz) * 1.2) + Math.sin(t * 3 + i) * 6; ctx.fillStyle = 'rgba(255,150,60,' + (.3 - (y - hz) / (hv - hz) * .25) + ')'; ctx.fillRect(x, y, 10 + (y - hz) * .15, 2); } ctx.restore();
        const sw = (t - 1.8) * 300; ctx.strokeStyle = 'rgba(255,200,150,' + Math.max(0, .35 - (t - 1.8) * .1) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(kx, hz + 6, sw, sw * .08, 0, 0, Math.PI); ctx.stroke(); }
    dqMGB(620 - t * 30, hv * .74, 1.7, t, { dir: -1, speed: 1 }); ddpM10Swell(hv, t * 1.6, hv * .93, .9);
    return flash;
}
function m10EShotB(u, hv, t) {
    const hz = hv * .62, sh = u < 1.5 ? (1.5 - u) * 6 : 0; ctx.save(); ctx.translate((Math.random() - .5) * sh, (Math.random() - .5) * sh);
    dqSky(hz, t, 0, { moonX: 200, moonY: hz - 360, warm: 1 });
    const z = 1 + u * .02; ctx.save(); ctx.translate(800, hz); ctx.scale(z, z); ctx.translate(-800, -hz);
    dqKeroman(760, hz, .85, t, { dmg: 1, subs: [1, 1, 1, 1] });
    let flash = m10EBays(760, hz, .85, u + 1.2, [0, .5, 1.6, .9], 'B');
    // roof chunks breaking away
    for (let i = 0; i < 14; i++) { const k = u - .4 - i * .25; if (k < 0) continue; const x0 = 760 + (-480 + ddpR(i) * 900) * .85, y0 = hz - 400 * .85, vx = (ddpR(i + 4) - .5) * 260, vy = -200 - ddpR(i + 8) * 200, x = x0 + vx * k, y = y0 + vy * k + 380 * k * k; if (y > hz + 40) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (2 + ddpR(i) * 3)); ctx.fillStyle = '#4a4e54'; ctx.fillRect(-14 - ddpR(i) * 16, -10, 28 + ddpR(i) * 30, 20); ctx.fillStyle = '#2a2e34'; ctx.fillRect(-14 - ddpR(i) * 16, 6, 28 + ddpR(i) * 30, 4); ctx.restore(); if (y > hz - 10 && y < hz + 20) ddpSpray(x, hz, .6, .3, 0, i, 6); }
    ctx.restore();
    const sg = ctx.createLinearGradient(0, hz, 0, hv); sg.addColorStop(0, '#5a2c14'); sg.addColorStop(.2, '#1a1410'); sg.addColorStop(1, '#060504'); ctx.fillStyle = sg; ctx.fillRect(-100, hz, 1800, hv);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 90; i++) { const y = hz + 4 + ddpR(i) * (hv - hz), x = ddpR(i * 5) * 1600; ctx.fillStyle = 'rgba(255,140,50,' + (.08 + .14 * Math.sin(t * 3 + i)) * (1 - (y - hz) / (hv - hz)) + ')'; ctx.fillRect(x, y, 40 + ddpR(i) * 90, 2.4); } ctx.restore();
    // U-981 going down by the bow in the foreground, burning oil around her
    const sk = Math.min(1, u / 6); ctx.save(); ctx.translate(1100, hv * .86 + sk * 60); ctx.rotate(-.18 - sk * .35); ddpUboat(0, 0, 1.1, t, { noRefl: 1, crew: false, haze: .6 }); ctx.restore();
    for (let i = 0; i < 6; i++) ddpFire(880 + i * 90, hv * .9, .8 + ddpR(i) * .5, t, i + 9);
    ddpSmoke(1100, hv * .8, 1.6, t, 4, -120, 460, .9);
    ctx.restore();
    return flash;
}
