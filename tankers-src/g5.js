/* ================= MISSION 5 : CRASH SITE (painted night) ================= */
function ddpNightSky(hz, t, pan, o) { // deep night, moon, stars, lit clouds, fire glow on the horizon
    o = o || {}; const P = ddpEnsure();
    const g = ctx.createLinearGradient(0, hz - 900, 0, hz); g.addColorStop(0, 'rgb(6,8,20)'); g.addColorStop(.6, 'rgb(18,22,44)'); g.addColorStop(.9, 'rgb(40,38,62)'); g.addColorStop(1, 'rgb(86,52,48)'); ctx.fillStyle = g; ctx.fillRect(-800, hz - 1200, 3200, 1210);
    ctx.fillStyle = '#dfe4ff'; for (let i = 0; i < 160; i++) { const x = ((ddpR(i * 3) * 2600 - pan * .05) % 2600 + 2600) % 2600 - 500, y = hz - 60 - ddpR(i * 7) * 900, a = .25 + .6 * ddpR(i + 1) * (.6 + .4 * Math.sin(t * 2 + i)); ctx.globalAlpha = a; ctx.fillRect(x, y, 1.6, 1.6); } ctx.globalAlpha = 1;
    const mx = (o.moonX || 1250) - pan * .03, my = hz - (o.moonY || 560); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 260); mg.addColorStop(0, 'rgba(190,200,255,.35)'); mg.addColorStop(1, 'rgba(120,140,220,0)'); ctx.fillStyle = mg; ctx.fillRect(mx - 260, my - 260, 520, 520); ctx.restore();
    ctx.fillStyle = '#eef0ff'; ctx.beginPath(); ctx.arc(mx, my, 34, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(160,166,200,.5)'; ctx.beginPath(); ctx.arc(mx - 9, my - 6, 8, 0, 7); ctx.arc(mx + 10, my + 9, 6, 0, 7); ctx.fill();
    for (let i = 0; i < 14; i++) { const x = ((ddpR(i * 5) * 2800 + t * 6 - pan * .12) % 2800) - 600, y = hz - 140 - ddpR(i * 3) * 600, wd = 500 + ddpR(i + 2) * 600; ctx.globalAlpha = .55; ctx.drawImage(P.dark, x - wd / 2, y - wd * .12, wd, wd * .24); ctx.globalAlpha = .12; ctx.drawImage(P.white, x - wd / 2, y - wd * .16, wd, wd * .2); } ctx.globalAlpha = 1;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fg = ctx.createLinearGradient(0, hz - 200, 0, hz); fg.addColorStop(0, 'rgba(255,90,40,0)'); fg.addColorStop(1, 'rgba(255,110,50,' + (o.glow === undefined ? .3 : o.glow) + ')'); ctx.fillStyle = fg; ctx.fillRect(-800, hz - 200, 3200, 204); ctx.restore();
}
function ddpSearch(x, y, ang, len, a, w) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.rotate(ang); const g = ctx.createLinearGradient(0, 0, len, 0); g.addColorStop(0, 'rgba(200,215,255,' + a + ')'); g.addColorStop(1, 'rgba(160,180,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(len, -(w || 40)); ctx.lineTo(len, w || 40); ctx.lineTo(0, 3); ctx.fill(); ctx.restore(); }
function ddpFlakBurst(x, y, k, s) { // k: seconds since burst
    if (k < 0 || k > 4) return; const P = ddpEnsure(); s = s || 1;
    if (k < .15) ddpFlashGlow(x, y, 120 * s, 1 - k / .15);
    const R = (16 + Math.min(k, 1) * 40) * s; ctx.globalAlpha = Math.max(0, 1 - k / 4) * .9; for (let i = 0; i < 4; i++) ctx.drawImage(P.dark, x + Math.sin(i * 2.1) * R * .4 - R, y + Math.cos(i * 1.7) * R * .3 - R - k * 6, R * 2, R * 2); ctx.globalAlpha = 1;
}
function ddpLanc(x, y, s, t, o) { // Avro Lancaster, side view, nose to the right
    o = o || {}; const P = ddpEnsure(), dir = o.dir || 1, burn = o.burn || 0, props = o.props === undefined ? 1 : o.props, lit = o.lit || 0, wy = o.wy === undefined ? 1 : o.wy;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.ang || 0); ctx.scale(s * dir, s);
    const top = '#2a2e22', mid = '#1f2219', blk = '#0c0d0e', rim = 'rgba(170,186,255,' + (.35 + lit * .3) + ')', firec = 'rgba(255,140,60,' + (.4 * lit) + ')';
    // far wing + far engines
    ctx.fillStyle = '#121410'; ctx.beginPath(); ctx.moveTo(30, -6); ctx.lineTo(-22, -6); ctx.lineTo(-10, -50 * wy - 2); ctx.lineTo(12, -50 * wy - 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#16180f'; ctx.beginPath(); ctx.ellipse(24, -18 * wy - 2, 14, 3.6, 0, 0, 7); ctx.ellipse(18, -34 * wy - 2, 12, 3.2, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#121410'; ctx.fillRect(-132, -9, 24, 3); ctx.beginPath(); ctx.ellipse(-122, -10, 4, 10, 0, 0, 7); ctx.fill();
    // twin tails (far one first)
    ctx.fillStyle = '#121410'; ctx.beginPath(); ctx.ellipse(-120, -18, 7, 16, 0, 0, 7); ctx.fill(); ctx.fillRect(-124, -8, 20, 3);
    // fuselage
    const fg = ctx.createLinearGradient(0, -10, 0, 9); fg.addColorStop(0, top); fg.addColorStop(.5, mid); fg.addColorStop(.62, blk); fg.addColorStop(1, blk); ctx.fillStyle = fg;
    ctx.beginPath(); ctx.moveTo(78, 0); ctx.bezierCurveTo(78, -7, 70, -9, 58, -9); ctx.lineTo(10, -10); ctx.lineTo(-90, -7); ctx.quadraticCurveTo(-118, -5, -126, -2); ctx.lineTo(-126, 3); ctx.quadraticCurveTo(-110, 7, -80, 8); ctx.lineTo(56, 9); ctx.bezierCurveTo(70, 9, 78, 6, 78, 0); ctx.fill();
    ctx.fillStyle = rim; ctx.fillRect(-110, -9.6, 170, 1.2);
    // nose turret + bomb aimer blister, canopy, mid-upper and rear turrets
    ctx.fillStyle = 'rgba(120,140,170,.75)'; ctx.beginPath(); ctx.arc(72, -1, 7, -1.6, 1.4); ctx.fill(); ctx.fillStyle = blk; ctx.fillRect(78, -3, 9, 1.2); ctx.fillRect(78, 0, 9, 1.2);
    ctx.fillStyle = 'rgba(120,140,170,.8)'; ctx.beginPath(); ctx.moveTo(56, -9); ctx.quadraticCurveTo(50, -18, 34, -17); ctx.lineTo(28, -10); ctx.closePath(); ctx.fill(); ctx.strokeStyle = blk; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(44, -17); ctx.lineTo(42, -10); ctx.moveTo(36, -17); ctx.lineTo(35, -10); ctx.stroke();
    if (o.cockpitGlow) { ctx.fillStyle = 'rgba(255,150,60,' + o.cockpitGlow + ')'; ctx.fillRect(34, -15, 18, 4); }
    ctx.fillStyle = 'rgba(120,140,170,.75)'; ctx.beginPath(); ctx.arc(-38, -10, 6, Math.PI, 0); ctx.fill(); ctx.fillStyle = blk; ctx.fillRect(-36, -18, 10, 1.2);
    ctx.fillStyle = 'rgba(120,140,170,.75)'; ctx.beginPath(); ctx.arc(-128, 0, 6, Math.PI * .5, Math.PI * 1.5); ctx.fill(); ctx.fillStyle = blk; ctx.fillRect(-142, -2, 10, 1); ctx.fillRect(-142, 1, 10, 1);
    // roundel + codes
    ctx.fillStyle = '#1c2a52'; ctx.beginPath(); ctx.arc(-56, -1, 6.5, 0, 7); ctx.fill(); ctx.fillStyle = '#6a1a18'; ctx.beginPath(); ctx.arc(-56, -1, 2.8, 0, 7); ctx.fill();
    ctx.save(); ctx.scale(dir, 1); ctx.fillStyle = '#7a1e18'; ctx.font = '700 9px "Stardos Stencil", Impact, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('KO', dir * -80, 2.4); ctx.fillText('J', dir * -36, 2.4); ctx.restore();
    // near tail
    ctx.fillStyle = mid; ctx.beginPath(); ctx.ellipse(-116, -14, 8, 18, 0, 0, 7); ctx.fill(); ctx.fillStyle = rim; ctx.beginPath(); ctx.ellipse(-116, -14, 8, 18, 0, Math.PI * 1.2, Math.PI * 1.7); ctx.lineTo(-116, -14); ctx.fill(); ctx.fillStyle = mid; ctx.fillRect(-130, -5, 30, 3.4);
    // near wing (seen slightly from below)
    ctx.fillStyle = '#16180f'; ctx.beginPath(); ctx.moveTo(34, 2); ctx.lineTo(-22, 3); ctx.lineTo(-12, 66 * wy + 4); ctx.lineTo(14, 66 * wy + 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = firec; ctx.beginPath(); ctx.moveTo(34, 2); ctx.lineTo(14, 66 * wy + 4); ctx.lineTo(9, 66 * wy + 4); ctx.lineTo(28, 2); ctx.fill();
    ctx.fillStyle = 'rgba(170,186,255,.18)'; ctx.beginPath(); ctx.moveTo(-22, 3); ctx.lineTo(-12, 66 * wy + 4); ctx.lineTo(-8, 66 * wy + 4); ctx.lineTo(-17, 3); ctx.fill();
    // panel lines + exhaust stains
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = .6; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(50 - i * 18, -9); ctx.lineTo(50 - i * 18, 8); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(60, -3); ctx.lineTo(-110, -2); ctx.stroke();
    // near engines (inboard + outboard), nacelles + props
    [[30, 16 * wy + 2, 0], [24, 40 * wy + 3, 1]].forEach(function (e, i) {
        ctx.fillStyle = '#1b1d15'; ctx.beginPath(); ctx.moveTo(e[0] + 14, e[1]); ctx.quadraticCurveTo(e[0] + 14, e[1] - 5, e[0] + 6, e[1] - 5); ctx.lineTo(e[0] - 18, e[1] - 4); ctx.lineTo(e[0] - 18, e[1] + 4); ctx.lineTo(e[0] + 6, e[1] + 5); ctx.quadraticCurveTo(e[0] + 14, e[1] + 5, e[0] + 14, e[1]); ctx.fill();
        ctx.fillStyle = 'rgba(255,150,70,.7)'; ctx.fillRect(e[0] - 6, e[1] + 3, 6, 1.4);
        if (props > 0) { ctx.fillStyle = 'rgba(180,190,210,' + (.18 * props) + ')'; ctx.beginPath(); ctx.ellipse(e[0] + 16, e[1], 2, 15, 0, 0, 7); ctx.fill(); const pa = t * 40 + i; ctx.strokeStyle = 'rgba(10,10,10,.7)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(e[0] + 16, e[1] + Math.cos(pa) * 15); ctx.lineTo(e[0] + 16, e[1] - Math.cos(pa) * 15); ctx.stroke(); }
        else { ctx.strokeStyle = '#0a0a0a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(e[0] + 16, e[1]); ctx.quadraticCurveTo(e[0] + 22, e[1] - 6, e[0] + 18, e[1] - 13); ctx.moveTo(e[0] + 16, e[1]); ctx.quadraticCurveTo(e[0] + 12, e[1] + 8, e[0] + 20, e[1] + 12); ctx.stroke(); }
    });
    ctx.restore();
    // burning outboard engine: fire + smoke trail streaming back (world space)
    if (burn > 0) { const c = Math.cos(o.ang || 0), sn = Math.sin(o.ang || 0), ey0 = 40 * wy + 3, ex = x + (6 * c - ey0 * sn) * s * dir, ey = y + (6 * sn * dir + ey0 * c) * s;
        for (let i = 18; i >= 0; i--) { const k = i / 18, px = ex - dir * (k * 260 * s * burn) - Math.sin(t * 9 + i) * 3, py = ey - k * 30 * s + Math.sin(t * 7 + i * 2) * 4, r = (6 + k * 34) * s * (.6 + .4 * burn); ctx.globalAlpha = (1 - k) * .75 * burn; ctx.drawImage(P.dark, px - r, py - r, r * 2, r * 2); }
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 8; i >= 0; i--) { const k = i / 8, px = ex - dir * (k * 90 * s * burn), py = ey - k * 6 * s, r = (5 + k * 12) * s * (.8 + .3 * Math.sin(t * 20 + i)); ctx.globalAlpha = (1 - k * .7) * burn; ctx.drawImage(P.fire, px - r, py - r, r * 2, r * 2); } ctx.restore(); ctx.globalAlpha = 1; }
}
function ddpGerTorch(x, y, s, t, o) { // German infantryman with a torch, beam pointed along dir
    o = o || {}; ddpMan(x, y, s, t, { dir: o.dir || -1, run: o.run === undefined ? .35 : o.run, spd: 4.5, ph: o.ph || 0, ger: true, haze: o.haze || 0 });
    const hx = x + (o.dir || -1) * 14 * s, hy = y - 42 * s, sw = Math.sin(t * 1.3 + (o.ph || 0)) * .25; ddpFlashGlow(hx, hy, 30 * s, .9);
    ddpSearch(hx, hy, (o.dir || -1) < 0 ? Math.PI + .08 + sw : -.08 + sw, 600 * s, .16, 70 * s);
}

/* ---------- SHOT 1 : flak over Normandy ---------- */
function ddpM5Shot1(t, hv) {
    const P = ddpEnsure(), hit = 3.5, hd = t - hit; cs2Once('m5f1', t > .3, function () { playDistantArtillery(); }); cs2Once('m5hit', hd > 0, function () { playExplosionSound(1.0); });
    const pan = t * 60, sh = ddpShakeAt(t, hd > 0 && hd < .6 ? (1 - hd / .6) * 16 : .6);
    ctx.save(); ddpCam(hv, sh[0], sh[1], 1.02, 0);
    const hz = hv * .86; ddpNightSky(hz, t, pan, { moonX: 1300, moonY: 620 });
    // searchlights from the ground
    [[200, .9], [620, 1.7], [1040, 2.4], [1450, 3.1]].forEach(function (b, i) { ddpSearch(b[0] - pan * .2, hz, -Math.PI / 2 + Math.sin(t * .5 + b[1]) * .5, 1100, .22, 40); });
    // flak field
    for (let i = 0; i < 18; i++) { const per = 1.6 + ddpR(i) * 1.2, k = ((t + ddpR(i * 3) * per) % per), x = ((ddpR(i * 7) * 2200 - pan * .5) % 2200 + 2200) % 2200 - 300, y = hz - 300 - ddpR(i * 11) * 500; ddpFlakBurst(x, y, k, .9 + ddpR(i) * .5); }
    // landscape far below
    { const gg = ctx.createLinearGradient(0, hz, 0, hz + 300); gg.addColorStop(0, 'rgb(22,20,26)'); gg.addColorStop(1, 'rgb(6,8,8)'); ctx.fillStyle = gg; ctx.fillRect(-800, hz, 3200, 400);
      ctx.strokeStyle = 'rgba(150,170,230,.35)'; ctx.lineWidth = 3; ctx.beginPath(); for (let x = -800; x < 2400; x += 40) ctx.lineTo(x, hz + 40 + Math.sin(x * .004 + pan * .002) * 22); ctx.stroke();
      for (let c = 0; c < 4; c++) { const cx = ((c * 700 + 200 - pan * .6) % 2800 + 2800) % 2800 - 600; ddpFlashGlow(cx, hz + 20, 160, .5); for (let i = 0; i < 8; i++) ddpFlashGlow(cx + (ddpR(c * 9 + i) - .5) * 160, hz + 14 + ddpR(i + c) * 30, 16 + ddpR(i) * 20, .6 + .3 * Math.sin(t * 7 + i)); ctx.globalAlpha = .5; ddpSmoke(cx, hz + 10, .7, t, c * 3, 60, 300, .6); ctx.globalAlpha = 1; } }
    // light flak: tracer streams arcing up
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let g = 0; g < 5; g++) { const gx = ((g * 430 + 120 - pan * .6) % 2200 + 2200) % 2200 - 300, ga = -Math.PI / 2 + Math.sin(t * .7 + g * 2) * .45; for (let i = 0; i < 14; i++) { const q = ((t * 1.3 + i / 14 + g * .3) % 1), d = q * 900, px = gx + Math.cos(ga) * d + q * q * 60, py = hz + Math.sin(ga) * d; ctx.fillStyle = g % 2 ? 'rgba(255,120,60,' + (1 - q) + ')' : 'rgba(255,220,120,' + (1 - q) + ')'; ctx.beginPath(); ctx.ellipse(px, py, 3, 9, ga + Math.PI / 2, 0, 7); ctx.fill(); } } ctx.restore();
    // other bombers in the stream
    [[300, 220, .9], [1300, 330, .7]].forEach(function (b, i) { ddpLanc(((b[0] + t * 30) % 1900) - 150, b[1] + Math.sin(t + i) * 4, b[2], t, { ang: .02 }); });
    // our Lancaster
    const dip = hd > 0 ? Math.min(.16, hd * .06) : 0, x = 760 + t * 12, y = hv * .45 + (hd > 0 ? hd * hd * 8 : 0) + Math.sin(t * 1.6) * 5;
    if (hd > -0.2 && hd < .6) ddpFlakBurst(x - 40, y + 70, hd + .2, 1.8);
    ddpLanc(x, y, 3.1, t, { ang: .03 + dip, burn: hd > 0 ? Math.min(1, hd * 1.5) : 0, lit: hd > 0 ? .8 : 0 });
    ctx.restore();
    return hd > 0 && hd < .1 ? .3 : 0;
}
/* ---------- SHOT 2 : the cockpit ---------- */
function ddpGauge(x, y, r, ang, col) { ctx.fillStyle = '#050606'; ctx.beginPath(); ctx.arc(x, y, r + 5, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(150,140,120,.5)'; ctx.lineWidth = 2; ctx.stroke(); const g = ctx.createRadialGradient(x - r * .3, y - r * .3, 0, x, y, r); g.addColorStop(0, '#1d2320'); g.addColorStop(1, '#0a0d0c'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.strokeStyle = col || 'rgba(170,255,170,.75)'; ctx.lineWidth = 1.6; for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72); ctx.lineTo(x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(220,255,200,.95)'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * r * .8, y + Math.sin(ang) * r * .8); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.ellipse(x - r * .3, y - r * .4, r * .5, r * .25, -.5, 0, 7); ctx.fill(); }
function ddpM5Shot2(s, hv) {
    const P = ddpEnsure(); cs2Once('m5alarm', s > .2, function () { playTone(820, 820, .5, .04, 'square'); }); cs2Once('m5intercom', s > 3.0, function () { playTone(300, 260, .6, .03, 'sawtooth'); });
    const roll = -.2 - s * .05 + Math.sin(s * 3) * .05, sh = ddpShakeAt(s, 5 + s * 1.1), fire = .75 + Math.sin(s * 13) * .15 + Math.sin(s * 31) * .1, blink = Math.floor(s * 4) % 2;
    ctx.save(); ctx.translate(sh[0], sh[1]);
    // outside: night sky, rolling + diving horizon, burning countryside
    ctx.save(); ctx.translate(800, hv * .42); ctx.rotate(roll); ctx.translate(-800, -hv * .42); const hz = hv * .5 + s * 34;
    ddpNightSky(hz, s + 6, s * 260, { moonX: 330, moonY: 420, glow: .6 });
    const gg = ctx.createLinearGradient(0, hz, 0, hz + 800); gg.addColorStop(0, 'rgb(30,22,26)'); gg.addColorStop(1, 'rgb(6,8,8)'); ctx.fillStyle = gg; ctx.fillRect(-1200, hz, 4000, 2000);
    for (let i = 0; i < 36; i++) { const x = ((ddpR(i * 5) * 3200 - s * 700) % 3200 + 3200) % 3200 - 800, y = hz + 14 + ddpR(i) * 300 * (1 + s * .1); ddpFlashGlow(x, y, 24 + ddpR(i + 3) * 40, .55 + .3 * Math.sin(s * 9 + i)); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let g = 0; g < 3; g++) { const gx = ((g * 700 + 300 - s * 500) % 2400 + 2400) % 2400 - 400; for (let i = 0; i < 10; i++) { const q = ((s * 1.4 + i / 10 + g * .3) % 1), px = gx + q * 300, py = hz - q * 700; ctx.fillStyle = 'rgba(255,160,70,' + (1 - q) + ')'; ctx.beginPath(); ctx.ellipse(px, py, 3, 10, -.4, 0, 7); ctx.fill(); } } ctx.restore();
    ctx.restore();
    // the port wing + burning engine through the left glazing
    ctx.save(); ctx.translate(640, hv * .4); ctx.rotate(roll * .9 - .02);
    ctx.fillStyle = '#101210'; ctx.beginPath(); ctx.moveTo(320, -14); ctx.lineTo(-900, 30); ctx.lineTo(-900, 70); ctx.lineTo(320, 26); ctx.fill(); ctx.fillStyle = 'rgba(160,180,240,.22)'; ctx.beginPath(); ctx.moveTo(320, -14); ctx.lineTo(-900, 30); ctx.lineTo(-900, 33); ctx.lineTo(320, -11); ctx.fill();
    [[60, 6, 90], [-330, 22, 70]].forEach(function (e, i) { ctx.fillStyle = '#191b15'; ctx.beginPath(); ctx.ellipse(e[0], e[1] + 8, e[2], e[2] * .3, .02, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,140,60,' + (.35 * fire) + ')'; ctx.beginPath(); ctx.ellipse(e[0], e[1], e[2] * .9, e[2] * .12, .02, Math.PI, 0); ctx.fill(); });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 22; i++) { const k = ((s * 1.8 + i / 22) % 1), px = -330 - k * 640, py = 18 - k * 50 + Math.sin(s * 14 + i) * 12, r = 34 + k * 140; ctx.globalAlpha = (1 - k) * .95; ctx.drawImage(P.fire, px - r, py - r * .55, r * 2, r * 1.1); } ctx.restore(); ctx.globalAlpha = 1;
    for (let i = 0; i < 14; i++) { const k = ((s * 1.2 + i / 14) % 1), r = 70 + k * 260; ctx.globalAlpha = (1 - k) * .7; ctx.drawImage(P.dark, -520 - k * 800 - r, -40 - k * 110 - r * .55, r * 2, r * 1.1); } ctx.globalAlpha = 1;
    ddpFlashGlow(-330, 14, 260, .55 * fire); ctx.restore();
    // glazing: reflections + frame with rivets
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(160,180,255,.05)'; ctx.beginPath(); ctx.moveTo(560, hv * .1); ctx.lineTo(640, hv * .1); ctx.lineTo(500, hv * .6); ctx.lineTo(420, hv * .6); ctx.fill(); ctx.restore();
    const frame = function (lw, col) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(-60, hv * .7); ctx.quadraticCurveTo(300, hv * .06, 800, -10); ctx.quadraticCurveTo(1300, hv * .06, 1660, hv * .7); ctx.moveTo(800, -10); ctx.lineTo(800, hv * .62); ctx.moveTo(470, hv * .1); ctx.lineTo(560, hv * .64); ctx.moveTo(1130, hv * .1); ctx.lineTo(1040, hv * .64); ctx.moveTo(110, hv * .4); ctx.quadraticCurveTo(800, hv * .3, 1490, hv * .4); ctx.stroke(); };
    ctx.lineCap = 'butt'; frame(42, '#050607'); frame(30, '#121417'); ctx.save(); ctx.translate(-3, -3); frame(3, 'rgba(255,150,70,' + (.35 * fire) + ')'); ctx.restore();
    ctx.fillStyle = 'rgba(150,140,130,.45)'; for (let i = 0; i < 14; i++) { const q = i / 13; ctx.beginPath(); ctx.arc(800, q * hv * .6, 2.6, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(470 + q * 90, hv * .1 + q * hv * .54, 2.6, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(1130 - q * 90, hv * .1 + q * hv * .54, 2.6, 0, 7); ctx.fill(); }
    // instrument panel (lit by radium dials, fire and the warning lamp)
    const pg = ctx.createLinearGradient(0, hv * .6, 0, hv); pg.addColorStop(0, '#1b1d1f'); pg.addColorStop(.2, '#101213'); pg.addColorStop(1, '#040505'); ctx.fillStyle = pg; ctx.beginPath(); ctx.moveTo(-60, hv + 20); ctx.lineTo(-60, hv * .68); ctx.quadraticCurveTo(800, hv * .55, 1660, hv * .68); ctx.lineTo(1660, hv + 20); ctx.fill();
    ctx.fillStyle = 'rgba(255,140,60,' + (.18 * fire) + ')'; ctx.beginPath(); ctx.moveTo(-60, hv * .68); ctx.quadraticCurveTo(800, hv * .55, 1660, hv * .68); ctx.lineTo(1660, hv * .7); ctx.quadraticCurveTo(800, hv * .58, -60, hv * .71); ctx.fill();
    const dials = [[430, .7, 'ALT', -s * 5], [560, .66, 'ASI', 1.2 + s * .4], [690, .655, 'AH', roll * 3], [910, .655, 'VSI', 2.2], [1040, .66, 'RPM', Math.sin(s * 9) * 2], [1170, .7, 'BST', -2 + Math.sin(s * 7)], [500, .82, '', s], [640, .8, '', 2 + Math.sin(s * 5)], [960, .8, '', -1], [1100, .82, '', s * 2]];
    dials.forEach(function (d) { ddpGauge(d[0], hv * d[1], 36, d[3], d[2] === 'ALT' ? 'rgba(255,170,120,.8)' : null); });
    ctx.fillStyle = blink ? '#ff2a1e' : '#4a0c08'; ctx.beginPath(); ctx.arc(1290, hv * .7, 14, 0, 7); ctx.fill(); if (blink) ddpFlashGlow(1290, hv * .7, 80, .7);
    ctx.fillStyle = '#ffd36a'; ctx.beginPath(); ctx.arc(330, hv * .72, 9, 0, 7); ctx.fill(); ddpFlashGlow(330, hv * .72, 60, .6);
    // throttle quadrant on the right
    for (let i = 0; i < 4; i++) { const tx = 1380 + i * 34, tl = i === 0 ? hv * .9 : hv * .8; ctx.strokeStyle = '#0a0a0a'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(tx, hv + 20); ctx.lineTo(tx - 10, tl); ctx.stroke(); ctx.fillStyle = i === 0 ? '#7a1e18' : '#2a2a2a'; ctx.beginPath(); ctx.arc(tx - 10, tl, 13, 0, 7); ctx.fill(); }
    // the pilot from behind
    const px = 800 + Math.sin(s * 3) * 8, pull = Math.min(1, s / 2) * 26 + Math.sin(s * 8) * 7, yy = hv * .74 - pull;
    ctx.lineCap = 'round'; ctx.strokeStyle = '#080706'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(px, hv + 60); ctx.lineTo(px, yy + 70); ctx.stroke();
    ctx.strokeStyle = '#0a0908'; ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(px - 70, yy + 64); ctx.quadraticCurveTo(px - 220, yy + 60, px - 230, yy - 10); ctx.quadraticCurveTo(px - 220, yy - 70, px - 150, yy - 40); ctx.moveTo(px + 70, yy + 64); ctx.quadraticCurveTo(px + 220, yy + 60, px + 230, yy - 10); ctx.quadraticCurveTo(px + 220, yy - 70, px + 150, yy - 40); ctx.stroke();
    ctx.fillStyle = '#7a1e18'; ctx.beginPath(); ctx.arc(px - 186, yy + 50, 7, 0, 7); ctx.fill();
    ctx.fillStyle = '#0b0807'; ctx.beginPath(); ctx.moveTo(px - 360, hv + 60); ctx.quadraticCurveTo(px - 340, hv * .86, px - 160, hv * .84); ctx.lineTo(px + 160, hv * .84); ctx.quadraticCurveTo(px + 340, hv * .86, px + 360, hv + 60); ctx.fill();
    ctx.strokeStyle = '#0d0a08'; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(px - 230, hv * .92); ctx.quadraticCurveTo(px - 300, yy + 30, px - 228, yy + 4); ctx.moveTo(px + 230, hv * .92); ctx.quadraticCurveTo(px + 300, yy + 30, px + 228, yy + 4); ctx.stroke();
    ctx.fillStyle = '#3a2618'; ctx.beginPath(); ctx.ellipse(px - 226, yy, 26, 20, .3, 0, 7); ctx.ellipse(px + 226, yy, 26, 20, -.3, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,150,70,' + (.4 * fire) + ')'; ctx.beginPath(); ctx.ellipse(px - 236, yy - 6, 14, 9, .3, 0, 7); ctx.fill();
    ctx.fillStyle = '#5d4a33'; for (let i = 0; i < 30; i++) { const a = Math.PI * 1.02 + i / 29 * Math.PI * .96; ctx.beginPath(); ctx.arc(px + Math.cos(a) * 150, hv * .9 + Math.sin(a) * 46, 15 + ddpR(i) * 5, 0, 7); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,160,80,' + (.35 * fire) + ')'; for (let i = 0; i < 12; i++) { const a = Math.PI * 1.02 + i / 11 * Math.PI * .4; ctx.beginPath(); ctx.arc(px + Math.cos(a) * 150, hv * .9 + Math.sin(a) * 46 - 4, 9, 0, 7); ctx.fill(); }
    ctx.strokeStyle = '#2a2420'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(px - 110, hv * .88); ctx.lineTo(px - 60, hv + 60); ctx.moveTo(px + 110, hv * .88); ctx.lineTo(px + 60, hv + 60); ctx.stroke();   // harness
    const hy = hv * .74 + Math.sin(s * 2.6) * 4; ctx.fillStyle = '#120d09'; ctx.beginPath(); ctx.ellipse(px, hy, 98, 116, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(80,58,40,.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, hy - 116); ctx.quadraticCurveTo(px + 6, hy, px, hy + 90); ctx.moveTo(px - 70, hy - 80); ctx.quadraticCurveTo(px, hy - 100, px + 70, hy - 80); ctx.stroke();
    ctx.fillStyle = 'rgba(255,150,70,' + (.28 * fire) + ')'; ctx.beginPath(); ctx.ellipse(px - 52, hy - 20, 30, 86, -.12, 0, 7); ctx.fill();
    ctx.fillStyle = '#080605'; ctx.beginPath(); ctx.ellipse(px - 100, hy + 10, 22, 38, 0, 0, 7); ctx.ellipse(px + 100, hy + 10, 22, 38, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#1a1410'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(px, hy - 6, 106, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
    ctx.strokeStyle = '#3c4c5a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(px - 96, hy - 50); ctx.quadraticCurveTo(px, hy - 64, px + 96, hy - 50); ctx.stroke();   // goggle strap
    ctx.strokeStyle = '#1e2420'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(px + 104, hy + 40); ctx.quadraticCurveTo(px + 170, hy + 120, px + 120, hv); ctx.stroke();   // oxygen hose
    // smoke filling the cabin, alarm wash
    for (let i = 0; i < 9; i++) { const k = ((s * .4 + i / 9) % 1); ctx.globalAlpha = Math.min(.45, s * .08) * (1 - k); const r = 220 + k * 320; ctx.drawImage(P.dark, 200 + i * 160 - r, hv * .16 - k * 100 - r * .4, r * 2, r * .8); } ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(255,120,50,' + (.06 * fire) + ')'; ctx.fillRect(-100, -100, 1800, hv + 200); if (blink) { ctx.fillStyle = 'rgba(255,30,20,.10)'; ctx.fillRect(-100, -100, 1800, hv + 200); }
    ctx.restore();
    return s > 5.4 ? (s - 5.4) * .9 : 0;
}
/* ---------- SHOT 3 : she comes down hard ---------- */
function ddpM5Shot3(s, hv) {
    const P = ddpEnsure(), k = cs2C(s / 4.6, 0, 1), e = 1 - Math.pow(1 - k, 2.2), touch = .5, td = s - touch; cs2Once('m5land', td > 0, function () { playExplosionSound(1.4); playTone(90, 40, 3, .1, 'sawtooth'); });
    const hedge = 2.0; cs2Once('m5hedge', s > hedge, function () { playExplosionSound(.9); });
    const shake = td > 0 ? (6 + 14 * Math.max(0, 1 - td / 1.2)) * (1 - k * .8) : 1, sh = ddpShakeAt(s, shake);
    ctx.save(); ddpCam(hv, sh[0], sh[1], 1.05, Math.sin(s * 9) * .004 * shake);
    const gy = hv * .72; ddpNightSky(gy, s + 12, 0, { moonX: 260, moonY: 500, glow: .4 });
    ctx.fillStyle = '#0a0d0a'; for (let i = 0; i < 70; i++) { const x = i * 34 - 400, r = 22 + ddpR(i) * 26; ctx.beginPath(); ctx.arc(x, gy - 4 - ddpR(i + 4) * 10, r, 0, 7); ctx.fill(); }
    const gg = ctx.createLinearGradient(0, gy, 0, hv); gg.addColorStop(0, '#141a10'); gg.addColorStop(1, '#070906'); ctx.fillStyle = gg; ctx.fillRect(-800, gy, 3200, hv);
    const x = cs2L(2000, 620, e), y = gy + 8 - (s < touch ? (touch - s) * 160 : 0), ang = s < touch ? -.06 : -.02 + Math.sin(s * 30) * .012 * (1 - k);
    // furrow gouged behind
    if (td > 0) { ctx.fillStyle = 'rgba(40,30,18,.9)'; ctx.beginPath(); ctx.moveTo(x + 100, gy + 10); ctx.lineTo(2400, gy + 4); ctx.lineTo(2400, gy + 20); ctx.lineTo(x + 100, gy + 24); ctx.fill(); }
    // hedge being smashed
    const hx = 1300; if (x > hx - 300 || s < hedge) { ctx.fillStyle = '#0c120b'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(hx - 120 + i * 30, gy - 20 - ddpR(i) * 20, 40, 0, 7); ctx.fill(); } }
    ddpLanc(x, y, 4.2, s + 12, { dir: -1, ang: ang, burn: 1, props: td > 0 ? 0 : 1, lit: 1, wy: s < touch ? .5 : .22 });
    if (s > hedge) ddpLeaves(hx, gy, 1.4, s - hedge, 9);
    // sparks + dirt spray
    if (td > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 50; i++) { const q = (s * 2.4 + i / 50) % 1; ctx.fillStyle = 'rgba(255,' + (150 + ddpR(i) * 90) + ',60,' + (1 - q) * (1 - k * .7) + ')'; ctx.fillRect(x + 120 + q * 300, gy - q * (40 + ddpR(i + 3) * 120) + q * q * 140, 4, 3); } ctx.restore();
        for (let i = 0; i < 60; i++) { const q = (s * 1.6 + i / 60) % 1; ctx.fillStyle = 'rgba(46,36,22,' + .85 * (1 - q) * (1 - k * .6) + ')'; ctx.beginPath(); ctx.arc(x - 200 + ddpR(i) * 500 + q * 200, gy - q * (60 + ddpR(i + 7) * 200) + q * q * 260, 3 + ddpR(i) * 5, 0, 7); ctx.fill(); }
        for (let i = 0; i < 10; i++) { const q = (s * .7 + i / 10) % 1, r = 60 + q * 200; ctx.globalAlpha = (1 - q) * .55; ctx.drawImage(P.dust, x - 100 + i * 50 + q * 200 - r, gy - 40 - q * 100 - r * .6, r * 2, r * 1.2); } ctx.globalAlpha = 1; }
    if (td > 0 && td < .25) ddpFlashGlow(x, gy, 600, (1 - td / .25));
    ctx.fillStyle = '#050605'; for (let i = 0; i < 50; i++) { const xx = i * 38 - 200, hh = 40 + ddpR(i * 3) * 90; ctx.beginPath(); ctx.moveTo(xx - 5, hv + 20); ctx.quadraticCurveTo(xx, hv - hh * .5, xx + 4, hv - hh); ctx.quadraticCurveTo(xx + 6, hv - hh * .5, xx + 6, hv + 20); ctx.fill(); }
    ctx.restore();
    return td > 0 && td < .1 ? .5 : 0;
}
/* ---------- SHOT 4 : the wreck, the pilot, the torches ---------- */
function ddpM5Wreck(x, y, s, t) { // broken Lancaster on the ground, burning (nose left)
    const P = ddpEnsure();
    ctx.fillStyle = 'rgba(8,6,4,.8)'; ctx.beginPath(); ctx.ellipse(x + 60 * s, y + 6 * s, 220 * s, 14 * s, 0, 0, 7); ctx.fill();                                   // scorched ground
    // tail section, torn off and slewed
    ctx.save(); ctx.beginPath(); ctx.rect(x + 110 * s, y - 200 * s, 300 * s, 300 * s); ctx.clip(); ctx.translate(x + 40 * s, y - 4 * s); ctx.rotate(.1); ddpLanc(0, 0, s * .95, t, { dir: -1, props: 0, lit: 1, wy: .2 }); ctx.restore();
    // forward fuselage + wings
    ctx.save(); ctx.beginPath(); ctx.rect(x - 400 * s, y - 300 * s, 480 * s, 400 * s); ctx.clip(); ddpLanc(x, y - 6 * s, s, t, { dir: -1, ang: -.06, props: 0, lit: 1, wy: .22 }); ctx.restore();
    // torn metal at the break
    ctx.fillStyle = '#0a0b0a'; ctx.beginPath(); ctx.moveTo(x + 78 * s, y - 16 * s); for (let i = 0; i < 7; i++) ctx.lineTo(x + (78 + (i % 2 ? 10 : 2)) * s, y + (-14 + i * 4) * s); ctx.lineTo(x + 70 * s, y + 12 * s); ctx.fill();
    ctx.strokeStyle = 'rgba(255,150,70,.7)'; ctx.lineWidth = 1.4 * s / 3; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x + 80 * s, y + (-12 + i * 5) * s); ctx.lineTo(x + (92 + i * 3) * s, y + (-18 + i * 7) * s); ctx.stroke(); }
    // scattered debris
    for (let i = 0; i < 14; i++) { const dx = x + (ddpR(i * 3) - .3) * 360 * s, dy = y + (ddpR(i * 5) * 16 - 2) * s; ctx.save(); ctx.translate(dx, dy); ctx.rotate(ddpR(i) * 3); ctx.fillStyle = i % 3 ? '#121410' : '#1e2119'; ctx.fillRect(-6 * s, -2 * s, (8 + ddpR(i + 2) * 10) * s, 3 * s); ctx.restore(); if (i % 4 === 0) ddpFire(dx, dy, .25 * s / 3, t, i); }
    ddpFire(x - 20 * s, y - 10 * s, .55 * s / 3, t, 1); ddpFire(x + 30 * s, y - 2 * s, .75 * s / 3, t, 2); ddpFire(x + 75 * s, y - 4 * s, .6 * s / 3, t, 3); ddpFire(x - 70 * s, y + 4 * s, .35 * s / 3, t, 5);
    ddpSmoke(x + 20 * s, y - 30 * s, s / 3 * 1.7, t, 4, 180, 560, 1); ddpSmoke(x + 80 * s, y - 20 * s, s / 3 * 1.3, t, 8, 150, 460, .85);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { const q = (t * .4 + ddpR(i)) % 1, ex = x + (ddpR(i * 3) - .3) * 140 * s + Math.sin(t * 2 + i) * 20 - q * 80, ey = y - 20 * s - q * 320; ctx.fillStyle = 'rgba(255,' + (150 + ddpR(i) * 80) + ',60,' + (1 - q) + ')'; ctx.fillRect(ex, ey, 3, 3); } ctx.restore();
}
function ddpCrawler(x, y, s, t, k) { // pilot dragging himself, side view facing right
    const ph = t * 2.6, reach = Math.sin(ph), rim = 'rgba(255,150,70,.55)';
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(0, 1, 70, 4, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#1c1812'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-14, -9); ctx.lineTo(-42, -5); ctx.lineTo(-68, -3); ctx.stroke();                       // broken leg, dragged
    ctx.strokeStyle = '#d8d0c0'; ctx.lineWidth = 9.5; ctx.beginPath(); ctx.moveTo(-46, -5); ctx.lineTo(-54, -4); ctx.stroke(); ctx.strokeStyle = '#7a1e18'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-50, -7); ctx.lineTo(-52, -2); ctx.stroke();
    ctx.fillStyle = '#0e0c09'; ctx.beginPath(); ctx.ellipse(-71, -5, 7, 4, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#17140f'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-14, -9); ctx.lineTo(-34, -18 - Math.max(0, reach) * 6); ctx.lineTo(-52, -6); ctx.stroke();      // good leg pushing
    ctx.fillStyle = '#4a3422'; ctx.beginPath(); ctx.moveTo(-20, -6); ctx.quadraticCurveTo(-22, -24, 6, -24); ctx.lineTo(26, -22); ctx.quadraticCurveTo(32, -10, 22, -4); ctx.lineTo(-18, -2); ctx.fill();   // Irvin jacket
    ctx.fillStyle = rim; ctx.beginPath(); ctx.moveTo(-20, -8); ctx.quadraticCurveTo(-22, -24, 6, -24); ctx.lineTo(6, -22); ctx.quadraticCurveTo(-18, -20, -18, -8); ctx.fill();
    ctx.fillStyle = '#8a7356'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(20 + i * 2.2, -24 + Math.sin(i) * 2, 3.4, 0, 7); ctx.fill(); }                    // fleece collar
    ctx.fillStyle = '#2a1c12'; ctx.beginPath(); ctx.arc(36, -24, 8, 0, 7); ctx.fill(); ctx.fillStyle = '#5a3f2a'; ctx.beginPath(); ctx.arc(39, -21, 5, -.5, 2); ctx.fill(); ctx.fillStyle = '#5a6b7c'; ctx.fillRect(30, -33, 11, 3.4);   // head
    const ax = 50 + reach * 10; ctx.strokeStyle = '#3e2c1c'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(22, -18); ctx.lineTo(36 + reach * 6, -10); ctx.lineTo(ax, -3); ctx.stroke(); ctx.fillStyle = '#6a4a34'; ctx.beginPath(); ctx.arc(ax + 2, -2, 3.6, 0, 7); ctx.fill();
    ctx.strokeStyle = '#33251a'; ctx.beginPath(); ctx.moveTo(14, -16); ctx.lineTo(28 - reach * 6, -8); ctx.lineTo(40 - reach * 8, -2); ctx.stroke();
    ctx.restore();
}
function ddpM5Shot4(s, hv) {
    const P = ddpEnsure(); cs2Once('m5dogs', s > 2.4, function () { playTone(500, 380, .15, .05, 'square'); setTimeout(function () { try { playTone(520, 360, .15, .05, 'square'); } catch (e) {} }, 260); });
    ctx.save(); ddpCam(hv, -s * 12, 0, 1.06 + s * .012, 0);
    const gy = hv * .64; ddpNightSky(gy, s + 18, 0, { moonX: 1380, moonY: 450, glow: .5 });
    ctx.fillStyle = '#080b08'; for (let i = 0; i < 70; i++) { const x = i * 34 - 400, r = 24 + ddpR(i) * 26; ctx.beginPath(); ctx.arc(x, gy - 6 - ddpR(i + 4) * 12, r, 0, 7); ctx.fill(); }
    for (let i = 0; i < 5; i++) { const x = 200 + i * 340 + ddpR(i) * 80; ctx.fillStyle = '#060806'; ctx.beginPath(); ctx.ellipse(x, gy - 70, 34, 90, 0, 0, 7); ctx.fill(); }
    const gg = ctx.createLinearGradient(0, gy, 0, hv); gg.addColorStop(0, '#151a11'); gg.addColorStop(1, '#050605'); ctx.fillStyle = gg; ctx.fillRect(-800, gy, 3200, hv);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fl = ctx.createRadialGradient(820, gy + 80, 0, 820, gy + 80, 800); fl.addColorStop(0, 'rgba(255,120,40,' + (.4 + Math.sin(s * 9) * .05) + ')'); fl.addColorStop(1, 'rgba(255,90,30,0)'); ctx.fillStyle = fl; ctx.fillRect(0, gy - 700, 1700, 1400); ctx.restore();
    ctx.strokeStyle = 'rgba(30,22,14,.9)'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(2000, gy + 60); ctx.quadraticCurveTo(1300, gy + 70, 1000, gy + 110); ctx.stroke();   // the furrow
    ddpM5Wreck(820, gy + 110, 3.6, s);
    if (s > 1.8) { const a = cs2C((s - 1.8) / 1.2, 0, 1); ctx.globalAlpha = a; [[1520, 0], [1620, 1.3], [1720, 2.2], [1460, 3.1]].forEach(function (g, i) { ddpGerTorch(g[0] - (s - 1.8) * 26, gy + 18 + i * 4, 1.3, s, { ph: g[1], haze: .5 }); }); ctx.globalAlpha = 1; }
    const k = cs2C(s / 5.4, 0, 1); ddpFlashGlow(360 + k * 180, hv * .86, 220, .3); ddpCrawler(300 + k * 180, hv * .88, 3.2, s, k);
    ctx.fillStyle = '#030403'; for (let i = 0; i < 46; i++) { const xx = i * 40 - 200, hh = 30 + ddpR(i * 3) * 80, sw = Math.sin(s * 1.2 + i) * 5; ctx.beginPath(); ctx.moveTo(xx - 5, hv + 20); ctx.quadraticCurveTo(xx + sw * .4, hv - hh * .5, xx + 4 + sw, hv - hh); ctx.quadraticCurveTo(xx + 6, hv - hh * .5, xx + 6, hv + 20); ctx.fill(); }
    ctx.restore(); return 0;
}
/* ---------- SHOT 5 : one Webley ---------- */
function ddpWebley(x, y, sc, ang, open) { // Webley Mk VI revolver, side view, muzzle to the right
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(sc, sc);
    ctx.save(); ctx.translate(14, -8); ctx.rotate(open * .7);
    ctx.fillStyle = '#16181a'; ctx.fillRect(0, -6, 118, 12); ctx.fillStyle = '#26292c'; ctx.fillRect(0, -9, 118, 4); ctx.fillStyle = 'rgba(200,210,230,.5)'; ctx.fillRect(2, -9, 114, 1.4); ctx.fillStyle = '#0c0d0e'; ctx.fillRect(112, -14, 5, 6);   // barrel + rib + front sight
    ctx.fillStyle = '#121416'; ctx.fillRect(-26, -10, 30, 22); ctx.fillStyle = '#1e2124'; for (let i = 0; i < 3; i++) ctx.fillRect(-24 + i * 9, -8, 6, 18); ctx.fillStyle = 'rgba(200,210,230,.35)'; ctx.fillRect(-26, -10, 30, 1.6);   // cylinder
    if (open > .3) { ctx.fillStyle = '#c99a32'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-28, -6 + i * 7, 3, 0, 7); ctx.fill(); } }
    ctx.restore();
    ctx.fillStyle = '#121416'; ctx.beginPath(); ctx.moveTo(-14, -14); ctx.lineTo(14, -14); ctx.lineTo(18, 14); ctx.lineTo(-8, 20); ctx.closePath(); ctx.fill();   // frame
    ctx.fillStyle = '#0c0d0e'; ctx.beginPath(); ctx.moveTo(-14, -14); ctx.lineTo(-26, -24); ctx.lineTo(-20, -12); ctx.fill();                                     // hammer
    ctx.strokeStyle = '#121416'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(4, 20, 9, 0, Math.PI); ctx.stroke();                                                       // trigger guard
    ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.moveTo(-12, 14); ctx.lineTo(8, 16); ctx.quadraticCurveTo(-4, 52, -26, 62); ctx.lineTo(-40, 56); ctx.quadraticCurveTo(-22, 40, -12, 14); ctx.fill();   // bird's head grip
    ctx.strokeStyle = '#6a6a6a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(-34, 64, 5, 0, 7); ctx.stroke();
    ctx.restore();
}
function ddpM5Shot5(s, hv) {
    const P = ddpEnsure(); cs2Once('m5click', s > 1.6, function () { playTone(2400, 1800, .04, .06, 'square'); }); cs2Once('m5click2', s > 2.4, function () { playTone(2000, 1500, .05, .07, 'square'); }); const flare = 4.6, fd = s - flare; cs2Once('m5flare', fd > 0, function () { playTone(900, 1600, .8, .03, 'sine'); });
    const fire = .8 + Math.sin(s * 11) * .1 + Math.sin(s * 23) * .07;
    ctx.save(); ctx.translate(800, hv / 2); ctx.scale(1.02 + s * .014, 1.02 + s * .014); ctx.translate(-800, -hv / 2);
    // the fuselage behind him: curved stressed skin, panel seams, rivets, scorch
    const bg = ctx.createLinearGradient(0, -100, 0, hv + 100); bg.addColorStop(0, '#0d0f0c'); bg.addColorStop(.35, '#242a20'); bg.addColorStop(.55, '#2c3226'); bg.addColorStop(.75, '#151812'); bg.addColorStop(1, '#070806'); ctx.fillStyle = bg; ctx.fillRect(-100, -100, 1800, hv + 200);
    ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = 2.4; for (let r = 0; r < 6; r++) { const yy = -40 + r * 190; ctx.beginPath(); ctx.moveTo(-100, yy); ctx.lineTo(1700, yy + 6); ctx.stroke(); for (let c = 0; c < 8; c++) { const xx = c * 260 - 80 + (r % 2) * 130; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + 190); ctx.stroke(); } }
    ctx.fillStyle = 'rgba(150,150,130,.25)'; for (let r = 0; r < 6; r++) for (let i = 0; i < 70; i++) { ctx.beginPath(); ctx.arc(-100 + i * 26, -34 + r * 190, 2.2, 0, 7); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,230,.05)'; ctx.fillRect(-100, hv * .46, 1800, 22);
    [[150, '#c9a23a'], [132, '#1c2a52'], [86, '#e2ddcf'], [44, '#7a1e18']].forEach(function (r) { ctx.fillStyle = r[1]; ctx.beginPath(); ctx.arc(1110, hv * .36, r[0], 0, 7); ctx.fill(); });
    ctx.fillStyle = 'rgba(10,8,6,.55)'; ctx.beginPath(); ctx.ellipse(1010, hv * .45, 160, 90, -.4, 0, 7); ctx.fill();                                            // scorch over the roundel
    [[1220, hv * .22], [1290, hv * .5], [930, hv * .16]].forEach(function (b) { ctx.fillStyle = '#020202'; ctx.beginPath(); ctx.arc(b[0], b[1], 9, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(200,200,190,.4)'; ctx.lineWidth = 2; ctx.stroke(); });   // bullet holes
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fl = ctx.createRadialGradient(-150, hv * .65, 0, -150, hv * .65, 1200); fl.addColorStop(0, 'rgba(255,130,50,' + (.62 * fire) + ')'); fl.addColorStop(.5, 'rgba(255,100,40,' + (.18 * fire) + ')'); fl.addColorStop(1, 'rgba(255,90,40,0)'); ctx.fillStyle = fl; ctx.fillRect(-100, -100, 1800, hv + 200); ctx.restore();
    // smoke drifting through
    for (let i = 0; i < 7; i++) { const q = (s * .12 + i / 7) % 1, r = 300 + i * 30; ctx.globalAlpha = .28 * Math.sin(q * Math.PI); ctx.drawImage(P.dark, -300 + q * 2000 - r, hv * (.1 + (i % 3) * .2) - r * .4, r * 2, r * .8); } ctx.globalAlpha = 1;
    // the pilot
    const px = 640, py = hv * .5, look = cs2E(cs2C((s - 3.4) / .8, 0, 1)), breathe = Math.sin(s * 2.2) * 3;
    ctx.fillStyle = '#1c140c'; ctx.beginPath(); ctx.moveTo(px - 320, hv + 60); ctx.quadraticCurveTo(px - 300, py + 140, px - 120, py + 116 + breathe); ctx.lineTo(px + 150, py + 128 + breathe); ctx.quadraticCurveTo(px + 320, py + 170, px + 350, hv + 60); ctx.fill();
    ctx.fillStyle = 'rgba(255,140,60,' + (.3 * fire) + ')'; ctx.beginPath(); ctx.moveTo(px - 320, hv + 60); ctx.quadraticCurveTo(px - 300, py + 140, px - 120, py + 116 + breathe); ctx.lineTo(px - 120, py + 140); ctx.quadraticCurveTo(px - 270, py + 170, px - 290, hv + 60); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px + 20, py + 200); ctx.lineTo(px + 40, hv + 60); ctx.stroke(); ctx.fillStyle = '#6a6458'; ctx.fillRect(px + 18, py + 230, 12, 30);   // zip
    ctx.fillStyle = '#6e5840'; for (let i = 0; i < 26; i++) { const a = Math.PI * .95 + i / 25 * Math.PI * 1.1; ctx.beginPath(); ctx.arc(px + Math.cos(a) * 140, py + 140 + Math.sin(a) * 40 + breathe, 20 + ddpR(i) * 6, 0, 7); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,175,95,' + (.45 * fire) + ')'; for (let i = 0; i < 12; i++) { const a = Math.PI + i / 11 * Math.PI * .55; ctx.beginPath(); ctx.arc(px + Math.cos(a) * 140, py + 134 + Math.sin(a) * 40 + breathe, 12, 0, 7); ctx.fill(); }
    ctx.save(); ctx.translate(px, py + breathe * .5); ctx.rotate(-look * .14);
    ctx.fillStyle = '#2b1d14'; ctx.beginPath(); ctx.moveTo(-60, 100); ctx.lineTo(-50, 40); ctx.lineTo(40, 50); ctx.lineTo(40, 110); ctx.fill();
    const skin = ctx.createLinearGradient(-90, 0, 90, 0); skin.addColorStop(0, '#b87850'); skin.addColorStop(.35, '#6e4a33'); skin.addColorStop(1, '#2a1c13'); ctx.fillStyle = skin;
    ctx.beginPath(); ctx.moveTo(-90, -40); ctx.quadraticCurveTo(-96, -120, -10, -126); ctx.quadraticCurveTo(70, -122, 78, -60); ctx.lineTo(80, -30); ctx.lineTo(102, -4); ctx.lineTo(80, 4); ctx.quadraticCurveTo(86, 22, 76, 28); ctx.lineTo(78, 44); ctx.quadraticCurveTo(60, 76, 18, 74); ctx.quadraticCurveTo(-60, 70, -90, -40); ctx.fill();
    ctx.fillStyle = 'rgba(20,14,10,.35)'; ctx.beginPath(); ctx.moveTo(10, 30); ctx.quadraticCurveTo(60, 50, 78, 44); ctx.quadraticCurveTo(60, 76, 18, 74); ctx.fill();               // stubble
    ctx.fillStyle = 'rgba(255,200,160,.35)'; ctx.beginPath(); ctx.ellipse(70, -36, 8, 18, .2, 0, 7); ctx.fill();                                                                   // nose bridge highlight
    ctx.fillStyle = '#0e0906'; ctx.beginPath(); ctx.ellipse(50, -42, 10, 4.6, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,225,190,.85)'; ctx.fillRect(53 + look * 3, -44, 3, 2);
    ctx.fillStyle = '#1a0f09'; ctx.beginPath(); ctx.moveTo(28, -62); ctx.lineTo(74, -60); ctx.lineTo(70, -54); ctx.lineTo(28, -56); ctx.fill();
    ctx.strokeStyle = 'rgba(30,16,10,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(62, 18); ctx.quadraticCurveTo(70, 22, 78, 18); ctx.stroke();                         // mouth
    ctx.fillStyle = '#6a1712'; ctx.beginPath(); ctx.moveTo(-14, -96); ctx.quadraticCurveTo(26, -76, 14, -32); ctx.lineTo(8, -62); ctx.fill(); ctx.fillStyle = 'rgba(20,14,10,.4)'; ctx.beginPath(); ctx.ellipse(30, 0, 14, 8, .4, 0, 7); ctx.fill();   // blood + soot
    ctx.fillStyle = '#21160e'; ctx.beginPath(); ctx.moveTo(-104, 10); ctx.quadraticCurveTo(-112, -138, -6, -142); ctx.quadraticCurveTo(66, -140, 80, -80); ctx.lineTo(30, -82); ctx.quadraticCurveTo(-20, -84, -40, -20); ctx.lineTo(-30, 40); ctx.quadraticCurveTo(-80, 50, -104, 10); ctx.fill();
    ctx.strokeStyle = 'rgba(80,58,40,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-60, -128); ctx.quadraticCurveTo(-30, -60, -50, 20); ctx.stroke();
    ctx.fillStyle = 'rgba(255,150,70,' + (.6 * fire) + ')'; ctx.beginPath(); ctx.moveTo(-104, 10); ctx.quadraticCurveTo(-112, -138, -6, -142); ctx.lineTo(-6, -134); ctx.quadraticCurveTo(-98, -128, -94, 10); ctx.fill();
    ctx.fillStyle = '#140d08'; ctx.beginPath(); ctx.ellipse(-40, -10, 30, 36, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#2c2016'; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = '#140d08'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-40, 26); ctx.quadraticCurveTo(-10, 66, 40, 70); ctx.stroke();   // earpiece + chin strap
    ctx.fillStyle = '#34424e'; ctx.beginPath(); ctx.ellipse(10, -132, 36, 15, -.1, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(200,220,255,.55)'; ctx.beginPath(); ctx.ellipse(20, -134, 14, 7, -.1, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,170,90,.6)'; ctx.beginPath(); ctx.ellipse(-8, -134, 10, 6, -.1, 0, 7); ctx.fill();
    ctx.fillStyle = '#262c24'; ctx.beginPath(); ctx.moveTo(60, 40); ctx.quadraticCurveTo(92, 92, 40, 132); ctx.lineTo(20, 122); ctx.quadraticCurveTo(62, 90, 40, 50); ctx.fill(); ctx.strokeStyle = '#1a1e18'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(30, 128); ctx.quadraticCurveTo(0, 200, -40, 240); ctx.stroke();
    ctx.restore();
    // hands + Webley
    const open = s > 1.0 && s < 1.6 ? cs2C((s - 1.0) / .2, 0, 1) * cs2C((1.6 - s) / .2, 0, 1) : 0, rx = px + 190, ry = hv * .8 - Math.min(1, s / 2.4) * 70 + breathe;
    ddpWebley(rx, ry, 1.5, -.22 - open * .2, open);
    ctx.fillStyle = '#5a3c28'; ctx.beginPath(); ctx.ellipse(rx - 34, ry + 46, 40, 30, -.5, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,160,90,' + (.45 * fire) + ')'; ctx.beginPath(); ctx.ellipse(rx - 50, ry + 36, 20, 12, -.5, 0, 7); ctx.fill();
    ctx.strokeStyle = '#4a3222'; ctx.lineWidth = 14; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(rx - 20 + i * 4, ry + 30 + i * 12); ctx.lineTo(rx + 2 + i * 2, ry + 40 + i * 12); ctx.stroke(); }
    ctx.fillStyle = '#1c140c'; ctx.beginPath(); ctx.moveTo(rx - 60, ry + 60); ctx.quadraticCurveTo(rx - 140, ry + 120, rx - 160, hv + 60); ctx.lineTo(rx - 40, hv + 60); ctx.quadraticCurveTo(rx - 30, ry + 120, rx - 20, ry + 70); ctx.fill();
    ctx.restore();
    // embers + torch beams + the flare
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const q = (s * .3 + ddpR(i)) % 1, x = ddpR(i * 3) * 900 - 100 + q * 300 + Math.sin(s * 2 + i) * 20, y = hv * (1 - q * 1.1); ctx.fillStyle = 'rgba(255,' + (140 + ddpR(i) * 90) + ',60,' + (1 - q) + ')'; ctx.fillRect(x, y, 3, 3); } ctx.restore();
    const a = cs2C((s - 2.0) / 1.2, 0, 1); for (let i = 0; i < 3; i++) ddpSearch(1720, hv * (.2 + i * .25), Math.PI + Math.sin(s * 1.1 + i * 2) * .25, 1500, .15 * a, 110);
    if (fd > 0) { const fx = 1300 - fd * 30, fy = hv * .08 - fd * 30; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, 1500); fg.addColorStop(0, 'rgba(220,255,210,' + Math.min(.55, fd * .7) + ')'); fg.addColorStop(1, 'rgba(160,220,160,0)'); ctx.fillStyle = fg; ctx.fillRect(-100, -100, 1800, hv + 200); ctx.restore(); ddpFlashGlow(fx, fy, 70, 1); }
    return 0;
}
function ddpM5Frame(t, w, h) {
    const U = w / 1600, hv = h / U, c = M5CS.cuts; let flash = 0; DDP.ok = true;
    ctx.save(); ctx.scale(U, U);
    if (t < c[0]) flash = ddpM5Shot1(t, hv); else if (t < c[1]) flash = ddpM5Shot2(t - c[0], hv); else if (t < c[2]) flash = ddpM5Shot3(t - c[1], hv); else if (t < c[3]) flash = ddpM5Shot4(t - c[2], hv); else flash = ddpM5Shot5(t - c[3], hv);
    ctx.restore(); ddpBloom(w, h); return flash;
}
