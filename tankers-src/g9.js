/* =====================================================
   MISSION 10 CUTSCENE — the gunboat, the frogman, the net, U-981 overhead, the pens
===================================================== */
const M10CS = { dur: 38, cuts: [7, 13.5, 20, 27.5] };
function ddpM10Swell(hv, t, y0, a) { // a big dark swell rolling through the foreground
    ctx.save(); const yy = function (x) { return y0 + Math.sin(x * .004 + t * .9) * 26 + Math.sin(x * .011 - t * 1.3) * 9; }; ctx.beginPath(); ctx.moveTo(-200, hv + 20); for (let x = -200; x <= 1800; x += 16) ctx.lineTo(x, yy(x)); ctx.lineTo(1800, hv + 20); ctx.closePath(); const g = ctx.createLinearGradient(0, y0 - 30, 0, hv); g.addColorStop(0, 'rgba(14,22,32,' + a + ')'); g.addColorStop(.3, 'rgba(4,8,12,' + a + ')'); g.addColorStop(1, 'rgba(1,3,5,' + a + ')'); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(200,215,250,' + .5 * a + ')'; ctx.lineWidth = 2.4; ctx.beginPath(); for (let x = -200; x <= 1800; x += 16) { const y = yy(x); x === -200 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
    ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 60; i++) { const x = ddpR(i * 3) * 1800 - 100, y = yy(x) + 6 + ddpR(i * 5) * 60; ctx.fillStyle = 'rgba(180,200,240,' + (.12 * (1 - (y - y0) / 80)) + ')'; ctx.fillRect(x, y, 20 + ddpR(i) * 60, 1.6); } ctx.restore(); }
function ddpM10ShotA(t, hv) { // MGB 314 idles off the coast; the Cockle goes over the side
    const hz = hv * .5, pan = t * 10, cam = 1 + t * .012; ctx.save(); ctx.translate(800, hz); ctx.scale(cam, cam); ctx.translate(-800 - t * 4, -hz);
    dqSky(hz, t, pan, { moonX: 1260, moonY: hz - 360 });
    dqBeam(640, hz - 54, -Math.PI / 2 - .35 + Math.sin(t * .45) * .45, 1000, .045, .22, t); dqBeam(1090, hz - 58, -Math.PI / 2 + .45 + Math.sin(t * .38 + 2) * .4, 1000, .04, .18, t + 3);
    dqCoast(hz, t, pan);
    dqSea(hz, hv + 40, t, pan, { moonX: 1260 });
    dqMGB(930, hv * .655, 1.3, t, { dir: -1 });
    const k = Math.min(1, t / 3); dqCockle(700 - t * 26, hv * .74 + (1 - k) * -30, .8, t, { dir: -1, paddle: k > .6 });
    ctx.restore();
    ddpM10Swell(hv, t, hv * .9, .95);
}
function ddpM10ShotB(u, hv) { // close on the frogman in the water: moonlight on the face glass
    const D = dqEnsure(), hz = hv * .42; const g = ctx.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, '#05080f'); g.addColorStop(1, '#1a2032'); ctx.fillStyle = g; ctx.fillRect(-100, -100, 1800, hz + 100);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .5; ctx.drawImage(D.mist, 1150, -300, 900, 800); ctx.restore();
    dqBeam(300, hz - 20, -Math.PI / 2 + .25 + Math.sin(u * .5) * .5, 900, .05, .12, u);
    ctx.fillStyle = '#0c111a'; ctx.fillRect(-100, hz - 26, 1800, 30);
    dqSea(hz, hv + 40, u + 7, 0, { moonX: 1350 });
    dqBokeh(26, hz - 60, hz + 40, u, 3, .9);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-100, -100, 1800, hv + 200);
    const z = 1 + u * .025; ctx.save(); ctx.translate(820, hv * .52); ctx.scale(z, z); dqFrogman(0, 0, 1.15, u); ctx.restore();
    dqBokeh(5, hv * .1, hv * .4, u, 41, .5);
    for (let i = 0; i < 26; i++) { const k = (u * .5 + ddpR(i)) % 1; ctx.fillStyle = 'rgba(200,220,240,' + .25 * (1 - k) + ')'; ctx.fillRect(ddpR(i * 3) * 1600, hv * .25 + k * 380, 1.2, 6); }
}
function ddpM10ShotC(u, hv) { // underwater at the boom: the net, the cutters
    dqUnder(hv, u, { surf: 50, winX: 1100 });
    dqSeabed(hv, hv * .87, u, { weed: 50 });
    const cut = cs2C((u - 2.0) / 1.8, 0, 1), hp = dqNet(hv, u, cut, [-160, 330, 140]);
    if (u > 2 && u < 3.9) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .4 + .3 * Math.sin(u * 30); ctx.drawImage(dqEnsure().mist, hp[0] - 160 - 30, hp[1] - 60, 60, 60); ctx.restore(); }
    const mv = Math.max(0, u - 4.1), dx = hp[0] - 360 + Math.min(u, 2) * 40 + mv * 120, ds = .92 - mv * .05;
    dqDiver(dx, hp[1] + 40 - mv * 10, ds, u, { reach: cs2C(u / 2, 0, 1), snip: u > 2 && u < 3.9, kick: mv > 0 ? 5 : 2.5 });
    dqSnow(hv, u, 160, true);
    ctx.fillStyle = 'rgba(2,10,14,.25)'; ctx.fillRect(-100, -100, 1800, hv + 200);
}
function ddpM10ShotD(u, hv) { // from below: U-981 glides overhead, screws churning
    dqUnder(hv, u + 20, { surf: 30, winX: 800, deep: 1, rays: 1.3 });
    dqUboatBelow(-560 + u * 250, hv * .27, .95, u);
    dqSeabed(hv, hv * .86, u, { weed: 34 });
    dqDiver(1180, hv * .74, .7, u, { rot: .55, dir: -1, kick: 1.5, trail: true });
    dqSnow(hv, u + 4, 170, true);
    const sh = Math.max(0, 1 - Math.abs(u - 3.6) / 2.6) * 1.6; if (sh > 0) ctx.translate((Math.random() - .5) * sh, (Math.random() - .5) * sh);
}
function ddpM10FrogHead(x, y, s, t) { ctx.save(); ctx.translate(x, y + Math.sin(t * 1.3) * 4); ctx.scale(s, s);
    ctx.fillStyle = '#05070a'; ctx.beginPath(); ctx.ellipse(0, 0, 90, 100, 0, Math.PI, 0); ctx.lineTo(90, 30); ctx.lineTo(-90, 30); ctx.fill();
    ctx.strokeStyle = 'rgba(255,190,120,.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 90, 100, 0, Math.PI * 1.1, Math.PI * 1.75); ctx.stroke();
    ctx.fillStyle = '#3a2c1a'; ctx.beginPath(); ctx.ellipse(-30, -30, 50, 40, -.1, 0, 7); ctx.fill(); ctx.fillStyle = '#0a0e14'; ctx.beginPath(); ctx.ellipse(-30, -30, 40, 30, -.1, 0, 7); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { ctx.fillStyle = 'rgba(255,190,110,.7)'; ctx.fillRect(-60 + i * 16, -24 + Math.sin(i) * 3, 8, 3); } ctx.fillStyle = 'rgba(210,225,255,.4)'; ctx.beginPath(); ctx.ellipse(-12, -46, 12, 6, -.4, 0, 7); ctx.fill(); ctx.restore();
    ctx.restore(); }
function ddpM10ShotE(u, hv) { // Keroman: lit bays, U-boats inside, U-981 coming home behind her tug
    const hz = hv * .6, z = 1 + u * .03; ctx.save(); ctx.translate(800, hz); ctx.scale(z, z); ctx.translate(-800, -hz);
    dqSky(hz, u + 30, 0, { moonX: 200, moonY: hz - 420, warm: 1 });
    dqBeam(760 - 9, hz - 470, -Math.PI / 2 - .5 + Math.sin(u * .5) * .55, 1100, .04, .2, u); dqBeam(500, hz - 400, -Math.PI / 2 + .6 + Math.sin(u * .42 + 1) * .4, 1100, .04, .16, u + 2);
    ctx.fillStyle = '#10141e'; ctx.beginPath(); ctx.moveTo(-300, hz); for (let x = -300; x <= 1900; x += 24) ctx.lineTo(x, hz - 60 - Math.sin(x * .005) * 30 - ddpR(Math.floor(x / 24)) * 8); ctx.lineTo(1900, hz); ctx.fill();
    for (let i = 0; i < 30; i++) { const x = ddpR(i * 3) * 1900 - 200; if (x > 200 && x < 1300) continue; ctx.fillStyle = 'rgba(255,196,120,' + (.5 + .3 * Math.sin(u + i)) + ')'; ctx.fillRect(x, hz - 10 - ddpR(i * 5) * 40, 2.4, 2.4); }
    dqSea(hz, hv + 40, u, 0, { moonX: 200 });
    dqKeroman(760, hz, .82, u, { subs: [1, 1, 0, 1] });
    ctx.restore();
    dqTug(860 - u * 18, hv * .77, .9, u, -1);
    ctx.strokeStyle = 'rgba(30,30,30,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(940 - u * 18, hv * .76); ctx.quadraticCurveTo(1020 - u * 18, hv * .8, 1100 - u * 14, hv * .79); ctx.stroke();
    ddpUboat(1360 - u * 14, hv * .84, .92, u, { dir: -1, lights: true, haze: .55 });
    ddpM10Swell(hv, u, hv * .95, .9);
    ddpM10FrogHead(250, hv * .9, 1.3, u);
}
function ddpM10Frame(t, w, h) { const U = w / 1600, hv = h / U, c = M10CS.cuts; DDP.ok = true; ctx.save(); ctx.scale(U, U); if (t < c[0]) ddpM10ShotA(t, hv); else if (t < c[1]) ddpM10ShotB(t - c[0], hv); else if (t < c[2]) ddpM10ShotC(t - c[1], hv); else if (t < c[3]) ddpM10ShotD(t - c[2], hv); else ddpM10ShotE(t - c[3], hv); ctx.restore(); ddpBloom(w, h); }
function drawM10Cutscene(now) {
    if (!campaignCutsceneRunning) return;
    const t = (now - campaignCutsceneStart) / 1000, w = canvas.width, h = canvas.height;
    if (!CS2.grain) CS2.grain = cs2Grain();
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    try { ddpM10Frame(t, w, h); } catch (e) { DDP.err = e; ctx.setTransform(1, 0, 0, 1, 0, 0); }
    let flash = 0; M10CS.cuts.forEach(function (c) { const d = t - c; if (d >= 0 && d < .16) flash = Math.max(flash, .25 * (1 - d / .16)); });
    if ((t > M10CS.cuts[1] && t < M10CS.cuts[3]) && Math.floor(t * 2) !== M10CS.bub) { M10CS.bub = Math.floor(t * 2); try { playTone(160 + Math.random() * 120, 90, .1, .015, 'sine'); } catch (e) {} }
    if (t > M10CS.cuts[2] && t < M10CS.cuts[3] && Math.floor(t * 3) !== M10CS.scr) { M10CS.scr = Math.floor(t * 3); try { playTone(70, 60, .3, .03, 'sawtooth'); } catch (e) {} }
    ctx.save(); ctx.globalAlpha = .08; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    const vg = ctx.createRadialGradient(w / 2, h * .52, w * .24, w / 2, h * .52, w * .74); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    if (flash > 0) { ctx.fillStyle = 'rgba(220,235,255,' + flash + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = Math.round(h * .062 * cs2E(Math.min(1, t / .9))); ctx.fillStyle = '#050605'; ctx.fillRect(0, 0, w, bar); ctx.fillRect(0, h - bar - 26, w, bar + 26);
    const ta = cs2C(Math.min((t - .6) / .8, (5.4 - t) / .8), 0, 1);
    if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, h * .12, w, 112); ctx.fillStyle = '#d9c88c'; ctx.font = '700 15px "Special Elite", "Courier New", monospace'; ctx.fillText('— OPERATION OVERLORD · ACT III —', w / 2, h * .12 + 28); ctx.fillStyle = '#f4ecd0'; ctx.font = '700 48px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('THE U-BOAT PENS', w / 2, h * .12 + 76); ctx.font = '15px "Special Elite", "Courier New", monospace'; ctx.fillStyle = '#d9c88c'; ctx.fillText('21 JUNE 1944   ·   D+15   ·   01:30   ·   OFF LORIENT, BRITTANY', w / 2, h * .12 + 102); ctx.restore(); }
    const caps = [[5.6, 'MGB 314 CUTS HER ENGINES A MILE OFF LORIENT.'], [8.0, 'LT. HAYES, RNVR. A REBREATHER, FOUR LIMPETS, A WELROD.'], [10.6, 'THE OXYGEN LASTS FORTY SECONDS AT A TIME. THEN HE MUST COME UP.'], [14.0, 'THE HARBOUR MOUTH IS CLOSED BY A STEEL NET.'], [17.0, 'HYDROPHONES LISTEN FOR SWIMMERS. MINES HANG IN THE DARK.'], [20.6, 'AND TONIGHT A U-BOAT IS COMING HOME.'], [23.6, 'U-981. SHE WILL BERTH IN THE PENS AT DAWN.'], [28.2, 'KEROMAN. TWENTY FEET OF CONCRETE. THE RAF CANNOT TOUCH IT.'], [31.0, 'ONE MAN UNDER THE WATER CAN.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; }); const sd = t - 33.6;
    if (ci >= 0 && sd < 0) { const c = caps[ci], n = Math.min(c[1].length, Math.floor((t - c[0]) * 34)); ctx.textAlign = 'center'; ctx.fillStyle = '#efe6c6'; ctx.font = '700 16px "Special Elite", "Courier New", monospace'; ctx.fillText(c[1].slice(0, n), w / 2, h - bar - 34); }
    cs2Once('m10stamp', sd > 0, function () { try { playExplosionSound(1.0); playTone(180, 50, .4, .1, 'square'); } catch (e) {} });
    if (sd > 0) { const k = cs2C(sd / .22, 0, 1), sc = cs2L(3.2, 1, cs2E(k)), fade = cs2C((M10CS.dur - 1 - t) / .6, 0, 1); ctx.save(); ctx.translate(w / 2, h * .42); ctx.rotate(-.045); ctx.scale(sc, sc); ctx.globalAlpha = k * fade; ctx.fillStyle = 'rgba(8,8,5,.86)'; ctx.fillRect(-w, -88, w * 2, 176);
        [-88, 73].forEach(function (y) { ctx.save(); ctx.beginPath(); ctx.rect(-w, y, w * 2, 15); ctx.clip(); ctx.fillStyle = '#d6a91c'; ctx.fillRect(-w, y, w * 2, 15); ctx.fillStyle = '#16140f'; for (let x = -w - 40; x < w + 40; x += 40) { ctx.beginPath(); ctx.moveTo(x, y + 15); ctx.lineTo(x + 20, y); ctx.lineTo(x + 34, y); ctx.lineTo(x + 14, y + 15); ctx.fill(); } ctx.restore(); });
        ctx.textAlign = 'center'; ctx.fillStyle = '#d9c88c'; ctx.font = '700 15px "Special Elite", "Courier New", monospace'; ctx.fillText('— ACT III · FROGMAN RAID · MISSION 10 —', 0, -48); ctx.fillStyle = '#f4ecd0'; ctx.strokeStyle = '#000'; ctx.lineWidth = 7; ctx.font = '700 70px "Stardos Stencil", Impact, sans-serif'; ctx.strokeText('THE U-BOAT PENS', 0, 22); ctx.fillText('THE U-BOAT PENS', 0, 22); ctx.fillStyle = '#e8c968'; ctx.font = '700 17px "Special Elite", "Courier New", monospace'; ctx.fillText('OPERATION DEEP WATER.', 0, 54); ctx.restore(); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8);
    const fa = Math.max(cs2C(1 - t / 1.0, 0, 1), cs2C((t - (M10CS.dur - 1)) / 1, 0, 1)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + fa + ')'; ctx.fillRect(0, 0, w, h); }
    if (t < M10CS.dur) campaignCutsceneFrame = requestAnimationFrame(drawM10Cutscene); else finishCampaignCutscene();
}
function startMission10(skipIntro) {
    returnToMenu(); campaignMission = 10; selectedGameMode = 'campaign'; selectedMap = 'campaignGustav'; M10.failWhy = ''; M10.result = null;
    document.getElementById('menu').style.display = 'none'; const cs = document.getElementById('campaignScreen'); if (cs) cs.style.display = 'none'; document.getElementById('gameArea').style.display = 'block';
    ['controls', 'battleMainMenuButton', 'gameInfo', 'pointScoreBar', 'battleMessage', 'killFeed', 'radioText', 'campaignObjectiveBox'].forEach(function (id) { const e = document.getElementById(id); if (e) e.style.display = 'none'; });
    M8.cut = true; applyPointControlCanvasSize(); canvas.style.transform = 'translate3d(0px,0px,0px)'; if (typeof minimapPanel !== 'undefined' && minimapPanel) minimapPanel.style.display = 'none';
    if (skipIntro) { m10ShowBrief(); return; }
    if (typeof CS2 !== 'undefined') CS2.fired = {};
    campaignCutsceneRunning = true; campaignCutsceneStart = performance.now(); if (campaignCutsceneFrame) cancelAnimationFrame(campaignCutsceneFrame); campaignCutsceneFrame = requestAnimationFrame(drawM10Cutscene);
}
function m10ShowBrief() {
    m2InjectStyle();
    let b = document.getElementById('m2Brief'); if (!b) { b = document.createElement('div'); b.id = 'm2Brief'; document.body.appendChild(b); }
    b.innerHTML = '<div class="bSheet"><div class="bTape"><span>OPERATION DEEP WATER</span><span>MISSION 10</span></div><div class="bBody">' +
        '<h2>THE U-BOAT PENS</h2><p class="bText" id="m10Typed"></p>' +
        '<ul><li>You are <b>Lt. Hayes, RNVR</b>. <b>SPACE</b> dives and surfaces. Underwater nobody can see you, but the rebreather only gives you <b>about 40 seconds</b>; on the surface it refills.</li>' +
        '<li>On the surface you are visible to <b>searchlights</b> (instant alarm), <b>sentries</b> and <b>patrol launches</b>. Launches drop <b>depth charges</b>, even when they haven\'t seen you.</li>' +
        '<li>Underwater there are <b>contact mines</b> (you see them up close) and <b>hydrophone buoys</b> that hear you kicking. Hold <b>SHIFT</b> to swim slowly and silently.</li>' +
        '<li>Cut through the <b>boom net</b> (dive, hold <b>F</b>), or slip in behind <b>U-981</b> when the gate opens for her. Keep clear of her screws.</li>' +
        '<li>Fix a limpet (<b>hold F</b> beside the hull, underwater) to <b>U-255</b> and <b>U-618</b> in the pens and to <b>U-981</b>, at her berth or on the move. The <b>tanker</b> is an optional fourth.</li>' +
        '<li>Then you have <b>2½ minutes</b> to reach <b>MGB 314</b> east of the harbour mouth. Your <b>Welrod</b> (surface only) can shoot out lights.</li></ul>' +
        '<button class="bGo" id="m10Go">INTO THE WATER ▶</button></div></div>';
    b.hidden = false; b.style.display = '';
    const txt = '21 June 1944, 01:30. The canoe will drop you a mile off the harbour mouth. The rest is up to you.';
    const el = document.getElementById('m10Typed'); let i = 0; const iv = setInterval(function () { i += 2; el.textContent = txt.slice(0, i); if (i >= txt.length) clearInterval(iv); }, 22);
    document.getElementById('m10Go').onclick = function () { clearInterval(iv); b.hidden = true; try { playTone(400, 900, .2, .06, 'triangle'); } catch (e) {} m10Begin(); };
}
