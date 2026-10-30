/* ---------- people ---------- */
function ddpMan(x, y, s, t, o) { // side view soldier, feet at (x,y), facing right (dir:-1 flips)
    o = o || {}; const dir = o.dir || 1, run = o.run === undefined ? 1 : o.run, ph = (o.ph || 0) + t * (o.spd || 9) * run, haze = o.haze || 0;
    const ger = !!o.ger, olive = ddpRGB(ddpMix(ger ? [96, 100, 90] : [88, 90, 60], [150, 156, 146], haze)), dk = ddpRGB(ddpMix(ger ? [40, 44, 40] : [46, 48, 32], [104, 110, 106], haze)), lt = ddpRGB(ddpMix([168, 160, 112], [200, 202, 190], haze)), skin = ddpRGB(ddpMix([168, 130, 98], [170, 170, 160], haze)), boot = ddpRGB(ddpMix([30, 26, 20], [96, 100, 98], haze));
    ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
    const fall = o.fall || 0; if (fall > 0) { ctx.rotate(-fall * 1.4); ctx.translate(-fall * 4, fall * 12); }
    const sw = Math.sin(ph) * run, bob = Math.abs(Math.cos(ph)) * 2.4 * run, hip = [0, -30 + bob];
    function leg(a, kn) { const kx = hip[0] + Math.sin(a) * 15, ky = hip[1] + Math.cos(a) * 15, a2 = a - kn - .1, fx = kx + Math.sin(a2) * 15, fy = ky + Math.cos(a2) * 15; ctx.lineCap = 'round'; ctx.lineWidth = 6.4; ctx.strokeStyle = olive; ctx.beginPath(); ctx.moveTo(hip[0], hip[1]); ctx.lineTo(kx, ky); ctx.stroke(); ctx.lineWidth = 5.6; ctx.strokeStyle = dk; ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke(); ctx.fillStyle = boot; ctx.beginPath(); ctx.ellipse(fx + 2.5, fy + 1, 5, 2.6, 0, 0, 7); ctx.fill(); }
    leg(-sw * .95, Math.max(0, sw) * 1.5); leg(sw * .95, Math.max(0, -sw) * 1.5);
    const lean = .14 + .22 * run + (o.crouch || 0) * .35, sh = [hip[0] + Math.sin(lean) * 22, hip[1] - Math.cos(lean) * 22];
    ctx.fillStyle = dk; ctx.save(); ctx.translate(sh[0] - 9, sh[1] + 8); ctx.rotate(lean * .6); ctx.fillRect(-5, -2, 10, 20); ctx.restore();           // pack
    ctx.lineWidth = 12; ctx.strokeStyle = olive; ctx.beginPath(); ctx.moveTo(hip[0] - 1, hip[1] + 1); ctx.lineTo(sh[0], sh[1]); ctx.stroke();           // torso
    ctx.lineWidth = 1.4; ctx.strokeStyle = dk; ctx.beginPath(); ctx.moveTo(sh[0] - 3, sh[1] + 1); ctx.lineTo(hip[0] + 3, hip[1] - 4); ctx.stroke();
    const hd = [sh[0] + 3, sh[1] - 8];
    ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(hd[0] + 1, hd[1] + 1, 4.2, 0, 7); ctx.fill();
    ctx.fillStyle = olive; ctx.beginPath(); ctx.ellipse(hd[0], hd[1] - 1.5, 6.8, 5.2, -.08, Math.PI, 0); ctx.lineTo(hd[0] + 8, hd[1] + .3); ctx.lineTo(hd[0] - 6.4, hd[1] + .3); ctx.closePath(); ctx.fill();
    if (ger) { ctx.fillStyle = dk; ctx.beginPath(); ctx.moveTo(hd[0] - 6.6, hd[1] - 2); ctx.lineTo(hd[0] - 10, hd[1] + 4); ctx.lineTo(hd[0] - 3, hd[1] + 1.6); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = dk; ctx.fillRect(hd[0] - 6.4, hd[1] - .6, 15, 1.5); ctx.globalAlpha = .5; for (let i = 0; i < 6; i++) ctx.fillRect(hd[0] - 4 + i * 2, hd[1] - 5.6 + (i % 2) * 2, 1, 1); ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(hd[0] + 1, hd[1] + .8, 4, 3);
    ctx.fillStyle = lt; ctx.globalAlpha = .6; ctx.fillRect(hd[0] - 4, hd[1] - 6.4, 7, 1.1); ctx.globalAlpha = 1;
    // rifle + arms
    if (o.carry) { const c0 = [sh[0] - 5, sh[1] + 16], c1 = [sh[0] + 21, sh[1] + 1]; ctx.lineCap = 'round'; ctx.lineWidth = 6; ctx.strokeStyle = '#b8902a'; ctx.beginPath(); ctx.moveTo(c0[0], c0[1]); ctx.lineTo(c1[0] - 6, c1[1] + 2); ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#4a3a1c'; ctx.beginPath(); ctx.moveTo(c1[0] - 6, c1[1] + 2); ctx.lineTo(c1[0] + 5, c1[1] - 2); ctx.stroke(); ctx.lineWidth = 4.6; ctx.strokeStyle = olive; ctx.beginPath(); ctx.moveTo(sh[0] + 1, sh[1] + 3); ctx.lineTo(sh[0] + 6, sh[1] + 9); ctx.stroke(); }
    else {
    const aim = o.aim || 0, rb = aim ? [sh[0] + 4, sh[1] + 4] : [sh[0] + 1, sh[1] + 13], rt = aim ? [sh[0] + 34, sh[1] + 2 - (o.rifleUp || 0)] : [sh[0] + 24, sh[1] - 4 + sw * 2];
    ctx.lineCap = 'round'; ctx.lineWidth = 3.6; ctx.strokeStyle = '#1b1612'; ctx.beginPath(); ctx.moveTo(rb[0] - (aim ? 6 : 4), rb[1] + (aim ? 2 : 6)); ctx.lineTo(rt[0], rt[1]); ctx.stroke();
    ctx.lineWidth = 4.6; ctx.strokeStyle = olive; ctx.beginPath(); ctx.moveTo(sh[0] + 1, sh[1] + 3); ctx.lineTo(rb[0] + (rt[0] - rb[0]) * .62, rb[1] + (rt[1] - rb[1]) * .62); ctx.stroke();
    ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(rb[0] + (rt[0] - rb[0]) * .62, rb[1] + (rt[1] - rb[1]) * .62, 2.2, 0, 7); ctx.fill();
    }
    ctx.restore();
}
function ddpFront(x, y, s, t, o) { // soldier running straight at the camera, feet at (x,y); ~64 units tall at s=1
    o = o || {}; const run = o.run === undefined ? 1 : o.run, ph = (o.ph || 0) + t * (o.spd || 8) * run, haze = o.haze || 0;
    const olive = ddpRGB(ddpMix([84, 86, 58], [150, 156, 146], haze)), dk = ddpRGB(ddpMix([42, 44, 30], [104, 110, 106], haze)), skin = ddpRGB(ddpMix([176, 136, 104], [170, 170, 160], haze)), boot = ddpRGB(ddpMix([26, 22, 18], [96, 100, 98], haze));
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const fall = o.fall || 0; if (fall > 0) { ctx.rotate((o.fallDir || 1) * fall * 1.3); ctx.translate(0, fall * 16); }
    const bob = Math.abs(Math.sin(ph)) * 3 * run, sway = Math.sin(ph) * 2.2 * run, l1 = Math.max(0, Math.sin(ph)) * 7 * run, l2 = Math.max(0, -Math.sin(ph)) * 7 * run;
    ctx.lineCap = 'round'; ctx.lineWidth = 7.4; ctx.strokeStyle = olive; ctx.beginPath(); ctx.moveTo(-4, -30 - bob); ctx.lineTo(-6, -4 - l1); ctx.moveTo(4, -30 - bob); ctx.lineTo(6, -4 - l2); ctx.stroke();
    ctx.fillStyle = boot; ctx.beginPath(); ctx.ellipse(-6, -2 - l1, 5, 3.2, 0, 0, 7); ctx.ellipse(6, -2 - l2, 5, 3.2, 0, 0, 7); ctx.fill();
    ctx.save(); ctx.translate(sway, -bob);
    ctx.fillStyle = olive; ctx.beginPath(); ctx.moveTo(-10, -28); ctx.lineTo(-12, -54); ctx.quadraticCurveTo(0, -59, 12, -54); ctx.lineTo(10, -28); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = dk; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-11, -52); ctx.lineTo(9, -30); ctx.moveTo(11, -52); ctx.lineTo(-9, -30); ctx.stroke();
    ctx.fillStyle = dk; ctx.fillRect(-11, -34, 22, 3);
    // arms across rifle
    ctx.lineWidth = 3.4; ctx.strokeStyle = '#1b1612'; ctx.beginPath(); ctx.moveTo(-10, -30); ctx.lineTo(11, -52); ctx.stroke();
    ctx.lineWidth = 4.6; ctx.strokeStyle = olive; ctx.beginPath(); ctx.moveTo(-12, -52); ctx.lineTo(-4, -40); ctx.moveTo(12, -52); ctx.lineTo(7, -44); ctx.stroke();
    ctx.fillStyle = ddpRGB(ddpMix([120, 92, 70], [170, 170, 160], haze)); ctx.beginPath(); ctx.arc(-4, -40, 1.9, 0, 7); ctx.arc(7, -44, 1.9, 0, 7); ctx.fill();
    // head
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(0, -62, 4.6, 5.4, 0, 0, 7); ctx.fill();
    ctx.fillStyle = olive; ctx.beginPath(); ctx.ellipse(0, -64.5, 8.6, 6.2, 0, Math.PI, 0); ctx.lineTo(9.6, -63); ctx.lineTo(-9.6, -63); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(-7, -63.2, 14, 4.4);             // eyes in shadow
    ctx.fillStyle = dk; ctx.fillRect(-9.6, -63.6, 19.2, 1.6); ctx.globalAlpha = .45; for (let i = 0; i < 7; i++) ctx.fillRect(-6 + i * 2, -69 + (i % 2) * 2, 1, 1); ctx.globalAlpha = 1;
    ctx.strokeStyle = dk; ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(-4.4, -59); ctx.lineTo(-2, -56); ctx.moveTo(4.4, -59); ctx.lineTo(2, -56); ctx.stroke();
    ctx.restore(); ctx.restore();
}
function ddpBack(x, y, s, t, o) { // soldier seen from behind, shoulder line at (x,y); helmet above it
    o = o || {}; const haze = o.haze || 0, sway = Math.sin(t * (o.spd || 3) + (o.ph || 0)) * 1.4 * s;
    const olive = ddpRGB(ddpMix([56, 60, 42], [140, 146, 136], haze)), dk = ddpRGB(ddpMix([14, 16, 11], [90, 96, 92], haze)), mid = ddpRGB(ddpMix([34, 38, 26], [116, 122, 114], haze));
    ctx.save(); ctx.translate(x + sway, y); ctx.scale(s, s);
    ctx.fillStyle = mid; ctx.fillRect(-20, 8, 40, 60);                                    // torso (continues under the water)
    ctx.fillStyle = olive; ctx.beginPath(); ctx.moveTo(-22, 12); ctx.quadraticCurveTo(-18, -4, 0, -5); ctx.quadraticCurveTo(18, -4, 22, 12); ctx.lineTo(20, 30); ctx.lineTo(-20, 30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mid; ctx.fillRect(-13, 8, 26, 34); ctx.fillStyle = dk; ctx.fillRect(-13, 38, 26, 4); ctx.fillStyle = olive; ctx.fillRect(-13, 8, 26, 3); ctx.fillRect(-11, 14, 9, 14); ctx.fillRect(2, 14, 9, 14); ctx.fillStyle = dk; ctx.fillRect(-1, 8, 2, 34); ctx.globalAlpha = .5; ctx.fillRect(-11, 20, 9, 1.2); ctx.fillRect(2, 20, 9, 1.2); ctx.globalAlpha = 1;   // pack
    ctx.fillStyle = olive; ctx.beginPath(); ctx.ellipse(0, 6, 15, 5, 0, Math.PI, 0); ctx.fill();                                   // blanket roll
    ctx.strokeStyle = dk; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-14, 8); ctx.lineTo(-22, 26); ctx.moveTo(14, 8); ctx.lineTo(22, 26); ctx.stroke();
    ctx.lineWidth = 3.4; ctx.strokeStyle = '#17120e'; ctx.beginPath(); ctx.moveTo(-24, 2); ctx.lineTo(18, 40); ctx.stroke();                 // slung rifle
    ctx.fillStyle = dk; ctx.fillRect(-4.5, -13, 9, 9);                                                                              // neck
    ctx.translate((o.turn || 0) * 3.2, 0); ctx.rotate((o.turn || 0) * .08);
    ctx.fillStyle = olive; ctx.beginPath(); ctx.ellipse(0, -15, 13.4, 11.4, 0, Math.PI, 0); ctx.lineTo(14.6, -12); ctx.quadraticCurveTo(0, -8, -14.6, -12); ctx.closePath(); ctx.fill(); // helmet
    ctx.fillStyle = dk; ctx.beginPath(); ctx.moveTo(-14.6, -12); ctx.quadraticCurveTo(0, -8, 14.6, -12); ctx.lineTo(14.6, -10); ctx.quadraticCurveTo(0, -5.6, -14.6, -10); ctx.fill();
    ctx.globalAlpha = .5; for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 3 ? dk : '#7a7a52'; ctx.fillRect(-10 + (i * 7 % 21), -24 + ((i * 5) % 9), 1.6, 1.6); } ctx.globalAlpha = 1;
    ctx.strokeStyle = dk; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-12, -11); ctx.lineTo(-13, -5); ctx.moveTo(12, -11); ctx.lineTo(13, -5); ctx.stroke();   // strap
    if (o.rim) { ctx.fillStyle = 'rgba(255,214,150,' + o.rim + ')'; ctx.beginPath(); ctx.ellipse(0, -15, 13.4, 11.4, 0, Math.PI * 1.05, Math.PI * 1.55); ctx.lineTo(0, -15); ctx.fill(); ctx.fillRect(-22, 10, 3, 18); }
    ctx.restore();
}
/* ---------- armour / obstacles / bunker ---------- */
function ddpHex(h) { h = String(h || '#565a3e').replace('#', ''); if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function ddpSkinPaint(sk, cx, cy, sx, sy, haze, seed) { // paint the equipped skin pattern into the last filled path
    if (typeof paintSkinUnit !== 'function') return; ctx.save(); ctx.clip(); ctx.translate(cx, cy); ctx.scale(sx, sy); ctx.globalAlpha = 1 - haze * .8; try { paintSkinUnit(sk, seed); } catch (e) {} ctx.restore(); ctx.globalAlpha = 1;
}
function ddpPlayerSkin() { try { const f = (campaignRun && campaignRun.faction) || campaignFaction; return SKINS[progression.equippedSkins[f]] || SKINS[f + '_classic'] || null; } catch (e) { return null; } }
function ddpSherman(x, y, s, t, o) { // M4 Sherman side view, facing right, ground at y
    o = o || {}; const haze = o.haze || 0, gun = o.gun || 0, rec = o.recoil || 0, wet = o.wet || 0, mv = o.move === undefined ? 1 : o.move, sk = o.skin || null;
    const od = ddpMix(sk ? ddpHex(sk.body) : [86, 90, 62], [150, 156, 146], haze), L = ddpRGB(ddpMix(od, [255, 220, 160], .28)), M = ddpRGB(od), D = ddpRGB(ddpMix(od, [14, 16, 10], .5)), DD = ddpRGB(ddpMix(od, [6, 8, 4], .75));
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(0, 2, 118, 8, 0, 0, 7); ctx.fill();
    // tracks + wheels
    ctx.fillStyle = DD; ctx.beginPath(); ctx.moveTo(-102, -22); ctx.quadraticCurveTo(-116, -14, -108, -2); ctx.lineTo(96, -2); ctx.quadraticCurveTo(116, -10, 104, -30); ctx.lineTo(-96, -34); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 6; i++) { const wx = -74 + i * 28 - (t * 30 * mv) % 28 * 0; ctx.fillStyle = D; ctx.beginPath(); ctx.arc(-74 + i * 28, -15, 10.4, 0, 7); ctx.fill(); ctx.fillStyle = M; ctx.beginPath(); ctx.arc(-74 + i * 28, -15, 4.6, 0, 7); ctx.fill(); ctx.strokeStyle = DD; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(-74 + i * 28, -15, 10.4, 0, 7); ctx.stroke(); }
    ctx.fillStyle = D; ctx.beginPath(); ctx.arc(98, -20, 13, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(-100, -20, 11, 0, 7); ctx.fill();
    ctx.strokeStyle = M; ctx.lineWidth = 1.2; const off = (t * 36 * mv) % 6; ctx.beginPath(); for (let i = -100; i < 100; i += 6) { ctx.moveTo(i + off, -34); ctx.lineTo(i + off, -30); } ctx.stroke();
    // lower hull + glacis
    ctx.fillStyle = M; ctx.beginPath(); ctx.moveTo(-106, -28); ctx.lineTo(-110, -56); ctx.lineTo(66, -62); ctx.lineTo(108, -38); ctx.lineTo(108, -28); ctx.closePath(); ctx.fill(); if (sk) ddpSkinPaint(sk, 0, -44, 110, 18, haze, 3);
    ctx.fillStyle = D; ctx.beginPath(); ctx.moveTo(-106, -28); ctx.lineTo(108, -28); ctx.lineTo(108, -38); ctx.lineTo(-104, -40); ctx.closePath(); ctx.fill();
    ctx.fillStyle = L; ctx.beginPath(); ctx.moveTo(-110, -56); ctx.lineTo(66, -62); ctx.lineTo(108, -38); ctx.lineTo(106, -41); ctx.lineTo(66, -59); ctx.lineTo(-110, -53); ctx.closePath(); ctx.fill();
    ctx.fillStyle = D; ctx.fillRect(-100, -54, 40, 12); ctx.strokeStyle = DD; ctx.lineWidth = 1; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-98 + i * 6.4, -54); ctx.lineTo(-98 + i * 6.4, -42); ctx.stroke(); }
    // star decal
    ctx.fillStyle = 'rgba(236,236,224,.85)'; ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 4.2 : 10, a = -Math.PI / 2 + i * Math.PI / 5; ctx.lineTo(24 + Math.cos(a) * r, -45 + Math.sin(a) * r); } ctx.closePath(); ctx.fill();
    // stowage
    ctx.fillStyle = D; ctx.fillRect(-108, -66, 26, 12); ctx.fillStyle = ddpRGB(ddpMix([110, 100, 70], od, haze)); ctx.beginPath(); ctx.ellipse(-92, -70, 14, 5.4, 0, 0, 7); ctx.fill();
    if (!o.noTurret) {
    // turret
    ctx.fillStyle = M; ctx.beginPath(); ctx.moveTo(-44, -60); ctx.lineTo(-50, -76); ctx.lineTo(-34, -94); ctx.lineTo(4, -98); ctx.lineTo(34, -88); ctx.lineTo(44, -76); ctx.lineTo(40, -61); ctx.closePath(); ctx.fill(); if (sk) ddpSkinPaint(sk, -3, -79, 48, 20, haze, 9);
    ctx.fillStyle = D; ctx.beginPath(); ctx.moveTo(-44, -60); ctx.lineTo(-50, -76); ctx.lineTo(-44, -76); ctx.lineTo(-40, -60); ctx.closePath(); ctx.fill(); ctx.fillRect(-44, -66, 86, 6);
    ctx.fillStyle = L; ctx.beginPath(); ctx.moveTo(-34, -94); ctx.lineTo(4, -98); ctx.lineTo(34, -88); ctx.lineTo(30, -88); ctx.lineTo(4, -95); ctx.lineTo(-32, -91); ctx.closePath(); ctx.fill();
    ctx.fillStyle = D; ctx.fillRect(-26, -102, 18, 5); ctx.fillStyle = M; ctx.fillRect(-20, -108, 4, 6);                                    // cupola + .50 cal
    ctx.strokeStyle = DD; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-14, -106); ctx.lineTo(-30, -112); ctx.stroke();
    // gun + mantlet
    ctx.save(); ctx.translate(40, -76); ctx.rotate(-gun);
    ctx.fillStyle = D; ctx.fillRect(-6, -9, 12, 18); ctx.fillStyle = DD; ctx.fillRect(6 - rec, -2.6, 92, 5.2); ctx.fillStyle = M; ctx.fillRect(6 - rec, -2.6, 92, 1.6); ctx.fillStyle = DD; ctx.fillRect(96 - rec, -4, 8, 8);
    ctx.restore();
    }
    // water running off, exhaust
    if (wet > 0) { ctx.strokeStyle = 'rgba(232,240,236,' + (.55 * wet) + ')'; ctx.lineWidth = 1.6; for (let i = 0; i < 26; i++) { const wx = -100 + ddpR(i * 3.3) * 200, k = (t * 1.3 + ddpR(i)) % 1, wy = -62 + k * 34; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx - 1, wy + 7); ctx.stroke(); } ctx.fillStyle = 'rgba(236,244,240,' + (.8 * wet) + ')'; ctx.fillRect(-110, -4, 224, 4); }
    ctx.restore();
    if (o.exhaust !== false) { const P = ddpEnsure(); for (let i = 0; i < 7; i++) { const k = (t * 1.1 + i / 7) % 1; ctx.globalAlpha = (1 - k) * .5; const r = (7 + k * 22) * s; ctx.drawImage(P.smoke, x - 112 * s - k * 50 * s - r, y - 62 * s - k * 30 * s - r, r * 2, r * 2); } ctx.globalAlpha = 1; }
}
function ddpHedgehog(x, y, s, haze) { // Czech hedgehog: three crossed steel beams
    const c = ddpRGB(ddpMix([54, 40, 30], [130, 130, 124], haze || 0)), d = ddpRGB(ddpMix([20, 14, 10], [100, 100, 96], haze || 0));
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'butt';
    [[-.9, 1], [.9, 1], [0, 1.15]].forEach(function (b, i) { ctx.lineWidth = 5.4; ctx.strokeStyle = i === 2 ? d : c; ctx.beginPath(); ctx.moveTo(-34 * b[0] - (i === 2 ? 0 : 0), 0); ctx.lineTo(34 * b[0], -62 * (i === 2 ? 1.15 : 1)); ctx.stroke(); });
    ctx.lineWidth = 5.4; ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-40, -34); ctx.lineTo(40, -34); ctx.stroke(); ctx.strokeStyle = 'rgba(210,150,90,.5)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-40, -36); ctx.lineTo(40, -36); ctx.stroke();
    ctx.restore();
}
