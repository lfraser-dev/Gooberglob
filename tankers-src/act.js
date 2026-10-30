/* =====================================================
   END-OF-ACT CARDS (after Mission 4 and Mission 8)
===================================================== */
const ACTS = {
    1: { num: 'I', name: 'THE BEACHHEAD', range: [1, 2, 3, 4], dates: '6 – 9 JUNE 1944', text: 'Four days ago you came ashore under the guns. The beach is ours, the bridge held, and the Tiger that haunted the bocage is scrap metal in a sunken lane. But something in the hills is still shelling the beach.', next: 'NEXT · ACT II — THE GUN IN THE HILLS' },
    2: { num: 'II', name: 'THE GUN IN THE HILLS', range: [5, 6, 7, 8], dates: '10 – 14 JUNE 1944', text: 'A pilot saved, a convoy delivered, an armoured train stopped cold, and the largest gun ever built lying broken in its own yard. The beach sleeps tonight. To the east the Germans are digging in around Caen, and someone has asked for No. 2 Commando again.', next: 'NEXT · ACT III — THE LONG NIGHT' }
};
function actStyle() {
    if (document.getElementById('actStyle')) return; const s = document.createElement('style'); s.id = 'actStyle';
    s.textContent = '#actCard{position:fixed;inset:0;z-index:7600;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px;background:radial-gradient(ellipse at 50% 40%,#2a2a1c 0%,#121209 60%,#050503 100%);color:#efe6c6;font-family:"Special Elite","Courier New",monospace;overflow:auto;animation:actIn .6s ease-out}' +
        '#actCard[hidden]{display:none}#actCard:before{content:"";position:fixed;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 3px);mix-blend-mode:overlay}' +
        '@keyframes actIn{from{opacity:0}to{opacity:1}}@keyframes actDrop{from{opacity:0;transform:translateY(-30px) scale(1.15)}to{opacity:1;transform:none}}@keyframes actCardIn{from{opacity:0;transform:translateY(24px) rotate(-2deg)}to{opacity:1;transform:none}}@keyframes actStamp{0%{opacity:0;transform:translate(-50%,-50%) rotate(-14deg) scale(3)}70%{opacity:1;transform:translate(-50%,-50%) rotate(-14deg) scale(.92)}100%{opacity:1;transform:translate(-50%,-50%) rotate(-14deg) scale(1)}}' +
        '#actCard .aTop{font-size:13px;letter-spacing:6px;color:#c8b884;animation:actDrop .7s .1s both}#actCard .aEnd{font:700 clamp(40px,7vw,86px) "Stardos Stencil",Impact,sans-serif;letter-spacing:8px;line-height:1;color:#f4ecd0;text-shadow:4px 4px 0 #000,0 0 40px rgba(214,169,28,.25);animation:actDrop .8s .25s both}' +
        '#actCard .aName{display:flex;align-items:center;gap:16px;font:700 clamp(16px,2.4vw,26px) "Stardos Stencil",Impact;letter-spacing:5px;color:#d6a91c;animation:actDrop .8s .45s both}#actCard .aName:before,#actCard .aName:after{content:"";width:80px;height:3px;background:#d6a91c}' +
        '#actCard .aDates{font-size:12px;letter-spacing:4px;color:#a89c74;animation:actDrop .8s .55s both}' +
        '#actCard .aRow{position:relative;display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin:10px 0 4px}' +
        '#actCard .aMis{width:190px;background:linear-gradient(180deg,#e2d8b2,#c8bc90);color:#24251d;border:3px solid #4b5230;box-shadow:5px 5px 0 rgba(0,0,0,.6);padding:10px 12px;text-align:left;animation:actCardIn .5s both}' +
        '#actCard .aMis .n{font:700 11px "Stardos Stencil",Impact;letter-spacing:2px;color:#7a2a1f}#actCard .aMis .t{font:700 17px "Stardos Stencil",Impact;letter-spacing:1px;margin:2px 0}#actCard .aMis .d{font-size:10px;letter-spacing:1px;color:#55543f}' +
        '#actCard .aMis .s{margin-top:6px;font-size:20px;letter-spacing:2px;color:rgba(0,0,0,.18)}#actCard .aMis .s i{font-style:normal}#actCard .aMis .s i.on{color:#c9961f;text-shadow:1px 1px 0 #5a3f10}' +
        '#actCard .aStamp{position:absolute;left:50%;top:50%;white-space:nowrap;padding:4px 20px;border:6px double #b8281a;color:#c8301e;font:700 clamp(24px,3.4vw,42px) "Stardos Stencil",Impact;letter-spacing:5px;background:rgba(240,230,200,.55);pointer-events:none;mix-blend-mode:normal;animation:actStamp .45s 1.9s both;text-shadow:0 0 1px #c8301e}' +
        '#actCard .aTot{font:700 14px "Stardos Stencil",Impact;letter-spacing:4px;color:#e2c460;animation:actDrop .6s 2.2s both}' +
        '#actCard .aText{max-width:720px;text-align:center;font-size:15px;line-height:1.6;color:#e8e0c0;min-height:72px}' +
        '#actCard .aNext{font:700 15px "Stardos Stencil",Impact;letter-spacing:4px;color:#9fb27a;border-top:1px solid #3a3e28;border-bottom:1px solid #3a3e28;padding:8px 18px;animation:actDrop .6s 2.6s both}' +
        '#actCard .aGo{margin-top:6px;background:#c9961f;color:#2a210b;border:4px solid #3a2e12;box-shadow:4px 4px 0 #000;padding:11px 36px;font:700 20px "Stardos Stencil",Impact;letter-spacing:5px;cursor:pointer;animation:actDrop .6s 2.8s both}#actCard .aGo:hover{background:#e0b038}';
    document.head.appendChild(s);
}
function actCardShow(n, then) {
    const A = ACTS[n]; if (!A) { if (then) then(); return; } try { progression.actSeen = progression.actSeen || {}; if (!progression.actSeen[n]) { progression.actSeen[n] = true; saveProgression(); } } catch (e) {}
    actStyle(); let el = document.getElementById('actCard'); if (!el) { el = document.createElement('div'); el.id = 'actCard'; document.body.appendChild(el); }
    const stars = progression.campaignStars || {}; let tot = 0;
    const cards = A.range.map(function (m, i) { const M = (typeof cmapM === 'function' && cmapM(m)) || { name: 'MISSION ' + m, date: '' }, st = stars[m] || 0; tot += st; return '<div class="aMis" style="animation-delay:' + (.9 + i * .18) + 's"><div class="n">MISSION ' + String(m).padStart(2, '0') + '</div><div class="t">' + M.name + '</div><div class="d">' + (M.date || '') + '</div><div class="s">' + [0, 1, 2].map(function (k) { return '<i class="' + (k < st ? 'on' : '') + '">★</i>'; }).join('') + '</div></div>'; }).join('');
    el.innerHTML = '<div class="aTop">OPERATION OVERLORD</div><div class="aEnd">END OF ACT ' + A.num + '</div><div class="aName">' + A.name + '</div><div class="aDates">' + A.dates + '</div>' +
        '<div class="aRow">' + cards + '<div class="aStamp">ACT ' + A.num + ' COMPLETE</div></div><div class="aTot">CAMPAIGN STARS · ' + tot + ' / ' + (A.range.length * 3) + '</div><div class="aText" id="actText"></div><div class="aNext">' + A.next + '</div><button class="aGo" id="actGo">CONTINUE ▶</button>';
    el.hidden = false;
    try { initAudio(); [392, 523, 659, 784].forEach(function (f, i) { setTimeout(function () { try { playTone(f, f, .3, .06, 'triangle'); } catch (e) {} }, 300 + i * 160); }); setTimeout(function () { try { playExplosionSound(.7); playTone(150, 50, .45, .1, 'square'); } catch (e) {} }, 1950); } catch (e) {}
    const tx = document.getElementById('actText'); let i = 0; const iv = setTimeout(function run() { i += 2; tx.textContent = A.text.slice(0, i); if (i < A.text.length && !el.hidden) setTimeout(run, 22); }, 2300);
    const close = function () { if (el.hidden) return; el.hidden = true; window.removeEventListener('keydown', key); clearTimeout(iv); if (then) then(); };
    const key = function (e) { if ((e.code === 'Space' || e.code === 'Enter') && !el.hidden) { e.preventDefault(); close(); } };
    document.getElementById('actGo').onclick = close; setTimeout(function () { window.addEventListener('keydown', key); }, 1200);
}
/* ---------- campaign map: act banners ---------- */
function cmapRibbon(x, y, rot, w, main, sub, col, done, act) {
    const h = 28, x0 = -w / 2; let o = '<g class="' + (act ? 'cmAct' : '') + '" data-act="' + (act || '') + '" transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')" style="cursor:' + (act ? 'pointer' : 'default') + '">';
    o += '<path d="M' + (x0 - 22) + ',6 L' + (x0 + 6) + ',6 L' + (x0 + 6) + ',' + (h + 6) + ' L' + (x0 - 22) + ',' + (h + 6) + ' L' + (x0 - 12) + ',' + (h / 2 + 6) + ' Z" fill="' + col[1] + '" stroke="#24180e" stroke-width="1.5"/>';
    o += '<path d="M' + (-x0 + 22) + ',6 L' + (-x0 - 6) + ',6 L' + (-x0 - 6) + ',' + (h + 6) + ' L' + (-x0 + 22) + ',' + (h + 6) + ' L' + (-x0 + 12) + ',' + (h / 2 + 6) + ' Z" fill="' + col[1] + '" stroke="#24180e" stroke-width="1.5"/>';
    o += '<rect x="' + (x0 + 3) + '" y="3" width="' + w + '" height="' + h + '" fill="rgba(0,0,0,.35)"/><rect x="' + x0 + '" y="0" width="' + w + '" height="' + h + '" fill="' + col[0] + '" stroke="#24180e" stroke-width="2"/>';
    o += '<line x1="' + (x0 + 5) + '" y1="4" x2="' + (-x0 - 5) + '" y2="4" stroke="rgba(255,240,200,.45)" stroke-width="1" stroke-dasharray="4 3"/><line x1="' + (x0 + 5) + '" y1="' + (h - 4) + '" x2="' + (-x0 - 5) + '" y2="' + (h - 4) + '" stroke="rgba(255,240,200,.45)" stroke-width="1" stroke-dasharray="4 3"/>';
    o += '<text x="0" y="' + (h / 2 + 5.5) + '" text-anchor="middle" font-family="Impact,sans-serif" font-size="14" letter-spacing="1.5" fill="#f6edc8">' + main + '</text>';
    if (sub) o += '<rect x="' + (-w * .48) + '" y="' + (h + 2) + '" width="' + (w * .96) + '" height="17" fill="rgba(238,230,200,.95)" stroke="#24180e" stroke-width="1.4"/><text x="0" y="' + (h + 14.5) + '" text-anchor="middle" font-family="monospace" font-weight="700" font-size="9" letter-spacing=".5" fill="#3a2a14">' + sub + '</text>';
    if (done) o += '<g transform="translate(' + (-x0 - 4) + ' -6) rotate(14)"><circle r="15" fill="#e8c860" stroke="#6a4a10" stroke-width="2"/><text y="4.5" text-anchor="middle" font-family="Impact,sans-serif" font-size="13" fill="#5a3a08">★</text></g>';
    return o + '</g>';
}
function cmapActBanners() {
    const P = progression || {}, red = ['#9b2a1f', '#6a1a12'], olive = ['#5f6a3a', '#3e4626'], grey = ['#7a745e', '#55503e'];
    let o = '';
    // end-of-act banners on the road between the acts
    o += cmapRibbon(842, 368, -8, 150, 'END OF ACT I', P.campaignM4Done ? 'THE BEACHHEAD ▸' : 'THE BEACHHEAD', P.campaignM4Done ? red : grey, !!P.campaignM4Done, P.campaignM4Done ? 1 : 0);
    o += cmapRibbon(186, 448, 5, 150, 'END OF ACT II', P.campaignM8Done ? 'GUN IN THE HILLS ▸' : 'GUN IN THE HILLS', P.campaignM8Done ? red : grey, !!P.campaignM8Done, P.campaignM8Done ? 2 : 0);
    return o;
}
function actCatchUp() { // anyone who finished an act before the cards existed sees them once on the campaign map
    const P = progression || {}, seen = P.actSeen || {}, cs = document.getElementById('campaignScreen'); if (!cs || cs.style.display === 'none') return;
    if (P.campaignM4Done && !seen[1]) actCardShow(1, function () { if (P.campaignM8Done && !(progression.actSeen || {})[2]) actCardShow(2); });
    else if (P.campaignM8Done && !seen[2]) actCardShow(2);
}
