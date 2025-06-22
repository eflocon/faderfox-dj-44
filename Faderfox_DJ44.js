var DJ44 = {};
/*
var BeatJumpControl = {
    sizes: [0.25, 0.5, 1, 2, 4, 8, 16, 32],
    currentIndex: 2  // default size = 1 beat
};
*/
var BeatJumpControl = {
    sizes: [0.25, 0.5, 1, 2, 4, 8, 16, 32],
    currentIndexByDeck: {
        "[Channel1]": 2,
        "[Channel2]": 2,
        "[Channel3]": 2,
        "[Channel4]": 2
    }
};
///////////////////////////////////////

DJ44.init = function() {
    var decks = ["[Channel1]", "[Channel2]", "[Channel3]", "[Channel4]"];

    decks.forEach(function(deck) {
        var size = engine.getValue(deck, "beatjump_size");
        var index = BeatJumpControl.sizes.findIndex(function(s) {
            return s === size;
        });

        BeatJumpControl.currentIndexByDeck[deck] = index !== -1 ? index : 2;
        print(deck + ": initialized beatjump size = " + BeatJumpControl.sizes[BeatJumpControl.currentIndexByDeck[deck]]);
    });    
};

DJ44.shutdown = function() {
    // Shutdown code, if any
};
DJ44.helloworld = function() {
    // Shutdown code, if any
    print("hello world");
};
DJ44.helloworld = function() {
    // Shutdown code, if any
    print("hello world");
};

DJ44.nudgeEncoder = function(channel, control, value, status, group) {
    var delta;

    if (value <= 63) {
        // Clockwise turn
        delta = value;
    } else {
        // Counterclockwise turn, convert from two's complement
        delta = value - 128; // e.g., 127 → -1, 126 → -2
    }

    // Adjust sensitivity here (e.g., 0.01 = very fine)
    var sensitivity = 1;
    var jogAmount = delta * sensitivity;

    engine.setValue(group, "jog", jogAmount);
};

DJ44.nudgePlayposition = function(channel, control, value, status, group) {
    var delta;

    if (value <= 63) {
        delta = value;
    } else {
        delta = value - 128;
    }

    // Adjust sensitivity to how far you want to nudge per tick
    var sensitivity = 0.002;

    // Get current playposition (0.0 to 1.0)
    var currentPos = engine.getValue(group, "playposition");

    // Compute new position, clamp between 0.0 and 1.0
    var newPos = currentPos + delta * sensitivity;
    newPos = Math.max(0.0, Math.min(1.0, newPos));

    engine.setValue(group, "playposition", newPos);
};

DJ44.nudgePlaypositionSlow = function(channel, control, value, status, group) {
    var delta;

    if (value <= 63) {
        delta = value;
    } else {
        delta = value - 128;
    }

    // Adjust sensitivity to how far you want to nudge per tick
    var sensitivity = 0.00001;

    // Get current playposition (0.0 to 1.0)
    var currentPos = engine.getValue(group, "playposition");

    // Compute new position, clamp between 0.0 and 1.0
    var newPos = currentPos + delta * sensitivity;
    newPos = Math.max(0.0, Math.min(1.0, newPos));

    engine.setValue(group, "playposition", newPos);
};
DJ44.onLoopAdjust = function(channel, control, value, status, group) {
    //print("LoopAdjust called on group: " + group + ", value: " + value);
    if (value === 0x40) return; // Ignore center detent (if any)

    if (group !== "[Channel1]" && group !== "[Channel2]" && group !== "[Channel3]" && group !== "[Channel4]") {
        print("Unknown group: " + group);
        return;
    }

    if (value > 0x40) {
        engine.setValue(group, "loop_halve", 1);
        print(group + ": loop size halved");
    } else if (value < 0x40) {
        engine.setValue(group, "loop_double", 1);
        print(group + ": loop size doubled");
    }
};
DJ44.onBeatJumpSizeAdjust = function(channel, control, value, status, group) {
/*    var newSize;
 
    if (value < 0x40) {
        // Clockwise - increase size
        BeatJumpControl.currentIndex = Math.min(
            BeatJumpControl.currentIndex + 1,
            BeatJumpControl.sizes.length - 1
        );
    } else if (value > 0x40) {
        // Counterclockwise - decrease size
        BeatJumpControl.currentIndex = Math.max(
            BeatJumpControl.currentIndex - 1,
            0
        );
    }
    newSize = BeatJumpControl.sizes[BeatJumpControl.currentIndex];

    // Set the beatjump size in Mixxx
    engine.setValue(group, "beatjump_size", newSize);

    // Debug log
    print("Set beatjump_size to: " + newSize);
    */
    const sizes = BeatJumpControl.sizes;
    const indexKey = BeatJumpControl.currentIndexByDeck;

    if (!indexKey[group]) {
        // Initialize index if not already
        indexKey[group] = 2;
    }

    let index = indexKey[group];

    if (value < 0x40) {
        index = Math.min(index + 1, sizes.length - 1);
    } else if (value > 0x40) {
        index = Math.max(index - 1, 0);
    } else {
        return; // Ignore no-op or center detent
    }

    // Update and apply
    indexKey[group] = index;
    const newSize = sizes[index];
    engine.setValue(group, "beatjump_size", newSize);

    print(group + " → Set beatjump_size to: " + newSize + " (index " + index + ")");
};
DJ44.loopMoveBackward = function(channel, control, value, status, group) {
    if (value !== 0x7F) {
        return;
    }

    var size = BeatJumpControl.sizes[BeatJumpControl.currentIndexByDeck[group]];
    var controlName = "loop_move_" + size + "_backward";

    print("Triggering control: " + controlName);

    engine.setValue(group, controlName, 1);
};
DJ44.loopMoveForward = function(channel, control, value, status, group) {
    if (value !== 0x7F) {
        return;
    }

    var size = BeatJumpControl.sizes[BeatJumpControl.currentIndexByDeck[group]];
    var controlName = "loop_move_" + size + "_forward";

    print("Triggering control: " + controlName);

    engine.setValue(group, controlName, 1);
};
