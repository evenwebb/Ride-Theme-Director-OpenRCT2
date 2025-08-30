# Ride Theme Director (v0.3)

Give any ride a cohesive identity in seconds. Pick a theme, tick the parts you want, and Ride Theme Director will rename the ride, set matching music, recolour track/supports/trains, and (optionally) place tasteful scenery around the station and approaches. There’s also a light-touch entrance/exit “accent” pass that works even on builds where direct entrance styling isn’t exposed.

---

## ✨ Highlights

- **Does nothing until you choose a ride** — zero surprises.
- **Theme picker** (Pirate Cove, Frontier Western, Retro Sci-Fi, Gothic Spooky, Royal Castle, Jungle Expedition, Arctic Expedition, Candy Land, Ancient Egypt, Clockwork Steampunk).
- **Modular application** — enable/disable each piece:
  - On-theme **ride name**
  - **Colours** (track, supports, train body/trim)
  - **Music** (matching track, if available in your build)
- **Entrance/Exit accents** (feature-detected; safe fallback to place small scenery nearby)
- **Scenery around the ride** (radius/density/limit controls)
- **Safe by design** — feature-detects capabilities; falls back gracefully if your OpenRCT2 build lacks certain setters.
- **Optimised placement** — avoids paths and steep slopes by default, with a hard cap to prevent clutter.
- **Ride picker** ignores shops, toilets, kiosks and other facilities that can't be themed.

---

## 📥 Installation

1. Download: **`ride-theme-director.js`**
2. Place in your OpenRCT2 `plugin` folder:
   - **Windows:** `Documents\OpenRCT2\plugin`
   - **macOS:** `~/Library/Application Support/OpenRCT2/plugin`
   - **Linux:** `~/.config/OpenRCT2/plugin`
3. Launch OpenRCT2 → open any park → Menu → **Ride Theme Director**

> **Note:** The file ends with `})();`. If a text editor adds extra characters after that, delete them.

---

## 🚀 Quick Start

1. Open **Ride Theme Director** from the menu.
2. **Step 1:** Choose a ride from the dropdown.
3. **Step 2:** Pick a theme (Pirate, Western, Sci-Fi, Spooky, Castle, Jungle, Arctic, Candy, Egypt, Steampunk).
4. Tick the parts you want to apply:
   - Rename ride
   - Recolour track/supports/trains
   - Set music
   - Theme entrance & exit
   - Place scenery around the ride
5. If you enabled scenery, adjust **Radius**, **Density**, and **Max pieces**.
6. Click **Apply selected options**.

You can also press **Suggest on-theme name** to copy a fresh name suggestion.

---

## 🖼️ UI Reference

- **Ride**: Your target ride
- **Theme**: Curated look & feel (names, colours, music, accents, scenery)
- **Rename ride from theme list**: Picks a name from the theme’s list
- **Recolour track, supports and trains**
- **Set matching music track**
- **Theme entrance & exit**:  
  - Uses entrance styling if available  
  - Falls back to placing small themed accents nearby
- **Place scenery around the ride**:
  - **Radius in tiles**: search distance
  - **Density (0–100)**: chance to place an item
  - **Max pieces**: hard cap
  - **Avoid paths**: prevent blocking guests
  - **Avoid steep tiles**
  - **Rotate randomly**

---

## 🎨 Themes Included (v0.3)

- **Pirate Cove**
  *Blackfin’s Revenge*, weathered timbers, pirate music, barrels, torches, palms
- **Frontier Western**
  *Coyote Ridge*, desert tones, western music, cacti, barrels, dead trees
- **Retro Sci-Fi**
  *Ion Storm*, metallic palette, sci-fi music, lamps, dishes, radar
- **Gothic Spooky**
  *Nightshade Manor*, dark purples/greens, spooky music, gravestones, lanterns, dead trees
- **Royal Castle**
  *Dragon's Descent*, banners and braziers, regal reds and stone greys
- **Jungle Expedition**
  *Vine Vortex*, lush greens, tiki torches and tropical ruins
- **Arctic Expedition**
  *Frostbite Flyer*, icy blues, snowmen and crystal formations
- **Candy Land**
  *Sugar Rush*, pastel tracks, candy canes and gingerbread
- **Ancient Egypt**
  *Pharaoh's Fury*, warm sands, obelisks and jackal statues
- **Clockwork Steampunk**
  *Gear Grinder*, brass gears, pipes and steam vents

> Scenery/entrance objects must already be loaded with your park’s object set. Missing objects are skipped automatically.

---

## 🌱 How Scenery Placement Works

- **Seeds:** Station + ride entrance/exit tiles
- **Radius:** Circular search area
- **Filters:** Rejects water, steep slopes, and path tiles (optional)
- **Density & Cap:** Controls placement probability and total pieces
- **Variety:** Optional random rotation avoids repetition

---

## ⚙️ Compatibility & Safety

- **Target API:** 80+
- **Feature detection**: Works across builds, falls back gracefully
- **Non-destructive**: Only applies when you click **Apply**
- **Undo support**: Uses grouped actions if supported by your build

---

## ⚠️ Known Limitations

- Entrance styling varies by build — fallback accents are used if styling isn’t available
- Scenery objects must exist in the park’s object set
- Complex terrain may reduce placement success
- Queue tiles are ignored deliberately

---

## 🏎️ Performance Notes

- Runs only when you click **Apply**  
- Placement limits keep it fast  
- All map lookups are wrapped in safety checks

---

## 🔧 Customising Themes

Themes are defined in the `THEMES` array:

```js
{
  id: "pirate",
  label: "Pirate Cove",
  names: [ /* … */ ],
  colours: { trackMain, trackAlt, supports, train1, train2 },
  musicStyle: 11,
  accentObjectIds: [ /* small accents */ ],
  sceneryObjectIds: [ /* larger scenery */ ]
}
