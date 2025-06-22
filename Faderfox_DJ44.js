var DJ44 = {};

DJ44.init = function() {
    // Initialization code, if any
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
    if (value > 0x40) {
        // Counter-clockwise: halve loop size
        engine.setValue(group, "loop_halve", 1);
    } else if (value < 0x40) {
        // Clockwise: double loop size
        engine.setValue(group, "loop_double", 1);
    }
};