# Tankers source pieces

`../tank-game.html` is the finished game. These `.js` files are the newer parts of it (3D menu, loading scenes, online duels, battle effects, executions and so on). They get stitched into the game's big script block.

## How to change the game
1. Edit the `.js` file you need, for example `tk3exe.js` for the execution cutscenes.
2. Run `python3 build2.py` from this folder. It rebuilds `../tank-game.html` in place.
3. Check the syntax by pulling out the `<script>` contents and running `node --check` on them.
4. Bump `DUEL_BUILD` in `duel.js` for each release, then commit `tank-game.html` and the changed `.js` files.

The order the files are joined in is set in `build2.py`. Running the build more than once is safe.

## Where things are
- `tk3core.js`: the shared 3D engine (renderer, post effects, particles, terrain, sky)
- `tk3exetanks.js`: detailed 3D models of all 16 tanks
- `tk3exeenv.js`: the four battle maps used in executions
- `tk3exe.js`: the execution cutscene engine and the 16 finishers
- `exehook.js`: in-battle F-to-execute trigger, title card, scope overlay
- `exetest.js`: the 1v1 execution test range
- `tk3menu*.js`, `tk3camp.js`, `tk3fob.js`: the 3D main menu and camp
- `tk3s1.js`–`tk3s7.js`, `tk3hook.js`: the 3D loading screens
- `tk3screens.js`, `tk3scrbg.js`: game-mode menu screens
- `fxbattle.js`: battle lighting and explosions
- `duel.js`, `duelload*.js`: online 1v1 / 2v2
- `tk3audio.js`: sound
- `sk3d.js`: 3D Skirmish (test). The normal 2D Skirmish keeps running the battle; this file draws it in 3D
  (third-person camera, tank driving controls, gunsight) using the execution tank models. Scale: 1 game pixel = 0.1 m.
  Menu button "3D SKIRMISH (TEST)"; plain Skirmish stays 2D.
  In 3D the battle runs at a fixed 60 steps a second (like 2D on a 60 Hz screen), whatever the 3D frame rate, so shells and
  tanks move at the same speed as 2D. The hidden 2D map isn't painted while 3D is on.
- `sk3look.js`: how 3D Skirmish looks: daylight per map, baked height map, ground colours (crop fields, roads),
  instanced trees, houses, church, streets. `sk3BuildWorld` is here.
- `sk3world.js`: 3D Skirmish gameplay changes: 4800 x 3000 battlefield with a generated layout per battle
  (`sk3GenTown/Snow/Bocage/Trenches`), 8 enemies v 6 allies + you, tank-like AI driving (`sk3AiPost`),
  real-life speeds (x0.55, slower hull turn and turret traverse), and a spatial grid for fast collision checks.
