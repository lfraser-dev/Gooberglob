/* =====================================================
   3D SKIRMISH: bigger battlefields, tank-like AI driving, real-life speeds.
   Only active in 3D Skirmish; 2D Skirmish is untouched.
   - The battlefield grows to 4800 x 3000 game pixels (480 x 300 m) and a fresh layout is generated
     for each battle: city blocks, snowy forests and villages, bocage fields, a full trench front.
   - The AI still decides where to go (so it keeps its tactics), but its tank now drives like a tank:
     the hull turns at a limited rate, it moves along the hull (reversing when it backs off), and its
     intentions are smoothed so it no longer twitches between decisions.
   - Speeds: about 55% of the 2D speeds (a medium tank does ~28 km/h), slower hull turning, real turret traverse.
===================================================== */
const SK3W = { W: 4800, H: 3000, speedK: .55, gen: null, on: false };
function sk3Big() { return !!(SK3D.want && selectedGameMode === 'skirmish' && window.THREE && !(typeof DUEL !== 'undefined' && DUEL.active)); }
function sk3Rng(seed) { let s = (seed >>> 0) || 1; return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
function sk3Hit(r, list, pad) { pad = pad || 0; return list.some(function (o) { return r.x < o.x + o.width + pad && r.x + r.width + pad > o.x && r.y < o.y + o.height + pad && r.y + r.height + pad > o.y; }); }
function sk3Ob(x, y, w, h, type) { addObstacle(Math.round(x), Math.round(y), Math.round(w), Math.round(h), type); return obstacles[obstacles.length - 1]; }
const SK3_SOLID = ['sk3Forest', 'sk3Sandbag', 'sk3Fountain', 'sk3Church'];

/* ---------- TOWN: city blocks of houses, shops and ruins on a grid of avenues, a central square ---------- */
function sk3GenTown(R) { const W = SK3W.W, H = SK3W.H, g = { roads: [], blocks: [], parks: [], plaza: null };
    const cols = []; let x = 260; while (x < W - 560) { let w = 470 + R() * 210; if (x + w > W - 260) w = W - 260 - x; if (w < 300) break; cols.push([x, x + w]); x += w + 140 + R() * 50; }
    const rows = []; let y = 140; while (y < H - 440) { let h = 400 + R() * 150; if (y + h > H - 140) h = H - 140 - y; if (h < 300) break; rows.push([y, y + h]); y += h + 140 + R() * 40; }
    const xe = [0].concat(cols.reduce(function (a, c) { return a.concat(c); }, [])).concat([W]), ye = [0].concat(rows.reduce(function (a, r) { return a.concat(r); }, [])).concat([H]);
    for (let i = 0; i < xe.length; i += 2) g.roads.push({ x: xe[i], y: 0, w: xe[i + 1] - xe[i], h: H, v: 1 });
    for (let i = 0; i < ye.length; i += 2) g.roads.push({ x: 0, y: ye[i], w: W, h: ye[i + 1] - ye[i], v: 0 });
    const pc = cols.length >> 1, pr = rows.length >> 1;
    cols.forEach(function (c, i) { rows.forEach(function (r, j) { const b = { x0: c[0], y0: r[0], x1: c[1], y1: r[1] }; g.blocks.push(b); const bw = b.x1 - b.x0, bh = b.y1 - b.y0, cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
        if (i === pc && j === pr) { g.plaza = b; b.plaza = true; sk3Ob(cx - 150, cy - 110, 300, 200, 'townhall'); sk3Ob(b.x0 + 30, b.y0 + 30, 70, 100, 'civic'); sk3Ob(b.x1 - 100, b.y0 + 30, 70, 100, 'civic'); sk3Ob(b.x0 + 30, b.y1 - 130, 70, 100, 'civic'); sk3Ob(b.x1 - 100, b.y1 - 130, 70, 100, 'civic'); sk3Ob(cx - 30, b.y1 - 70, 60, 60, 'sk3Fountain'); return; }
        if (R() < .07) { g.parks.push(b); b.park = true; for (let k = 0; k < 10; k++) sk3Ob(b.x0 + 40 + R() * (bw - 80), b.y0 + 40 + R() * (bh - 80), 1, 1, 'bocageTree'); return; }
        // a church on one block
        if (!g.church && i === Math.max(0, pc - 2) && j === Math.min(rows.length - 1, pr + 1)) { g.church = true; sk3Ob(cx - 160, cy - 70, 320, 140, 'sk3Church'); return; }
        const lane = R() < .38 ? (bw > bh ? 'v' : 'h') : null, subs = [];
        if (lane === 'v') { const m = cx + (R() - .5) * bw * .2; subs.push([b.x0, b.y0, m - 55, b.y1], [m + 55, b.y0, b.x1, b.y1]); } else if (lane === 'h') { const m = cy + (R() - .5) * bh * .2; subs.push([b.x0, b.y0, b.x1, m - 55], [b.x0, m + 55, b.x1, b.y1]); } else subs.push([b.x0, b.y0, b.x1, b.y1]);
        subs.forEach(function (s) { const sw = s[2] - s[0], sh = s[3] - s[1], nx = Math.max(1, Math.round(sw / 200)), ny = sh > 360 ? 2 : 1;
            for (let a = 0; a < nx; a++) for (let k = 0; k < ny; k++) { const lx = s[0] + a * sw / nx, ly = s[1] + k * sh / ny, lw = sw / nx, lh = sh / ny, edge = k === 0 || k === ny - 1, rr = R();
                const t = rr < .14 ? 'ruinBuilding' : (rr < .32 && edge) ? 'shop' : rr < .37 ? null : 'building'; if (!t) continue;
                const ix = 6 + R() * 10, iy = 6 + R() * 10; sk3Ob(lx + ix, ly + iy, lw - ix * 2, lh - iy * 2, t); } }); }); });
    // burnt-out wrecks and sandbag barricades tucked against the kerbs (they never close a street)
    let n = 0; for (let tries = 0; n < 18 && tries < 400; tries++) { const b = g.blocks[(R() * g.blocks.length) | 0]; if (b.plaza) continue; const side = R() * 4 | 0, horiz = side < 2, len = 70, th = 32;
        const r = horiz ? { x: b.x0 + R() * (b.x1 - b.x0 - len), y: side ? b.y1 + 6 : b.y0 - 6 - th, width: len, height: th } : { x: side === 2 ? b.x1 + 6 : b.x0 - 6 - th, y: b.y0 + R() * (b.y1 - b.y0 - len), width: th, height: len };
        if (r.x < 320 || r.x > W - 390 || sk3Hit(r, obstacles, 30)) continue; sk3Ob(r.x, r.y, r.width, r.height, R() < .65 ? 'wreck' : 'sk3Sandbag'); n++; }
    return g; }

/* ---------- SNOW: villages, pine forests, frozen ponds, rocks and a winding road ---------- */
function sk3GenSnow(R) { const W = SK3W.W, H = SK3W.H, g = { forests: [], ponds: [], paths: [], villages: [] };
    const vil = [[W * .3, H * (.3 + R() * .4)], [W * .52, H * (.25 + R() * .5)], [W * .72, H * (.3 + R() * .4)]];
    vil.forEach(function (c) { g.villages.push(c); let k = 0; for (let tries = 0; k < 8 && tries < 200; tries++) { const a = R() * 6.28, d = 60 + R() * 320, w = 110 + R() * 50, h = 70 + R() * 14, r = { x: c[0] + Math.cos(a) * d - w / 2, y: c[1] + Math.sin(a) * d * .8 - h / 2, width: w, height: h }; if (r.y < 60 || r.y + h > H - 60 || sk3Hit(r, obstacles, 70)) continue; sk3Ob(r.x, r.y, w, h, 'snowCabin'); k++; } });
    sk3Ob(W * .14, H - 230, 155, 92, 'santaHut');
    // the road runs through every village
    const pts = [[0, H * (.35 + R() * .3)]].concat(vil.slice().sort(function (a, b) { return a[0] - b[0]; })).concat([[W, H * (.35 + R() * .3)]]); g.paths.push({ pts: pts, w: 70 });
    const nearRoad = function (r, pad) { for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; for (let u = 0; u <= 1; u += .04) { const px = a[0] + (b[0] - a[0]) * u, py = a[1] + (b[1] - a[1]) * u; if (px > r.x - pad && px < r.x + r.width + pad && py > r.y - pad && py < r.y + r.height + pad) return true; } } return false; };
    for (let tries = 0; g.forests.length < 24 && tries < 900; tries++) { const w = 220 + R() * 380, h = 180 + R() * 320, r = { x: 400 + R() * (W - 800 - w), y: 70 + R() * (H - 140 - h), width: w, height: h };
        if (sk3Hit(r, obstacles, 170) || nearRoad(r, 90) || vil.some(function (c) { return Math.hypot(c[0] - r.x - w / 2, c[1] - r.y - h / 2) < 470; })) continue; g.forests.push(sk3Ob(r.x, r.y, w, h, 'sk3Forest')); }
    for (let tries = 0; g.ponds.length < 2 && tries < 300; tries++) { const w = 300 + R() * 160, h = 190 + R() * 110, r = { x: 500 + R() * (W - 1000 - w), y: 100 + R() * (H - 200 - h), width: w, height: h }; if (sk3Hit(r, obstacles, 60) || nearRoad(r, 50)) continue; g.ponds.push(sk3Ob(r.x, r.y, w, h, 'sk3Pond')); }
    let n = 0; for (let tries = 0; n < 75 && tries < 1500; tries++) { const w = 55 + R() * 60, h = 40 + R() * 30, r = { x: 380 + R() * (W - 760), y: 40 + R() * (H - 80), width: w, height: h }; if (sk3Hit(r, obstacles, 45) || nearRoad(r, 40)) continue; sk3Ob(r.x, r.y, w, h, 'rock'); n++; }
    return g; }

/* ---------- BOCAGE: small fields walled by thick hedgerows with gaps, farms, orchards ---------- */
function sk3GenBocage(R) { const W = SK3W.W, H = SK3W.H, g = { fields: [] }, crops = ['pasture', 'pasture', 'meadow', 'wheat', 'ploughed', 'hay'];
    const xs = [330]; while (xs[xs.length - 1] < W - 330 - 380) xs.push(Math.min(W - 330, xs[xs.length - 1] + 400 + R() * 160)); if (xs[xs.length - 1] < W - 330) xs.push(W - 330);
    const ys = [0]; while (ys[ys.length - 1] < H - 360) ys.push(Math.min(H, ys[ys.length - 1] + 340 + R() * 140)); if (ys[ys.length - 1] < H) ys.push(H);
    for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) g.fields.push({ x0: xs[i], y0: ys[j], x1: xs[i + 1], y1: ys[j + 1], crop: crops[(R() * crops.length) | 0] });
    const hedge = function (x0, y0, x1, y1) { const vert = x0 === x1, L = vert ? y1 - y0 : x1 - x0; if (R() < .12 || L < 120) return; const gap = 140 + R() * 40, gp = 40 + R() * Math.max(1, L - gap - 80), T = 22;
        const piece = function (a, b) { if (b - a < 30) return; if (vert) sk3Ob(x0 - T / 2, y0 + a, T, b - a, 'hedgerow'); else sk3Ob(x0 + a, y0 - T / 2, b - a, T, 'hedgerow'); };
        piece(0, gp); piece(gp + gap, L); };
    for (let i = 0; i < xs.length; i++) for (let j = 0; j < ys.length - 1; j++) hedge(xs[i], ys[j], xs[i], ys[j + 1]);
    for (let j = 1; j < ys.length - 1; j++) for (let i = 0; i < xs.length - 1; i++) hedge(xs[i], ys[j], xs[i + 1], ys[j]);
    const inner = g.fields.filter(function (f) { return f.x0 > 330 && f.x1 < W - 330 && f.y0 > 0 && f.y1 < H; });
    for (let k = 0; k < 6 && inner.length; k++) { const f = inner.splice((R() * inner.length) | 0, 1)[0]; f.crop = 'yard'; const cx = (f.x0 + f.x1) / 2, cy = (f.y0 + f.y1) / 2;
        sk3Ob(cx - 140, cy - 90, 120, 78, 'farm'); sk3Ob(cx + 20, cy - 10, 150, 90, 'farm'); sk3Ob(cx - 120, cy + 40, 105, 70, 'bocageHut'); }
    for (let k = 0; k < 5 && inner.length; k++) { const f = inner.splice((R() * inner.length) | 0, 1)[0]; f.crop = 'orchard'; for (let x = f.x0 + 60; x < f.x1 - 40; x += 70) for (let y = f.y0 + 60; y < f.y1 - 40; y += 70) sk3Ob(x + (R() - .5) * 12, y + (R() - .5) * 12, 1, 1, 'bocageTree'); }
    for (let k = 0; k < 60; k++) { const f = g.fields[(R() * g.fields.length) | 0]; if (f.crop === 'orchard' || f.crop === 'yard') continue; sk3Ob(f.x0 + 40 + R() * (f.x1 - f.x0 - 80), f.y0 + 40 + R() * (f.y1 - f.y0 - 80), 1, 1, R() < .8 ? 'bocageTree' : 'bocageRock'); }
    return g; }

/* ---------- TRENCHES: two zig-zag trench lines with bunkers and wire, a ruined village in no-man's-land ---------- */
function sk3GenTrenches(R) { const W = SK3W.W, H = SK3W.H, g = { lines: [] };
    [720, W - 720].forEach(function (bx, side) { const dir = side ? 1 : -1, line = []; let y = 90, off = 0;
        while (y < H - 90) { const len = 240 + R() * 120, nx = bx + off; if (R() < .16) { y += 150; off = -off; continue; } sk3Ob(nx - 30, y, 60, Math.min(len, H - 90 - y), 'trench'); line.push([nx, y, y + len]);
            const no = off === 0 ? 70 : -off; sk3Ob(Math.min(nx, bx + no) - 30, y + len - 30, Math.abs(bx + no - nx) + 60, 60, 'trench'); off = no; y += len; }
        g.lines.push(line);
        for (let yy = 220 + R() * 100; yy < H - 200; yy += 380 + R() * 140) sk3Ob(bx + dir * 190 - 60, yy, 120, 72, 'bunker');
        for (let yy = 80; yy < H - 260; yy += 230 + R() * 60) if (R() < .82) sk3Ob(bx - dir * 210 - 12, yy, 24, 160 + R() * 40, 'wire');
        for (let k = 0; k < 7; k++) { const yy = 200 + R() * (H - 400); sk3Ob(bx - dir * (330 + R() * 120) - 60, yy, 120, 24, 'sk3Sandbag'); } });
    const cx = W / 2, cy = H * (.35 + R() * .3); let k = 0; for (let tries = 0; k < 9 && tries < 300; tries++) { const w = 120 + R() * 110, h = 100 + R() * 90, r = { x: cx - 520 + R() * 1040 - w / 2, y: cy - 420 + R() * 840 - h / 2, width: w, height: h }; if (sk3Hit(r, obstacles, 70)) continue; sk3Ob(r.x, r.y, w, h, 'ruinBuilding'); k++; }
    const ch = { x: cx - 140, y: cy - 60, width: 280, height: 120 }; if (!sk3Hit(ch, obstacles, 40)) sk3Ob(ch.x, ch.y, ch.width, ch.height, 'sk3Church');
    let c = 0; for (let tries = 0; c < 150 && tries < 3000; tries++) { const w = 60 + R() * 80, h = w * (.45 + R() * .2), x = 900 + R() * (W - 1800), y = 60 + R() * (H - 120); if (sk3Hit({ x: x, y: y, width: w, height: h }, obstacles.filter(function (o) { return o.type !== 'crater'; }), 30)) continue; sk3Ob(x, y, w, h, 'crater'); c++; }
    for (let s = 0; s < 90; s++) { const x = 850 + R() * (W - 1700), y = 40 + R() * (H - 80); if (!sk3Hit({ x: x, y: y, width: 1, height: 1 }, obstacles, 20)) sk3Ob(x, y, 1, 1, 'sk3Stump'); }
    return g; }

function sk3Gen(map) { const seed = (Math.random() * 1e9) | 0, R = sk3Rng(seed); obstacles = []; let g;
    if (map === 'snow') g = sk3GenSnow(R); else if (map === 'bocage') g = sk3GenBocage(R); else if (map === 'trenches') g = sk3GenTrenches(R); else g = sk3GenTown(R);
    g.seed = seed; g.map = map; return g; }

/* ---------- placing the two teams: you + allies on the left, the enemy on the right ---------- */
function sk3Place(t, right, k, placed) { const W = SK3W.W, H = SK3W.H, size = t.size || 26, bx = right ? W - 150 : 150, rows = [0, -1, 1, -2, 2, -3, 3, -4, 4], dir = right ? -1 : 1;
    const ok = function (x, y) { if (x < size + 20 || x > W - size - 20 || y < size + 20 || y > H - size - 20) return false; if (tankHitsObstacle({ x: x, y: y, size: size }, x, y)) return false; return !placed.some(function (p) { return Math.hypot(p.x - x, p.y - y) < p.size + size + 70; }); };
    // how far the tank can see / drive straight ahead towards the enemy from here (so nobody starts nose-first against a wall)
    const clear = function (x, y) { let d = 0; for (; d < 700; d += 35) if (tankHitsObstacle({ x: x + dir * d, y: y, size: size }, x + dir * d, y)) break; return d; };
    const want = H / 2 + rows[k % rows.length] * 150; let best = null, bestS = -1e9, found = 0;
    for (let r = 0; r < 1500 && !(r > 700 && found >= 36); r += 25) for (let q = 0; q < 16; q++) { const a = q / 16 * Math.PI * 2, x = bx + Math.cos(a) * r * .35 + dir * (k >= rows.length ? 110 : 0), y = want + Math.sin(a) * r; if (!ok(x, y)) continue; found++; const sc = clear(x, y) - r * .35; if (sc > bestS) { bestS = sc; best = [x, y]; } }
    if (!best) return; t.x = best[0]; t.y = best[1]; t.angle = right ? Math.PI : 0; t.turretAngle = t.angle; t.skHull = t.angle; placed.push(t); }
function sk3Populate() { // a bigger field needs a few more tanks: 8 enemies and 6 allies + you
    const e0 = enemies.slice(); createEnemies(); const e1 = enemies.slice(0, 3); enemies = e0.concat(e1);
    const a0 = allies.slice(); createAllies(); const a1 = allies.slice(0, 2); allies = a0.concat(a1);
    const placed = []; sk3Place(player, false, 0, placed); allies.forEach(function (a, i) { sk3Place(a, false, i + 1, placed); }); enemies.forEach(function (e, i) { sk3Place(e, true, i, placed); });
    try { updateUI(); } catch (e) {} try { updateCamera(); } catch (e) {} }

/* ---------- smooth, tank-like AI driving ---------- */
function sk3Wrap(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
function sk3HullRate(t) { const c = String(t.className || '').toUpperCase(); return c === 'HEAVY' ? .0085 : c === 'LIGHT' ? .0135 : .0105; } // radians per step (60 steps a second)
function sk3TurretRate(t) { const c = String(t.className || '').toUpperCase(); return c === 'HEAVY' ? .55 : c === 'LIGHT' ? 1.05 : .78; }    // radians per second
function sk3AiPre(list) { list.forEach(function (t) { if (!t || t.destroyed) return; t.skPX = t.x; t.skPY = t.y; if (t.skHull == null) t.skHull = t.angle || 0; }); }
function sk3AiPost(list) { const all = [player].concat(allies || [], enemies || []);
    list.forEach(function (t) { if (!t || t.destroyed || t.skPX == null) return; const dx = t.x - t.skPX, dy = t.y - t.skPY, raw = Math.hypot(dx, dy); t.x = t.skPX; t.y = t.skPY;
        // smooth what the AI wants (it changes its mind every second or so)
        const k = .06; t.skWx = (t.skWx || 0) * (1 - k) + dx * k; t.skWy = (t.skWy || 0) * (1 - k) + dy * k; const want = Math.hypot(t.skWx, t.skWy), cap = getTankSpeed(t);
        let hull = t.skHull, v = 0;
        if (want > .06 && raw < 40) { const hd = Math.atan2(t.skWy, t.skWx); let d = sk3Wrap(hd - hull);
            if (!t.skRev && Math.cos(d) < -.55 && want < cap * .9) t.skRev = true; else if (t.skRev && Math.cos(d) > -.1) t.skRev = false; // back off in reverse instead of spinning round
            if (t.skRev) d = sk3Wrap(hd + Math.PI - hull);
            const rate = sk3HullRate(t); hull = sk3Wrap(hull + Math.max(-rate, Math.min(rate, d)));
            const al = Math.cos(d), f = Math.abs(d) < 1.25 ? Math.max(.32, al) : .14; v = Math.min(cap, want * 1.15) * f * (t.skRev ? -.6 : 1); }
        t.skV = (t.skV || 0) + Math.max(-.05, Math.min(.035, v - (t.skV || 0))); // gentle acceleration / braking
        const mx = Math.cos(hull) * t.skV, my = Math.sin(hull) * t.skV; let moved = 0;
        if (!tankHitsObstacle(t, t.x + mx, t.y)) { t.x += mx; moved += Math.abs(mx); } if (!tankHitsObstacle(t, t.x, t.y + my)) { t.y += my; moved += Math.abs(my); }
        // properly stuck against something? let the AI's own move through for a moment so it can work itself free
        if (want > .35 && moved < .05) t.skStuck = (t.skStuck || 0) + 1; else t.skStuck = Math.max(0, (t.skStuck || 0) - 2);
        if (t.skStuck > 70 && raw < 40) { t.x = t.skPX + dx; t.y = t.skPY + dy; if (raw > .2) hull = sk3Wrap(hull + Math.max(-.05, Math.min(.05, sk3Wrap(Math.atan2(dy, dx) - hull)))); if (t.skStuck > 130) t.skStuck = 0; }
        t.x = Math.max(t.size + 6, Math.min(canvas.width - t.size - 6, t.x)); t.y = Math.max(t.size + 6, Math.min(canvas.height - t.size - 6, t.y));
        try { separateTankFromOthers(t, all); } catch (e) {}
        t.skHull = hull; t.angle = hull; }); }

/* ---------- fast collision: only test the obstacles near a tank ----------
   tankHitsObstacle loops over every obstacle and the AI calls it many times per tank per step; with a few hundred
   obstacles on the big maps that slowed the whole battle. Solid obstacles are bucketed into 160 px cells and the game's
   own collision test is run on just the nearby ones. */
const SK3G = { key: null, cell: 160, cols: 0, b: null };
function sk3Grid() { const k = obstacles; if (SK3G.key === k && SK3G.n === k.length) return SK3G; const C = SK3G.cell, cols = Math.ceil(canvas.width / C) + 1, rows = Math.ceil(canvas.height / C) + 1, b = new Array(cols * rows); const pad = 90;
    k.forEach(function (o) { if (!(isSolidObstacle(o) || o.type === 'campaignHillBarrier')) return; const x0 = Math.max(0, Math.floor((o.x - pad) / C)), x1 = Math.min(cols - 1, Math.floor((o.x + o.width + pad) / C)), y0 = Math.max(0, Math.floor((o.y - pad) / C)), y1 = Math.min(rows - 1, Math.floor((o.y + o.height + pad) / C)); for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) (b[j * cols + i] = b[j * cols + i] || []).push(o); });
    SK3G.key = k; SK3G.n = k.length; SK3G.cols = cols; SK3G.rows = rows; SK3G.b = b; SK3G.none = []; return SK3G; }

/* ---------- hooks ---------- */
(function () {
    // bigger battlefield + generated layout (3D Skirmish only)
    const _ap = applyPointControlCanvasSize; applyPointControlCanvasSize = function () { const r = _ap.apply(this, arguments); SK3W.on = sk3Big(); if (SK3W.on) { SKIRMISH_WORLD_WIDTH = SK3W.W; SKIRMISH_WORLD_HEIGHT = SK3W.H; canvas.width = SK3W.W; canvas.height = SK3W.H; } else { SK3W.gen = null; } return r; };
    const _cm = createMap; createMap = function () { if (!SK3W.on || !sk3Big()) { SK3W.gen = null; return _cm.apply(this, arguments); } SK3W.gen = sk3Gen(selectedMap); };
    const _cb = createBattle; createBattle = function () { const r = _cb.apply(this, arguments); if (SK3W.on && SK3W.gen && selectedGameMode === 'skirmish') try { sk3Populate(); } catch (e) { try { console.warn('3D skirmish populate', e); } catch (x) {} } return r; };
    const _so = isSolidObstacle; isSolidObstacle = function (o) { return (o && SK3_SOLID.indexOf(o.type) >= 0) || _so.apply(this, arguments); };
    const _th = tankHitsObstacle; tankHitsObstacle = function (t, x, y) { if (!SK3W.on || selectedGameMode !== 'skirmish') return _th.apply(this, arguments); const G = sk3Grid(), i = Math.floor(x / G.cell), j = Math.floor(y / G.cell);
        const near = i < 0 || j < 0 || i >= G.cols || j >= G.rows ? G.none : (G.b[j * G.cols + i] || G.none), all = obstacles; obstacles = near; try { return _th.apply(this, arguments); } finally { obstacles = all; } };
    // real-life speeds
    const _ts = getTankSpeed; getTankSpeed = function (t) { const v = _ts.apply(this, arguments); return SK3D.on ? v * SK3W.speedK : v; };
    const _tr = getTurretTurnRate; getTurretTurnRate = function (t) { return SK3D.on ? sk3TurretRate(t) : _tr.apply(this, arguments); };
    // the AI drives like a tank
    const _ue = updateEnemies; updateEnemies = function () { if (!SK3D.on) return _ue.apply(this, arguments); sk3AiPre(enemies); const r = _ue.apply(this, arguments); sk3AiPost(enemies); return r; };
    const _ua = updateAllies; updateAllies = function () { if (!SK3D.on) return _ua.apply(this, arguments); sk3AiPre(allies); const r = _ua.apply(this, arguments); sk3AiPost(allies); return r; };
})();
