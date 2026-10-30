/* =====================================================
   MISSION 9 CUTSCENE — ACT III opener: the château, the machine, the plan, the road
===================================================== */
const M9CS = { dur: 27, cuts: [6.2, 12.4, 18.6] };
function ddpChateau(x, y, s, t, o) { // facade, feet of the wall at (x,y), width ~ 900*s
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const lit = o.lit === undefined ? 1 : o.lit;
    const wall = ctx.createLinearGradient(0, -330, 0, 0); wall.addColorStop(0, '#3a3c4a'); wall.addColorStop(1, '#22232c');
    // turrets
    [-470, 470].forEach(function (tx) { ctx.fillStyle = wall; ctx.fillRect(tx - 70, -380, 140, 380); ctx.fillStyle = '#16171e'; ctx.beginPath(); ctx.moveTo(tx - 84, -380); ctx.lineTo(tx, -560); ctx.lineTo(tx + 84, -380); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(160,170,210,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx, -560); ctx.lineTo(tx + 84, -380); ctx.stroke(); ctx.fillStyle = '#16171e'; ctx.fillRect(tx - 2, -600, 4, 44);
        for (let r = 0; r < 3; r++) { const wy = -330 + r * 110; ddpChWin(tx - 18, wy, 36, 62, lit && ddpR(tx + r) > .55, t, tx + r); } });
    // main block
    ctx.fillStyle = wall; ctx.fillRect(-400, -330, 800, 330);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; for (let yy = -320; yy < 0; yy += 22) ctx.fillRect(-400, yy, 800, 1);
    // mansard roof + dormers + chimneys
    ctx.fillStyle = '#18191f'; ctx.beginPath(); ctx.moveTo(-420, -330); ctx.lineTo(-360, -470); ctx.lineTo(360, -470); ctx.lineTo(420, -330); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(170,180,220,.22)'; ctx.beginPath(); ctx.moveTo(-360, -470); ctx.lineTo(360, -470); ctx.stroke();
    [-300, -150, 0, 150, 300].forEach(function (dx, i) { ctx.fillStyle = '#2a2b34'; ctx.fillRect(dx - 26, -440, 52, 70); ctx.fillStyle = '#18191f'; ctx.beginPath(); ctx.moveTo(dx - 32, -440); ctx.lineTo(dx, -476); ctx.lineTo(dx + 32, -440); ctx.fill(); ddpChWin(dx - 14, -428, 28, 46, lit && (i === 1 || i === 4), t, 50 + i); });
    [-250, 250].forEach(function (cx) { ctx.fillStyle = '#26272e'; ctx.fillRect(cx - 18, -540, 36, 80); ctx.fillStyle = '#1a1b20'; ctx.fillRect(cx - 22, -546, 44, 10); });
    // windows
    for (let r = 0; r < 2; r++) for (let c = 0; c < 7; c++) { const wx = -350 + c * 110, wy = -300 + r * 140; if (c === 3 && r === 1) continue; ddpChWin(wx, wy, 44, 92, lit && ddpR(r * 7 + c + 3) > (c === 5 && r === 0 ? 0 : .5), t, r * 7 + c); }
    // door + steps + lamps
    ctx.fillStyle = '#120e0a'; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(-34, -110); ctx.arc(0, -110, 34, Math.PI, 0); ctx.lineTo(34, 0); ctx.fill(); ctx.fillStyle = 'rgba(255,190,110,.35)'; ctx.fillRect(-30, -100, 60, 4);
    ctx.fillStyle = '#4a4a50'; for (let i = 0; i < 3; i++) ctx.fillRect(-70 - i * 16, i * 8, 140 + i * 32, 8);
    [-60, 60].forEach(function (lx) { ddpFlashGlow(lx, -96, 50, .45 + .05 * Math.sin(t * 7 + lx)); ctx.fillStyle = '#ffe0a0'; ctx.fillRect(lx - 4, -102, 8, 12); });
    // banner from the balcony
    ctx.fillStyle = '#5a1410'; ctx.fillRect(-26, -250, 52, 120); ctx.fillStyle = '#1a0806'; ctx.fillRect(-26, -250, 52, 6);
    ctx.restore();
}
function ddpChWin(x, y, w, h, lit, t, seed) { if (lit) { const f = .8 + .2 * Math.sin(t * 2 + seed); ctx.fillStyle = 'rgba(255,196,110,' + f + ')'; ctx.fillRect(x, y, w, h); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,150,60,.18)'; ctx.fillRect(x - w * .4, y - h * .2, w * 1.8, h * 1.4); ctx.restore(); } else { ctx.fillStyle = '#0c0d14'; ctx.fillRect(x, y, w, h); ctx.fillStyle = 'rgba(150,170,230,.12)'; ctx.fillRect(x + 2, y + 2, w * .4, h * .5); } ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x + w / 2 - 1, y, 2, h); ctx.fillRect(x, y + h * .45, w, 2); ctx.fillStyle = '#4a4a54'; ctx.fillRect(x - 4, y + h, w + 8, 5); }
function ddpM9ShotA(t, hv) { // the château across the lawn, a searchlight sweeping, sentries
    const hz = hv * .66, push = 1 + t * .02; ddpNightSky(hz, t, t * 8, { moonX: 1300, moonY: 520, glow: .08 });
    ctx.save(); ctx.translate(800, hz); ctx.scale(push, push); ctx.translate(-800, -hz);
    for (let i = 0; i < 22; i++) { const x = i * 80 - 60, r = 70 + ddpR(i) * 50; ctx.fillStyle = '#0c120e'; ctx.beginPath(); ctx.arc(x, hz - 40 - ddpR(i + 3) * 40, r, 0, 7); ctx.fill(); }
    ddpChateau(800, hz + 20, .9, t, {});
    const g = ctx.createLinearGradient(0, hz + 20, 0, hv); g.addColorStop(0, '#141c16'); g.addColorStop(1, '#070a08'); ctx.fillStyle = g; ctx.fillRect(-200, hz + 20, 2000, hv);
    ctx.fillStyle = 'rgba(160,170,200,.12)'; ctx.beginPath(); ctx.ellipse(800, hz + 70, 170, 26, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#20242a'; ctx.beginPath(); ctx.ellipse(800, hz + 66, 120, 18, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#2a2e36'; ctx.fillRect(792, hz + 10, 16, 56);
    for (let i = 0; i < 9; i++) { const x = 200 + i * 150; ctx.fillStyle = '#0a100c'; ctx.beginPath(); ctx.moveTo(x - 18, hz + 120); ctx.lineTo(x, hz + 30); ctx.lineTo(x + 18, hz + 120); ctx.fill(); }
    const sw = Math.sin(t * .6) * .5; ddpSearch(1260, hz - 300, Math.PI * .62 + sw, 900, .22, 70); ctx.fillStyle = '#1a1c22'; ctx.fillRect(1240, hz - 300, 40, 320); ddpFlashGlow(1260, hz - 300, 40, .7);
    ddpMan(430 + t * 22, hz + 140, 1.25, t, { ger: true, run: .35, spd: 6, haze: .3 }); ddpMan(1150 - t * 18, hz + 150, 1.25, t + 2, { ger: true, run: .35, spd: 6, dir: -1, haze: .3 });
    ctx.restore();
    // foreground: wall top + ivy, a commando's helmet peeking
    ctx.fillStyle = '#121410'; ctx.fillRect(-100, hv * .9, 1800, hv * .2); ctx.fillStyle = '#1e2018'; ctx.fillRect(-100, hv * .9, 1800, 10); for (let i = 0; i < 40; i++) { ctx.fillStyle = 'rgba(30,50,26,.9)'; ctx.beginPath(); ctx.arc(i * 44, hv * .9 + ddpR(i) * 10, 16 + ddpR(i + 2) * 14, 0, 7); ctx.fill(); }
    const pk = cs2C((t - 2.4) / 1.2, 0, 1); ctx.fillStyle = '#26301e'; ctx.beginPath(); ctx.ellipse(300, hv * .9 - pk * 34 + 30, 58, 36, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#1a2014'; ctx.fillRect(238, hv * .9 - pk * 34 + 28, 124, 8);
}
function ddpEnigma(cx, cy, s, t, lit) { // three-quarter view of the machine
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.ellipse(20, 240, 420, 60, 0, 0, 7); ctx.fill();
    const wood = ctx.createLinearGradient(-380, 0, 380, 0); wood.addColorStop(0, '#3a2414'); wood.addColorStop(.5, '#6a4426'); wood.addColorStop(1, '#3a2414'); ctx.fillStyle = wood; ctx.beginPath(); ctx.moveTo(-380, -200); ctx.lineTo(380, -200); ctx.lineTo(400, 230); ctx.lineTo(-400, 230); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#1a0e06'; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = '#1a1a1c'; ctx.beginPath(); ctx.moveTo(-350, -180); ctx.lineTo(350, -180); ctx.lineTo(366, 210); ctx.lineTo(-366, 210); ctx.closePath(); ctx.fill();
    // rotors
    for (let i = 0; i < 3; i++) { const rx = -60 + i * 60; ctx.fillStyle = '#2a2a2c'; ctx.fillRect(rx - 22, -176, 44, 50); const off = (t * (i === 2 ? 1.2 : i === 1 ? .1 : 0)) % 1; for (let k = -1; k <= 1; k++) { const yy = -151 + (k + off) * 16; ctx.fillStyle = k === 0 ? '#e8e0c8' : '#9a9280'; ctx.font = '700 13px monospace'; ctx.textAlign = 'center'; ctx.fillText(String.fromCharCode(65 + ((Math.floor(t * (i === 2 ? 1.2 : .1)) + i * 7 + k + 26) % 26)), rx, yy + 5); } ctx.fillStyle = '#6a6a6c'; ctx.fillRect(rx + 22, -170, 8, 40); for (let k = 0; k < 6; k++) { ctx.fillStyle = '#3a3a3c'; ctx.fillRect(rx + 22, -168 + k * 7, 8, 2); } }
    ctx.fillStyle = '#4a4a4c'; ctx.fillRect(-130, -186, 260, 8);
    // lampboard
    const rows = ['QWERTZUIO', 'ASDFGHJK', 'PYXCVBNML']; let li = Math.floor(t * 2.4) % 26;
    rows.forEach(function (row, r) { for (let i = 0; i < row.length; i++) { const x = -290 + i * 66 + (r === 1 ? 33 : r === 2 ? 0 : 0) + (r === 2 ? 0 : 0), y = -100 + r * 48, on = lit && ((r * 9 + i) === li % 25); ctx.fillStyle = on ? '#ffe7a0' : '#2c2a24'; ctx.beginPath(); ctx.arc(x, y, 18, 0, 7); ctx.fill(); if (on) ddpFlashGlow(x, y, 60, .7); ctx.fillStyle = on ? '#4a2a00' : '#7a7464'; ctx.font = '700 16px monospace'; ctx.textAlign = 'center'; ctx.fillText(row[i], x, y + 6); } });
    // keyboard
    rows.forEach(function (row, r) { for (let i = 0; i < row.length; i++) { const x = -300 + i * 68 + (r === 1 ? 34 : 0), y = 50 + r * 52, pressed = lit && (r * 9 + i) === (li + 7) % 25; ctx.fillStyle = '#0a0a0a'; ctx.beginPath(); ctx.arc(x, y + 4, 22, 0, 7); ctx.fill(); ctx.fillStyle = pressed ? '#3a3a38' : '#1e1e1e'; ctx.beginPath(); ctx.arc(x, y + (pressed ? 3 : 0), 21, 0, 7); ctx.fill(); ctx.strokeStyle = '#8a8a88'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#e8e8e0'; ctx.font = '700 17px monospace'; ctx.fillText(row[i], x, y + 6 + (pressed ? 3 : 0)); } });
    // plugboard cables
    ctx.strokeStyle = '#8a2a1a'; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-260 + i * 140, 216); ctx.bezierCurveTo(-240 + i * 140, 300, -120 + i * 120, 300, -100 + i * 120, 216); ctx.stroke(); }
    ctx.fillStyle = '#c8b890'; ctx.font = '700 22px "Stardos Stencil", Impact'; ctx.fillText('ENIGMA', 0, -192 + 14 + 300 - 300 - 4 - 10);
    ctx.restore();
}
function ddpM9ShotB(u, hv) { // close on the Enigma, lamps lighting, an operator's hands, a key sheet
    ctx.fillStyle = '#100c08'; ctx.fillRect(-100, -100, 1800, hv + 200);
    const lp = ctx.createRadialGradient(800, hv * .35, 40, 800, hv * .45, 900); lp.addColorStop(0, 'rgba(255,200,120,.38)'); lp.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = lp; ctx.fillRect(-100, -100, 1800, hv + 200);
    const z = 1.05 + u * .03; ctx.save(); ctx.translate(800, hv * .55); ctx.scale(z, z); ctx.translate(-800, -hv * .55);
    // key sheet paper
    ctx.save(); ctx.translate(1290, hv * .62); ctx.rotate(.12); ctx.fillStyle = '#e8dcc0'; ctx.fillRect(-150, -200, 300, 400); ctx.fillStyle = '#7a1a10'; ctx.font = '700 15px monospace'; ctx.textAlign = 'center'; ctx.fillText('GEHEIME KOMMANDOSACHE', 0, -170); ctx.fillStyle = '#2a2418'; ctx.font = '11px monospace'; for (let r = 0; r < 18; r++) ctx.fillText(String(31 - r).padStart(2, '0') + '  ' + ['I', 'II', 'III', 'IV', 'V'][r % 5] + ' ' + ['V', 'I', 'III'][r % 3] + ' ' + ['IV', 'II', 'V'][r % 3] + '  ' + String.fromCharCode(65 + r % 26) + String.fromCharCode(70 + r % 20) + ' ' + String.fromCharCode(66 + r % 24) + String.fromCharCode(75 + r % 15), 0, -140 + r * 18); ctx.restore();
    ddpEnigma(720, hv * .52, 1.05, u, true);
    // hands: gloved fingers on the keys
    const tap = Math.max(0, Math.sin(u * 5)) * 8; [[520, hv * .7 + tap], [880, hv * .72 + Math.max(0, Math.sin(u * 5 + 2)) * 8]].forEach(function (h, i) { ctx.fillStyle = '#3a3a40'; ctx.beginPath(); ctx.moveTo(h[0] - 70, hv + 40); ctx.quadraticCurveTo(h[0] - 50, h[1] + 80, h[0] - 20, h[1] + 30); ctx.lineTo(h[0] + 40, h[1] + 40); ctx.quadraticCurveTo(h[0] + 60, h[1] + 120, h[0] + 70, hv + 40); ctx.fill(); ctx.fillStyle = '#c89a7a'; ctx.beginPath(); ctx.ellipse(h[0] + 10, h[1] + 20, 46, 30, -.2, 0, 7); ctx.fill(); for (let f = 0; f < 4; f++) { ctx.beginPath(); ctx.ellipse(h[0] - 20 + f * 18, h[1] - 6, 8, 22, .1, 0, 7); ctx.fill(); } ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(h[0] - 40, h[1] + 30, 100, 6); });
    ctx.restore();
    // a cigarette's smoke
    const P = ddpEnsure(); for (let i = 0; i < 6; i++) { const k = (u * .2 + i / 6) % 1; ctx.globalAlpha = .18 * (1 - k); ctx.drawImage(P.smoke, 1450 - 60 + Math.sin(k * 6 + i) * 30, hv * .5 - k * 420 - 60, 120, 120); } ctx.globalAlpha = 1;
}
function ddpM9ShotC(u, hv) { // overhead: the plan on a map table under a hurricane lamp
    ctx.fillStyle = '#1a140c'; ctx.fillRect(-100, -100, 1800, hv + 200);
    const z = 1 + u * .025; ctx.save(); ctx.translate(800, hv / 2); ctx.scale(z, z); ctx.rotate(-.03 + u * .004); ctx.translate(-800, -hv / 2);
    ctx.fillStyle = '#3a2814'; ctx.fillRect(140, 40, 1320, hv - 80); for (let i = 0; i < 14; i++) { ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(140, 40 + i * 64, 1320, 2); }
    // map
    ctx.save(); ctx.translate(780, hv / 2); ctx.rotate(-.04); ctx.fillStyle = '#d8ccA0'; ctx.fillRect(-460, -300, 920, 600); ctx.fillStyle = '#b8c098'; ctx.fillRect(-440, -280, 880, 560);
    ctx.strokeStyle = '#6a8aa0'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-440, 120); ctx.bezierCurveTo(-200, 60, 0, 200, 440, 90); ctx.stroke();
    ctx.strokeStyle = '#8a5a30'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-300, -200); ctx.bezierCurveTo(-150, -100, -60, 60, 40, 110); ctx.bezierCurveTo(140, 160, 260, 240, 420, 260); ctx.stroke(); ctx.setLineDash([8, 6]); ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-440, 210); ctx.lineTo(440, 180); ctx.stroke(); ctx.setLineDash([]);
    for (let i = 0; i < 30; i++) { ctx.fillStyle = 'rgba(60,90,40,.5)'; ctx.beginPath(); ctx.arc(-420 + ddpR(i) * 840, -260 + ddpR(i + 3) * 520, 10 + ddpR(i + 5) * 14, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#2a2018'; ctx.fillRect(-330, -230, 60, 34); ctx.fillRect(-350, -230, 20, 60); ctx.fillRect(-270, -230, 20, 60);
    const dr = cs2C((u - .6) / 1.4, 0, 1); ctx.strokeStyle = '#b02010'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(-300, -208, 70, -1.6, -1.6 + dr * 6.4); ctx.stroke();
    const ar = cs2C((u - 2.2) / 2.6, 0, 1); if (ar > 0) { ctx.strokeStyle = '#1a3aa0'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-300, -200); for (let k = 0; k <= ar; k += .02) { const tt = k; const x = -300 + tt * 720, y = -200 + tt * 400 + Math.sin(tt * 9) * 30; ctx.lineTo(x, y); } ctx.stroke(); }
    ctx.fillStyle = '#7a1a10'; ctx.font = '700 22px "Stardos Stencil", Impact'; ctx.textAlign = 'left'; ctx.fillText('CHÂTEAU DE VAUX', -240, -260 + 4); ctx.fillStyle = '#1a3aa0'; ctx.font = '700 16px "Special Elite", monospace'; if (ar > .9) ctx.fillText('OUR LINES', 330, 230); ctx.fillStyle = '#2a2a2a'; ctx.fillText('ROADBLOCK?', 60, 60);
    ctx.restore();
    // photographs and a pencil
    ctx.save(); ctx.translate(1300, hv * .3); ctx.rotate(.2); ctx.fillStyle = '#e8e4d8'; ctx.fillRect(-110, -80, 220, 160); ctx.fillStyle = '#3a3a36'; ctx.fillRect(-98, -68, 196, 120); ctx.fillStyle = '#6a6a62'; ctx.fillRect(-70, -40, 140, 70); ctx.fillStyle = '#9a9a92'; ctx.fillRect(-30, -20, 60, 30); ctx.restore();
    ctx.save(); ctx.translate(330, hv * .78); ctx.rotate(-.5); ctx.fillStyle = '#e8e4d8'; ctx.fillRect(-90, -70, 180, 140); ctx.fillStyle = '#2a2a28'; ctx.fillRect(-80, -60, 160, 110); ctx.fillStyle = '#5a5a56'; ctx.beginPath(); ctx.ellipse(0, 0, 50, 30, 0, 0, 7); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(1180, hv * .82); ctx.rotate(.9); ctx.fillStyle = '#c8a030'; ctx.fillRect(-90, -6, 180, 12); ctx.fillStyle = '#2a2a2a'; ctx.fillRect(90, -6, 14, 12); ctx.restore();
    // a finger tracing the route
    const fx = 780 - 300 + ar * 720, fy = hv / 2 - 200 + ar * 400; if (ar > 0 && ar < 1) { ctx.fillStyle = '#3e4230'; ctx.beginPath(); ctx.moveTo(fx + 36, fy + 26); ctx.lineTo(fx + 520, fy + 330); ctx.lineTo(fx + 470, fy + 400); ctx.lineTo(fx + 4, fy + 50); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.moveTo(fx + 60, fy + 70); ctx.lineTo(fx + 540, fy + 370); ctx.lineTo(fx + 500, fy + 420); ctx.lineTo(fx + 40, fy + 90); ctx.fill(); ctx.fillStyle = '#c89a7a'; ctx.beginPath(); ctx.ellipse(fx + 20, fy + 30, 36, 26, .8, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(fx, fy, 9, 24, .8, 0, 7); ctx.fill(); }
    ctx.restore();
    // lamp pool
    const g = ctx.createRadialGradient(800, hv * .45, 80, 800, hv * .5, 1000); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.8)'); ctx.fillStyle = g; ctx.fillRect(-100, -100, 1800, hv + 200);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(800, hv * .4, 0, 800, hv * .4, 700); lg.addColorStop(0, 'rgba(255,190,100,.22)'); lg.addColorStop(1, 'rgba(255,190,100,0)'); ctx.fillStyle = lg; ctx.fillRect(-100, -100, 1800, hv + 200); ctx.restore();
}
function ddpM9ShotD(u, hv) { // the lorry on a night road, men in the back, the château lights far off
    const hz = hv * .6, pan = u * 40; ddpNightSky(hz, u + 30, pan, { moonX: 400, moonY: 480, glow: .05 });
    const ridge = function (base, amp, seed, col, par) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-200, hv); for (let x = -200; x <= 1900; x += 40) ctx.lineTo(x, base - amp * (.5 + .5 * Math.sin((x + pan * par) * .004 + seed) * Math.sin((x + pan * par) * .0017 + seed * 2))); ctx.lineTo(1900, hv); ctx.fill(); };
    ridge(hz - 20, 140, 1, '#141826', .1); ctx.fillStyle = 'rgba(255,190,110,.9)'; for (let i = 0; i < 6; i++) ctx.fillRect(1180 + i * 9 - pan * .1, hz - 70 + (i % 2) * 6, 3, 4); ddpFlashGlow(1200 - pan * .1, hz - 66, 40, .25);
    ridge(hz + 40, 90, 4, '#0c100e', .3);
    const g = ctx.createLinearGradient(0, hz + 40, 0, hv); g.addColorStop(0, '#121810'); g.addColorStop(1, '#060806'); ctx.fillStyle = g; ctx.fillRect(-200, hz + 40, 2000, hv);
    ctx.fillStyle = '#1e1c16'; ctx.fillRect(-200, hv * .8, 2000, 60);
    for (let i = 0; i < 12; i++) { const x = ((i * 300 - pan * 3) % 3600 + 3600) % 3600 - 600; ctx.fillStyle = '#060a06'; ctx.beginPath(); ctx.arc(x, hv * .72, 90 + ddpR(i) * 50, 0, 7); ctx.fill(); ctx.fillRect(x - 10, hv * .72, 20, 120); }
    const tx = 380 + u * 40; ddpTruck(tx, hv * .84, 1.6, u, { move: 1 });
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgb(90,100,150)'; ctx.fillRect(-200, hz + 10, 2000, hv); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const hl = ctx.createLinearGradient(tx + 150, 0, tx + 650, 0); hl.addColorStop(0, 'rgba(255,230,180,.25)'); hl.addColorStop(1, 'rgba(255,230,180,0)'); ctx.fillStyle = hl; ctx.beginPath(); ctx.moveTo(tx + 150, hv * .8 - 40); ctx.lineTo(tx + 650, hv * .8 - 70); ctx.lineTo(tx + 650, hv * .9); ctx.lineTo(tx + 150, hv * .8 - 30); ctx.fill(); ctx.restore();
    // foreground grass streaking by
    for (let i = 0; i < 40; i++) { const x = ((i * 47 - pan * 10) % 1900 + 1900) % 1900 - 150; ctx.strokeStyle = '#0a0e08'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, hv); ctx.lineTo(x + 8, hv - 40 - ddpR(i) * 50); ctx.stroke(); }
}
function ddpM9Frame(t, w, h) {
    const U = w / 1600, hv = h / U, c = M9CS.cuts; DDP.ok = true; ctx.save(); ctx.scale(U, U);
    if (t < c[0]) ddpM9ShotA(t, hv); else if (t < c[1]) ddpM9ShotB(t - c[0], hv); else if (t < c[2]) ddpM9ShotC(t - c[1], hv); else ddpM9ShotD(t - c[2], hv);
    ctx.restore(); ddpBloom(w, h); return 0;
}
function drawM9Cutscene(now) {
    if (!campaignCutsceneRunning) return;
    const t = (now - campaignCutsceneStart) / 1000, w = canvas.width, h = canvas.height;
    if (t < .05) { M2CS.fired = {}; try { initAudio(); } catch (e) {} }
    if (!CS2.grain) CS2.grain = cs2Grain();
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    let flash = 0; try { ddpM9Frame(t, w, h); } catch (e) { DDP.err = e; ctx.setTransform(1, 0, 0, 1, 0, 0); }
    M9CS.cuts.forEach(function (c) { const d = t - c; if (d >= 0 && d < .16) flash = Math.max(flash, .35 * (1 - d / .16)); });
    // morse beeps over the Enigma shot
    if (t > M9CS.cuts[0] && t < M9CS.cuts[1]) { const b = Math.floor(t * 6); if (b !== M9CS.lastBeep && ddpR(b) > .45) { M9CS.lastBeep = b; try { playTone(880, 880, .06, .025, 'sine'); } catch (e) {} } }
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(110,130,170,.16)'; ctx.fillRect(0, 0, w, h); ctx.restore();
    ctx.save(); ctx.globalAlpha = .09; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    if (Math.random() < .3) { ctx.fillStyle = 'rgba(255,245,220,.10)'; ctx.fillRect(Math.random() * w, 0, 1.4, h); }
    const vg = ctx.createRadialGradient(w / 2, h * .52, w * .24, w / 2, h * .52, w * .74); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    if (flash > 0) { ctx.fillStyle = 'rgba(255,238,200,' + flash + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = Math.round(h * .062 * cs2E(Math.min(1, t / .9))); ctx.fillStyle = '#050605'; ctx.fillRect(0, 0, w, bar); ctx.fillRect(0, h - bar - 26, w, bar + 26);
    const ta = cs2C(Math.min((t - .6) / .8, (4.8 - t) / .8), 0, 1);
    if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, h * .16, w, 124);
        ctx.fillStyle = '#d9c88c'; ctx.font = '700 15px "Special Elite", "Courier New", monospace'; ctx.fillText('— OPERATION OVERLORD · ACT III —', w / 2, h * .16 + 30);
        ctx.fillStyle = '#f4ecd0'; ctx.font = '700 52px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('THE LONG NIGHT', w / 2, h * .16 + 80);
        ctx.font = '15px "Special Elite", "Courier New", monospace'; ctx.fillStyle = '#d9c88c'; ctx.fillText('16 JUNE 1944   ·   D+10   ·   23:40   ·   CHÂTEAU DE VAUX, BEHIND THE LINES', w / 2, h * .16 + 108); ctx.restore(); }
    const caps = [[5.0, 'A PANZER CORPS HEADQUARTERS. TWELVE MILES BEHIND THE LINES.'], [7.0, 'THEIR ORDERS GO OUT ON THIS.'], [9.4, 'BLETCHLEY PARK CAN READ IT — IF THEY HAVE THE MONTH\'S KEY SHEETS.'], [13.0, 'THE SHEETS ARE IN THE COLONEL\'S SAFE.'], [15.4, 'GET IN UNSEEN. OPEN THE SAFE. TAKE HIS CAR.'], [19.0, 'AND DRIVE LIKE HELL FOR OUR LINES.'], [21.6, 'No. 2 COMMANDO GOES IN TONIGHT.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; });
    const sd = t - 23.0;
    if (ci >= 0 && sd < 0) { const c = caps[ci], n = Math.min(c[1].length, Math.floor((t - c[0]) * 34)), txt = c[1].slice(0, n) + (Math.floor(t * 3) % 2 && n < c[1].length ? '▌' : ''); ctx.textAlign = 'center'; ctx.fillStyle = '#efe6c6'; ctx.font = '700 16px "Special Elite", "Courier New", monospace'; ctx.fillText(txt, w / 2, h - bar - 34); }
    cs2Once('m9stamp', sd > 0, function () { try { playExplosionSound(1.0); playTone(180, 50, .4, .1, 'square'); } catch (e) {} });
    if (sd > 0) { const k = cs2C(sd / .22, 0, 1), sc = cs2L(3.2, 1, cs2E(k)), fade = cs2C((M9CS.dur - 1 - t) / .6, 0, 1);
        ctx.save(); ctx.translate(w / 2, h * .46); ctx.rotate(-.045); ctx.scale(sc, sc); ctx.globalAlpha = k * fade; ctx.fillStyle = 'rgba(8,8,5,.86)'; ctx.fillRect(-w, -88, w * 2, 176);
        [-88, 73].forEach(function (y) { ctx.save(); ctx.beginPath(); ctx.rect(-w, y, w * 2, 15); ctx.clip(); ctx.fillStyle = '#d6a91c'; ctx.fillRect(-w, y, w * 2, 15); ctx.fillStyle = '#16140f'; for (let x = -w - 40; x < w + 40; x += 40) { ctx.beginPath(); ctx.moveTo(x, y + 15); ctx.lineTo(x + 20, y); ctx.lineTo(x + 34, y); ctx.lineTo(x + 14, y + 15); ctx.fill(); } ctx.restore(); });
        ctx.textAlign = 'center'; ctx.fillStyle = '#d9c88c'; ctx.font = '700 15px "Special Elite", "Courier New", monospace'; ctx.fillText('— ACT III · COMMANDO RAID · MISSION 9 —', 0, -48);
        ctx.fillStyle = '#f4ecd0'; ctx.strokeStyle = '#000'; ctx.lineWidth = 7; ctx.font = '700 70px "Stardos Stencil", Impact, sans-serif'; ctx.strokeText('THE CODEBREAKER RAID', 0, 22); ctx.fillText('THE CODEBREAKER RAID', 0, 22);
        ctx.fillStyle = '#e8c968'; ctx.font = '700 17px "Special Elite", "Courier New", monospace'; ctx.fillText('OPERATION NIGHTJAR.', 0, 54); ctx.restore(); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8);
    const fa = Math.max(cs2C(1 - t / 1.0, 0, 1), cs2C((t - (M9CS.dur - 1)) / 1, 0, 1)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + fa + ')'; ctx.fillRect(0, 0, w, h); }
    if (t < M9CS.dur) campaignCutsceneFrame = requestAnimationFrame(drawM9Cutscene); else finishCampaignCutscene();
}
function startMission9(skipIntro) {
    returnToMenu(); campaignMission = 9; selectedGameMode = 'campaign'; selectedMap = 'campaignGustav'; M9.failWhy = ''; M9.result = null;
    document.getElementById('menu').style.display = 'none'; const cs = document.getElementById('campaignScreen'); if (cs) cs.style.display = 'none'; document.getElementById('gameArea').style.display = 'block';
    ['controls', 'battleMainMenuButton', 'gameInfo', 'pointScoreBar', 'battleMessage', 'killFeed', 'radioText', 'campaignObjectiveBox'].forEach(function (id) { const e = document.getElementById(id); if (e) e.style.display = 'none'; });
    M8.cut = true; applyPointControlCanvasSize(); canvas.style.transform = 'translate3d(0px,0px,0px)'; if (typeof minimapPanel !== 'undefined' && minimapPanel) minimapPanel.style.display = 'none';
    M8.pendingLvl = 'chateau';
    if (skipIntro) { m9ShowBrief(); return; }
    M9CS.lastBeep = -1; if (typeof CS2 !== 'undefined') CS2.fired = {};
    campaignCutsceneRunning = true; campaignCutsceneStart = performance.now(); if (campaignCutsceneFrame) cancelAnimationFrame(campaignCutsceneFrame); campaignCutsceneFrame = requestAnimationFrame(drawM9Cutscene);
}
function m9ShowBrief() {
    m2InjectStyle(); M8.pendingLvl = 'chateau';
    let b = document.getElementById('m2Brief'); if (!b) { b = document.createElement('div'); b.id = 'm2Brief'; document.body.appendChild(b); }
    b.innerHTML = '<div class="bSheet"><div class="bTape"><span>OPERATION NIGHTJAR</span><span>MISSION 09</span></div><div class="bBody">' +
        '<h2>THE CODEBREAKER RAID</h2><p class="bText" id="m9Typed"></p>' +
        '<ul><li>Your section starts outside the <b>château walls</b>. Find a way in through the <b>gate</b> or the <b>breach in the west wall</b>. <b>Guard dogs</b> track you by smell, not by sight, so keep your distance.</li>' +
        '<li>The colonel\'s <b>study</b> is on the north side of the house. Deal with the colonel, then crack his <b>wall safe</b>: turn the dial <b>right, left, right</b> and listen for the click. Turn too fast or set a wrong number and the guards will hear you.</li>' +
        '<li><i>Optional:</i> smash the <b>signals room</b> radio (east wing) so they can\'t phone ahead to the roadblock. The <b>kitchen</b> (west wing) has food and ammunition.</li>' +
        '<li>With the key sheets in hand, get to the <b>staff car</b> in the courtyard and drive for <b>British lines</b>. <b>W/S</b> to drive, <b>A/D</b> to steer, <b>click</b> to fire, <b>G</b> to drop grenades behind you.</li></ul>' +
        '<div class="bNote">If the alarm is raised, the garrison sends an armoured car after you.</div>' +
        '<button class="bGo" id="m9ToQM">TO THE QUARTERMASTER ▶</button></div></div>';
    b.hidden = false; b.style.display = '';
    const txt = '16 June 1944, 23:40. The Panzer corps HQ at the Château de Vaux holds this month\'s Enigma key sheets. Bletchley Park needs them before the Germans know they are gone. Get in quietly, open the safe, take the colonel\'s own car and bring them home.';
    const el = document.getElementById('m9Typed'); let i = 0; const iv = setInterval(function () { i += 2; el.textContent = txt.slice(0, i); if (i >= txt.length) clearInterval(iv); }, 22);
    document.getElementById('m9ToQM').onclick = function () { clearInterval(iv); b.hidden = true; try { playTone(520, 760, .1, .05, 'triangle'); } catch (e) {} m8ShowArmoury(); };
}
