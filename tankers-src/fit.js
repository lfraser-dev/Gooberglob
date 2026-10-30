/* =====================================================
   FIT THE BATTLEFIELD TO THE BROWSER TAB
   The game still renders at 1100×700 (2400×1500 for the big maps, seen through an 1100×700 window);
   the whole viewport is zoomed to fill the tab. Mouse maths reads the canvas's on-screen rect, so it stays exact.
===================================================== */
const FIT = { k: 1, last: '' };
function ddpFitScreen() {
    const vp = document.getElementById('canvasViewport'), ga = document.getElementById('gameArea'); if (!vp || !ga) return;
    const shown = ga.style.display !== 'none' && ga.offsetParent !== null;
    const W = window.innerWidth, H = window.innerHeight, key = W + 'x' + H + (shown ? 1 : 0);
    if (key === FIT.last) return; FIT.last = key;
    const top = shown ? vp.getBoundingClientRect().top + window.scrollY : 100;
    const k = Math.max(.5, Math.min((W - 36) / 1112, (H - Math.min(top, 200) - 14) / 712));
    FIT.k = k; vp.style.zoom = k.toFixed(4);
}
window.addEventListener('resize', function () { FIT.last = ''; ddpFitScreen(); });
setInterval(ddpFitScreen, 400);
