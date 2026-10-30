/* ================= MISSION 8 CUTSCENE : SCHWERER GUSTAV ================= */
const M8CS = { dur: 32, cuts: [6.5, 12.5, 18.5, 23.6] };
const DDP_M8PAL = { top: [34, 30, 62], mid: [118, 84, 108], low: [224, 136, 92], hor: [250, 186, 120] };
function ddpM8Clouds(hz, t) { const P = ddpEnsure(); for (let i = 0; i < 12; i++) { const x = ((ddpR(i * 5) * 2600 + t * 8) % 2600) - 500, y = hz - 160 - ddpR(i * 3) * 420, wd = 380 + ddpR(i + 2) * 520; ctx.globalAlpha = .35; ctx.drawImage(P.dark, x - wd / 2, y - wd * .08, wd, wd * .16); ctx.globalAlpha = .22; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(P.warm, x - wd * .45, y + wd * .02, wd * .9, wd * .07); ctx.restore(); } ctx.globalAlpha = 1; }
function ddpBigShell(x, y, s, ang) { // 80 cm Gustav shell, 7 tonnes
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang || 0); ctx.scale(s, s);
    const g = ctx.createLinearGradient(0, -20, 0, 20); g.addColorStop(0, '#8e9478'); g.addColorStop(.35, '#6a7058'); g.addColorStop(1, '#2c3024'); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(-80, -19); ctx.lineTo(40, -19); ctx.quadraticCurveTo(80, -16, 98, 0); ctx.quadraticCurveTo(80, 16, 40, 19); ctx.lineTo(-80, 19); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#b06a34'; ctx.fillRect(-74, -20, 8, 40); ctx.fillRect(28, -20, 6, 40); ctx.fillStyle = 'rgba(255,220,170,.35)'; ctx.fillRect(-74, -20, 8, 5);
    ctx.fillStyle = '#d8c24a'; ctx.fillRect(-40, -19, 4, 38); ctx.fillStyle = 'rgba(255,255,230,.25)'; ctx.fillRect(-80, -16, 118, 4);
    ctx.fillStyle = '#1e2018'; ctx.fillRect(-84, -16, 6, 32); ctx.restore();
}
function ddpGustav(x, y, s, t, o) { // 80 cm K(E) "Gustav", side view, barrel to the right; y = rail level
    o = o || {}; const P = ddpEnsure(), el = o.el || 0, rec = o.rec || 0, hz = o.haze || 0, mv = o.move || 0, rim = (1 - hz) * (o.rim === undefined ? 1 : o.rim);
    const F = [110, 92, 112], C = function (c, k, a) { return ddpRGB(ddpMix(k ? ddpMix(c, [0, 0, 0], k) : c, F, hz), a); };
    const base = [92, 96, 70], sand = [128, 118, 82], brn = [84, 66, 48], dk = [26, 27, 22], mid = [58, 61, 46];
    const R = function (alpha) { return 'rgba(255,196,128,' + alpha * rim + ')'; };
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,' + .45 * (1 - hz) + ')'; ctx.beginPath(); ctx.ellipse(0, 4, 262, 9, 0, 0, 7); ctx.fill();
    // ---- bogies: four groups of 5 spoked wheels with leaf-spring frames
    [-196, -96, 96, 196].forEach(function (bx, bi) {
        ctx.fillStyle = C(dk); ctx.fillRect(bx - 48, -30, 96, 12);
        for (let i = 0; i < 5; i++) { const wx = bx - 38 + i * 19; ctx.fillStyle = C(dk, .2); ctx.beginPath(); ctx.arc(wx, -9, 9, 0, 7); ctx.fill(); ctx.strokeStyle = C(mid); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(wx, -9, 6.4, 0, 7); ctx.stroke(); const a = t * mv * 6 + i; ctx.beginPath(); for (let k = 0; k < 3; k++) { ctx.moveTo(wx, -9); ctx.lineTo(wx + Math.cos(a + k * 2.09) * 6, -9 + Math.sin(a + k * 2.09) * 6); } ctx.stroke(); ctx.fillStyle = C(mid); ctx.beginPath(); ctx.arc(wx, -9, 2.2, 0, 7); ctx.fill(); }
        ctx.strokeStyle = C(mid); ctx.lineWidth = 2.4; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(bx - 40 + k * 2, -22 - k * 2.2); ctx.quadraticCurveTo(bx, -16 - k * 2.2, bx + 40 - k * 2, -22 - k * 2.2); ctx.stroke(); }
        ctx.fillStyle = R(.35); ctx.fillRect(bx - 48, -31, 96, 1.6);
    });
    // ---- main girders with lightening holes + rivets
    const gg = ctx.createLinearGradient(0, -62, 0, -30); gg.addColorStop(0, C(base)); gg.addColorStop(1, C(base, .45)); ctx.fillStyle = gg; ctx.fillRect(-250, -62, 500, 32);
    ctx.fillStyle = C(dk, 0, .55); for (let i = 0; i < 18; i++) { const hx = -232 + i * 27.3; if (Math.abs(hx) < 40) continue; ctx.beginPath(); ctx.ellipse(hx, -46, 7, 8, 0, 0, 7); ctx.fill(); }
    ctx.fillStyle = C(dk, 0, .5); for (let i = 0; i < 80; i++) { ctx.fillRect(-248 + i * 6.2, -60, 1.4, 1.4); ctx.fillRect(-248 + i * 6.2, -33, 1.4, 1.4); }
    ctx.fillStyle = R(.55); ctx.fillRect(-250, -63, 500, 2);
    // ---- front + rear platforms with railings and ladders
    ctx.fillStyle = C(mid); ctx.fillRect(-250, -70, 128, 8); ctx.fillRect(122, -70, 128, 8); ctx.fillStyle = R(.4); ctx.fillRect(-250, -71, 128, 1.4); ctx.fillRect(122, -71, 128, 1.4);
    ctx.strokeStyle = C(dk); ctx.lineWidth = 1.2; [[-248, -124], [124, 248]].forEach(function (p) { ctx.beginPath(); ctx.moveTo(p[0], -88); ctx.lineTo(p[1], -88); ctx.moveTo(p[0], -80); ctx.lineTo(p[1], -80); for (let x = p[0]; x <= p[1]; x += 16) { ctx.moveTo(x, -70); ctx.lineTo(x, -88); } ctx.stroke(); });
    ctx.strokeStyle = C(dk); ctx.lineWidth = 1.4; for (const lx of [-236, 236]) { ctx.beginPath(); ctx.moveTo(lx - 4, -30); ctx.lineTo(lx - 4, -70); ctx.moveTo(lx + 4, -30); ctx.lineTo(lx + 4, -70); for (let k = 0; k < 6; k++) { ctx.moveTo(lx - 4, -34 - k * 6.4); ctx.lineTo(lx + 4, -34 - k * 6.4); } ctx.stroke(); }
    // ---- the gun: breech, cradle, recoil cylinders, barrel
    ctx.save(); ctx.translate(36, -112); ctx.rotate(-el); ctx.translate(-rec, 0);
    const bd = function (y0, y1, c0) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, ddpRGB(ddpMix([170, 168, 132], F, hz))); g.addColorStop(.18, C(c0)); g.addColorStop(.7, C(c0, .35)); g.addColorStop(1, C(dk)); return g; };
    ctx.fillStyle = bd(-30, 30, base); ctx.beginPath(); ctx.roundRect(-118, -30, 92, 60, 8); ctx.fill();                                                     // breech block
    ctx.fillStyle = C(dk, 0, .6); ctx.fillRect(-118, -4, 92, 3); ctx.beginPath(); ctx.arc(-104, 0, 9, 0, 7); ctx.fill(); ctx.fillStyle = R(.5); ctx.fillRect(-114, -30, 84, 2);
    ctx.fillStyle = bd(-23, 23, base); ctx.fillRect(-30, -23, 120, 46);                                                                                        // cradle sleeve
    ctx.fillStyle = C(dk); ctx.fillRect(-26, -32, 110, 9); ctx.fillRect(-26, 23, 110, 9); ctx.fillStyle = R(.4); ctx.fillRect(-26, -32, 110, 1.6);              // recoil cylinders
    ctx.fillStyle = bd(-17, 17, base); ctx.beginPath(); ctx.moveTo(86, -17); ctx.lineTo(220, -14.5); ctx.lineTo(352, -12); ctx.quadraticCurveTo(360, -13.6, 362, -13); ctx.lineTo(362, 13); ctx.quadraticCurveTo(360, 13.6, 352, 12); ctx.lineTo(220, 14.5); ctx.lineTo(86, 17); ctx.closePath(); ctx.fill();   // barrel
    ctx.fillStyle = C(dk, 0, .55); ctx.fillRect(218, -15, 4, 30); ctx.fillRect(150, -16, 3, 32); ctx.fillRect(300, -13, 3, 26);
    ctx.fillStyle = R(.7); ctx.beginPath(); ctx.moveTo(86, -16.6); ctx.lineTo(362, -12.4); ctx.lineTo(362, -10.6); ctx.lineTo(86, -14.4); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,' + .08 * rim + ')'; ctx.beginPath(); ctx.moveTo(90, -9); ctx.lineTo(358, -6.4); ctx.lineTo(358, -4.4); ctx.lineTo(90, -6.6); ctx.fill();
    ctx.fillStyle = '#050404'; ctx.beginPath(); ctx.ellipse(362, 0, 2.4, 8, 0, 0, 7); ctx.fill();
    if (o.flash) { const k = o.flash; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = k; ctx.fillStyle = 'rgba(255,240,200,1)'; ctx.beginPath(); ctx.moveTo(362, -16); ctx.lineTo(362 + 300 * (1.2 - k * .2), -5); ctx.lineTo(362 + 380, 0); ctx.lineTo(362 + 300 * (1.2 - k * .2), 5); ctx.lineTo(362, 16); ctx.fill(); ctx.drawImage(P.fire, 330, -150, 420, 300); ctx.drawImage(P.warm, 300, -220, 520, 440); ctx.restore(); }
    ctx.restore();
    // ---- central gun house: sloped armour, plates, hatches, camouflage
    const house = new Path2D(); house.moveTo(-122, -62); house.lineTo(-108, -128); house.lineTo(-40, -136); house.lineTo(96, -136); house.lineTo(122, -96); house.lineTo(130, -62); house.closePath();
    const hg = ctx.createLinearGradient(0, -136, 0, -62); hg.addColorStop(0, C(base, -0)); hg.addColorStop(.6, C(base, .18)); hg.addColorStop(1, C(base, .4)); ctx.fillStyle = hg; ctx.fill(house);
    ctx.save(); ctx.clip(house);
    ctx.globalAlpha = .85; ctx.fillStyle = C(sand); ctx.beginPath(); ctx.ellipse(-70, -96, 46, 16, .3, 0, 7); ctx.ellipse(70, -122, 40, 12, -.2, 0, 7); ctx.fill(); ctx.fillStyle = C(brn); ctx.beginPath(); ctx.ellipse(10, -84, 50, 10, -.15, 0, 7); ctx.ellipse(-100, -124, 24, 8, .2, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = C(dk, 0, .45); ctx.lineWidth = 1.2; for (let i = -100; i < 130; i += 34) { ctx.beginPath(); ctx.moveTo(i, -136); ctx.lineTo(i + 6, -62); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-122, -100); ctx.lineTo(126, -100); ctx.stroke();
    ctx.fillStyle = C(dk, 0, .4); for (let i = 0; i < 60; i++) ctx.fillRect(-116 + i * 4, -101.5, 1.2, 1.2);
    ctx.fillStyle = 'rgba(0,0,0,' + .25 * (1 - hz) + ')'; ctx.fillRect(-130, -76, 260, 14);
    ctx.restore();
    ctx.fillStyle = R(.6); ctx.beginPath(); ctx.moveTo(-108, -128); ctx.lineTo(-40, -136); ctx.lineTo(96, -136); ctx.lineTo(122, -96); ctx.lineTo(118, -96); ctx.lineTo(94, -133); ctx.lineTo(-40, -133); ctx.lineTo(-107, -125); ctx.fill();
    ctx.fillStyle = C(dk); ctx.fillRect(-92, -120, 22, 30); ctx.fillStyle = C(mid); ctx.fillRect(-90, -118, 18, 26); ctx.fillStyle = C(dk); ctx.beginPath(); ctx.arc(-74, -104, 1.6, 0, 7); ctx.fill();   // door
    ctx.fillStyle = C(dk); for (let i = 0; i < 3; i++) ctx.fillRect(-58 + i * 20, -126, 14, 6); if (o.lights) { ctx.fillStyle = 'rgba(255,200,120,.8)'; for (let i = 0; i < 3; i++) ctx.fillRect(-57 + i * 20, -125, 12, 4); }
    // rear shell hoist + crane
    ctx.fillStyle = C(mid); ctx.beginPath(); ctx.moveTo(-200, -70); ctx.lineTo(-180, -70); ctx.lineTo(-112, -128); ctx.lineTo(-124, -132); ctx.closePath(); ctx.fill(); ctx.strokeStyle = C(dk); ctx.lineWidth = 1; for (let k = 0; k < 9; k++) { ctx.beginPath(); ctx.moveTo(-196 + k * 8.4, -70 - k * 6.8); ctx.lineTo(-184 + k * 8.4, -70 - k * 6.8); ctx.stroke(); }
    ctx.strokeStyle = C(dk); ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(-226, -70); ctx.lineTo(-226, -168); ctx.lineTo(-150, -176); ctx.stroke(); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-226, -150); ctx.lineTo(-190, -173); ctx.moveTo(-160, -175); ctx.lineTo(-160, -140); ctx.stroke(); ctx.fillStyle = C(dk); ctx.fillRect(-166, -142, 12, 6);
    ctx.strokeStyle = R(.45); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-224, -168); ctx.lineTo(-150, -175.5); ctx.stroke();
    ctx.fillStyle = C(dk); ctx.beginPath(); ctx.arc(36, -112, 20, 0, 7); ctx.fill(); ctx.fillStyle = C(base, .1); ctx.beginPath(); ctx.arc(36, -112, 12, 0, 7); ctx.fill(); ctx.fillStyle = R(.5); ctx.beginPath(); ctx.arc(36, -112, 12, -2.6, -1); ctx.lineTo(36, -112); ctx.fill();   // trunnion
    ctx.restore();
}
function ddpTunnelCliff(hz, t, pan, o) { // rocky hill with the railway tunnel portal
    o = o || {}; const px = 860 - pan, py = hz + 20;
    ctx.fillStyle = 'rgb(40,32,46)'; ctx.beginPath(); ctx.moveTo(-800, hz + 30); ctx.lineTo(-800, hz - 120); for (let x = -800; x <= 2400; x += 40) ctx.lineTo(x, hz - 140 - Math.sin(x * .004 + 1) * 120 - Math.sin(x * .013) * 30 - (Math.abs(x - px) < 500 ? (500 - Math.abs(x - px)) * .45 : 0)); ctx.lineTo(2400, hz + 30); ctx.fill();
    ctx.fillStyle = 'rgba(255,170,110,.18)'; for (let x = -800; x <= 2400; x += 40) { const yy = hz - 140 - Math.sin(x * .004 + 1) * 120 - Math.sin(x * .013) * 30 - (Math.abs(x - px) < 500 ? (500 - Math.abs(x - px)) * .45 : 0); ctx.fillRect(x, yy, 40, 3); }
    for (let i = 0; i < 40; i++) { const x = ddpR(i * 3) * 2400 - 400, y = hz - 10 - ddpR(i * 5) * 90; ctx.fillStyle = 'rgba(20,16,26,.5)'; ctx.beginPath(); ctx.ellipse(x - pan * .9, y, 30 + ddpR(i) * 60, 10 + ddpR(i + 1) * 20, ddpR(i + 2) - .5, 0, 7); ctx.fill(); }
    // portal: concrete arch, black mouth, camouflage nets
    ctx.fillStyle = 'rgb(96,88,90)'; ctx.fillRect(px - 190, py - 250, 380, 250); ctx.fillStyle = 'rgba(255,190,130,.22)'; ctx.fillRect(px - 190, py - 250, 380, 6);
    ctx.fillStyle = '#050407'; ctx.beginPath(); ctx.moveTo(px - 150, py); ctx.lineTo(px - 150, py - 140); ctx.quadraticCurveTo(px, py - 250, px + 150, py - 140); ctx.lineTo(px + 150, py); ctx.fill();
    if (o.lamps) { [-120, 120].forEach(function (d) { ddpFlashGlow(px + d, py - 120, 60, .7); }); }
    ctx.strokeStyle = 'rgba(30,36,24,.8)'; ctx.lineWidth = 2; for (let i = 0; i < 22; i++) { ctx.beginPath(); ctx.moveTo(px - 220 + i * 20, py - 270); ctx.quadraticCurveTo(px - 210 + i * 20, py - 230, px - 220 + i * 20 + Math.sin(t + i) * 4, py - 200 + (i % 3) * 20); ctx.stroke(); }
    ctx.fillStyle = 'rgba(40,50,30,.65)'; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.ellipse(px - 200 + i * 30, py - 262, 22, 10, 0, 0, 7); ctx.fill(); }
    return { px: px, py: py };
}
function ddpM8Rails(y, pan) { ctx.fillStyle = 'rgb(60,48,52)'; ctx.fillRect(-800, y - 4, 3200, 24); ctx.fillStyle = 'rgb(40,32,30)'; for (let x = -800; x < 2400; x += 22) ctx.fillRect(x - (pan % 22), y + 2, 12, 8); ctx.fillStyle = 'rgba(255,200,150,.6)'; ctx.fillRect(-800, y - 2, 3200, 2.4); }

function ddpM8Valley(hz, gy, t, pan) { // dusk sky, layered hills, pines, mist, ballast embankment + rails
    const P = ddpEnsure(); ddpSky(hz + 60, t, pan * .1, 1320 - pan * .05, .8, 0, DDP_M8PAL); ddpM8Clouds(hz - 60, t);
    [[hz - 70, [92, 70, 104], .45, 120, .003, 2], [hz - 30, [70, 52, 82], .3, 80, .006, 5], [hz + 10, [50, 38, 60], .18, 50, .011, 9]].forEach(function (L, li) {
        ctx.fillStyle = ddpRGB(L[1]); ctx.beginPath(); ctx.moveTo(-900, gy); for (let x = -900; x <= 2500; x += 30) ctx.lineTo(x, L[0] - Math.sin((x + pan * (li + 1) * .15) * L[4] + L[5]) * L[3] - Math.sin(x * L[4] * 3.1) * L[3] * .25); ctx.lineTo(2500, gy); ctx.fill();
        ctx.fillStyle = 'rgba(255,170,110,' + L[2] * .35 + ')'; for (let x = -900; x <= 2500; x += 30) { const yy = L[0] - Math.sin((x + pan * (li + 1) * .15) * L[4] + L[5]) * L[3] - Math.sin(x * L[4] * 3.1) * L[3] * .25; ctx.fillRect(x, yy, 30, 2); }
        ctx.globalAlpha = .35; ctx.drawImage(P.warm, -900, L[0] - 30, 3400, 90); ctx.globalAlpha = 1; });
    ctx.fillStyle = 'rgb(30,24,36)'; for (let i = 0; i < 90; i++) { const x = ((i * 31 - pan * .6) % 2800 + 2800) % 2800 - 600, h = 30 + ddpR(i) * 50, yb = hz + 30 + ddpR(i + 3) * 10; ctx.beginPath(); ctx.moveTo(x - h * .22, yb); ctx.lineTo(x, yb - h); ctx.lineTo(x + h * .22, yb); ctx.fill(); }
    ddpM4Fog(hz + 0, hz + 70, t, .25, 6, 3);
    const g = ctx.createLinearGradient(0, hz + 30, 0, gy + 200); g.addColorStop(0, 'rgb(70,54,58)'); g.addColorStop(.7, 'rgb(42,32,36)'); g.addColorStop(1, 'rgb(18,14,16)'); ctx.fillStyle = g; ctx.fillRect(-900, hz + 30, 3400, gy + 800);
    const bg = ctx.createLinearGradient(0, gy - 4, 0, gy + 46); bg.addColorStop(0, 'rgb(96,82,80)'); bg.addColorStop(1, 'rgb(40,32,32)'); ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(-900, gy + 50); ctx.lineTo(-900, gy + 2); ctx.lineTo(2500, gy + 2); ctx.lineTo(2500, gy + 50); ctx.fill();
    ctx.fillStyle = 'rgba(30,24,22,.6)'; for (let i = 0; i < 300; i++) { const x = ((i * 11.7 - pan) % 3400 + 3400) % 3400 - 900; ctx.fillRect(x, gy + 6 + ddpR(i) * 40, 3, 2); }
    ctx.fillStyle = 'rgb(36,26,22)'; for (let x = -900; x < 2500; x += 20) ctx.fillRect(x - ((pan % 20) + 20) % 20, gy + 1, 13, 5);
    ctx.fillStyle = 'rgb(70,66,66)'; ctx.fillRect(-900, gy - 3, 3400, 4); ctx.fillStyle = 'rgba(255,200,150,.7)'; ctx.fillRect(-900, gy - 3, 3400, 1.4);
}
function ddpCliffSide(gy, edge, t, top) { // hillside seen side-on, tunnel mouth facing right at x = edge
    ctx.fillStyle = 'rgb(44,34,48)'; ctx.beginPath(); ctx.moveTo(-800, gy + 30); ctx.lineTo(-800, gy - (top || 520)); ctx.quadraticCurveTo(edge - 400, gy - (top || 520) - 40, edge - 60, gy - 420); ctx.quadraticCurveTo(edge + 60, gy - 380, edge + 40, gy - 300); ctx.lineTo(edge + 10, gy + 30); ctx.fill();
    ctx.fillStyle = 'rgba(255,170,110,.22)'; ctx.beginPath(); ctx.moveTo(edge - 60, gy - 420); ctx.quadraticCurveTo(edge + 60, gy - 380, edge + 40, gy - 300); ctx.lineTo(edge + 30, gy - 300); ctx.quadraticCurveTo(edge + 46, gy - 378, edge - 60, gy - 412); ctx.fill();
    for (let i = 0; i < 26; i++) { const x = edge - 80 - ddpR(i * 3) * 900, y = gy - 40 - ddpR(i * 5) * 380; ctx.fillStyle = 'rgba(18,14,22,.55)'; ctx.beginPath(); ctx.ellipse(x, y, 30 + ddpR(i) * 50, 8 + ddpR(i + 1) * 14, ddpR(i + 2) - .5, 0, 7); ctx.fill(); }
    // the tunnel mouth: dark recess with a concrete collar
    const mh = 330; ctx.fillStyle = '#060508'; ctx.beginPath(); ctx.moveTo(edge - 70, gy + 20); ctx.lineTo(edge - 70, gy - mh + 60); ctx.quadraticCurveTo(edge - 40, gy - mh - 20, edge + 16, gy - mh + 50); ctx.lineTo(edge + 16, gy + 20); ctx.fill();
    ctx.fillStyle = 'rgb(108,98,100)'; ctx.beginPath(); ctx.moveTo(edge + 6, gy + 24); ctx.lineTo(edge + 6, gy - mh + 50); ctx.quadraticCurveTo(edge - 40, gy - mh - 30, edge - 72, gy - mh + 50); ctx.lineTo(edge - 92, gy - mh + 40); ctx.quadraticCurveTo(edge - 46, gy - mh - 60, edge + 36, gy - mh + 40); ctx.lineTo(edge + 36, gy + 24); ctx.fill();
    ctx.fillStyle = 'rgba(255,190,130,.3)'; ctx.fillRect(edge + 30, gy - mh + 40, 6, mh - 16);
    ctx.fillStyle = 'rgba(40,50,30,.7)'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse(edge - 80 + i * 16, gy - mh - 10 + Math.sin(i) * 8, 16, 7, 0, 0, 7); ctx.fill(); } ctx.strokeStyle = 'rgba(30,36,24,.8)'; ctx.lineWidth = 2; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(edge - 80 + i * 16, gy - mh - 6); ctx.quadraticCurveTo(edge - 76 + i * 16 + Math.sin(t + i) * 3, gy - mh + 40, edge - 80 + i * 16, gy - mh + 90 + (i % 3) * 20); ctx.stroke(); }
    return edge;
}
/* ---------- SHOT A : the barrel comes out of the mountain ---------- */
function ddpM8ShotA(t, hv) {
    const P = ddpEnsure(); cs2Once('m8rum', t > .1, function () { playTone(36, 48, 6.2, .14, 'sawtooth'); }); cs2Once('m8clank', t > 1.6, function () { playTone(140, 90, .3, .08, 'square'); }); cs2Once('m8clank2', t > 4.1, function () { playTone(120, 80, .3, .08, 'square'); });
    const gy = hv * .78, hz = hv * .6, edge = 560, close = t < 3.0, k = cs2E(cs2C(t / 6.4, 0, 1)), gx = edge - 330 + k * 600, GS = 1.15;
    const sh = ddpShakeAt(t, (close ? 2.2 : 1.2) + Math.sin(t * 20) * .5);
    ctx.save();
    if (close) { const z = 2.2 + t * .06; ddpCam(hv, (edge + 270) - 800 + t * 34 + sh[0], (gy - 170) - hv / 2 + sh[1], z, -.012); }
    else { const q = cs2E(cs2C((t - 3) / 3.4, 0, 1)); ddpCam(hv, 90 + q * 70 + sh[0], -40 + sh[1], .92 + q * .04, 0); }
    ddpM8Valley(hz, gy, t, 0);
    ddpCliffSide(gy, edge, t, 600);
    // Gustav, everything left of the mouth still inside the mountain
    ctx.save(); ctx.beginPath(); ctx.rect(edge + 14, -3000, 5000, 6000); ctx.clip(); ddpGustav(gx, gy, GS, t, { el: .03, move: 1, lights: true });
    const sd = ctx.createLinearGradient(edge, 0, edge + 330, 0); sd.addColorStop(0, 'rgba(6,5,8,.97)'); sd.addColorStop(.5, 'rgba(6,5,8,.45)'); sd.addColorStop(1, 'rgba(6,5,8,0)'); ctx.fillStyle = sd; ctx.fillRect(edge, gy - 185, 330, 200); ctx.restore();
    // lamps on the portal, dust shaken loose, exhaust rolling out of the tunnel
    ddpFlashGlow(edge + 38, gy - 250, 90, .6 + Math.sin(t * 11) * .05); ddpFlashGlow(edge + 38, gy - 90, 70, .55);
    ctx.fillStyle = 'rgba(190,170,150,.6)'; for (let i = 0; i < 60; i++) { const q = (t * .9 + ddpR(i)) % 1, x = edge - 60 + ddpR(i * 3) * 120 + q * 30; ctx.fillRect(x, gy - 330 + q * 330, 2, 3); }
    for (let i = 0; i < 12; i++) { const q = (t * .22 + i / 12) % 1, r = 70 + q * 260; ctx.globalAlpha = (1 - q) * .42; ctx.drawImage(P.dark, edge + 30 + q * 260 - r, gy - 260 - q * 260 - r * .5, r * 2, r); } ctx.globalAlpha = 1;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 16; i++) { const q = (t * 2 + i / 16) % 1; ctx.fillStyle = 'rgba(255,190,90,' + (1 - q) + ')'; ctx.fillRect(gx - 200 * GS + ddpR(i) * 460 * GS, gy - 6 - q * 30, 2, 2); } ctx.restore();
    if (close) { ddpGI(edge + 600, gy + 26, 3.4, -1, { lean: -.12, h1: [10, -54], h2: [6, -50], bino: true }); }
    // crew for scale, a signaller with a lamp
    ddpGI(1280, gy + 34, 1.6, -1, { lean: -.1, h1: [16, -56], h2: [6, -30] }); ddpFlashGlow(1280 - 26, gy + 34 - 90, 22, .9);
    ddpGI(1360, gy + 38, 1.6, -1, { walk: t * 6, h1: null }); ddpGI(1440, gy + 36, 1.6, -1, { lean: .05, h1: [14, -44], h2: [8, -40] });
    ctx.fillStyle = '#0a080c'; for (let i = 0; i < 60; i++) { const x = i * 40 - 600, hh = 30 + ddpR(i) * 80; ctx.beginPath(); ctx.moveTo(x - 6, hv + 200); ctx.quadraticCurveTo(x, hv + 120 - hh * .5, x + 4, hv + 120 - hh); ctx.quadraticCurveTo(x + 6, hv + 120 - hh * .5, x + 8, hv + 200); ctx.fill(); }
    ctx.restore();
}
/* ---------- SHOT B : seven tonnes, into the breech ---------- */
function ddpM8ShotB(u, hv) {
    const P = ddpEnsure(), ax = hv * .56, face = 1080, ss = 2.3;
    cs2Once('m8chain', u > .2, function () { for (let i = 0; i < 8; i++) setTimeout(function () { try { playTone(300 + i * 30, 200, .08, .04, 'square'); } catch (e) {} }, i * 200); });
    cs2Once('m8ramS', u > 3.0, function () { playTone(80, 120, 1.6, .07, 'sawtooth'); }); cs2Once('m8shut', u > 4.95, function () { playExplosionSound(.7); playTone(90, 50, .6, .1, 'square'); });
    const sh = ddpShakeAt(u, u > 4.95 && u < 5.6 ? (5.6 - u) * 18 : .5); ctx.save(); ddpCam(hv, sh[0] + 60 + u * 14, sh[1], 1.04 + u * .012, 0);
    // tunnel interior
    const bg = ctx.createLinearGradient(0, 0, 0, hv); bg.addColorStop(0, '#0d0b0e'); bg.addColorStop(.6, '#1e1a1c'); bg.addColorStop(1, '#0a090a'); ctx.fillStyle = bg; ctx.fillRect(-300, -300, 2300, hv + 600);
    for (let i = 0; i < 10; i++) { const x = i * 220 - 200; ctx.fillStyle = 'rgba(70,64,62,.55)'; ctx.fillRect(x, -200, 26, hv + 400); ctx.fillStyle = 'rgba(255,200,140,.1)'; ctx.fillRect(x, -200, 4, hv + 400); }
    [[260, 90], [760, 70], [1300, 90]].forEach(function (l) { ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(l[0], -200); ctx.lineTo(l[0], l[1]); ctx.stroke(); ctx.fillStyle = '#3a3630'; ctx.beginPath(); ctx.moveTo(l[0] - 20, l[1] + 16); ctx.lineTo(l[0], l[1]); ctx.lineTo(l[0] + 20, l[1] + 16); ctx.fill(); ddpFlashGlow(l[0], l[1] + 18, 420, .5 + Math.sin(u * 13 + l[0]) * .04); });
    ctx.fillStyle = '#1a1614'; ctx.fillRect(-300, hv * .86, 2300, hv); ctx.fillStyle = 'rgba(255,200,140,.16)'; ctx.fillRect(-300, hv * .86, 2300, 3);
    // the gun's breech, side-on: the bore axis is horizontal at y = ax, the chamber mouth faces left
    const bt = ax - 150, bb = ax + 150;
    const brg = ctx.createLinearGradient(0, bt, 0, bb); brg.addColorStop(0, '#5a5e48'); brg.addColorStop(.45, '#40442f'); brg.addColorStop(1, '#22251a'); ctx.fillStyle = brg; ctx.fillRect(face, bt, 900, 300);
    ctx.fillStyle = 'rgba(255,200,140,.22)'; ctx.fillRect(face, bt, 900, 5); ctx.fillStyle = '#2a2c20'; for (let i = 0; i < 6; i++) ctx.fillRect(face + 60 + i * 120, bt, 10, 300);
    ctx.fillStyle = '#4a4e3a'; ctx.fillRect(face - 18, bt - 30, 40, 360);                                                                     // the breech ring
    // chamber mouth (seen nearly edge-on)
    ctx.fillStyle = '#070706'; ctx.beginPath(); ctx.ellipse(face, ax, 22, 52, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#8a8c70'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(face, ax, 24, 56, 0, Math.PI * .5, Math.PI * 1.5); ctx.stroke();
    // loading tray in line with the bore
    ctx.fillStyle = '#2a2620'; ctx.fillRect(300, ax + 46, face - 300, 22); ctx.fillStyle = 'rgba(255,200,140,.2)'; ctx.fillRect(300, ax + 46, face - 300, 3); ctx.fillStyle = '#1a1814'; for (let i = 0; i < 6; i++) ctx.fillRect(330 + i * 130, ax + 68, 16, hv * .86 - ax - 68);
    // shell: lowered on chains onto the tray, then rammed into the chamber
    const lower = cs2E(cs2C(u / 2.6, 0, 1)), ram = cs2E(cs2C((u - 3.0) / 1.7, 0, 1)), L = 178 * ss, sxStart = 620, sx = sxStart + ram * (face - sxStart + L * .62 + 40), sy = cs2L(hv * .18, ax, lower) + (lower < 1 ? Math.sin(u * 2.3) * 4 * (1 - lower) : 0);
    const hook = cs2C((u - 2.7) / .4, 0, 1);
    // gantry + trolley + chains
    ctx.fillStyle = '#26241e'; ctx.fillRect(-300, hv * .05, 1600, 30); ctx.fillStyle = 'rgba(255,200,140,.2)'; ctx.fillRect(-300, hv * .05, 1600, 3); ctx.fillStyle = '#3a3830'; ctx.fillRect(sxStart - 60, hv * .05 + 26, 120, 24);
    const cy0 = hv * .05 + 50, cy1 = (hook > 0 ? cs2L(sy - 50, cy0 + 60, hook) : sy - 50);
    ctx.strokeStyle = '#2a2622'; ctx.lineWidth = 4; for (const d of [-70, 70]) { const n = 16; for (let i = 0; i < n; i++) { const q = i / n; ctx.beginPath(); ctx.ellipse(sxStart + d * q, cs2L(cy0, cy1, q), 4, 7, 0, 0, 7); ctx.stroke(); } ctx.fillStyle = '#16140f'; ctx.beginPath(); ctx.moveTo(sxStart + d - 8, cy1); ctx.lineTo(sxStart + d + 8, cy1); ctx.lineTo(sxStart + d, cy1 + 16); ctx.fill(); }
    // the shell, clipped where it disappears into the chamber
    ctx.save(); ctx.beginPath(); ctx.rect(-300, -300, face + 300 - 2, hv + 600); ctx.clip(); ddpBigShell(sx - L * .1, sy, ss, 0); ctx.restore();
    if (ram < 1) ddpFlashGlow(sx, sy - 20, 200, .12);
    // hydraulic rammer pushing from the left
    if (u > 2.9) { const rx = sx - L * .55 - 10; ctx.fillStyle = '#3a3c30'; ctx.fillRect(-300, ax - 10, rx + 300, 20); ctx.fillStyle = 'rgba(255,220,170,.25)'; ctx.fillRect(-300, ax - 10, rx + 300, 3); ctx.fillStyle = '#4a4c3c'; ctx.fillRect(rx - 8, ax - 40, 18, 80); }
    // sliding breech block drops shut after the shell is home
    const shut = cs2E(cs2C((u - 4.75) / .25, 0, 1)), byk = cs2L(ax - 230, ax - 70, shut);
    ctx.fillStyle = '#50543e'; ctx.fillRect(face - 28, byk, 58, 140); ctx.fillStyle = 'rgba(255,200,140,.25)'; ctx.fillRect(face - 28, byk, 58, 4); ctx.fillStyle = '#2a2c20'; ctx.fillRect(face - 6, byk + 20, 14, 100);
    if (u > 4.95 && u < 5.6) for (let i = 0; i < 24; i++) { const q = (u - 4.95) / .65; ctx.fillStyle = 'rgba(255,210,130,' + (1 - q) + ')'; ctx.fillRect(face - 30 + (ddpR(i) - .5) * 60 + (ddpR(i + 4) - .5) * 200 * q, ax + (ddpR(i + 3) - .5) * 120 - 80 * q + 160 * q * q, 3, 3); }
    // crew: one on the rammer lever, one signalling, one watching the breech
    const sig = u > 2.6 && u < 3.2 ? 1 : 0; ddpGI(220, hv * .86, 3.0, 1, { lean: .2, h1: [24, -40], h2: [14, -38] }); ddpGI(520, hv * .86, 3.0, 1, { lean: -.1, h1: sig ? [16, -66] : [18, -36], h2: [6, -30] }); ddpGI(1240, hv * .86, 2.9, -1, { lean: .05, h1: [20, -44], h2: [8, -40] });
    for (let i = 0; i < 6; i++) { const q = (u * .1 + i / 6) % 1, r = 300; ctx.globalAlpha = .16 * Math.sin(q * Math.PI); ctx.drawImage(P.dark, -300 + q * 2200 - r, hv * .2 + i * 40 - r * .3, r * 2, r * .6); } ctx.globalAlpha = 1;
    ctx.restore();
}
/* ---------- SHOT C : it rises, it fires ---------- */
function ddpM8ShotC(u, hv) {
    const P = ddpEnsure(), fire = 4.3, fd = u - fire; cs2Once('m8siren', u > .3, function () { playTone(400, 700, 1.4, .05, 'sawtooth'); setTimeout(function () { try { playTone(700, 400, 1.4, .05, 'sawtooth'); } catch (e) {} }, 1400); });
    cs2Once('m8gear', u > .1, function () { playTone(70, 110, 3.6, .06, 'square'); });
    cs2Once('m8fire', fd > 0, function () { playExplosionSound(2.2); playTone(50, 20, 2.5, .16, 'sawtooth'); playDistantArtillery(); });
    const gy = hv * .8, hz = hv * .6, GS = 1.45, gx0 = 640, el = cs2E(cs2C((u - .2) / 3.8, 0, 1)) * .7, kick = fd > 0 ? Math.max(0, 1 - fd / .9) : 0, gx = gx0 - (fd > 0 ? Math.min(14, fd * 60) : 0), rec = fd > 0 ? 46 * kick : 0;
    const shake = fd > 0 ? Math.max(0, 34 * (1 - fd / 1.3)) + 2 : 1 + (u < 4.2 ? .6 : 0), sh = ddpShakeAt(u, shake);
    ctx.save();
    if (u < 2.2) { const z = 2.1 - u * .08; ddpCam(hv, (gx0 + 36 * GS + 160) - 800 + sh[0], (gy - 112 * GS - 120) - hv / 2 + sh[1], z, .03); }
    else { const pull = fd > 0 ? Math.min(.08, fd * .07) : 0; ddpCam(hv, 40 + sh[0], -60 + sh[1], .95 - pull, 0); }
    ddpM8Valley(hz, gy, u + 13, 0);
    ddpCliffSide(gy, -60, u + 13, 560);
    // the gun on its rails, barrel climbing, rocking back when it fires
    ctx.save(); ctx.translate(gx, gy); ctx.rotate(-kick * .012); ctx.translate(-gx, -gy);
    ddpGustav(gx, gy, GS, u, { el: el, rec: rec, flash: fd > 0 && fd < .35 ? 1 - fd / .35 : 0, lights: true });
    ctx.restore();
    // crew running clear, hands over ears
    for (let i = 0; i < 5; i++) { const run = u > 2.4 ? Math.min(1, (u - 2.4) / 1.6) : 0; ddpGI(1180 + i * 60 + run * 220, gy + 30 + (i % 2) * 6, 1.6, 1, { walk: run > 0 && run < 1 ? u * 9 + i : 0, h1: run > .6 ? [6, -54] : null, h2: run > .6 ? [-2, -54] : null }); }
    if (fd > 0) {
        const ca = Math.cos(-el), sa = Math.sin(-el), mx = gx + GS * (36 + ca * (362 - rec)), my = gy + GS * (-112 + sa * (362 - rec));
        if (fd < .5) { const k = 1 - fd / .5; ddpFlashGlow(mx, my, 1100 * k + 240, k); }
        // fireball + rolling smoke pushed downrange
        for (let i = 0; i < 26; i++) { const q = i / 25, d = (40 + q * 900) * Math.min(1, fd * 1.1 + .2), r = (80 + q * 240) * (.55 + Math.min(1.5, fd) * .55), px = mx + ca * d + (ddpR(i) - .5) * 120 * q, py = my + sa * d - fd * 36 * q + (ddpR(i + 5) - .5) * 90 * q; ctx.globalAlpha = Math.max(0, .9 - fd * .09) * (1 - q * .3); ctx.drawImage(q < .2 && fd < .7 ? P.fire : (i % 3 ? P.grey : P.dark), px - r, py - r, r * 2, r * 2); }
        if (fd < .8) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1 - fd / .8; ctx.drawImage(P.fire, mx - 160, my - 160, 320, 320); ctx.restore(); }
        // ground blast: dust wave racing out under the gun, rail sparks
        for (let i = 0; i < 12; i++) { const r = 60 + fd * 260, x = gx + (i - 6) * 150 * (1 + fd * .6); ctx.globalAlpha = Math.max(0, .6 - fd * .18); ctx.drawImage(P.dust, x - r, gy - r * .45, r * 2, r * .7); } ctx.globalAlpha = 1;
        if (fd < 1.4) { ctx.strokeStyle = 'rgba(255,240,220,' + (.32 * (1 - fd / 1.4)) + ')'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(mx, my, fd * 1300, 0, 7); ctx.stroke(); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(mx, my, fd * 1100, 0, 7); ctx.stroke(); }
        ctx.strokeStyle = 'rgba(20,16,24,.8)'; ctx.lineWidth = 2; for (let i = 0; i < 9; i++) { const bx = 1500 + ddpR(i) * 300 + fd * (120 + i * 30), by = hz - 40 - fd * (80 + i * 14) - ddpR(i + 2) * 60, f = Math.sin(u * 16 + i) * 5; ctx.beginPath(); ctx.moveTo(bx - 8, by - f); ctx.quadraticCurveTo(bx - 3, by - 2, bx, by); ctx.quadraticCurveTo(bx + 3, by - 2, bx + 8, by - f); ctx.stroke(); }
    }
    ctx.fillStyle = '#0a080c'; for (let i = 0; i < 60; i++) { const x = i * 40 - 600, hh = 30 + ddpR(i) * 80; ctx.beginPath(); ctx.moveTo(x - 6, hv + 200); ctx.quadraticCurveTo(x, hv + 120 - hh * .5, x + 4, hv + 120 - hh); ctx.quadraticCurveTo(x + 6, hv + 120 - hh * .5, x + 8, hv + 200); ctx.fill(); }
    ctx.restore();
    return fd > 0 && fd < .15 ? .55 * (1 - fd / .15) : 0;
}
/* ---------- SHOT D : the beachhead ---------- */
function ddpM8Crates(x, y, s, seed) { for (let i = 0; i < 7; i++) { const cx = x + (i % 4) * 22 * s - (i > 3 ? -11 * s : 0), cy = y - (i > 3 ? 18 * s : 0), w = 20 * s, h = 17 * s; ctx.fillStyle = ddpR(seed + i) > .5 ? '#6a5434' : '#5a4628'; ctx.fillRect(cx, cy - h, w, h); ctx.strokeStyle = 'rgba(20,14,6,.6)'; ctx.lineWidth = 1.2; ctx.strokeRect(cx, cy - h, w, h); ctx.beginPath(); ctx.moveTo(cx, cy - h); ctx.lineTo(cx + w, cy); ctx.stroke(); ctx.fillStyle = 'rgba(255,230,170,.12)'; ctx.fillRect(cx, cy - h, w, 2); }
    for (let i = 0; i < 6; i++) { const jx = x + 100 * s + i * 9 * s; ctx.fillStyle = i % 2 ? '#4e5236' : '#5a5e3e'; ctx.fillRect(jx, y - 16 * s, 8 * s, 16 * s); ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(jx + 1, y - 15 * s, 1.4 * s, 14 * s); } }
function ddpM8Chunk(x, y, r, rot, kind) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = kind === 0 ? '#2a2420' : kind === 1 ? '#5a4628' : '#3a3c30'; ctx.beginPath(); ctx.moveTo(-r, -r * .4); ctx.lineTo(-r * .2, -r); ctx.lineTo(r, -r * .3); ctx.lineTo(r * .6, r * .8); ctx.lineTo(-r * .7, r * .6); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,170,80,.35)'; ctx.fillRect(-r * .3, -r * .6, r * .5, r * .3); ctx.restore(); }
function ddpM8ShotD(u, hv) {
    const P = ddpEnsure(), land = 2.4, ld = u - land;
    cs2Once('m8whistle', u > .1, function () { playTone(2400, 260, 2.3, .045, 'sine'); }); cs2Once('m8land', ld > 0, function () { playExplosionSound(2.4); playDistantArtillery(); setTimeout(function () { try { playExplosionSound(1.2); } catch (e) {} }, 350); });
    const punch = ld > 0 ? Math.max(0, .06 * (1 - ld / .6)) : 0, sh = ddpShakeAt(u, ld > 0 ? Math.max(0, 16 * (1 - ld / 1.8)) + 1 : .3);
    ctx.save(); ddpCam(hv, sh[0], sh[1], 1.02 + punch + Math.max(0, u) * .006, ld > 0 ? Math.sin(ld * 20) * .01 * Math.max(0, 1 - ld) : 0);
    const hz = hv * .4, shore = hv * .56, ix = 960, iy = hv * .67;
    // sky, clouds, low sun
    ddpSky(hz, u + 19, 0, 300, .7, .1, DDP_M8PAL); ddpM8Clouds(hz, u + 19);
    // sea, fleet, balloons
    ddpSea(hz, shore, u, 300, 1, .25);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 26; i++) { const y = hz + 3 + i * i * .22; ctx.fillStyle = 'rgba(255,190,130,' + (.22 - i * .007) + ')'; ctx.fillRect(300 - 26 - i * 3 + Math.sin(u * 2 + i) * 6, y, 52 + i * 6, 2); } ctx.restore();
    for (let i = 0; i < 11; i++) ddpShip(60 + i * 150 + ddpR(i) * 40, hz + 4 + ddpR(i + 1) * 16, 70 + ddpR(i + 2) * 110, i % 3, (i === 4 && (u * 3) % 4 < .2) ? 1 : 0, .55, u);
    for (let i = 0; i < 7; i++) { const bx = 90 + i * 230, by = hz - 70 - ddpR(i) * 60 + Math.sin(u + i) * 4; ctx.strokeStyle = 'rgba(30,26,34,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 14, hz + 30); ctx.stroke(); ctx.fillStyle = 'rgba(56,52,66,.9)'; ctx.beginPath(); ctx.ellipse(bx, by, 16, 7, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,190,140,.35)'; ctx.beginPath(); ctx.ellipse(bx - 3, by - 3, 10, 2.4, 0, 0, 7); ctx.fill(); }
    ddpBoatSide(260, shore - 2, .95, u, { seed: 2, haze: .35 }); ddpBoatSide(1380, shore + 2, 1.1, u, { seed: 5, haze: .3 });
    // wet sand, foam, beach
    const bg = ctx.createLinearGradient(0, shore, 0, hv); bg.addColorStop(0, 'rgb(96,84,72)'); bg.addColorStop(.12, 'rgb(150,122,94)'); bg.addColorStop(.5, 'rgb(124,100,76)'); bg.addColorStop(1, 'rgb(58,46,38)'); ctx.fillStyle = bg; ctx.fillRect(-800, shore, 3200, hv);
    ctx.strokeStyle = 'rgba(240,236,220,.55)'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = -800; x < 2400; x += 20) ctx.lineTo(x, shore + 2 + Math.sin(x * .02 + u * 2) * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,200,150,.12)'; ctx.fillRect(-800, shore + 4, 3200, 10);
    ctx.strokeStyle = 'rgba(50,40,30,.35)'; ctx.lineWidth = 5; [[-200, hv * .72, 1800, hv * .64], [-200, hv * .8, 1900, hv * .7]].forEach(function (t) { [-9, 9].forEach(function (o) { ctx.beginPath(); ctx.moveTo(t[0], t[1] + o); ctx.quadraticCurveTo(800, (t[1] + t[3]) / 2 + 20 + o, t[2], t[3] + o); ctx.stroke(); }); });
    for (let i = 0; i < 70; i++) { const x = ddpR(i * 3.1) * 1900 - 150, y = shore + 20 + ddpR(i * 5.3) * (hv - shore - 20); ctx.fillStyle = 'rgba(40,30,20,' + (.15 + ddpR(i) * .2) + ')'; ctx.beginPath(); ctx.ellipse(x, y, 6 + ddpR(i + 1) * 14, 2 + ddpR(i + 2) * 4, 0, 0, 7); ctx.fill(); }
    [[120, hv * .6, .55], [520, hv * .6, .5], [1520, hv * .61, .6], [1240, hv * .63, .5]].forEach(function (h) { ddpHedgehog(h[0], h[1], h[2], .25); });
    // wire on the dune line
    ctx.strokeStyle = 'rgba(40,36,30,.6)'; ctx.lineWidth = 1; for (let x = -100; x < 1800; x += 14) { ctx.beginPath(); ctx.ellipse(x, hv * .585, 9, 6, 0, 0, 7); ctx.stroke(); }
    // the supply dump (ground zero) and what's around it
    const hit = ld > 0, fl = hit ? Math.min(1, ld / .5) : 0;
    if (!hit || ld < .08) { ddpM8Crates(ix - 90, iy + 6, 1.1, 3); ddpM8Crates(ix + 40, iy + 10, 1, 9); }
    if (hit) { ctx.fillStyle = 'rgba(20,14,10,.8)'; ctx.beginPath(); ctx.ellipse(ix, iy + 10, 150 * fl, 26 * fl, 0, 0, 7); ctx.fill(); }
    // vehicles
    const tx = 760 - (hit ? 0 : 0); if (!hit) ddpTruck(tx, iy + 18, .62, u, { move: 0 }); else { const k = Math.min(ld, 2.4), vx = -160, vy = -520, gr = 520, px = tx + vx * k, py = iy + 18 + vy * k + gr * k * k; if (py < iy + 40) { ctx.save(); ctx.translate(px, py); ctx.rotate(-k * 2.6); ddpTruck(0, 0, .62, u, { move: 0 }); ctx.restore(); ddpFire(px, py - 20, .5, u, 3); } else { ctx.save(); ctx.translate(px, iy + 40); ctx.rotate(Math.PI * .9); ddpTruck(0, 0, .62, u, { move: 0 }); ctx.restore(); ddpFire(px, iy + 30, .7, u, 4); } }
    ddpJeep(1300 - Math.min(u, land) * 60 + (hit ? Math.min(ld, 1) * 80 : 0), hv * .73, .55, u, {});
    ddpSherman(380 + Math.min(u, land + .4) * 40, hv * .78, .62, u, { skin: ddpPlayerSkin() });
    // men on the beach
    const men = [[600, .74, 1, 0], [690, .70, -1, 1], [1080, .70, 1, 2], [1150, .76, -1, 3], [1230, .69, 1, 4], [860, .77, 1, 5], [470, .70, -1, 6], [1420, .74, -1, 7], [300, .76, 1, 8], [1000, .80, -1, 9]];
    men.forEach(function (m) { const mx0 = m[0] + (hit ? 0 : u * 22 * m[2]), my = hv * m[1], d = mx0 - ix; let fall = 0, px = mx0, py = my;
        if (hit) { const near = Math.max(0, 1 - Math.abs(d) / 560), k = Math.min(1, ld * (2 + near * 4)); fall = k * (near > .15 ? 1 : .6); const push = near * 260 * Math.min(1, ld * 1.6); px = mx0 + Math.sign(d || 1) * push; py = my - Math.sin(Math.min(1, ld * 1.6) * Math.PI) * near * 90; }
        const crouch = !hit && u > 1.5 ? 1 : 0; ddpMan(px, py, 1.25, u + m[3], { dir: hit ? -Math.sign(d || 1) : m[2], run: hit ? 0 : crouch ? 0 : .8, crouch: crouch, fall: fall, haze: .12 }); });
    // the shell coming in
    if (!hit && u > 1.2) { const q = (u - 1.2) / (land - 1.2), x0 = ix - 1100, y0 = -380, sx = cs2L(x0, ix, q), sy = cs2L(y0, iy, q), ang = Math.atan2(iy - y0, ix - x0);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; const tl = 360; const g = ctx.createLinearGradient(sx - Math.cos(ang) * tl, sy - Math.sin(ang) * tl, sx, sy); g.addColorStop(0, 'rgba(255,220,180,0)'); g.addColorStop(1, 'rgba(255,230,200,.55)'); ctx.strokeStyle = g; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(sx - Math.cos(ang) * tl, sy - Math.sin(ang) * tl); ctx.lineTo(sx, sy); ctx.stroke(); ctx.restore();
        ddpBigShell(sx, sy, .42 + q * .2, ang); ddpFlashGlow(sx, sy, 50, .35); }
    // ---- impact
    if (hit) {
        const k = ld, P2 = P;
        if (k < .25) ddpFlashGlow(ix, iy, 1500 * (1 - k / .25) + 300, 1);
        // condensation dome + ground surge
        if (k < 1.1) { const R = 120 + k * 1100, a = Math.max(0, .45 * (1 - k / 1.1)); ctx.fillStyle = 'rgba(255,248,236,' + a * .35 + ')'; ctx.beginPath(); ctx.ellipse(ix, iy, R, R * .55, 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = 'rgba(255,250,240,' + a + ')'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(ix, iy, R, R * .55, 0, Math.PI, 0); ctx.stroke(); ctx.strokeStyle = 'rgba(255,240,220,' + a * .8 + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(ix, iy + 8, R * 1.05, R * .09, 0, 0, 7); ctx.stroke(); }
        // ground surge of sand rolling outwards
        const sR = Math.min(1, k / 1.8); for (let i = 0; i < 26; i++) { const side = i % 2 ? 1 : -1, q = (i / 26) * sR, r = 50 + q * 120; ctx.globalAlpha = .7 * (1 - q * .5) * Math.min(1, k * 4); ctx.drawImage(P2.dust, ix + side * q * 900 - r, iy + 20 - r * .6 + q * 30, r * 2, r * 1.2); } ctx.globalAlpha = 1;
        // the column
        const up = 1 - Math.pow(1 - Math.min(1, k / 2.4), 2.2), H = 640 * up, wid = 70 + up * 90;
        for (let i = 0; i < 18; i++) { const q = i / 17, r = wid * (.7 + q * .5) * (.6 + up * .5), x = ix + Math.sin(i * 2.3 + k * 1.4) * 18 * q, y = iy - q * H; ctx.globalAlpha = .9; ctx.drawImage(i % 4 === 0 ? P2.dark : i % 4 === 1 ? P2.smoke : P2.dust, x - r, y - r, r * 2, r * 2); }
        const cap = 150 + up * 230; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + k * .4, r = cap * (.45 + ddpR(i) * .2), x = ix + Math.cos(a) * cap * .62, y = iy - H + Math.sin(a) * cap * .2 - Math.abs(Math.cos(a)) * 10; ctx.globalAlpha = .85; ctx.drawImage(i % 3 ? P2.smoke : P2.dark, x - r, y - r * .75, r * 2, r * 1.5); } ctx.globalAlpha = .8; ctx.drawImage(P2.dark, ix - cap * .7, iy - H - cap * .5, cap * 1.4, cap); ctx.globalAlpha = 1;
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fa = Math.max(0, 1 - k / 2.6); ctx.globalAlpha = fa; ctx.drawImage(P2.fire, ix - 260 * Math.min(1, k * 3), iy - 300 * Math.min(1, k * 3), 520 * Math.min(1, k * 3), 380 * Math.min(1, k * 3)); ctx.globalAlpha = fa * .6; ctx.drawImage(P2.fire, ix - cap * .5, iy - H * .45 - cap * .3, cap, cap * .9); ctx.globalAlpha = fa * .35; ctx.drawImage(P2.warm || P2.fire, ix - cap, iy - H - cap * .4, cap * 2, cap); if (k < .4) { ctx.globalAlpha = 1 - k / .4; ctx.drawImage(P2.white, ix - 160, iy - 200, 320, 260); } ctx.restore(); ctx.globalAlpha = 1;
        if (k > .4) ddpFire(ix - 40, iy + 10, .75, u, 7); if (k > .6) ddpFire(ix + 70, iy + 14, .6, u, 11);
        // debris with smoke trails, some splashing into the sea
        for (let i = 0; i < 30; i++) { const a = -Math.PI / 2 + (ddpR(i + 9) - .5) * 2.6, v = 380 + ddpR(i) * 620, g = 620, dk = Math.min(k, 3), vx = Math.cos(a) * v, vy = Math.sin(a) * v; const x = ix + vx * dk, y = iy + vy * dk + g * dk * dk;
            const tland = (-vy + Math.sqrt(vy * vy + 4 * g * 0)) / g * 1.05; if (dk > tland) { if (ddpR(i + 3) > .6) { const lx = ix + vx * tland; if (lx < -100 || lx > 1700) continue; ddpGeyser(lx, shore + 6 + ddpR(i) * 10, .25 + ddpR(i + 1) * .25, dk - tland, i); } continue; }
            for (let j = 1; j < 6; j++) { const tt = Math.max(0, dk - j * .06); ctx.globalAlpha = .35 * (1 - j / 6); const r = 6 + j * 4; ctx.drawImage(P2.smoke, ix + vx * tt + 0 - r, iy + vy * tt + g * tt * tt - r, r * 2, r * 2); } ctx.globalAlpha = 1;
            ddpM8Chunk(x, y, 3 + ddpR(i + 5) * 7, dk * (4 + i % 5), i % 3); if (i % 4 === 0) ddpFlashGlow(x, y, 16, .5); }
        // the dust wall reaching the camera
        if (k > .7) { const q = Math.min(1, (k - .7) / 2.2); for (let i = 0; i < 16; i++) { const x = -100 + i * 120, r = 120 + q * 220 + ddpR(i) * 60; ctx.globalAlpha = q * .55; ctx.drawImage(P2.dust, x - r, hv - q * 420 - r * .5 + ddpR(i + 4) * 40, r * 2, r * 1.2); } ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(120,96,70,' + q * .35 + ')'; ctx.fillRect(-800, -400, 3200, hv + 800); }
    }
    // foreground: sandbagged position, two men watching
    ddpBack(210, hv * .82, 2.3, u, { turn: hit ? -.6 : u > 1.4 ? .5 : 0, haze: 0 }); ddpBack(1420, hv * .84, 2.5, u + 1, { turn: hit ? .7 : u > 1.6 ? -.4 : 0, ph: 1 }); ddpM3Sandbags(-160, 1760, hv * .93, 3, 1.7);
    ctx.restore();
    return hit && ld < .15 ? .9 : 0;
}
function ddpM8Scene5(t0, u, w, h) { // background for the order: dusk hills, the tunnel far off, our tanks moving up
    const U = w / 1600, hv = h / U; ctx.save(); ctx.scale(U, U);
    const hz = hv * .58; ddpSky(hz + 60, t0, 0, 1200, .6, 0, DDP_M8PAL); ddpM8Clouds(hz - 60, t0);
    const tp = ddpTunnelCliff(hz, t0, 200, { lamps: true }); ddpFlashGlow(tp.px, tp.py - 80, 200, .25 + .1 * Math.sin(t0 * 3)); ctx.save(); ctx.beginPath(); ctx.rect(tp.px - 150, tp.py - 250, 300, 250); ctx.clip(); ddpGustav(tp.px + 60, tp.py, .45, t0, { el: .55, haze: .5 }); ctx.restore();
    const g = ctx.createLinearGradient(0, hz + 20, 0, hv); g.addColorStop(0, 'rgb(70,56,56)'); g.addColorStop(1, 'rgb(20,16,18)'); ctx.fillStyle = g; ctx.fillRect(-800, hz + 20, 3200, hv);
    const go = cs2C((u - 1.0) / 6, 0, 1); [[0, 0], [-105, 16], [-200, -8], [-300, 12], [-395, -2]].forEach(function (q, i) { const x = 700 + go * 420 + q[0], y = hv * .86 + q[1]; ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(x, y + 2, 26, 5, 0, 0, 7); ctx.fill(); ddpMan(x, y, 2.4, t0 + i * .37, { run: go > 0 && go < 1 ? .55 : 0, crouch: 1, haze: .15 }); });
    ctx.restore(); ddpBloom(w, h); return 0;
}
function ddpM8Frame(t, w, h) {
    const U = w / 1600, hv = h / U, c = M8CS.cuts; let flash = 0; DDP.ok = true;
    ctx.save(); ctx.scale(U, U);
    if (t < c[0]) ddpM8ShotA(t, hv); else if (t < c[1]) ddpM8ShotB(t - c[0], hv); else if (t < c[2]) flash = ddpM8ShotC(t - c[1], hv); else flash = ddpM8ShotD(t - c[2], hv);
    ctx.restore(); ddpBloom(w, h); return flash;
}
function m8Shot5(t0, w, h) {
    const u = t0 - M8CS.cuts[3];
    cs2Once('m8rad', u > .6, function () { playTone(1100, 900, .12, .05, 'square'); });
    const stampT = 4.6, sd = u - stampT; cs2Once('m8stamp', sd > 0, function () { playExplosionSound(1.1); playTone(180, 50, .4, .1, 'square'); });
    let shake = 0, flash = 0; if (sd > 0 && sd < .5) { shake = Math.pow(1 - sd / .5, 2) * 10; if (sd < .08) flash = .5 * (1 - sd / .08); }
    ctx.save(); ctx.translate(w / 2, h / 2); const z = 1.0 + u * .005; ctx.scale(z, z); ctx.translate(-w / 2 + Math.sin(u * 70) * shake, -h / 2 + Math.cos(u * 55) * shake);
    ctx.save(); ddpM8Scene5(t0, u, w, h); ctx.restore();
    const cp = cs2C((u - .2) / 1.0, 0, 1); m2csCommander(w * .26, h * .68, 1.5, t0, cp);
    ctx.restore();
    const rp = cs2C((u - .8) / .5, 0, 1);
    if (rp > 0) {
        ctx.save(); ctx.globalAlpha = rp; ctx.fillStyle = 'rgba(8,10,6,.86)'; ctx.fillRect(w - 470, 90, 430, 150); ctx.strokeStyle = '#7e8355'; ctx.lineWidth = 2; ctx.strokeRect(w - 470, 90, 430, 150);
        ctx.fillStyle = '#9fb27a'; ctx.font = '700 12px monospace'; ctx.textAlign = 'left'; ctx.fillText('● RADIO · 38.4 MHz · CHANNEL 3', w - 454, 112);
        for (let i = 0; i < 40; i++) { const bh = 3 + Math.abs(Math.sin(u * 14 + i * 1.7) * Math.sin(u * 5 + i * .6)) * (u < 4.2 ? 20 : 3); ctx.fillStyle = 'rgba(140,200,110,.85)'; ctx.fillRect(w - 454 + i * 9.7, 136 - bh / 2, 6, bh); }
        const msg = 'HQ: "NO TANK WILL GET NEAR IT. TAKE YOUR SECTION IN AFTER DARK, BOARD THE GUN AND BLOW IT FROM THE INSIDE."', n = Math.min(msg.length, Math.floor((u - .9) * 30));
        ctx.fillStyle = '#e7edc9'; ctx.font = '13px "Special Elite", "Courier New", monospace'; const words = msg.slice(0, Math.max(0, n)).split(' '); let line = '', yy = 164; words.forEach(function (wd) { if ((line + wd).length > 42) { ctx.fillText(line, w - 454, yy); line = ''; yy += 18; } line += wd + ' '; }); ctx.fillText(line, w - 454, yy);
        ctx.restore();
    }
    if (sd > 0) {
        const k = cs2C(sd / .22, 0, 1), sc = cs2L(3.2, 1, cs2E(k)) * (1 + (sd < .45 ? Math.sin(sd * 30) * .02 : 0)), fade = cs2C((M8CS.dur - 1 - t0) / .6, 0, 1);
        ctx.save(); ctx.translate(w / 2, h * .46); ctx.rotate(-.045); ctx.scale(sc, sc); ctx.globalAlpha = k * fade;
        ctx.fillStyle = 'rgba(8,8,5,.86)'; ctx.fillRect(-w, -88, w * 2, 176);
        const tape = function (y) { ctx.save(); ctx.beginPath(); ctx.rect(-w, y, w * 2, 15); ctx.clip(); ctx.fillStyle = '#d6a91c'; ctx.fillRect(-w, y, w * 2, 15); ctx.fillStyle = '#16140f'; for (let x = -w - 40; x < w + 40; x += 40) { ctx.beginPath(); ctx.moveTo(x, y + 15); ctx.lineTo(x + 20, y + 15); ctx.lineTo(x + 34, y); ctx.lineTo(x + 14, y); ctx.closePath(); ctx.fill(); } ctx.restore(); };
        tape(-88); tape(73);
        ctx.textAlign = 'center'; ctx.fillStyle = '#d9c88c'; ctx.font = '700 15px "Special Elite", "Courier New", monospace'; ctx.fillText('— ACT II · COMMANDO RAID · MISSION 8 —', 0, -48);
        ctx.fillStyle = '#f4ecd0'; ctx.strokeStyle = '#000'; ctx.lineWidth = 7; ctx.font = '700 70px "Stardos Stencil", Impact, sans-serif'; ctx.strokeText('SCHWERER GUSTAV', 0, 22); ctx.fillText('SCHWERER GUSTAV', 0, 22);
        ctx.fillStyle = '#e8c968'; ctx.font = '700 17px "Special Elite", "Courier New", monospace'; ctx.fillText('OPERATION DEADFALL.', 0, 54);
        ctx.restore();
    }
    return flash;
}
function drawM8Cutscene(now) {
    if (!campaignCutsceneRunning) return;
    const t = (now - campaignCutsceneStart) / 1000, w = canvas.width, h = canvas.height;
    if (t < .05) { M2CS.fired = {}; try { initAudio(); } catch (e) {} }
    if (!CS2.grain) CS2.grain = cs2Grain();
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    let flash = 0;
    try { if (t < M8CS.cuts[3]) flash = ddpM8Frame(t, w, h); else flash = m8Shot5(t, w, h); } catch (e) { DDP.err = e; ctx.setTransform(1, 0, 0, 1, 0, 0); }
    M8CS.cuts.forEach(function (c) { const d = t - c; if (d >= 0 && d < .16) flash = Math.max(flash, .5 * (1 - d / .16)); });
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(150,120,140,.14)'; ctx.fillRect(0, 0, w, h); ctx.restore();
    ctx.save(); ctx.globalAlpha = .09; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    if (Math.random() < .3) { ctx.fillStyle = 'rgba(255,245,220,.10)'; ctx.fillRect(Math.random() * w, 0, 1.4, h); }
    const vg = ctx.createRadialGradient(w / 2, h * .52, w * .24, w / 2, h * .52, w * .74); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    if (flash > 0) { ctx.fillStyle = 'rgba(255,238,200,' + Math.min(.8, flash) + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = Math.round(h * .062 * cs2E(t / .9)); ctx.fillStyle = '#050605'; ctx.fillRect(0, 0, w, bar); ctx.fillRect(0, h - bar - 26, w, bar + 26);
    const ta = cs2C(Math.min((t - .6) / .8, (4.6 - t) / .8), 0, 1);
    if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, h * .2, w, 124);
        ctx.fillStyle = '#d9c88c'; ctx.font = '700 15px "Special Elite", "Courier New", monospace'; ctx.fillText('— OPERATION OVERLORD · ACT II —', w / 2, h * .2 + 30);
        ctx.fillStyle = '#f4ecd0'; ctx.font = '700 52px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('THE GUN IN THE MOUNTAIN', w / 2, h * .2 + 80);
        ctx.font = '15px "Special Elite", "Courier New", monospace'; ctx.fillStyle = '#d9c88c'; ctx.fillText('13 JUNE 1944   ·   D+7   ·   20:50   ·   THE HILLS SOUTH OF BAYEUX', w / 2, h * .2 + 108); ctx.restore(); }
    const caps = [[4.8, 'THE BEACHHEAD HAS BEEN SHELLED FOR THREE DAYS.'], [7.0, 'THE GERMANS CALL IT GUSTAV.'], [9.4, 'EACH SHELL WEIGHS SEVEN TONNES.'], [12.8, 'IT HIDES IN A RAILWAY TUNNEL IN THE HILLS.'], [15.4, 'IT COMES OUT ONLY TO FIRE.'], [18.9, 'TWENTY-NINE MILES AWAY. IT NEVER MISSES THE BEACH.'], [21.4, 'THE TRAIN YOU STOPPED WAS FEEDING IT.'], [24.0, 'THE ORDER COMES OVER THE RADIO.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; });
    if (ci >= 0 && t < M8CS.dur - .8 && !(t > M8CS.cuts[3] + 4.3)) { const c = caps[ci], n = Math.min(c[1].length, Math.floor((t - c[0]) * 34)), txt = c[1].slice(0, n) + (Math.floor(t * 3) % 2 && n < c[1].length ? '▌' : ''); ctx.textAlign = 'center'; ctx.fillStyle = '#efe6c6'; ctx.font = '700 16px "Special Elite", "Courier New", monospace'; ctx.fillText(txt, w / 2, h - bar - 26 + bar * .62 + 4); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8);
    const fa = Math.max(cs2C(1 - t / 1.0, 0, 1), cs2C((t - (M8CS.dur - 1)) / 1, 0, 1)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + fa + ')'; ctx.fillRect(0, 0, w, h); }
    if (t < M8CS.dur) campaignCutsceneFrame = requestAnimationFrame(drawM8Cutscene); else finishCampaignCutscene();
}
