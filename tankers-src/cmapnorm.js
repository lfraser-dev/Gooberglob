/* Normandy detail (missions 1-9), drawn inside the theatre map inset */
function cmapNormandyInner() {
    const W = 1030, H = 610; let o = '';
    o += '<defs><linearGradient id="cnSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f8d94"/><stop offset=".7" stop-color="#8fb0b0"/><stop offset="1" stop-color="#a7c3bb"/></linearGradient>' +
        '<linearGradient id="cnLand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6c892"/><stop offset=".5" stop-color="#cbbc84"/><stop offset="1" stop-color="#bfae78"/></linearGradient>' +
        '<radialGradient id="cnVig" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="rgba(60,40,10,0)"/><stop offset="1" stop-color="rgba(60,40,10,.42)"/></radialGradient>' +
        '<pattern id="cnHatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="rgba(110,90,40,.22)" stroke-width="1.4"/></pattern>' +
        '<filter id="cnRough"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .3  0 0 0 0 .22  0 0 0 0 .08  0 0 0 .22 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>';
    // land + sea
    o += '<rect width="' + W + '" height="' + H + '" fill="url(#cnLand)"/>';
    const coast = 'M0,168 C70,148 140,196 220,184 S350,150 450,170 S620,206 720,164 S870,150 960,178';
    o += '<path d="' + coast + ' L960,0 L0,0 Z" fill="url(#cnSea)"/>';
    for (let i = 0; i < 46; i++) { const x = cmapR(i) * 940, y = 12 + cmapR(i + 50) * 138, w = 14 + cmapR(i + 9) * 22; o += '<path class="cmWave" style="animation-delay:' + (-cmapR(i + 3) * 6).toFixed(2) + 's" d="M' + x.toFixed(0) + ',' + y.toFixed(0) + ' q' + (w / 4).toFixed(0) + ',-4 ' + (w / 2).toFixed(0) + ',0 t' + (w / 2).toFixed(0) + ',0" fill="none" stroke="rgba(255,255,255,.32)" stroke-width="1.4"/>'; }
    o += '<path d="' + coast + '" fill="none" stroke="#e8d9a0" stroke-width="12" stroke-linecap="round" opacity=".85"/><path d="' + coast + '" fill="none" stroke="#7d6b3c" stroke-width="2.2" stroke-dasharray="1 0"/>';
    o += '<path d="' + coast + ' L960,600 L0,600 Z" fill="url(#cnHatch)" opacity=".7"/>';
    // fields (patchwork)
    for (let i = 0; i < 70; i++) { const x = 20 + cmapR(i * 2 + 1) * 920, y = 215 + cmapR(i * 2 + 2) * 370, w = 38 + cmapR(i + 7) * 52, h = 26 + cmapR(i + 3) * 40, k = cmapR(i + 11); o += '<rect x="' + x.toFixed(0) + '" y="' + y.toFixed(0) + '" width="' + w.toFixed(0) + '" height="' + h.toFixed(0) + '" fill="' + (k < .3 ? 'rgba(130,150,70,.28)' : k < .6 ? 'rgba(190,170,90,.30)' : 'rgba(120,110,60,.18)') + '" stroke="rgba(70,90,40,.32)" stroke-width="1" transform="rotate(' + (cmapR(i + 21) * 14 - 7).toFixed(1) + ' ' + x.toFixed(0) + ' ' + y.toFixed(0) + ')"/>'; }
    // bocage hedgerow grid around mission 4
    for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { const x = 650 + i * 48 + cmapR(i * 5 + j) * 6, y = 232 + j * 40 + cmapR(i + j * 9) * 6; o += '<rect x="' + x.toFixed(0) + '" y="' + y.toFixed(0) + '" width="44" height="36" fill="rgba(80,120,50,.16)" stroke="rgba(40,80,28,.7)" stroke-width="2.4" stroke-dasharray="5 2" rx="4"/>'; }
    // forests
    [[110, 330, 60, 38], [160, 470, 70, 40], [450, 500, 80, 36], [860, 330, 46, 52], [260, 560, 60, 24], [880, 560, 50, 30], [470, 250, 50, 30]].forEach(function(f, fi) { for (let k = 0; k < 14; k++) { const a = cmapR(fi * 30 + k) * 6.28, r = cmapR(fi * 30 + k + 5), x = f[0] + Math.cos(a) * f[2] * r, y = f[1] + Math.sin(a) * f[3] * r; o += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + (8 + cmapR(k + fi) * 6).toFixed(0) + '" fill="#58773a" stroke="#3a5527" stroke-width="1.2" opacity=".9"/>'; } });
    // ridge contours at mission 2
    for (let i = 0; i < 5; i++) o += '<ellipse cx="352" cy="312" rx="' + (30 + i * 17) + '" ry="' + (16 + i * 9) + '" fill="none" stroke="rgba(110,80,30,' + (.55 - i * .07).toFixed(2) + ')" stroke-width="1.5" transform="rotate(-18 352 312)"/>';
    // river + bridge
    const river = 'M-10,386 C110,350 250,424 400,404 S520,402 560,400 S700,420 820,442 S920,456 970,432';
    o += '<path d="' + river + '" fill="none" stroke="#5c7c80" stroke-width="22" stroke-linecap="round" opacity=".9"/><path d="' + river + '" fill="none" stroke="#8eb0ae" stroke-width="15" stroke-linecap="round"/><path d="' + river + '" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2" stroke-dasharray="3 14"/>';
    // towns
    [[120, 270, 5], [470, 330, 6], [880, 240, 5], [320, 470, 4], [620, 520, 5], [560, 262, 4]].forEach(function(t, ti) { for (let k = 0; k < t[2]; k++) { const x = t[0] + cmapR(ti * 9 + k) * 34 - 14, y = t[1] + cmapR(ti * 9 + k + 3) * 22 - 8; o += '<rect x="' + x.toFixed(0) + '" y="' + y.toFixed(0) + '" width="9" height="7" fill="#7a3d2b" stroke="#3b1c12" stroke-width="1"/>'; } });
    // route (road): painted in full, then progress overlay
    const pts = CMAP_M.filter(function(m) { return m.n <= 4; }).map(function(m) { return [m.x, m.y]; });
    const m7p = cmapM(7);
    function seg(a, b, ci) { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], k = (ci % 2 ? 1 : -1) * .16; return 'C' + (a[0] + dx * .35 - dy * k).toFixed(0) + ',' + (a[1] + dy * .35 + dx * k).toFixed(0) + ' ' + (a[0] + dx * .65 - dy * k).toFixed(0) + ',' + (a[1] + dy * .65 + dx * k).toFixed(0) + ' ' + b[0] + ',' + b[1]; }
    const m5p = cmapM(5), m6p = cmapM(6), all = pts.concat([[m5p.x, m5p.y], [m6p.x, m6p.y], [m7p.x, m7p.y], [cmapM(8).x, cmapM(8).y], [cmapM(9).x, cmapM(9).y]]);
    let full = 'M' + all[0][0] + ',' + all[0][1]; for (let i = 1; i < all.length; i++) full += ' ' + seg(all[i - 1], all[i], i);
    o += '<path d="' + full + '" fill="none" stroke="rgba(60,40,15,.55)" stroke-width="7" stroke-linecap="round"/><path d="' + full + '" fill="none" stroke="#e8dcae" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="10 8"/>';
    let prog = ''; let any = false; for (let n = 1; n < 4; n++) if (cmapDone(n)) { prog += (any ? ' ' : 'M' + pts[n - 1][0] + ',' + pts[n - 1][1] + ' ') + seg(pts[n - 1], pts[n], n); any = true; } else break;
    if (prog) o += '<path d="' + prog + '" fill="none" stroke="#b03a2a" stroke-width="5" stroke-linecap="round"/><path d="' + prog + '" fill="none" stroke="#ffd9a0" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="2 9"/>';
    // invasion arrows across the channel
    [[150, 20, 205, 176], [260, 14, 232, 178], [60, 40, 190, 170]].forEach(function(a, i) { const mx = (a[0] + a[2]) / 2 - 24 + i * 8, my = (a[1] + a[3]) / 2; o += '<path d="M' + a[0] + ',' + a[1] + ' Q' + mx + ',' + my + ' ' + a[2] + ',' + a[3] + '" fill="none" stroke="#2f5a8a" stroke-width="' + (6 - i) + '" stroke-linecap="round" opacity=".85"/><path d="M' + (a[2] - 9) + ',' + (a[3] - 14) + ' L' + a[2] + ',' + a[3] + ' L' + (a[2] + 10) + ',' + (a[3] - 12) + '" fill="none" stroke="#2f5a8a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>'; });
    // ships
    [[420, 60], [520, 100], [610, 48], [700, 112], [330, 108], [800, 70]].forEach(function(p, i) { o += '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + (i * 7 - 12) + ')" opacity=".9"><path d="M-18,0 L18,0 L24,-5 L-22,-5 Z" fill="#41505a"/><rect x="-6" y="-11" width="10" height="6" fill="#52646e"/><path d="M-24,3 Q0,9 24,3" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/></g>'; });
    // labels
    o += '<g font-family="Georgia, serif" font-style="italic" fill="rgba(40,30,12,.62)" letter-spacing="4"><text x="560" y="34" font-size="22" text-anchor="middle" fill="rgba(235,245,240,.75)" letter-spacing="10">ENGLISH  CHANNEL</text>' +
        '<text x="480" y="560" font-size="26" text-anchor="middle" letter-spacing="14">NORMANDY</text><text x="130" y="248" font-size="12" text-anchor="middle">Beachhead</text><text x="352" y="270" font-size="12" text-anchor="middle">Ridge</text><text x="600" y="432" font-size="12" text-anchor="middle">R. Aure</text><text x="790" y="226" font-size="12" text-anchor="middle">Bocage</text></g>';
    // grid
    for (let i = 1; i < 6; i++) o += '<line x1="' + (i * 160) + '" y1="0" x2="' + (i * 160) + '" y2="' + H + '" stroke="rgba(60,45,15,.12)"/>'; for (let j = 1; j < 4; j++) o += '<line x1="0" y1="' + (j * 150) + '" x2="' + W + '" y2="' + (j * 150) + '" stroke="rgba(60,45,15,.12)"/>';
    o += '<g font-family="monospace" font-size="11" fill="rgba(50,35,10,.6)">' + ['A', 'B', 'C', 'D', 'E', 'F'].map(function(c, i) { return '<text x="' + (i * 160 + 76) + '" y="594">' + c + '</text>'; }).join('') + [1, 2, 3, 4].map(function(c, j) { return '<text x="6" y="' + (j * 150 + 80) + '">' + c + '</text>'; }).join('') + '</g>';
    // compass + scale + stamp
    o += '<g transform="translate(70 520)"><circle r="34" fill="rgba(235,225,185,.7)" stroke="#4a3a1a" stroke-width="2"/><path d="M0,-30 L6,0 L0,30 L-6,0 Z" fill="#4a3a1a"/><path d="M-30,0 L0,-6 L30,0 L0,6 Z" fill="rgba(74,58,26,.55)"/><path d="M0,-30 L6,0 L-6,0 Z" fill="#9b2a1f"/><text y="-38" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="13" fill="#4a3a1a">N</text></g>';
    o += '<g transform="translate(790 566)" font-family="monospace" font-size="10" fill="#4a3a1a"><rect width="120" height="5" fill="#4a3a1a"/><rect x="60" width="30" height="5" fill="#d8c99a"/><text y="-5">0</text><text x="52" y="-5">10</text><text x="104" y="-5">20 MI</text></g>';
    o += '<g transform="translate(26 30) rotate(-4)"><rect width="214" height="44" fill="rgba(235,225,185,.85)" stroke="#9b2a1f" stroke-width="3"/><text x="107" y="19" text-anchor="middle" font-family="Impact,sans-serif" font-size="13" letter-spacing="1.5" fill="#9b2a1f">OPERATION OVERLORD</text><text x="107" y="36" text-anchor="middle" font-family="monospace" font-size="11" letter-spacing="2" fill="#4a3a1a">ACT I · TOP SECRET</text></g>';
    o += '<rect width="' + W + '" height="' + H + '" fill="url(#cnVig)" pointer-events="none"/>';
    o += '<g transform="translate(740 590)" font-family="monospace" font-size="10" fill="rgba(50,35,10,.0)"></g>';
    // mission nodes
    CMAP_M.filter(function(m) { return m.n <= 9; }).forEach(function(m) {
        const unl = cmapUnlocked(m.n), done = cmapDone(m.n), front = unl && !done, sel = CMAP.sel === m.n, st = cmapStars(m.n);
        const fill = done ? '#5f7a3a' : (unl ? '#b03a2a' : '#8a8466'), cls = done ? 'done' : (unl ? 'open' : 'lock');
        o += '<g class="cmNode ' + cls + (sel ? ' sel' : '') + '" data-m="' + m.n + '" transform="translate(' + m.x + ' ' + m.y + ') scale(1.1)" tabindex="0" role="button" aria-label="Mission ' + m.n + ': ' + m.name + (unl ? '' : ' (locked)') + '">';
        if (front) o += '<circle class="cmPulse" r="22" fill="none" stroke="#b03a2a" stroke-width="3"/>';
        if (sel) o += '<circle class="cmSel" r="31" fill="none" stroke="#24251d" stroke-width="2.6" stroke-dasharray="7 6"/>';
        o += '<g class="ring"><circle r="23" fill="rgba(0,0,0,.35)" cx="3" cy="4"/><circle r="22" fill="' + fill + '" stroke="#24251d" stroke-width="3.5"/><circle r="17" fill="none" stroke="' + (unl ? '#f2e4b0' : '#5b574a') + '" stroke-width="1.6"/>';
        if (done) o += '<path d="M-9,1 L-3,8 L10,-8" fill="none" stroke="#f6edc8" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>';
        else if (unl) o += '<text y="8" text-anchor="middle" font-family="Impact,sans-serif" font-size="22" fill="#f6edc8">' + m.n + '</text>';
        else o += '<rect x="-7" y="-2" width="14" height="11" rx="2" fill="#3a3a2c"/><path d="M-4.5,-2 V-6 a4.5,4.5 0 0 1 9,0 V-2" fill="none" stroke="#3a3a2c" stroke-width="2.4"/>';
        o += '</g>';
        const right = m.x < 640 || m.n === 4 || m.n === 5, tx = right ? 34 : -34, anc = right ? 'start' : 'end', tw = m.ph ? 100 : 176;
        o += '<g transform="translate(' + tx + ' -22)"><rect x="' + (right ? 0 : -tw) + '" y="' + (m.ph ? 8 : 0) + '" width="' + tw + '" height="' + (m.ph ? 26 : (done ? 50 : 40)) + '" fill="rgba(238,230,200,.92)" stroke="#24251d" stroke-width="2"/>' +
            '<text x="' + (right ? 8 : -8) + '" y="' + (m.ph ? 26 : 15) + '" text-anchor="' + anc + '" font-family="Impact,sans-serif" font-size="12.5" letter-spacing="1" fill="' + (unl ? '#24251d' : '#6a6650') + '">' + String(m.n).padStart(2, '0') + ' · ' + m.name + '</text>' +
            (m.ph ? '' : '<text x="' + (right ? 8 : -8) + '" y="30" text-anchor="' + anc + '" font-family="monospace" font-size="10" fill="#4a4a3a">' + m.date.split(' \u00b7 ')[0] + '</text>');
        if (done) { o += '<text x="' + (right ? 8 : -8) + '" y="44" text-anchor="' + anc + '" font-size="13" fill="#b08d3c">' + [0, 1, 2].map(function(i) { return i < st ? '★' : '☆'; }).join('') + '</text>'; }
        o += '</g></g>';
    });

    return o;
}

