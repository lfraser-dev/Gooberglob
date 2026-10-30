/* =====================================================
   CAMPAIGN MAP - theatre map of north-west Europe.
   Missions 1-9 sit in the Normandy detail inset; 10-12 sit where they really happened.
===================================================== */
const CMW = { W: 1400, H: 1000, lon0: -8, lat0: 56.5, kx: 50, ky: 80,
    inset: { x: 588, y: 536, w: 802, h: 458 },
    nbox: [-1.95, 48.95, 0.45, 49.75],
    real: { 10: [-3.37, 47.73], 11: [12.79, 51.13], 12: [13.78, 54.14] },
    future: [5.9, 51.98] };
function cmwP(lon, lat) { return [(lon - CMW.lon0) * CMW.kx, (CMW.lat0 - lat) * CMW.ky]; }
function cmwPath(pts, close) { return pts.map(function (q, i) { const p = cmwP(q[0], q[1]); return (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + (close ? ' Z' : ''); }
function cmwSmooth(pts, close) { // Catmull-Rom through the coast points, so coasts read as hand-drawn rather than polygonal
    const P = pts.map(function (q) { return cmwP(q[0], q[1]); }), n = P.length; let d = 'M' + P[0][0].toFixed(1) + ',' + P[0][1].toFixed(1);
    for (let i = 0; i < n - (close ? 0 : 1); i++) { const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
        const a = close || i > 0 ? p0 : p1, b = close || i < n - 2 ? p3 : p2;
        d += ' C' + (p1[0] + (p2[0] - a[0]) / 6).toFixed(1) + ',' + (p1[1] + (p2[1] - a[1]) / 6).toFixed(1) + ' ' + (p2[0] - (b[0] - p1[0]) / 6).toFixed(1) + ',' + (p2[1] - (b[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1); }
    return d + (close ? ' Z' : ''); }

const CMW_LAND = {
    continent: [[-1.3, 43.6], [-1.25, 44.5], [-1.15, 45.0], [-1.25, 45.6], [-1.15, 46.1], [-1.8, 46.5], [-2.1, 46.9], [-2.2, 47.25], [-2.55, 47.3], [-3.0, 47.5], [-3.4, 47.7], [-4.2, 47.8], [-4.4, 47.97], [-4.7, 48.1], [-4.35, 48.28], [-4.78, 48.38], [-4.6, 48.62], [-3.6, 48.78], [-3.0, 48.8], [-2.5, 48.6], [-2.0, 48.66], [-1.55, 48.66], [-1.6, 49.2], [-1.9, 49.7], [-1.6, 49.66], [-1.25, 49.7], [-1.25, 49.42], [-1.1, 49.36], [-0.6, 49.35], [-0.2, 49.3], [0.1, 49.47], [0.6, 49.82], [1.4, 50.1], [1.6, 50.4], [1.65, 50.9], [2.5, 51.08], [3.2, 51.35], [3.6, 51.45], [4.0, 51.9], [4.5, 52.35], [4.7, 52.9], [5.0, 53.3], [6.0, 53.45], [7.0, 53.62], [8.0, 53.6], [8.6, 53.88], [8.9, 54.12], [8.6, 54.42], [8.85, 54.9], [8.6, 55.5], [8.12, 55.6], [8.2, 56.0], [8.12, 56.9],
        [10.9, 56.9], [10.9, 56.45], [10.25, 56.05], [9.95, 55.7], [9.7, 55.3], [9.6, 55.0], [9.9, 54.8], [10.0, 54.47], [10.8, 54.3], [11.0, 54.0], [11.5, 54.0], [12.1, 54.2], [12.5, 54.47], [13.0, 54.4], [13.4, 54.2], [13.72, 54.17], [13.95, 53.98], [14.25, 53.92], [14.6, 53.97], [15.5, 54.2], [16.5, 54.56], [17.5, 54.8], [18.4, 54.8], [18.65, 54.42], [19.0, 54.35], [19.6, 54.46], [20.6, 54.7], [20.6, 43.6]],
    britain: [[-6.0, 56.9], [-5.6, 56.0], [-5.65, 55.4], [-4.9, 55.0], [-5.1, 54.8], [-4.4, 54.7], [-3.6, 54.9], [-3.2, 54.95], [-3.5, 54.5], [-3.2, 54.1], [-2.9, 53.8], [-3.05, 53.42], [-3.3, 53.35], [-4.0, 53.3], [-4.6, 53.3], [-4.7, 52.8], [-4.1, 52.6], [-4.1, 52.3], [-4.6, 52.1], [-5.3, 51.85], [-5.0, 51.62], [-4.2, 51.55], [-3.3, 51.42], [-2.7, 51.55], [-3.0, 51.22], [-4.2, 51.2], [-4.5, 51.0], [-5.0, 50.6], [-5.7, 50.06], [-5.1, 50.0], [-4.2, 50.35], [-3.5, 50.32], [-3.3, 50.62], [-2.4, 50.6], [-1.6, 50.72], [-0.8, 50.76], [0.3, 50.75], [0.95, 50.92], [1.4, 51.15], [1.42, 51.38], [0.8, 51.5], [0.95, 51.8], [1.3, 51.95], [1.75, 52.5], [1.6, 52.92], [0.4, 52.92], [0.3, 53.1], [0.1, 53.55], [-0.2, 53.65], [-0.1, 54.1], [-0.5, 54.5], [-1.2, 54.66], [-1.5, 55.1], [-1.6, 55.6], [-2.0, 55.8], [-2.6, 56.0], [-3.2, 56.05], [-2.6, 56.3], [-2.4, 56.9]],
    ireland: [[-8.8, 55.4], [-7.3, 55.32], [-6.2, 55.2], [-5.5, 54.62], [-5.6, 54.2], [-6.1, 53.9], [-6.1, 53.3], [-6.0, 52.95], [-6.35, 52.2], [-6.95, 52.15], [-8.0, 51.8], [-8.8, 51.6]],
    sweden: [[12.4, 56.9], [12.85, 56.2], [12.6, 56.0], [12.95, 55.55], [12.9, 55.36], [13.4, 55.34], [14.2, 55.4], [14.36, 55.6], [14.2, 56.0], [14.7, 56.16], [15.6, 56.2], [16.4, 56.6], [16.5, 56.9]],
    zealand: [[11.2, 55.2], [11.8, 55.02], [12.3, 55.1], [12.62, 55.6], [12.55, 56.05], [12.1, 56.12], [11.7, 55.95], [11.3, 55.75], [10.95, 55.7], [11.1, 55.4]],
    funen: [[9.8, 55.5], [10.4, 55.62], [10.8, 55.3], [10.6, 55.05], [10.0, 55.1], [9.7, 55.3]],
    lolland: [[11.0, 54.86], [11.9, 54.92], [12.05, 54.68], [11.3, 54.64]],
    rugen: [[13.1, 54.62], [13.4, 54.7], [13.68, 54.58], [13.62, 54.32], [13.2, 54.26], [13.08, 54.42]],
    usedom: [[13.75, 54.16], [13.9, 54.1], [14.25, 53.92], [14.0, 53.86], [13.8, 53.95]],
    wight: [[-1.55, 50.7], [-1.1, 50.73], [-1.15, 50.6], [-1.45, 50.62]]
};
const CMW_RIVERS = [
    [[0.2, 49.45], [1.0, 49.3], [1.6, 49.05], [2.35, 48.86], [3.0, 48.5], [4.0, 48.2]], // Seine
    [[4.2, 51.9], [5.5, 51.9], [6.1, 51.85], [6.6, 51.5], [6.9, 51.0], [7.3, 50.6], [7.6, 50.35], [8.3, 50.0], [8.4, 49.5], [7.8, 48.6], [7.6, 47.6]], // Rhine
    [[8.9, 53.85], [9.8, 53.55], [10.8, 53.2], [11.6, 52.9], [12.1, 52.2], [11.9, 51.9], [12.5, 51.6], [13.2, 51.2], [13.75, 51.05], [14.3, 50.8]], // Elbe
    [[14.3, 53.85], [14.5, 53.3], [14.6, 52.6], [14.7, 52.1], [15.3, 51.6], [16.0, 51.2], [17.0, 51.1], [18.0, 50.2]], // Oder
    [[12.4, 51.65], [12.6, 51.3], [12.8, 51.13], [12.95, 50.85]], // Mulde (past Colditz)
    [[-3.6, 47.75], [-3.3, 47.95], [-2.8, 48.1]], // Blavet (Lorient)
    [[-2.2, 47.25], [-1.55, 47.2], [-0.5, 47.4], [0.7, 47.4], [1.9, 47.9], [2.9, 47.6], [3.0, 46.8]] // Loire
];
const CMW_CITIES = [['London', -0.13, 51.5, 1], ['Paris', 2.35, 48.86, 1], ['Berlin', 13.4, 52.52, 1], ['Hamburg', 10.0, 53.55, 0], ['Brussels', 4.35, 50.85, 0], ['Amsterdam', 4.9, 52.37, 0], ['Leipzig', 12.37, 51.34, 0], ['Dresden', 13.74, 51.05, 0], ['Stettin', 14.55, 53.43, 0], ['Copenhagen', 12.57, 55.68, 0], ['Brest', -4.49, 48.39, 0], ['Portsmouth', -1.09, 50.8, 0], ['Rostock', 12.1, 54.09, 0], ['Danzig', 18.65, 54.35, 0], ['Cologne', 6.95, 50.94, 0], ['Rennes', -1.68, 48.11, 0], ['Le Havre', 0.11, 49.49, 0], ['Kiel', 10.13, 54.32, 0]];

function cmwNode(m, x, y, right, sc) { // one mission marker + its tag, same look as the Normandy nodes
    const unl = cmapUnlocked(m.n), done = cmapDone(m.n), front = unl && !done, sel = CMAP.sel === m.n, st = cmapStars(m.n);
    const fill = done ? '#5f7a3a' : (unl ? '#b03a2a' : '#8a8466'), cls = done ? 'done' : (unl ? 'open' : 'lock');
    let o = '<g class="cmNode ' + cls + (sel ? ' sel' : '') + '" data-m="' + m.n + '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + sc + ')" tabindex="0" role="button" aria-label="Mission ' + m.n + ': ' + m.name + (unl ? '' : ' (locked)') + '">';
    if (front) o += '<circle class="cmPulse" r="22" fill="none" stroke="#b03a2a" stroke-width="3"/>';
    if (sel) o += '<circle class="cmSel" r="31" fill="none" stroke="#24251d" stroke-width="2.6" stroke-dasharray="7 6"/>';
    o += '<g class="ring"><circle r="23" fill="rgba(0,0,0,.35)" cx="3" cy="4"/><circle r="22" fill="' + fill + '" stroke="#24251d" stroke-width="3.5"/><circle r="17" fill="none" stroke="' + (unl ? '#f2e4b0' : '#5b574a') + '" stroke-width="1.6"/>';
    if (done) o += '<path d="M-9,1 L-3,8 L10,-8" fill="none" stroke="#f6edc8" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>';
    else if (unl) o += '<text y="8" text-anchor="middle" font-family="Impact,sans-serif" font-size="22" fill="#f6edc8">' + m.n + '</text>';
    else o += '<rect x="-7" y="-2" width="14" height="11" rx="2" fill="#3a3a2c"/><path d="M-4.5,-2 V-6 a4.5,4.5 0 0 1 9,0 V-2" fill="none" stroke="#3a3a2c" stroke-width="2.4"/>';
    o += '</g>';
    const tx = right ? 34 : -34, anc = right ? 'start' : 'end', tw = 196, hh = done ? 62 : 52;
    o += '<g transform="translate(' + tx + ' -26)"><rect x="' + (right ? 0 : -tw) + '" y="0" width="' + tw + '" height="' + hh + '" fill="rgba(238,230,200,.94)" stroke="#24251d" stroke-width="2"/>' +
        '<text x="' + (right ? 8 : -8) + '" y="16" text-anchor="' + anc + '" font-family="Impact,sans-serif" font-size="13.5" letter-spacing="1" fill="' + (unl ? '#24251d' : '#6a6650') + '">' + String(m.n).padStart(2, '0') + ' · ' + m.name + '</text>' +
        '<text x="' + (right ? 8 : -8) + '" y="31" text-anchor="' + anc + '" font-family="monospace" font-size="10" fill="#4a4a3a">' + m.date.split(' · ')[0] + '</text>' +
        '<text x="' + (right ? 8 : -8) + '" y="44" text-anchor="' + anc + '" font-family="monospace" font-weight="700" font-size="9.5" fill="#7a2a1f">' + m.place + '</text>';
    if (done) o += '<text x="' + (right ? 8 : -8) + '" y="57" text-anchor="' + anc + '" font-size="13" fill="#b08d3c">' + [0, 1, 2].map(function (i) { return i < st ? '★' : '☆'; }).join('') + '</text>';
    return o + '</g></g>';
}
function cmwCurve(a, b, bend) { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1]; return 'M' + a[0].toFixed(0) + ',' + a[1].toFixed(0) + ' Q' + (mx - dy * bend).toFixed(0) + ',' + (my + dx * bend).toFixed(0) + ' ' + b[0].toFixed(0) + ',' + b[1].toFixed(0); }
function cmwArrowHead(a, b, col, s) { const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), l = s || 14; return '<path d="M' + (b[0] - Math.cos(ang - .45) * l).toFixed(1) + ',' + (b[1] - Math.sin(ang - .45) * l).toFixed(1) + ' L' + b[0].toFixed(1) + ',' + b[1].toFixed(1) + ' L' + (b[0] - Math.cos(ang + .45) * l).toFixed(1) + ',' + (b[1] - Math.sin(ang + .45) * l).toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'; }

function cmapWorldSVG() {
    const W = CMW.W, H = CMW.H, I = CMW.inset; let o = '';
    o += '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Campaign map of north-west Europe, 1944">';
    o += '<defs><linearGradient id="cmSea" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6c8b93"/><stop offset=".6" stop-color="#86a8aa"/><stop offset="1" stop-color="#9dbdb5"/></linearGradient>' +
        '<linearGradient id="cmLand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9cb95"/><stop offset=".5" stop-color="#cdbe86"/><stop offset="1" stop-color="#c2b17a"/></linearGradient>' +
        '<linearGradient id="cmReich" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(150,60,40,.16)"/><stop offset="1" stop-color="rgba(150,60,40,.08)"/></linearGradient>' +
        '<radialGradient id="cmVig" cx=".5" cy=".5" r=".75"><stop offset=".62" stop-color="rgba(60,40,10,0)"/><stop offset="1" stop-color="rgba(60,40,10,.45)"/></radialGradient>' +
        '<pattern id="cmHatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="rgba(110,90,40,.2)" stroke-width="1.3"/></pattern>' +
        '<pattern id="cmRedHatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)"><line x1="0" y1="0" x2="0" y2="9" stroke="rgba(150,50,30,.16)" stroke-width="2"/></pattern>' +
        '<filter id="cmPaper"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="9"/><feColorMatrix values="0 0 0 0 .32  0 0 0 0 .24  0 0 0 0 .1  0 0 0 .16 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>' +
        '<clipPath id="cmInsetClip"><rect x="' + I.x + '" y="' + I.y + '" width="' + I.w + '" height="' + I.h + '"/></clipPath></defs>';
    // the sea
    o += '<rect width="' + W + '" height="' + H + '" fill="url(#cmSea)"/>';
    for (let i = 0; i < 120; i++) { const x = cmapR(i + 300) * W, y = cmapR(i + 400) * H, w = 14 + cmapR(i + 9) * 20; o += '<path class="cmWave" style="animation-delay:' + (-cmapR(i + 3) * 6).toFixed(2) + 's" d="M' + x.toFixed(0) + ',' + y.toFixed(0) + ' q' + (w / 4).toFixed(0) + ',-4 ' + (w / 2).toFixed(0) + ',0 t' + (w / 2).toFixed(0) + ',0" fill="none" stroke="rgba(255,255,255,.26)" stroke-width="1.3"/>'; }
    // land: a beach-sand halo, then the land, then the inked coastline
    const L = CMW_LAND, keys = Object.keys(L), open = { continent: 1, britain: 1, ireland: 1, sweden: 1 };
    const dOf = function (k) { return cmwSmooth(L[k], true); };
    keys.forEach(function (k) { o += '<path d="' + dOf(k) + '" fill="#e8d9a0" stroke="#e8d9a0" stroke-width="12" stroke-linejoin="round" opacity=".85"/>'; });
    keys.forEach(function (k) { o += '<path d="' + dOf(k) + '" fill="url(#cmLand)"/>'; });
    // the Reich and occupied Europe, washed red; neutral Sweden left plain
    const reich = [[-1.3, 43.6], [-1.25, 45.6], [-1.15, 46.1], [-2.2, 47.25], [-4.7, 48.1], [-4.6, 48.62], [-1.55, 48.66], [-1.9, 49.7], [-1.25, 49.7], [-1.1, 49.36], [-1.6, 49.0], [-0.9, 48.75], [0.2, 48.9], [0.5, 49.5], [0.6, 49.82], [1.4, 50.1], [1.65, 50.9], [3.6, 51.45], [4.7, 52.9], [8.0, 53.6], [8.6, 55.5], [8.12, 56.9], [10.9, 56.9], [9.6, 55.0], [12.1, 54.2], [14.6, 53.97], [20.6, 54.7], [20.6, 43.6]];
    o += '<clipPath id="cmContClip"><path d="' + dOf('continent') + '"/></clipPath><g clip-path="url(#cmContClip)"><path d="' + cmwSmooth(reich, true) + '" fill="url(#cmReich)"/><path d="' + cmwSmooth(reich, true) + '" fill="url(#cmRedHatch)"/></g>';
    ['zealand', 'funen', 'lolland', 'rugen', 'usedom'].forEach(function (k) { o += '<path d="' + dOf(k) + '" fill="url(#cmReich)"/>'; });
    // the Allied lodgement in Normandy, green
    const lodge = [[-1.9, 49.7], [-1.6, 49.2], [-1.6, 48.9], [-1.0, 48.95], [-0.4, 49.05], [-0.15, 49.18], [-0.2, 49.3], [-0.6, 49.35], [-1.1, 49.36], [-1.25, 49.7]];
    o += '<path d="' + cmwSmooth(lodge, true) + '" fill="rgba(70,120,50,.45)" stroke="#3f6a2a" stroke-width="2" stroke-dasharray="5 3"/>';
    keys.forEach(function (k) { o += '<path d="' + dOf(k) + '" fill="url(#cmHatch)" opacity=".6"/><path d="' + dOf(k) + '" fill="none" stroke="#6d5b30" stroke-width="2" stroke-linejoin="round"/>'; });
    // the 1937 frontier of Germany, dashed
    const front = [[6.9, 53.35], [7.0, 52.3], [6.0, 51.85], [6.1, 51.2], [6.0, 50.75], [6.4, 50.3], [6.4, 49.5], [8.2, 48.98], [7.6, 47.6], [9.6, 47.55], [13.0, 47.5], [13.0, 48.3], [13.8, 48.75], [12.4, 49.8], [12.3, 50.3], [14.3, 50.9], [15.0, 51.0], [15.1, 51.8], [15.7, 52.6], [16.6, 53.1], [16.8, 53.8], [17.5, 54.8]];
    o += '<path d="' + cmwSmooth(front, false) + '" fill="none" stroke="rgba(90,40,30,.55)" stroke-width="2.4" stroke-dasharray="10 4 2 4"/>';
    // rivers
    CMW_RIVERS.forEach(function (r) { const d = cmwSmooth(r, false); o += '<path d="' + d + '" fill="none" stroke="#5c7c80" stroke-width="4.5" stroke-linecap="round" opacity=".8"/><path d="' + d + '" fill="none" stroke="#9cbcb8" stroke-width="2.4" stroke-linecap="round"/>'; });
    // forests and hills, sparse at this scale
    [[10.5, 50.7, 40], [8.2, 48.3, 50], [13.4, 50.7, 30], [10.8, 51.9, 22], [-2.2, 48.25, 30], [6.0, 50.2, 30], [13.4, 53.5, 18], [12.0, 53.0, 20], [-1.2, 50.95, 14]].forEach(function (f, fi) { const c = cmwP(f[0], f[1]); for (let k = 0; k < 12; k++) { const a = cmapR(fi * 40 + k) * 6.28, r = cmapR(fi * 40 + k + 7) * f[2]; o += '<circle cx="' + (c[0] + Math.cos(a) * r * 1.4).toFixed(0) + '" cy="' + (c[1] + Math.sin(a) * r).toFixed(0) + '" r="' + (5 + cmapR(k + fi * 3) * 4).toFixed(0) + '" fill="#6a8540" stroke="#46602c" stroke-width="1" opacity=".75"/>'; } });
    // graticule
    for (let lon = -6; lon <= 20; lon += 2) { const p = cmwP(lon, 0); o += '<line x1="' + p[0] + '" y1="0" x2="' + p[0] + '" y2="' + H + '" stroke="rgba(60,45,15,.11)"/>'; }
    for (let lat = 45; lat <= 56; lat += 1) { const p = cmwP(0, lat); o += '<line x1="0" y1="' + p[1] + '" x2="' + W + '" y2="' + p[1] + '" stroke="rgba(60,45,15,.11)"/>'; }
    o += '<g font-family="monospace" font-size="10" fill="rgba(50,35,10,.55)">'; for (let lon = -6; lon <= 18; lon += 4) { const p = cmwP(lon, 0); o += '<text x="' + (p[0] + 3) + '" y="14">' + Math.abs(lon) + '°' + (lon < 0 ? 'W' : 'E') + '</text>'; } for (let lat = 46; lat <= 56; lat += 2) { const p = cmwP(0, lat); o += '<text x="4" y="' + (p[1] - 3) + '">' + lat + '°N</text>'; } o += '</g>';
    // sea + country names
    o += '<g font-family="Georgia, serif" font-style="italic" text-anchor="middle">' +
        '<text x="' + cmwP(4.2, 55.4)[0] + '" y="' + cmwP(4.2, 55.4)[1] + '" font-size="26" letter-spacing="12" fill="rgba(235,245,240,.7)">NORTH  SEA</text>' +
        '<text x="' + cmwP(-2.6, 50.2)[0] + '" y="' + cmwP(-2.6, 50.2)[1] + '" font-size="15" letter-spacing="6" fill="rgba(235,245,240,.8)" transform="rotate(-8 ' + cmwP(-2.6, 50.2)[0] + ' ' + cmwP(-2.6, 50.2)[1] + ')">ENGLISH CHANNEL</text>' +
        '<text x="' + cmwP(16.6, 55.3)[0] + '" y="' + cmwP(16.6, 55.3)[1] + '" font-size="22" letter-spacing="9" fill="rgba(235,245,240,.75)">BALTIC SEA</text>' +
        '<text x="' + cmwP(16.6, 55.0)[0] + '" y="' + (cmwP(16.6, 55.0)[1] + 8) + '" font-size="12" letter-spacing="5" fill="rgba(235,245,240,.6)">OSTSEE</text>' +
        '<text x="' + cmwP(-5.2, 46.0)[0] + '" y="' + cmwP(-5.2, 46.0)[1] + '" font-size="18" letter-spacing="7" fill="rgba(235,245,240,.7)">BAY OF BISCAY</text>' +
        '<text x="' + cmwP(-6.6, 49.0)[0] + '" y="' + cmwP(-6.6, 49.0)[1] + '" font-size="14" letter-spacing="5" fill="rgba(235,245,240,.6)" transform="rotate(-90 ' + cmwP(-6.6, 49.0)[0] + ' ' + cmwP(-6.6, 49.0)[1] + ')">ATLANTIC</text>' +
        '</g><g font-family="Georgia, serif" font-style="italic" text-anchor="middle" fill="rgba(40,30,12,.6)">' +
        '<text x="' + cmwP(-1.6, 52.4)[0] + '" y="' + cmwP(-1.6, 52.4)[1] + '" font-size="22" letter-spacing="10">ENGLAND</text>' +
        '<text x="' + cmwP(2.4, 47.4)[0] + '" y="' + cmwP(2.4, 47.4)[1] + '" font-size="26" letter-spacing="16">FRANCE</text>' +
        '<text x="' + cmwP(10.4, 52.6)[0] + '" y="' + cmwP(10.4, 52.6)[1] + '" font-size="26" letter-spacing="14" fill="rgba(90,30,20,.55)">GERMANY</text>' +
        '<text x="' + cmwP(10.4, 52.6)[0] + '" y="' + (cmwP(10.4, 52.6)[1] + 18) + '" font-size="11" letter-spacing="6" fill="rgba(90,30,20,.5)">DEUTSCHES REICH</text>' +
        '<text x="' + cmwP(9.2, 56.2)[0] + '" y="' + cmwP(9.2, 56.2)[1] + '" font-size="13" letter-spacing="5">DENMARK</text>' +
        '<text x="' + cmwP(14.6, 56.35)[0] + '" y="' + cmwP(14.6, 56.35)[1] + '" font-size="13" letter-spacing="5">SWEDEN</text>' +
        '<text x="' + cmwP(14.6, 56.35)[0] + '" y="' + (cmwP(14.6, 56.35)[1] + 13) + '" font-size="9" letter-spacing="3">neutral</text>' +
        '<text x="' + cmwP(5.7, 52.6)[0] + '" y="' + cmwP(5.7, 52.6)[1] + '" font-size="11" letter-spacing="3">HOLLAND</text>' +
        '<text x="' + cmwP(4.6, 50.45)[0] + '" y="' + cmwP(4.6, 50.45)[1] + '" font-size="11" letter-spacing="3">BELGIUM</text>' +
        '<text x="' + cmwP(18.0, 52.4)[0] + '" y="' + cmwP(18.0, 52.4)[1] + '" font-size="18" letter-spacing="9">POLAND</text>' +
        '<text x="' + cmwP(-3.2, 48.2)[0] + '" y="' + cmwP(-3.2, 48.2)[1] + '" font-size="11" letter-spacing="3">BRITTANY</text>' +
        '<text x="' + cmwP(12.6, 51.55)[0] + '" y="' + cmwP(12.6, 51.55)[1] + '" font-size="10" letter-spacing="2">SAXONY</text>' +
        '<text x="' + cmwP(14.5, 54.4)[0] + '" y="' + cmwP(14.5, 54.4)[1] + '" font-size="10" letter-spacing="2">USEDOM</text>' +
        '</g>';
    // cities
    CMW_CITIES.forEach(function (c) { const p = cmwP(c[1], c[2]); o += c[3] ? '<g transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')"><rect x="-5" y="-5" width="10" height="10" fill="#7a3d2b" stroke="#2a140c" stroke-width="1.5"/><rect x="-2" y="-2" width="4" height="4" fill="#e8d9a0"/><text x="9" y="4" font-family="Georgia,serif" font-weight="700" font-size="13" fill="#3a2a14">' + c[0] + '</text></g>' : '<g transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')"><circle r="3.4" fill="#7a3d2b" stroke="#2a140c" stroke-width="1"/><text x="6" y="4" font-family="Georgia,serif" font-size="10.5" fill="rgba(58,42,20,.85)">' + c[0] + '</text></g>'; });
    // Peenemünde site + Colditz castle + Lorient pens, small map symbols under the markers
    const pe = cmwP(13.78, 54.14), co = cmwP(12.79, 51.13), lo = cmwP(-3.37, 47.73);
    o += '<g transform="translate(' + pe[0] + ' ' + pe[1] + ')"><path d="M0,-20 L4,-8 L4,6 L8,12 L-8,12 L-4,6 L-4,-8 Z" fill="#2a2a24" opacity=".0"/></g>';
    // the war in the air and at sea: Allied moves for the later missions
    const eng = cmwP(-0.4, 53.2), hydraT = cmwP(13.6, 54.1), den = cmwP(9.0, 56.3);
    o += '<path d="M' + eng[0] + ',' + eng[1] + ' Q' + den[0] + ',' + (den[1] - 60) + ' ' + (hydraT[0] - 30) + ',' + (hydraT[1] - 22) + '" fill="none" stroke="rgba(47,90,138,.65)" stroke-width="6" stroke-dasharray="2 10" stroke-linecap="round"/>' + cmwArrowHead([den[0] + 200, den[1] - 20], [hydraT[0] - 30, hydraT[1] - 22], 'rgba(47,90,138,.85)', 16);
    o += '<text x="' + (den[0] - 230) + '" y="' + (den[1] - 52) + '" font-family="monospace" font-weight="700" font-size="11" letter-spacing="1" fill="rgba(30,60,100,.85)">RAF BOMBER COMMAND · OPERATION HYDRA ▸</text>';
    for (let i = 0; i < 5; i++) { const k = .25 + i * .14, x = (1 - k) * (1 - k) * eng[0] + 2 * (1 - k) * k * den[0] + k * k * (hydraT[0] - 30), y = (1 - k) * (1 - k) * eng[1] + 2 * (1 - k) * k * (den[1] - 60) + k * k * (hydraT[1] - 22); o += '<g transform="translate(' + x.toFixed(0) + ' ' + y.toFixed(0) + ') rotate(' + (i * 4 - 2) + ')" fill="#2f4a6a" opacity=".8"><path d="M-9,0 L9,0 M0,-8 L0,8" stroke="#2f4a6a" stroke-width="3"/><path d="M-2,-12 L2,-12 L2,10 L-2,10 Z"/></g>'; }
    // commando route: HMS Tormentor (the Hamble) across the North Sea and through the Belts to Usedom
    const cmdo = [[-1.3, 50.72], [0.5, 50.55], [1.75, 51.05], [2.9, 52.1], [4.2, 54.0], [6.4, 55.9], [8.4, 57.6], [10.6, 57.6], [11.3, 56.6], [10.95, 55.7], [11.05, 55.0], [11.7, 54.55], [12.9, 54.62], [13.72, 54.24]];
    o += '<path d="' + cmwSmooth(cmdo, false) + '" fill="none" stroke="rgba(30,40,60,.6)" stroke-width="2.4" stroke-dasharray="7 5"/>';
    o += '<text x="' + cmwP(3.3, 53.6)[0] + '" y="' + cmwP(3.3, 53.6)[1] + '" font-family="monospace" font-size="10" fill="rgba(30,40,60,.75)" transform="rotate(-58 ' + cmwP(3.3, 53.6).join(' ') + ')">No. 62 COMMANDO · MTB 718</text>';
    // Lorient: the MGB from Plymouth
    const ply = cmwP(-4.14, 50.37);
    o += '<path d="M' + ply[0] + ',' + ply[1] + ' Q' + cmwP(-6.4, 48.9).join(',') + ' ' + (lo[0] - 14) + ',' + (lo[1] + 10) + '" fill="none" stroke="rgba(30,40,60,.6)" stroke-width="2.4" stroke-dasharray="7 5"/>';
    o += '<text x="' + (cmwP(-6.6, 49.1)[0]) + '" y="' + cmwP(-6.6, 49.1)[1] + '" font-family="monospace" font-size="10" fill="rgba(30,40,60,.75)">MGB 314</text>';
    const nb = CMW.nbox;
    // campaign road between the theatre missions (painted path like the Normandy road)
    const nbc = cmwP(nb[0], nb[1]), seq = [[nbc[0] + 10, nbc[1] + 40], cmwP.apply(null, CMW.real[10]), cmwP.apply(null, CMW.real[11]), cmwP.apply(null, CMW.real[12]), cmwP.apply(null, CMW.future)];
    let road = ''; for (let i = 1; i < seq.length; i++) road += cmwCurve(seq[i - 1], seq[i], i % 2 ? .14 : -.14) + ' ';
    o += '<path d="' + road + '" fill="none" stroke="rgba(60,40,15,.5)" stroke-width="7" stroke-linecap="round"/><path d="' + road + '" fill="none" stroke="#e8dcae" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="10 8"/>';
    // the Normandy box and its zoom lines to the inset
    const b0 = cmwP(nb[0], nb[3]), b1 = cmwP(nb[2], nb[1]);
    o += '<path d="M' + b1[0] + ',' + b0[1] + ' L' + I.x + ',' + I.y + ' M' + b1[0] + ',' + b1[1] + ' L' + I.x + ',' + (I.y + I.h) + '" stroke="rgba(36,37,29,.55)" stroke-width="2" stroke-dasharray="6 5" fill="none"/>';
    o += '<rect x="' + b0[0] + '" y="' + b0[1] + '" width="' + (b1[0] - b0[0]) + '" height="' + (b1[1] - b0[1]) + '" fill="rgba(176,58,42,.12)" stroke="#9b2a1f" stroke-width="3"/>';
    const nDone = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(cmapDone).length;
    o += '<g class="cmNorm" style="cursor:pointer" data-m="' + cmapFrontierIn(9) + '"><rect x="' + (b0[0] - 6) + '" y="' + (b1[1] + 6) + '" width="' + (b1[0] - b0[0] + 12) + '" height="34" fill="rgba(238,230,200,.95)" stroke="#24251d" stroke-width="2"/><text x="' + ((b0[0] + b1[0]) / 2) + '" y="' + (b1[1] + 21) + '" text-anchor="middle" font-family="Impact,sans-serif" font-size="13" letter-spacing="1.5" fill="#24251d">NORMANDY · 1–9</text><text x="' + ((b0[0] + b1[0]) / 2) + '" y="' + (b1[1] + 34) + '" text-anchor="middle" font-family="monospace" font-size="9.5" fill="#4a4a3a">' + nDone + ' / 9 COMPLETE ▸ DETAIL</text></g>';
    // mission markers at their real places
    o += cmwNode(cmapM(10), lo[0], lo[1], true, 1);
    o += cmwNode(cmapM(11), co[0], co[1], true, 1);
    o += cmwNode(cmapM(12), pe[0], pe[1], false, 1);
    const fu = cmwP.apply(null, CMW.future); o += '<g transform="translate(' + fu[0] + ' ' + fu[1] + ')" opacity=".8"><circle r="17" fill="#8a8466" stroke="#4a4a3a" stroke-width="3" stroke-dasharray="4 3"/><text y="7" text-anchor="middle" font-family="Impact,sans-serif" font-size="20" fill="#3a3a2c">?</text><text y="34" text-anchor="middle" font-family="monospace" font-weight="700" font-size="10" fill="#4a4a3a">NEXT ORDERS</text></g>';
    // title stamp, compass, scale
    o += '<g transform="translate(14 26) rotate(-3)"><rect width="272" height="66" fill="rgba(235,225,185,.92)" stroke="#9b2a1f" stroke-width="3"/><text x="136" y="24" text-anchor="middle" font-family="Impact,sans-serif" font-size="17" letter-spacing="2" fill="#9b2a1f">NORTH-WEST EUROPE · 1944</text><text x="136" y="42" text-anchor="middle" font-family="monospace" font-size="11" letter-spacing="2" fill="#4a3a1a">THEATRE OF OPERATIONS</text><text x="136" y="57" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="1" fill="#4a3a1a">MOST SECRET · BIGOT</text></g>';
    o += '<g transform="translate(' + cmwP(-6.9, 44.9).join(' ') + ')"><circle r="38" fill="rgba(235,225,185,.75)" stroke="#4a3a1a" stroke-width="2"/><path d="M0,-33 L6,0 L0,33 L-6,0 Z" fill="#4a3a1a"/><path d="M-33,0 L0,-6 L33,0 L0,6 Z" fill="rgba(74,58,26,.55)"/><path d="M0,-33 L6,0 L-6,0 Z" fill="#9b2a1f"/><text y="-42" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="14" fill="#4a3a1a">N</text></g>';
    const sx = cmwP(-4.6, 44.4); o += '<g transform="translate(' + sx[0] + ' ' + sx[1] + ')" font-family="monospace" font-size="10" fill="#4a3a1a"><rect width="138" height="6" fill="#4a3a1a"/><rect x="34" width="35" height="6" fill="#d8c99a"/><rect x="103" width="35" height="6" fill="#d8c99a"/><text y="-5">0</text><text x="62" y="-5">100</text><text x="118" y="-5">200 MI</text></g>';
    // legend
    o += '<g transform="translate(' + cmwP(-7.6, 46.55).join(' ') + ')" font-family="monospace" font-size="10" fill="#3a2a14"><rect width="200" height="78" fill="rgba(238,230,200,.85)" stroke="#24251d" stroke-width="1.5"/><rect x="10" y="10" width="18" height="11" fill="rgba(150,60,40,.25)" stroke="rgba(150,50,30,.5)"/><text x="36" y="20">Axis-held</text><rect x="10" y="28" width="18" height="11" fill="rgba(70,120,50,.45)" stroke="#3f6a2a" stroke-dasharray="3 2"/><text x="36" y="38">Allied lodgement</text><path d="M10,52 L28,52" stroke="rgba(90,40,30,.6)" stroke-width="2.4" stroke-dasharray="6 3 2 3"/><text x="36" y="56">German frontier 1937</text><path d="M10,68 L28,68" stroke="rgba(30,40,60,.6)" stroke-width="2.4" stroke-dasharray="5 4"/><text x="36" y="72">Sea route</text></g>';
    // paper grain + vignette
    o += '<rect width="' + W + '" height="' + H + '" filter="url(#cmPaper)" opacity=".7" pointer-events="none"/>';
    o += '<rect width="' + W + '" height="' + H + '" fill="url(#cmVig)" pointer-events="none"/>';
    // the Normandy detail inset: the old operational map, framed like a pinned sheet
    o += '<g><rect x="' + (I.x + 7) + '" y="' + (I.y + 8) + '" width="' + I.w + '" height="' + I.h + '" fill="rgba(0,0,0,.4)"/>';
    o += '<svg x="' + I.x + '" y="' + I.y + '" width="' + I.w + '" height="' + I.h + '" style="width:' + I.w + 'px;height:' + I.h + 'px" viewBox="0 22 1030 588" preserveAspectRatio="xMidYMid slice">' + cmapNormandyInner() + cmwActBanners() + '</svg>';
    o += '<rect x="' + I.x + '" y="' + I.y + '" width="' + I.w + '" height="' + I.h + '" fill="none" stroke="#24251d" stroke-width="5"/><rect x="' + (I.x + 5) + '" y="' + (I.y + 5) + '" width="' + (I.w - 10) + '" height="' + (I.h - 10) + '" fill="none" stroke="rgba(238,230,200,.6)" stroke-width="1.5"/>';
    o += '<g transform="translate(' + (I.x + I.w - 210) + ' ' + (I.y - 16) + ') rotate(2)"><rect width="200" height="30" fill="#9b2a1f" stroke="#24180e" stroke-width="2"/><text x="100" y="20" text-anchor="middle" font-family="Impact,sans-serif" font-size="14" letter-spacing="2" fill="#f6edc8">DETAIL · NORMANDY</text></g>';
    [[I.x + 14, I.y + 10], [I.x + I.w - 14, I.y + 10]].forEach(function (p) { o += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#b03a2a" stroke="#3a1a10" stroke-width="1.5"/><circle cx="' + (p[0] - 2) + '" cy="' + (p[1] - 2) + '" r="2" fill="rgba(255,220,200,.7)"/>'; });
    o += '</g>';
    const P3 = progression || {}; o += cmapRibbon(1290, 236, -3, 170, 'END OF ACT III', 'THE LONG NIGHT', P3.campaignM12Done ? ['#9b2a1f', '#6a1a12'] : ['#7a745e', '#55503e'], !!P3.campaignM12Done, 0);
    o += '</svg>';
    return o;
}
function cmwActBanners() {
    const P = progression || {}, red = ['#9b2a1f', '#6a1a12'], grey = ['#7a745e', '#55503e'];
    return cmapRibbon(560, 96, -3, 170, 'END OF ACT I', P.campaignM4Done ? 'THE BEACHHEAD ▸' : 'THE BEACHHEAD', P.campaignM4Done ? red : grey, !!P.campaignM4Done, P.campaignM4Done ? 1 : 0) +
        cmapRibbon(820, 104, 3, 170, 'END OF ACT II', P.campaignM8Done ? 'GUN IN THE HILLS ▸' : 'GUN IN THE HILLS', P.campaignM8Done ? red : grey, !!P.campaignM8Done, P.campaignM8Done ? 2 : 0);
}
function cmapFrontierIn(max) { for (let n = 1; n <= max; n++) if (cmapUnlocked(n) && !cmapDone(n)) return n; return 1; }
