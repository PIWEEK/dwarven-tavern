"use strict";

var _ = require("underscore"),
    express = require("express"),
    http = require("http"),
    path = require("path"),
    InputServer = require("./client_input/InputServer"),
    SimulationManager = require("./simulation/SimulationManager"),
    PlayerData = require("./simulation/PlayerData"),
    WebSocketServer = require('./visor/WebSocketServer'),
    SimulationTurn = require("./simulation/SimulationTurn"),
    config = require('./config');

var expressApp = express();
var server = http.createServer(expressApp);

var inputServer = new InputServer(config);
var simulationManager = new SimulationManager(config);
var webSocketServer = new WebSocketServer();

simulationManager.get("emitter").on("simulation-ready", function(simulation){
    console.log(">> Simulation ready: " + simulation.get("id"));
    console.log("\n##################################################\n");
    console.log(simulation.toString());
    console.log("\n##################################################\n");

    webSocketServer.emitBroadcast("simulation-ready", {
        player1: {
            nick: simulation.get("player1").get("nick"),
            bots: simulation.get("player1").get("names")
        },
        player2: {
            nick: simulation.get("player2").get("nick"),
            bots: simulation.get("player2").get("names")
        }
    });

    var response = JSON.stringify({ type: "turn", state: simulation.getCurrentState()});
    simulation.get("player1").get("client").get("socket").write(response);
});

simulationManager.get("emitter").on("team1-turn", function(simulation){
    console.log(">> Player 1 has played");
    console.log("\n##################################################\n");
    console.log(simulation.toString());
    console.log("\n##################################################\n");

    webSocketServer.emitBroadcast("turn", { type: "turn", messages: simulation.getTurnEvents(), state: simulation.getCurrentState()});

    var response = JSON.stringify({ type: "turn", state: simulation.getCurrentState()});
    simulation.get("player2").get("client").get("socket").write(response);
});

simulationManager.get("emitter").on("team2-turn", function(simulation){
    console.log(">> Player 2 has played");
    console.log("\n##################################################\n");
    console.log(simulation.toString());
    console.log("\n##################################################\n");

    webSocketServer.emitBroadcast("turn", { type: "turn", messages: simulation.getTurnEvents(), state: simulation.getCurrentState()});

    var response = JSON.stringify({ type: "turn", state: simulation.getCurrentState()});
    try {
        simulation.get("player1").get("client").get("socket").write(response);
    } catch (exception){
        console.log(" - " + exception);
    }
});

simulationManager.get("emitter").on("end-game", function(simulation){
    console.log("++ GAME FINISHED");
    
    webSocketServer.emitBroadcast("turn", { type: "turn", messages: simulation.getTurnEvents(), state: simulation.getCurrentState()});
    
    simulationManager.removeSimulation(simulation);
    
    var responseWin = JSON.stringify({ type: "win-game", state: simulation.getCurrentState()});
    var responseLoss = JSON.stringify({ type: "loss-game", state: simulation.getCurrentState()});
    
    simulation.get("winner").get("client").get("socket").write(responseWin);
    simulation.get("loser").get("client").get("socket").write(responseLoss);
    
    simulation.get("winner").get("client").get("socket").end();
    simulation.get("loser").get("client").get("socket").end();

    webSocketServer.emitBroadcast("end-game", {
        winner: simulation.get("winner").get("nick"),
        loser: simulation.get("loser").get("nick")
    });
});

webSocketServer.get("emitter").on("create-simulation", function(socket){
    console.log("++ Simulation create");
    simulationManager.createSimulation();
    socket.emit("simulation-list", { serverList: simulationManager.getSimulationList()});
    console.log("++ Simulation create OK");
});

inputServer.get("emitter").on("create-simulation", function(jsonContent, client){
    console.log("++ Simulation create");
    var simulationID = simulationManager.createSimulation();
    var response = '{"type": "ready", "simulationId": "' + simulationID + '" }\n';
    client.get("socket").write(response);
    console.log("++ Simulation create OK");
});

inputServer.get("emitter").on("join-simulation", function(jsonContent, client){
    console.log("++ Player joining: " + jsonContent.simulationId);
    var playerData = new PlayerData({jsonContent: jsonContent});
    playerData.set("client", client);
    
    if(simulationManager.hasSimulation(jsonContent.simulationId)) {
        var simulation = simulationManager.joinSimulation(jsonContent.simulationId, playerData);
        console.log("++ Player joined OK");
        var playersConnected = simulation.get("playersConnected");
        var teams = simulation.get("teams");
        
        // Send back the game info
        var response = {
            type: "game-info",
            team: teams[playersConnected-1],
            width: config.width,
            height: config.height
        };
        client.get("socket").write(JSON.stringify(response));
    } else {
        client.get("socket").write(JSON.stringify({"type": "error", "message": "Wrong simulation ID"}));
    }
});

inputServer.get("emitter").on("player-turn", function(jsonContent, client) {
    console.log("++ Player turn");
    var simulationTurn = new SimulationTurn({jsonContent: jsonContent});
    if (simulationTurn.valid()) {
        simulationManager.sendTurn(client, simulationTurn);
    } else {
        console.log('-- Turno inválido');
        inputServer.get("emitter").emit('turn-malformed', client);
    }
});

inputServer.get("emitter").on('turn-malformed', function(client) {
    var response = '{"type": "error", "message": "Invalid turn"}\n';
    client.get("socket").write(response);
});

inputServer.get("emitter").on('player-disconnected', function(client) {
    console.log("++ Notifying other players of disconnect");
    try {
        var response = JSON.stringify({"type": "error", "message": "Player disconnected"});
        
        var simulation = simulationManager.getSimulationForClient(client);
        
        if(simulation) {
            simulationManager.removeSimulation(simulation);
            console.log("++ Disconnecting: %s (%s,%s)", client.get("clientName"), simulation.get("player1").get("client").get("clientName"), simulation.get("player2").get("client").get("clientName"));
            var clientPlayer1 = simulation.get("player1").get("client");
            if(client.get("clientName") != clientPlayer1.get("clientName")) {
                clientPlayer1.get("socket").write(response);
                clientPlayer1.get("socket").end();
            }
            var clientPlayer2 = simulation.get("player2").get("client");
            if(client.get("clientName") != clientPlayer2.get("clientName")) {
                console.log("DISCONNECT %s", clientPlayer2.get("clientName"));
                clientPlayer2.get("socket").write(response);
                clientPlayer2.get("socket").end();
            }
        } else {
            console.log("++ Not found other players");
        }
    } catch(err) {
        console.log(" -- Error disconnecting clients: " + err);
    }
});

webSocketServer.get("emitter").on("simulation-list", function(socket){
    console.log("-------------------------------------");
    socket.emit("simulation-list", { serverList: simulationManager.getSimulationList()});
});

inputServer.start();
webSocketServer.start(server);
server.listen(config.httpPort);

expressApp.configure(function() {
    var resourcesDir = path.resolve(__dirname, "..", 'client');

    expressApp.use('/css', express.static(resourcesDir + '/css'));
    expressApp.use('/js', express.static(resourcesDir + '/js'));
    expressApp.use('/fonts', express.static(resourcesDir + '/fonts'));
    expressApp.use('/imgs', express.static(resourcesDir + '/imgs'));
    expressApp.use('/sounds', express.static(resourcesDir + '/sounds'));
});

expressApp.get('/', function(req, res) {
    var viewsPath = path.resolve(__dirname, "..", 'client', 'index.html');
    res.sendfile(viewsPath);
});
