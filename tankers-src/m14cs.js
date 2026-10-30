/* =====================================================
   MISSION 14 CUTSCENES — Leyte Gulf at dusk with the PT tender, Oldendorf's battle line, the night run,
   Nishimura's pagoda battleships coming up the strait, star shells. Ending: crossing the T, then dawn.
===================================================== */
const M14CS = { dur: 41, cuts: [8, 16, 24, 32] };
/* ---------- silhouettes (side view, bow to the right, waterline at y=0) ---------- */
function h14Hull(L, F, A, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-L, 4); ctx.lineTo(-L - 4, -A); ctx.lineTo(L * .4, -F * .82); ctx.quadraticCurveTo(L * .9, -F, L + 14, -F - 4); ctx.lineTo(L * .94, 4); ctx.closePath(); ctx.fill(); }
function h14Rim(pts, rim) { if (!rim) return; ctx.strokeStyle = rim; ctx.lineWidth = 1.3; ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke(); }
function h14Gun(x, y, w, h, dir, bl, col, flash) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2 + 3, y - h); ctx.lineTo(x + w / 2 - 2, y - h); ctx.lineTo(x + w / 2, y); ctx.fill(); ctx.fillRect(dir > 0 ? x + w / 2 - 2 : x - w / 2 - bl + 2, y - h * .6, bl, 2.4); ctx.fillRect(dir > 0 ? x + w / 2 - 2 : x - w / 2 - bl + 2, y - h * .3, bl, 2.4);
    if (flash > 0) { const fx = dir > 0 ? x + w / 2 + bl : x - w / 2 - bl; ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(fx, y - h * .45, 120 * flash, '255,190,90', .9 * flash); h12Dot(fx, y - h * .45, 34 * flash, '255,250,220', flash); ctx.restore(); } }
function h14Pagoda(x, y, s, o) { o = o || {}; const c = o.col || '#0a0c10', fl = o.flash || []; ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
    h14Hull(210, 30, 22, c); h14Rim([[-214, -22], [84, -25], [224, -34]], o.rim);
    ctx.fillStyle = c; ctx.fillRect(-160, -40, 300, 18);
    [[160, 1], [118, 1], [10, 1], [-30, -1], [-110, -1], [-152, -1]].forEach(function (t, i) { h14Gun(t[0], -36 - (i === 1 ? 10 : 0), 26, 14, t[1], 34, c, fl[i] || 0); });
    // the pagoda: platforms stacked like a pile of crates
    const pg = [[70, -40, 34], [72, -62, 28], [66, -82, 40], [70, -100, 30], [74, -116, 44], [70, -134, 26], [72, -150, 36], [74, -166, 20], [76, -182, 28], [78, -196, 12]];
    pg.forEach(function (p) { ctx.fillRect(p[0] - p[2] / 2, p[1] - 18, p[2], 18); }); ctx.fillRect(76, -224, 3, 30);
    if (o.rim) h14Rim([[48, -116], [96, -116], [96, -134], [54, -168], [90, -168], [90, -196]], o.rim);
    ctx.beginPath(); ctx.moveTo(-6, -40); ctx.lineTo(0, -112); ctx.lineTo(26, -112); ctx.lineTo(30, -40); ctx.fill(); // funnel
    ctx.fillRect(-72, -100, 22, 60); ctx.fillRect(-80, -112, 38, 14); ctx.fillRect(-64, -150, 4, 40); // aft tower
    if (o.lit) { ctx.fillStyle = 'rgba(255,220,150,.7)'; for (let i = 0; i < 6; i++) ctx.fillRect(56 + (i % 3) * 10, -130 - Math.floor(i / 3) * 30, 3, 2); }
    if (o.beam !== undefined) { ctx.restore(); h12Beam(x + (o.flip ? -1 : 1) * 80 * s, y - 150 * s, o.beam, 1300 * s, .06, .22); return; }
    ctx.restore(); }
function h14DDj(x, y, s, o) { o = o || {}; const c = o.col || '#0a0c10', fl = o.flash || []; ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
    h14Hull(120, 20, 12, c); h14Rim([[-124, -12], [48, -16], [134, -24]], o.rim); ctx.fillStyle = c;
    h14Gun(90, -20, 18, 12, 1, 18, c, fl[0] || 0); h14Gun(-70, -16, 18, 12, -1, 18, c, fl[1] || 0); h14Gun(-100, -16, 16, 10, -1, 14, c, fl[2] || 0);
    ctx.fillRect(48, -50, 26, 32); ctx.fillRect(52, -62, 16, 12); ctx.fillRect(60, -100, 3, 40); ctx.fillRect(-60, -80, 2, 66);
    [[10, -64], [-20, -60]].forEach(function (f) { ctx.beginPath(); ctx.moveTo(f[0] - 10, -14); ctx.lineTo(f[0] - 4, f[1]); ctx.lineTo(f[0] + 10, f[1]); ctx.lineTo(f[0] + 12, -14); ctx.fill(); });
    ctx.fillRect(-46, -22, 30, 6); ctx.fillRect(-4, -22, 20, 6); ctx.restore(); }
function h14BBus(x, y, s, o) { o = o || {}; const c = o.col || '#0c1014', fl = o.flash || []; ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
    h14Hull(190, 28, 22, c); h14Rim([[-194, -22], [76, -23], [204, -32]], o.rim); ctx.fillStyle = c; ctx.fillRect(-140, -40, 270, 18);
    [[140, 1], [100, 1], [-90, -1], [-130, -1]].forEach(function (t, i) { h14Gun(t[0], -36 - (i === 1 || i === 2 ? 10 : 0), 30, 16, t[1], 44, c, fl[i] || 0); });
    // tower bridge and tripod masts of a rebuilt Pearl Harbor veteran
    ctx.fillRect(40, -96, 34, 58); ctx.fillRect(34, -108, 46, 12); ctx.fillRect(46, -150, 22, 42); ctx.fillRect(40, -158, 34, 10); ctx.fillRect(56, -190, 3, 34);
    ctx.beginPath(); ctx.moveTo(-10, -40); ctx.lineTo(-4, -104); ctx.lineTo(24, -104); ctx.lineTo(28, -40); ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-60, -40); ctx.lineTo(-48, -150); ctx.lineTo(-36, -40); ctx.stroke(); ctx.fillRect(-60, -160, 26, 12);
    [[-170, -40], [-150, -40]].forEach(function () {}); ctx.fillRect(-170, -60, 2, 20);
    if (o.rim) h14Rim([[34, -108], [80, -108], [80, -96], [40, -158], [74, -158]], o.rim);
    ctx.restore(); }
function h14PT(x, y, s, t, o) { o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s); const P = h12Puff('225,236,248', 23), sp = o.speed === undefined ? 1 : o.speed;
    if (sp > 0) { for (let i = 0; i < 18; i++) { const k = (t * 1.6 + i / 18) % 1; ctx.globalAlpha = (1 - k) * .45 * sp; const r = 24 + k * 90; ctx.drawImage(P, -150 - k * 520 - r, 4 - r * .35, r * 2, r * .7); }
        for (let i = 0; i < 10; i++) { const k = (t * 2.4 + i / 10) % 1; ctx.globalAlpha = (1 - k) * .5 * sp; const r = 14 + k * 46; ctx.drawImage(P, 120 - k * 50 - r, -8 - Math.sin(k * 3) * 46 - r * .5, r * 2, r); } ctx.globalAlpha = 1; }
    const hg = ctx.createLinearGradient(0, -34, 0, 10); hg.addColorStop(0, o.lit ? '#6a7a6a' : '#3a463a'); hg.addColorStop(.3, '#253025'); hg.addColorStop(1, '#0c100c'); ctx.fillStyle = hg;
    ctx.beginPath(); ctx.moveTo(-150, -22); ctx.lineTo(100, -26); ctx.quadraticCurveTo(140, -28, 160, -36); ctx.lineTo(150, -4); ctx.quadraticCurveTo(120, 8, 60, 10); ctx.lineTo(-150, 8); ctx.closePath(); ctx.fill();
    if (o.rim) h14Rim([[-150, -22], [100, -26], [160, -36]], o.rim);
    ctx.fillStyle = '#e8e2c8'; ctx.font = '700 15px "Stardos Stencil", Impact'; ctx.fillText(o.num || '137', 96, -8);
    ctx.fillStyle = '#1a221a'; ctx.beginPath(); ctx.moveTo(10, -26); ctx.lineTo(16, -54); ctx.lineTo(62, -54); ctx.lineTo(76, -26); ctx.fill(); ctx.fillStyle = 'rgba(160,190,210,.4)'; ctx.fillRect(40, -50, 26, 7); // chartroom and windshield
    ctx.fillStyle = '#121812'; ctx.fillRect(30, -98, 3, 46); ctx.beginPath(); ctx.ellipse(31.5, -100, 9, 6, 0, 0, 7); ctx.fill(); // the SO radar dome on its mast
    [[-10, -24], [-70, -24]].forEach(function (tb) { ctx.fillStyle = '#141a14'; ctx.fillRect(tb[0] - 30, tb[1] - 9, 56, 9); ctx.fillStyle = '#2a322a'; ctx.beginPath(); ctx.arc(tb[0] + 26, tb[1] - 4.5, 4.5, 0, 7); ctx.fill(); }); // torpedo tubes
    [[0, -30], [-50, -30]].forEach(function (g) { ctx.fillStyle = '#0e120e'; ctx.beginPath(); ctx.arc(g[0], g[1], 7, Math.PI, 0); ctx.fill(); ctx.fillRect(g[0], g[1] - 10, 22, 2); ctx.fillRect(g[0], g[1] - 6, 22, 2); }); ctx.fillRect(-130, -38, 3, 14); ctx.fillRect(-136, -40, 16, 4); // twin .50s and the 20mm
    if (o.flagT !== undefined) { ctx.fillStyle = '#e8e4dc'; ctx.save(); ctx.translate(-140, -60); const wv = Math.sin(t * 9) * 2; ctx.fillRect(0, 0, 2, 38); ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(-30, wv); ctx.lineTo(-30, 16 + wv); ctx.lineTo(-2, 16); ctx.fill(); ctx.fillStyle = '#b02020'; for (let i = 0; i < 4; i++) ctx.fillRect(-30, 2 + i * 4, 28, 2); ctx.fillStyle = '#1a2a6a'; ctx.fillRect(-14, 0, 12, 8); ctx.restore(); }
    [[30, -60], [56, -60], [-2, -40], [-48, -40], [-110, -32]].forEach(function (c, i) { ctx.fillStyle = '#080a08'; ctx.beginPath(); ctx.arc(c[0], c[1] - 10, 5, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(c[0], c[1] - 13, 7.5, 2.4, 0, 0, 7); ctx.fill(); ctx.fillRect(c[0] - 5, c[1] - 6, 10, 10); });
    ctx.restore(); }
function h14Tender(x, y, s, o) { o = o || {}; const c = o.col || '#0e0a12'; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); h14Hull(260, 40, 34, c); ctx.fillStyle = c; ctx.fillRect(-200, -70, 120, 36); ctx.fillRect(40, -90, 90, 56); ctx.fillRect(60, -120, 50, 30); ctx.fillRect(70, -170, 3, 50); ctx.beginPath(); ctx.moveTo(-10, -40); ctx.lineTo(-4, -110); ctx.lineTo(20, -110); ctx.lineTo(24, -40); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-60, -40); ctx.lineTo(-40, -150); ctx.lineTo(60, -50); ctx.moveTo(-40, -150); ctx.lineTo(-140, -60); ctx.stroke(); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-40, -150); ctx.lineTo(-170, -10); ctx.stroke();
    if (o.rim) h14Rim([[-264, -34], [104, -33], [274, -44]], o.rim); if (o.lit) { ctx.fillStyle = 'rgba(255,200,130,.75)'; for (let i = 0; i < 9; i++) ctx.fillRect(-180 + i * 40, -24, 5, 4); } ctx.restore(); }
function h14Splash(x, y, k, s) { if (k < 0 || k > 2.4) return; const P = h12Puff('225,236,245', 53), H = 300 * s * Math.sin(Math.min(1, k / 1.2) * Math.PI / 2) * (k > 1.2 ? 1 - (k - 1.2) / 1.2 * .5 : 1), a = k > 1.2 ? 1 - (k - 1.2) / 1.2 : 1;
    for (let i = 0; i < 12; i++) { const q = i / 12, r = (20 + q * 40) * s; ctx.globalAlpha = a * .7; ctx.drawImage(P, x + (ddpR(i) - .5) * 50 * s - r, y - H * q - r, r * 2, r * 2); } ctx.globalAlpha = 1; }
function h14ShellArc(x0, y0, x1, y1, k, h) { if (k <= 0 || k >= 1) return; const pt = function (q) { return [x0 + (x1 - x0) * q, y0 + (y1 - y0) * q - Math.sin(q * Math.PI) * h]; }; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; [[5, .18], [2, .7]].forEach(function (w) { ctx.strokeStyle = 'rgba(255,190,110,' + w[1] + ')'; ctx.lineWidth = w[0]; ctx.beginPath(); for (let j = 0; j <= 10; j++) { const p = pt(Math.max(0, k - .12 + j * .012)); if (j) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke(); }); const p = pt(k); h12Dot(p[0], p[1], 9, '255,230,170', 1); ctx.restore(); }
/* ---------- intro shots ---------- */
function h14ShotTender(u, hv) { const hz = hv * .58, pan = u * 10;
    const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#1c1838'); sk.addColorStop(.4, '#5a3050'); sk.addColorStop(.78, '#e0703a'); sk.addColorStop(1, '#ffc070'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 102);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(380 - pan * .2, hz - 14, 560, '255,160,80', .5); h12Dot(380 - pan * .2, hz - 14, 110, '255,236,190', .9); ctx.restore(); ctx.fillStyle = '#fff0c8'; ctx.beginPath(); ctx.arc(380 - pan * .2, hz - 4, 30, Math.PI, 0); ctx.fill();
    ctx.globalAlpha = .85; ctx.drawImage(h12CloudBank(41, '255,170,110', '70,36,64'), -500 - pan * .3, hz - 470, 2700, 380); ctx.globalAlpha = 1;
    ctx.fillStyle = '#2a1830'; ctx.beginPath(); ctx.moveTo(-100, hz); for (let x = -100; x <= 1800; x += 30) ctx.lineTo(x, hz - 30 - Math.sin(x * .004 + 1) * 24 - Math.abs(Math.sin(x * .017)) * 10); ctx.lineTo(1800, hz); ctx.fill(); // the hills of Leyte
    h12Sea(hz, hv + 40, u, { gx: 380 - pan * .2, gc: '255,180,110', ga: 1.3, far: '#6a3a40', mid: '#2a1a28', near: '#0a0610', haze: .3 });
    h14Tender(1060 - pan, hz + 50, .9, { col: '#120a14', rim: 'rgba(255,170,100,.6)', lit: true });
    [[620, hz + 92, .55], [790, hz + 110, .6], [1500, hz + 96, .55]].forEach(function (b, i) { h14PT(b[0] - pan * 1.1, b[1], b[2], u + i, { speed: 0, rim: 'rgba(255,170,100,.55)', num: ['131', '137', '152'][i] }); });
    h14PT(260 - pan * 1.5 + u * 30, hv * .86, 1.15, u, { speed: .3, rim: 'rgba(255,180,110,.7)', flagT: 1 });
    h12Grade(hv, 'rgba(255,150,90,1)', 'rgba(40,20,50,1)', .4); h12Motes(hv, u, 40, '255,210,160'); }
function h14ShotLine(u, hv) { const hz = hv * .6; const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#02040c'); sk.addColorStop(1, '#1a2840'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 102); ctx.drawImage(h12Stars(hv), -100 - u * 3, -60);
    h12Moon(1240, 150, 30, 1.3); ctx.globalAlpha = .7; ctx.drawImage(h12CloudBank(43, '170,185,220', '16,22,38'), -500 + u * 12, hz - 380, 2700, 360); ctx.globalAlpha = 1;
    h12Sea(hz, hv + 40, u, { gx: 1240, ga: 1, far: '#2a3a52', mid: '#101a28', near: '#03060a', haze: .2 });
    for (let i = 0; i < 6; i++) h14BBus(-60 + i * 300 - u * 8, hz + 4 + i * 1.5, .5, { col: '#070a10', rim: 'rgba(200,215,245,.5)' });
    h14DDj(1500 - u * 12, hz + 30, .35, { col: '#070a10', flip: true }); // a US tin can in the screen
    ctx.fillStyle = '#05080c'; ctx.beginPath(); ctx.moveTo(-100, hv + 50); ctx.lineTo(-100, hv * .84); ctx.quadraticCurveTo(300, hv * .8, 700, hv * .88); ctx.lineTo(700, hv + 50); ctx.fill(); // the bridge wing of the flagship, foreground
    ctx.fillStyle = '#03050a'; ctx.fillRect(-100, hv * .78, 520, 8); for (let i = 0; i < 3; i++) { ctx.fillStyle = '#03050a'; const mx = 140 + i * 110, my = hv * .84; ctx.fillRect(mx - 9, my - 52, 18, 40); ctx.beginPath(); ctx.arc(mx, my - 60, 9, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(mx, my - 64, 13, 4, 0, 0, 7); ctx.fill(); if (i === 1) { ctx.fillRect(mx + 4, my - 62, 16, 7); } ctx.strokeStyle = 'rgba(200,215,245,.4)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(mx, my - 60, 9, -2.6, -.6); ctx.stroke(); } ctx.fillRect(470, hv * .66, 6, hv * .3); ctx.beginPath(); ctx.arc(473, hv * .66, 20, 0, 7); ctx.fill();
    h12Grade(hv, 'rgba(70,100,170,1)', 'rgba(5,10,25,1)', .45); }
function h14ShotRun(u, hv) { const hz = hv * .5, bob = Math.sin(u * 2.1) * 6, roll = Math.sin(u * 1.3) * .02; const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#01030a'); sk.addColorStop(1, '#16223a'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 102); ctx.drawImage(h12Stars(hv), -100 - u * 20, -60);
    h12Moon(300, 120, 24, 1.1); ctx.save(); ctx.translate(800, hv * .6); ctx.rotate(roll); ctx.translate(-800, -hv * .6 + bob);
    h12Sea(hz, hv + 120, u * 4, { gx: 300, ga: .9, far: '#24324a', mid: '#0e1624', near: '#02040a', haze: .2 });
    ctx.fillStyle = '#060a0e'; ctx.beginPath(); ctx.moveTo(-100, hz + 2); for (let x = -100; x <= 1800; x += 30) ctx.lineTo(x, hz - 16 - Math.sin(x * .005) * 14); ctx.lineTo(1800, hz + 2); ctx.fill();
    h14PT(1150 - u * 8, hz + 40, .32, u * 2, { speed: .7, num: '131' }); h14PT(1400 - u * 6, hz + 34, .26, u * 2 + 1, { speed: .7, num: '152' });
    h14PT(700 + Math.sin(u * .6) * 20, hv * .8, 2.5, u, { speed: 1, rim: 'rgba(200,215,245,.75)', flagT: 1 });
    ctx.restore(); h12Grade(hv, 'rgba(70,100,170,1)', 'rgba(0,5,20,1)', .45);
    const P = h12Puff('220,232,248', 19); for (let i = 0; i < 6; i++) { const k = (u * .7 + i / 6) % 1; ctx.globalAlpha = (1 - k) * .3; const r = 160 + k * 200; ctx.drawImage(P, 1400 + k * 300 - r, hv * .9 - k * 300 - r, r * 2, r * 2); } ctx.globalAlpha = 1; }
function h14ShotColumn(u, hv) { const hz = hv * .56; const bolt = (u % 3.7) < .1 || ((u % 3.7) > .17 && (u % 3.7) < .22); const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#02040a'); sk.addColorStop(1, bolt ? '#4a5a7a' : '#121a2a'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 102);
    ctx.globalAlpha = .9; ctx.drawImage(h12CloudBank(47, bolt ? '200,210,240' : '90,100,130', '10,14,24'), -400 - u * 6, hz - 520, 2700, 480); ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(160,170,190,.18)'; ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 160; i++) { const x = (ddpR(i) * 1800 + u * 60) % 1800 - 100, y = (ddpR(i * 3) * hz + u * 600) % hz; ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 20); } ctx.stroke(); // rain squall
    h12Sea(hz, hv + 40, u, { gx: 900, ga: .4, far: '#1a2434', mid: '#0a1018', near: '#020408', haze: .3 });
    const cx = u * 16; h14DDj(220 + cx, hz + 8, .42, { col: '#05070a' }); h14DDj(420 + cx, hz + 8, .42, { col: '#05070a' });
    h14Pagoda(760 + cx, hz + 10, .7, { col: '#04060a', rim: bolt ? 'rgba(220,230,255,.8)' : 'rgba(150,170,210,.35)', lit: true, beam: -.12 + Math.sin(u * .7) * .25 });
    h14Pagoda(1180 + cx, hz + 10, .66, { col: '#04060a', rim: bolt ? 'rgba(220,230,255,.8)' : 'rgba(150,170,210,.3)' });
    ctx.save(); ctx.translate(1540 + cx, hz + 10); ctx.scale(.55, .55); h14Hull(150, 24, 16, '#04060a'); ctx.fillStyle = '#04060a'; ctx.fillRect(-20, -70, 40, 50); ctx.beginPath(); ctx.moveTo(-60, -24); ctx.lineTo(-40, -90); ctx.lineTo(-10, -90); ctx.lineTo(-4, -24); ctx.fill(); [100, 66, 34, -90, -120].forEach(function (gx) { h14Gun(gx, -24, 20, 10, gx > 0 ? 1 : -1, 20, '#04060a', 0); }); ctx.restore(); // Mogami at the tail
    // the foreground: PT-137 lying stopped in the dark, very close, crew watching
    h14PT(500, hv * .9, 1.7, u, { speed: 0, rim: 'rgba(150,170,210,.4)' });
    h12Grade(hv, 'rgba(80,100,150,1)', 'rgba(0,5,15,1)', .45); }
function h14ShotStar(u, hv) { const hz = hv * .52, sh = u > 3.4 && u < 5 ? (5 - u) * 6 : 0; ctx.save(); ctx.translate((Math.random() - .5) * sh, (Math.random() - .5) * sh);
    const st = h12K(u, .8, 1.4), sy = 140 + u * 10, sx = 900 + u * 6, lit = st * Math.max(0, 1 - Math.max(0, u - 7) / 2);
    const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, ddpRGB(ddpMix([2, 4, 10], [40, 36, 30], lit * .5))); sk.addColorStop(1, ddpRGB(ddpMix([22, 30, 48], [120, 104, 80], lit * .5))); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 102);
    if (u > .4 && u < 1.2) h14ShellArc(1500, hz, sx, sy, (u - .4) / .8, 120);
    if (st > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(sx, sy, 900, '255,230,170', .3 * lit); h12Dot(sx, sy, 50, '255,255,240', lit); ctx.restore(); ctx.strokeStyle = 'rgba(30,30,30,.7)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(sx, sy - 30, 16, Math.PI, 0); ctx.moveTo(sx - 16, sy - 30); ctx.lineTo(sx, sy); ctx.lineTo(sx + 16, sy - 30); ctx.stroke();
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,240,200,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx - u * 4, sy - 120); ctx.stroke(); ctx.restore(); }
    h12Sea(hz, hv + 40, u, { gx: sx, gc: '255,230,170', ga: .4 + lit * 1.4, far: '#2a3448', mid: '#101826', near: '#03060a', haze: .2 });
    h14Pagoda(1350, hz + 6, .4, { col: '#06080c', beam: Math.PI - .18 + Math.sin(u * .5) * .06 + (u > 3 ? .1 : 0) });
    // the boat turns hard away, throwing a wall of spray; splashes march in
    const turn = h12E(h12K(u, 2.6, 4.2)); ctx.save(); ctx.translate(700, hv * .8); ctx.scale(1 - turn * .2, 1); h14PT(0, 0, 1.6, u * 1.5, { speed: 1, rim: 'rgba(255,230,170,' + (.3 + lit * .6) + ')', lit: lit > .4 }); ctx.restore();
    [[2.2, 1150, hz + 120, .6], [3.1, 380, hv * .76, 1], [3.6, 1050, hv * .84, 1.1], [5.2, 200, hv * .9, 1.3], [6.1, 1250, hv * .72, .8]].forEach(function (s) { h14Splash(s[1], s[2], u - s[0], s[3]); });
    cs2Once('m14spl1', u > 3.1, function () { try { playExplosionSound(.9); } catch (e) {} }); cs2Once('m14spl2', u > 5.2, function () { try { playExplosionSound(1.1); } catch (e) {} });
    ctx.restore(); h12Grade(hv, 'rgba(255,220,160,1)', 'rgba(5,10,25,1)', .35 + lit * .1); h12Motes(hv, u, 30, '255,230,180'); }
function h14IntroFrame(t, w, h) { const U = w / 1600, hv = h / U, c = M14CS.cuts; ctx.save(); ctx.scale(U, U); ctx.textAlign = 'left';
    if (t < c[0]) h14ShotTender(t, hv); else if (t < c[1]) h14ShotLine(t - c[0], hv); else if (t < c[2]) h14ShotRun(t - c[1], hv); else if (t < c[3]) h14ShotColumn(t - c[2], hv); else h14ShotStar(t - c[3], hv); ctx.restore(); ddpBloom(w, h); }
function drawM14Cutscene(now) {
    if (!campaignCutsceneRunning) return;
    const t = Math.max(0, (now - campaignCutsceneStart) / 1000), w = canvas.width, h = canvas.height; if (!CS2.grain) CS2.grain = cs2Grain();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    try { h14IntroFrame(t, w, h); } catch (e) { DDP.err = e; ctx.setTransform(1, 0, 0, 1, 0, 0); }
    let flash = 0; M14CS.cuts.forEach(function (c) { const d = t - c; if (d >= 0 && d < .18) flash = Math.max(flash, .2 * (1 - d / .18)); });
    cs2Once('m14eng', t > M14CS.cuts[1] + .2, function () { try { playTone(70, 90, 7, .05, 'sawtooth'); } catch (e) {} }); cs2Once('m14thunder', t > M14CS.cuts[2] + .1, function () { try { playExplosionSound(.5); playTone(45, 38, 2, .05, 'sawtooth'); } catch (e) {} }); cs2Once('m14star', t > M14CS.cuts[3] + .8, function () { try { playTone(1400, 300, .6, .04, 'sine'); } catch (e) {} });
    ctx.save(); ctx.globalAlpha = .09; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    const vg = ctx.createRadialGradient(w / 2, h * .5, w * .22, w / 2, h * .5, w * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.62)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    if (flash > 0) { ctx.fillStyle = 'rgba(230,240,255,' + flash + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = h12Letterbox(w, h, h12E(Math.min(1, t / 1.2)));
    const ta = Math.min(h12K(t, .6, 1.6), 1 - h12K(t, 5.8, 6.8)); if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; ctx.textAlign = 'center'; const cy = h * .3; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, cy - 70, w, 132); ctx.strokeStyle = 'rgba(214,169,28,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(w * .3, cy - 50); ctx.lineTo(w * .7, cy - 50); ctx.moveTo(w * .3, cy + 44); ctx.lineTo(w * .7, cy + 44); ctx.stroke();
        ctx.fillStyle = '#d9c88c'; ctx.font = '700 ' + Math.round(w * .0105) + 'px "Special Elite", monospace'; ctx.fillText('— THE PACIFIC WAR · THE PHILIPPINES · MISSION 02 —', w / 2, cy - 28); ctx.fillStyle = '#f6eed4'; ctx.shadowColor = 'rgba(255,150,80,.6)'; ctx.shadowBlur = 24; ctx.font = '700 ' + Math.round(w * .05) + 'px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('THE BATTLE OF LEYTE GULF', w / 2, cy + 24); ctx.shadowBlur = 0; ctx.fillStyle = '#d9c88c'; ctx.font = Math.round(w * .0105) + 'px "Special Elite", monospace'; ctx.fillText('24 OCTOBER 1944   ·   SURIGAO STRAIT   ·   MOTOR TORPEDO BOAT SQUADRONS 7, 10, 12 & 33', w / 2, cy + 62); ctx.restore(); }
    const caps = [[7, 'THE JAPANESE NAVY IS COMING TO WRECK THE LANDINGS AT LEYTE. ALL OF IT.'], [8.6, 'ACROSS THE TOP OF THE STRAIT, ADMIRAL OLDENDORF\'S BATTLE LINE WAITS IN THE DARK.'], [12, 'SIX OLD BATTLESHIPS. FIVE OF THEM WERE RAISED FROM THE MUD OF PEARL HARBOR.'], [16.4, 'BETWEEN THEM AND THE ENEMY: THIRTY-NINE PT BOATS. PLYWOOD, GASOLINE AND FOUR TORPEDOES EACH.'], [20.4, 'THEIR ORDERS: FIND THE ENEMY, REPORT HIM, THEN ATTACK.'], [24.4, 'ADMIRAL NISHIMURA\'S SOUTHERN FORCE: BATTLESHIPS YAMASHIRO AND FUSO, CRUISER MOGAMI, FOUR DESTROYERS.'], [28.6, 'THEY ARE STEAMING STRAIGHT UP THE STRAIT, AT NIGHT, THROUGH A RAIN SQUALL.'], [32.6, '23:00. A JAPANESE STAR SHELL. THEY\'VE SEEN THE FIRST BOATS.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; }); const sd = t - 37; if (ci >= 0 && sd < 0) h12Caption(w, h, bar, caps[ci][1], t - caps[ci][0], Math.round(w * .0104));
    cs2Once('m14stamp', sd > 0, function () { try { playExplosionSound(1.3); playTone(160, 50, .5, .12, 'square'); } catch (e) {} });
    if (sd > 0) { const k = h12K(sd, 0, .24), sc = 3.2 + (1 - 3.2) * h12E(k), fade = h12K(M14CS.dur - .2 - t, 0, .7); ctx.save(); ctx.translate(w / 2, h * .44); ctx.rotate(-.04); ctx.scale(sc, sc); ctx.globalAlpha = k * fade;
        ctx.fillStyle = 'rgba(4,8,14,.88)'; ctx.fillRect(-w, -96, w * 2, 192); [-96, 80].forEach(function (y) { ctx.save(); ctx.beginPath(); ctx.rect(-w, y, w * 2, 16); ctx.clip(); ctx.fillStyle = '#2a4a7a'; ctx.fillRect(-w, y, w * 2, 16); ctx.fillStyle = '#e8e4dc'; for (let x = -w - 40; x < w + 40; x += 40) { ctx.beginPath(); ctx.moveTo(x, y + 16); ctx.lineTo(x + 20, y); ctx.lineTo(x + 34, y); ctx.lineTo(x + 14, y + 16); ctx.fill(); } ctx.restore(); });
        ctx.textAlign = 'center'; ctx.fillStyle = '#b8c8e0'; ctx.font = '700 15px "Special Elite", monospace'; ctx.fillText('— THE PACIFIC WAR · PT-137 · MISSION 02 —', 0, -52); ctx.fillStyle = '#f6eed4'; ctx.strokeStyle = '#000'; ctx.lineWidth = 8; ctx.shadowColor = 'rgba(120,170,255,.55)'; ctx.shadowBlur = 30; ctx.font = '700 84px "Stardos Stencil", Impact, sans-serif'; ctx.strokeText('SURIGAO STRAIT', 0, 26); ctx.fillText('SURIGAO STRAIT', 0, 26); ctx.shadowBlur = 0; ctx.fillStyle = '#e8c968'; ctx.font = '700 18px "Special Elite", monospace'; ctx.fillText('FISH IN THE WATER.', 0, 60); ctx.restore(); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8); ctx.textAlign = 'left';
    const fa = Math.max(h12K(1 - t, 0, 1), h12K(t, M14CS.dur - 1, M14CS.dur)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + fa + ')'; ctx.fillRect(0, 0, w, h); }
    if (t < M14CS.dur) campaignCutsceneFrame = requestAnimationFrame(drawM14Cutscene); else finishCampaignCutscene();
}
/* ---------- ending ---------- */
const M14E = { dur: 22, cut: 10 };
function h14EndT(u, hv) { const hz = hv * .6; const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#02030a'); sk.addColorStop(1, '#1e2232'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 102); ctx.drawImage(h12Stars(hv), -100, -60);
    // salvos ripple down the US line on the left; shells arc across to the burning Yamashiro on the right
    const salvos = [0.8, 2.6, 4.2, 5.8, 7.2, 8.6]; let fl = 0, glow = 0; salvos.forEach(function (s0, si) { const d = u - s0; if (d > 0 && d < .5) fl = Math.max(fl, 1 - d / .5); if (d > 2) glow = Math.min(1, glow + .25); });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(1300, hz, 700, '255,130,50', .15 + glow * .3); h12Dot(250, hz, 600, '255,200,120', fl * .35); ctx.restore();
    h12Sea(hz, hv + 40, u, { gx: 1300, gc: '255,150,80', ga: .6 + glow, far: '#2a2a3a', mid: '#10121e', near: '#02040a', haze: .2 });
    for (let i = 0; i < 4; i++) { const f = salvos.map(function (s0) { const d = u - s0 - i * .12; return d > 0 && d < .35 ? 1 - d / .35 : 0; }).reduce(function (a, b) { return Math.max(a, b); }, 0); h14BBus(80 + i * 150, hz + 6 + i * 4, .38 + i * .02, { col: '#06080c', rim: 'rgba(255,200,130,' + (.2 + f * .6) + ')', flash: [f, f, f, f] }); }
    salvos.forEach(function (s0, si) { for (let j = 0; j < 4; j++) { const k = (u - s0 - j * .12) / 1.8; h14ShellArc(140 + j * 150, hz - 20, 1260 + (j - 1.5) * 40 + si * 6, hz - 20, k, 260 + j * 20); if (k >= 1 && k < 1.4) { h14Splash(1200 + j * 50 + si * 13, hz + 10, (k - 1) * 4, .35); } } });
    h14Pagoda(1300, hz + 8, .55, { col: '#05060a', rim: 'rgba(255,150,80,' + (.3 + glow * .5) + ')', flip: true }); if (glow > 0) { h12Fire(1290, hz - 40, .7 + glow * .5, u, 5); h12Fire(1240, hz - 20, .5 + glow * .4, u, 7); h12Column(1300, hz - 60, u, { h: 380, w: 90, lean: -.3, seed: 3, rgb: '40,30,30', lit: '255,140,60', a: .7 * glow, n: 18, speed: .05 }); }
    salvos.forEach(function (s0) { const d = u - s0 - 1.8; if (d > 0 && d < 1.6) h12Fireball(1300 + (s0 * 37 % 80) - 40, hz - 30, d, .35, 31 + s0 * 10 | 0); });
    h14PT(1450, hv * .88, 1.3, u, { speed: .2, rim: 'rgba(255,170,100,.55)' });
    h12Grade(hv, 'rgba(255,140,60,1)', 'rgba(5,10,25,1)', .4); return fl * .15; }
function h14EndDawn(u, hv) { const hz = hv * .56; const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#1a2234'); sk.addColorStop(.5, '#6a5a6a'); sk.addColorStop(.85, '#e0a06a'); sk.addColorStop(1, '#f8d8a0'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 102);
    const sunY = hz + 10 - h12E(h12K(u, 0, 10)) * 60; ctx.save(); ctx.globalCompositeOperation = 'lighter'; h12Dot(1250, sunY, 600, '255,190,120', .45); h12Dot(1250, sunY, 140, '255,236,190', .8); ctx.restore(); ctx.fillStyle = '#fff2d0'; ctx.beginPath(); ctx.arc(1250, sunY, 28, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#4a3a50'; ctx.beginPath(); ctx.moveTo(-100, hz); for (let x = -100; x <= 700; x += 30) ctx.lineTo(x, hz - 50 - Math.sin(x * .006) * 30); ctx.lineTo(700, hz); ctx.fill(); ctx.beginPath(); ctx.moveTo(1100, hz); for (let x = 1100; x <= 1800; x += 30) ctx.lineTo(x, hz - 30 - Math.sin(x * .008) * 20); ctx.lineTo(1800, hz); ctx.fill();
    h12Sea(hz, hv + 40, u, { gx: 1250, gc: '255,200,140', ga: 1.4, far: '#8a6a6a', mid: '#3a3040', near: '#0a0a14', haze: .3 });
    [[760, 1.1], [930, .8], [560, .6]].forEach(function (c, i) { h12Column(c[0], hz + 4, u + i * 7, { h: 520 * c[1], w: 90 * c[1], lean: .25, seed: 11 + i, rgb: '40,34,40', lit: '255,150,80', la: .5, a: .8, n: 22, speed: .03 }); h12Fire(c[0], hz + 6, .4 * c[1], u, 9 + i); });
    ctx.save(); ctx.translate(980, hz + 6); ctx.scale(.3, .3); h14Hull(150, 24, 16, '#1a1418'); ctx.fillStyle = '#1a1418'; ctx.fillRect(-20, -70, 40, 50); ctx.beginPath(); ctx.moveTo(-60, -24); ctx.lineTo(-40, -90); ctx.lineTo(-10, -90); ctx.lineTo(-4, -24); ctx.fill(); ctx.restore(); h12Fire(980, hz - 6, .25, u, 13); // Mogami, burning, limping south
    // PT-137 in the foreground, shot full of holes, idling home
    h14PT(560 + u * 10, hv * .86, 1.6, u, { speed: .25, rim: 'rgba(255,200,140,.7)', flagT: 1, lit: true });
    h12Grade(hv, 'rgba(255,180,120,1)', 'rgba(40,40,70,1)', .35); h12Motes(hv, u, 30, '255,220,180'); return 0; }
function m14PlayEnding(done) { const E = M14E; E.t0 = performance.now(); E.done = done; E.fired = {}; M12E.fired = {}; canvas.style.cursor = ''; if (!CS2.grain) CS2.grain = cs2Grain(); if (typeof CS2 !== 'undefined') CS2.fired = {};
    E.skip = function (e) { if (e.code === 'Space' || e.code === 'Escape') { e.preventDefault(); E.t0 -= 60000; } }; window.addEventListener('keydown', E.skip); cancelAnimationFrame(E.raf); E.raf = requestAnimationFrame(m14EndFrame); }
function m14EndFrame(now) {
    const E = M14E, t = Math.max(0, (now - E.t0) / 1000), w = canvas.width, h = canvas.height, U = w / 1600, hv = h / U;
    if (t >= E.dur) { window.removeEventListener('keydown', E.skip); if (E.done) E.done(); return; }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); ctx.scale(U, U); ctx.textAlign = 'left';
    let flash = 0; try { if (t < E.cut) flash = h14EndT(t, hv); else flash = h14EndDawn(t - E.cut, hv); } catch (e) { DDP.err = e; }
    [.8, 2.6, 4.2, 5.8, 7.2, 8.6].forEach(function (s0, i) { m12EOnce('s14' + i, t > s0 && t < E.cut, function () { try { playExplosionSound(1.2); playTone(60, 30, 1.2, .1, 'sawtooth'); } catch (e) {} }); });
    ctx.restore(); try { ddpBloom(w, h); } catch (e) {}
    ctx.save(); ctx.globalAlpha = .09; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    const vg = ctx.createRadialGradient(w / 2, h * .5, w * .22, w / 2, h * .5, w * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    { const d = t - E.cut; if (d >= 0 && d < .2) flash = Math.max(flash, .25 * (1 - d / .2)); } if (flash > 0) { ctx.fillStyle = 'rgba(255,240,215,' + Math.min(.95, flash) + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = h12Letterbox(w, h, 1);
    const caps = [[.4, '03:51. THE BATTLE LINE OPENS FIRE AT TWENTY THOUSAND YARDS.'], [3.6, 'NISHIMURA HAS STEAMED STRAIGHT INTO A CROSSED "T". EVERY AMERICAN GUN CAN REACH HIM.'], [6.8, 'THE LAST TIME IN HISTORY THAT BATTLESHIPS WILL FIGHT BATTLESHIPS.'], [10.4, 'DAWN. YAMASHIRO AND FUSO ARE GONE. MOGAMI LIMPS SOUTH, ON FIRE.'], [13.4, 'THE SOUTHERN FORCE NEVER REACHES LEYTE GULF. THE LANDINGS ARE SAFE.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; }); if (ci >= 0 && t < 16.4) h12Caption(w, h, bar, caps[ci][1], t - caps[ci][0], Math.round(w * .0106));
    if (t > 16.6) { const k = h12E(h12K(t, 16.6, 17.8)); ctx.save(); ctx.globalAlpha = k; ctx.textAlign = 'center'; const cy = h * .34; ctx.fillStyle = 'rgba(0,0,0,' + .45 * k + ')'; ctx.fillRect(0, cy - 90, w, 190); ctx.strokeStyle = 'rgba(214,169,28,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(w * .22, cy - 66); ctx.lineTo(w * .78, cy - 66); ctx.moveTo(w * .22, cy + 76); ctx.lineTo(w * .78, cy + 76); ctx.stroke();
        ctx.fillStyle = '#e8d8a0'; ctx.font = '700 ' + Math.round(w * .011) + 'px "Special Elite", monospace'; ctx.fillText('SURIGAO STRAIT — THE PACIFIC WAR, MISSION 02', w / 2, cy - 40); ctx.fillStyle = '#ffd24a'; ctx.shadowColor = 'rgba(255,150,40,.7)'; ctx.shadowBlur = 30; ctx.font = '700 ' + Math.round(w * .056) + 'px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('CROSSING THE T', w / 2, cy + 24); ctx.shadowBlur = 0;
        ctx.fillStyle = '#f0e6c8'; ctx.font = Math.round(w * .0125) + 'px "Special Elite", monospace'; ctx.fillText('MOGAMI TORPEDOED  ·  THE STRAIT HELD  ·  LEYTE GULF IS SAFE', w / 2, cy + 58); ctx.restore(); }
    const fa = Math.max(h12K(.8 - t, 0, .8), h12K(t, E.dur - 1.2, E.dur)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + fa + ')'; ctx.fillRect(0, 0, w, h); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8); ctx.textAlign = 'left';
    E.raf = requestAnimationFrame(m14EndFrame);
}
/* ---------- start + brief ---------- */
function startMission14(skipIntro) {
    returnToMenu(); campaignMission = 14; selectedGameMode = 'campaign'; selectedMap = 'campaignGustav'; M14.failWhy = ''; M14.result = null;
    document.getElementById('menu').style.display = 'none'; const cs = document.getElementById('campaignScreen'); if (cs) cs.style.display = 'none'; document.getElementById('gameArea').style.display = 'block';
    ['controls', 'battleMainMenuButton', 'gameInfo', 'pointScoreBar', 'battleMessage', 'killFeed', 'radioText', 'campaignObjectiveBox'].forEach(function (id) { const e = document.getElementById(id); if (e) e.style.display = 'none'; });
    M8.cut = true; applyPointControlCanvasSize(); canvas.style.transform = 'translate3d(0px,0px,0px)'; if (typeof minimapPanel !== 'undefined' && minimapPanel) minimapPanel.style.display = 'none';
    if (skipIntro) { m14ShowBrief(); return; }
    if (typeof CS2 !== 'undefined') CS2.fired = {};
    campaignCutsceneRunning = true; campaignCutsceneStart = performance.now(); if (campaignCutsceneFrame) cancelAnimationFrame(campaignCutsceneFrame); campaignCutsceneFrame = requestAnimationFrame(drawM14Cutscene);
}
function m14ShowBrief() {
    m2InjectStyle();
    let b = document.getElementById('m2Brief'); if (!b) { b = document.createElement('div'); b.id = 'm2Brief'; document.body.appendChild(b); }
    b.innerHTML = '<div class="bSheet"><div class="bTape"><span>MTB SQUADRON 7 · OPERATION KING II</span><span>PACIFIC 02</span></div><div class="bBody">' +
        '<h2>SURIGAO STRAIT</h2><p class="bText" id="m14Typed"></p>' +
        '<ul><li>You command <b>PT-137</b>. <b>W/S</b> throttle, <b>A/D</b> helm. Hold <b>SHIFT</b> to muffle the engines: slower, but far harder to see or hear.</li>' +
        '<li><b>SPACE</b> or <b>right-click</b> fires a <b>Mk 13 torpedo</b> straight ahead along the dashed line. You carry <b>eight</b>. Lead your target: a fish takes time to run.</li>' +
        '<li>Hold <b>left-click</b> for the twin <b>.50s</b>. They sink barges, silence the shore battery and can <b>shoot out searchlights</b>, but the tracers give you away.</li>' +
        '<li>Searchlights, <b>star shells</b> and burning ships light you up. When the red rings appear, a salvo is on the way: turn hard. <b>E</b> lays a <b>smoke screen</b> they can\'t see through.</li>' +
        '<li>Hit <b>MOGAMI</b> twice and sink <b>two destroyers</b>, then run <b>north</b> to the U.S. battle line. If they get past you first, or the boat goes down, the mission fails. A fish in a battleship earns a star.</li></ul>' +
        '<div class="bNote">The column is coming up the middle of the strait from the south. Armed barges patrol the shallows, and a Japanese battery with a searchlight sits on the Panaon shore.</div>' +
        '<button class="bGo" id="m14Go">CAST OFF ▶</button></div></div>';
    b.hidden = false; b.style.display = '';
    const txt = 'October 1944. MacArthur has returned: the Leyte landings are ashore. The Japanese have sent their whole fleet to destroy them. Tonight the Southern Force tries the back door, the Surigao Strait. The PT boats strike first.';
    const el = document.getElementById('m14Typed'); let i = 0; const iv = setInterval(function () { i += 2; el.textContent = txt.slice(0, i); if (i >= txt.length) clearInterval(iv); }, 20);
    document.getElementById('m14Go').onclick = function () { clearInterval(iv); b.hidden = true; try { playTone(520, 760, .1, .05, 'triangle'); } catch (e) {} m14Begin(); };
}
