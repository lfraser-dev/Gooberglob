
// ===== each game-mode screen gets its own animated backdrop (no 3D, cheap CSS/SVG) =====
(function () {
    const svg = function (s) { return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")'; };
    // topo contour lines for SKIRMISH
    let topo = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><g fill="none" stroke="rgba(214,190,120,.13)" stroke-width="1.3">';
    for (let k = 0; k < 9; k++) { const r = 40 + k * 34; topo += '<path d="M' + (300 - r) + ' 300 C' + (300 - r) + ' ' + (300 - r * 1.1) + ',' + (300 + r * .9) + ' ' + (300 - r * .8) + ',' + (300 + r) + ' 300 S' + (300 - r * .4) + ' ' + (300 + r * 1.2) + ',' + (300 - r) + ' 300Z"/>'; }
    topo += '</g><g fill="none" stroke="rgba(214,190,120,.08)" stroke-width="1"><path d="M0 120 Q150 80 300 130 T600 110"/><path d="M0 480 Q160 520 320 470 T600 500"/></g></svg>';
    // tactical grid with objectives for POINT CONTROL
    const grid = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><path d="M80 0H0V80" fill="none" stroke="rgba(120,220,200,.1)" stroke-width="1"/><path d="M40 0V80M0 40H80" fill="none" stroke="rgba(120,220,200,.04)" stroke-width="1"/></svg>';
    // diamond plate for the GARAGE
    const plate = '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><rect width="44" height="44" fill="#1d1e1b"/><g fill="#2c2d29" stroke="#141512" stroke-width="1"><path d="M6 14 l8 -8 l3 3 l-8 8z"/><path d="M28 36 l8 -8 l3 3 l-8 8z"/><path d="M28 6 l8 8 l-3 3 l-8 -8z"/><path d="M6 28 l8 8 l-3 3 l-8 -8z"/></g></svg>';
    // wood grain for the CAMPAIGN war room table
    let wood = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120"><rect width="400" height="120" fill="#2a1a10"/>'; for (let i = 0; i < 14; i++) { const y = 4 + i * 8.5; wood += '<path d="M0 ' + y + ' C100 ' + (y + 3 * Math.sin(i)) + ' 200 ' + (y - 4 * Math.cos(i)) + ' 400 ' + (y + 2) + '" stroke="rgba(' + (i % 2 ? '70,44,24' : '20,12,6') + ',.6)" stroke-width="' + (1 + (i % 3)) + '" fill="none"/>'; } wood += '</svg>';
    const st = document.createElement('style'); st.textContent =
        '#m3bg{position:fixed;inset:0;z-index:-1;display:none;overflow:hidden;pointer-events:none;}body.m3sub #m3bg{display:block;}html.m3subH{background:#060705 !important;}body.m3sub{background:transparent !important;}' +
        '#m3bg i{position:absolute;inset:0;display:block;}#m3bg .vig{background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 30%,rgba(0,0,0,.75) 100%);}' +
        // header for the sub screens (same as the main menu title)
        'body.m3sub h1{background:linear-gradient(180deg,rgba(0,0,0,.6),rgba(0,0,0,0)) !important;border-bottom:0 !important;box-shadow:none !important;text-align:left;padding:22px 5vw 10px !important;font-size:clamp(34px,5vw,64px) !important;letter-spacing:.22em !important;color:#f6eed4 !important;text-shadow:0 4px 30px rgba(0,0,0,.6),0 2px 0 #000 !important;}body.m3sub h1::before{display:none !important;}' +
        // SKIRMISH: battlefield map, ember glow
        '#m3bg.s-skirmishScreen .a{background:radial-gradient(ellipse at 80% 110%,rgba(255,110,40,.28),rgba(0,0,0,0) 55%),radial-gradient(ellipse at 10% -10%,rgba(150,160,90,.22),rgba(0,0,0,0) 50%),linear-gradient(180deg,#171a10,#0c0d08);}' +
        '#m3bg.s-skirmishScreen .b{background-image:' + svg(topo) + ';background-size:600px 600px;animation:m3pan 90s linear infinite;opacity:.9;}' +
        '#m3bg.s-skirmishScreen .c{background:repeating-linear-gradient(115deg,rgba(255,200,120,0) 0 220px,rgba(255,200,120,.035) 220px 260px);animation:m3pan2 40s linear infinite;}' +
        // POINT CONTROL: tactical display, pulsing objectives A B C
        '#m3bg.s-pointControlScreen .a{background:radial-gradient(ellipse at 50% 50%,#0f2420,#050b0a 75%);}' +
        '#m3bg.s-pointControlScreen .b{background-image:' + svg(grid) + ';background-size:80px 80px;animation:m3pan 60s linear infinite;}' +
        '#m3bg.s-pointControlScreen .c{background:radial-gradient(circle at 18% 30%,rgba(120,220,200,.22) 0 40px,rgba(0,0,0,0) 42px),radial-gradient(circle at 82% 34%,rgba(255,110,90,.2) 0 40px,rgba(0,0,0,0) 42px),radial-gradient(circle at 50% 78%,rgba(255,210,122,.2) 0 40px,rgba(0,0,0,0) 42px);animation:m3pulse 2.6s ease-in-out infinite;}' +
        '#m3bg.s-pointControlScreen .d{background:conic-gradient(from 0deg at 50% 50%,rgba(120,220,200,.16),rgba(120,220,200,0) 18%,rgba(0,0,0,0));animation:m3spin 8s linear infinite;inset:-50%;}' +
        // CAMPAIGN: war-room table under a hanging lamp
        '#m3bg.s-campaignScreen .a{background-image:' + svg(wood) + ';background-size:400px 120px;}' +
        '#m3bg.s-campaignScreen .b{background:radial-gradient(ellipse at 50% 20%,rgba(255,200,120,.35),rgba(255,170,80,.08) 40%,rgba(0,0,0,.7) 85%);animation:m3lamp 7s ease-in-out infinite;}' +
        '#m3bg.s-campaignScreen .c{background:radial-gradient(circle at 12% 70%,rgba(160,30,20,.5) 0 4px,rgba(0,0,0,0) 5px),radial-gradient(circle at 88% 25%,rgba(160,30,20,.5) 0 4px,rgba(0,0,0,0) 5px),linear-gradient(28deg,rgba(0,0,0,0) 49.7%,rgba(170,40,30,.35) 50%,rgba(0,0,0,0) 50.3%);}' +
        // GARAGE: workshop floor, hazard stripes, swinging work lamp
        '#m3bg.s-garageScreen .a{background-image:' + svg(plate) + ';background-size:44px 44px;}' +
        '#m3bg.s-garageScreen .b{background:radial-gradient(ellipse at 50% 0%,rgba(255,200,120,.32),rgba(0,0,0,0) 60%);animation:m3swing 6s ease-in-out infinite;transform-origin:50% 0;}' +
        '#m3bg.s-garageScreen .c{top:auto;height:26px;bottom:0;background:repeating-linear-gradient(-45deg,#c89a28 0 22px,#141410 22px 44px);opacity:.55;}' +
        // ONLINE BATTLE: radio room radar sweep
        '#m3bg.s-duelScreen .a{background:radial-gradient(circle at 50% 55%,#0b1a10,#030604 70%);}' +
        '#m3bg.s-duelScreen .b{background:repeating-radial-gradient(circle at 50% 55%,rgba(110,230,120,.12) 0 1px,rgba(0,0,0,0) 2px 110px);}' +
        '#m3bg.s-duelScreen .d{background:conic-gradient(from 0deg at 50% 55%,rgba(110,230,120,.28),rgba(110,230,120,0) 14%,rgba(0,0,0,0));animation:m3spin 5s linear infinite;}' +
        '#m3bg.s-duelScreen .c{background:radial-gradient(circle at 30% 40%,rgba(160,255,160,.5) 0 3px,rgba(0,0,0,0) 4px),radial-gradient(circle at 68% 66%,rgba(255,140,110,.55) 0 3px,rgba(0,0,0,0) 4px),radial-gradient(circle at 62% 30%,rgba(160,255,160,.4) 0 2px,rgba(0,0,0,0) 3px);animation:m3pulse 1.8s ease-in-out infinite;}' +
        '@keyframes m3pan{from{background-position:0 0}to{background-position:600px 300px}}@keyframes m3pan2{from{background-position:0 0}to{background-position:1200px 0}}@keyframes m3pulse{0%,100%{opacity:.45}50%{opacity:1}}@keyframes m3spin{to{transform:rotate(360deg)}}@keyframes m3lamp{0%,100%{opacity:.85}50%{opacity:1}}@keyframes m3swing{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}' +
        // accent per screen
        'body[data-m3s=pointControlScreen] .section h2{border-left-color:#78dcc8 !important;color:#9ff0de !important;}body[data-m3s=duelScreen] .section h2{border-left-color:#7ee68a !important;color:#a8f5b0 !important;}body[data-m3s=campaignScreen] .section h2{border-left-color:#d8564a !important;color:#ffb09a !important;}' +
        '@media (prefers-reduced-motion: reduce){#m3bg i{animation:none !important;}}';
    document.head.appendChild(st);
    const bg = document.createElement('div'); bg.id = 'm3bg'; bg.innerHTML = '<i class="a"></i><i class="b"></i><i class="d"></i><i class="c"></i><i class="vig"></i>'; document.body.insertBefore(bg, document.body.firstChild);
    setInterval(function () { const s = document.body.getAttribute('data-m3s') || ''; const c = s ? 's-' + s : ''; if (bg.className !== c) bg.className = c; document.documentElement.classList.toggle('m3subH', document.body.classList.contains('m3sub')); }, 150);
})();
