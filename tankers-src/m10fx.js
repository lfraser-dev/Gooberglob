/* =====================================================
   MISSION 10 — the world under the water, mines, hydrophones, star shells, the tug and the boom gate
===================================================== */
function m10BuildSeabed() {
    const c = document.createElement('canvas'); c.width = M10W; c.height = M10H; const g = c.getContext('2d');
    const bg = g.createLinearGradient(0, 0, 0, M10H); bg.addColorStop(0, '#2a3426'); bg.addColorStop(.5, '#34402e'); bg.addColorStop(1, '#4a5038'); g.fillStyle = bg; g.fillRect(0, 0, M10W, M10H);
    for (let i = 0; i < 9000; i++) { const x = m10H(i, 21) * M10W, y = m10H(i, 22) * M10H; g.fillStyle = ['rgba(90,96,70,.35)', 'rgba(20,26,18,.35)', 'rgba(120,118,90,.25)'][i % 3]; g.fillRect(x, y, 2 + m10H(i, 23) * 3, 2); }
    // sand ripples outside the moles
    g.strokeStyle = 'rgba(140,140,100,.18)'; g.lineWidth = 2; for (let y = 1260; y < M10H; y += 14) { g.beginPath(); for (let x = 0; x <= M10W; x += 30) g.lineTo(x, y + Math.sin(x * .02 + y * .1) * 4); g.stroke(); }
    // the dredged channel through the harbour is deeper and darker
    const ch = g.createLinearGradient(1000, 0, 1400, 0); ch.addColorStop(0, 'rgba(0,0,0,0)'); ch.addColorStop(.5, 'rgba(0,10,10,.35)'); ch.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = ch; g.fillRect(1000, 560, 400, 1140);
    // rocks along the moles and quays
    const rock = function (x, y, r, i) { g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(x + 4, y + 4, r, r * .8, 0, 0, 7); g.fill(); g.fillStyle = ['#4a4c44', '#5a5a50', '#3e4038'][i % 3]; g.beginPath(); g.ellipse(x, y, r, r * .78, m10H(i, 31), 0, 7); g.fill(); g.fillStyle = 'rgba(120,140,90,.35)'; g.beginPath(); g.ellipse(x - r * .2, y - r * .25, r * .5, r * .35, 0, 0, 7); g.fill(); };
    for (let i = 0; i < 220; i++) { const onMole = i % 2, x = onMole ? (m10H(i, 32) < .5 ? m10H(i, 33) * 1040 : 1360 + m10H(i, 33) * 1040) : (m10H(i, 34) < .5 ? 520 + m10H(i, 35) * 30 : 1850 + m10H(i, 35) * 30), y = onMole ? (m10H(i, 36) < .5 ? 1160 + m10H(i, 37) * 20 : 1240 + m10H(i, 37) * 30) : 160 + m10H(i, 38) * 890; rock(x, y, 6 + m10H(i, 39) * 12, i); }
    // weed beds
    for (let i = 0; i < 70; i++) { const x = m10H(i, 41) * M10W, y = 600 + m10H(i, 42) * 1100; for (let k = 0; k < 9; k++) { g.strokeStyle = k % 2 ? 'rgba(70,100,50,.6)' : 'rgba(50,80,40,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + k * 4, y); g.bezierCurveTo(x + k * 4 + 8, y - 10, x + k * 4 - 8, y - 22, x + k * 4 + 4, y - 30 - m10H(i, k) * 14); g.stroke(); } }
    // junk on the bottom: an old anchor + chain, tyres, crates, a sunken barge, a dropped torpedo
    g.strokeStyle = '#3a3a34'; g.lineWidth = 5; g.beginPath(); g.moveTo(820, 1000); g.quadraticCurveTo(900, 1060, 1000, 1020); g.stroke(); g.lineWidth = 6; g.beginPath(); g.moveTo(1000, 1020); g.lineTo(1040, 1020); g.moveTo(1020, 1000); g.lineTo(1020, 1050); g.stroke(); g.beginPath(); g.arc(1020, 1040, 16, 0, Math.PI); g.stroke();
    [[1500, 980], [740, 880], [1700, 1380], [600, 1500]].forEach(function (t) { g.strokeStyle = '#1a1a18'; g.lineWidth = 6; g.beginPath(); g.arc(t[0], t[1], 11, 0, 7); g.stroke(); });
    [[1320, 820], [1340, 846], [900, 1440]].forEach(function (cq) { g.fillStyle = '#4a3a24'; g.fillRect(cq[0], cq[1], 24, 24); g.strokeStyle = 'rgba(0,0,0,.4)'; g.strokeRect(cq[0], cq[1], 24, 24); });
    g.save(); g.translate(1640, 1500); g.rotate(.3); g.fillStyle = '#2a2a24'; g.fillRect(-90, -34, 180, 68); g.fillStyle = '#20201c'; g.fillRect(-80, -26, 160, 52); g.strokeStyle = '#3a3a30'; g.lineWidth = 3; for (let x = -70; x < 80; x += 30) { g.beginPath(); g.moveTo(x, -26); g.lineTo(x, 26); g.stroke(); } g.restore();
    g.save(); g.translate(1280, 960); g.rotate(-.4); g.fillStyle = '#3a4048'; g.fillRect(-40, -5, 80, 10); g.beginPath(); g.arc(40, 0, 5, -Math.PI / 2, Math.PI / 2); g.fill(); g.restore();
    // pen bays: concrete floors
    M10_BAYS.forEach(function (x) { g.fillStyle = '#3a3c38'; g.fillRect(x, 200, 150, 360); g.strokeStyle = 'rgba(0,0,0,.25)'; for (let y = 210; y < 560; y += 30) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 150, y); g.stroke(); } });
    // only water shows
    g.globalCompositeOperation = 'destination-out'; m10Land().forEach(function (R) { g.fillRect(R[0], R[1], R[2], R[3]); }); g.globalCompositeOperation = 'source-over';
    return c;
}
function m10DrawUnder(now) { // called in world space when the frogman is submerged
    const M = M10; if (!M.seabed) M.seabed = m10BuildSeabed();
    const k = M.subK || 0; if (k <= .01) return;
    ctx.save(); ctx.globalAlpha = .72 * k; ctx.drawImage(M.seabed, Math.round(M.cam.x) - 2, Math.round(M.cam.y) - 2, 1104, 704, Math.round(M.cam.x) - 2, Math.round(M.cam.y) - 2, 1104, 704);
    ctx.globalAlpha = .38 * k; ctx.fillStyle = '#0a3038'; ctx.fillRect(M.cam.x - 4, M.cam.y - 4, 1108, 708);
    // caustics
    ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 2; for (let i = 0; i < 90; i++) { const x = M.cam.x + ((m10H(i, 51) * 1300 + now * .012 * (1 + m10H(i, 52))) % 1300) - 100, y = M.cam.y + m10H(i, 53) * 720; if (!m10IsWater(x, y)) continue; ctx.strokeStyle = 'rgba(120,200,190,' + (.05 + .05 * Math.sin(now / 600 + i)) * k + ')'; ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 14, y - 8 + Math.sin(now / 500 + i) * 6, x + 30, y + 8, x + 46, y); ctx.stroke(); }
    ctx.globalCompositeOperation = 'source-over';
    // drifting particles
    ctx.fillStyle = 'rgba(200,220,210,' + .25 * k + ')'; for (let i = 0; i < 110; i++) { const x = M.cam.x + ((m10H(i, 61) * 1100 + now * .006) % 1100), y = M.cam.y + ((m10H(i, 62) * 700 + now * .004 * (i % 3 + 1)) % 700); ctx.fillRect(x, y, 1.6, 1.6); }
    ctx.restore();
}
function m10DrawExtras(now) { // world space, after the boats
    const M = M10, P = M.p, A = M.arrival;
    // contact mines: plain to see underwater up close, a dark shape from the surface
    M.cmines.forEach(function (m) { if (m.dead) return; const d = Math.hypot(P.x - m.x, P.y - m.y), vis = P.sub ? Math.max(0, 1 - d / 240) : Math.max(0, 1 - d / 90) * .5; if (vis <= 0) return; ctx.save(); ctx.globalAlpha = vis; ctx.strokeStyle = '#2a2a24'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 2]); ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x + 10, m.y + 18); ctx.stroke(); ctx.setLineDash([]); m8Disc(ctx, m.x, m.y, 9, '#16180e', '#5a5e44'); ctx.strokeStyle = '#2a2c20'; ctx.lineWidth = 2.4; for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28; ctx.beginPath(); ctx.moveTo(m.x + Math.cos(a) * 8, m.y + Math.sin(a) * 8); ctx.lineTo(m.x + Math.cos(a) * 13, m.y + Math.sin(a) * 13); ctx.stroke(); } if (P.sub && d < 120) { ctx.fillStyle = 'rgba(255,90,60,' + (.5 + .5 * Math.sin(now / 150)) + ')'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.fillText('MINE', m.x, m.y - 18); } ctx.restore(); });
    // hydrophone buoys
    M.hydros.forEach(function (h, i) { m8Disc(ctx, h.x, h.y, 8, '#3a1a10', '#b05030'); ctx.strokeStyle = '#1a1a18'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(h.x, h.y); ctx.lineTo(h.x + 4, h.y - 16); ctx.stroke(); if (Math.floor(now / 800 + i) % 2) { ctx.fillStyle = '#ffe080'; ctx.beginPath(); ctx.arc(h.x + 4, h.y - 16, 2, 0, 7); ctx.fill(); }
        if (P.sub && Math.hypot(P.x - h.x, P.y - h.y) < 320) { ctx.strokeStyle = M.heard ? 'rgba(255,120,80,.4)' : 'rgba(160,220,220,.18)'; ctx.lineWidth = 1.4; for (let r = 0; r < 3; r++) { const k = ((now / (M.heard ? 500 : 1400)) + r / 3) % 1; ctx.beginPath(); ctx.arc(h.x, h.y, 20 + k * 220, 0, 7); ctx.stroke(); } } });
    // the boom gate
    if (M.gateOpen || (A.state === 1 && M.subs[2].cy > 1000)) { ctx.strokeStyle = '#6a5a3a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1120, M10_NET.y); ctx.lineTo(1120 - (M.gateOpen ? 40 : 0), M10_NET.y - (M.gateOpen ? 70 : 0)); ctx.moveTo(1280, M10_NET.y); ctx.lineTo(1280 + (M.gateOpen ? 40 : 0), M10_NET.y - (M.gateOpen ? 70 : 0)); ctx.stroke(); }
    // the tug leading U-981 in
    if (A.state === 1 && A.tx !== undefined) { const U = M.subs[2]; ctx.save(); ctx.translate(A.tx, A.ty); ctx.rotate(U.a); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(4, 8, 40, 16, 0, 0, 7); ctx.fill(); ctx.fillStyle = m8Grad(ctx, 0, -16, 0, 16, [[0, '#4a3a2a'], [.5, '#2a2018'], [1, '#14100a']]); ctx.beginPath(); ctx.moveTo(-34, -14); ctx.lineTo(16, -15); ctx.quadraticCurveTo(40, -6, 42, 0); ctx.quadraticCurveTo(40, 6, 16, 15); ctx.lineTo(-34, 14); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#c8c0a8'; ctx.fillRect(-14, -9, 24, 18); m8Disc(ctx, -4, 0, 6, '#1a1a1a', '#5a2a1a'); ctx.fillStyle = '#121212'; [[-30, -12], [-30, 12], [30, -12], [30, 12]].forEach(function (q) { ctx.beginPath(); ctx.arc(q[0], q[1], 3, 0, 7); ctx.fill(); }); ctx.restore(); if (Math.random() < .3) M.parts.push({ k: 'smoke', x: A.tx, y: A.ty, vx: -Math.cos(U.a) * .6, vy: -Math.sin(U.a) * .6, life: 1, decay: .01, r: 8 }); }
    // star shells
    M.flares.forEach(function (f) { const k = (now - f.t) / 9000; ctx.strokeStyle = 'rgba(230,230,220,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(f.x, f.y - 14, 10, Math.PI, 0); ctx.moveTo(f.x - 10, f.y - 14); ctx.lineTo(f.x, f.y); ctx.lineTo(f.x + 10, f.y - 14); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,240,' + (.8 + Math.random() * .2) * (1 - k * .5) + ')'; ctx.beginPath(); ctx.arc(f.x, f.y, 5, 0, 7); ctx.fill(); });
}
function m10SurfaceReflections(now) { // light on the water when on the surface: shimmering streaks under every lamp
    const M = M10; ctx.save(); ctx.globalCompositeOperation = 'lighter';
    M.lamps.forEach(function (L) { if (L.dead) return; for (let i = 0; i < 8; i++) { const y = L.y + 20 + i * 14, w = 18 - i * 1.5 + Math.sin(now / 300 + i) * 5; if (!m10IsWater(L.x, y)) continue; ctx.fillStyle = 'rgba(255,200,120,' + (.12 - i * .012) + ')'; ctx.fillRect(L.x - w / 2 + Math.sin(now / 400 + i * 2) * 4, y, w, 4); } });
    // moon glitter outside the harbour
    for (let i = 0; i < 70; i++) { const x = 1400 + m10H(i, 71) * 900, y = 1280 + m10H(i, 72) * 400; if (Math.sin(now / 250 + i * 3) < .6) continue; ctx.fillStyle = 'rgba(200,215,255,.22)'; ctx.fillRect(x, y, 6 + m10H(i, 73) * 10, 1.6); }
    ctx.restore();
}
function m10DarkExtras(hole, cone, now) {
    const M = M10, A = M.arrival; M.flares.forEach(function (f) { const k = (now - f.t) / 9000; hole(f.x, f.y, 420 * (1 - k * .3), .95); });
    if (A.state === 1 && A.tx !== undefined) { cone(A.tx, A.ty, M.subs[2].a, 340, .28, .85); hole(A.tx, A.ty, 70, .5); }
    if (M.p.sub) M.cmines.forEach(function (m) { if (!m.dead && Math.hypot(M.p.x - m.x, M.p.y - m.y) < 200) hole(m.x, m.y, 40, .3); });
}
function m10LighterExtras(now) { const M = M10, A = M.arrival; M.flares.forEach(function (f) { const k = (now - f.t) / 9000, r = 420 * (1 - k * .3), g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r); g.addColorStop(0, 'rgba(230,235,255,' + .3 * (1 - k * .5) + ')'); g.addColorStop(1, 'rgba(230,235,255,0)'); ctx.fillStyle = g; ctx.fillRect(f.x - r, f.y - r, r * 2, r * 2); });
    if (A.state === 1 && A.tx !== undefined) { ctx.save(); ctx.translate(A.tx, A.ty); ctx.rotate(M.subs[2].a); const g = ctx.createLinearGradient(0, 0, 340, 0); g.addColorStop(0, 'rgba(255,240,200,.28)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(340, -98); ctx.lineTo(340, 98); ctx.lineTo(0, 4); ctx.fill(); ctx.restore(); } }
