/* ================= MISSION 3 : THE RIVER CROSSING (painted) ================= */
const DDP_M3PAL = { top: [14, 18, 28], mid: [40, 44, 62], low: [112, 70, 70], hor: [206, 108, 62], streaks: true };
function ddpM3Storm(hz, t, pan, lit) { // heavy storm clouds over the sky, lit from below by fires / lightning
    const P = ddpEnsure();
    for (let i = 0; i < 34; i++) { const x = ((ddpR(i * 5) * 2600 + t * (6 + (i % 5) * 2) - pan * .08) % 2600) - 500, y = hz - 120 - ddpR(i * 3) * 620, r = 160 + ddpR(i + 7) * 220;
        ctx.globalAlpha = .62; ctx.drawImage(P.dark, x - r * 1.4, y - r * .55, r * 2.8, r * 1.1);
        if (lit > 0) { ctx.globalAlpha = lit * .35; ctx.drawImage(P.grey, x - r * 1.2, y - r * .3, r * 2.4, r * .8); } }
    ctx.globalAlpha = 1;
    // warm underside near the burning town
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(1260 - pan * .05, hz - 40, 0, 1260 - pan * .05, hz - 40, 520); g.addColorStop(0, 'rgba(255,120,50,.35)'); g.addColorStop(1, 'rgba(255,90,40,0)'); ctx.fillStyle = g; ctx.fillRect(500, hz - 600, 1600, 640); ctx.restore();
}
function ddpBolt(x, y0, y1, seed, a) { // forked lightning
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(220,230,255,' + a + ')'; ctx.lineCap = 'round';
    function seg(x0, yA, yB, w, sd, depth) { let x = x0, y = yA; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); const n = 9; for (let i = 1; i <= n; i++) { const ny = yA + (yB - yA) * i / n, nx = x + (ddpR(sd + i) - .5) * 60; ctx.lineTo(nx, ny); if (depth < 1 && ddpR(sd + i * 7) > .78) { ctx.stroke(); seg(nx, ny, ny + (yB - yA) * .3, w * .5, sd + i * 13, depth + 1); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(nx, ny); } x = nx; y = ny; } ctx.stroke(); }
    seg(x, y0, y1, 4, seed, 0); ctx.globalAlpha = a * .5; ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(160,180,255,.25)'; seg(x, y0, y1, 12, seed, 1); ctx.restore();
}
function ddpM3FarBank(hz, t, pan, o) { // treeline, burning town, far shore
    o = o || {}; const P = ddpEnsure(), px = -pan * .25;
    ctx.save(); ctx.translate(px, 0);
    // distant ridge
    ctx.fillStyle = '#2a2430'; ctx.beginPath(); ctx.moveTo(-600, hz + 10); for (let x = -600; x <= 2400; x += 30) ctx.lineTo(x, hz - 40 - Math.sin(x * .004 + 1) * 30 - Math.sin(x * .013) * 10); ctx.lineTo(2400, hz + 10); ctx.fill();
    // burning town
    const tx = 1180; for (let i = 0; i < 11; i++) { const bx = tx + i * 46 - 60, bw = 34 + ddpR(i) * 26, bh = 34 + ddpR(i + 3) * 50; ctx.fillStyle = '#17131a'; ctx.fillRect(bx, hz - bh, bw, bh + 10); ctx.beginPath(); ctx.moveTo(bx - 3, hz - bh); ctx.lineTo(bx + bw / 2, hz - bh - 18); ctx.lineTo(bx + bw + 3, hz - bh); ctx.fill();
        for (let k = 0; k < 3; k++) if (ddpR(i * 4 + k) > .4) { ctx.fillStyle = 'rgba(255,' + (140 + k * 20) + ',60,' + (.55 + .4 * Math.sin(t * 7 + i + k)) + ')'; ctx.fillRect(bx + 6 + k * 10, hz - bh + 14 + (k % 2) * 12, 5, 7); } }
    ctx.fillStyle = '#17131a'; ctx.beginPath(); ctx.moveTo(tx + 150, hz - 60); ctx.lineTo(tx + 160, hz - 150); ctx.lineTo(tx + 170, hz - 60); ctx.fill(); ctx.fillRect(tx + 148, hz - 70, 24, 70);
    ddpSmoke(tx + 220, hz - 50, 1.1, t, 3, 260, 520, .9); ddpSmoke(tx + 40, hz - 40, .8, t, 7, 220, 420, .7);
    ddpFire(tx + 220, hz - 30, .6, t, 2); ddpFire(tx + 40, hz - 24, .45, t, 5);
    // treeline
    for (let i = 0; i < 70; i++) { const x = i * 34 - 500, r = 16 + ddpR(i * 3) * 18, y = hz - 6 - ddpR(i + 9) * 10; if (x > tx - 90 && x < tx + 420) continue; ctx.fillStyle = i % 2 ? '#101416' : '#151a1b'; ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.5, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,140,80,.12)'; ctx.beginPath(); ctx.ellipse(x + r * .3, y - r * .9, r * .6, r * .4, 0, 0, 7); ctx.fill(); }
    for (let i = 0; i < 6; i++) { const x = i * 300 - 200 + ddpR(i) * 80; if (x > tx - 90 && x < tx + 420) continue; ctx.fillStyle = '#0e1214'; ctx.beginPath(); ctx.ellipse(x, hz - 60, 12, 70, 0, 0, 7); ctx.fill(); }
    // far shore strip
    ctx.fillStyle = '#16181a'; ctx.fillRect(-600, hz + 8, 3000, (o.shore || 26));
    ctx.restore();
    // artillery flashes on the horizon
    (o.flashes || []).forEach(function (f, i) { const d = t - f; if (d >= 0 && d < .35) ddpFlashGlow(200 + ((i * 431) % 1300), hz - 10, 160, (1 - d / .35) * .8); });
}
function ddpM3River(y0, y1, t, sx, o) {
    o = o || {}; const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgb(86,66,70)'); g.addColorStop(.25, 'rgb(48,44,54)'); g.addColorStop(1, 'rgb(14,18,22)'); ctx.fillStyle = g; ctx.fillRect(-600, y0, 2800, y1 - y0);
    // fire glitter column
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 90; i++) { const k = i / 90, y = y0 + 4 + k * k * (y1 - y0), wd = (6 + k * 60) * (.5 + ddpR(i) * .8), x = sx + Math.sin(t * 2 + i * 1.7) * (10 + k * 60) + (ddpR(i * 3) - .5) * (30 + k * 160), a = (.5 - k * .35) * (.5 + .5 * Math.sin(t * 5 + i * 2.3)); ctx.fillStyle = 'rgba(255,' + (130 + (i % 4) * 20) + ',70,' + Math.max(0, a) + ')'; ctx.fillRect(x - wd / 2, y, wd, 1.5 + k * 3); }
    ctx.restore();
    // current streaks
    ctx.strokeStyle = 'rgba(170,180,200,.10)'; ctx.lineWidth = 1.4; for (let i = 0; i < 40; i++) { const k = ddpR(i + 40), y = y0 + 6 + k * k * (y1 - y0), x = ((ddpR(i) * 2200 + t * (30 + k * 80)) % 2400) - 400, L = 40 + k * 200; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + L, y + .5); ctx.stroke(); }
    // rain rings
    for (let i = 0; i < 60; i++) { const ph = (t * 1.4 + ddpR(i * 3)) % 1, k = ddpR(i * 9), x = ddpR(i * 17) * 1800 - 100, y = y0 + 8 + k * k * (y1 - y0 - 10), s = .4 + k * 1.6; ctx.strokeStyle = 'rgba(200,210,225,' + (.42 * (1 - ph)) + ')'; ctx.lineWidth = .8 + k; ctx.beginPath(); ctx.ellipse(x, y, (3 + ph * 12) * s, (1 + ph * 3) * s, 0, 0, 7); ctx.stroke(); }
}
function ddpM3Bridge(x0, x1, deckY, baseY, t, o) { // stone arch bridge, side view
    o = o || {}; const n = o.arches || 4, span = (x1 - x0) / n, aw = span * .72, rise = (baseY - deckY) * .62;
    if (!o.parapetOnly) {
        ctx.save(); const sg = ctx.createLinearGradient(0, deckY, 0, baseY); sg.addColorStop(0, '#5a524c'); sg.addColorStop(.5, '#423d3a'); sg.addColorStop(1, '#262422'); ctx.fillStyle = sg;
        ctx.beginPath(); ctx.rect(x0, deckY, x1 - x0, baseY - deckY + 40);
        for (let i = 0; i < n; i++) { const cx = x0 + span * (i + .5), sy = baseY - rise * .35; ctx.moveTo(cx + aw / 2, baseY + 40); ctx.lineTo(cx + aw / 2, sy); ctx.ellipse(cx, sy, aw / 2, rise * .78, 0, 0, Math.PI, true); ctx.lineTo(cx - aw / 2, baseY + 40); ctx.closePath(); }
        ctx.fill('evenodd');
        // stone courses + joints
        ctx.clip('evenodd'); ctx.strokeStyle = 'rgba(16,14,12,.45)'; ctx.lineWidth = 1.2;
        for (let y = deckY + 14, r = 0; y < baseY + 40; y += 15, r++) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); for (let x = x0 + (r % 2) * 18; x < x1; x += 36) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 15); ctx.stroke(); } }
        for (let i = 0; i < 160; i++) { const x = x0 + ddpR(i) * (x1 - x0), y = deckY + ddpR(i + 5) * (baseY - deckY); ctx.fillStyle = ddpR(i + 9) > .5 ? 'rgba(120,110,100,.18)' : 'rgba(0,0,0,.18)'; ctx.fillRect(x, y, 14 + ddpR(i) * 18, 8); }
        // wet streaks
        for (let i = 0; i < 60; i++) { const x = x0 + ddpR(i * 7) * (x1 - x0); ctx.fillStyle = 'rgba(10,10,12,.22)'; ctx.fillRect(x, deckY, 2 + ddpR(i) * 3, (baseY - deckY) * (.3 + ddpR(i + 2) * .7)); }
        ctx.restore();
        // voussoirs + arch shadow
        for (let i = 0; i < n; i++) { const cx = x0 + span * (i + .5), sy = baseY - rise * .35;
            ctx.save(); ctx.beginPath(); ctx.moveTo(cx + aw / 2, baseY + 40); ctx.lineTo(cx + aw / 2, sy); ctx.ellipse(cx, sy, aw / 2, rise * .78, 0, 0, Math.PI, true); ctx.lineTo(cx - aw / 2, baseY + 40); ctx.closePath(); ctx.clip();
            const ag = ctx.createLinearGradient(0, sy - rise * .78, 0, baseY); ag.addColorStop(0, 'rgba(8,8,10,.95)'); ag.addColorStop(1, 'rgba(20,20,24,.6)'); ctx.fillStyle = ag; ctx.fillRect(cx - aw, sy - rise, aw * 2, rise * 2 + 60);
            ctx.fillStyle = 'rgba(255,140,70,.10)'; ctx.fillRect(cx - aw / 2, baseY - 20, aw, 30); ctx.restore();
            ctx.strokeStyle = '#2c2826'; ctx.lineWidth = 2; for (let k = 0; k <= 16; k++) { const a = Math.PI + k / 16 * Math.PI, ex = cx + Math.cos(a) * aw / 2, ey = sy + Math.sin(a) * rise * .78, ox = cx + Math.cos(a) * (aw / 2 + 18), oy = sy + Math.sin(a) * (rise * .78 + 18); ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ox, oy); ctx.stroke(); }
            ctx.strokeStyle = 'rgba(150,140,130,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, sy, aw / 2 + 18, rise * .78 + 18, 0, Math.PI, 0); ctx.stroke(); }
        // cutwaters
        for (let i = 0; i <= n; i++) { const px = x0 + span * i; ctx.fillStyle = '#34302d'; ctx.beginPath(); ctx.moveTo(px - (span - aw) / 2, baseY + 40); ctx.lineTo(px - (span - aw) / 2, baseY - rise * .25); ctx.lineTo(px, baseY - rise * .4); ctx.lineTo(px + (span - aw) / 2, baseY - rise * .25); ctx.lineTo(px + (span - aw) / 2, baseY + 40); ctx.fill(); ctx.fillStyle = 'rgba(160,150,140,.25)'; ctx.fillRect(px - 1, baseY - rise * .4, 2, rise * .4 + 40); }
        // string course
        ctx.fillStyle = '#5e5650'; ctx.fillRect(x0, deckY - 4, x1 - x0, 7); ctx.fillStyle = 'rgba(200,190,180,.25)'; ctx.fillRect(x0, deckY - 4, x1 - x0, 1.6);
    }
    if (!o.noParapet) {
        const ph = o.ph || 26; const pg = ctx.createLinearGradient(0, deckY - ph, 0, deckY); pg.addColorStop(0, '#5c544e'); pg.addColorStop(1, '#3a3532'); ctx.fillStyle = pg; ctx.fillRect(x0, deckY - ph, x1 - x0, ph);
        ctx.strokeStyle = 'rgba(16,14,12,.5)'; ctx.lineWidth = 1; for (let x = x0; x < x1; x += 30) { ctx.beginPath(); ctx.moveTo(x, deckY - ph); ctx.lineTo(x, deckY); ctx.stroke(); }
        ctx.fillStyle = '#6a625a'; ctx.fillRect(x0, deckY - ph - 5, x1 - x0, 6); ctx.fillStyle = 'rgba(220,210,200,.38)'; ctx.fillRect(x0, deckY - ph - 5, x1 - x0, 1.5);
        // lanterns
        (o.lamps || []).forEach(function (lx) { ctx.fillStyle = '#15130f'; ctx.fillRect(lx - 3, deckY - ph - 92, 6, 92); ctx.fillRect(lx - 9, deckY - ph - 104, 18, 14); const fl = .85 + Math.sin(t * 13 + lx) * .08; ctx.fillStyle = 'rgba(255,200,120,' + fl + ')'; ctx.fillRect(lx - 6, deckY - ph - 101, 12, 9); ddpFlashGlow(lx, deckY - ph - 96, 120, .45 * fl); });
    }
}
function ddpM3Reflect(waterY, fn, a) { ctx.save(); ctx.beginPath(); ctx.rect(-600, waterY, 2800, 2000); ctx.clip(); ctx.translate(0, waterY * 2); ctx.scale(1, -1); ctx.globalAlpha = a; fn(); ctx.restore(); ctx.globalAlpha = 1; }
function ddpM3Reeds(y, t, n, h0, seed) { ctx.fillStyle = '#07080a'; for (let i = 0; i < n; i++) { const x = ((i * 53 + seed * 31) % 1900) - 150, hh = h0 * (.5 + ddpR(i + seed) * .8), sw = Math.sin(t * 1.4 + i * .7) * 10; ctx.beginPath(); ctx.moveTo(x - 4, y + 40); ctx.quadraticCurveTo(x + sw * .3, y - hh * .5, x + sw, y - hh); ctx.quadraticCurveTo(x + sw * .4 + 5, y - hh * .5, x + 5, y + 40); ctx.fill(); if (i % 4 === 0) { ctx.beginPath(); ctx.ellipse(x + sw, y - hh - 8, 3.4, 12, sw * .02, 0, 7); ctx.fill(); } } }
function ddpM3Sandbags(x0, x1, y, rows, s) { for (let r = 0; r < rows; r++) for (let x = x0 + (r % 2) * 22 * s; x < x1; x += 46 * s) { const by = y - r * 18 * s; ctx.fillStyle = (Math.round(x / 46) + r) % 2 ? '#3c3626' : '#463e2b'; ctx.beginPath(); ctx.ellipse(x, by, 25 * s, 11 * s, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1.4; ctx.stroke(); ctx.strokeStyle = 'rgba(200,190,170,.18)'; ctx.beginPath(); ctx.ellipse(x, by - 2 * s, 21 * s, 7 * s, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } }
function ddpM3Rain(t, hv, n, slant) { ctx.save(); ctx.lineCap = 'round'; for (let L = 0; L < 3; L++) { const sp = 1300 + L * 700, len = 22 + L * 20; ctx.strokeStyle = 'rgba(200,212,230,' + (.12 + L * .07) + ')'; ctx.lineWidth = 1 + L * .9; ctx.beginPath(); for (let i = 0; i < n / 3; i++) { const x0 = ddpR(i * 7 + L * 311) * 2000 - 200, y0 = ddpR(i * 13 + L * 71) * (hv + 200), y = (y0 + t * sp) % (hv + 200) - 100, x = x0 - (y + 100) * slant; ctx.moveTo(x, y); ctx.lineTo(x - slant * len, y + len); } ctx.stroke(); } ctx.restore(); }
function ddpM3Lightning(t, list) { let a = 0; list.forEach(function (f) { const d = t - f; if (d >= 0 && d < .5) a = Math.max(a, (d < .06 ? 1 : d < .12 ? .3 : d < .18 ? .8 : 0) * (1 - d / .5)); }); return a; }

/* ---------- SHOT 1 : the bridge at dusk ---------- */
function ddpM3Shot1(t, w, h) {
    const U = w / 1600, hv = h / U, P = ddpEnsure(); const flashes = [1.4, 3.3, 5.0];
    flashes.forEach(function (f, i) { cs2Once('m3f' + i, t > f, function () { playDistantArtillery(); }); }); cs2Once('m3rain', t > 0.1, function () { playTone(200, 180, 3.2, .018, 'sawtooth'); });
    const lt = ddpM3Lightning(t, [3.3]), pan = t * 14;
    ctx.save(); ctx.scale(U, U); ctx.translate(800, hv / 2); const z = 1.03 + t * .006; ctx.scale(z, z); ctx.translate(-800 - pan * .5, -hv / 2);
    const hz = hv * .42, deckY = hv * .53, baseY = hv * .66, sx = 1260;
    ddpSky(hz, t, pan, sx, .8, 0, DDP_M3PAL); ddpM3Storm(hz, t, pan, lt);
    if (lt > 0) ddpBolt(420, hz - 640, hz - 40, 7, lt);
    ddpM3FarBank(hz, t, pan, { flashes: flashes });
    ddpM3River(hz + 30, hv + 60, t, sx - 100, {});
    const bridge = function () { ddpM3Bridge(-260, 1900, deckY, baseY, t, { arches: 5, ph: 14, lamps: [220, 760, 1300] }); };
    ddpM3Reflect(baseY + 30, bridge, .26);
    ctx.fillStyle = 'rgba(16,18,24,.35)'; ctx.fillRect(-600, baseY + 30, 2800, 260);
    ddpM3Bridge(-260, 1900, deckY, baseY, t, { arches: 5, noParapet: true });
    // traffic on the deck: Shermans and riflemen crossing
    for (let i = 0; i < 3; i++) { const x = ((i * 640 + t * 60) % 2200) - 400; ddpSherman(x, deckY - 2, .62, t, { gun: .02, move: 1, haze: 0, exhaust: true }); for (let k = 0; k < 3; k++) ddpMan(x - 170 - k * 52, deckY - 2, 1.15, t, { run: .45, spd: 5.5, ph: k * 1.3 + i, haze: 0 }); }
    ddpM3Bridge(-260, 1900, deckY, baseY, t, { arches: 5, parapetOnly: true, ph: 14, lamps: [220, 760, 1300] });
    // engineers on the near pier steps
    // near bank + reeds + watching GIs
    const nb = ctx.createLinearGradient(0, hv * .84, 0, hv); nb.addColorStop(0, '#1a1912'); nb.addColorStop(1, '#090906'); ctx.fillStyle = nb; ctx.beginPath(); ctx.moveTo(-600, hv + 200); ctx.lineTo(-600, hv * .86); for (let x = -600; x <= 2400; x += 40) ctx.lineTo(x, hv * .86 + Math.sin(x * .01) * 10 + Math.sin(x * .037) * 4); ctx.lineTo(2400, hv + 200); ctx.fill();
    ddpM3Reeds(hv * .87, t, 46, 120, 1);
    ddpBack(330 + pan * .5, hv * .83, 3.4, t, { rim: .25, turn: -.2 }); ddpBack(520 + pan * .5, hv * .86, 3.6, t, { rim: .25, ph: 2, turn: .3 });
    // mist over the water
    for (let i = 0; i < 10; i++) { const x = ((i * 260 + t * 18) % 2400) - 400; ctx.globalAlpha = .18; ctx.drawImage(P.smoke, x - 260, baseY - 60, 520, 120); } ctx.globalAlpha = 1;
    ddpM3Rain(t, hv, 520, .22);
    if (lt > 0) { ctx.fillStyle = 'rgba(190,205,255,' + lt * .22 + ')'; ctx.fillRect(-600, -400, 2800, hv + 800); }
    ctx.restore();
    ddpBloom(w, h);
    return 0;
}

/* ---------- SHOT 2 : the far bank (panzers forming up) ---------- */
function ddpM3Shot2(t0, w, h) {
    const u = t0 - M3CS.cuts[0], U = w / 1600, hv = h / U, P = ddpEnsure();
    const fires = [.9, 1.7, 2.6, 3.5, 4.4, 5.3, 6.1]; fires.forEach(function (f, i) { cs2Once('m3s' + i, u > f, function () { playDistantArtillery(); if (i % 2) playExplosionSound(.4); }); });
    const hit = 4.6, hd = u - hit; let shake = 0; if (hd >= 0 && hd < .8) shake = Math.pow(1 - hd / .8, 2) * 18; cs2Once('m3hit', hd > 0, function () { playExplosionSound(1.3); });
    const lt = ddpM3Lightning(u, [2.1, 6.4]), sh = ddpShakeAt(u, shake + .5);
    ctx.save(); ctx.scale(U, U); ctx.translate(800, hv / 2); const z = 1.04 + u * .012; ctx.scale(z, z); ctx.translate(-800 + u * 12 + sh[0], -hv / 2 + sh[1]);
    const hz = hv * .4, shore = hz + 70, waterB = hv * .76, sx = 1300;
    ddpSky(hz, u + 7, 0, sx, .8, 0, DDP_M3PAL); ddpM3Storm(hz, u + 7, 0, lt); if (lt > 0) ddpBolt(1000, hz - 640, hz - 60, 21, lt);
    ddpM3FarBank(hz, u + 7, 0, { flashes: [], shore: 80 });
    // panzers emerging from the treeline
    const tanks = [{ x: 260, d: 0, s: .78 }, { x: 640, d: .6, s: .9 }, { x: 1000, d: .2, s: .82 }, { x: 1420, d: 1.0, s: .86 }];
    tanks.forEach(function (k, i) { const g = cs2C((u - k.d) / 6, 0, 1), px = k.x - g * 50, py = shore + 4 + (i % 2) * 6;
        ddpPanzer(px, py, k.s, -1, u, { haze: 0 }); ctx.fillStyle = 'rgba(255,220,150,.8)'; ctx.beginPath(); ctx.arc(px - 98 * k.s, py - 40 * k.s, 3, 0, 7); ctx.fill(); ddpFlashGlow(px - 98 * k.s, py - 40 * k.s, 40, .4);
        const fp = (u * .8 + i * .43) % 2.6, mx = px - 146 * k.s, my = py - 78 * k.s; if (fp < .2 && u > k.d + .8) { ddpFlashGlow(mx, my, 90, 1 - fp / .2); ctx.globalAlpha = (1 - fp / .2) * .8; ctx.fillStyle = 'rgba(255,240,200,1)'; ctx.beginPath(); ctx.moveTo(mx, my - 5); ctx.lineTo(mx - 40, my); ctx.lineTo(mx, my + 5); ctx.fill(); ctx.globalAlpha = 1; }
        if (fp > .2 && fp < 1.6 && u > k.d + .8) { const a = 1 - (fp - .2) / 1.4; ctx.globalAlpha = a * .5; const r = 20 + (fp - .2) * 50; ctx.drawImage(P.grey, mx - r - fp * 20, my - r - fp * 14, r * 2, r * 2); ctx.globalAlpha = 1; } });
    // ground mist on far bank
    for (let i = 0; i < 12; i++) { const x = ((i * 210 + u * 22) % 2400) - 400; ctx.globalAlpha = .3; ctx.drawImage(P.smoke, x - 240, shore - 50, 480, 90); } ctx.globalAlpha = 1;
    ddpM3River(shore + 8, waterB + 20, u + 7, sx - 200, {});
    // incoming shells: splashes on the river
    [[.8, .3, 260], [1.6, .55, 760], [2.5, .4, 1080], [3.4, .7, 460], [5.5, .62, 900], [6.6, .45, 620]].forEach(function (sp, i) { const y = shore + 20 + sp[1] * (waterB - shore - 20); ddpGeyser(sp[2], y, .5 + sp[1] * .9, u - sp[0], i * 5); });
    // near bank: allied line
    const nb = ctx.createLinearGradient(0, waterB, 0, hv); nb.addColorStop(0, '#24221a'); nb.addColorStop(1, '#0a0a07'); ctx.fillStyle = nb; ctx.beginPath(); ctx.moveTo(-600, hv + 200); ctx.lineTo(-600, waterB + 12); for (let x = -600; x <= 2400; x += 40) ctx.lineTo(x, waterB + 8 + Math.sin(x * .013) * 8); ctx.lineTo(2400, hv + 200); ctx.fill();
    ddpM3Reeds(waterB + 14, u, 30, 70, 4);
    ddpSherman(190, hv * .9, 1.3, u, { gun: .03, move: 0, haze: 0, wet: .4 });
    ddpM3Sandbags(560, 1700, hv * .93, 3, 1.3);
    [[700, 0], [930, 1], [1180, 2], [1420, 3]].forEach(function (g) { ddpBack(g[0], hv * .8 - (g[1] % 2) * 10, 2.8, u, { ph: g[1], rim: .15, turn: (g[1] - 1.5) * .15 }); });
    // shell lands on the near bank
    if (hd >= 0) { ddpBlast(1260, waterB + 60, 1.7, hd, 9, .55); if (hd < .12) ddpFlashGlow(1260, waterB + 40, 180, .5 * (1 - hd / .12)); }
    ddpM3Rain(u + 7, hv, 560, .24);
    if (lt > 0) { ctx.fillStyle = 'rgba(190,205,255,' + lt * .2 + ')'; ctx.fillRect(-600, -400, 2800, hv + 800); }
    ctx.restore();
    ddpBloom(w, h);
    return hd >= 0 && hd < .1 ? .5 : 0;
}

/* ---------- SHOT 3 extras : lamp-lit map, the officer's pencil ---------- */
function ddpM3MapFx(u, w, h) {
    const zoom = 1.0 + u * .012, mx = w * .12, my = h * .1, mw = w * .76, mh = h * .76, bx = mx + mw * .5, by = my + mh * .5;
    ctx.save(); ctx.translate(w / 2, h / 2); ctx.scale(zoom, zoom); ctx.rotate(-.025); ctx.translate(-w / 2, -h / 2);
    // paper creases
    ctx.strokeStyle = 'rgba(80,60,30,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx + mw / 2, my); ctx.lineTo(mx + mw / 2, my + mh); ctx.moveTo(mx, my + mh / 2); ctx.lineTo(mx + mw, my + mh / 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,250,230,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(mx + mw / 2 + 2, my); ctx.lineTo(mx + mw / 2 + 2, my + mh); ctx.stroke();
    // coffee ring + tin mug
    ctx.strokeStyle = 'rgba(90,50,20,.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(mx + mw * .16, my + mh * .8, 34, 0, 7); ctx.stroke();
    // officer's hand with pencil tracing the circle around the bridge
    const cp = cs2C((u - 2.6) / 1.1, 0, 1), an = -Math.PI / 2 + cp * Math.PI * 2.1, rest = cs2C((u - 3.9) / .8, 0, 1), arrive = cs2E(cs2C((u - 1.6) / 1, 0, 1));
    let px = bx + Math.cos(an) * 96 * Math.cos(-.15) - Math.sin(an) * 64 * Math.sin(-.15), py = by + Math.cos(an) * 96 * Math.sin(-.15) + Math.sin(an) * 64 * Math.cos(-.15);
    const hx0 = w * .98, hy0 = h * 1.1; px = cs2L(hx0, px, arrive) + rest * 120; py = cs2L(hy0, py, arrive) + rest * 90;
    ctx.save(); ctx.translate(px, py);
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.moveTo(30, 40); ctx.lineTo(520, 380); ctx.lineTo(620, 300); ctx.lineTo(70, 6); ctx.fill();
    // sleeve + cuff
    ctx.fillStyle = '#4c4e32'; ctx.beginPath(); ctx.moveTo(60, 28); ctx.lineTo(560, 330); ctx.lineTo(660, 200); ctx.lineTo(120, -30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5c5e3c'; ctx.beginPath(); ctx.moveTo(60, 28); ctx.lineTo(120, -30); ctx.lineTo(132, -22); ctx.lineTo(72, 36); ctx.fill();
    // hand
    ctx.fillStyle = '#c4946c'; ctx.beginPath(); ctx.moveTo(8, 6); ctx.quadraticCurveTo(14, -18, 50, -24); ctx.quadraticCurveTo(96, -26, 112, -16); ctx.lineTo(70, 40); ctx.quadraticCurveTo(30, 40, 8, 6); ctx.fill();
    ctx.fillStyle = '#a9785a'; ctx.beginPath(); ctx.ellipse(36, 18, 22, 9, -.6, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,220,180,.4)'; ctx.beginPath(); ctx.ellipse(56, -16, 24, 5, -.2, 0, 7); ctx.fill();
    // pencil
    ctx.save(); ctx.rotate(-.75); ctx.fillStyle = '#d7a628'; ctx.fillRect(0, -4, 96, 8); ctx.fillStyle = '#e8c98a'; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(-16, 0); ctx.lineTo(0, 4); ctx.fill(); ctx.fillStyle = '#2a2014'; ctx.beginPath(); ctx.moveTo(-10, -1.5); ctx.lineTo(-16, 0); ctx.lineTo(-10, 1.5); ctx.fill(); ctx.fillStyle = '#9a8a70'; ctx.fillRect(96, -4, 8, 8); ctx.fillStyle = '#b84a4a'; ctx.fillRect(104, -4, 8, 8); ctx.restore();
    // thumb over pencil
    ctx.fillStyle = '#c99a72'; ctx.beginPath(); ctx.ellipse(18, -10, 18, 8, -.7, 0, 7); ctx.fill();
    ctx.restore();
    ctx.restore();
    // rain running down the window, its shadow over the table
    ctx.save(); ctx.globalAlpha = .16; ctx.fillStyle = '#000'; for (let i = 0; i < 40; i++) { const x = ddpR(i) * w, y = ((ddpR(i + 3) * h + u * (40 + ddpR(i) * 80)) % (h + 80)) - 40; ctx.fillRect(x, y, 2, 30 + ddpR(i + 7) * 40); } ctx.restore();
    // window-frame shadow + lamp flicker
    ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(w * .62, 0, 26, h); ctx.fillRect(0, h * .3, w, 20); ctx.restore();
    const fl = .06 + Math.sin(u * 23) * .02 + Math.sin(u * 7) * .02; ctx.fillStyle = 'rgba(255,190,110,' + fl + ')'; ctx.fillRect(0, 0, w, h);
}

/* ---------- SHOT 4 background : Shermans rolling onto the bridge ---------- */
function ddpM3Scene4(t0, u, w, h) {
    const U = w / 1600, hv = h / U, P = ddpEnsure(); const lt = ddpM3Lightning(u, [1.8]);
    ctx.save(); ctx.scale(U, U);
    const hz = hv * .42, deckY = hv * .52, baseY = hv * .74, sx = 1260;
    ddpSky(hz, t0, 0, sx, .8, 0, DDP_M3PAL); ddpM3Storm(hz, t0, 0, lt); if (lt > 0) ddpBolt(1150, hz - 640, hz - 40, 33, lt);
    ddpM3FarBank(hz, t0, 0, { flashes: [] });
    for (let i = 0; i < 6; i++) { const f = (u * .9 + i * .43) % 1.7; if (f < .12) ddpFlashGlow(160 + i * 240, hz - 4, 70, 1 - f / .12); }
    ddpM3River(hz + 30, hv + 60, t0, sx - 100, {});
    const bridge = function () { ddpM3Bridge(-200, 1900, deckY, baseY, t0, { arches: 4, lamps: [480, 1040, 1600] }); };
    ddpM3Reflect(baseY + 30, bridge, .24); ctx.fillStyle = 'rgba(16,18,24,.35)'; ctx.fillRect(-600, baseY + 30, 2800, 300);
    ddpM3Bridge(-200, 1900, deckY, baseY, t0, { arches: 4, noParapet: true });
    for (let i = 0; i < 4; i++) { const go = cs2C((u - 2.2) / 2.2, 0, 1), x = 860 + i * 300 - go * go * 120; ddpSherman(x, deckY - 2, .62, t0 + i * .3, { gun: .02, move: go > 0 && go < 1 ? 1 : .2, haze: .1, exhaust: true }); }
    ddpM3Bridge(-200, 1900, deckY, baseY, t0, { arches: 4, parapetOnly: true, lamps: [480, 1040, 1600] });
    ddpM3Rain(t0, hv, 480, .22);
    if (lt > 0) { ctx.fillStyle = 'rgba(190,205,255,' + lt * .2 + ')'; ctx.fillRect(-600, -400, 2800, hv + 800); }
    ctx.restore();
    return 0;
}
