/* =====================================================
   MISSION 12 CUTSCENES — Operation Hydra: the map room, Peenemünde from the air, the rocket on its stand,
   the run in from the sea, the pines; ending: the test stand going up under 600 bombers
===================================================== */
const M12CS = { dur: 45, cuts: [8, 15.5, 23.5, 31] };
function dqV2(x, by, s, t, o) { // the A4 rocket standing on its table; by = base of the fins
    o = o || {}; ctx.save(); ctx.translate(x, by); ctx.scale(s, s); const H = 470, R = 30;
    // fins
    ctx.fillStyle = '#1a1a1a'; [[-1, 1], [1, 1]].forEach(function (q) { ctx.beginPath(); ctx.moveTo(q[0] * R * .9, -110); ctx.lineTo(q[0] * (R + 46), -12); ctx.lineTo(q[0] * (R + 46), 0); ctx.lineTo(q[0] * R * .7, 0); ctx.closePath(); ctx.fill(); }); ctx.fillStyle = '#e8e8e0'; ctx.fillRect(-6, -110, 12, 110);
    // body with the black-and-white roll pattern, moonlit from the right
    const body = function () { ctx.beginPath(); ctx.moveTo(-R * .72, 0); ctx.lineTo(-R, -150); ctx.lineTo(-R, -H + 150); ctx.quadraticCurveTo(-R * .9, -H + 40, 0, -H); ctx.quadraticCurveTo(R * .9, -H + 40, R, -H + 150); ctx.lineTo(R, -150); ctx.lineTo(R * .72, 0); ctx.closePath(); };
    body(); const bg = ctx.createLinearGradient(-R, 0, R, 0); bg.addColorStop(0, '#8a8a84'); bg.addColorStop(.55, '#f4f4ec'); bg.addColorStop(1, '#b8b8b0'); ctx.fillStyle = bg; ctx.fill();
    ctx.save(); body(); ctx.clip(); ctx.fillStyle = '#121212'; for (let i = 0; i < 5; i++) { const y0 = -150 - i * 60; ctx.fillRect(i % 2 ? 0 : -R, y0 - 60, R, 60); } ctx.fillRect(-R, -H + 120, R * 2, 6); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-R, -H, R * .5, H); ctx.fillStyle = 'rgba(255,255,255,.08)'; for (let i = 0; i < 40; i++) ctx.fillRect(-R + ddpR(i) * R * 2, -ddpR(i * 3) * H, 2, 1); ctx.restore();
    ctx.strokeStyle = 'rgba(220,235,255,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(R, -150); ctx.lineTo(R, -H + 150); ctx.quadraticCurveTo(R * .9, -H + 40, 0, -H); ctx.stroke();
    // frost where the LOX tank is
    ctx.fillStyle = 'rgba(230,240,255,.35)'; ctx.fillRect(-R + 2, -300, R * 2 - 4, 90);
    // the launch table
    ctx.fillStyle = '#3a3a36'; ctx.fillRect(-90, 0, 180, 18); ctx.fillStyle = '#2a2a26'; [-70, 50].forEach(function (lx) { ctx.fillRect(lx, 18, 20, 40); }); ctx.fillStyle = 'rgba(220,230,255,.35)'; ctx.fillRect(-90, 0, 180, 2);
    ctx.restore();
}
function dqGantry(x, by, s, t) { ctx.save(); ctx.translate(x, by); ctx.scale(s, s); ctx.strokeStyle = '#262624'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -520); ctx.moveTo(70, 0); ctx.lineTo(70, -520); ctx.stroke(); ctx.lineWidth = 3; for (let y = 0; y > -520; y -= 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(70, y - 40); ctx.moveTo(70, y); ctx.lineTo(0, y - 40); ctx.moveTo(0, y); ctx.lineTo(70, y); ctx.stroke(); } ctx.fillStyle = '#262624'; for (const y of [-160, -320, -440]) { ctx.fillRect(-90, y, 90, 8); ctx.fillStyle = 'rgba(255,220,150,.9)'; ctx.fillRect(-70, y - 6, 6, 6); ctx.fillStyle = '#262624'; } ctx.restore(); }
function dqVapour(x, y, w, t, a) { const P = ddpEnsure(); for (let i = 0; i < 18; i++) { const k = ((t * .18) + i / 18) % 1, ox = (ddpR(i) - .5) * w * (.4 + k), r = 50 + k * 140; ctx.globalAlpha = (1 - k) * (a || .5); ctx.drawImage(P.white, x + ox - r, y - r * .5 + k * 30, r * 2, r); } ctx.globalAlpha = 1; }
function ddpM12ShotA(u, hv) { // London: the map room, Doyle's sketch, a pin on Peenemünde
    const g = ctx.createRadialGradient(760, hv * .5, 40, 760, hv * .5, 1000); g.addColorStop(0, '#3a3424'); g.addColorStop(.6, '#16140e'); g.addColorStop(1, '#050403'); ctx.fillStyle = g; ctx.fillRect(-100, -100, 1800, hv + 200);
    const z = 1 + u * .02; ctx.save(); ctx.translate(800, hv * .5); ctx.scale(z, z); ctx.rotate(-.04); ctx.translate(-800, -hv * .5);
    // the map of the Baltic coast
    ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(250, 90, 1060, 640); const mg = ctx.createLinearGradient(240, 80, 1300, 720); mg.addColorStop(0, '#c8c0a0'); mg.addColorStop(1, '#a89e78'); ctx.fillStyle = mg; ctx.fillRect(240, 80, 1060, 640);
    ctx.fillStyle = '#8aa0b0'; ctx.beginPath(); ctx.moveTo(240, 80); ctx.lineTo(1300, 80); ctx.lineTo(1300, 300); for (let x = 1300; x >= 240; x -= 30) ctx.lineTo(x, 300 + Math.sin(x * .012) * 40 + Math.sin(x * .05) * 10); ctx.fill();
    ctx.fillStyle = '#b8b090'; ctx.beginPath(); ctx.moveTo(700, 330); ctx.quadraticCurveTo(820, 260, 960, 290); ctx.quadraticCurveTo(1060, 340, 1020, 420); ctx.quadraticCurveTo(880, 470, 760, 430); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(60,40,20,.6)'; ctx.lineWidth = 2; ctx.stroke(); // Usedom
    ctx.strokeStyle = 'rgba(60,40,20,.25)'; ctx.lineWidth = 1; for (let x = 240; x < 1300; x += 80) { ctx.beginPath(); ctx.moveTo(x, 80); ctx.lineTo(x, 720); ctx.stroke(); } for (let y = 80; y < 720; y += 80) { ctx.beginPath(); ctx.moveTo(240, y); ctx.lineTo(1300, y); ctx.stroke(); }
    ctx.fillStyle = 'rgba(40,30,20,.75)'; ctx.font = 'italic 16px "Special Elite", serif'; ctx.fillText('OSTSEE', 520, 180); ctx.fillText('USEDOM', 820, 380); ctx.font = '12px "Special Elite", serif'; ctx.fillText('Peenemünde', 760, 318);
    // a red pin going in
    const pk = Math.min(1, Math.max(0, (u - 3) / .8)); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.arc(752 + 6, 322 + 4, 6, 0, 7); ctx.fill(); ctx.strokeStyle = '#aaa'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(752, 322 - (1 - pk) * 40); ctx.lineTo(752, 322 - (1 - pk) * 40 - 24); ctx.stroke(); ctx.fillStyle = '#c02020'; ctx.beginPath(); ctx.arc(752, 322 - (1 - pk) * 40 - 24, 8, 0, 7); ctx.fill();
    if (u > 2.2 && u < 3.9) { const hk = Math.min(1, (u - 2.2) / .8); ctx.fillStyle = '#c09070'; ctx.beginPath(); ctx.ellipse(780 + (1 - hk) * 200, 300 - 40, 50, 26, -.5, 0, 7); ctx.fill(); ctx.fillStyle = '#4a4a5a'; ctx.fillRect(820 + (1 - hk) * 200, 270, 200, 50); }
    // Doyle's sketch of the rocket + a recce photo
    ctx.save(); ctx.translate(1060, 470); ctx.rotate(.08); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(6, 8, 200, 250); ctx.fillStyle = '#e8e4d8'; ctx.fillRect(0, 0, 200, 250); ctx.strokeStyle = '#2a2a40'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(100, 20); ctx.quadraticCurveTo(116, 50, 116, 80); ctx.lineTo(116, 190); ctx.lineTo(140, 225); ctx.lineTo(60, 225); ctx.lineTo(84, 190); ctx.lineTo(84, 80); ctx.quadraticCurveTo(84, 50, 100, 20); ctx.stroke(); ctx.font = '11px "Special Elite", monospace'; ctx.fillStyle = '#2a2a40'; ctx.fillText('approx 45 ft', 124, 120); ctx.fillText('— H.D.', 140, 244); ctx.restore();
    ctx.save(); ctx.translate(330, 470); ctx.rotate(-.1); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(6, 8, 230, 170); ctx.fillStyle = '#d8d8d0'; ctx.fillRect(0, 0, 230, 170); ctx.fillStyle = '#3a3a34'; ctx.fillRect(10, 10, 210, 150); ctx.strokeStyle = '#8a8a80'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(115, 85, 60, 40, 0, .4, Math.PI * 2 - .2); ctx.stroke(); ctx.fillStyle = '#e0e0d8'; ctx.beginPath(); ctx.arc(115, 82, 3, 0, 7); ctx.fill(); ctx.fillStyle = '#d0d0c8'; ctx.font = '9px monospace'; ctx.fillText('RAF PRU · 23.6.44 · TEST STAND VII', 14, 152); ctx.restore();
    ctx.restore();
    // the lamp: a pool of warm light, smoke curling through it
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(800, hv * .45, 20, 800, hv * .5, 700); lg.addColorStop(0, 'rgba(255,220,150,.28)'); lg.addColorStop(1, 'rgba(255,220,150,0)'); ctx.fillStyle = lg; ctx.fillRect(-100, -100, 1800, hv + 200); ctx.restore();
    ddpSmoke(170, hv * .26, .8, u, 3, 30, 220, .25);
}
function ddpM12ShotB(u, hv) { // Peenemünde from the air at night
    const hz = hv * .28; dqSky(hz, u + 10, u * 10, { moonX: 1300, moonY: hz - 160 });
    const sg = ctx.createLinearGradient(0, hz, 0, hv); sg.addColorStop(0, '#1a2436'); sg.addColorStop(1, '#070b12'); ctx.fillStyle = sg; ctx.fillRect(-100, hz, 1800, hv);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 120; i++) { const k = Math.pow(ddpR(i), 1.4), y = hz + 4 + k * (hv - hz) * .4; ctx.fillStyle = 'rgba(200,215,250,' + (.25 - k * .2) + ')'; ctx.fillRect(1300 + (ddpR(i * 5) - .5) * (30 + k * 300), y, 10 + k * 40, 1.5); } ctx.restore();
    // the island in perspective: woods, the coast, roads, the site
    const ly = hz + 120, z = 1 + u * .03; ctx.save(); ctx.translate(800, ly + 200); ctx.scale(z, z); ctx.translate(-800, -(ly + 200));
    ctx.fillStyle = '#121a12'; ctx.beginPath(); ctx.moveTo(-200, hv + 60); ctx.lineTo(-200, ly + 60); for (let x = -200; x <= 1800; x += 40) ctx.lineTo(x, ly + 40 - Math.sin(x * .004 + 1) * 40 - Math.sin(x * .013) * 10); ctx.lineTo(1800, hv + 60); ctx.fill();
    ctx.fillStyle = '#6a6448'; ctx.beginPath(); ctx.moveTo(-200, ly + 60); for (let x = -200; x <= 1800; x += 40) ctx.lineTo(x, ly + 40 - Math.sin(x * .004 + 1) * 40 - Math.sin(x * .013) * 10); for (let x = 1800; x >= -200; x -= 40) ctx.lineTo(x, ly + 54 - Math.sin(x * .004 + 1) * 40 - Math.sin(x * .013) * 10); ctx.fill();
    for (let i = 0; i < 700; i++) { const x = ddpR(i * 3) * 2000 - 200, y = ly + 70 + Math.pow(ddpR(i * 7), .8) * (hv - ly), r = 3 + (y - ly) * .02; ctx.fillStyle = 'rgba(' + (12 + ddpR(i) * 12 | 0) + ',' + (24 + ddpR(i) * 16 | 0) + ',' + (14 + ddpR(i) * 10 | 0) + ',.9)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
    // the clearing and the test stand ellipse, floodlit
    const cx = 760, cy = ly + 260; ctx.fillStyle = '#3a382c'; ctx.beginPath(); ctx.ellipse(cx, cy, 420, 120, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#3a4a24'; ctx.lineWidth = 26; ctx.beginPath(); ctx.ellipse(cx, cy, 150, 50, 0, -1.2, 4.1); ctx.stroke(); ctx.fillStyle = '#6a6a5e'; ctx.beginPath(); ctx.ellipse(cx, cy, 130, 40, 0, 0, 7); ctx.fill();
    [[cx - 320, cy - 30, 80, 24], [cx - 300, cy + 40, 110, 30], [cx + 220, cy + 30, 50, 22], [cx + 300, cy - 40, 90, 30]].forEach(function (b) { ctx.fillStyle = '#2a2a28'; ctx.fillRect(b[0], b[1] - b[3], b[2], b[3]); ctx.fillStyle = '#4a4a44'; ctx.fillRect(b[0], b[1] - b[3] - 6, b[2], 6); for (let i = 0; i < 3; i++) { ctx.fillStyle = 'rgba(255,200,120,.8)'; ctx.fillRect(b[0] + 8 + i * b[2] / 3, b[1] - b[3] + 6, 4, 3); } });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fl = ctx.createRadialGradient(cx, cy - 20, 10, cx, cy, 260); fl.addColorStop(0, 'rgba(220,230,255,.5)'); fl.addColorStop(1, 'rgba(220,230,255,0)'); ctx.fillStyle = fl; ctx.beginPath(); ctx.ellipse(cx, cy - 20, 260, 140, 0, 0, 7); ctx.fill(); ctx.restore();
    dqV2(cx, cy, .16, u); dqVapour(cx, cy - 4, 60, u, .35);
    ctx.restore();
    dqBeam(400, ly + 180, -Math.PI / 2 - .3 + Math.sin(u * .5) * .4, 700, .03, .16, u); dqBeam(1100, ly + 220, -Math.PI / 2 + .4 + Math.sin(u * .4 + 2) * .3, 700, .03, .14, u);
    ctx.globalAlpha = .3; for (let i = 0; i < 8; i++) ctx.drawImage(dqEnsure().mist, -100 + i * 230, ly + 20, 420, 90); ctx.globalAlpha = 1;
}
function ddpM12ShotC(u, hv) { // the A4 on its table, floodlit, venting, the clock running
    const hz = hv * .78; const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#04060c'); sk.addColorStop(1, '#141c2c'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 104);
    for (let i = 0; i < 120; i++) { ctx.fillStyle = 'rgba(220,230,255,' + (.2 + ddpR(i) * .5) + ')'; ctx.fillRect(ddpR(i * 3) * 1600, ddpR(i * 7) * hz * .8, 1.4, 1.4); }
    // the earth wall behind
    ctx.fillStyle = '#121a10'; ctx.beginPath(); ctx.moveTo(-100, hz); ctx.quadraticCurveTo(800, hz - 230, 1700, hz); ctx.fill(); ctx.strokeStyle = 'rgba(160,190,140,.2)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-100, hz); ctx.quadraticCurveTo(800, hz - 230, 1700, hz); ctx.stroke();
    const gg = ctx.createLinearGradient(0, hz, 0, hv); gg.addColorStop(0, '#3a3a34'); gg.addColorStop(1, '#141412'); ctx.fillStyle = gg; ctx.fillRect(-100, hz, 1800, hv);
    // floodlights: beams converging on the rocket
    [[80, 40], [1520, 60], [240, hz - 40], [1380, hz - 30]].forEach(function (L) { const a = Math.atan2(hz - 260 - L[1], 800 - L[0]); dqBeam(L[0], L[1], a, 900, .07, .14, u); });
    const cam = 1 + u * .03, tilt = u * 6; ctx.save(); ctx.translate(800, hz); ctx.scale(cam, cam); ctx.translate(-800, -hz - tilt);
    dqGantry(920, hz, 1.1, u);
    dqV2(800, hz, 1.25, u);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const rg = ctx.createRadialGradient(830, hz - 300, 10, 820, hz - 300, 400); rg.addColorStop(0, 'rgba(230,240,255,.18)'); rg.addColorStop(1, 'rgba(230,240,255,0)'); ctx.fillStyle = rg; ctx.fillRect(400, hz - 700, 800, 800); ctx.restore();
    ctx.restore();
    // vapour rolling off the base, technicians in hoods, the X-time board
    dqVapour(800, hz + 10, 500, u, .55); dqVapour(800, hz - 260, 60, u + 3, .3);
    [[560, 1], [1040, -1], [1180, -1]].forEach(function (m, i) { ddpMan(m[0], hz + 40 + i * 6, .9, u, { ger: true, run: 0, dir: m[1], haze: .2 }); });
    ctx.textAlign = 'left'; ctx.fillStyle = '#121212'; ctx.fillRect(1220, hz - 150, 260, 110); ctx.strokeStyle = '#4a4a44'; ctx.lineWidth = 3; ctx.strokeRect(1220, hz - 150, 260, 110); ctx.fillStyle = '#c8b860'; ctx.font = '700 14px "Stardos Stencil", Impact'; ctx.fillText('X-ZEIT', 1236, hz - 128); const rem = Math.max(0, 600 - Math.floor(u * 7)); ctx.fillStyle = '#ff5030'; ctx.font = '700 48px "Stardos Stencil", Impact, monospace'; ctx.fillText('-' + Math.floor(rem / 60) + ':' + String(rem % 60).padStart(2, '0'), 1236, hz - 66);
}
function ddpM12ShotD(u, hv) { // the run in from the sea
    const hz = hv * .42; dqSky(hz, u + 20, u * 20, { moonX: 260, moonY: hz - 240 });
    ctx.fillStyle = '#0c1018'; ctx.beginPath(); ctx.moveTo(-100, hz + 2); for (let x = -100; x <= 1700; x += 20) ctx.lineTo(x, hz - 18 - Math.sin(x * .006) * 10 - ddpR(Math.floor(x / 20)) * 12); ctx.lineTo(1700, hz + 2); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createRadialGradient(1100, hz - 10, 4, 1100, hz, 200); gl.addColorStop(0, 'rgba(220,230,255,.5)'); gl.addColorStop(1, 'rgba(220,230,255,0)'); ctx.fillStyle = gl; ctx.fillRect(900, hz - 200, 400, 260); ctx.restore();
    dqBeam(980, hz - 20, -Math.PI / 2 - .9 + Math.sin(u * .4) * .5, 1000, .03, .2, u);
    dqSea(hz, hv + 40, u, u * 80, { moonX: 260 });
    // the landing craft, low and grey, men crouched behind the ramp
    const bx = 720 + Math.sin(u * .5) * 10, by = hv * .74 + Math.sin(u * 1.4) * 6; ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.translate(bx, by); ctx.rotate(Math.sin(u * 1.1) * .03);
    // wake + bow spray behind the hull
    ctx.fillStyle = 'rgba(200,215,240,.18)'; ctx.beginPath(); ctx.moveTo(-300, 20); ctx.quadraticCurveTo(-620, 40, -900, 90); ctx.lineTo(-900, 60); ctx.quadraticCurveTo(-600, 20, -300, 0); ctx.fill();
    // hull: armoured LCA, dark steel, moonlit top edge
    const hg = ctx.createLinearGradient(0, -70, 0, 34); hg.addColorStop(0, '#3c4652'); hg.addColorStop(.35, '#20262e'); hg.addColorStop(1, '#0a0d10'); ctx.fillStyle = hg;
    ctx.beginPath(); ctx.moveTo(-310, -52); ctx.lineTo(250, -62); ctx.lineTo(312, -30); ctx.lineTo(300, 30); ctx.lineTo(-296, 30); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#05070a'; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = 'rgba(210,225,250,.7)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-310, -52); ctx.lineTo(250, -62); ctx.lineTo(312, -30); ctx.stroke();
    // armour plate seams + rivets
    ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 1.5; for (let x = -240; x < 260; x += 90) { ctx.beginPath(); ctx.moveTo(x, -55 - (x + 310) * .018); ctx.lineTo(x + 4, 28); ctx.stroke(); }
    ctx.fillStyle = 'rgba(180,195,220,.35)'; for (let x = -290; x < 290; x += 22) { ctx.beginPath(); ctx.arc(x, -40 - (x + 310) * .016, 1.6, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#e8e2c8'; ctx.font = '700 22px "Stardos Stencil", Impact'; ctx.fillText('LCA 873', -200, -6);
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-296, 14, 596, 16);
    // the ramp at the bow + coxswain's armoured cab at the stern
    ctx.fillStyle = '#2a323c'; ctx.beginPath(); ctx.moveTo(250, -62); ctx.lineTo(300, -96); ctx.lineTo(330, -40); ctx.lineTo(312, -30); ctx.fill(); ctx.strokeStyle = 'rgba(210,225,250,.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(250, -62); ctx.lineTo(300, -96); ctx.stroke();
    ctx.fillStyle = '#262e38'; ctx.fillRect(-300, -96, 64, 46); ctx.strokeStyle = '#05070a'; ctx.lineWidth = 2; ctx.strokeRect(-300, -96, 64, 46); ctx.fillStyle = '#05070a'; ctx.fillRect(-292, -86, 48, 6); ctx.strokeStyle = 'rgba(210,225,250,.5)'; ctx.beginPath(); ctx.moveTo(-300, -96); ctx.lineTo(-236, -96); ctx.stroke();
    // the section: helmets and shoulders above the gunwale, rifles, a Bren, faces blacked
    for (let i = 0; i < 9; i++) { const mx = -200 + i * 50, my = -60 - (mx + 310) * .018, bob = Math.sin(u * 2 + i) * 2;
        ctx.fillStyle = '#2e3420'; ctx.beginPath(); ctx.ellipse(mx, my + 4 + bob, 18, 12, 0, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#14100c'; ctx.beginPath(); ctx.arc(mx + 2, my - 10 + bob, 8, 0, 7); ctx.fill();
        ctx.fillStyle = i % 2 ? '#3a4226' : '#2c3220'; ctx.beginPath(); ctx.arc(mx, my - 14 + bob, 13, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.ellipse(mx, my - 14 + bob, 17, 5, 0, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(210,225,250,.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(mx, my - 15 + bob, 13, -2.7, -.5); ctx.stroke();
        if (i % 3 === 1) { ctx.strokeStyle = '#0a0a08'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mx + 8, my - 4 + bob); ctx.lineTo(mx + 22, my - 52 + bob); ctx.stroke(); }
        if (i === 7) { ctx.strokeStyle = '#0a0a08'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(mx - 8, my - 6); ctx.lineTo(mx + 46, my - 14); ctx.stroke(); ctx.fillRect(mx + 10, my - 24, 6, 12); } }
    // coxswain's head in the cab
    ctx.fillStyle = '#1c2016'; ctx.beginPath(); ctx.arc(-268, -104, 10, Math.PI, 0); ctx.fill();
    const P = ddpEnsure(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 14; i++) { const k = (u * 1.4 + i / 14) % 1; ctx.globalAlpha = (1 - k) * .35; const r = 30 + k * 60; ctx.drawImage(P.white, 300 - k * 80 - r, -10 - Math.sin(k * 3) * 40 - r * .5, r * 2, r); } ctx.restore();
    ddpM10Swell(hv, u, hv * .93, .9);
}
function ddpM12ShotE(u, hv) { // ashore: through the pines, the stand glowing beyond the wire
    const hz = hv * .6; const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#04060e'); sk.addColorStop(1, '#1c2234'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 104);
    for (let i = 0; i < 100; i++) { ctx.fillStyle = 'rgba(220,230,255,' + (.2 + ddpR(i) * .5) + ')'; ctx.fillRect(ddpR(i * 3) * 1600, ddpR(i * 7) * hz * .7, 1.3, 1.3); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createRadialGradient(900, hz - 40, 10, 900, hz, 520); gl.addColorStop(0, 'rgba(220,230,255,.55)'); gl.addColorStop(1, 'rgba(220,230,255,0)'); ctx.fillStyle = gl; ctx.fillRect(300, hz - 500, 1200, 600); ctx.restore();
    [[600, 50], [1200, 60], [900, 30]].forEach(function (L, i) { dqBeam(L[0], hz - 20, -Math.PI / 2 + (i - 1) * .4 + Math.sin(u * .3 + i) * .3, 900, .025, .14, u + i); });
    ctx.fillStyle = '#0e140c'; ctx.beginPath(); ctx.moveTo(-100, hz); ctx.quadraticCurveTo(900, hz - 70, 1700, hz); ctx.lineTo(1700, hv); ctx.lineTo(-100, hv); ctx.fill();
    dqV2(900, hz - 30, .3, u); dqGantry(930, hz - 30, .26, u); dqVapour(900, hz - 30, 60, u, .3);
    dqWireFence(u, [-100, hz + 70], [1700, hz + 40], 0, { h: 70 });
    // pine trunks in the foreground, the section crouched among them
    for (let i = 0; i < 9; i++) { const x = -60 + i * 210 + (i % 2) * 50, w = 26 + ddpR(i) * 26; const tg = ctx.createLinearGradient(x, 0, x + w, 0); tg.addColorStop(0, '#0a0806'); tg.addColorStop(.7, '#1e1610'); tg.addColorStop(1, '#3a2a1e'); ctx.fillStyle = tg; ctx.fillRect(x, -100, w, hv + 200); ctx.strokeStyle = 'rgba(200,215,240,.15)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + w, -100); ctx.lineTo(x + w, hv); ctx.stroke(); for (let k = 0; k < 6; k++) { ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x + 2, ddpR(i * 9 + k) * hv, w - 4, 4); } }
    ctx.fillStyle = '#060805'; ctx.beginPath(); ctx.moveTo(-100, -100); for (let x = -100; x <= 1700; x += 30) ctx.lineTo(x, -40 + Math.sin(x * .02) * 30 + ddpR(Math.floor(x / 30)) * 40); ctx.lineTo(1700, -100); ctx.fill();
    [[300, 1.2], [520, 1.05], [1150, 1.1], [1350, 1.25]].forEach(function (m, i) { ddpMan(m[0], hv * .97, m[1], u, { run: 0, dir: i < 2 ? 1 : -1, crouch: 1, haze: 0 }); });
}
function ddpM12Frame(t, w, h) { const U = w / 1600, hv = h / U, c = M12CS.cuts; DDP.ok = true; ctx.save(); ctx.textAlign = 'left'; ctx.scale(U, U); if (t < c[0]) ddpM12ShotA(t, hv); else if (t < c[1]) ddpM12ShotB(t - c[0], hv); else if (t < c[2]) ddpM12ShotC(t - c[1], hv); else if (t < c[3]) ddpM12ShotD(t - c[2], hv); else ddpM12ShotE(t - c[3], hv); ctx.restore(); ddpBloom(w, h); }
function drawM12Cutscene(now) {
    if (!campaignCutsceneRunning) return;
    const t = (now - campaignCutsceneStart) / 1000, w = canvas.width, h = canvas.height;
    if (!CS2.grain) CS2.grain = cs2Grain();
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    try { ddpM12Frame(t, w, h); } catch (e) { DDP.err = e; ctx.setTransform(1, 0, 0, 1, 0, 0); }
    let flash = 0; M12CS.cuts.forEach(function (c) { const d = t - c; if (d >= 0 && d < .16) flash = Math.max(flash, .25 * (1 - d / .16)); });
    cs2Once('m12pin', t > 3.6, function () { try { playTone(300, 200, .08, .05, 'triangle'); } catch (e) {} });
    cs2Once('m12hiss', t > M12CS.cuts[1] + .2, function () { try { playTone(2400, 1800, 1.8, .015, 'sawtooth'); } catch (e) {} });
    if (t > M12CS.cuts[2] && t < M12CS.cuts[3] && Math.floor(t * 1.5) !== M12CS.wv) { M12CS.wv = Math.floor(t * 1.5); try { playTone(90, 60, .6, .02, 'sine'); } catch (e) {} }
    ctx.save(); ctx.globalAlpha = .08; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    const vg = ctx.createRadialGradient(w / 2, h * .52, w * .24, w / 2, h * .52, w * .74); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    if (flash > 0) { ctx.fillStyle = 'rgba(220,235,255,' + flash + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = Math.round(h * .062 * cs2E(Math.min(1, t / .9))); ctx.fillStyle = '#050605'; ctx.fillRect(0, 0, w, bar); ctx.fillRect(0, h - bar - 26, w, bar + 26);
    const ta = cs2C(Math.min((t - .6) / .8, (6.4 - t) / .8), 0, 1);
    if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, h * .1, w, 112); ctx.fillStyle = '#d9c88c'; ctx.font = '700 15px "Special Elite", "Courier New", monospace'; ctx.fillText('— OPERATION OVERLORD · ACT III —', w / 2, h * .1 + 28); ctx.fillStyle = '#f4ecd0'; ctx.font = '700 48px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('OPERATION HYDRA', w / 2, h * .1 + 76); ctx.font = '15px "Special Elite", "Courier New", monospace'; ctx.fillStyle = '#d9c88c'; ctx.fillText('17 JULY 1944   ·   D+41   ·   23:30   ·   PEENEMÜNDE, USEDOM', w / 2, h * .1 + 102); ctx.restore(); }
    const caps = [[1.0, 'LONDON. CAPT. DOYLE\'S REPORT HAS REACHED THE WAR CABINET.'], [4.4, 'A ROCKET FORTY-SIX FEET TALL. A TON OF EXPLOSIVE. NO DEFENCE AGAINST IT.'], [8.6, 'PEENEMÜNDE, ON THE BALTIC. THE GERMANS CALL IT THE A4.'], [11.8, 'HITLER CALLS IT VENGEANCE WEAPON TWO.'], [16.0, 'TONIGHT THEY ARE FUELLING ONE FOR A LIVE LAUNCH. TARGET: LONDON.'], [19.6, 'X-ZEIT IS TWELVE MINUTES AFTER WE LAND.'], [23.8, 'No. 62 COMMANDO GOES IN FROM THE SEA.'], [27.0, 'FOUR CHARGES: OXYGEN PLANT, ASSEMBLY HALL, LAUNCH BUNKER, GUIDANCE LAB.'], [31.4, 'AND TONIGHT SIX HUNDRED BOMBERS ARE COMING TOO.'], [34.8, 'BE ON THE BOAT BEFORE THEY ARRIVE.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; }); const sd = t - 38.6;
    if (ci >= 0 && sd < 0) { const c = caps[ci], n = Math.min(c[1].length, Math.floor((t - c[0]) * 34)); ctx.textAlign = 'center'; ctx.fillStyle = '#efe6c6'; ctx.font = '700 16px "Special Elite", "Courier New", monospace'; ctx.fillText(c[1].slice(0, n), w / 2, h - bar - 34); }
    cs2Once('m12stamp', sd > 0, function () { try { playExplosionSound(1.3); playTone(160, 50, .5, .12, 'square'); } catch (e) {} });
    if (sd > 0) { const k = cs2C(sd / .22, 0, 1), sc = cs2L(3.2, 1, cs2E(k)), fade = cs2C((M12CS.dur - 1 - t) / .6, 0, 1); ctx.save(); ctx.translate(w / 2, h * .42); ctx.rotate(-.045); ctx.scale(sc, sc); ctx.globalAlpha = k * fade; ctx.fillStyle = 'rgba(8,8,5,.86)'; ctx.fillRect(-w, -88, w * 2, 176);
        [-88, 73].forEach(function (y) { ctx.save(); ctx.beginPath(); ctx.rect(-w, y, w * 2, 15); ctx.clip(); ctx.fillStyle = '#d6a91c'; ctx.fillRect(-w, y, w * 2, 15); ctx.fillStyle = '#16140f'; for (let x = -w - 40; x < w + 40; x += 40) { ctx.beginPath(); ctx.moveTo(x, y + 15); ctx.lineTo(x + 20, y); ctx.lineTo(x + 34, y); ctx.lineTo(x + 14, y + 15); ctx.fill(); } ctx.restore(); });
        ctx.textAlign = 'center'; ctx.fillStyle = '#d9c88c'; ctx.font = '700 15px "Special Elite", "Courier New", monospace'; ctx.fillText('— ACT III · COMMANDO RAID · MISSION 12 —', 0, -48); ctx.fillStyle = '#f4ecd0'; ctx.strokeStyle = '#000'; ctx.lineWidth = 7; ctx.font = '700 70px "Stardos Stencil", Impact, sans-serif'; ctx.strokeText('ROCKET RAID', 0, 22); ctx.fillText('ROCKET RAID', 0, 22); ctx.fillStyle = '#e8c968'; ctx.font = '700 17px "Special Elite", "Courier New", monospace'; ctx.fillText('STOP THE V-2.', 0, 54); ctx.restore(); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8);
    const fa = Math.max(cs2C(1 - t / 1.0, 0, 1), cs2C((t - (M12CS.dur - 1)) / 1, 0, 1)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + fa + ')'; ctx.fillRect(0, 0, w, h); }
    if (t < M12CS.dur) campaignCutsceneFrame = requestAnimationFrame(drawM12Cutscene); else finishCampaignCutscene();
}
function startMission12(skipIntro) {
    returnToMenu(); campaignMission = 12; selectedGameMode = 'campaign'; selectedMap = 'campaignGustav'; M12.failWhy = '';
    document.getElementById('menu').style.display = 'none'; const cs = document.getElementById('campaignScreen'); if (cs) cs.style.display = 'none'; document.getElementById('gameArea').style.display = 'block';
    ['controls', 'battleMainMenuButton', 'gameInfo', 'pointScoreBar', 'battleMessage', 'killFeed', 'radioText', 'campaignObjectiveBox'].forEach(function (id) { const e = document.getElementById(id); if (e) e.style.display = 'none'; });
    M8.cut = true; applyPointControlCanvasSize(); canvas.style.transform = 'translate3d(0px,0px,0px)'; if (typeof minimapPanel !== 'undefined' && minimapPanel) minimapPanel.style.display = 'none';
    M8.pendingLvl = 'peene';
    if (skipIntro) { m12ShowBrief(); return; }
    if (typeof CS2 !== 'undefined') CS2.fired = {};
    campaignCutsceneRunning = true; campaignCutsceneStart = performance.now(); if (campaignCutsceneFrame) cancelAnimationFrame(campaignCutsceneFrame); campaignCutsceneFrame = requestAnimationFrame(drawM12CutsceneHD);
}
function m12ShowBrief() {
    m2InjectStyle(); M8.pendingLvl = 'peene';
    let b = document.getElementById('m2Brief'); if (!b) { b = document.createElement('div'); b.id = 'm2Brief'; document.body.appendChild(b); }
    b.innerHTML = '<div class="bSheet"><div class="bTape"><span>OPERATION HYDRA · MOST SECRET</span><span>MISSION 12</span></div><div class="bBody">' +
        '<h2>ROCKET RAID</h2><p class="bText" id="m12Typed"></p>' +
        '<ul><li>Your section lands on the <b>beach</b> (south-west). Work through the pines and into the wire: the <b>gaps</b> on the west and east sides, or the guarded <b>south gate</b>.</li>' +
        '<li>Set charges in all four: the <b>LOX PLANT</b>, the <b>ASSEMBLY HALL</b>, the <b>LAUNCH BUNKER</b> and the <b>GUIDANCE LAB</b>. Clear each room before the technicians reach the alarm bell, then <b>hold F</b> on the target.</li>' +
        '<li><b>X-ZEIT</b>: the V-2 on <b>Prüfstand VII</b> launches in <b>twelve minutes</b>. If it lifts off before all four charges are set, London burns and the mission fails.</li>' +
        '<li>At about the <b>3½-minute</b> mark the <b>RAF</b> arrives — <b>Operation Hydra</b>. Bombs land everywhere (red rings show where), guards dive for cover and smoke screens roll across the site. Use the chaos, and don\'t stand under it.</li>' +
        '<li>With all four set, run for the <b>MTB off the east beach</b>. The quartermaster has a whole new armoury for this one.</li></ul>' +
        '<div class="bNote">This is the hardest raid of the war. Searchlight towers, MG nests, dogs, and reinforcements from the barracks if the alarm goes up.</div>' +
        '<button class="bGo" id="m12ToQM">TO THE ARMOURY ▶</button></div></div>';
    b.hidden = false; b.style.display = '';
    const txt = '17 July 1944, 23:30. The A4 rocket on Test Stand VII is being fuelled for a live launch at London. Stop it, wreck the site, and be at sea before Bomber Command flattens the place.';
    const el = document.getElementById('m12Typed'); let i = 0; const iv = setInterval(function () { i += 2; el.textContent = txt.slice(0, i); if (i >= txt.length) clearInterval(iv); }, 20);
    document.getElementById('m12ToQM').onclick = function () { clearInterval(iv); b.hidden = true; try { playTone(520, 760, .1, .05, 'triangle'); } catch (e) {} m8ShowArmoury(); };
}
/* ---------- ending ---------- */
const M12E = { dur: 20, cut: 7, cut2: 14 };
function m12PlayEnding(done) {
    const E = M12E; E.t0 = performance.now(); E.done = done; E.fired = {}; canvas.style.cursor = ''; if (!CS2.grain) CS2.grain = cs2Grain();
    E.skip = function (e) { if (e.code === 'Space' || e.code === 'Escape') { e.preventDefault(); E.t0 -= 60000; } }; window.addEventListener('keydown', E.skip);
    cancelAnimationFrame(E.raf); E.raf = requestAnimationFrame(m12EndFrameHD);
}
function m12EOnce(k, cond, fn) { if (cond && !M12E.fired[k]) { M12E.fired[k] = 1; try { fn(); } catch (e) {} } }
function dqBomber(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#0a0c10'; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(60, -2); ctx.lineTo(64, 2); ctx.lineTo(-60, 4); ctx.fill(); ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-30, -6); ctx.lineTo(34, -6); ctx.lineTo(10, 0); ctx.fill(); ctx.fillRect(-58, -12, 4, 14); ctx.fillRect(-50, -12, 4, 14); [-20, -10, 18, 28].forEach(function (ex) { ctx.fillRect(ex, -2, 8, 5); }); ctx.restore(); }
function m12EShotA(t, hv) { // the MTB at full speed, the coast erupting behind
    const hz = hv * .5; dqSky(hz, t, t * 40, { moonX: 260, moonY: hz - 260, warm: t > 1.5 ? 1 : 0 });
    // searchlights + flak
    [[500, 1], [900, -1], [1300, 1]].forEach(function (L, i) { dqBeam(L[0], hz - 10, -Math.PI / 2 + L[1] * (.3 + Math.sin(t * .6 + i) * .3), 900, .02, .18, t + i); });
    for (let i = 0; i < 14; i++) { const k = (t * .7 + i / 14) % 1; if (k > .25) continue; const x = 300 + ddpR(i) * 1100, y = 60 + ddpR(i * 3) * (hz - 200); ddpFlashGlow(x, y, 40 + k * 120, .4 * (1 - k * 4)); ctx.fillStyle = 'rgba(30,30,30,' + (.6 - k * 2) + ')'; ctx.beginPath(); ctx.arc(x, y, 8 + k * 50, 0, 7); ctx.fill(); }
    for (let i = 0; i < 7; i++) dqBomber((t * 90 + i * 260) % 1900 - 150, 70 + (i % 3) * 50 + Math.sin(i) * 20, .9 + (i % 2) * .3, t);
    // the coast with the site going up
    ctx.fillStyle = '#0a0c10'; ctx.beginPath(); ctx.moveTo(-100, hz + 2); for (let x = -100; x <= 1700; x += 20) ctx.lineTo(x, hz - 16 - ddpR(Math.floor(x / 20)) * 14); ctx.lineTo(1700, hz + 2); ctx.fill();
    let flash = 0; [[1.4, 1060], [2.6, 820], [3.4, 1180], [4.4, 980]].forEach(function (b, i) { const k = t - b[0]; if (k < 0) return; m12EOnce('a' + i, true, function () { playExplosionSound(1.4); }); if (k < .2) flash = Math.max(flash, .4 * (1 - k / .2)); ddpBlast(b[1], hz - 20, 1.3, Math.min(1, k * .7), i * 5, 1); if (k > .5) { ddpFire(b[1], hz - 10, 1.2, t, i); ddpSmoke(b[1], hz - 120, 1.2, t, i, -60, 300, .8); } ddpFlashGlow(b[1], hz - 40, 300, Math.max(.3, 1 - k * .4)); });
    if (t > 1.4) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(1000, hz, 10, 1000, hz, 800); g.addColorStop(0, 'rgba(255,150,60,' + Math.min(.35, (t - 1.4) * .2) + ')'); g.addColorStop(1, 'rgba(255,150,60,0)'); ctx.fillStyle = g; ctx.fillRect(200, hz - 600, 1600, 1000); ctx.restore(); }
    dqSea(hz, hv + 40, t, t * 160, { moonX: 260 });
    dqMGB(560 - t * 20, hv * .76, 1.6, t, { dir: -1, speed: 1 }); ddpM10Swell(hv, t * 1.6, hv * .94, .9);
    return flash;
}
function m12EShotB(u, hv, t) { // Prüfstand VII: the rocket explodes on its table
    const hz = hv * .74; const sk = ctx.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#0a0608'); sk.addColorStop(1, '#4a2014'); ctx.fillStyle = sk; ctx.fillRect(-100, -100, 1800, hz + 104);
    for (let i = 0; i < 5; i++) dqBomber((u * 120 + i * 380) % 1900 - 150, 60 + i * 30, 1.1, u);
    ctx.fillStyle = '#100a08'; ctx.beginPath(); ctx.moveTo(-100, hz); ctx.quadraticCurveTo(800, hz - 200, 1700, hz); ctx.fill();
    const gg = ctx.createLinearGradient(0, hz, 0, hv); gg.addColorStop(0, '#3a2014'); gg.addColorStop(1, '#0e0806'); ctx.fillStyle = gg; ctx.fillRect(-100, hz, 1800, hv);
    const boom = 1.1, k = u - boom, sh = k > 0 && k < 2 ? (2 - k) * 8 : 0; ctx.save(); ctx.translate((Math.random() - .5) * sh, (Math.random() - .5) * sh);
    // the gantry falls, the rocket topples into the fireball
    ctx.save(); ctx.translate(980, hz); ctx.rotate(k > .3 ? Math.min(1.1, (k - .3) * .5) : 0); ctx.translate(-980, -hz); dqGantry(980, hz, 1, u); ctx.restore();
    if (k < .1) dqV2(800, hz, 1.05, u); else if (k < 3) { ctx.save(); ctx.translate(800, hz); ctx.rotate(-Math.min(1.4, k * k * .25)); ctx.globalAlpha = Math.max(0, 1 - k / 3); ctx.translate(-800, -hz); dqV2(800, hz, 1.05, u); ctx.restore(); }
    let flash = 0; if (k > 0) { m12EOnce('v2', true, function () { playExplosionSound(2); playTone(60, 30, 2, .15, 'sawtooth'); }); if (k < .3) flash = .9 * (1 - k / .3);
        for (let r = 0; r < 4; r++) ddpBlast(800 + (r - 1.5) * 90, hz - 60 - r * 60, 2.4 + r * .3, Math.min(1, k * .45), r * 7 + 2, 1);
        ddpFire(800, hz - 20, 2.6, u, 1); ddpFire(700, hz - 10, 1.8, u, 2); ddpFire(900, hz - 10, 1.8, u, 3); ddpSmoke(800, hz - 380, 2.4, u, 4, -40, 520, 1); ddpFlashGlow(800, hz - 200, 900, Math.max(.4, 1.2 - k * .2));
        for (let i = 0; i < 30; i++) { const kk = k - i * .03; if (kk < 0) continue; const a = -Math.PI / 2 + (ddpR(i) - .5) * 2.4, sp = 300 + ddpR(i * 3) * 500, x = 800 + Math.cos(a) * sp * kk, y = hz - 100 + Math.sin(a) * sp * kk + 300 * kk * kk; if (y > hv) continue; ctx.fillStyle = 'rgba(255,' + (160 + ddpR(i) * 80 | 0) + ',80,' + Math.max(0, 1 - kk / 2.4) + ')'; ctx.fillRect(x, y, 4, 4); } }
    ctx.restore();
    // the earth wall lit orange in front
    ctx.fillStyle = '#140c08'; ctx.beginPath(); ctx.moveTo(-100, hv); ctx.lineTo(-100, hz + 80); ctx.quadraticCurveTo(800, hz + 20, 1700, hz + 80); ctx.lineTo(1700, hv); ctx.fill(); ctx.strokeStyle = 'rgba(255,160,80,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-100, hz + 80); ctx.quadraticCurveTo(800, hz + 20, 1700, hz + 80); ctx.stroke();
    return flash;
}
function m12EndFrame(now) {
    const E = M12E, t = (now - E.t0) / 1000, w = canvas.width, h = canvas.height, U = w / 1600, hv = h / U;
    if (t >= E.dur) { window.removeEventListener('keydown', E.skip); if (E.done) E.done(); return; }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); ctx.scale(U, U);
    let flash = 0; try { if (t < E.cut) flash = m12EShotA(t, hv); else flash = m12EShotB(t - E.cut, hv, t); } catch (e) { DDP.err = e; }
    ctx.restore(); try { ddpBloom(w, h); } catch (e) {}
    ctx.save(); ctx.globalAlpha = .08; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    const vg = ctx.createRadialGradient(w / 2, h * .52, w * .24, w / 2, h * .52, w * .74); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    if (flash > 0) { ctx.fillStyle = 'rgba(255,235,200,' + Math.min(.9, flash) + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = Math.round(h * .062); ctx.fillStyle = '#050605'; ctx.fillRect(0, 0, w, bar); ctx.fillRect(0, h - bar, w, bar);
    const caps = [[.5, 'MTB 718 · 00:41 · ALL ABOARD, FULL AHEAD.'], [2.4, 'BEHIND THEM, THE FUSES RUN OUT — AND THE BOMBERS ARRIVE.'], [7.4, 'PRÜFSTAND VII.'], [9.0, 'THE ROCKET NEVER LEAVES ITS TABLE.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; }); if (ci >= 0 && t < E.cut2) { const c = caps[ci], n = Math.min(c[1].length, Math.floor((t - c[0]) * 34)); ctx.textAlign = 'center'; ctx.fillStyle = '#efe6c6'; ctx.font = '700 16px "Special Elite", "Courier New", monospace'; ctx.fillText(c[1].slice(0, n), w / 2, h - bar - 14); }
    if (t > E.cut2) { const k = Math.min(1, (t - E.cut2) / .8); ctx.fillStyle = 'rgba(0,0,0,' + .6 * k + ')'; ctx.fillRect(0, 0, w, h); ctx.save(); ctx.globalAlpha = k; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd24a'; ctx.font = '700 ' + Math.round(w * .05) + 'px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('THE ROCKET WILL NOT FLY', w / 2, h * .42); ctx.fillStyle = '#e8e0c0'; ctx.font = Math.round(w * .014) + 'px "Special Elite", monospace'; ctx.fillText('PEENEMÜNDE WRECKED · THE V-2 SET BACK BY MONTHS · LONDON SPARED', w / 2, h * .42 + w * .032); ctx.fillStyle = '#9fb27a'; ctx.fillText('OPERATION HYDRA — COMPLETE · ACT III — THE LONG NIGHT IS OVER', w / 2, h * .42 + w * .058); ctx.restore(); }
    const fa = Math.max(Math.max(0, 1 - t / .8), Math.max(0, (t - (E.dur - 1)) / 1)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + Math.min(1, fa) + ')'; ctx.fillRect(0, 0, w, h); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8);
    E.raf = requestAnimationFrame(m12EndFrame);
}
