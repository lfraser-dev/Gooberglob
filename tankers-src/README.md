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
  Since build 174 the menu's SKIRMISH button starts the 3D battle (`chooseGameMode("skirmish")` defaults to 3D when WebGL works, `sk3Can`); "CLASSIC SKIRMISH" and the setup-screen button play the 2D original.
  In 3D the battle runs at a fixed 60 steps a second (like 2D on a 60 Hz screen), whatever the 3D frame rate, so shells and
  tanks move at the same speed as 2D. The hidden 2D map isn't painted while 3D is on.
- `sk3look.js`: how 3D Skirmish looks: daylight per map, baked height map, ground colours (crop fields, roads),
  instanced trees, houses, church, streets. `sk3BuildWorld` is here.
- `sk3world.js`: 3D Skirmish gameplay changes: 4800 x 3000 battlefield with a generated layout per battle
  (`sk3GenTown/Snow/Bocage/Trenches`), 8 enemies v 6 allies + you, tank-like AI driving (`sk3AiPost`),
  real-life speeds (x0.55, slower hull turn and turret traverse), and a spatial grid for fast collision checks.
- `sk3fx.js`: 3D combat feel and sound. Visible tank damage (engine smoke/fire, thrown track, jammed turret/gun),
  ricochet sparks, hull holes, hit markers, red hit flash + direction. Destructible cover (`SK3_HP`): shells
  damage houses/huts/hedges/sandbags/ruins, leave holes, then `sk3Collapse` sinks the obstacle's slice of the
  merged geometry and leaves rubble (type becomes `sk3Rubble`, so it stops being solid). Online the host sends
  `ob` (collapse), `oh` (hole) and `th` (tank hit) messages. Positional WebAudio (HRTF, distance muffling,
  343 m/s delay) replaces the flat 2D sounds while 3D is on.
- 3D online battles: the host's "3D BATTLE" switch in the online lobby (DUEL.three) is sent in the `start` message
  with a map seed (DUEL.seed), so every player generates the same map (3200 x 2000 for 1v1, 3600 x 2250 for 2v2).
  No AI tanks and no AI driving filter online. When a finisher plays, the 3D battlefield is parked (`sk3Park`)
  and handed back afterwards (`sk3Unpark`) instead of being rebuilt.
- `sk3extra.js`: 3D extras (build 167).
  - Settings panel (`SK3C`, saved in localStorage `tankers_sk3cfg`; O key in 3D, or the button on the 3D setup screen /
    online lobby): master volume for the whole game (every WebAudio connection to the speakers is routed through one
    gain node), mouse sensitivity, invert Y, time of day and weather.
  - Co-axial machine gun (`SK3X`): hold Q. 10 rounds a second, tracers, overheats after ~5 s. Shreds hedges, sandbags
    and huts (`SK3_MGDMG`), only scratches tanks (can't take one below 1 health). Online: `mgf` messages (trigger on/off);
    the host's bullets do the damage.
  - Binoculars: B. Camera at the commander's hatch, look freely, wheel zooms, rangefinder; enemies you look at with a
    clear line of sight are spotted for 12 s (`sk3Spot`, red diamond with distance).
  - Time/weather: `sk3LookFor(kind)` adjusts the map's look for dusk, night (parachute flares light the field) and rain
    (wet ground, rain streaks, lightning and thunder; heavy snowfall on the snow map). `sk3TagRange` limits how far away
    enemy tags show at night or in rain unless spotted, lit by a flare or just fired. Online the host's choice is sent
    in the `start` message (`tod`, `wx`).
- `sk3perf.js`: graphics quality (build 168). `SK3C.gq` = auto / low / med / high (O settings panel) sets render
  resolution (`TK3.scale`, pixel cap `sk3QCap`), shadow map size (off on LOW), grass count (`st.tufts.count`) and
  rain density (`sk3QPart`), applied live. AUTO steps the resolution down/up to hold ~40–57 fps. "Show frame rate"
  draws an FPS box on the HUD.
- `sk3arty.js`: artillery. G opens the battle map (camera high over the whole field, fog thinned; W/A/S/D pan, wheel
  zoom; you see friendly units and enemies near them or spotted). Click calls 10 heavy shells (`SK3A`, radius 10.5 m, spread 16 m)
  that land after ~3.5 s, whistle in, damage every tank in the blast (friendly fire too), wreck cover and kill infantry.
  2 charges max, one back every 70 s. Online: `art` (guest → host) and `arts` (host → all, with a seed so everyone sees
  the same impacts); the host applies the damage.
- `sk3inf.js`: infantry (skirmish only, not online). `SK3I.men` / `SK3I.squads`: 3 squads of 5 riflemen per side
  advance on the nearest enemy, kneel and shoot (rifles kill infantry, only spark off tanks). Run-overs, shell blasts
  (`createExplosion` hook → `sk3InfBlast`), shells passing through, artillery and machine guns kill them; AI tanks
  fire their MGs (`sk3MgFireAt`) at nearby infantry. Wiped squads come back after 40 s. Drawn with instanced meshes
  per faction (`st.inf`).
- `sk3armor.js` (build 169): real armour and ammo in 3D. `SK3_ARM[name] = [front, side, rear, gun penetration]` in mm
  (sloped fronts as effective thickness; `SK3_ARM_CLASS` fallback). `sk3ArFace` picks the plate a shell strikes
  (weighted by how much of each plate faces the shooter) and the angle to it; effective armour = thickness / cos.
  Steep angles → ricochet; pen ≥ armour → PENETRATED (×1.1 front, ×1.25 side, ×1.6 rear); else NO PENETRATION (×0.12).
  Ammo keys 1/2/3: AP, HE (pen 30, always ×0.4 blast, splash 55 px, kills infantry in 9 m, smashes cover), SMOKE
  (4 per battle, lands as an `abilitySmokeClouds` screen for ~25 s). Switching reloads. Shells carry `ammo` and
  `sk3pen`. Online the guest sends `am`; the host's `calculateDamage` does the rest.
- Infantry visibility (build 169): soldiers drawn 1.22× larger, bigger muzzle flashes, blue/red chevrons over
  friendly soldiers and enemy soldiers you or your allies can see, dots on the minimap, and an escort squad
  (`sq.escort`) that spawns next to you and moves up just ahead of your tank.
- `dd3d.js` (build 170): the mission 1 intro (D-Day) is now a real 3D cutscene ('D-DAY 3D' scene in `TK3.list`, index
  `DD3.idx`). Shots: the fleet and battleship broadsides; inside a landing craft; on the sand as the ramp drops and the
  men run in under fire; a tank landing craft beaching and your campaign tank (`campaignFaction`/`campaignTankClass`)
  rolling off and firing at a bunker. Timed to the existing 2D cutscene (DD.dur, DD.cuts, captions, sounds, skip),
  which still draws all text: `ddgInit`/`ddglRender` are wrapped so the 3D frame (`dd3Render`, sized to the game
  canvas, adaptive resolution `DD3.q`) is what gets drawn. Falls back to the old picture if 3D can't start.
- `m13d.js` (build 171): campaign mission 1 (THE LANDING) plays in 3D when 3D is available (`M13D.want`). The 2D
  mission logic is untouched; the battlefield becomes 2400 x 1500 (positions are canvas fractions, so they scale;
  `createCampaignMap` is replaced so the hill barrier and bunkers are added in battlefield pixels, since
  `addObstacle` rescales campaign coordinates). `m13Build` (called from `sk3BuildWorld`) builds the beach: sea and
  surf, sand, shingle, bluffs where the 2D hill barrier is, a road up the central draw, plateau trenches, casemate
  bunkers (wrecks swap in when destroyed), pillboxes firing tracers, hedgehogs, wire, wrecked landing craft, burning
  Shermans, the fleet and landing craft bringing more men. Infantry: 3 American squads (respawn from the surf) and 3
  German squads holding the plateau (`sq.hold`, `sq.noRespawn`). HUD: bunker names + health, PUSH INLAND marker.
  `m13Stop` restores everything when leaving. Field repairs (R) work anywhere on the 3D beach (build 172). Camera near plane is now 0.5 (and much further out in the artillery
  map view) because the render target depth buffer is 16-bit.
- Build 173: the 3D camera follows the ground height (`h0` in `sk3Camera`), so it works on hills (the D-Day bluffs).
  Campaign globe (`cmapglobe.js`): every visible pin is laid out with a small overlap-removal pass (leader lines back
  to the real spot); Normandy's nine fan out on a ring when zoomed in (cluster pin below ×8, NORMANDY button flies
  to ×26, wheel zoom to ×40); bigger pins with bigger mission emblems, labels show the mission type (`m.tag`); the
  hover card sits in the corner so it never hides other pins.
- `m2c3d.js` (build 174): the mission 2 intro is a 3D cutscene ('M2 3D' scene): the Sherman column in a sunken
  lane, binocular view of the two 88s on the ridge with Panzers, bombers, flak bursts and a bomber going down, the
  gun crew firing, and your tank's hatch view with HQ's radio order and the PUSH INLAND stamp. `drawM2Cutscene` is
  wrapped; the overlay (titles, captions, binocular mask, radio, stamp) is redrawn by `m2c3Overlay`, sounds keep the
  same cues. Falls back to the 2D cutscene.
- `m23d.js` (build 175): campaign mission 2 (PUSH INLAND) plays in 3D. The 2D mission uses fixed 1100 x 700
  coordinates, so the 3D view is drawn at `SK3D.S` = 0.2 m per pixel (220 x 140 m) and tank speeds get an extra
  x0.7; `m23Stop` puts S back to 0.1. `m23Build`: farm fields and lane, the 2D hedges/copses/house/barn in 3D, the
  two 88s (`m2c3Flak`) with crews, tracking you, wrecks when destroyed. E (naval barrage) opens the battle map
  (`SK3A.m2sup`); the click calls the 2D `m2CallSupport` at that point. `sk3CampaignOn()` lets sk3Start run for
  campaign missions 1 and 2.
