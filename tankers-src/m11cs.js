/* =====================================================
   MISSION 11 CUTSCENES — Colditz on its rock, the Appell, the forger's table, the wire;
   ending: the night train to Singen and the Swiss border at dawn
===================================================== */
const M11CS = { dur: 37, cuts: [8, 15, 22.5, 29.5] };
/* ---------- the castle on its rock (side elevation), base = foot of the rock ---------- */
function dqWireFence(t, near, far, y, o) { // a barbed-wire fence in perspective from (near) to (far)
    o = o || {}; const n = 14; for (let i = n; i >= 0; i--) { const k = i / n, x = near[0] + (far[0] - near[0]) * Math.pow(k, .7), yy = near[1] + (far[1] - near[1]) * Math.pow(k, .7), h = (o.h || 260) * (1 - k * .82), w = Math.max(2, 9 * (1 - k * .8)); ctx.fillStyle = '#1a140e'; ctx.fillRect(x - w / 2, yy - h, w, h); ctx.fillStyle = 'rgba(180,190,220,.2)'; ctx.fillRect(x - w / 2, yy - h, 2, h); }
    ctx.strokeStyle = 'rgba(160,165,170,.6)'; for (let r = 0; r < 7; r++) { ctx.lineWidth = 1.2; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const k = i / 40, kk = Math.pow(k, .7), x = near[0] + (far[0] - near[0]) * kk, yy = near[1] + (far[1] - near[1]) * kk, h = (o.h || 260) * (1 - kk * .82); const py = yy - h * (r + .5) / 7 + Math.sin(i * 2.3 + r) * 1.5 * (1 - kk); i ? ctx.lineTo(x, py) : ctx.moveTo(x, py); } ctx.stroke(); }
    // barbs
    ctx.strokeStyle = 'rgba(190,195,200,.5)'; for (let i = 0; i < 80; i++) { const k = m8R(i * 3 + 1), kk = Math.pow(k, .7), x = near[0] + (far[0] - near[0]) * kk, yy = near[1] + (far[1] - near[1]) * kk, h = (o.h || 260) * (1 - kk * .82), r = Math.floor(m8R(i * 7) * 7), py = yy - h * (r + .5) / 7, b = 5 * (1 - kk * .8); ctx.beginPath(); ctx.moveTo(x - b, py - b); ctx.lineTo(x + b, py + b); ctx.moveTo(x + b, py - b); ctx.lineTo(x - b, py + b); ctx.stroke(); }
}
function dqPrisonerBack(x, y, s, t, seed) { // a prisoner seen from behind, standing in the ranks
    ctx.save(); ctx.translate(x, y + Math.sin(t * 1.3 + seed) * .8 * s); ctx.scale(s, s); const coat = ['#5a5236', '#3e4656', '#4e4a30', '#36404e', '#5a4a30'][seed % 5];
    ctx.fillStyle = '#1a1814'; ctx.fillRect(-14, -36, 11, 36); ctx.fillRect(3, -36, 11, 36);
    const g = ctx.createLinearGradient(-30, 0, 30, 0); g.addColorStop(0, ddpRGB(ddpMix(ddpHex(coat), [0, 0, 0], .4))); g.addColorStop(.6, coat); g.addColorStop(1, ddpRGB(ddpMix(ddpHex(coat), [200, 210, 240], .25))); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-26, -120); ctx.quadraticCurveTo(-32, -60, -24, -30); ctx.lineTo(24, -30); ctx.quadraticCurveTo(32, -60, 26, -120); ctx.quadraticCurveTo(0, -132, -26, -120); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -122); ctx.lineTo(0, -32); ctx.moveTo(-18, -80); ctx.lineTo(18, -80); ctx.stroke();
    ctx.fillStyle = '#c09a7a'; ctx.fillRect(-6, -136, 12, 12); ctx.fillStyle = ['#2a1e14', '#5a4028', '#14100c', '#7a5a34'][seed % 4]; ctx.beginPath(); ctx.ellipse(0, -146, 13, 15, 0, 0, 7); ctx.fill();
    if (seed % 3 !== 1) { ctx.fillStyle = ['#2e2a40', '#3a4a2a', '#4a2020'][seed % 3]; ctx.beginPath(); ctx.ellipse(-2, -158, 12, 6, -.1, 0, 7); ctx.fill(); }
    ctx.strokeStyle = 'rgba(200,210,240,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(26, -118); ctx.quadraticCurveTo(32, -60, 24, -30); ctx.stroke();
    ctx.restore(); }
function dqCourtWall(t, hz, x0, x1, top, o) { // the tall inner façade, six storeys of windows
    o = o || {}; const g = ctx.createLinearGradient(0, top, 0, hz); g.addColorStop(0, '#2e3442'); g.addColorStop(1, '#5e6066'); ctx.fillStyle = g; ctx.fillRect(x0, top, x1 - x0, hz - top);
    const rows = 6, cols = Math.floor((x1 - x0) / 90); for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const x = x0 + 30 + c * 90, y = top + 30 + r * (hz - top - 80) / rows, k = m8R(r * 17 + c * 5 + (o.seed || 0)); ctx.fillStyle = '#1a1c22'; ctx.fillRect(x, y, 34, 52); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(x - 3, y + 52, 40, 4); if (k > .7) { ctx.fillStyle = 'rgba(255,190,110,' + (.6 + .2 * Math.sin(t + k * 9)) + ')'; ctx.fillRect(x + 2, y + 2, 30, 48); if (k > .85) { ctx.fillStyle = '#1a140e'; ctx.beginPath(); ctx.arc(x + 17, y + 26, 8, 0, 7); ctx.fill(); ctx.fillRect(x + 7, y + 32, 20, 18); } } ctx.strokeStyle = '#2a2a2e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 17, y); ctx.lineTo(x + 17, y + 52); ctx.moveTo(x, y + 26); ctx.lineTo(x + 34, y + 26); ctx.stroke(); }
    ctx.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 30; i++) ctx.fillRect(x0 + m8R(i * 3) * (x1 - x0), top + m8R(i * 5) * (hz - top), 3 + m8R(i) * 8, 40 + m8R(i * 7) * 120);
}
function ddpM11ShotC(u, hv) { // the forger's table by candlelight
    const g = ctx.createRadialGradient(800, hv * .45, 50, 800, hv * .5, 900); g.addColorStop(0, '#4a3018'); g.addColorStop(.5, '#24160a'); g.addColorStop(1, '#060402'); ctx.fillStyle = g; ctx.fillRect(-100, -100, 1800, hv + 200);
    // grain of the table
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2; for (let i = 0; i < 30; i++) { const y = i * hv / 30 + Math.sin(i) * 6; ctx.beginPath(); ctx.moveTo(-100, y); ctx.bezierCurveTo(400, y + 10, 1000, y - 10, 1700, y + 4); ctx.stroke(); }
    // the Ausweis
    ctx.save(); ctx.translate(760, hv * .52); ctx.rotate(-.06); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-250, -160, 520, 340); ctx.fillStyle = '#d8ccaa'; ctx.fillRect(-260, -170, 520, 340); ctx.fillStyle = 'rgba(120,90,50,.15)'; ctx.fillRect(-260, -170, 520, 40);
    ctx.fillStyle = '#3a2a1a'; ctx.font = '700 26px "Stardos Stencil", serif'; ctx.textAlign = 'left'; ctx.fillText('AUSWEIS', -230, -132); ctx.font = '15px "Special Elite", monospace'; ['Name: Hptm. Karl Brenner', 'Dienststelle: O.K.W. Berlin', 'Gültig bis: 31.12.1944', 'Reiseziel: Singen (Hohentwiel)'].forEach(function (l, i) { ctx.fillStyle = 'rgba(30,24,16,.85)'; ctx.fillText(l.slice(0, Math.max(0, Math.floor((u - .8) * 22) - i * 12)), -60, -90 + i * 34); });
    ctx.fillStyle = '#6a6a6a'; ctx.fillRect(-230, -100, 140, 170); ctx.fillStyle = '#3a3a3a'; ctx.beginPath(); ctx.arc(-160, -50, 34, 0, 7); ctx.fill(); ctx.fillRect(-200, -10, 80, 70);
    const stampK = Math.max(0, Math.min(1, (u - 3.4) / .15)); if (u > 3.4) { ctx.save(); ctx.translate(140, 100); ctx.rotate(.2); ctx.strokeStyle = 'rgba(80,40,120,' + .75 * stampK + ')'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 54, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 40, 0, 7); ctx.stroke(); ctx.fillStyle = 'rgba(80,40,120,' + .7 * stampK + ')'; ctx.beginPath(); ctx.moveTo(-26, -6); ctx.lineTo(0, -22); ctx.lineTo(26, -6); ctx.lineTo(16, 0); ctx.lineTo(0, -10); ctx.lineTo(-16, 0); ctx.fill(); ctx.fillRect(-4, -10, 8, 28); ctx.restore(); }
    ctx.restore();
    // the stamp coming down
    const sy = u < 3.4 ? -260 + Math.min(1, u / 3.2) * 300 - Math.sin(Math.min(1, u / 3.2) * 3.14) * 80 : u < 4.2 ? 40 : 40 - (u - 4.2) * 400; if (sy > -300) { ctx.save(); ctx.translate(910, hv * .52 + sy + 100); ctx.rotate(.14); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(20, 40, 70, 20, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#3a2214'; ctx.fillRect(-20, -150, 40, 120); ctx.beginPath(); ctx.arc(0, -150, 34, 0, 7); ctx.fill(); ctx.fillStyle = '#5a3a22'; ctx.fillRect(-60, -30, 120, 26); ctx.fillStyle = '#2a1a3a'; ctx.fillRect(-56, -4, 112, 10);
        ctx.fillStyle = '#c09070'; ctx.beginPath(); ctx.ellipse(0, -180, 60, 40, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#a07858'; for (let f = 0; f < 4; f++) { ctx.beginPath(); ctx.ellipse(-36 + f * 24, -148, 11, 22, 0, 0, 7); ctx.fill(); } ctx.fillStyle = '#5a5236'; ctx.fillRect(-70, -260, 140, 70); ctx.restore(); }
    if (u > 3.4 && u < 3.6) { ctx.fillStyle = 'rgba(255,230,190,.12)'; ctx.fillRect(-100, -100, 1800, hv + 200); }
    // the tunic being finished, the key, the file, ink, the candle
    ctx.save(); ctx.translate(250, hv * .35); ctx.rotate(.25); ctx.fillStyle = '#4e5648'; ctx.beginPath(); ctx.moveTo(-120, -90); ctx.lineTo(120, -90); ctx.lineTo(160, 150); ctx.lineTo(-160, 150); ctx.fill(); ctx.fillStyle = '#3a4036'; ctx.fillRect(-12, -90, 24, 240); for (let i = 0; i < 5; i++) { ctx.fillStyle = '#9a9a8a'; ctx.beginPath(); ctx.arc(0, -60 + i * 44, 5, 0, 7); ctx.fill(); } ctx.fillStyle = '#2a3026'; ctx.fillRect(-60, -92, 30, 16); ctx.fillRect(30, -92, 30, 16); ctx.fillStyle = '#c0b070'; ctx.beginPath(); ctx.moveTo(-90, -40); ctx.lineTo(-50, -54); ctx.lineTo(-60, -40); ctx.fill(); ctx.strokeStyle = '#d8d0b0'; ctx.lineWidth = 1.4; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(-150, 140); ctx.lineTo(-112, -88); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    ctx.save(); ctx.translate(1340, hv * .78); ctx.rotate(-.4); ctx.strokeStyle = '#a89060'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(-40, 0, 22, 0, 7); ctx.moveTo(-18, 0); ctx.lineTo(80, 0); ctx.lineTo(80, 20); ctx.moveTo(60, 0); ctx.lineTo(60, 14); ctx.stroke(); ctx.fillStyle = '#5a5a5a'; ctx.fillRect(-20, 40, 160, 12); ctx.fillStyle = '#3a2214'; ctx.fillRect(140, 38, 60, 16); ctx.fillStyle = 'rgba(200,200,190,.6)'; for (let i = 0; i < 20; i++) ctx.fillRect(80 + m8R(i) * 30, 4 + m8R(i * 3) * 20, 2, 2); ctx.restore();
    m8Disc(ctx, 1260, hv * .3, 34, '#0a0a14', '#2a2a40'); ctx.fillStyle = '#d8d0b0'; ctx.fillRect(1240, hv * .3 - 70, 40, 20);
    const cx = 1420, cyy = hv * .22; ctx.fillStyle = '#e8dcc0'; ctx.fillRect(cx - 18, cyy, 36, 120); ctx.fillStyle = '#c8b890'; ctx.fillRect(cx - 18, cyy, 6, 120); ctx.fillStyle = '#2a2a2a'; ctx.fillRect(cx - 1, cyy - 10, 2, 12);
    const fl = 1 + Math.sin(u * 14) * .08 + Math.sin(u * 23) * .05; ctx.save(); ctx.translate(cx, cyy - 12); ctx.scale(1, fl); const fg = ctx.createRadialGradient(0, -10, 2, 0, -10, 24); fg.addColorStop(0, '#fffbe0'); fg.addColorStop(.5, '#ffc040'); fg.addColorStop(1, 'rgba(255,120,20,0)'); ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(0, -10, 10, 24, 0, 0, 7); ctx.fill(); ctx.restore(); ddpFlashGlow(cx, cyy - 20, 520, .45 * fl);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-100, -100, 1800, hv + 200); ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(cx, cyy, 50, cx - 300, hv * .5, 1100); lg.addColorStop(0, 'rgba(255,170,80,.22)'); lg.addColorStop(1, 'rgba(255,170,80,0)'); ctx.fillStyle = lg; ctx.fillRect(-100, -100, 1800, hv + 200); ctx.restore();
}
function ddpM11Frame(t, w, h) { const U = w / 1600, hv = h / U, c = M11CS.cuts; DDP.ok = true; ctx.save(); ctx.scale(U, U); if (t < c[0]) ddpM11ShotA(t, hv); else if (t < c[1]) ddpM11ShotB(t - c[0], hv); else if (t < c[2]) ddpM11ShotC(t - c[1], hv); else if (t < c[3]) ddpM11ShotD(t - c[2], hv); else ddpM11ShotA(t - c[3] + 8, hv); ctx.restore(); ddpBloom(w, h); }
function drawM11Cutscene(now) {
    if (!campaignCutsceneRunning) return;
    const t = (now - campaignCutsceneStart) / 1000, w = canvas.width, h = canvas.height;
    if (!CS2.grain) CS2.grain = cs2Grain();
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    try { ddpM11Frame(t, w, h); } catch (e) { DDP.err = e; ctx.setTransform(1, 0, 0, 1, 0, 0); }
    let flash = 0; M11CS.cuts.forEach(function (c) { const d = t - c; if (d >= 0 && d < .16) flash = Math.max(flash, .25 * (1 - d / .16)); });
    cs2Once('m11stampC', t > M11CS.cuts[1] + 3.4, function () { try { playTone(90, 50, .2, .12, 'triangle'); } catch (e) {} });
    cs2Once('m11bell', t > M11CS.cuts[0] + .2, function () { try { for (let i = 0; i < 4; i++) setTimeout(function () { try { playTone(880, 860, .5, .04, 'triangle'); } catch (e) {} }, i * 420); } catch (e) {} });
    cs2Once('m11dog', t > M11CS.cuts[2] + 2.5, function () { try { playTone(180, 120, .12, .05, 'sawtooth'); setTimeout(function () { try { playTone(170, 110, .12, .05, 'sawtooth'); } catch (e) {} }, 260); } catch (e) {} });
    ctx.save(); ctx.globalAlpha = .08; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    const vg = ctx.createRadialGradient(w / 2, h * .52, w * .24, w / 2, h * .52, w * .74); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    if (flash > 0) { ctx.fillStyle = 'rgba(220,235,255,' + flash + ')'; ctx.fillRect(0, 0, w, h); }
    const bar = Math.round(h * .062 * cs2E(Math.min(1, t / .9))); ctx.fillStyle = '#050605'; ctx.fillRect(0, 0, w, bar); ctx.fillRect(0, h - bar - 26, w, bar + 26);
    const ta = cs2C(Math.min((t - .6) / .8, (6.2 - t) / .8), 0, 1);
    if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, h * .12, w, 112); ctx.fillStyle = '#d9c88c'; ctx.font = '700 15px "Special Elite", "Courier New", monospace'; ctx.fillText('— OPERATION OVERLORD · ACT III —', w / 2, h * .12 + 28); ctx.fillStyle = '#f4ecd0'; ctx.font = '700 48px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('OFLAG IV-C', w / 2, h * .12 + 76); ctx.font = '15px "Special Elite", "Courier New", monospace'; ctx.fillStyle = '#d9c88c'; ctx.fillText('2 JULY 1944   ·   D+26   ·   22:40   ·   COLDITZ CASTLE, SAXONY', w / 2, h * .12 + 102); ctx.restore(); }
    const caps = [[6.4, 'COLDITZ. THE GERMANS CALL IT ESCAPE-PROOF.'], [8.6, 'CAPT. HARRY DOYLE, RAF. SHOT DOWN OVER THE RUHR IN MAY.'], [11.2, 'FROM THE PRISON TRAIN HE SAW THE V-WEAPON SITE AT PEENEMÜNDE. LONDON MUST KNOW.'], [15.4, 'THE ESCAPE COMMITTEE HAS BEEN BUSY.'], [17.6, 'PAPERS FOR A STAFF OFFICER. A UNIFORM CUT FROM BLANKETS.'], [20.0, 'WIRE CUTTERS FROM A RED CROSS BOX. A KEY FILED FROM A BED FRAME.'], [23.0, 'TWO WAYS OUT: THE MAIN GATE, OR THE WIRE IN THE PARK.'], [26.0, 'ROLL CALL EVERY TWO MINUTES TONIGHT. MISS ONE AND THE CASTLE WAKES.'], [30.0, 'NO BRITISH OFFICER HAS MADE A HOME RUN FROM HERE IN A YEAR.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; }); const sd = t - 32.8;
    if (ci >= 0 && sd < 0) { const c = caps[ci], n = Math.min(c[1].length, Math.floor((t - c[0]) * 34)); ctx.textAlign = 'center'; ctx.fillStyle = '#efe6c6'; ctx.font = '700 16px "Special Elite", "Courier New", monospace'; ctx.fillText(c[1].slice(0, n), w / 2, h - bar - 34); }
    cs2Once('m11stamp', sd > 0, function () { try { playExplosionSound(1.0); playTone(180, 50, .4, .1, 'square'); } catch (e) {} });
    if (sd > 0) { const k = cs2C(sd / .22, 0, 1), sc = cs2L(3.2, 1, cs2E(k)), fade = cs2C((M11CS.dur - 1 - t) / .6, 0, 1); ctx.save(); ctx.translate(w / 2, h * .42); ctx.rotate(-.045); ctx.scale(sc, sc); ctx.globalAlpha = k * fade; ctx.fillStyle = 'rgba(8,8,5,.86)'; ctx.fillRect(-w, -88, w * 2, 176);
        [-88, 73].forEach(function (y) { ctx.save(); ctx.beginPath(); ctx.rect(-w, y, w * 2, 15); ctx.clip(); ctx.fillStyle = '#d6a91c'; ctx.fillRect(-w, y, w * 2, 15); ctx.fillStyle = '#16140f'; for (let x = -w - 40; x < w + 40; x += 40) { ctx.beginPath(); ctx.moveTo(x, y + 15); ctx.lineTo(x + 20, y); ctx.lineTo(x + 34, y); ctx.lineTo(x + 14, y + 15); ctx.fill(); } ctx.restore(); });
        ctx.textAlign = 'center'; ctx.fillStyle = '#d9c88c'; ctx.font = '700 15px "Special Elite", "Courier New", monospace'; ctx.fillText('— ACT III · ESCAPE · MISSION 11 —', 0, -48); ctx.fillStyle = '#f4ecd0'; ctx.strokeStyle = '#000'; ctx.lineWidth = 7; ctx.font = '700 70px "Stardos Stencil", Impact, sans-serif'; ctx.strokeText('THE CASTLE', 0, 22); ctx.fillText('THE CASTLE', 0, 22); ctx.fillStyle = '#e8c968'; ctx.font = '700 17px "Special Elite", "Courier New", monospace'; ctx.fillText('HOME RUN.', 0, 54); ctx.restore(); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8);
    const fa = Math.max(cs2C(1 - t / 1.0, 0, 1), cs2C((t - (M11CS.dur - 1)) / 1, 0, 1)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + fa + ')'; ctx.fillRect(0, 0, w, h); }
    if (t < M11CS.dur) campaignCutsceneFrame = requestAnimationFrame(drawM11Cutscene); else finishCampaignCutscene();
}
function startMission11(skipIntro) {
    returnToMenu(); campaignMission = 11; selectedGameMode = 'campaign'; selectedMap = 'campaignGustav'; M11.failWhy = ''; M11.result = null;
    document.getElementById('menu').style.display = 'none'; const cs = document.getElementById('campaignScreen'); if (cs) cs.style.display = 'none'; document.getElementById('gameArea').style.display = 'block';
    ['controls', 'battleMainMenuButton', 'gameInfo', 'pointScoreBar', 'battleMessage', 'killFeed', 'radioText', 'campaignObjectiveBox'].forEach(function (id) { const e = document.getElementById(id); if (e) e.style.display = 'none'; });
    M8.cut = true; applyPointControlCanvasSize(); canvas.style.transform = 'translate3d(0px,0px,0px)'; if (typeof minimapPanel !== 'undefined' && minimapPanel) minimapPanel.style.display = 'none';
    if (skipIntro) { m11ShowBrief(); return; }
    if (typeof CS2 !== 'undefined') CS2.fired = {};
    campaignCutsceneRunning = true; campaignCutsceneStart = performance.now(); if (campaignCutsceneFrame) cancelAnimationFrame(campaignCutsceneFrame); campaignCutsceneFrame = requestAnimationFrame(drawM11Cutscene);
}
function m11ShowBrief() {
    m2InjectStyle();
    let b = document.getElementById('m2Brief'); if (!b) { b = document.createElement('div'); b.id = 'm2Brief'; document.body.appendChild(b); }
    b.innerHTML = '<div class="bSheet"><div class="bTape"><span>ESCAPE COMMITTEE · MOST SECRET</span><span>MISSION 11</span></div><div class="bBody">' +
        '<h2>THE CASTLE</h2><p class="bText" id="m11Typed"></p>' +
        '<ul><li>You are <b>Capt. Harry Doyle</b>, a prisoner. No weapons. Get caught and it\'s 28 days in the cooler — <b>the mission fails</b>.</li>' +
        '<li><b>Nothing is handed to you.</b> Search the <b>?</b> spots (hold <b>F</b>) for odds and ends and build your way out on the workbench (<b>C</b>).</li>' +
        '<li><b>The gate:</b> find the <b>blank Ausweis</b> (theatre) and forge a <b>pass</b>; find the <b>half-sewn tunic</b> (quarters) and finish the <b>uniform</b>. Wear it (<b>U</b>) through the gate arch and show the pass at the main gate. Don\'t run, and keep clear of <b>officers</b>.</li>' +
        '<li><b>The wire:</b> the <b>key</b> is in the chapel (or craft a lockpick). Craft <b>wire cutters</b> for the two fences and a <b>bedsheet rope</b> for the park wall. Towers and a dog patrol the park.</li>' +
        '<li><b>Roll call</b> rings every four minutes, with a minute\'s warning: be in the marked ranks in battledress — or leave a dummy there. Miss it and the whole castle hunts you.</li>' +
        '<li><b>Scrounge and craft:</b> hold <b>F</b> on <b>?</b> spots to search bunks, parcels, benches and cupboards for odds and ends, then press <b>C</b> to make a <b>shiv</b> (E: silent takedown from behind), a <b>zip gun</b>, <b>smoke bombs</b>, <b>tin rattles</b>, a <b>lockpick</b>, <b>doped chocolate</b> for the dog, a <b>bribe</b> or a <b>roll-call dummy</b>. Keys <b>1-4</b> pick what you throw or fire; click to use.</li>' +
        '<li><b>SHIFT</b> creeps quietly, <b>SPACE</b> sprints (and draws eyes). <b>Q</b> gets the stooges to start a row in the courtyard — every goon nearby goes to look.</li></ul>' +
        '<button class="bGo" id="m11Go">BEGIN THE ESCAPE ▶</button></div></div>';
    b.hidden = false; b.style.display = '';
    const txt = '2 July 1944, 22:40. Lights out in forty minutes. The committee says tonight is the night.';
    const el = document.getElementById('m11Typed'); let i = 0; const iv = setInterval(function () { i += 2; el.textContent = txt.slice(0, i); if (i >= txt.length) clearInterval(iv); }, 22);
    document.getElementById('m11Go').onclick = function () { clearInterval(iv); b.hidden = true; try { playTone(400, 900, .2, .06, 'triangle'); } catch (e) {} m11Begin(); };
}
/* ---------- ending: the night train, the border at dawn ---------- */
const M11E = { dur: 16, cut: 7, cut2: 12.6 };
function m11PlayEnding(done) {
    const E = M11E; E.t0 = performance.now(); E.done = done; canvas.style.cursor = ''; if (!CS2.grain) CS2.grain = cs2Grain();
    E.skip = function (e) { if (e.code === 'Space' || e.code === 'Escape') { e.preventDefault(); E.t0 -= 60000; } }; window.addEventListener('keydown', E.skip);
    cancelAnimationFrame(E.raf); E.raf = requestAnimationFrame(m11EndFrame);
}
function m11EndFrame(now) {
    const E = M11E, t = (now - E.t0) / 1000, w = canvas.width, h = canvas.height, U = w / 1600, hv = h / U;
    if (t >= E.dur) { window.removeEventListener('keydown', E.skip); if (E.done) E.done(); return; }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); ctx.scale(U, U);
    try { if (t < E.cut) m11EShotA(t, hv); else m11EShotB(t - E.cut, hv); } catch (e) { DDP.err = e; }
    ctx.restore(); try { ddpBloom(w, h); } catch (e) {}
    ctx.save(); ctx.globalAlpha = .08; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(CS2.grain, -Math.random() * 220, -Math.random() * 220, w + 220, h + 220); ctx.restore();
    const vg = ctx.createRadialGradient(w / 2, h * .52, w * .24, w / 2, h * .52, w * .74); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    const bar = Math.round(h * .062); ctx.fillStyle = '#050605'; ctx.fillRect(0, 0, w, bar); ctx.fillRect(0, h - bar, w, bar);
    const route = M11.route === 'wire' ? 'OVER THE WIRE AND THROUGH THE WOODS TO THE STATION.' : 'THROUGH THE MAIN GATE ON A FORGED PASS.';
    const caps = [[.6, route], [3.2, 'THE NIGHT TRAIN TO SINGEN. HIS PAPERS HELD.'], [7.4, 'SIX MILES ON FOOT ALONG THE WIRE AT FIRST LIGHT.'], [10.0, 'THEN SWITZERLAND.']];
    let ci = -1; caps.forEach(function (c, i) { if (t >= c[0]) ci = i; }); if (ci >= 0 && t < E.cut2) { const c = caps[ci], n = Math.min(c[1].length, Math.floor((t - c[0]) * 34)); ctx.textAlign = 'center'; ctx.fillStyle = '#efe6c6'; ctx.font = '700 16px "Special Elite", "Courier New", monospace'; ctx.fillText(c[1].slice(0, n), w / 2, h - bar - 14); }
    if (t > E.cut2) { const k = Math.min(1, (t - E.cut2) / .8); ctx.fillStyle = 'rgba(0,0,0,' + .55 * k + ')'; ctx.fillRect(0, 0, w, h); ctx.save(); ctx.globalAlpha = k; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd24a'; ctx.font = '700 ' + Math.round(w * .05) + 'px "Stardos Stencil", Impact, sans-serif'; ctx.fillText('HOME RUN', w / 2, h * .44); ctx.fillStyle = '#e8e0c0'; ctx.font = Math.round(w * .014) + 'px "Special Elite", monospace'; ctx.fillText('CAPT. DOYLE REACHED BERNE ON 4 JULY 1944. HIS REPORT WAS IN LONDON BY THE 9TH.', w / 2, h * .44 + w * .03); ctx.fillStyle = '#9fb27a'; ctx.fillText('OFLAG IV-C — ONE FEWER', w / 2, h * .44 + w * .055); ctx.restore(); }
    const fa = Math.max(Math.max(0, 1 - t / .8), Math.max(0, (t - (E.dur - 1)) / 1)); if (fa > 0) { ctx.fillStyle = 'rgba(0,0,0,' + Math.min(1, fa) + ')'; ctx.fillRect(0, 0, w, h); }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(239,230,198,.35)'; ctx.font = '11px monospace'; ctx.fillText('SPACE — SKIP', w - 18, h - 8);
    E.raf = requestAnimationFrame(m11EndFrame);
}
