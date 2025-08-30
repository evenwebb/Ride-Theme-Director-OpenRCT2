Ride Theme Director (v0.2)

Give any ride a cohesive identity in seconds. Pick a theme, tick the parts you want, and Ride Theme Director will rename the ride, set matching music, recolour track/supports/trains, and (optionally) place tasteful scenery around the station and approaches. There’s also a light-touch entrance/exit “accent” pass that works even on builds where direct entrance styling isn’t exposed.

Highlights

Does nothing until you choose a ride — zero surprises.

Theme picker (Pirate Cove, Frontier Western, Retro Sci-Fi, Gothic Spooky).

Modular application — enable/disable each piece:

On-theme ride name

Colours (track, supports, train body/trim)

Music (matching track, if available in your build)

Entrance/Exit accents (feature-detected; safe fallback to place small scenery nearby)

Scenery around the ride (radius/density/limit controls)

Safe by design — feature-detects capabilities; falls back gracefully if your OpenRCT2 build lacks certain setters.

Optimised placement — avoids paths and steep slopes by default, with a hard cap to prevent clutter.

Installation

Download: ride-theme-director.js

Place in your OpenRCT2 plugin folder:

Windows: Documents\OpenRCT2\plugin

macOS: ~/Library/Application Support/OpenRCT2/plugin

Linux: ~/.config/OpenRCT2/plugin

Launch OpenRCT2 → open any park → Menu → Ride Theme Director.

Tip: The file ends with })();. If a text editor adds extra characters after that, delete them.

Quick Start

Open Ride Theme Director from the menu.

Step 1: Choose a ride from the dropdown.

Step 2: Pick a theme (Pirate, Western, Sci-Fi, Spooky).

Tick the parts you want to apply:

Rename ride

Recolour track/supports/trains

Set music

Theme entrance & exit

Place scenery around the ride

If you enabled scenery, adjust Radius, Density, and Max pieces (defaults are sensible).

Click Apply selected options.

You can also press Suggest on-theme name to copy a fresh name into your clipboard field.

UI Reference

Ride (dropdown): Your target ride.

Theme (dropdown): A curated look & feel (name list, colours, music, accent/scenery objects).

Rename ride from theme list (checkbox): Picks a weighted name from the theme’s list.

Recolour track, supports and trains (checkbox): Applies palette indices safely (auto-clamped).

Set matching music track (checkbox): Enables music and sets a theme-appropriate style if your build exposes it.

Theme entrance & exit (checkbox):

If entrance styling is exposed in your build, applies a matching type/object.

Otherwise places small themed accents next to the entrance/exit tiles.

Place scenery around the ride (checkbox): Activates the smart placement pass.

Radius in tiles: How far from station/entrance the plugin searches for placement spots.

Density (0–100): Chance to place an object on a candidate tile.

Max pieces: Hard cap to keep things tidy.

Avoid paths: Prevents blocking guest routes.

Avoid steep tiles: Skips awkward slopes/corners.

Rotate randomly: Adds variety to repeated pieces.

Themes Included (v0.2)

Pirate Cove
Names like Blackfin’s Revenge, palette of weathered timbers and rope; pirate music; barrels/torches/palms as accents.

Frontier Western
Names like Coyote Ridge and Thunder Mesa; warm desert tones; western music; cacti, barrels, dead trees.

Retro Sci-Fi
Names like Ion Storm and Hyperflux; cool metallic palette; space-style music; lamps, dishes, radar.

Gothic Spooky
Names like Nightshade Manor and Banshee’s Lament; dark purples/greens; spooky music; gravestones, lanterns, dead trees.

Scenery/entrance objects must already be loaded with your park’s object set. If a listed object isn’t available, the plugin quietly skips it.

How Scenery Placement Works

Seeds: Station tiles + ride entrance/exit tiles.

Radius: Searches a circular area around each seed.

Filters:

Rejects water, steep slopes (optional), and path tiles (optional).

Avoids overcrowding by limiting existing scenery per tile.

Density + Cap: Places objects probabilistically, never exceeding your Max pieces.

Variety: Optional random rotation helps avoid repetition.

Compatibility & Safety

Target API: 80+ (works on current OpenRCT2 builds; older builds may lack some fields).

Feature detection: The plugin checks for properties like colourScheme, music_style/musicType, and entrance styling. If not supported, it falls back or skips that step without breaking.

Non-destructive preview: The window shows your options; changes only occur when you click Apply selected options.

Undo: If your build supports grouping actions into one undo step, use the game’s undo after applying to revert the whole change set. (v0.2 keeps operations tidy but does not force a grouped undo on all builds).

Known Limitations

Entrance styling varies by build. If not exposed, you’ll see small themed accents placed near the entrance/exit as a tasteful fallback.

Object availability: If a theme references an object not present in the park’s loaded objects, that piece is skipped.

Scenery on slopes: Very steep or complex terrain may reduce placement success (by design, to avoid hovering items).

No queue theming (v0.2): The plugin avoids queue tiles to prevent congestion.

Performance Notes

The plugin works in short bursts when you click Apply; it does not run continuously.

Scenery placement limits (radius/density/cap) keep things fast.

All map lookups and feature checks are guarded with try/catch to avoid hard errors.

Customising / Extending Themes

Open the file and look for the THEMES array. Each theme includes:

{
  id: "pirate",
  label: "Pirate Cove",
  names: [ /* … */ ],
  colours: { trackMain, trackAlt, supports, train1, train2 }, // 0–31 palette indices
  musicStyle: 11, // only if available in your build
  accentObjectIds: [ /* small scenery for entrances/exits */ ],
  sceneryObjectIds: [ /* larger pieces for around-ride placement */ ]
}


Names: Add more strings to widen variety.

Colours: Use palette indices (0–31). The plugin clamps values automatically.

Music: Only set if your build exposes music style fields; otherwise omit the property.

Objects: Use object IDs that exist in your park’s object set (the plugin checks and skips if missing).

Troubleshooting

Nothing happens when I click Apply:
Make sure a ride is selected, and at least one option (name/colours/music/entrance/scenery) is ticked.

No scenery appears:
Increase Density and Max pieces, or reduce Radius so the cap isn’t spread too thin.
Ensure the theme’s sceneryObjectIds exist in your park object set.

Entrance theming didn’t change the entrance look:
Your build may not expose entrance styling. The plugin will place accents near the entrance/exit instead.

Music didn’t change:
Some builds use music_style, others musicType. If neither is present, the plugin leaves music unchanged.

Changelog

v0.2

Added scenery around the ride with radius/density/cap and smart filters.

Added entrance/exit accent fallback when direct styling isn’t available.

Safer feature detection for colours/music.

Clean, minimal UI with clear labels and a “suggest name” helper.

v0.1

Initial release with names, colours, music, and basic entrance/exit handling.

License

MIT — do whatever you like; attribution appreciated.

Credits

Author: Steven
