
// ===== TK3: give every game-mode screen the same 3D-camp background + glass look as the main menu =====
const TK3_SCREENS = ['skirmishScreen', 'pointControlScreen', 'campaignScreen', 'garageScreen', 'duelScreen'];
function tk3SubScreen() { for (let i = 0; i < TK3_SCREENS.length; i++) { const e = document.getElementById(TK3_SCREENS[i]); if (e && e.style.display !== 'none' && getComputedStyle(e).display !== 'none') return TK3_SCREENS[i]; } return null; }
(function () {
    const _vis = tk3MenuVisible; tk3MenuVisible = function () { if (gameRunning || (window.DLOAD && DLOAD.on) || (typeof campaignCutsceneRunning !== 'undefined' && campaignCutsceneRunning)) return false; return _vis.apply(this, arguments) && !tk3SubScreen(); };
    setInterval(function () { const sub = tk3SubScreen(); document.body.classList.toggle('m3sub', !!sub && !gameRunning); document.body.setAttribute('data-m3s', sub || ''); }, 150);
    const P = 'body.m3sub :is(#skirmishScreen,#pointControlScreen,#campaignScreen,#garageScreen,#duelScreen)';
    const st = document.createElement('style'); st.textContent =
        // background is darker / quieter behind the settings screens
        'body.m3sub #menu3d .shade{background:radial-gradient(ellipse at 50% 40%,rgba(4,5,3,.3),rgba(4,5,3,.75) 80%) !important;transition:background .6s;}body.m3sub #menu3dCap,body.m3sub #menu3dHint{display:none !important;}' +
        // the panel
        P + '{max-width:1120px !important;margin:10px auto 40px !important;padding:28px 34px 32px !important;background:linear-gradient(160deg,rgba(18,20,14,.8),rgba(8,10,6,.72)) !important;-webkit-backdrop-filter:blur(12px) saturate(1.2);backdrop-filter:blur(12px) saturate(1.2);border:1px solid rgba(232,200,120,.28) !important;border-radius:12px !important;box-shadow:0 24px 70px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.06) !important;transform:none !important;color:#efe6c8 !important;animation:m3sIn .55s cubic-bezier(.2,.8,.2,1) both;}' +
        '@keyframes m3sIn{from{opacity:0;translate:0 24px}to{opacity:1;translate:0 0}}' +
        P + '::before,' + P + '::after{display:none !important;}' +
        P + ' > h2{display:block !important;transform:none !important;color:#f6eed4 !important;font-size:clamp(28px,4vw,44px) !important;letter-spacing:.2em !important;text-shadow:0 4px 24px rgba(255,150,60,.3) !important;margin:0 0 4px !important;text-align:left;}' +
        P + ' > h2 small{font-size:13px !important;}' +
        P + ' > p{color:rgba(239,230,200,.72) !important;text-align:left;margin:0 0 18px !important;max-width:none !important;}' +
        P + ' > p b{color:#ffd27a;}' +
        // section headings: gold numbered bars instead of wavy underline
        P + ' .section{margin:0 0 6px;padding:14px 0 6px;border-top:1px solid rgba(255,255,255,.07);}' +
        P + ' .section h2,' + P + ' .section > h3{display:block;text-align:left;text-decoration:none !important;transform:none !important;font-size:14px !important;letter-spacing:.35em !important;color:#ffd27a !important;padding:0 0 0 14px !important;margin:0 0 12px !important;border-left:4px solid #c8a040;text-shadow:none !important;}' +
        P + ' p,' + P + ' .choices > p{color:rgba(239,230,200,.7) !important;}' +
        // buttons
        P + ' button{transform:none !important;border-radius:7px !important;background:linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.03)) !important;background-color:rgba(0,0,0,.3) !important;border:1px solid rgba(255,255,255,.14) !important;box-shadow:none !important;color:#f6eed4 !important;outline:none !important;font-family:"Stardos Stencil",Impact,sans-serif;letter-spacing:.08em;transition:transform .15s ease,background .15s ease,border-color .15s ease,box-shadow .15s ease;}' +
        P + ' button:hover:not(:disabled){transform:translateY(-2px) !important;background:linear-gradient(180deg,rgba(255,190,90,.22),rgba(255,190,90,.06)) !important;background-color:rgba(0,0,0,.3) !important;border-color:rgba(255,200,110,.55) !important;}' +
        P + ' button.selected,' + P + ' .dPick button.sel,' + P + ' .dMap button.sel,' + P + ' .dMode button.sel{background:linear-gradient(180deg,rgba(255,196,96,.32),rgba(200,140,40,.18)) !important;border-color:#ffd27a !important;box-shadow:0 0 0 1px #ffd27a,0 0 22px rgba(255,190,90,.35) !important;color:#fff !important;}' +
        P + ' button:disabled{opacity:.45;}' +
        P + ' button.primaryBtn{background:linear-gradient(180deg,#d8562e,#a2321c) !important;border:1px solid #ff9a6a !important;color:#fff4e0 !important;font-size:20px !important;letter-spacing:.22em !important;padding:14px 40px !important;box-shadow:0 8px 26px rgba(200,70,30,.45),inset 0 1px 0 rgba(255,255,255,.25) !important;}' +
        P + ' button.primaryBtn:hover:not(:disabled){background:linear-gradient(180deg,#ec6a3c,#b83a20) !important;box-shadow:0 12px 34px rgba(230,90,40,.6),inset 0 1px 0 rgba(255,255,255,.3) !important;}' +
        P + ' button.ghostBtn{background:transparent !important;border-color:rgba(255,255,255,.22) !important;color:rgba(239,230,200,.85) !important;}' +
        P + ' .flag{box-shadow:0 0 0 1px rgba(0,0,0,.4);}' +
        // tank cards
        P + ' button.tankCard{background:linear-gradient(170deg,rgba(60,66,40,.65),rgba(20,22,14,.7)) !important;}' +
        P + ' button.tankCard.selected{background:linear-gradient(170deg,rgba(140,110,40,.55),rgba(40,32,12,.7)) !important;}' +
        P + ' .tankCard .tcStat,' + P + ' .tankCard.selected .tcStat{color:rgba(239,230,200,.8) !important;}' +
        P + ' .tankCard .tcStat em{background:rgba(0,0,0,.45) !important;border-color:rgba(255,255,255,.15) !important;}' +
        // duel screen cards & inputs
        P + ' .dCard{background:rgba(255,255,255,.04) !important;border:1px solid rgba(255,255,255,.1) !important;border-radius:10px !important;}' + P + ' .dCard h3{color:#ffd27a !important;letter-spacing:.25em !important;}' +
        P + ' input{background:rgba(0,0,0,.4) !important;color:#f6eed4 !important;border:1px solid rgba(255,210,122,.45) !important;border-radius:7px !important;}' + P + ' details summary{color:#ffd27a !important;}' +
        // campaign: mission panel as dark glass, map gets a soft frame
        P + ' #cmapWrap{border-radius:10px;overflow:hidden;box-shadow:0 14px 40px rgba(0,0,0,.55);}' +
        P + ' #cmapPanel{background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.02)) !important;border:1px solid rgba(255,255,255,.12) !important;border-radius:10px !important;color:#efe6c8 !important;box-shadow:none !important;}' +
        P + ' #cmapPanel h3{color:#f6eed4 !important;}' + P + ' #cmapPanel .cpSide > *:not(button):not(.cpStamp):not(.cpStars){color:#ffb08a !important;}' + P + ' #cmapPanel p,' + P + ' #cmapPanel ul{color:rgba(239,230,200,.85) !important;}' + P + ' #cmapPanel .cpD{color:rgba(239,230,200,.6) !important;}' + P + ' #cmapPanel .cpK{color:#ff9a6a !important;}' + P + ' #cmapPanel .cpTag{color:#ffd27a !important;border-color:rgba(255,210,122,.5) !important;}' +
        P + ' #cmapPanel .cpStamp.open{color:#ff8a6a !important;border-color:#ff8a6a !important;}' + P + ' #cmapPanel .cpStamp.done{color:#9fe07a !important;border-color:#9fe07a !important;}' + P + ' #cmapPanel .cpStamp.lock{color:#a8a290 !important;border-color:#a8a290 !important;}' +
        // garage
        P + ' .garageStat{transform:none !important;background:rgba(255,255,255,.06) !important;border:1px solid rgba(255,255,255,.12) !important;border-radius:20px !important;color:rgba(239,230,200,.8) !important;box-shadow:none !important;}' +
        P + ' #showroom{background:linear-gradient(170deg,rgba(60,66,40,.55),rgba(14,16,10,.75)) !important;border:1px solid rgba(255,210,122,.3) !important;border-radius:12px !important;box-shadow:0 14px 40px rgba(0,0,0,.5) !important;transform:none !important;}' +
        P + ' #skinChoices button{background-color:rgba(0,0,0,.35) !important;}' +
        // header strip: show the screen name like a breadcrumb
        'body.m3sub h1::after{content:attr(data-sub);display:block !important;position:static !important;width:auto !important;height:auto !important;margin:6px 0 0 !important;background:none !important;box-shadow:none !important;border-radius:0 !important;font:13px "Special Elite",monospace !important;letter-spacing:.4em !important;color:#ffd27a !important;text-shadow:none !important;}' +
        'body.m3sub #abilityModal{background:rgba(4,5,3,.6) !important;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);}body.m3sub #abilityModalCard{background:linear-gradient(160deg,rgba(28,30,20,.95),rgba(12,14,8,.95)) !important;border:1px solid rgba(255,210,122,.4) !important;border-radius:12px !important;transform:none !important;box-shadow:0 24px 70px rgba(0,0,0,.7) !important;color:#efe6c8 !important;}body.m3sub #abilityModalTitle{color:#f6eed4 !important;}body.m3sub #abilityModalText{color:rgba(239,230,200,.88) !important;}body.m3sub #abilityModalHint{color:rgba(239,230,200,.55) !important;}body.m3sub #abilityModalKey{background:rgba(255,196,96,.2) !important;color:#ffd27a !important;border-color:#ffd27a !important;box-shadow:none !important;}body.m3sub #abilityModalCard button{transform:none !important;border-radius:7px !important;background:linear-gradient(180deg,#d8562e,#a2321c) !important;border:1px solid #ff9a6a !important;color:#fff4e0 !important;box-shadow:0 8px 22px rgba(200,70,30,.4) !important;}' +
        '@media(max-width:760px){' + P + '{padding:18px 16px 22px !important;margin:6px 8px 30px !important;}}';
    document.head.appendChild(st);
    const names = { skirmishScreen: 'OPERATIONS ▸ SKIRMISH', pointControlScreen: 'OPERATIONS ▸ POINT CONTROL', campaignScreen: 'OPERATIONS ▸ CAMPAIGN', garageScreen: 'OPERATIONS ▸ GARAGE', duelScreen: 'OPERATIONS ▸ ONLINE BATTLE' };
    setInterval(function () { const h = document.querySelector('h1'); if (h) { const s = document.body.getAttribute('data-m3s'); h.setAttribute('data-sub', s ? names[s] || '' : ''); } }, 200);
})();
