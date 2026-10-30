/* ===== DDP BEGIN (painted 2D D-Day cinematic) ===== */
const DDP = { P: null, q: 2, ema: 0, last: 0, cool: 0 };
function ddpCv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function ddpR(n) { return cs2R(n + 91.7); }
function ddpPuff(rgb) { const c = ddpCv(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(' + rgb + ',1)'); gr.addColorStop(.45, 'rgba(' + rgb + ',.55)'); gr.addColorStop(1, 'rgba(' + rgb + ',0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c; }
function ddpBuild() {
    const P = {};
    P.dark = ddpPuff('18,16,15'); P.smoke = ddpPuff('52,49,45'); P.grey = ddpPuff('142,140,134'); P.white = ddpPuff('240,240,234'); P.fire = ddpPuff('255,148,48'); P.dust = ddpPuff('170,146,106'); P.warm = ddpPuff('255,196,120');
    // overcast cloud tiles (tileable horizontally)
    function cloudTile(seed, n, ymin, ymax, rmin, rmax, aMul, dk) {
        const c = ddpCv(1600, 360), g = c.getContext('2d');
        for (let i = 0; i < n; i++) {
            const x = ddpR(seed + i * 3.1) * 1600, y = ymin + ddpR(seed + i * 7.7) * (ymax - ymin), r = rmin + ddpR(seed + i * 5.3) * (rmax - rmin), a = (.08 + ddpR(seed + i * 2.2) * .22) * aMul;
            const pick = ddpR(seed + i * 1.7); const tex = pick < dk ? P.smoke : (pick < .75 ? P.grey : P.white);
            for (const dx of [-1600, 0, 1600]) { g.globalAlpha = a; g.drawImage(tex, x + dx - r * 1.4, y - r * .45, r * 2.8, r * .9); }
        }
        return c;
    }
    P.cloudA = cloudTile(1, 150, 120, 340, 60, 190, 1, .35);
    P.cloudB = cloudTile(40, 90, 40, 220, 90, 260, .8, .5);
    // light shafts
    const S = 512, rc = ddpCv(S, S), rg = rc.getContext('2d'); rg.translate(S / 2, S / 2);
    for (let i = 0; i < 40; i++) {
        const a = ddpR(i * 2.3) * Math.PI * 2, wd = .012 + ddpR(i + 7) * .05, al = .05 + ddpR(i + 3) * .14, R = S / 2;
        const x1 = Math.cos(a - wd) * R, y1 = Math.sin(a - wd) * R, x2 = Math.cos(a + wd) * R, y2 = Math.sin(a + wd) * R;
        const lg = rg.createLinearGradient(0, 0, Math.cos(a) * R, Math.sin(a) * R); lg.addColorStop(0, 'rgba(255,214,150,' + al + ')'); lg.addColorStop(1, 'rgba(255,214,150,0)');
        rg.fillStyle = lg; rg.beginPath(); rg.moveTo(0, 0); rg.lineTo(x1, y1); rg.lineTo(x2, y2); rg.closePath(); rg.fill();
    }
    P.rays = rc;
    // wet-steel scratches texture for boats / bunker
    const sc = ddpCv(256, 128), sg = sc.getContext('2d');
    for (let i = 0; i < 260; i++) { sg.strokeStyle = 'rgba(' + (ddpR(i) < .5 ? '255,255,255' : '0,0,0') + ',' + (.03 + ddpR(i + 1) * .07) + ')'; sg.lineWidth = .6 + ddpR(i + 2); const x = ddpR(i + 3) * 256, y = ddpR(i + 4) * 128; sg.beginPath(); sg.moveTo(x, y); sg.lineTo(x + (ddpR(i + 5) - .5) * 60, y + (ddpR(i + 6) - .5) * 4); sg.stroke(); }
    P.scratch = sc;
    // film dust specks
    DDP.P = P;
}
function ddpEnsure() { if (!DDP.P) ddpBuild(); return DDP.P; }
function ddpMix(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
function ddpRGB(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (a === undefined ? 1 : a) + ')'; }

/* ---------- sky & sea ---------- */
function ddpSky(hz, t, pan, sx, heat, dim, pal) {
    const P = ddpEnsure(), top = pal ? pal.top : ddpMix([58, 72, 84], [38, 44, 50], dim || 0), mid = pal ? pal.mid : ddpMix([132, 148, 152], [96, 100, 100], dim || 0);
    const g = ctx.createLinearGradient(0, hz - 760, 0, hz); g.addColorStop(0, ddpRGB(top)); g.addColorStop(.55, ddpRGB(mid)); g.addColorStop(.86, pal ? ddpRGB(pal.low) : 'rgb(212,196,164)'); g.addColorStop(1, pal ? ddpRGB(pal.hor) : 'rgb(236,208,160)');
    ctx.fillStyle = g; ctx.fillRect(-600, hz - 900, 2800, 900 + 4);
    // sun bleed
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const sy = hz - 70, sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 640); sg.addColorStop(0, 'rgba(255,214,150,.78)'); sg.addColorStop(.18, 'rgba(255,170,100,.34)'); sg.addColorStop(.6, 'rgba(255,130,70,.08)'); sg.addColorStop(1, 'rgba(255,120,60,0)'); ctx.fillStyle = sg; ctx.fillRect(sx - 700, sy - 700, 1400, 1400);
    ctx.restore();
    if (pal && pal.streaks) { ctx.save(); for (let i = 0; i < 9; i++) { const yy = hz - 60 - i * 62 + Math.sin(i * 2.1) * 12, wd = 700 + ddpR(i * 3) * 900, xx = ((ddpR(i * 7) * 2600 + t * (4 + i) - pan * (.05 + i * .01)) % 2900) - 700, a2 = .22 + .12 * ddpR(i + 5), warm = i < 4; ctx.globalAlpha = a2; ctx.drawImage(warm ? P.warm : P.grey, xx - wd / 2, yy - 20, wd, 56); ctx.globalAlpha = a2 * .6; ctx.drawImage(P.dark, xx - wd * .3, yy + 10, wd * .6, 26); } ctx.restore(); } else {
    // cloud decks (parallax)
    const dA = ((pan * .06) % 1600 + 1600) % 1600, dB = ((pan * .14 + t * 3) % 1600 + 1600) % 1600;
    ctx.globalAlpha = .95; for (let x = -dB - 1600; x < 2400; x += 1600) ctx.drawImage(P.cloudB, x, hz - 560, 1600, 330);
    ctx.globalAlpha = 1; for (let x = -dA - 1600; x < 2400; x += 1600) ctx.drawImage(P.cloudA, x, hz - 400, 1600, 360);
    }
    // sun-lit underside of clouds
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const cg = ctx.createRadialGradient(sx, hz - 150, 0, sx, hz - 150, 520); cg.addColorStop(0, 'rgba(255,190,120,.30)'); cg.addColorStop(1, 'rgba(255,150,80,0)'); ctx.fillStyle = cg; ctx.fillRect(sx - 600, hz - 700, 1200, 700); ctx.restore();
    // shafts
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .28 + Math.sin(t * .4) * .05; ctx.translate(sx, hz - 90); ctx.rotate(Math.sin(t * .13) * .02); ctx.drawImage(P.rays, -820, -820, 1640, 1640); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const sd = ctx.createRadialGradient(sx, sy, 0, sx, sy, 60); sd.addColorStop(0, 'rgba(255,248,224,.95)'); sd.addColorStop(.25, 'rgba(255,226,170,.6)'); sd.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = sd; ctx.fillRect(sx - 70, sy - 70, 140, 140); ctx.restore();
    if (heat > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const hg = ctx.createLinearGradient(0, hz - 220, 0, hz); hg.addColorStop(0, 'rgba(255,110,40,0)'); hg.addColorStop(1, 'rgba(255,110,40,' + (.22 * heat) + ')'); ctx.fillStyle = hg; ctx.fillRect(-600, hz - 220, 2800, 224); ctx.restore(); }
}
function ddpSea(hz, bot, t, sx, amp, tone) {
    const g = ctx.createLinearGradient(0, hz, 0, bot);
    const c0 = ddpMix([176, 160, 128], [112, 118, 112], tone || 0), c1 = ddpMix([56, 70, 74], [40, 52, 56], tone || 0), c2 = ddpMix([14, 24, 28], [10, 18, 22], tone || 0);
    g.addColorStop(0, ddpRGB(c0)); g.addColorStop(.12, ddpRGB(c1)); g.addColorStop(1, ddpRGB(c2)); ctx.fillStyle = g; ctx.fillRect(-600, hz, 2800, bot - hz + 4);
    const N = [14, 28, 44][DDP.q], span = bot - hz;
    for (let i = 0; i < N; i++) {
        const u = i / N, y = hz + span * Math.pow(u, 1.75) + 3, ps = .1 + u * 1.5, step = 18 + ps * 26;
        ctx.beginPath();
        for (let x = -600; x <= 2200; x += step) { const yy = y + (Math.sin(x * .011 / (ps * .6 + .3) + t * (.7 + ps * .9) + i * 1.7) * 3.2 + Math.sin(x * .029 + t * 1.4 + i * 2.3) * 1.4) * ps * amp; if (x === -600) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); }
        ctx.strokeStyle = 'rgba(214,226,224,' + (.05 + .13 * ps) + ')'; ctx.lineWidth = .5 + ps * 1.5; ctx.stroke();
        ctx.beginPath();
        for (let x = -600; x <= 2200; x += step) { const yy = y + 2 + ps * 2.5 + (Math.sin(x * .011 / (ps * .6 + .3) + t * (.7 + ps * .9) + i * 1.7) * 3.2) * ps * amp; if (x === -600) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); }
        ctx.strokeStyle = 'rgba(8,16,20,' + (.10 + .14 * ps) + ')'; ctx.lineWidth = .8 + ps * 2; ctx.stroke();
    }
    // sun glitter path
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let j = 0, JN = [0, 150, 320][DDP.q]; j < JN; j++) {
        const u = Math.pow(ddpR(j * 1.3), 1.5), y = hz + 2 + u * span * .8, ps = .1 + u * 1.5, spread = 40 + u * 360, x = sx + (ddpR(j * 2.9) - .5) * spread * 2, fl = Math.max(0, Math.sin(t * (2 + ddpR(j) * 3) + j * 7.1));
        const a = (.1 + .5 * fl) * (1 - u * .6); ctx.fillStyle = 'rgba(255,226,170,' + a + ')'; const L = (6 + ps * 20) * (.5 + ddpR(j + 5)); ctx.fillRect(x - L / 2, y, L, .8 + ps * 1.4);
    }
    ctx.restore();
    const hg = ctx.createLinearGradient(0, hz - 10, 0, hz + 90); hg.addColorStop(0, 'rgba(226,206,170,.7)'); hg.addColorStop(1, 'rgba(226,206,170,0)'); ctx.fillStyle = hg; ctx.fillRect(-600, hz - 10, 2800, 100);
}

/* ---------- smoke / fire / splash ---------- */
function ddpSmoke(x, y, s, t, seed, drift, rise, dens) {
    const P = ddpEnsure(); dens = dens || 1;
    for (let i = 0; i < 22; i++) {
        const k = (t * .17 + i / 22 + seed * .137) % 1, r = (16 + k * 100) * s, px = x - k * drift * s + Math.sin(t * 1.1 + i * 1.3 + seed) * 6 * s, py = y - k * (rise || 260) * s, a = Math.pow(1 - k, 1.2) * Math.min(1, k * 10) * dens;
        ctx.globalAlpha = a * .85; ctx.drawImage(P.dark, px - r, py - r, r * 2, r * 2);
        ctx.globalAlpha = a * .5; ctx.drawImage(P.smoke, px - r * 1.1, py - r * 1.1 - r * .1, r * 2.2, r * 2.2);
        if (k < .55) { ctx.globalAlpha = a * .4 * (1 - k / .55); ctx.drawImage(P.fire, px - r * .6, py - r * .55 + r * .25, r * 1.2, r * 1.2); }
    }
    ctx.globalAlpha = 1;
}
function ddpFire(x, y, s, t, seed) {
    const P = ddpEnsure(); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) { const f = .65 + Math.sin(t * 9 + i * 2.1 + seed) * .25 + Math.sin(t * 17 + i) * .1, r = (22 + i * 5) * s * f; ctx.globalAlpha = .55; ctx.drawImage(P.fire, x + Math.sin(i * 3 + seed) * 8 * s - r, y - i * 8 * s - r, r * 2, r * 2); }
    ctx.globalAlpha = .35; const R = 150 * s; ctx.drawImage(P.warm, x - R, y - R * .6, R * 2, R * 1.4); ctx.restore(); ctx.globalAlpha = 1;
}
// k = seconds since the shell landed
function ddpGeyser(x, y, s, k, seed) {
    if (k < 0 || k > 2.6) return; const P = ddpEnsure();
    const rise = Math.min(1, k / .34), er = 1 - Math.pow(1 - rise, 2), fall = k > .75 ? Math.min(1, (k - .75) / 1.6) : 0, H = 190 * s * er * (1 - fall * .92), fade = Math.min(1, (2.6 - k) / .9);
    ctx.save(); ctx.globalAlpha = fade;
    // surface flash + shock ring
    ctx.globalCompositeOperation = 'lighter'; if (k < .3) { ctx.globalAlpha = (1 - k / .3) * .8; const R = 70 * s * (1 + k * 4); ctx.drawImage(P.warm, x - R, y - R * .5, R * 2, R); } ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = fade * .8;
    const ring = 30 * s + k * 90 * s; ctx.strokeStyle = 'rgba(235,240,236,' + (.5 * (1 - k / 2.6)) + ')'; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.ellipse(x, y, ring, ring * .2, 0, 0, 7); ctx.stroke();
    // column of puffs
    const n = 14; for (let i = 0; i < n; i++) { const u = i / (n - 1), py = y - u * H, w = (26 + 14 * Math.sin(u * 3.1) + u * 12 * (1 + fall)) * s * (.6 + .4 * er), jx = Math.sin(i * 2.7 + seed) * 8 * s;
        const lump = 1 + .25 * Math.sin(i * 5.3 + seed * 2.1 + k * 3); ctx.globalAlpha = fade * .8; ctx.drawImage(P.grey, x + jx - w * lump * 1.1, py - w * 1.1, w * lump * 2.2, w * 2.2); ctx.globalAlpha = fade * .55 * (1 - u * .3); ctx.drawImage(P.white, x + jx - w * .6 * lump + w * .3, py - w * .8, w * 1.2 * lump, w * 1.5); ctx.globalAlpha = fade * .22; ctx.drawImage(P.warm, x + jx - w * .5 + w * .5, py - w * .6, w, w * 1.2); }
    // crown
    const cw = (40 + 60 * er) * s * (1 - fall * .3); ctx.globalAlpha = fade * .75; ctx.drawImage(P.white, x - cw, y - H - cw * .5, cw * 2, cw * 1.2);
    // droplets
    ctx.fillStyle = 'rgba(240,244,240,.9)'; for (let i = 0; i < 26; i++) { const a = (ddpR(seed + i) - .5) * 1.5, v = (90 + ddpR(seed + i * 3) * 150) * s, tt = k * 1.1, px = x + Math.sin(a) * v * tt * .9, py = y - Math.cos(a) * v * tt * 1.3 + 260 * tt * tt * s; if (py < y + 6) { ctx.globalAlpha = fade * .8; ctx.fillRect(px, py, 2.2 * s, 2.2 * s + 2); } }
    ctx.restore(); ctx.globalAlpha = 1;
}
function ddpSpray(x, y, s, k, dir, seed, n) { // short burst of droplets (bow spray, bullet splash)
    if (k < 0 || k > 1.2) return; ctx.fillStyle = 'rgba(244,248,244,.85)';
    for (let i = 0; i < (n || 16); i++) { const v = (50 + ddpR(seed + i) * 130) * s, a = -Math.PI / 2 + (ddpR(seed + i * 3) - .5) * 1.4 + dir * .4, px = x + Math.cos(a) * v * k * 1.2, py = y + Math.sin(a) * v * k * 1.3 + 220 * k * k * s; ctx.globalAlpha = Math.max(0, 1 - k / 1.2); ctx.fillRect(px, py, 2 * s + .6, 2 * s + 1.4); }
    ctx.globalAlpha = 1;
}
function ddpFlashGlow(x, y, r, a) { const P = ddpEnsure(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.drawImage(P.warm, x - r, y - r, r * 2, r * 2); ctx.globalAlpha = a; ctx.drawImage(P.white, x - r * .35, y - r * .35, r * .7, r * .7); ctx.restore(); ctx.globalAlpha = 1; }

/* ---------- ships & planes ---------- */
function ddpShip(x, y, len, kind, flash, haze, t) {
    const k = len / 300, base = ddpMix([30, 36, 40], [165, 168, 162], haze);
    const col = ddpRGB(base), dark = ddpRGB(ddpMix(base, [8, 10, 12], .5)), lite = ddpRGB(ddpMix(base, [244, 214, 168], .4));
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    // long low hull, raised bow
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-150, -22); ctx.lineTo(-146, 6); ctx.lineTo(118, 6); ctx.lineTo(158, -30); ctx.quadraticCurveTo(140, -24, 100, -22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = dark; ctx.fillRect(-146, 1, 262, 6);
    // forecastle turrets
    function turret(px, py, dir, big) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(px - 13, py); ctx.lineTo(px - 11, py - 11); ctx.lineTo(px + 9, py - 11); ctx.lineTo(px + 14, py); ctx.closePath(); ctx.fill(); ctx.fillStyle = lite; ctx.fillRect(px - 11, py - 11, 20, 1.3); ctx.fillStyle = dark; ctx.save(); ctx.translate(px + dir * 6, py - 6); ctx.rotate(-.05); for (let b = 0; b < (big ? 3 : 2); b++) ctx.fillRect(dir > 0 ? 0 : -46, b * 3.2 - 3, 46, 2.2); ctx.restore(); }
    turret(-104, -22, 1, true); turret(-74, -30, 1, true); turret(88, -22, -1, true); turret(120, -22, -1, false);
    // central block: bridge tower, funnels, masts
    ctx.fillStyle = col; ctx.fillRect(-36, -50, 70, 30); ctx.fillRect(-18, -76, 28, 26); ctx.fillRect(-10, -96, 14, 20);
    ctx.fillStyle = dark; ctx.fillRect(-4, -134, 2.4, 40); ctx.fillRect(-56, -80, 2, 60); ctx.fillRect(44, -78, 2, 56);
    ctx.fillStyle = col; ctx.fillRect(14, -66, 18, 18); ctx.fillRect(-52, -58, 14, 10);
    ctx.fillStyle = dark; ctx.fillRect(18, -86, 12, 24); ctx.fillRect(36, -74, 10, 22);
    ctx.fillStyle = lite; ctx.fillRect(-36, -50, 70, 1.5); ctx.fillRect(-18, -76, 28, 1.3); ctx.fillRect(-10, -96, 14, 1.3);
    ctx.fillStyle = dark; ctx.fillRect(-70, -34, 26, 12); ctx.fillStyle = col; ctx.fillRect(-70, -36, 26, 2);
    // aft hangar and crane
    ctx.fillStyle = col; ctx.fillRect(-126, -34, 34, 12); ctx.fillStyle = dark; ctx.fillRect(-126, -34, 2, 24); ctx.fillRect(-140, -52, 1.6, 30); ctx.fillRect(-140, -52, 18, 1.4);
    // waterline haze
    const wg = ctx.createLinearGradient(0, -4, 0, 8); wg.addColorStop(0, 'rgba(226,206,172,0)'); wg.addColorStop(1, 'rgba(226,206,172,.5)'); ctx.fillStyle = wg; ctx.fillRect(-160, -4, 330, 14);
    ctx.restore();
    if (flash > 0) { ddpFlashGlow(x + (-30 * 1) * k + 80 * k, y - 34 * k, 190 * k * flash + 24, flash); }
}
function ddpPlane(x, y, s, ang, big) { // C-47 / fighter silhouette, banking side view
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(14,16,18,.92)'; ctx.beginPath(); ctx.moveTo(34, 0); ctx.quadraticCurveTo(26, -7, 6, -7); ctx.lineTo(-30, -4); ctx.lineTo(-38, -16); ctx.lineTo(-30, -16); ctx.lineTo(-24, -5); ctx.lineTo(-30, 0); ctx.lineTo(-24, 5); ctx.lineTo(10, 7); ctx.quadraticCurveTo(26, 7, 34, 0); ctx.fill();
    ctx.beginPath(); ctx.moveTo(8, 1); ctx.lineTo(-10, -28); ctx.lineTo(-18, -28); ctx.lineTo(-8, 3); ctx.fill();
    if (big) { ctx.fillStyle = 'rgba(210,210,200,.55)'; ctx.fillRect(-22, -5, 3, 11); ctx.fillRect(-16, -5, 3, 11); }
    ctx.restore();
}
function ddpBust(x, y, s, seed, haze, t, rim) { // head+shoulders of a soldier seen side-on (facing right); y = shoulder line
    const olive = ddpMix([66, 70, 46], [150, 156, 146], haze), dk = ddpMix([30, 32, 22], [100, 108, 104], haze);
    ctx.save(); ctx.translate(x, y + Math.sin(t * 2.2 + seed * 1.3) * 1.2 * s); ctx.scale(s, s);
    ctx.fillStyle = ddpRGB(dk); ctx.fillRect(-9, -1, 15, 8);                                 // shoulders / pack
    ctx.fillStyle = ddpRGB(olive); ctx.beginPath(); ctx.moveTo(-10, 8); ctx.lineTo(-9, -3); ctx.quadraticCurveTo(-2, -6, 6, -3); ctx.lineTo(7, 8); ctx.fill();
    ctx.fillStyle = ddpRGB(ddpMix([70, 54, 40], dk, haze)); ctx.fillRect(-1, -6, 5, 5);      // neck/jaw
    ctx.fillStyle = ddpRGB(olive); ctx.beginPath(); ctx.ellipse(1, -11, 6.4, 5.6, 0, Math.PI, 0); ctx.lineTo(7.6, -9); ctx.lineTo(-5.6, -9); ctx.closePath(); ctx.fill(); // helmet
    ctx.fillStyle = ddpRGB(dk); ctx.fillRect(-5.8, -9.6, 13.4, 1.6); ctx.globalAlpha = .45; for (let i = 0; i < 7; i++) ctx.fillRect(-4 + i * 1.7, -15 + (i % 2) * 2, 1, 1); ctx.globalAlpha = 1; // brim + net
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(1.5, -8.6, 4.5, 3.4);                    // face shadow
    ctx.strokeStyle = ddpRGB(dk); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(2, -8); ctx.lineTo(3, -3); ctx.stroke(); // chin strap
    if (rim) { ctx.fillStyle = 'rgba(255,214,150,' + rim + ')'; ctx.fillRect(-5, -15.6, 9, 1.4); ctx.fillRect(-9, -2, 1.6, 9); }
    ctx.restore();
}
/* ---------- landing craft (side view, bow to the right) ---------- */
function ddpBoatSide(x, y, s, t, o) { // y = waterline
    o = o || {}; const P = ddpEnsure(), seed = o.seed || 0, pitch = Math.sin(t * 1.5 + seed) * .018, haze = o.haze || 0;
    const hull = ddpMix([50, 54, 38], [150, 156, 146], haze), dk = ddpMix([18, 20, 15], [100, 108, 104], haze), lt = ddpMix([236, 200, 140], [214, 208, 190], haze);
    ctx.save(); ctx.translate(x, y + Math.sin(t * 1.9 + seed * 1.7) * 2.4 * s); ctx.rotate(pitch); ctx.scale(s, s);
    // shadow on the water
    ctx.fillStyle = 'rgba(6,12,14,.38)'; ctx.beginPath(); ctx.ellipse(0, 3, 82, 7, 0, 0, 7); ctx.fill();
    // hull
    ctx.fillStyle = ddpRGB(hull); ctx.beginPath(); ctx.moveTo(-66, -6); ctx.lineTo(-68, -30); ctx.lineTo(48, -30); ctx.lineTo(64, -40); ctx.lineTo(70, -34); ctx.lineTo(62, -4); ctx.lineTo(40, 3); ctx.lineTo(-52, 3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = ddpRGB(dk); ctx.beginPath(); ctx.moveTo(-66, -6); ctx.lineTo(62, -4); ctx.lineTo(40, 3); ctx.lineTo(-52, 3); ctx.closePath(); ctx.fill();
    // waterline stripe + plating
    ctx.fillStyle = 'rgba(0,0,0,.22)'; for (let i = 0; i < 9; i++) ctx.fillRect(-62 + i * 14, -28, 1.2, 22);
    ctx.fillStyle = ddpRGB(lt); ctx.globalAlpha = .9; ctx.fillRect(-68, -31, 116, 2); ctx.fillRect(-60, -52, 22, 1.6); ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(-66, -14, 128, 1.4);
    // ramp (bow door)
    ctx.fillStyle = ddpRGB(ddpMix(hull, [30, 32, 28], .25)); ctx.beginPath(); ctx.moveTo(48, -30); ctx.lineTo(64, -40); ctx.lineTo(70, -34); ctx.lineTo(62, -6); ctx.lineTo(52, -8); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(52, -28); ctx.lineTo(60, -8); ctx.stroke();
    // cab + coxswain
    ctx.fillStyle = ddpRGB(ddpMix(hull, [20, 22, 18], .15)); ctx.fillRect(-60, -52, 22, 24); ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(-56, -46, 14, 4);
    ctx.fillStyle = ddpRGB(lt); ctx.globalAlpha = .5; ctx.fillRect(-60, -52, 22, 1.5); ctx.globalAlpha = 1;
    // MG tubs
    ctx.fillStyle = ddpRGB(dk); ctx.fillRect(-26, -38, 10, 8); ctx.fillRect(18, -38, 10, 8);
    // troops: helmets over the gunwale
    const nT = o.troops === undefined ? 12 : o.troops;
    if (o.busts) { for (let i = 0; i < nT; i++) { ctx.save(); ddpBust(-34 + i * 7.2 + ((i * 7) % 3) * .8, -29 - ((i * 5) % 3) * 1.1, .72, seed + i, haze, t, o.rim || 0); ctx.restore(); } } else for (let i = 0; i < nT; i++) { const hx = -30 + i * 6.4 + ((i * 7) % 3), hy = -33 + Math.sin(t * 2.2 + i * 1.3 + seed) * 1.1; ctx.fillStyle = ddpRGB(ddpMix([50, 54, 38], [150, 156, 146], haze)); ctx.beginPath(); ctx.arc(hx, hy, 3.6, Math.PI, 0); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(hx - 3.6, hy, 7.2, 1.2); }
    ctx.fillStyle = ddpRGB(hull); ctx.fillRect(-68, -28.4, 116, 3.4); ctx.fillStyle = ddpRGB(lt); ctx.globalAlpha = .85; ctx.fillRect(-68, -28.6, 116, 1.5); ctx.globalAlpha = 1;
    ctx.restore();
    // bow wave and wake in world space
    const sp = o.speed === undefined ? 1 : o.speed;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    for (let i = 0; i < 14; i++) { const k = (t * 1.9 * sp + i / 14 + seed * .3) % 1, px = 60 + k * 30 * sp, py = -2 - Math.sin(k * 3.1) * (16 + (i % 3) * 5) * sp, r = (7 + k * 9) * (.7 + .3 * sp); ctx.globalAlpha = Math.pow(1 - k, 1.1) * .8; ctx.drawImage(P.white, px - r, py - r, r * 2, r * 2); }
    ctx.globalAlpha = .85; ctx.fillStyle = 'rgba(236,244,240,.8)'; ctx.beginPath(); ctx.moveTo(40, 3); ctx.quadraticCurveTo(66 + 6 * sp, -2, 86 + 10 * sp, 4); ctx.lineTo(40, 5); ctx.fill(); ctx.globalAlpha = 1;
    // wake
    const wg = ctx.createLinearGradient(-70, 0, -300 * sp, 0); wg.addColorStop(0, 'rgba(236,244,240,.7)'); wg.addColorStop(1, 'rgba(236,244,240,0)'); ctx.fillStyle = wg; ctx.beginPath(); ctx.moveTo(-60, 1); ctx.lineTo(-300 * sp - 20, 10 + 4 * sp); ctx.lineTo(-300 * sp - 20, -2); ctx.lineTo(-60, -5); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 17; i++) { const px = -64 + i * 7, r = 6 + (i * 5 % 4) * 1.6; ctx.globalAlpha = .55 + .2 * Math.sin(t * 3 + i + seed); ctx.drawImage(P.white, px - r, -1 - r * .55 + Math.sin(t * 2.2 + i) * 1.2, r * 2, r * 1.2); } ctx.globalAlpha = 1;
    ctx.restore();
}
