/* =====================================================
   MISSION 12 CUTSCENES — HD REBUILD
   Intro: the War Cabinet map table · flying in over Peenemünde (projected terrain) · the A4 on Prüfstand VII
          · the landing craft run in · the pines at the wire · ROCKET RAID
   Ending: MTB 718 escaping a burning coast · the rocket destroyed on its table · dawn, the column of smoke
===================================================== */
const H12 = { c: {} };
function h12Cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function h12K(t, a, b) { return Math.max(0, Math.min(1, (t - a) / (b - a))); }
function h12E(k) { return k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }
/* ---------- textures ---------- */
function h12Puff(rgb, seed, soft) { const key = 'p' + rgb + seed + (soft || 0); if (H12.c[key]) return H12.c[key]; const c = h12Cv(256, 256), g = c.getContext('2d'), r = m12Rng(seed);
    for (let i = 0; i < 46; i++) { const a = r() * 6.28, d = Math.pow(r(), .7) * 70, x = 128 + Math.cos(a) * d, y = 128 + Math.sin(a) * d, rr = 30 + r() * 46, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(' + rgb + ',' + (soft ? .16 : .3) + ')'); gr.addColorStop(1, 'rgba(' + rgb + ',0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); }
    g.globalCompositeOperation = 'destination-in'; const m = g.createRadialGradient(128, 128, 40, 128, 128, 128); m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = m; g.fillRect(0, 0, 256, 256); H12.c[key] = c; return c; }
function h12Dot(x, y, r, rgb, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')'); g.addColorStop(1, 'rgba(' + rgb + ',0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
function h12Glow(x, y, r, rgb, a) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(x, y, r, rgb, a); ctx.restore(); }
function h12Stars(hv) { const key = 'stars' + Math.round(hv); if (H12.c[key]) return H12.c[key]; const c = h12Cv(1800, Math.ceil(hv)), g = c.getContext('2d'), r = m12Rng(77);
    g.save(); g.translate(900, hv * .3); g.rotate(-.35); const mw = g.createLinearGradient(0, -120, 0, 120); mw.addColorStop(0, 'rgba(140,150,190,0)'); mw.addColorStop(.5, 'rgba(140,150,190,.09)'); mw.addColorStop(1, 'rgba(140,150,190,0)'); g.fillStyle = mw; g.fillRect(-1200, -120, 2400, 240); g.restore();
    for (let i = 0; i < 1400; i++) { const x = r() * 1800, y = Math.pow(r(), 1.3) * hv * .8, b = Math.pow(r(), 3); g.fillStyle = 'rgba(' + (200 + b * 55 | 0) + ',' + (210 + b * 45 | 0) + ',255,' + (.25 + b * .75) + ')'; g.fillRect(x, y, b > .7 ? 2 : 1.1, b > .7 ? 2 : 1.1); if (b > .9) { g.fillStyle = 'rgba(220,230,255,.15)'; g.beginPath(); g.arc(x + 1, y + 1, 4, 0, 7); g.fill(); } }
    H12.c[key] = c; return c; }
function h12CloudBank(seed, lit, dark) { const key = 'cb' + seed + lit; if (H12.c[key]) return H12.c[key]; const c = h12Cv(2600, 520), g = c.getContext('2d'), r = m12Rng(seed), tmp = h12Cv(2600, 520), q = tmp.getContext('2d');
    const D = h12Puff(dark, seed * 3 + 1, 1), Lp = h12Puff(lit, seed * 3 + 2, 1);
    for (let cl = 0; cl < 14; cl++) { const cx = r() * 2600, cy = 170 + r() * 220, cw = 260 + r() * 520, chh = 50 + r() * 90;
        for (let i = 0; i < 26; i++) { const x = cx + (r() - .5) * cw, y = cy + (r() - .5) * chh * .8, rw = 120 + r() * 220, rh = rw * (.32 + r() * .2); q.globalAlpha = .55 + r() * .4; q.drawImage(D, x - rw, y - rh, rw * 2, rh * 2); }
        for (let i = 0; i < 16; i++) { const x = cx + (r() - .5) * cw * .9, y = cy - chh * .35 + (r() - .5) * chh * .4, rw = 90 + r() * 170, rh = rw * (.25 + r() * .15); q.globalAlpha = .25 + r() * .3; q.drawImage(Lp, x - rw, y - rh, rw * 2, rh * 2); } }
    g.filter = 'blur(5px)'; g.drawImage(tmp, 0, 0); g.filter = 'none'; H12.c[key] = c; return c; }
function h12Moon(x, y, r, halo) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(x, y, r * 9, '170,190,230', .16 * (halo || 1)); h12Dot(x, y, r * 3, '210,220,245', .3 * (halo || 1)); ctx.restore();
    const g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, '#fbfbf2'); g.addColorStop(1, '#c8ccc6'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(120,130,140,.28)'; [[-.3, -.1, .28], [.25, .2, .2], [.1, -.4, .14], [-.15, .35, .16]].forEach(function (q) { ctx.beginPath(); ctx.arc(x + q[0] * r, y + q[1] * r, q[2] * r, 0, 7); ctx.fill(); }); }
function h12Beam(x, y, ang, len, half, a, warm) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.rotate(ang); const col = warm ? '255,230,180' : '210,225,255';
    [[1, a], [.45, a * 1.2]].forEach(function (q) { const g = ctx.createLinearGradient(0, 0, len, 0); g.addColorStop(0, 'rgba(' + col + ',' + q[1] + ')'); g.addColorStop(.6, 'rgba(' + col + ',' + q[1] * .35 + ')'); g.addColorStop(1, 'rgba(' + col + ',0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(len, -len * half * q[0]); ctx.lineTo(len, len * half * q[0]); ctx.lineTo(0, 2); ctx.closePath(); ctx.fill(); });
    h12Dot(0, 0, 26, col, a * 3); ctx.restore(); }
function h12Column(x, y, t, o) { // a rising smoke column, lit from below by fire
    const N = o.n || 26, H = o.h || 600, W = o.w || 120, sp = o.speed || .06, smoke = h12Puff(o.rgb || '28,24,22', (o.seed || 1) * 7), lit = h12Puff(o.lit || '255,140,60', (o.seed || 1) * 7 + 3);
    for (let i = 0; i < N; i++) { const k = (t * sp + i / N) % 1, px = x + (o.lean || 0) * k * H + Math.sin(i * 2.3 + t * .4) * W * .3 * k, py = y - k * H, r = W * (.35 + k * 1.1);
        ctx.globalAlpha = Math.min(1, k * 6) * (1 - k) * (o.a || .85); ctx.drawImage(smoke, px - r, py - r, r * 2, r * 2);
        if (o.lit !== null) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.max(0, .55 - k * 1.4) * (o.la || 1); ctx.drawImage(lit, px - r * .8, py - r * .5, r * 1.6, r * 1.6); ctx.restore(); } }
    ctx.globalAlpha = 1; }
function h12Fire(x, y, s, t, seed) { const f = h12Puff('255,150,50', seed * 3 + 1), w = h12Puff('255,236,170', seed * 3 + 2); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 14; i++) { const k = (t * 1.3 + i / 14 + ddpR(seed + i) * .3) % 1, px = x + (ddpR(i + seed) - .5) * 60 * s + Math.sin(t * 6 + i) * 6 * s, py = y - k * 120 * s, r = (30 - k * 18) * s; ctx.globalAlpha = (1 - k) * .8; ctx.drawImage(k < .3 ? w : f, px - r, py - r * 1.4, r * 2, r * 2.8); }
    ctx.restore(); ctx.globalAlpha = 1; h12Glow(x, y - 30 * s, 180 * s, '255,140,60', .25); }
function h12Fireball(x, y, k, s, seed) { // k = seconds since detonation
    if (k < 0) return; const fire = h12Puff('255,150,50', seed), hot = h12Puff('255,240,200', seed + 1), smoke = h12Puff('34,26,22', seed + 2), R = s * (70 + 300 * (1 - Math.exp(-k * 2.6))), rise = k * 70 * s;
    for (let i = 0; i < 40; i++) { const a = ddpR(seed + i) * 6.28, d = Math.pow(ddpR(seed + i * 3), .6) * R, px = x + Math.cos(a) * d * 1.15, py = y - rise - Math.abs(Math.sin(a)) * d * .9 - (1 - Math.cos(a)) * 0, r = R * (.35 + ddpR(i + 9) * .35);
        ctx.globalAlpha = Math.min(1, k * 1.2) * .9; ctx.drawImage(smoke, px - r, py - r, r * 2, r * 2); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const heat = Math.max(0, 1 - k / 5);
    for (let i = 0; i < 46; i++) { const a = ddpR(seed + i * 5) * 6.28, d = Math.pow(ddpR(seed + i * 7), .8) * R * .9, px = x + Math.cos(a) * d, py = y - rise * .8 - Math.abs(Math.sin(a)) * d * .8, r = R * (.25 + ddpR(i + 4) * .35); ctx.globalAlpha = heat * .42; ctx.drawImage(d < R * .3 && k < 1.2 ? hot : fire, px - r, py - r, r * 2, r * 2); }
    ctx.restore(); ctx.globalAlpha = 1;
    // the stem
    for (let i = 0; i < 10; i++) { const py = y - i * rise / 10, r = s * (60 + i * 6) * Math.min(1, k); ctx.globalAlpha = .7 * Math.min(1, k); ctx.drawImage(smoke, x - r + Math.sin(i) * 10, py - r, r * 2, r * 2); } ctx.globalAlpha = 1;
    h12Glow(x, y - rise, R * 2, '255,150,70', .2 * heat); if (k < .2) h12Glow(x, y - 40, R * 2, '255,250,230', .8 * (1 - k / .2)); }
function h12Treeline(y, h, seed, col, x0, x1) { const r = m12Rng(seed); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x0, y + 60); for (let x = x0; x <= x1; x += 24) ctx.lineTo(x, y - h * .18 - Math.sin(x * .006 + seed) * h * .14 - Math.sin(x * .021 + seed * 2) * h * .06); ctx.lineTo(x1, y + 60); ctx.closePath(); ctx.fill();
    for (let x = x0; x <= x1;) { if (r() < .12) { x += 20 + r() * 50; continue; } const base = y - h * .18 - Math.sin(x * .006 + seed) * h * .14 - Math.sin(x * .021 + seed * 2) * h * .06, th = h * (.35 + Math.pow(r(), 1.4) * .9), tw = th * (.28 + r() * .12);
        ctx.beginPath(); ctx.moveTo(x - tw * .5, base + 4); for (let k = 0; k < 5; k++) { const yy = base - th * (k / 5), ww = tw * (1 - k / 5) * .5; ctx.lineTo(x - ww - r() * 3, yy); ctx.lineTo(x - ww * .45, yy - th * .08); } ctx.lineTo(x, base - th); for (let k = 4; k >= 0; k--) { const yy = base - th * (k / 5), ww = tw * (1 - k / 5) * .5; ctx.lineTo(x + ww * .45, yy - th * .08); ctx.lineTo(x + ww + r() * 3, yy); } ctx.closePath(); ctx.fill(); x += tw * (.35 + r() * .45); } }
function h12Trunk(x, w, top, bot, rim, seed) { const g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#060504'); g.addColorStop(.62, '#1c140e'); g.addColorStop(.86, '#3a2a1e'); g.addColorStop(1, rim || '#6a5a50'); ctx.fillStyle = g; ctx.fillRect(x, top, w, bot - top);
    const r = m12Rng(seed); ctx.fillStyle = 'rgba(0,0,0,.45)'; for (let i = 0; i < (bot - top) / 22; i++) { const yy = top + r() * (bot - top); ctx.fillRect(x + r() * w * .5, yy, w * (.3 + r() * .5), 2 + r() * 3); } ctx.fillStyle = 'rgba(160,120,90,.12)'; for (let i = 0; i < (bot - top) / 30; i++) ctx.fillRect(x + w * .55 + r() * w * .35, top + r() * (bot - top), 2, 10 + r() * 30); }
/* ---------- subjects ---------- */
function h12V2(x, by, s, o) { // the A4 in side view, standing on its launch table; light from the floodlights (left) and the moon (right)
    o = o || {}; ctx.save(); ctx.translate(x, by); ctx.scale(s, s); const H = 470, R = 28, t = o.t || 0;
    const prof = function () { ctx.beginPath(); ctx.moveTo(-R * .74, -8); ctx.lineTo(-R, -118); ctx.lineTo(-R, -330); ctx.bezierCurveTo(-R, -400, -R * .55, -450, 0, -H); ctx.bezierCurveTo(R * .55, -450, R, -400, R, -330); ctx.lineTo(R, -118); ctx.lineTo(R * .74, -8); ctx.closePath(); };
    // fins (two in profile, one edge-on)
    const fin = function (sd) { ctx.beginPath(); ctx.moveTo(sd * R * .95, -150); ctx.lineTo(sd * (R + 62), -36); ctx.lineTo(sd * (R + 64), -2); ctx.lineTo(sd * R * .72, -2); ctx.closePath(); };
    [-1, 1].forEach(function (sd) { fin(sd); const fg = ctx.createLinearGradient(sd * R, -150, sd * (R + 64), 0); fg.addColorStop(0, sd < 0 ? '#e8e8e0' : '#141414'); fg.addColorStop(1, sd < 0 ? '#9a9a92' : '#2a2a2a'); ctx.fillStyle = fg; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.fillStyle = '#1a1a1a'; ctx.fillRect(sd > 0 ? R + 50 : -R - 64, -10, 14, 8); });
    prof(); const bg = ctx.createLinearGradient(-R, 0, R, 0); bg.addColorStop(0, '#fdfdf6'); bg.addColorStop(.35, '#e6e6de'); bg.addColorStop(.75, '#9a9a94'); bg.addColorStop(1, '#5e6066'); ctx.fillStyle = bg; ctx.fill();
    ctx.save(); prof(); ctx.clip();
    // the black-and-white quarters of the test paint scheme
    ctx.fillStyle = '#101010'; [[-118, -175, 1], [-175, -230, 0], [-230, -290, 1], [-290, -330, 0]].forEach(function (b) { ctx.fillRect(b[2] ? 0 : -R, b[1], R, b[0] - b[1]); }); ctx.fillRect(-R, -330, R * 2, 5); ctx.fillRect(0, -420, R, 90);
    // shading to round the body
    const sh = ctx.createLinearGradient(-R, 0, R, 0); sh.addColorStop(0, 'rgba(255,255,255,.18)'); sh.addColorStop(.3, 'rgba(255,255,255,0)'); sh.addColorStop(.7, 'rgba(0,0,0,.18)'); sh.addColorStop(1, 'rgba(0,0,0,.5)'); ctx.fillStyle = sh; ctx.fillRect(-R, -H, R * 2, H);
    // seams, rivets, hatches
    ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1; [-118, -175, -230, -290, -330, -380].forEach(function (y) { ctx.beginPath(); ctx.moveTo(-R, y); ctx.lineTo(R, y); ctx.stroke(); }); ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let y = -125; y > -330; y -= 9) { ctx.fillRect(-R + 3, y, 1.2, 1.2); ctx.fillRect(R - 5, y, 1.2, 1.2); }
    ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.strokeRect(-12, -312, 14, 10); ctx.strokeRect(6, -150, 10, 16);
    // frost on the oxygen tank, venting
    if (o.frost !== false) { const fr = ctx.createLinearGradient(0, -268, 0, -186); fr.addColorStop(0, 'rgba(235,245,255,0)'); fr.addColorStop(.2, 'rgba(235,245,255,.75)'); fr.addColorStop(.8, 'rgba(235,245,255,.65)'); fr.addColorStop(1, 'rgba(235,245,255,0)'); ctx.fillStyle = fr; ctx.fillRect(-R, -268, R * 2, 82); const rr = m12Rng(5); ctx.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 90; i++) ctx.fillRect(-R + rr() * R * 2, -262 + rr() * 70, 1.4, 1.4); }
    ctx.fillStyle = 'rgba(20,20,20,.75)'; ctx.font = '700 11px "Stardos Stencil", Impact'; ctx.textAlign = 'center'; ctx.fillText('A4', -12, -360);
    ctx.restore();
    ctx.strokeStyle = 'rgba(210,225,255,.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(R, -118); ctx.lineTo(R, -330); ctx.bezierCurveTo(R, -400, R * .55, -450, 0, -H); ctx.stroke(); // moon rim
    ctx.strokeStyle = 'rgba(255,240,210,.55)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-R, -120); ctx.lineTo(-R, -330); ctx.stroke(); // flood rim
    // umbilical + cable mast
    if (o.mast !== false) { ctx.fillStyle = '#1a1a18'; ctx.fillRect(-R - 70, -170, 8, 172); ctx.strokeStyle = '#141412'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-R - 62, -160); ctx.quadraticCurveTo(-R - 30, -150, -R + 1, -140); ctx.stroke(); }
    // the launch table with its blast deflector
    ctx.fillStyle = '#2a2a26'; ctx.beginPath(); ctx.moveTo(-40, 26); ctx.lineTo(40, 26); ctx.lineTo(0, 64); ctx.closePath(); ctx.fill();
    const tg = ctx.createLinearGradient(0, -6, 0, 26); tg.addColorStop(0, '#6a6a62'); tg.addColorStop(1, '#2a2a26'); ctx.fillStyle = tg; ctx.fillRect(-96, -6, 192, 22); ctx.fillStyle = 'rgba(255,240,210,.35)'; ctx.fillRect(-96, -6, 192, 2);
    ctx.fillStyle = '#1e1e1a'; [[-90, 16], [70, 16]].forEach(function (l) { ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(l[0] + 20, l[1]); ctx.lineTo(l[0] + 26, 70); ctx.lineTo(l[0] - 6, 70); ctx.closePath(); ctx.fill(); });
    ctx.restore();
    if (o.vent) { const P = h12Puff('235,242,255', 4); for (let i = 0; i < 10; i++) { const k = ((t * .35) + i / 10) % 1, r = (14 + k * 70) * s; ctx.globalAlpha = (1 - k) * .55; ctx.drawImage(P, x + (R + 4 + k * 90) * s - r, by - 262 * s - k * 40 * s - r, r * 2, r * 2); } ctx.globalAlpha = 1; }
}
function h12Gantry(x, by, s, t, o) { o = o || {}; ctx.save(); ctx.translate(x, by); ctx.scale(s, s); const Hh = 540, W = 90;
    ctx.strokeStyle = o.col || '#1c1c1a'; ctx.lineCap = 'square'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -Hh); ctx.moveTo(W, 0); ctx.lineTo(W, -Hh); ctx.stroke();
    ctx.lineWidth = 2.6; for (let y = 0; y > -Hh; y -= 45) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y - 45); ctx.moveTo(W, y); ctx.lineTo(0, y - 45); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    [-120, -230, -340, -450].forEach(function (y, i) { ctx.fillStyle = o.col || '#1c1c1a'; ctx.fillRect(-60, y, 60, 6); ctx.strokeStyle = o.col || '#1c1c1a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-60, y); ctx.lineTo(-60, y - 22); ctx.lineTo(0, y - 22); ctx.moveTo(-60, y - 11); ctx.lineTo(0, y - 11); ctx.stroke();
        if (o.lamps !== false) { const fl = .8 + .2 * Math.sin(t * 9 + i * 3); h12Glow(-50, y - 26, 60, '255,220,160', .35 * fl); ctx.fillStyle = '#fff2d0'; ctx.fillRect(-52, y - 28, 4, 3); } });
    ctx.strokeStyle = 'rgba(210,225,255,.35)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(W + 3, 0); ctx.lineTo(W + 3, -Hh); ctx.stroke();
    ctx.fillStyle = o.col || '#1c1c1a'; ctx.fillRect(-8, -Hh - 14, W + 16, 14); ctx.fillRect(20, -Hh - 60, 6, 50); h12Glow(23, -Hh - 62, 14, '255,60,40', .35 + .3 * Math.sin(t * 3)); ctx.fillStyle = '#ff5a40'; ctx.fillRect(21, -Hh - 64, 4, 4); // aircraft warning lamp
    ctx.restore(); }
function h12Lanc(x, y, s, a) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a === undefined ? 1 : a; ctx.fillStyle = '#05070a';
    ctx.beginPath(); ctx.moveTo(-70, -1); ctx.quadraticCurveTo(-72, -5, -60, -6); ctx.lineTo(56, -5); ctx.quadraticCurveTo(68, -3, 70, 1); ctx.lineTo(56, 5); ctx.lineTo(-60, 5); ctx.closePath(); ctx.fill(); // fuselage
    ctx.beginPath(); ctx.moveTo(-14, -2); ctx.lineTo(24, -2); ctx.lineTo(26, 2); ctx.lineTo(-16, 2); ctx.fill(); [-10, 2, 12, 22].forEach(function (ex) { ctx.beginPath(); ctx.ellipse(ex, 4, 7, 3.4, 0, 0, 7); ctx.fill(); });
    [[-64, -16], [-58, -16]].forEach(function (f) { ctx.fillRect(f[0], f[1], 3, 22); }); ctx.fillRect(-66, -2, 14, 3);
    ctx.beginPath(); ctx.arc(46, -6, 4, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.arc(-6, -6, 3.4, Math.PI, 0); ctx.fill(); ctx.restore(); }
function h12MTB(x, y, s, t, o) { o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const P = h12Puff('235,242,250', 21);
    // wake + spray
    for (let i = 0; i < 16; i++) { const k = (t * 1.8 + i / 16) % 1; ctx.globalAlpha = (1 - k) * .45; const r = 26 + k * 70; ctx.drawImage(P, 150 + k * 420 - r, 6 - r * .4 + Math.sin(i) * 6, r * 2, r * .8); } ctx.globalAlpha = 1;
    for (let i = 0; i < 10; i++) { const k = (t * 2.6 + i / 10) % 1; ctx.globalAlpha = (1 - k) * .35; const r = 12 + k * 30; ctx.drawImage(P, -150 + k * 60 - r, -12 - Math.sin(k * 3) * 30 - r * .5, r * 2, r); } ctx.globalAlpha = 1;
    // hull
    const hg = ctx.createLinearGradient(0, -26, 0, 14); hg.addColorStop(0, '#6a7480'); hg.addColorStop(.25, '#3a424c'); hg.addColorStop(1, '#151a20'); ctx.fillStyle = hg; ctx.beginPath(); ctx.moveTo(-170, -26); ctx.quadraticCurveTo(-90, -24, 120, -16); ctx.lineTo(160, -14); ctx.lineTo(158, 10); ctx.lineTo(-110, 12); ctx.quadraticCurveTo(-150, 6, -170, -26); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(220,230,245,.6)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-170, -26); ctx.quadraticCurveTo(-90, -24, 160, -14); ctx.stroke();
    const wl = ctx.createLinearGradient(0, -2, 0, 12); wl.addColorStop(0, 'rgba(0,0,0,0)'); wl.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = wl; ctx.fillRect(-150, -4, 310, 16);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fm = ctx.createLinearGradient(-170, 0, 160, 0); fm.addColorStop(0, 'rgba(230,240,255,.85)'); fm.addColorStop(.35, 'rgba(230,240,255,.25)'); fm.addColorStop(1, 'rgba(230,240,255,.5)'); ctx.fillStyle = fm; ctx.beginPath(); ctx.moveTo(-170, 6); ctx.quadraticCurveTo(-140, -4, -110, 8); ctx.lineTo(160, 6); ctx.lineTo(160, 13); ctx.lineTo(-170, 13); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#e8e4d8'; ctx.font = '700 16px "Stardos Stencil", Impact'; ctx.fillText('718', -130, -6); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1; for (let px = -100; px < 150; px += 36) { ctx.beginPath(); ctx.moveTo(px, -20); ctx.lineTo(px + 2, 8); ctx.stroke(); }
    ctx.fillStyle = '#8a9098'; [[-4, -30], [20, -29]].forEach(function (f) { ctx.beginPath(); ctx.ellipse(f[0], f[1], 10, 4, 0, 0, 7); ctx.fill(); }); ctx.fillStyle = '#1a1e24'; [[96, -16], [110, -16]].forEach(function (d) { ctx.beginPath(); ctx.arc(d[0], d[1] - 4, 4, 0, 7); ctx.fill(); });
    ctx.strokeStyle = '#14181c'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-120, -30); ctx.lineTo(-150, -40); ctx.moveTo(136, -26); ctx.lineTo(160, -36); ctx.stroke(); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-20, -86); ctx.lineTo(140, -24); ctx.moveTo(-20, -86); ctx.lineTo(-150, -26); ctx.stroke();
    ctx.fillStyle = '#2a3038'; ctx.beginPath(); ctx.moveTo(-60, -24); ctx.lineTo(10, -21); ctx.lineTo(16, -48); ctx.lineTo(-40, -50); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(160,190,220,.35)'; ctx.fillRect(-36, -46, 40, 6); // bridge
    ctx.fillStyle = '#20262c'; ctx.fillRect(-20, -86, 3, 38); ctx.fillRect(-30, -78, 22, 2); ctx.fillStyle = '#1a1e24'; [[40, -20], [80, -18]].forEach(function (tt) { ctx.fillRect(tt[0], tt[1] - 8, 30, 8); }); ctx.fillRect(110, -24, 18, 8); ctx.fillRect(126, -26, 18, 2); // tubes + pom-pom
    if (o.ensign !== false) { ctx.fillStyle = '#e8e4dc'; ctx.save(); ctx.translate(-20, -86); const wv = Math.sin(t * 8) * 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(24, wv); ctx.lineTo(24, 14 + wv); ctx.lineTo(0, 14); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#b02020'; ctx.fillRect(0, 5.5, 24, 3); ctx.fillRect(10, 0, 3, 14); ctx.restore(); }
    // crew looking back at the coast
    [[-56, -52], [-10, -50], [30, -26], [60, -24], [96, -24]].forEach(function (c, i) { ctx.fillStyle = '#0c0e10'; ctx.beginPath(); ctx.arc(c[0], c[1] - 10, 5, 0, 7); ctx.fill(); ctx.fillRect(c[0] - 5, c[1] - 6, 10, 12); ctx.fillStyle = 'rgba(255,170,90,.6)'; ctx.fillRect(c[0] + 3, c[1] - 13, 2, 7); });
    ctx.restore(); }
function h12LCA(x, y, s, t, o) { o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const P = h12Puff('230,238,248', 31);
    for (let i = 0; i < 12; i++) { const k = (t * 1.2 + i / 12) % 1; ctx.globalAlpha = (1 - k) * .35; const r = 22 + k * 80; ctx.drawImage(P, -260 - k * 420 - r, 20 - r * .3, r * 2, r * .6); } ctx.globalAlpha = 1;
    for (let i = 0; i < 8; i++) { const k = (t * 1.7 + i / 8) % 1; ctx.globalAlpha = (1 - k) * .55; const r = 20 + k * 50; ctx.drawImage(P, 300 + k * 20 - r, -10 - Math.sin(k * 3) * 40 - r * .5, r * 2, r); } ctx.globalAlpha = 1;
    const hg = ctx.createLinearGradient(0, -60, 0, 34); hg.addColorStop(0, '#5a6470'); hg.addColorStop(.18, '#2e3640'); hg.addColorStop(1, '#0c1014'); ctx.fillStyle = hg; ctx.beginPath(); ctx.moveTo(-300, -52); ctx.lineTo(250, -62); ctx.lineTo(312, -28); ctx.lineTo(300, 32); ctx.lineTo(-290, 32); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(210,225,250,.75)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-300, -52); ctx.lineTo(250, -62); ctx.lineTo(312, -28); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = 1.4; for (let px = -230; px < 260; px += 80) { ctx.beginPath(); ctx.moveTo(px, -55); ctx.lineTo(px + 4, 30); ctx.stroke(); } ctx.fillStyle = 'rgba(200,215,240,.3)'; for (let px = -290; px < 290; px += 20) ctx.fillRect(px, -46 - (px + 300) * .017, 2, 2);
    ctx.fillStyle = '#e8e2c8'; ctx.font = '700 20px "Stardos Stencil", Impact'; ctx.fillText(o.num || 'LCA 873', -210, -12);
    ctx.fillStyle = '#1e242c'; ctx.beginPath(); ctx.moveTo(250, -62); ctx.lineTo(296, -98); ctx.lineTo(326, -40); ctx.lineTo(312, -28); ctx.fill(); ctx.strokeStyle = 'rgba(210,225,250,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(250, -62); ctx.lineTo(296, -98); ctx.stroke();
    ctx.fillStyle = '#1a2028'; ctx.fillRect(-300, -100, 62, 48); ctx.strokeStyle = 'rgba(210,225,250,.5)'; ctx.beginPath(); ctx.moveTo(-300, -100); ctx.lineTo(-238, -100); ctx.stroke(); ctx.fillStyle = '#05070a'; ctx.fillRect(-292, -90, 46, 6);
    for (let i = 0; i < 10; i++) { const mx = -210 + i * 46, my = -60 - (mx + 300) * .017, bob = Math.sin(t * 2.2 + i * 1.3) * 2;
        ctx.fillStyle = '#20251a'; ctx.beginPath(); ctx.ellipse(mx, my + 2 + bob, 17, 11, 0, Math.PI, 0); ctx.fill();
        ctx.fillStyle = i % 2 ? '#323a24' : '#262c1c'; ctx.beginPath(); ctx.arc(mx, my - 14 + bob, 13, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.ellipse(mx, my - 14 + bob, 17, 4.6, 0, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(210,225,250,.55)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(mx, my - 15 + bob, 13, -2.7, -.5); ctx.stroke();
        if (i % 3 === 1) { ctx.strokeStyle = '#06080a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mx + 8, my - 4 + bob); ctx.lineTo(mx + 24, my - 54 + bob); ctx.stroke(); } }
    ctx.fillStyle = '#141810'; ctx.beginPath(); ctx.arc(-268, -106, 10, Math.PI, 0); ctx.fill();
    ctx.restore(); }
function h12Sea(hz, bot, t, o) { // night sea with perspective swell and a moon (or fire) glade
    o = o || {}; const g = ctx.createLinearGradient(0, hz, 0, bot); g.addColorStop(0, o.far || '#2c3a50'); g.addColorStop(.25, o.mid || '#121c2a'); g.addColorStop(1, o.near || '#04070c'); ctx.fillStyle = g; ctx.fillRect(-200, hz, 2000, bot - hz);
    const gx = o.gx === undefined ? 800 : o.gx, gc = o.gc || '210,222,245', r = m12Rng(9);
    for (let j = 0; j < 140; j++) { const p = j / 140, y = hz + Math.pow(p, 1.8) * (bot - hz), amp = 1 + p * 9, len = 8 + p * 90, n = 20 + p * 20;
        for (let i = 0; i < n; i++) { const x = ((r() * 1900 + t * (10 + p * 60) * (j % 2 ? 1 : -.6)) % 1900) - 150, dg = Math.abs(x - gx) / (60 + p * 520), glade = Math.max(0, 1 - dg), a = .06 + glade * .55 * (o.ga || 1) * (.6 + .4 * Math.sin(t * 3 + i + j));
            ctx.strokeStyle = glade > .05 ? 'rgba(' + gc + ',' + a + ')' : 'rgba(150,170,200,' + (.05 + p * .06) + ')'; ctx.lineWidth = .8 + p * 1.8; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + len / 2, y - amp, x + len, y); ctx.stroke(); } }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createLinearGradient(gx - 300, 0, gx + 300, 0); gl.addColorStop(0, 'rgba(' + gc + ',0)'); gl.addColorStop(.5, 'rgba(' + gc + ',' + .09 * (o.ga || 1) + ')'); gl.addColorStop(1, 'rgba(' + gc + ',0)'); ctx.fillStyle = gl; ctx.fillRect(gx - 300, hz, 600, bot - hz); ctx.restore();
    const hz2 = ctx.createLinearGradient(0, hz - 30, 0, hz + 40); hz2.addColorStop(0, 'rgba(120,140,170,0)'); hz2.addColorStop(.5, 'rgba(120,140,170,' + (o.haze || .25) + ')'); hz2.addColorStop(1, 'rgba(120,140,170,0)'); ctx.fillStyle = hz2; ctx.fillRect(-200, hz - 30, 2000, 70); }
function h12Grade(hv, top, bot, a) { ctx.save(); ctx.globalCompositeOperation = 'soft-light'; const g = ctx.createLinearGradient(0, 0, 0, hv); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.globalAlpha = a || .5; ctx.fillStyle = g; ctx.fillRect(-200, -200, 2000, hv + 400); ctx.restore(); }
function h12Motes(hv, t, n, col) { const r = m12Rng(3); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const x = (r() * 1700 + t * (6 + r() * 12)) % 1700 - 50, y = (r() * hv + Math.sin(t * .5 + i) * 20 - t * (3 + r() * 6) + hv * 4) % hv, s = .6 + r() * 1.8; ctx.fillStyle = 'rgba(' + col + ',' + (.15 + r() * .35) + ')'; ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill(); } ctx.restore(); }

/* =========================== INTRO =========================== */
function h12DeskLayer(hv) { // the War Cabinet map table, painted once
    const key = 'desk' + Math.round(hv); if (H12.c[key]) return H12.c[key]; const W = 2000, Hh = Math.ceil(hv * 1.25), c = h12Cv(W, Hh), g = c.getContext('2d'), r = m12Rng(12);
    // mahogany
    const wd = g.createLinearGradient(0, 0, W, Hh); wd.addColorStop(0, '#3a1e10'); wd.addColorStop(.5, '#2a140a'); wd.addColorStop(1, '#1a0c06'); g.fillStyle = wd; g.fillRect(0, 0, W, Hh);
    for (let i = 0; i < 520; i++) { const y = r() * Hh; g.strokeStyle = r() > .5 ? 'rgba(90,44,22,.35)' : 'rgba(10,4,2,.35)'; g.lineWidth = .6 + r() * 1.6; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= W; x += 40) g.lineTo(x, y + Math.sin(x * .004 + i) * 6 + Math.sin(x * .02 + i * 3) * 1.6); g.stroke(); }
    g.fillStyle = 'rgba(0,0,0,.4)'; for (let x = 0; x < W; x += 330) g.fillRect(x, 0, 2, Hh);
    const ox = 330, oy = 150, MW = 1180, MH = 760; // the map sheet
    g.save(); g.translate(ox + MW / 2, oy + MH / 2); g.rotate(-.03); g.translate(-MW / 2, -MH / 2);
    g.fillStyle = 'rgba(0,0,0,.55)'; g.filter = 'blur(14px)'; g.fillRect(18, 26, MW, MH); g.filter = 'none';
    const pg = g.createLinearGradient(0, 0, MW, MH); pg.addColorStop(0, '#e2d8b6'); pg.addColorStop(1, '#c8b88c'); g.fillStyle = pg; g.fillRect(0, 0, MW, MH);
    for (let i = 0; i < 24; i++) { const x = r() * MW, y = r() * MH, rr = 30 + r() * 120, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(120,90,40,.12)'); gr.addColorStop(1, 'rgba(120,90,40,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
    g.strokeStyle = 'rgba(80,60,30,.25)'; g.lineWidth = 2; [MW / 3, MW * 2 / 3].forEach(function (x) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, MH); g.stroke(); }); g.beginPath(); g.moveTo(0, MH / 2); g.lineTo(MW, MH / 2); g.stroke(); // folds
    // the sea + the coast of Usedom, with the Peenestrom
    const coast = function () { g.beginPath(); g.moveTo(0, 300); const pts = [[80, 290], [180, 260], [260, 240], [330, 205], [380, 176], [420, 168], [470, 190], [540, 226], [640, 262], [760, 300], [880, 338], [1000, 372], [1100, 392], [MW, 400]]; pts.forEach(function (p) { g.lineTo(p[0], p[1]); }); g.lineTo(MW, 0); g.lineTo(0, 0); g.closePath(); };
    coast(); g.fillStyle = '#9ab0b8'; g.fill(); g.save(); coast(); g.clip(); g.strokeStyle = 'rgba(60,90,110,.35)'; g.lineWidth = 1; for (let k = 1; k < 9; k++) { g.beginPath(); g.moveTo(0, 300 - k * 22); for (let x = 0; x <= MW; x += 30) g.lineTo(x, 300 - k * 22 + Math.sin(x * .01 + k) * 8 + (x > 300 && x < 600 ? -30 : 0) + x * .08); g.stroke(); } g.restore();
    coast(); g.strokeStyle = '#3a4a50'; g.lineWidth = 2.4; g.stroke();
    g.fillStyle = '#9ab0b8'; g.beginPath(); g.moveTo(330, MH); g.bezierCurveTo(360, 600, 300, 450, 380, 230); g.lineTo(400, 236); g.bezierCurveTo(340, 450, 400, 600, 372, MH); g.fill(); g.strokeStyle = '#3a4a50'; g.lineWidth = 1.4; g.stroke();
    for (let i = 0; i < 900; i++) { const x = 420 + r() * 700, y = 300 + r() * 440; if (y < 200 + x * .17) continue; g.fillStyle = 'rgba(70,100,50,.32)'; g.beginPath(); g.arc(x, y, 1.6 + r() * 2.4, 0, 7); g.fill(); } // forest stipple
    g.strokeStyle = 'rgba(30,30,30,.75)'; g.lineWidth = 1.2; g.setLineDash([6, 3]); g.beginPath(); g.moveTo(430, 420); g.lineTo(700, 520); g.lineTo(980, 520); g.stroke(); g.setLineDash([]); // railway
    g.fillStyle = '#7a6a4a'; [[470, 300, 40, 26], [540, 330, 30, 30], [600, 300, 50, 20], [520, 380, 26, 18]].forEach(function (b) { g.fillRect(b[0], b[1], b[2], b[3]); });
    g.strokeStyle = '#2a2a24'; g.lineWidth = 2; g.beginPath(); g.ellipse(560, 270, 36, 22, 0, 0, 7); g.stroke();
    g.fillStyle = 'rgba(40,30,20,.85)'; g.font = 'italic 26px Georgia, serif'; g.fillText('O S T S E E', 520, 110); g.font = 'italic 20px Georgia, serif'; g.fillText('Usedom', 760, 560); g.font = '15px Georgia, serif'; g.fillText('Peenemünde', 600, 250); g.fillText('Karlshagen', 690, 410); g.fillText('Zinnowitz', 880, 470); g.fillText('Wolgast', 250, 640); g.font = 'italic 14px Georgia, serif'; g.fillText('Peenestrom', 236, 520);
    g.strokeStyle = 'rgba(60,40,20,.2)'; g.lineWidth = 1; for (let x = 0; x < MW; x += 98) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, MH); g.stroke(); } for (let y = 0; y < MH; y += 98) { g.beginPath(); g.moveTo(0, y); g.lineTo(MW, y); g.stroke(); }
    g.strokeStyle = '#b02020'; g.lineWidth = 3; g.beginPath(); g.ellipse(560, 272, 70, 46, -.1, 0, 7); g.stroke(); g.beginPath(); g.moveTo(640, 236); g.quadraticCurveTo(720, 170, 780, 180); g.stroke(); g.fillStyle = '#b02020'; g.font = 'italic 700 20px Georgia, serif'; g.fillText('P.VII — A4 ?', 790, 186);
    g.save(); g.translate(1010, 64); g.rotate(.08); g.strokeStyle = 'rgba(176,32,32,.75)'; g.lineWidth = 4; g.strokeRect(-110, -26, 220, 52); g.fillStyle = 'rgba(176,32,32,.75)'; g.font = '700 30px "Stardos Stencil", Impact'; g.textAlign = 'center'; g.fillText('MOST SECRET', 0, 11); g.restore();
    g.fillStyle = 'rgba(30,24,16,.8)'; g.font = '13px "Courier New", monospace'; g.fillText('G.S.G.S. 4416 · SHEET K/2 · PEENEMÜNDE — USEDOM · 1:50,000', 24, MH - 18);
    g.restore();
    // recce photograph, paper-clipped
    g.save(); g.translate(260, Hh * .6); g.rotate(-.09); g.fillStyle = 'rgba(0,0,0,.5)'; g.filter = 'blur(8px)'; g.fillRect(10, 14, 330, 250); g.filter = 'none'; g.fillStyle = '#ecebe2'; g.fillRect(0, 0, 330, 250); g.fillStyle = '#3a3a34'; g.fillRect(14, 14, 302, 196);
    for (let i = 0; i < 2600; i++) { g.fillStyle = r() > .5 ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.1)'; g.fillRect(14 + r() * 300, 14 + r() * 194, 2, 2); }
    g.fillStyle = '#5a5a52'; g.beginPath(); g.ellipse(165, 112, 74, 48, .1, 0, 7); g.fill(); g.strokeStyle = '#8a8a80'; g.lineWidth = 12; g.beginPath(); g.ellipse(165, 112, 86, 58, .1, .5, Math.PI * 2 - .1); g.stroke(); g.fillStyle = '#d8d8d0'; g.fillRect(162, 106, 6, 6); g.strokeStyle = 'rgba(20,20,20,.9)'; g.lineWidth = 2; g.beginPath(); g.moveTo(165, 109); g.lineTo(212, 132); g.stroke();
    g.strokeStyle = '#e8e8e0'; g.lineWidth = 1.4; g.beginPath(); g.arc(165, 109, 16, 0, 7); g.stroke(); g.beginPath(); g.moveTo(181, 104); g.lineTo(250, 60); g.stroke(); g.fillStyle = '#e8e8e0'; g.font = '700 12px monospace'; g.fillText('OBJECT 45 FT?', 220, 54);
    g.fillStyle = '#2a2a24'; g.font = '11px monospace'; g.fillText('R.A.F. P.R.U.  N/853  23.VI.44  F/20"  SECRET', 18, 232);
    g.strokeStyle = '#a0a6ac'; g.lineWidth = 3; g.beginPath(); g.moveTo(250, -10); g.lineTo(250, 40); g.arc(258, 40, 8, Math.PI, 0, true); g.lineTo(266, -4); g.stroke(); g.restore();
    // Doyle's sketch on squared paper
    g.save(); g.translate(1430, Hh * .52); g.rotate(.07); g.fillStyle = 'rgba(0,0,0,.5)'; g.filter = 'blur(8px)'; g.fillRect(10, 14, 300, 400); g.filter = 'none'; g.fillStyle = '#f2efe4'; g.fillRect(0, 0, 300, 400); g.strokeStyle = 'rgba(80,110,160,.25)'; g.lineWidth = 1; for (let x = 0; x < 300; x += 15) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 400); g.stroke(); } for (let y = 0; y < 400; y += 15) { g.beginPath(); g.moveTo(0, y); g.lineTo(300, y); g.stroke(); }
    g.strokeStyle = '#2a2a3a'; g.lineWidth = 2; g.beginPath(); g.moveTo(150, 34); g.bezierCurveTo(176, 70, 176, 100, 176, 130); g.lineTo(176, 280); g.lineTo(212, 340); g.lineTo(212, 350); g.lineTo(88, 350); g.lineTo(88, 340); g.lineTo(124, 280); g.lineTo(124, 130); g.bezierCurveTo(124, 100, 124, 70, 150, 34); g.stroke();
    g.lineWidth = 1; [130, 180, 230].forEach(function (y) { g.beginPath(); g.moveTo(124, y); g.lineTo(176, y); g.stroke(); }); g.beginPath(); g.moveTo(232, 34); g.lineTo(232, 350); g.moveTo(226, 34); g.lineTo(238, 34); g.moveTo(226, 350); g.lineTo(238, 350); g.stroke();
    g.fillStyle = '#2a2a3a'; g.font = 'italic 16px Georgia, serif'; g.fillText('46 ft', 240, 200); g.fillText('fins ×4', 214, 330); g.fillText('frost here?', 182, 214); g.fillText('seen from train', 20, 380); g.fillText('3 July — H.D.', 170, 392); g.font = 'italic 700 18px Georgia, serif'; g.fillText('"A4"', 30, 60); g.restore();
    // folder, ruler, pencil, ashtray, teacup
    g.save(); g.translate(120, 60); g.rotate(-.05); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(10, 12, 300, 200); g.fillStyle = '#c8a870'; g.fillRect(0, 0, 300, 200); g.fillStyle = '#b02020'; g.fillRect(0, 34, 300, 22); g.fillStyle = '#f0e0c0'; g.font = '700 16px "Stardos Stencil", Impact'; g.fillText('BIGOT · OPERATION HYDRA', 20, 51); g.fillStyle = '#4a3a20'; g.font = '14px "Courier New", monospace'; g.fillText('COMBINED OPERATIONS HQ', 20, 90); g.fillText('No. 62 COMMANDO — FILE 12', 20, 112); g.restore();
    g.save(); g.translate(1300, 120); g.rotate(.2); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(6, 8, 420, 30); g.fillStyle = '#d8c890'; g.fillRect(0, 0, 420, 30); g.fillStyle = '#3a3020'; for (let x = 10; x < 420; x += 10) g.fillRect(x, 0, 1, x % 50 === 0 ? 14 : 7); g.restore();
    g.save(); g.translate(1200, Hh * .9); g.rotate(-.3); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(4, 6, 220, 10); g.fillStyle = '#c8a020'; g.fillRect(0, 0, 200, 10); g.fillStyle = '#e0b090'; g.beginPath(); g.moveTo(200, 0); g.lineTo(224, 5); g.lineTo(200, 10); g.fill(); g.fillStyle = '#2a2a2a'; g.beginPath(); g.moveTo(216, 3); g.lineTo(224, 5); g.lineTo(216, 7); g.fill(); g.restore();
    [[1720, 160, 70, '#3a3a3a', '#1a1a1a'], [1760, Hh * .86, 60, '#e8e4dc', '#c8c0b0']].forEach(function (q, i) { g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.ellipse(q[0] + 10, q[1] + 14, q[2], q[2] * .9, 0, 0, 7); g.fill(); const cg = g.createRadialGradient(q[0] - q[2] * .3, q[1] - q[2] * .3, 4, q[0], q[1], q[2]); cg.addColorStop(0, q[3]); cg.addColorStop(1, q[4]); g.fillStyle = cg; g.beginPath(); g.arc(q[0], q[1], q[2], 0, 7); g.fill();
        if (i) { g.fillStyle = '#5a3418'; g.beginPath(); g.arc(q[0], q[1], q[2] * .74, 0, 7); g.fill(); g.strokeStyle = '#c8c0b0'; g.lineWidth = 8; g.beginPath(); g.arc(q[0] + q[2] + 10, q[1], 14, -1.2, 1.2); g.stroke(); } else { g.fillStyle = '#5a5a56'; g.beginPath(); g.arc(q[0], q[1], q[2] * .7, 0, 7); g.fill(); g.fillStyle = '#e8e4dc'; g.fillRect(q[0] - 10, q[1] - 4, 70, 8); g.fillStyle = '#c86a2a'; g.fillRect(q[0] - 14, q[1] - 4, 6, 8); } });
    H12.c[key] = c; return c; }
function h12ShotMap(u, hv) {
    const L = h12DeskLayer(hv), z = .9 + u * .024, dx = -u * 9, dy = -u * 4; ctx.save(); ctx.translate(800, hv / 2); ctx.scale(z, z); ctx.rotate(-.02 + u * .003); ctx.translate(-1000 + dx, -hv * .62 + dy); ctx.drawImage(L, 0, 0);
    // the pin goes in at Peenemünde, its shadow arriving first
    const px = 330 + 560 - 6, py = 150 + 272 - 20, k = h12E(h12K(u, 2.2, 3.4)), lift = (1 - k) * 90; ctx.fillStyle = 'rgba(0,0,0,' + (.25 + k * .2) + ')'; ctx.beginPath(); ctx.ellipse(px + 14 + lift * .6, py + 10 + lift * .4, 9 + lift * .1, 6, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#b8bcc0'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(px, py - lift); ctx.lineTo(px, py - 30 - lift); ctx.stroke(); const pg = ctx.createRadialGradient(px - 3, py - 34 - lift, 1, px, py - 30 - lift, 11); pg.addColorStop(0, '#ff8070'); pg.addColorStop(1, '#8a1010'); ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py - 30 - lift, 10, 0, 7); ctx.fill();
    // the hand shadow passing over as it sets the pin
    if (u > 1.4 && u < 4.4) { const hk = Math.sin(h12K(u, 1.4, 4.4) * Math.PI); ctx.save(); ctx.globalAlpha = .38 * hk; ctx.fillStyle = '#000'; ctx.filter = 'blur(18px)'; ctx.beginPath(); ctx.ellipse(px + 120 + (1 - hk) * 200, py + 60 - hk * 30, 120, 60, -.5, 0, 7); ctx.fill(); ctx.fillRect(px + 160 + (1 - hk) * 200, py + 40, 400, 90); ctx.restore(); }
    // cigarette smoke from the ashtray, steam off the tea
    const sm = h12Puff('200,200,190', 41, 1); for (let i = 0; i < 18; i++) { const k2 = (u * .12 + i / 18) % 1; ctx.globalAlpha = Math.sin(k2 * Math.PI) * .35; const r = 20 + k2 * 120; ctx.drawImage(sm, 1660 + Math.sin(k2 * 6 + i) * 40 * k2 - r, 160 - k2 * 360 - r, r * 2, r * 2); }
    for (let i = 0; i < 10; i++) { const k2 = (u * .2 + i / 10) % 1; ctx.globalAlpha = Math.sin(k2 * Math.PI) * .22; const r = 16 + k2 * 70; ctx.drawImage(sm, 1760 + Math.sin(k2 * 5 + i) * 20 - r, hv * 1.25 * .86 - k2 * 200 - r, r * 2, r * 2); } ctx.globalAlpha = 1;
    ctx.restore();
    // the green-shaded desk lamp: a warm pool, falloff to black
    ctx.save(); const lg = ctx.createRadialGradient(780, hv * .42, 60, 800, hv * .5, 1000); lg.addColorStop(0, 'rgba(0,0,0,0)'); lg.addColorStop(.55, 'rgba(0,0,0,.25)'); lg.addColorStop(1, 'rgba(0,0,0,.88)'); ctx.fillStyle = lg; ctx.fillRect(-100, -100, 1800, hv + 200); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,190,110,.45)'; ctx.fillRect(-100, -100, 1800, hv + 200); ctx.restore();
    h12Glow(780, hv * .42, 700, '255,200,130', .12 + .01 * Math.sin(u * 20)); h12Motes(hv, u, 70, '255,220,170');
}
function h12IslandTex() { // a painted top-down plate of the coast and the site for the flyover (x across, y forward)
    if (H12.c.island) return H12.c.island; const W = 2048, Hh = 2400, c = h12Cv(W, Hh), g = c.getContext('2d'), r = m12Rng(99);
    g.fillStyle = '#0a1422'; g.fillRect(0, 0, W, Hh);
    for (let i = 0; i < 9000; i++) { const x = r() * W, y = r() * 1000; g.strokeStyle = 'rgba(' + (60 + r() * 60 | 0) + ',' + (90 + r() * 60 | 0) + ',' + (130 + r() * 60 | 0) + ',' + (.1 + r() * .2) + ')'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6 + r() * 10, y); g.stroke(); }
    const cy = function (x) { return 980 + Math.sin(x * .003) * 50 + Math.sin(x * .011) * 16; };
    g.fillStyle = '#c8b88a'; g.beginPath(); g.moveTo(0, Hh); for (let x = 0; x <= W; x += 16) g.lineTo(x, cy(x) - 14); g.lineTo(W, Hh); g.fill(); // beach
    g.strokeStyle = 'rgba(230,240,255,.55)'; g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= W; x += 16) g.lineTo(x, cy(x) - 18); g.stroke();
    g.fillStyle = '#0e1a10'; g.beginPath(); g.moveTo(0, Hh); for (let x = 0; x <= W; x += 16) g.lineTo(x, cy(x) + 20); g.lineTo(W, Hh); g.fill(); // forest base
    for (let i = 0; i < 26000; i++) { const x = r() * W, y = 1010 + r() * (Hh - 1010); if (y < cy(x) + 20) continue; g.fillStyle = 'rgba(' + (16 + r() * 26 | 0) + ',' + (32 + r() * 30 | 0) + ',' + (18 + r() * 16 | 0) + ',.85)'; g.beginPath(); g.arc(x, y, 2 + r() * 4, 0, 7); g.fill(); }
    // the cleared site
    g.fillStyle = '#2e2c22'; g.beginPath(); g.moveTo(560, 1180); g.lineTo(1500, 1160); g.lineTo(1560, 1700); g.lineTo(520, 1720); g.closePath(); g.fill();
    g.strokeStyle = '#4a4a40'; g.lineWidth = 14; [[[600, 1400], [1500, 1400]], [[1030, 1100], [1030, 1720]], [[700, 1200], [700, 1680]], [[1350, 1200], [1350, 1680]], [[1030, 1720], [1030, 2400]]].forEach(function (l) { g.beginPath(); g.moveTo(l[0][0], l[0][1]); g.lineTo(l[1][0], l[1][1]); g.stroke(); });
    g.strokeStyle = '#6a6a5a'; g.lineWidth = 3; g.setLineDash([12, 8]); g.beginPath(); g.moveTo(520, 1640); g.lineTo(1560, 1640); g.lineTo(1700, 2400); g.stroke(); g.setLineDash([]);
    [[620, 1240, 120, 90], [620, 1460, 140, 110], [1380, 1250, 120, 80], [1380, 1480, 120, 60], [880, 1520, 60, 40], [1160, 1530, 80, 40]].forEach(function (b) { g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(b[0] + 6, b[1] + 6, b[2], b[3]); g.fillStyle = '#4a4a44'; g.fillRect(b[0], b[1], b[2], b[3]); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(b[0], b[1], b[2], 3); });
    g.fillStyle = '#26361a'; g.beginPath(); g.ellipse(1030, 1280, 150, 100, 0, 0, 7); g.fill(); g.fillStyle = '#6a6a60'; g.beginPath(); g.ellipse(1030, 1280, 110, 66, 0, 0, 7); g.fill(); g.fillStyle = '#20201c'; g.beginPath(); g.ellipse(1030, 1280, 150, 100, 0, 1.2, 1.94); g.lineTo(1030, 1280); g.fill();
    // the Peenestrom on the left
    g.fillStyle = '#0a1422'; g.beginPath(); g.moveTo(140, 1000); g.bezierCurveTo(260, 1400, 120, 1800, 260, Hh); g.lineTo(380, Hh); g.bezierCurveTo(250, 1800, 380, 1400, 260, 1000); g.fill();
    H12.c.island = c; return c; }
const H12_LIGHTS = (function () { const L = []; for (let x = 620; x <= 1500; x += 60) L.push([x, 1400, 'w']); for (let y = 1120; y <= 1700; y += 60) L.push([1030, y, 'w']); [[690, 1290], [690, 1520], [1440, 1300], [1440, 1520], [910, 1540], [1200, 1550]].forEach(function (p) { L.push([p[0], p[1], 'win']); }); return L; })();
function h12ShotAir(u, hv) {
    const hz = hv * .24; const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#02040a'); sk.addColorStop(.7, '#0c1424'); sk.addColorStop(1, '#2a3448'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 102);
    ctx.drawImage(h12Stars(hv), -100 - u * 6, 0); h12Moon(1290, hz - 150, 30, 1.2); ctx.globalAlpha = .9; ctx.drawImage(h12CloudBank(3, '150,165,200', '20,28,44'), -300 - u * 14, hz - 360, 2600, 420); ctx.globalAlpha = 1;
    const T = h12IslandTex(), camX = 1030 + Math.sin(u * .25) * 50, camZ = 560 + u * 78, camH = 250, F = 820;
    ctx.fillStyle = '#16202e'; ctx.fillRect(-100, hz, 1800, hv - hz + 100); ctx.imageSmoothingEnabled = true;
    for (let sy = Math.ceil(hz + 2); sy < hv + 2; sy++) { const dz = camH * F / (sy - hz), ty = camZ + dz; if (ty < 0 || ty >= T.height) continue; const sw = 1600 * dz / F, sx = camX - sw / 2; ctx.drawImage(T, sx, ty, sw, 1, 0, sy, 1600, 1); }
    const fog = ctx.createLinearGradient(0, hz, 0, hz + 140); fog.addColorStop(0, 'rgba(60,72,96,1)'); fog.addColorStop(.4, 'rgba(40,52,74,.6)'); fog.addColorStop(1, 'rgba(30,40,60,0)'); ctx.fillStyle = fog; ctx.fillRect(-100, hz - 2, 1800, 142);
    const proj = function (tx, ty) { const dz = ty - camZ; if (dz < 20) return null; return [800 + (tx - camX) * F / dz, hz + camH * F / dz, F / dz]; };
    // moon glade on the water
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 260; i++) { const sy = hz + 6 + Math.pow(ddpR(i), 1.6) * (hv - hz), dz = camH * F / (sy - hz); if (camZ + dz > 960) continue; const x = 1290 + (ddpR(i * 3) - .5) * (20 + (sy - hz) * 1.1), a = .25 + .5 * Math.sin(u * 4 + i); ctx.fillStyle = 'rgba(220,230,255,' + Math.max(0, a) * .6 + ')'; ctx.fillRect(x, sy, 3 + (sy - hz) * .04, 1.2); } ctx.restore();
    // the site's lights, the floodlit stand and its plume, searchlights
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; H12_LIGHTS.forEach(function (l, i) { const p = proj(l[0], l[1]); if (!p) return; const s = Math.min(3, p[2] * 2); h12Dot(p[0], p[1], 10 * s + 3, l[2] === 'win' ? '255,190,110' : '255,230,170', .55); }); ctx.restore();
    const st0 = proj(1030, 1280), st = st0 ? [st0[0], st0[1], Math.min(1.6, st0[2])] : null; if (st) { h12Glow(st[0], st[1], 260 * st[2] + 40, '220,232,255', .55); const P = h12Puff('235,242,255', 8); for (let i = 0; i < 8; i++) { const k = (u * .2 + i / 8) % 1, r = (40 + k * 140) * st[2]; ctx.globalAlpha = (1 - k) * .5; ctx.drawImage(P, st[0] - r + k * 60 * st[2], st[1] - k * 260 * st[2] - r, r * 2, r * 2); } ctx.globalAlpha = 1; ctx.fillStyle = '#f4f4ee'; ctx.fillRect(st[0] - 1.5 * st[2], st[1] - 40 * st[2], 3 * st[2], 40 * st[2]); }
    [[640, 1180, .5], [1460, 1200, -.4], [800, 1700, .2], [1300, 1690, -.2]].forEach(function (b, i) { const p = proj(b[0], b[1]); if (!p) return; h12Beam(p[0], p[1], -Math.PI / 2 + b[2] + Math.sin(u * .5 + i * 2) * .35, 900, .05, .16); });
    // a wisp of cloud passing under the camera
    const wk = (u * .09) % 1; ctx.globalAlpha = .35 * Math.sin(wk * Math.PI); ctx.drawImage(h12Puff('120,135,165', 61, 1), -400 + wk * 2400, hv * .45, 1200, 500); ctx.globalAlpha = 1;
    h12Grade(hv, 'rgba(60,90,160,1)', 'rgba(10,20,40,1)', .4);
}
function h12ShotRocket(u, hv) {
    const crane = h12E(h12K(u, 0, 8)), hz = hv * .8 + crane * 60, s = 1.32;
    const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#01030a'); sk.addColorStop(.6, '#0a1222'); sk.addColorStop(1, '#1e2a40'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 104);
    ctx.drawImage(h12Stars(hv), -100, -crane * 40); ctx.globalAlpha = .7; ctx.drawImage(h12CloudBank(5, '120,135,170', '10,16,28'), -400 + u * 8, hz - 640 + crane * 40, 2600, 420); ctx.globalAlpha = 1;
    // the earth wall of the stand, pines on top, haze in front
    ctx.fillStyle = '#0c140c'; ctx.beginPath(); ctx.moveTo(-100, hz + 20); ctx.quadraticCurveTo(800, hz - 300, 1700, hz + 20); ctx.fill(); h12Treeline(hz - 200, 70, 4, '#060a06', -100, 520); h12Treeline(hz - 200, 70, 5, '#060a06', 1080, 1700);
    ctx.strokeStyle = 'rgba(150,180,140,.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-100, hz + 20); ctx.quadraticCurveTo(800, hz - 300, 1700, hz + 20); ctx.stroke();
    // floodlight beams converging through the cold haze
    [[40, hz - 260], [1560, hz - 280], [180, hz - 30], [1420, hz - 40]].forEach(function (L, i) { const a = Math.atan2(hz - 300 - L[1], 800 - L[0]); h12Beam(L[0], L[1], a, 1100, .1, .12 + .02 * Math.sin(u * 2 + i)); });
    // the concrete apron
    const gg = ctx.createLinearGradient(0, hz, 0, hv); gg.addColorStop(0, '#4a4a46'); gg.addColorStop(1, '#121210'); ctx.fillStyle = gg; ctx.fillRect(-100, hz, 1800, hv - hz + 100); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1.4; for (let i = -10; i < 12; i++) { ctx.beginPath(); ctx.moveTo(800 + i * 40, hz); ctx.lineTo(800 + i * 200, hv + 60); ctx.stroke(); } for (let j = 1; j < 6; j++) { const y = hz + Math.pow(j / 6, 1.7) * (hv - hz + 40); ctx.beginPath(); ctx.moveTo(-100, y); ctx.lineTo(1700, y); ctx.stroke(); }
    ctx.save(); ctx.translate(0, crane * 40);
    h12Gantry(930, hz, s, u); h12V2(800, hz - 10, s, { t: u, vent: true });
    // the LOX trailer with its hose, men on the gantry and the apron
    ctx.save(); ctx.translate(380, hz + 4); const tg = ctx.createLinearGradient(0, -90, 0, -20); tg.addColorStop(0, '#d8dce4'); tg.addColorStop(.5, '#8a909a'); tg.addColorStop(1, '#3a3e46'); ctx.fillStyle = tg; ctx.beginPath(); ctx.ellipse(0, -55, 150, 34, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(240,248,255,.4)'; ctx.fillRect(-140, -66, 280, 10); ctx.fillStyle = '#1a1c1e'; ctx.fillRect(-150, -24, 300, 10); [-100, 100].forEach(function (wx) { m8Disc(ctx, wx, -6, 20, '#0a0a0a', '#3a3a3a'); }); ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(150, -50); ctx.bezierCurveTo(260, -10, 320, -40, 380, -60 * s - 250); ctx.stroke(); ctx.fillStyle = '#dce6f4'; ctx.font = '700 18px "Stardos Stencil", Impact'; ctx.fillText('SAUERSTOFF', -70, -48); ctx.restore();
    [[860, hz - 120 * s - 26], [860, hz - 230 * s - 26]].forEach(function (p, i) { ddpMan(p[0], p[1], .8, u + i, { ger: true, run: 0, dir: -1, haze: .1 }); });
    [[560, 1], [660, 1], [1060, -1], [1210, -1]].forEach(function (m, i) { ddpMan(m[0], hz + 54 + i * 4, 1.05, u + i, { ger: true, run: 0, dir: m[1], haze: .15 }); h12Glow(m[0] + m[1] * 18, hz + 20 + i * 4, 40, '255,240,200', .2); });
    ctx.restore();
    // LOX fog rolling across the apron
    const P = h12Puff('215,225,245', 13, 1); for (let i = 0; i < 26; i++) { const k = (u * .05 + i / 26) % 1, x = -200 + ((i * 97) % 1900) + k * 300, y = hz + 30 + (i % 5) * 30, r = 160 + (i % 4) * 60; ctx.globalAlpha = .28 * Math.sin(k * Math.PI); ctx.drawImage(P, x - r, y - r * .5, r * 2, r); } ctx.globalAlpha = 1;
    // the X-ZEIT board in the foreground, flip numerals
    const bx = 1180, by = hv * .56; ctx.fillStyle = '#0a0a0a'; ctx.fillRect(bx + 120, by + 120, 10, hv); ctx.fillStyle = '#121210'; ctx.fillRect(bx, by, 300, 130); ctx.strokeStyle = '#3a3a34'; ctx.lineWidth = 4; ctx.strokeRect(bx, by, 300, 130); ctx.fillStyle = '#d8c060'; ctx.font = '700 16px "Stardos Stencil", Impact'; ctx.textAlign = 'left'; ctx.fillText('X-ZEIT  ·  PRÜFSTAND VII', bx + 16, by + 26);
    const rem = Math.max(0, 600 - Math.floor(u * 7)), txt = '-' + String(Math.floor(rem / 60)).padStart(2, '0') + ':' + String(rem % 60).padStart(2, '0'); for (let i = 0; i < txt.length; i++) { const cx = bx + 18 + i * 52; ctx.fillStyle = '#1e1e1c'; ctx.fillRect(cx, by + 40, 46, 76); ctx.fillStyle = 'rgba(0,0,0,.8)'; ctx.fillRect(cx, by + 77, 46, 2); ctx.fillStyle = '#ff5a3a'; ctx.font = '700 60px "Stardos Stencil", Impact, monospace'; ctx.textAlign = 'center'; ctx.fillText(txt[i], cx + 23, by + 101); } ctx.textAlign = 'left'; h12Glow(bx + 150, by + 78, 200, '255,90,60', .18);
    h12Grade(hv, 'rgba(70,100,170,1)', 'rgba(40,40,60,1)', .45); h12Motes(hv, u, 60, '220,230,255');
}
function h12ShotSea(u, hv) {
    const bob = Math.sin(u * 1.1) * 6, roll = Math.sin(u * .8) * .012, hz = hv * .4 + bob; ctx.save(); ctx.translate(800, hv / 2); ctx.rotate(roll); ctx.translate(-800, -hv / 2);
    const sk = ctx.createLinearGradient(0, -100, 0, hz); sk.addColorStop(0, '#02040a'); sk.addColorStop(1, '#283650'); ctx.fillStyle = sk; ctx.fillRect(-200, -200, 2000, hz + 202); ctx.drawImage(h12Stars(hv), -100, -40);
    h12Moon(300, hz - 230, 34, 1.3); ctx.drawImage(h12CloudBank(7, '160,175,210', '16,22,36'), -500 + u * 12, hz - 440, 2800, 430);
    // the coast: dunes, pines, the site's glow and its searchlights
    h12Glow(1100, hz - 10, 420, '220,230,255', .22); [[960, -.9], [1180, -.3], [1300, .5]].forEach(function (b, i) { h12Beam(b[0], hz - 18, -Math.PI / 2 + b[1] * .5 + Math.sin(u * .4 + i * 2) * .35, 1000, .03, .14); });
    h12Treeline(hz - 6, 26, 11, '#05080c', -200, 1800); ctx.fillStyle = '#05080c'; ctx.fillRect(-200, hz - 8, 2000, 10);
    h12Sea(hz, hv + 60, u, { gx: 300, ga: 1.1 });
    h12LCA(1240, hz + 60, .32, u + 3, { num: 'LCA 871' }); h12LCA(1460, hz + 46, .22, u + 5, { num: 'LCA 872' });
    h12LCA(760, hv * .74 + Math.sin(u * 1.4) * 6, 1.25, u, { num: 'LCA 873' });
    ctx.restore();
    // spray across the lens
    const P = h12Puff('230,238,248', 51); for (let i = 0; i < 6; i++) { const k = (u * .5 + i / 6) % 1; if (k > .35) continue; ctx.globalAlpha = (1 - k / .35) * .5; const r = 200 + k * 400; ctx.drawImage(P, 1200 + i * 60 - r + k * 400, hv * .9 - k * 300 - r * .5, r * 2, r); } ctx.globalAlpha = 1;
    h12Grade(hv, 'rgba(60,90,160,1)', 'rgba(0,10,30,1)', .45);
}
function h12ShotPines(u, hv) {
    const hz = hv * .62, dr = u * 10; const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#01030a'); sk.addColorStop(1, '#1c2436'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 104); ctx.drawImage(h12Stars(hv), -100, 0);
    // the floodlit stand beyond, steam pouring off the rocket
    h12Glow(940, hz - 60, 700, '220,232,255', .45); ctx.fillStyle = '#0a120a'; ctx.beginPath(); ctx.moveTo(500, hz); ctx.quadraticCurveTo(940, hz - 120, 1380, hz); ctx.fill();
    h12V2(940, hz - 70, .36, { t: u, vent: true, mast: false }); h12Gantry(976, hz - 70, .3, u, { col: '#0a0e0c' });
    const P = h12Puff('235,242,255', 9); for (let i = 0; i < 12; i++) { const k = (u * .12 + i / 12) % 1, r = 60 + k * 220; ctx.globalAlpha = (1 - k) * .4; ctx.drawImage(P, 940 - r + k * 200, hz - 90 - k * 220 - r, r * 2, r * 2); } ctx.globalAlpha = 1;
    [[700, .5], [1180, -.4], [940, 0]].forEach(function (b, i) { h12Beam(b[0], hz - 40, -Math.PI / 2 + b[1] + Math.sin(u * .35 + i) * .3, 1000, .025, .16); });
    h12Treeline(hz, 60, 21, '#04070a', -100, 520); h12Treeline(hz, 60, 22, '#04070a', 1360, 1700);
    // the wire, a sentry and his dog walking it, the warning board
    const gy = hz + 50; ctx.fillStyle = '#060806'; ctx.fillRect(-100, hz, 1800, hv - hz + 100);
    dqWireFence(u, [-100, gy + 30], [1700, gy + 10], 0, { h: 80 });
    const sx = -80 + ((u * 38) % 1800); ddpMan(sx, gy + 14, .82, u * 1.4, { ger: true, run: .3, dir: 1, haze: .2 }); ctx.fillStyle = '#05070a'; ctx.beginPath(); ctx.ellipse(sx + 46, gy + 2, 18, 7, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(sx + 64, gy - 6, 7, 5, .3, 0, 7); ctx.fill(); ctx.fillRect(sx + 32, gy + 2, 3, 12); ctx.fillRect(sx + 56, gy + 2, 3, 12);
    ctx.fillStyle = '#c8b040'; ctx.fillRect(1060, gy - 70, 110, 52); ctx.fillStyle = '#121212'; ctx.font = '700 14px "Stardos Stencil", Impact'; ctx.textAlign = 'center'; ctx.fillText('ACHTUNG!', 1115, gy - 50); ctx.font = '700 9px monospace'; ctx.fillText('SPERRGEBIET', 1115, gy - 36); ctx.fillText('LEBENSGEFAHR', 1115, gy - 24); ctx.textAlign = 'left'; ctx.fillStyle = '#121212'; ctx.fillRect(1110, gy - 18, 6, 50);
    // ground mist and god rays through the trunks
    const M = h12Puff('150,165,200', 33, 1); for (let i = 0; i < 18; i++) { const k = (u * .04 + i / 18) % 1, r = 260; ctx.globalAlpha = .3 * Math.sin(k * Math.PI); ctx.drawImage(M, -300 + ((i * 131) % 1900) + k * 200 - r, hz + 60 + (i % 4) * 40 - r * .4, r * 2, r * .8); } ctx.globalAlpha = 1;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) { const x = 300 + i * 190 - dr, g = ctx.createLinearGradient(940, hz - 80, x, hv); g.addColorStop(0, 'rgba(210,225,255,.05)'); g.addColorStop(1, 'rgba(210,225,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(940, hz - 80); ctx.lineTo(x - 70, hv); ctx.lineTo(x + 70, hv); ctx.closePath(); ctx.fill(); } ctx.restore();
    // foreground trunks and the section crouched among them
    [[-40, 70], [230, 46], [520, 90], [1250, 60], [1480, 100]].forEach(function (tr, i) { h12Trunk(tr[0] - dr * (1 + i * .1), tr[1], -100, hv + 40, '#7a7a8a', 40 + i); });
    ctx.fillStyle = '#020302'; ctx.beginPath(); ctx.moveTo(-100, -100); for (let x = -100; x <= 1700; x += 30) ctx.lineTo(x, -30 + Math.sin(x * .02) * 30 + ddpR(Math.floor(x / 30)) * 50); ctx.lineTo(1700, -100); ctx.fill();
    [[340, 1.25, 1], [610, 1.1, 1], [1120, 1.15, -1], [1380, 1.3, -1]].forEach(function (m, i) { ddpMan(m[0] - dr * 1.2, hv * .97, m[1], u, { run: 0, dir: m[2], crouch: 1, haze: 0 }); });
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(-100, hv * .95, 1800, 100);
    h12Grade(hv, 'rgba(60,90,160,1)', 'rgba(0,10,20,1)', .45); h12Motes(hv, u, 40, '200,215,255');
}
function h12IntroFrame(t, w, h) { const U = w / 1600, hv = h / U, c = M12CS.cuts; ctx.save(); ctx.scale(U, U); ctx.textAlign = 'left';
    if (t < c[0]) h12ShotMap(t, hv); else if (t < c[1]) h12ShotAir(t - c[0], hv); else if (t < c[2]) h12ShotRocket(t - c[1], hv); else if (t < c[3]) h12ShotSea(t - c[2], hv); else h12ShotPines(t - c[3], hv);
    ctx.restore(); ddpBloom(w, h); }
function h12Letterbox(w, h, k) { const bar = Math.round(h * .085 * k); ctx.fillStyle = '#030303'; ctx.fillRect(0, 0, w, bar); ctx.fillRect(0, h - bar, w, bar); return bar; }
function h12Caption(w, h, bar, txt, k, size) { if (!txt) return; const n = Math.min(txt.length, Math.floor(k * 38)); ctx.save(); ctx.textAlign = 'center'; ctx.font = '700 ' + (size || 17) + 'px "Special Elite", "Courier New", monospace'; const tw = ctx.measureText(txt).width; ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(w / 2 - tw / 2 - 18, h - bar - 44, tw + 36, 30); ctx.fillStyle = '#d6a91c'; ctx.fillRect(w / 2 - tw / 2 - 18, h - bar - 44, 3, 30); ctx.fillStyle = '#f2ead0'; ctx.shadowColor = '#000'; ctx.shadowBlur = 6; ctx.fillText(txt.slice(0, n), w / 2, h - bar - 23); ctx.restore(); }
function drawM12CutsceneHD(now) {
    if (!campaignCutsceneRunning) return;
    const t = Math.max(0, (now - campaignCutsceneStart) / 1000), w = canvas.width, h = canvas.height;
    if (!CS2.grain) CS2.grain = cs2Grain();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    try { h12IntroFrame(t, w, h); } catch (e) { DDP.err = e; ctx.setTransform(1, 0, 0, 1, 0, 0); }
    let flash = 0; M12CS.cuts.forEach(function (c) { const d = t - c; if (d >= 0 && d < .18) flash = Math.max(flash, .22 * (1 - d / .18)); });
    cs2Once('m12pin', t > 3.4, function () { try { playTone(300, 200, .08, .05, 'triangle'); } catch (e) {} });
    cs2Once('m12drone', t > M12CS.cuts[0] + .1, function () { try { playTone(70, 66, 7, .05, 'sawtooth'); } catch (e) {} });
    cs2Once('m12hiss', t > M12CS.cuts[1] + .2, function () { try { playTone(2400, 1800, 1.8, .015, 'sawtooth'); } catch (e) {} });
    if (t > M12CS.cuts[2] && t < M12CS.cuts[3] && Math.floor(t * 1.5) !== M12CS.wv) { M12CS.wv = Math.floor(t * 1.5); try { playTone(90, 60, .6, .02, 'sine'); } catch (e) {} }
    ctx.save(); ctx.globalAlpha = .09; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    const vg = ctx.createRadialGradient(w / 2, h * .5, w * .22, w / 2, h * .5, w * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.65)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    if (flash > 0) { ctx.fillStyle = 'rgba(225,235,255,' + flash + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = h12Letterbox(w, h, h12E(Math.min(1, t / 1.2)));
    // the opening title, centred in the lamp light
    const ta = Math.min(h12K(t, .6, 1.6), 1 - h12K(t, 5.6, 6.6)); if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; ctx.textAlign = 'center'; const cy = h * .44, sp = 4 + (1 - ta) * 10;
        ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, cy - 70, w, 132); ctx.strokeStyle = 'rgba(214,169,28,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(w * .3, cy - 50); ctx.lineTo(w * .7, cy - 50); ctx.moveTo(w * .3, cy + 44); ctx.lineTo(w * .7, cy + 44); ctx.stroke();
        ctx.fillStyle = '#d9c88c'; ctx.font = '700 ' + Math.round(w * .0105) + 'px "Special Elite", monospace'; ctx.fillText('— OPERATION OVERLORD · ACT III · MISSION 12 —', w / 2, cy - 28); ctx.fillStyle = '#f6eed4'; ctx.shadowColor = 'rgba(255,190,90,.55)'; ctx.shadowBlur = 24; ctx.font = '700 ' + Math.round(w * .052) + 'px "Stardos Stencil", Impact, sans-serif'; if (ctx.letterSpacing !== undefined) ctx.letterSpacing = sp + 'px'; ctx.fillText('OPERATION HYDRA', w / 2, cy + 26); if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px'; ctx.shadowBlur = 0;
        ctx.fillStyle = '#d9c88c'; ctx.font = Math.round(w * .0105) + 'px "Special Elite", monospace'; ctx.fillText('17 JULY 1944   ·   D+41   ·   23:30   ·   PEENEMÜNDE, USEDOM', w / 2, cy + 62); ctx.restore(); }
    const caps = [[6.8, 'LONDON. CAPT. DOYLE\'S REPORT HAS REACHED THE WAR CABINET.'], [8.6, 'PEENEMÜNDE, ON THE BALTIC. THE GERMANS CALL IT THE A4.'], [11.8, 'HITLER CALLS IT VENGEANCE WEAPON TWO.'], [16.0, 'A ROCKET FORTY-SIX FEET TALL. A TON OF EXPLOSIVE. NO DEFENCE.'], [19.6, 'TONIGHT THEY FUEL ONE FOR LONDON. X-ZEIT: TWELVE MINUTES AFTER WE LAND.'], [23.8, 'No. 62 COMMANDO GOES IN FROM THE SEA.'], [27.0, 'FOUR CHARGES: OXYGEN PLANT, ASSEMBLY HALL, LAUNCH BUNKER, GUIDANCE LAB.'], [31.4, 'AND TONIGHT SIX HUNDRED BOMBERS ARE COMING TOO.'], [34.8, 'BE ON THE BOAT BEFORE THEY ARRIVE.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; }); const sd = t - 38.6; if (ci >= 0 && sd < 0) h12Caption(w, h, bar, caps[ci][1], t - caps[ci][0], Math.round(w * .0108));
    cs2Once('m12stamp', sd > 0, function () { try { playExplosionSound(1.3); playTone(160, 50, .5, .12, 'square'); } catch (e) {} });
    if (sd > 0) { const k = h12K(sd, 0, .24), sc = 3.2 + (1 - 3.2) * h12E(k), fade = h12K(M12CS.dur - .2 - t, 0, .7); ctx.save(); ctx.translate(w / 2, h * .44); ctx.rotate(-.04); ctx.scale(sc, sc); ctx.globalAlpha = k * fade;
        ctx.fillStyle = 'rgba(6,6,4,.88)'; ctx.fillRect(-w, -96, w * 2, 192); [-96, 80].forEach(function (y) { ctx.save(); ctx.beginPath(); ctx.rect(-w, y, w * 2, 16); ctx.clip(); ctx.fillStyle = '#d6a91c'; ctx.fillRect(-w, y, w * 2, 16); ctx.fillStyle = '#16140f'; for (let x = -w - 40; x < w + 40; x += 40) { ctx.beginPath(); ctx.moveTo(x, y + 16); ctx.lineTo(x + 20, y); ctx.lineTo(x + 34, y); ctx.lineTo(x + 14, y + 16); ctx.fill(); } ctx.restore(); });
        ctx.textAlign = 'center'; ctx.fillStyle = '#d9c88c'; ctx.font = '700 15px "Special Elite", monospace'; ctx.fillText('— ACT III · COMMANDO RAID · MISSION 12 —', 0, -52); ctx.fillStyle = '#f6eed4'; ctx.strokeStyle = '#000'; ctx.lineWidth = 8; ctx.shadowColor = 'rgba(255,90,40,.6)'; ctx.shadowBlur = 30; ctx.font = '700 84px "Stardos Stencil", Impact, sans-serif'; ctx.strokeText('ROCKET RAID', 0, 26); ctx.fillText('ROCKET RAID', 0, 26); ctx.shadowBlur = 0; ctx.fillStyle = '#e8c968'; ctx.font = '700 18px "Special Elite", monospace'; ctx.fillText('STOP THE V-2.', 0, 60); ctx.restore(); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8); ctx.textAlign = 'left';
    const fa = Math.max(h12K(1 - t, 0, 1), h12K(t, M12CS.dur - 1, M12CS.dur)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + fa + ')'; ctx.fillRect(0, 0, w, h); }
    if (t < M12CS.dur) campaignCutsceneFrame = requestAnimationFrame(drawM12CutsceneHD); else finishCampaignCutscene();
}

/* =========================== ENDING =========================== */
const M12E2 = { dur: 24, cut: 7.5, cut2: 15 };
function h12EndEscape(t, hv) { // MTB 718 tearing away; the coast lit by markers, bombs, flak, fire
    const hz = hv * .5, bob = Math.sin(t * 2.2) * 5; ctx.save(); ctx.translate(0, bob);
    const sk = ctx.createLinearGradient(0, -100, 0, hz); sk.addColorStop(0, '#03040a'); sk.addColorStop(.6, '#1c1626'); sk.addColorStop(1, '#5a2a1a'); ctx.fillStyle = sk; ctx.fillRect(-200, -200, 2000, hz + 202); ctx.drawImage(h12Stars(hv), -100, -40);
    h12Moon(240, hz - 300, 28, .8); for (let i = 0; i < 6; i++) h12Lanc(((t * 110 + i * 330) % 2100) - 250, 90 + (i % 3) * 60 + Math.sin(i * 2) * 20, .9 + (i % 2) * .4);
    ctx.drawImage(h12CloudBank(11, '255,170,110', '40,24,30'), -300 - t * 10, hz - 420, 2600, 420);
    // target indicators drifting down like chandeliers
    for (let i = 0; i < 6; i++) { const k = (t * .12 + i / 6) % 1, x = 700 + (i * 173 % 700), y = 60 + k * (hz - 80), col = i % 2 ? '255,70,50' : '90,255,120'; ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let j = 0; j < 12; j++) { const a = j / 12 * 6.28; h12Dot(x + Math.cos(a) * 18 * (1 - k * .3), y + j * 3 + Math.sin(a) * 6, 10, col, .6); } h12Dot(x, y + 20, 120, col, .18); ctx.restore(); ctx.strokeStyle = 'rgba(200,200,200,.12)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 8, y - 120); ctx.stroke(); }
    // flak bursts and tracer
    for (let i = 0; i < 16; i++) { const k = (t * .8 + i / 16) % 1; if (k < .3) { const x = 300 + ddpR(i) * 1200, y = 60 + ddpR(i * 3) * (hz - 180); h12Glow(x, y, 60 + k * 160, '255,200,120', .5 * (1 - k / .3)); ctx.fillStyle = 'rgba(20,18,18,' + (.7 - k * 2) + ')'; ctx.beginPath(); ctx.arc(x, y, 8 + k * 60, 0, 7); ctx.fill(); } }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 10; i++) { const k = (t * .9 + i / 10) % 1, x0 = 800 + (i * 97 % 700), a = -Math.PI / 2 + (ddpR(i) - .5) * .8; ctx.strokeStyle = 'rgba(255,' + (150 + i * 8) + ',80,' + (1 - k) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + Math.cos(a) * k * 700, hz - 20 + Math.sin(a) * k * 700); ctx.lineTo(x0 + Math.cos(a) * (k * 700 + 40), hz - 20 + Math.sin(a) * (k * 700 + 40)); ctx.stroke(); } ctx.restore();
    // the burning coast
    [[820, 1.6, 2], [1040, 2.4, 3], [1250, 1.4, 4], [930, 3.3, 5], [1150, 4.2, 6]].forEach(function (b, i) { const k = t - b[1]; if (k < 0) return; m12EOnce('e' + i, true, function () { try { playExplosionSound(1.3); } catch (e) {} }); h12Column(b[0], hz - 10, t + i * 3, { h: 520, w: 110, lean: .25, seed: b[2], a: .8 }); h12Fire(b[0], hz - 4, 1.3, t, b[2]); if (k < .9) { h12Glow(b[0], hz - 30, 320 * (1 - k / .9) + 60, '255,220,160', .8 * (1 - k / .9)); h12Fire(b[0], hz - 10, 2.4 * (1 - k / .9) + .6, t, b[2] + 7); } });
    h12Glow(1040, hz, 900, '255,140,60', .3); h12Treeline(hz - 4, 24, 61, '#0a0606', -200, 1800); ctx.fillStyle = '#0a0606'; ctx.fillRect(-200, hz - 6, 2000, 8);
    [[700, .3], [1350, -.3]].forEach(function (b, i) { h12Beam(b[0], hz - 16, -Math.PI / 2 + b[1] + Math.sin(t * .6 + i) * .4, 1100, .025, .15); });
    h12Sea(hz, hv + 60, t * 2.2, { gx: 1040, gc: '255,160,90', ga: 1.3, far: '#4a2a22', mid: '#140e12', near: '#030406', haze: .35 });
    h12MTB(620 - t * 18, hv * .78, 2.1, t); ctx.restore();
    h12Grade(hv, 'rgba(255,140,80,1)', 'rgba(20,30,60,1)', .35);
    return 0; }
function h12EndBoom(u, hv) { // Prüfstand VII: the charges, then the rocket goes up on its table
    const hz = hv * .8, boom = 1.6, k = u - boom, sh = k > 0 && k < 2.4 ? (2.4 - k) * 9 : 0; ctx.save(); ctx.translate((Math.random() - .5) * sh, (Math.random() - .5) * sh);
    const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#04020a'); sk.addColorStop(1, k > 0 ? '#5a2410' : '#1e2a40'); ctx.fillStyle = sk; ctx.fillRect(-200, -200, 2000, hz + 202); ctx.drawImage(h12Stars(hv), -100, 0);
    for (let i = 0; i < 4; i++) h12Lanc(((u * 130 + i * 420) % 2100) - 250, 70 + i * 34, 1.2);
    ctx.fillStyle = '#0a0c08'; ctx.beginPath(); ctx.moveTo(-100, hz + 20); ctx.quadraticCurveTo(800, hz - 300, 1700, hz + 20); ctx.fill(); h12Treeline(hz - 200, 70, 4, '#050605', -100, 520); h12Treeline(hz - 200, 70, 5, '#050605', 1080, 1700);
    const gg = ctx.createLinearGradient(0, hz, 0, hv); gg.addColorStop(0, '#3a3430'); gg.addColorStop(1, '#0e0a08'); ctx.fillStyle = gg; ctx.fillRect(-100, hz, 1800, hv - hz + 100);
    if (k < 0) [[40, hz - 260], [1560, hz - 280]].forEach(function (L) { h12Beam(L[0], L[1], Math.atan2(hz - 300 - L[1], 800 - L[0]), 1100, .1, .12); });
    // the gantry topples, the rocket breaks and falls into the fire
    ctx.save(); ctx.translate(930, hz); ctx.rotate(k > .4 ? Math.min(1.25, Math.pow(k - .4, 2) * .35) : 0); ctx.translate(-930, -hz); h12Gantry(930, hz, 1.32, u, { lamps: k < .2 }); ctx.restore();
    if (k < .05) h12V2(800, hz - 10, 1.32, { t: u, vent: true });
    else if (k < 4.5) { ctx.save(); ctx.translate(800, hz - 230); ctx.rotate(-Math.min(1.6, k * k * .18)); ctx.translate(-800 - k * 30, -(hz - 230) + k * k * 30); ctx.beginPath(); ctx.rect(0, -400, 1600, hz - 230 + 400); ctx.clip(); h12V2(800, hz - 10, 1.32, { t: u, mast: false }); ctx.restore(); }
    // the charges: sparks at the base, a red light, then white
    if (k < 0) { const sp = h12K(u, .2, boom); for (let i = 0; i < 20; i++) { const a = ddpR(i + Math.floor(u * 20)) * 6.28, d = ddpR(i * 7 + Math.floor(u * 30)) * 50; ctx.fillStyle = 'rgba(255,' + (200 + i * 2) + ',120,' + sp + ')'; ctx.fillRect(800 + Math.cos(a) * d, hz - 20 + Math.sin(a) * d * .4, 3, 3); } h12Glow(800, hz - 20, 160, '255,80,40', .5 * sp * (.6 + .4 * Math.sin(u * 30))); }
    let flash = 0; if (k > 0) { m12EOnce('v2', true, function () { try { playExplosionSound(2.2); playTone(55, 25, 2.5, .18, 'sawtooth'); } catch (e) {} }); if (k < .35) flash = .95 * (1 - k / .35);
        // shock ring along the ground
        if (k < 1.2) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,220,170,' + (1 - k / 1.2) * .6 + ')'; ctx.lineWidth = 10 * (1 - k / 1.2) + 2; ctx.beginPath(); ctx.ellipse(800, hz + 10, 80 + k * 1100, 20 + k * 120, 0, Math.PI, Math.PI * 2); ctx.stroke(); ctx.restore(); }
        h12Column(800, hz - 300 - k * 40, u, { h: 700, w: 220, lean: .12, seed: 3, a: Math.min(1, k * .5) });
        h12Fireball(800, hz - 30, k, 1.15, 13); h12Fire(700, hz, 1.6, u, 2); h12Fire(900, hz, 1.6, u, 3); h12Fire(800, hz + 10, 2, u, 4);
        for (let i = 0; i < 60; i++) { const kk = k - (i % 6) * .04; if (kk < 0) continue; const a = -Math.PI / 2 + (ddpR(i) - .5) * 2.6, sp2 = 300 + ddpR(i * 3) * 700, x = 800 + Math.cos(a) * sp2 * kk, y = hz - 80 + Math.sin(a) * sp2 * kk + 260 * kk * kk; if (y > hv + 20) continue; ctx.fillStyle = 'rgba(255,' + (150 + ddpR(i) * 100 | 0) + ',70,' + Math.max(0, 1 - kk / 3) + ')'; ctx.fillRect(x, y, 3 + (i % 3), 3 + (i % 3)); if (i % 5 === 0) { ctx.fillStyle = 'rgba(20,16,12,' + Math.max(0, 1 - kk / 3) + ')'; ctx.fillRect(x - 6, y - 4, 12, 7); } } }
    ctx.restore();
    // the near earth wall, catching the fire
    ctx.fillStyle = '#0c0806'; ctx.beginPath(); ctx.moveTo(-100, hv + 60); ctx.lineTo(-100, hz + 90); ctx.quadraticCurveTo(800, hz + 30, 1700, hz + 90); ctx.lineTo(1700, hv + 60); ctx.fill(); if (k > 0) { ctx.strokeStyle = 'rgba(255,150,70,' + Math.min(.7, k * .5) + ')'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-100, hz + 90); ctx.quadraticCurveTo(800, hz + 30, 1700, hz + 90); ctx.stroke(); }
    h12Grade(hv, k > 0 ? 'rgba(255,140,60,1)' : 'rgba(70,100,170,1)', 'rgba(30,20,20,1)', .4);
    return flash; }
function h12EndDawn(u, hv) { // first light: the column of smoke over Usedom, MTB 718 small on a calm sea
    const hz = hv * .58, sunY = hz + 30 - h12E(h12K(u, 0, 9)) * 90; const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#1a2234'); sk.addColorStop(.45, '#5a5a6a'); sk.addColorStop(.8, '#d89a6a'); sk.addColorStop(1, '#f6d29a'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 102);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(1180, sunY, 700, '255,190,120', .4); h12Dot(1180, sunY, 160, '255,236,190', .8); ctx.restore(); ctx.fillStyle = '#fff2d0'; ctx.beginPath(); ctx.arc(1180, sunY, 30, 0, 7); ctx.fill();
    ctx.globalAlpha = .75; ctx.drawImage(h12CloudBank(17, '255,200,150', '90,70,90'), -400 + u * 6, hz - 420, 2600, 380); ctx.globalAlpha = 1;
    h12Column(560, hz - 20, u + 20, { h: 760, w: 160, lean: .55, seed: 7, rgb: '44,36,40', lit: '255,170,110', la: .5, a: .9, n: 34, speed: .03 });
    ctx.fillStyle = '#2a2430'; ctx.beginPath(); ctx.moveTo(-100, hz + 2); for (let x = -100; x <= 1100; x += 20) ctx.lineTo(x, hz - 10 - Math.sin(x * .01) * 6 - ddpR(Math.floor(x / 20)) * 8); ctx.lineTo(1100, hz + 2); ctx.fill(); h12Glow(560, hz - 6, 160, '255,120,60', .4);
    h12Sea(hz, hv + 60, u * .6, { gx: 1180, gc: '255,214,160', ga: 1.4, far: '#a08080', mid: '#4a4a5a', near: '#141a24', haze: .45 });
    h12MTB(1000 - u * 22, hz + 80, .55, u * .5, {});
    for (let i = 0; i < 4; i++) { const x = 1300 + i * 40 - u * 30 + Math.sin(u + i) * 10, y = hz - 220 - i * 18 + Math.sin(u * 3 + i) * 6, f = Math.sin(u * 7 + i * 2) * 6; ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x - 12, y + f); ctx.quadraticCurveTo(x - 6, y - 4, x, y); ctx.quadraticCurveTo(x + 6, y - 4, x + 12, y + f); ctx.stroke(); }
    h12Grade(hv, 'rgba(255,180,120,1)', 'rgba(40,50,80,1)', .35);
    return 0; }
function m12EndFrameHD(now) {
    const E = M12E2, t = Math.max(0, (now - M12E.t0) / 1000), w = canvas.width, h = canvas.height, U = w / 1600, hv = h / U;
    if (t >= E.dur) { window.removeEventListener('keydown', M12E.skip); if (M12E.done) M12E.done(); return; }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); ctx.scale(U, U); ctx.textAlign = 'left';
    let flash = 0; try { if (t < E.cut) flash = h12EndEscape(t, hv); else if (t < E.cut2) flash = h12EndBoom(t - E.cut, hv); else flash = h12EndDawn(t - E.cut2, hv); } catch (e) { DDP.err = e; }
    ctx.restore(); try { ddpBloom(w, h); } catch (e) {}
    ctx.save(); ctx.globalAlpha = .09; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    const vg = ctx.createRadialGradient(w / 2, h * .5, w * .22, w / 2, h * .5, w * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    [E.cut, E.cut2].forEach(function (c) { const d = t - c; if (d >= 0 && d < .2) flash = Math.max(flash, .25 * (1 - d / .2)); });
    if (flash > 0) { ctx.fillStyle = 'rgba(255,240,215,' + Math.min(.95, flash) + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = h12Letterbox(w, h, 1);
    const caps = [[.6, 'MTB 718 · 00:41 · ALL ABOARD. FULL AHEAD.'], [2.8, 'BEHIND THEM, THE FUSES RUN OUT — AND THE BOMBERS ARRIVE.'], [7.9, 'PRÜFSTAND VII.'], [10.4, 'THE ROCKET NEVER LEAVES ITS TABLE.'], [15.4, 'DAWN, 18 JULY. THE SMOKE OVER USEDOM IS SEEN FROM SWEDEN.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; }); if (ci >= 0 && t < E.cut2 + 3.6) h12Caption(w, h, bar, caps[ci][1], t - caps[ci][0], Math.round(w * .0108));
    if (t > E.cut2 + 3.8) { const k = h12E(h12K(t, E.cut2 + 3.8, E.cut2 + 5)); ctx.save(); ctx.globalAlpha = k; ctx.textAlign = 'center'; const cy = h * .36;
        ctx.fillStyle = 'rgba(0,0,0,' + .45 * k + ')'; ctx.fillRect(0, cy - 90, w, 190); ctx.strokeStyle = 'rgba(214,169,28,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(w * .22, cy - 66); ctx.lineTo(w * .78, cy - 66); ctx.moveTo(w * .22, cy + 76); ctx.lineTo(w * .78, cy + 76); ctx.stroke();
        ctx.fillStyle = '#e8d8a0'; ctx.font = '700 ' + Math.round(w * .011) + 'px "Special Elite", monospace'; ctx.fillText('OPERATION HYDRA — COMPLETE', w / 2, cy - 40);
        ctx.fillStyle = '#ffd24a'; ctx.shadowColor = 'rgba(255,150,40,.7)'; ctx.shadowBlur = 30; ctx.font = '700 ' + Math.round(w * .056) + 'px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('THE ROCKET WILL NOT FLY', w / 2, cy + 24); ctx.shadowBlur = 0;
        ctx.fillStyle = '#f0e6c8'; ctx.font = Math.round(w * .0125) + 'px "Special Elite", monospace'; ctx.fillText('PEENEMÜNDE WRECKED  ·  THE V-2 SET BACK BY MONTHS  ·  LONDON SPARED', w / 2, cy + 58); ctx.fillStyle = 'rgba(232,216,160,.7)'; ctx.font = Math.round(w * .0105) + 'px "Special Elite", monospace'; ctx.fillText('ACT III — THE LONG NIGHT IS OVER', w / 2, cy + 104); ctx.restore(); }
    const fa = Math.max(h12K(.8 - t, 0, .8), h12K(t, E.dur - 1.2, E.dur)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + fa + ')'; ctx.fillRect(0, 0, w, h); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8); ctx.textAlign = 'left';
    M12E.raf = requestAnimationFrame(m12EndFrameHD);
}
