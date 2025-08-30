// Ride Theme Director v0.3
// Minimal implementation of plugin described in README.
// Provides several creative themes and applies them to rides.
// Includes fixes for entrance/exit theming, recolouring and scenery toggle.

(function() {
    'use strict';

    /**
     * List of ride themes. Each theme contains name suggestions, colour schemes
     * and optional music and scenery object references.
     * Colour indices are palette numbers (0-31).
     */
    var THEMES = [
        {
            id: 'pirate',
            label: 'Pirate Cove',
            names: ['Blackfin\'s Revenge', 'Skull & Crossbones', 'Plunder Bay', 'Crimson Cutlass'],
            colours: { trackMain: 24, trackAlt: 26, supports: 28, train1: 4, train2: 1 },
            musicStyle: 11,
            accentObjectIds: ['pirate_barrel', 'pirate_torch'],
            sceneryObjectIds: ['pirate_flag', 'palm_tree', 'anchor']
        },
        {
            id: 'western',
            label: 'Frontier Western',
            names: ['Coyote Ridge', 'Dust Devil', 'Thunder Mesa', 'Rattlesnake Run'],
            colours: { trackMain: 6, trackAlt: 18, supports: 24, train1: 20, train2: 21 },
            musicStyle: 10,
            accentObjectIds: ['barrel', 'cactus'],
            sceneryObjectIds: ['saguaro', 'dead_tree', 'wagon']
        },
        {
            id: 'scifi',
            label: 'Retro Sci-Fi',
            names: ['Hyperflux', 'Ion Storm', 'Cosmo Blaster', 'Nebula Knight'],
            colours: { trackMain: 1, trackAlt: 2, supports: 0, train1: 19, train2: 20 },
            musicStyle: 6,
            accentObjectIds: ['futuristic_lamp', 'radar_dish'],
            sceneryObjectIds: ['antenna', 'satellite', 'laser_tower']
        },
        {
            id: 'spooky',
            label: 'Gothic Spooky',
            names: ['Banshee\'s Lament', 'Nightshade Manor', 'Crypt Crawler', 'Specter Spiral'],
            colours: { trackMain: 15, trackAlt: 16, supports: 0, train1: 13, train2: 14 },
            musicStyle: 18,
            accentObjectIds: ['spooky_lantern', 'gravestone'],
            sceneryObjectIds: ['dead_tree', 'skull_pile', 'gargoyle']
        },
        {
            id: 'jungle',
            label: 'Tropical Jungle',
            names: ['Rainforest Rush', 'Vine Vortex', 'Serpent Falls', 'Temple Trek'],
            colours: { trackMain: 8, trackAlt: 9, supports: 11, train1: 10, train2: 12 },
            musicStyle: 21,
            accentObjectIds: ['jungle_torch', 'ruin_pillar'],
            sceneryObjectIds: ['jungle_tree', 'idol', 'tiki_mask']
        },
        {
            id: 'medieval',
            label: 'Medieval Kingdom',
            names: ['Dragon\'s Keep', 'King\'s Tourney', 'Lance & Lion', 'Castle Siege'],
            colours: { trackMain: 3, trackAlt: 5, supports: 24, train1: 28, train2: 30 },
            musicStyle: 7,
            accentObjectIds: ['banner', 'torch'],
            sceneryObjectIds: ['castle_wall', 'stone_tower', 'market_stall']
        },
        {
            id: 'alpine',
            label: 'Snowy Alpine',
            names: ['Avalanche Run', 'Glacier Glider', 'Frostbite Flyer', 'Icecap Dash'],
            colours: { trackMain: 27, trackAlt: 25, supports: 24, train1: 1, train2: 3 },
            musicStyle: 23,
            accentObjectIds: ['ski_sign', 'snowman'],
            sceneryObjectIds: ['fir_tree', 'ice_rock', 'log_pile']
        },
        {
            id: 'neon',
            label: 'Neon Future',
            names: ['Quantum Loop', 'Laserwave', 'Neon Nexus', 'Circuit Surge'],
            colours: { trackMain: 2, trackAlt: 3, supports: 31, train1: 20, train2: 21 },
            musicStyle: 3,
            accentObjectIds: ['neon_sign', 'holo_panel'],
            sceneryObjectIds: ['neon_post', 'holo_tree', 'data_tower']
        }
    ];

    // Ride classifications that should not be themed
    var NON_THEMEABLE_CLASSIFICATIONS = ['stall'];

    // Window state used to keep checkbox values between refreshes
    var state = {
        rideId: null,
        themeIndex: 0,
        rename: true,
        recolour: true,
        music: true,
        entrances: true,
        scenery: false
    };

    /** Utility helpers **/
    function getThemeableRides() {
        var rides = context.getPark().rides;
        var result = [];
        for (var i = 0; i < rides.length; i++) {
            var r = rides[i];
            if (!r) continue;
            if (NON_THEMEABLE_CLASSIFICATIONS.indexOf(r.classification) >= 0) continue;
            result.push(r);
        }
        return result;
    }

    function getRideOptions() {
        var list = getThemeableRides();
        var options = [];
        for (var i = 0; i < list.length; i++) {
            options.push({ id: list[i].id, name: list[i].name });
        }
        return options;
    }

    function pickRandom(arr) {
        return arr[(Math.random() * arr.length) | 0];
    }

    function clampColour(index) {
        if (index < 0) return 0;
        if (index > 31) return 31;
        return index | 0;
    }

    /**
     * Set ride colour scheme according to theme.
     */
    function applyColours(ride, theme) {
        try {
            if (!ride || !theme.colours) return;
            var c = theme.colours;
            ride.setColourScheme(0, clampColour(c.trackMain), clampColour(c.trackAlt), clampColour(c.supports));
            if (ride.trainColours) {
                ride.trainColours[0] = {
                    body: clampColour(c.train1),
                    trim: clampColour(c.train2)
                };
            }
        } catch (e) {
            // gracefully ignore if API not available
        }
    }

    /**
     * Apply entrance and exit theming. Falls back to placing accents if direct styling not available.
     */
    function themeEntrances(ride, theme) {
        if (!ride) return;
        try {
            if (typeof ride.entranceStyle !== 'undefined' && theme.entranceStyle !== undefined) {
                ride.entranceStyle = theme.entranceStyle;
                if (typeof ride.exitStyle !== 'undefined') {
                    ride.exitStyle = theme.entranceStyle;
                }
            } else {
                placeAccentsNearEntrance(ride, theme);
            }
        } catch (e) {
            placeAccentsNearEntrance(ride, theme);
        }
    }

    // Places small scenery objects near entrance/exit tiles as accents
    function placeAccentsNearEntrance(ride, theme) {
        var entrances = ride.stations[0].entrances;
        if (!entrances) return;
        var accentIds = theme.accentObjectIds || [];
        if (accentIds.length === 0) return;
        var map = context.map;
        for (var i = 0; i < entrances.length; i++) {
            var tile = entrances[i];
            for (var a = 0; a < accentIds.length; a++) {
                try {
                    map.placeObject('scenery_small', accentIds[a], tile.x, tile.y, tile.z);
                } catch (e) {
                    // ignore missing objects
                }
            }
        }
    }

    /**
     * Scatter scenery objects around the station and entrances.
     */
    function placeSceneryAroundRide(ride, theme) {
        var objectIds = theme.sceneryObjectIds || [];
        if (objectIds.length === 0) return;
        var map = context.map;
        var seeds = [];
        // station tiles
        for (var s = 0; s < ride.stations.length; s++) {
            var station = ride.stations[s];
            for (var t = 0; t < station.tiles.length; t++) {
                seeds.push(station.tiles[t]);
            }
        }
        // entrance/exit tiles
        if (ride.entrances) {
            for (var e = 0; e < ride.entrances.length; e++) {
                seeds.push(ride.entrances[e]);
            }
        }
        var radius = 4;
        var maxPieces = 25;
        var placed = 0;
        for (var i = 0; i < seeds.length && placed < maxPieces; i++) {
            var seed = seeds[i];
            for (var dx = -radius; dx <= radius && placed < maxPieces; dx++) {
                for (var dy = -radius; dy <= radius && placed < maxPieces; dy++) {
                    if (Math.random() > 0.25) continue; // density
                    var x = seed.x + dx;
                    var y = seed.y + dy;
                    try {
                        var tile = map.getTile(x, y);
                        if (!tile) continue;
                        if (tile.elements.some(function(e) { return e.type === 'footpath'; })) continue;
                        var obj = pickRandom(objectIds);
                        map.placeObject('scenery_small', obj, x, y, tile.surfaceZ);
                        placed++;
                    } catch (e) {
                        // ignore invalid tiles
                    }
                }
            }
        }
    }

    /** Apply theme to ride according to options */
    function applyTheme(rideId, themeIndex) {
        var rides = context.getPark().rides;
        var ride = rides[rideId];
        var theme = THEMES[themeIndex];
        if (!ride || !theme) return;
        if (state.rename) {
            ride.name = pickRandom(theme.names);
        }
        if (state.recolour) {
            applyColours(ride, theme);
        }
        if (state.music && theme.musicStyle !== undefined) {
            try {
                if (typeof ride.musicType !== 'undefined') {
                    ride.musicType = theme.musicStyle;
                    ride.isMusicOn = true;
                } else if (typeof ride.music_style !== 'undefined') {
                    ride.music_style = theme.musicStyle;
                    ride.isMusicOn = true;
                }
            } catch (e) {
                // ignore
            }
        }
        if (state.entrances) {
            themeEntrances(ride, theme);
        }
        if (state.scenery) {
            placeSceneryAroundRide(ride, theme);
        }
    }

    /** Build list of dropdown items for rides and themes */
    function createRideDropdownItems() {
        var options = getRideOptions();
        var items = [];
        for (var i = 0; i < options.length; i++) {
            items.push(options[i].name);
        }
        return items;
    }

    function createThemeDropdownItems() {
        var items = [];
        for (var i = 0; i < THEMES.length; i++) {
            items.push(THEMES[i].label);
        }
        return items;
    }

    /** Main UI window creation */
    function openWindow() {
        var rideItems = createRideDropdownItems();
        var themeItems = createThemeDropdownItems();
        var window = ui.openWindow({
            classification: 'rtd_window',
            title: 'Ride Theme Director',
            width: 300,
            height: 180,
            widgets: [
                {
                    type: 'dropdown',
                    name: 'rideDropdown',
                    x: 10, y: 20, width: 280, height: 14,
                    items: rideItems,
                    selectedIndex: 0,
                    onChange: function(e) {
                        state.rideId = getThemeableRides()[e].id;
                    }
                },
                {
                    type: 'dropdown',
                    name: 'themeDropdown',
                    x: 10, y: 40, width: 280, height: 14,
                    items: themeItems,
                    selectedIndex: state.themeIndex,
                    onChange: function(e) { state.themeIndex = e; }
                },
                { type: 'checkbox', name: 'rename', x: 10, y: 60, width: 280, height: 14, text: 'Rename ride', isChecked: state.rename, onChange: function(e){ state.rename = e; }},
                { type: 'checkbox', name: 'recolour', x: 10, y: 75, width: 280, height: 14, text: 'Recolour ride', isChecked: state.recolour, onChange: function(e){ state.recolour = e; }},
                { type: 'checkbox', name: 'music', x: 10, y: 90, width: 280, height: 14, text: 'Set music', isChecked: state.music, onChange: function(e){ state.music = e; }},
                { type: 'checkbox', name: 'entrances', x: 10, y:105, width: 280, height: 14, text: 'Theme entrance & exit', isChecked: state.entrances, onChange: function(e){ state.entrances = e; }},
                { type: 'checkbox', name: 'scenery', x: 10, y:120, width: 280, height: 14, text: 'Place scenery around ride', isChecked: state.scenery, onChange: function(e){ state.scenery = e; }},
                {
                    type: 'button',
                    name: 'apply',
                    x: 10, y: 140, width: 130, height: 20,
                    text: 'Apply selected options',
                    onClick: function() {
                        if (state.rideId === null) {
                            var rides = getThemeableRides();
                            if (rides.length > 0) {
                                state.rideId = rides[0].id;
                            }
                        }
                        applyTheme(state.rideId, state.themeIndex);
                    }
                },
                {
                    type: 'button',
                    name: 'close',
                    x: 160, y: 140, width: 130, height: 20,
                    text: 'Close',
                    onClick: function() { window.close(); }
                }
            ]
        });
    }

    function main() {
        if (typeof ui !== 'undefined') {
            openWindow();
        }
    }

    registerPlugin({
        name: 'Ride Theme Director',
        version: '0.3',
        authors: ['Steven', 'ChatGPT'],
        type: 'remote',
        licence: 'MIT',
        main: main
    });
})();

