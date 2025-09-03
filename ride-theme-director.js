/**
 * Ride Theme Director
 * v0.4
 * Author: Steven
 * Licence: MIT
 * Target API: 116+
 *
 * Features
 * - Pick a ride, pick a theme, apply only the parts you want
 * - Options: name, colours, music, entrance and exit accents, scenery around the ride
 * - Scenery placement uses radius, density and max pieces, and avoids paths or steep tiles if you want
 * - Safe feature detection for entrance or exit styling and fallback accents
 */

(function () {
  "use strict";

  var META = {
    name: "Ride Theme Director",
    version: "0.4",
    authors: ["Steven"],
    type: "local",
    targetApiVersion: 116
  };

  var THEMES = [
    {
      id: "pirate",
      label: "Pirate Cove",
      names: ["Blackfin’s Revenge","Skull & Thunder","Buccaneer’s Run","Tortuga Tumbler","Maelstrom Voyage","Galleon’s Fall"],
      colours: { trackMain: 18, trackAlt: 19, supports: 26, train1: 6, train2: 24 },
      musicStyle: 11,
      accentObjectIds: ["scenery_small.torch_1","scenery_small.barrel_1"],
      sceneryObjectIds: ["scenery_large.palm_1","scenery_large.palm_2","scenery_small.crate_1","scenery_small.anchor_1"]
    },
    {
      id: "western",
      label: "Frontier Western",
      names: ["Dust Devil","Coyote Ridge","Prospector’s Plunge","Silver Spur","Canyon Rattler","Thunder Mesa"],
      colours: { trackMain: 27, trackAlt: 28, supports: 15, train1: 24, train2: 14 },
      musicStyle: 6,
      accentObjectIds: ["scenery_small.cactus_1","scenery_small.barrel_1"],
      sceneryObjectIds: ["scenery_large.dead_tree_1","scenery_small.cartwheel_1","scenery_small.water_trough_1"]
    },
    {
      id: "sci",
      label: "Retro Sci Fi",
      names: ["Nebula Runner","Quantum Coil","Ion Storm","Hyperflux","Starlance","Event Horizon"],
      colours: { trackMain: 1, trackAlt: 0, supports: 21, train1: 7, train2: 2 },
      musicStyle: 15,
      accentObjectIds: ["scenery_small.scifi_lamp_1","scenery_small.satellite_dish_1"],
      sceneryObjectIds: ["scenery_large.radar_1","scenery_small.conduit_1","scenery_small.air_vent_1"]
    },
    {
      id: "spooky",
      label: "Gothic Spooky",
      names: ["Nightshade Manor","Banshee’s Lament","Graveyard Shift","Phantom Ascent","Cryptkeeper","Midnight Wail"],
      colours: { trackMain: 0, trackAlt: 22, supports: 16, train1: 22, train2: 0 },
      musicStyle: 8,
      accentObjectIds: ["scenery_small.gravestone_1","scenery_small.lantern_1"],
      sceneryObjectIds: ["scenery_large.dead_tree_2","scenery_small.gargoyle_1","scenery_small.iron_fence_1"]
    },
    {
      id: "castle",
      label: "Royal Castle",
      names: ["Dragon's Descent","Kingdom Siege","Knight's Charge","Royal Rampart","Lance & Lute","Trebuchet Twister"],
      colours: { trackMain: 20, trackAlt: 4, supports: 9, train1: 2, train2: 25 },
      musicStyle: 1,
      accentObjectIds: ["scenery_small.banner_1","scenery_small.torch_2"],
      sceneryObjectIds: ["scenery_large.castle_wall_1","scenery_small.flag_1","scenery_small.statue_knight_1"]
    },
    {
      id: "jungle",
      label: "Jungle Expedition",
      names: ["Vine Vortex","Temple Swing","Rainforest Racer","Serpent's Spiral","Jaguar Leap","Foliage Fury"],
      colours: { trackMain: 10, trackAlt: 11, supports: 6, train1: 24, train2: 9 },
      musicStyle: 5,
      accentObjectIds: ["scenery_small.tiki_torch_1","scenery_small.vine_1"],
      sceneryObjectIds: ["scenery_large.tropical_tree_1","scenery_small.stone_head_1","scenery_small.boulder_1"]
    },
    {
      id: "arctic",
      label: "Arctic Expedition",
      names: ["Frostbite Flyer","Glacier Glide","Polar Plunge","Ice Winder","Snowstorm Sprint","Aurora Ascent"],
      colours: { trackMain: 1, trackAlt: 27, supports: 23, train1: 28, train2: 24 },
      musicStyle: 9,
      accentObjectIds: ["scenery_small.ice_crystal_1","scenery_small.snowman_1"],
      sceneryObjectIds: ["scenery_large.snow_tree_1","scenery_small.ice_chunk_1","scenery_small.penguin_1"]
    },
    {
      id: "candy",
      label: "Candy Land",
      names: ["Sugar Rush","Lollipop Loop","Gumdrop Glide","Toffee Twister","Chocolate Churn","Peppermint Plunge"],
      colours: { trackMain: 21, trackAlt: 24, supports: 17, train1: 20, train2: 6 },
      musicStyle: 13,
      accentObjectIds: ["scenery_small.candy_cane_1","scenery_small.lollipop_1"],
      sceneryObjectIds: ["scenery_large.gingerbread_house_1","scenery_small.cupcake_1","scenery_small.cookie_1"]
    },
    {
      id: "egypt",
      label: "Ancient Egypt",
      names: ["Pharaoh's Fury","Sphinx Spin","Pyramid Plunge","Nile Navigator","Scarab Sprint","Obelisk Odyssey"],
      colours: { trackMain: 14, trackAlt: 27, supports: 15, train1: 24, train2: 0 },
      musicStyle: 3,
      accentObjectIds: ["scenery_small.obelisk_1","scenery_small.torch_1"],
      sceneryObjectIds: ["scenery_large.pyramid_piece_1","scenery_small.statue_jackal_1","scenery_small.urn_1"]
    },
    {
      id: "steampunk",
      label: "Clockwork Steampunk",
      names: ["Gear Grinder","Steam Surge","Copper Coaster","Boiler Blast","Cog & Sprocket","Chrono Chariot"],
      colours: { trackMain: 18, trackAlt: 19, supports: 25, train1: 22, train2: 10 },
      musicStyle: 14,
      accentObjectIds: ["scenery_small.pipe_1","scenery_small.smokestack_1"],
      sceneryObjectIds: ["scenery_large.clocktower_1","scenery_small.gear_1","scenery_small.brass_boiler_1"]
    }
  ];

  var settings = {
    selectedRideId: null,
    themeIndex: 0,

    applyName: true,
    applyColours: true,
    applyMusic: true,
    applyEntranceExit: true,
    applyScenery: false,

    sceneryRadius: 5,
    sceneryDensity: 45,
    sceneryMax: 40,
    sceneryAvoidPaths: true,
    sceneryAvoidSlopes: true,
    sceneryRotateRandomly: true
  };

  var debugLogs = [];
  var debugWindow = null;

  function logDebug(msg) {
    debugLogs.push(msg);
    if (console && console.log) console.log("[Ride Theme Director]", msg);
    if (debugWindow) {
      var list = debugWindow.findWidget("logList");
      if (list) list.items = debugLogs.slice(-200);
    }
  }

  function openDebugWindow() {
    if (debugWindow) {
      debugWindow.bringToFront();
      return;
    }
    debugWindow = ui.openWindow({
      classification: "ride-theme-director-debug",
      title: "Ride Theme Director Log",
      width: 400,
      height: 200,
      colours: [24, 24],
      widgets: [
        { type: "listview", name: "logList", x: 10, y: 20, width: 380, height: 170, items: debugLogs }
      ],
      onClose: function () { debugWindow = null; }
    });
  }

  registerPlugin({
    name: META.name,
    version: META.version,
    authors: META.authors,
    type: META.type,
    targetApiVersion: META.targetApiVersion,
    licence: "MIT",
    main: function () {
      ui.registerMenuItem(META.name, openWindow);
    }
  });

  function openWindow() {
    var rides = getRideList();
    var rideNames = rides.map(function (r) { return r.name; });
    var themeNames = THEMES.map(function (t) { return t.label; });

    var w = ui.openWindow({
      classification: "ride-theme-director",
      title: META.name,
      width: 380,
      height: 290,
      colours: [24, 24],
      widgets: [
        label(10, 20, "Step 1. Choose the ride"),
        dropdown("rideDropdown", 160, 16, 210, rideNames.length ? rideNames : ["No rides found"], function (i) {
          settings.selectedRideId = (rides[i] && rides[i].id) || null;
        }),

        label(10, 40, "Step 2. Pick a theme"),
        dropdown("themeDropdown", 160, 36, 210, themeNames, function (i) {
          settings.themeIndex = i;
          updatePreview();
        }),

        checkbox("nameToggle", 10, 64, "Rename ride from theme list", settings.applyName, function (v) { settings.applyName = v; }),
        checkbox("colourToggle", 190, 64, "Recolour track, supports and trains", settings.applyColours, function (v) { settings.applyColours = v; }),
        checkbox("musicToggle", 10, 82, "Set matching music track", settings.applyMusic, function (v) { settings.applyMusic = v; }),
        checkbox("entranceToggle", 190, 82, "Theme entrance and exit", settings.applyEntranceExit, function (v) { settings.applyEntranceExit = v; }),
        checkbox("sceneryToggle", 10, 100, "Place scenery around the ride", settings.applyScenery, function (v) { settings.applyScenery = v; }),

        label(10, 122, "Scenery options only used if enabled"),
        label(10, 138, "Radius in tiles"),
        spinner("radiusSpin", 120, 134, settings.sceneryRadius, function (v) { settings.sceneryRadius = clamp(v, 1, 12); }),
        label(200, 138, "Density 0 to 100"),
        spinner("densitySpin", 310, 134, settings.sceneryDensity, function (v) { settings.sceneryDensity = clamp(v, 0, 100); }),
        label(10, 158, "Max pieces"),
        spinner("maxSpin", 120, 154, settings.sceneryMax, function (v) { settings.sceneryMax = clamp(v, 0, 200); }),

        checkbox("avoidPath", 200, 154, "Avoid paths", settings.sceneryAvoidPaths, function (v) { settings.sceneryAvoidPaths = v; }),
        checkbox("avoidSlope", 200, 172, "Avoid steep tiles", settings.sceneryAvoidSlopes, function (v) { settings.sceneryAvoidSlopes = v; }),
        checkbox("rotateRand", 200, 190, "Rotate randomly", settings.sceneryRotateRandomly, function (v) { settings.sceneryRotateRandomly = v; }),

        button("suggestName", 10, 214, 170, 16, "Suggest on-theme name", suggestName),
        button("applyBtn", 200, 214, 170, 16, "Apply selected options", applyToRide),

        labelBlock("desc", 10, 236, 360, 34, [
          "This tool does nothing until you choose a ride.",
          "Tick only the parts you want. Scenery uses objects already in your park."
        ].join("\\n")),

        button("debugBtn", 10, 272, 170, 16, "Debug Log", openDebugWindow),
        button("closeBtn", 200, 272, 170, 16, "Close", function () { var win = ui.getWindow("ride-theme-director"); if (win) win.close(); })
      ],
      onClose: function () { }
    });

    if (rides.length) settings.selectedRideId = rides[0].id;
    updatePreview();
  }

  function updatePreview() {
    // Reserved for future visual preview
  }

  function applyToRide() {
    var ride = getRideById(settings.selectedRideId);
    if (!ride) {
      if (ui.showMessageBox) {
        ui.showMessageBox({ type: "error", title: "No ride selected", message: "Choose a ride first.", buttons: ["OK"] });
      } else {
        ui.showError("No ride selected", "Choose a ride first.");
      }
      logDebug("Apply failed: no ride selected.");
      return;
    }
    var theme = THEMES[settings.themeIndex];
    logDebug("Applying theme '" + theme.label + "' to ride '" + ride.name + "'.");

    if (settings.applyName) {
      try { safeSetRideName(ride, pick(theme.names)); logDebug("Renamed ride."); } catch (e) { logDebug("Rename failed: " + e); }
    }
    if (settings.applyColours) {
      try { safeSetRideColours(ride, theme.colours); logDebug("Recoloured ride."); } catch (e) { logDebug("Recolour failed: " + e); }
    }
    if (settings.applyMusic && theme.musicStyle !== undefined) {
      try { safeSetRideMusic(ride, theme.musicStyle); logDebug("Music set."); } catch (e) { logDebug("Music failed: " + e); }
    }
    if (settings.applyEntranceExit) {
      try { themeEntranceAndExit(ride, theme); logDebug("Styled entrance/exit."); } catch (e) { logDebug("Entrance/exit failed: " + e); }
    }
    if (settings.applyScenery) {
      try { placeSceneryAroundRide(ride, theme); logDebug("Placed scenery."); } catch (e) { logDebug("Scenery placement failed: " + e); }
    }
    logDebug("Done applying theme.");
    if (ui.showMessageBox) {
      ui.showMessageBox({ title: "Done", message: "Applied " + theme.label + " to " + ride.name + ".", buttons: ["OK"] });
    } else {
      ui.showQuery("Done", "Applied " + theme.label + " to " + ride.name + ".", ["OK"]);
    }
  }

  function placeSceneryAroundRide(ride, theme) {
    logDebug("Placing scenery around " + ride.name + ".");
    if (!theme.sceneryObjectIds || !theme.sceneryObjectIds.length) { logDebug("No scenery defined for theme."); return; }
    var available = theme.sceneryObjectIds.map(getObject).filter(function (obj) { return obj !== null; });
    if (!available.length) { logDebug("No scenery objects available in park."); return; }

    var stations = findStationTiles(ride.id);
    var entries = findRideEndpoints(ride.id);
    var seeds = stations.concat(entries);
    if (!seeds.length) { logDebug("No station or entry tiles found."); return; }

    var placed = 0;
    var tried = Object.create(null);

    for (var s = 0; s < seeds.length; s++) {
      var seed = seeds[s];
      forEachTileInRadius(seed.x, seed.y, settings.sceneryRadius, function (x, y) {
        if (placed >= settings.sceneryMax) return;
        var key = x + "," + y;
        if (tried[key]) return;
        tried[key] = 1;
        if (random100() > settings.sceneryDensity) return;
        if (!isTileGoodForScenery(x, y)) return;

        var obj = pick(available);
        var z = surfaceZ(x, y);
        var rotation = settings.sceneryRotateRandomly ? randomInt(0, 3) : 0;
        try {
          placeObject(obj, x, y, z, { rotation: rotation });
          placed++;
        } catch (e) { }
      });
      if (placed >= settings.sceneryMax) break;
    }
    logDebug("Placed " + placed + " scenery objects.");
  }

  function isTileGoodForScenery(x, y) {
    try {
      var tile = map.getTile(x, y);
      var surface = null;
      for (var i = 0; i < tile.elements.length; i++) {
        var el = tile.elements[i];
        if (el.type === "surface") { surface = el; break; }
      }
      if (!surface) return false;

      if (surface.hasOwnership && surface.waterHeight > 0) return false;

      if (settings.sceneryAvoidSlopes) {
        var slopeStr = String(surface.slope);
        if (slopeStr.indexOf("slope") >= 0 || slopeStr.indexOf("corner") >= 0 || slopeStr.indexOf("steep") >= 0) return false;
      }

      if (settings.sceneryAvoidPaths) {
        for (var j = 0; j < tile.elements.length; j++) {
          if (tile.elements[j].type === "footpath") return false;
        }
      }

      var sceneryCount = 0;
      for (var k = 0; k < tile.elements.length; k++) {
        var t = String(tile.elements[k].type || "");
        if (t.indexOf("scenery") >= 0) sceneryCount++;
      }
      if (sceneryCount >= 2) return false;

      return true;
    } catch (e) { return false; }
  }

  function themeEntranceAndExit(ride, theme) {
    logDebug("Styling entrances/exits for " + ride.name + ".");
    var endpoints = findRideEndpoints(ride.id);
    if (!endpoints.length) { logDebug("No entrance/exit tiles found."); return; }

    var restyled = false;
    for (var i = 0; i < endpoints.length; i++) {
      try {
        var ep = endpoints[i];
        var tile = map.getTile(ep.x, ep.y);
        for (var j = 0; j < tile.elements.length; j++) {
          var el = tile.elements[j];
          if (el.type === "rideEntrance" || el.type === "rideExit") {
            if (typeof el.setObject === "function") {
              var obj = getObject(guessEntranceObjectForTheme(theme.id));
              if (obj) {
                el.setObject(obj.index);
                restyled = true;
              }
            } else if (el.entranceType !== undefined) {
              el.entranceType = guessEntranceTypeForTheme(theme.id);
              restyled = true;
            }
          }
        }
      } catch (e) { }
    }
    if (restyled) { logDebug("Updated entrance/exit objects."); return; }

    var accents = (theme.accentObjectIds || []).map(getObject).filter(function (obj) { return obj !== null; });
    if (!accents.length) { logDebug("No accent objects available."); return; }

    for (var a = 0; a < endpoints.length; a++) {
      var neighbour = getNeighbourTile(endpoints[a]);
      if (!neighbour) continue;
      try {
        var obj = pick(accents);
        var z = surfaceZ(neighbour.x, neighbour.y);
        placeObject(obj, neighbour.x, neighbour.y, z);
      } catch (e) { }
    }
    logDebug("Placed entrance/exit accents.");
  }

  function getRideList() {
    var list = [];
    var rides = (park && park.rides) ? park.rides : (map && map.rides) ? map.rides : [];
    for (var i = 0; i < rides.length; i++) {
      var r = rides[i];
      try {
        if (r.classification !== undefined) {
          var c = r.classification;
          if (c === "stall" || c === 1) continue;
          if (c !== "ride" && c !== 0) continue;
        }
        if (r.shopItem !== undefined) continue;
      } catch (e) { }
      list.push({ id: r.id, name: r.name });
    }
    list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    return list;
  }

  function getRideById(id) {
    if (id === null) return null;
    try {
      if (park && typeof park.getRide === "function") {
        return park.getRide(id) || null;
      }
      var rides = (park && park.rides) ? park.rides : (map && map.rides) ? map.rides : [];
      return rides[id] || null;
    } catch (e) { return null; }
  }

  function findRideEndpoints(rideId) {
    var out = [];
    var sx = map.size.x, sy = map.size.y;
    for (var x = 0; x < sx; x++) {
      for (var y = 0; y < sy; y++) {
        var tile = map.getTile(x, y);
        for (var i = 0; i < tile.elements.length; i++) {
          var el = tile.elements[i];
          var t = el.type;
          if ((t === "rideEntrance" || t === "rideExit") && el.ride === rideId) out.push({ x: x, y: y });
        }
      }
    }
    return out;
  }

  function findStationTiles(rideId) {
    var out = [];
    var sx = map.size.x, sy = map.size.y;
    for (var x = 0; x < sx; x++) {
      for (var y = 0; y < sy; y++) {
        var tile = map.getTile(x, y);
        for (var i = 0; i < tile.elements.length; i++) {
          var el = tile.elements[i];
          if (el.type === "track" && el.ride === rideId && el.isStation) out.push({ x: x, y: y });
        }
      }
    }
    return out;
  }

  function getNeighbourTile(p) {
    var dirs = [{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
    shuffle(dirs);
    for (var i = 0; i < dirs.length; i++) {
      var nx = p.x + dirs[i].dx, ny = p.y + dirs[i].dy;
      if (nx >= 0 && ny >= 0 && nx < map.size.x && ny < map.size.y) return { x: nx, y: ny };
    }
    return null;
  }

  function surfaceZ(x, y) {
    try {
      var tile = map.getTile(x, y);
      for (var i = 0; i < tile.elements.length; i++) {
        var el = tile.elements[i];
        if (el.type === "surface") return el.baseZ || 0;
      }
      return 0;
    } catch (e) { return 0; }
  }

  function forEachTileInRadius(cx, cy, radius, fn) {
    var r2 = radius * radius;
    var minX = clamp(cx - radius, 0, map.size.x - 1);
    var maxX = clamp(cx + radius, 0, map.size.x - 1);
    var minY = clamp(cy - radius, 0, map.size.y - 1);
    var maxY = clamp(cy + radius, 0, map.size.y - 1);
    for (var x = minX; x <= maxX; x++) {
      for (var y = minY; y <= maxY; y++) {
        var dx = x - cx, dy = y - cy;
        if (dx * dx + dy * dy <= r2) fn(x, y);
      }
    }
  }

  function safeSetRideName(ride, name) {
    try { ride.name = name; } catch (e) { }
  }

  function safeSetRideColours(ride, c) {
    try {
      var clampCol = function (n) { n = (n == null ? 0 : n); return clamp(n, 0, 31); };
      var trackMain = clampCol(c.trackMain);
      var trackAlt = clampCol(c.trackAlt);
      var supports = clampCol(c.supports);
      if (typeof ride.setColourScheme === "function") {
        ride.setColourScheme(0, trackMain, trackAlt, supports);
      } else {
        if (ride.trackColourMain !== undefined) ride.trackColourMain = trackMain;
        if (ride.trackColourAdditional !== undefined) ride.trackColourAdditional = trackAlt;
        if (ride.supportColour !== undefined) ride.supportColour = supports;
      }

      var body = clampCol(c.train1);
      var trim = clampCol(c.train2);
      if (typeof ride.setVehicleColours === "function") {
        try { ride.setVehicleColours(0, body, trim); } catch (e) { }
      }
    } catch (e) { }
  }

  function safeSetRideMusic(ride, musicStyle) {
    try {
      ride.music = true;
      if (ride.musicStyle !== undefined) ride.musicStyle = musicStyle;
      else if (ride.musicType !== undefined) ride.musicType = musicStyle;
      else if (ride.music_style !== undefined) ride.music_style = musicStyle;
    } catch (e) { }
  }

  function getObject(objectName) {
    try {
      var parts = objectName.split(".");
      var group = parts[0], id = parts[1];
      if (typeof objectManager !== "undefined" && objectManager.getObject) {
        return objectManager.getObject(group, id) || null;
      }
      if (context && context.getObject) {
        return context.getObject(group, id) || null;
      }
    } catch (e) { }
    return null;
  }

  function objectExists(objectName) {
    return getObject(objectName) !== null;
  }

  function placeObject(obj, x, y, z, options) {
    try {
      if (map && typeof map.placeObject === "function") {
        map.placeObject(obj, x, y, z, options);
      } else if (typeof scenery !== "undefined" && typeof scenery.place === "function") {
        scenery.place(obj, x, y, z, options || {});
      } else {
        var tile = map.getTile(x, y);
        if (tile && typeof tile.placeObject === "function") {
          tile.placeObject(obj, z, options);
        }
      }
    } catch (e) { }
  }

  function guessEntranceTypeForTheme(themeId) {
    switch (themeId) {
      case "pirate": return 2;
      case "western": return 3;
      case "sci": return 4;
      case "spooky": return 5;
      case "castle": return 6;
      case "jungle": return 7;
      case "arctic": return 8;
      case "candy": return 9;
      case "egypt": return 10;
      case "steampunk": return 11;
      default: return 0;
    }
  }

  function guessEntranceObjectForTheme(themeId) {
    switch (themeId) {
      case "pirate": return "ride_entrance.pirate_1";
      case "western": return "ride_entrance.western_1";
      case "sci": return "ride_entrance.scifi_1";
      case "spooky": return "ride_entrance.spooky_1";
      case "castle": return "ride_entrance.castle_1";
      case "jungle": return "ride_entrance.jungle_1";
      case "arctic": return "ride_entrance.snow_1";
      case "candy": return "ride_entrance.candy_1";
      case "egypt": return "ride_entrance.egyptian_1";
      case "steampunk": return "ride_entrance.steampunk_1";
      default: return "ride_entrance.standard_1";
    }
  }

  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }
  function randomInt(min, max) { return (Math.random() * (max - min + 1) + min) | 0; }
  function random100() { return (Math.random() * 100) | 0; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0; var t = a[i]; a[i] = a[j]; a[j] = t; } }

  // UI helpers
  function label(x, y, text) { return { type: "label", x: x, y: y, width: 360, height: 14, text: text }; }
  function labelBlock(name, x, y, w, h, text) { return { type: "label", name: name, x: x, y: y, width: w, height: h, text: text }; }
  function dropdown(name, x, y, w, items, onChange) { return { type: "dropdown", name: name, x: x, y: y, width: w, height: 14, items: items, selectedIndex: 0, onChange: onChange }; }
  function spinner(name, x, y, val, onChangeNum) {
    return {
      type: "spinner", name: name, x: x, y: y, width: 60, height: 14, text: String(val),
      onIncrement: function () {
        var win = ui.getWindow("ride-theme-director");
        if (!win) return;
        var sp = win.findWidget(name);
        var v = parseInt(sp.text || "0", 10) + 1;
        sp.text = String(v);
        onChangeNum(v);
      },
      onDecrement: function () {
        var win = ui.getWindow("ride-theme-director");
        if (!win) return;
        var sp = win.findWidget(name);
        var v = parseInt(sp.text || "0", 10) - 1;
        sp.text = String(v);
        onChangeNum(v);
      }
    };
  }
  function checkbox(name, x, y, text, isChecked, onChangeBool) {
    return {
      type: "checkbox", name: name, x: x, y: y, width: 170, height: 14, text: text, isChecked: isChecked,
      onChange: function () {
        var win = ui.getWindow("ride-theme-director");
        if (!win) return;
        var w = win.findWidget(name);
        onChangeBool(w.isChecked);
      }
    };
  }
  function button(name, x, y, w, h, text, onClick) { return { type: "button", name: name, x: x, y: y, width: w, height: h, text: text, onClick: onClick }; }

  function suggestName() {
    var theme = THEMES[settings.themeIndex];
    var name = pick(theme.names);
    var opts = {
      title: "Suggested ride name",
      description: "Click OK to copy this name. You can paste it into the ride window if you prefer.",
      initialValue: name,
      callback: function () { }
    };
    if (ui.showTextInput) {
      ui.showTextInput(opts);
    } else if (ui.showTextPrompt) {
      ui.showTextPrompt(opts);
    } else if (ui.showInputBox) {
      ui.showInputBox(opts);
    }
  }
})();
