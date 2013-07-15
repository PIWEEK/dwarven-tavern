"use strict";

var _ = require("underscore");

var InputServer = require("./client-input/input-server"),
    SimulationTurn = require('./simulation/SimulationTurn');

var inputServer = new InputServer({port: 9000});

inputServer.get("emitter").on("input-received", function(action, sourceClient) {
    try {
        var simulationTurn = new SimulationTurn({rawContent: action});
    } catch(err) {
        console.log('##### PARSER ERROR #####');
        console.log(err);
    }
});

inputServer.start();
