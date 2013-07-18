var Backbone = require("backbone"),
    _ = require("underscore"),
    EventEmitter = require("events").EventEmitter,
    hat = require("hat"),
    Simulation = require("./Simulation"),
    SimulationTurn = require("./SimulationTurn"),
    PlayerData = require("./PlayerData"),
    BotData = require("./BotData");

var SimulationManager = Backbone.Model.extend({
    defaults: {
        simulations: {},
        clients: {},
    },
    
    initialize: function() {
        this.set("emitter", new EventEmitter());
    },
    
    createSimulation: function() {
        var uid = ""+ hat(32,28);
        
        this.get("simulations")[uid] = new Simulation({
            width: this.get("width"),
            height: this.get("width"),
            pointsToWin: this.get("pointsToWin"),
            scorePlayer1: 0,
            scorePlayer2: 0,
            lastId: 0,
            playersConnected: 0,
            id: uid
        });
        return uid;
    },
    
    joinRandomSimulation: function(playerData) {
        var simulations = this.get("simulations");
        var simulation  = _.find(_.values(simulations), function(itSim){
            if(itSim.get("playersConnected") != 2) {
                return itSim;
            }
        });
        if(simulation) {
            console.log(">>> " + simulation.get("id"));
            simulation = this.joinSimulation(simulation.get("id"), playerData);
        }
        return simulation;
    },
    
    joinSimulation: function(uid, playerData) {
        var simulations = this.get("simulations"),
            simulation = simulations[uid],
            names = playerData.get("names"),
            playersConnected = simulation.get("playersConnected"),
            lastId = simulation.get("lastId"),
            client = playerData.get("client"),
            socket = client.get("socket");
        
        var positions = (playersConnected == 0)?this.get("positions").team1:this.get("positions").team2;
        var player = (playersConnected == 0)?"player1":"player2";
        
        var botsData = [];
        
        for(var i=0; i<names.length; i++) {
            lastId++;
            botsData.push(new BotData({
                id: lastId,
                name: names[i],
                coords: positions.bots[i]
            }));
        }
        simulation.setTeam("team"+(playersConnected+1), positions.barrel, botsData);
        
        playersConnected++;
        
        simulation.set("playersConnected", playersConnected);
        simulation.set("lastId", lastId);
        simulation.set(player, playerData);
        
        var clientName = socket.remoteAddress + ":" + socket.remotePort;
        this.get("clients")[clientName] = simulation.get("id");
        
        if(playersConnected == 2) {
            simulation.set("currentTurn", 0);
            this.get("emitter").emit("simulation-ready", simulation);
        }
        
        return simulation;
    },
    
    sendTurn: function(client, simulationTurn) {
        var simulation = this.getSimulationForClient(client);
        
        if(!simulation.get("simulationFinished")) {
            console.log("++ Turn for simulation: " + simulation.get("id"));
            
            var oldSc1 = simulation.get("scorePlayer1"),
                oldSc2 = simulation.get("scorePlayer2");
            
            simulation.processTurn(simulationTurn.get("actions"));
            
            var newSc1 = simulation.get("scorePlayer1"),
                newSc2 = simulation.get("scorePlayer2");

            if(!simulation.get("simulationFinished") && simulation.get("currentTurn") % 2 == 1) {
                this.get("emitter").emit("team1-turn", simulation);
            } else if(!simulation.get("simulationFinished") && simulation.get("currentTurn") % 2 == 0) {
                this.get("emitter").emit("team2-turn", simulation);
            }
            
            if(newSc1 > oldSc1) {
                this.get("emitter").emit("player-score", simulation, simulation.get("teams")[0]);
            } else if (newSc2 > oldSc2) {
                this.get("emitter").emit("player-score", simulation, simulation.get("teams")[1]);
            }
            
            if(simulation.get("simulationFinished")) {
                this.get("emitter").emit("end-game", simulation);
            }
        }
    },
    
    getSimulationForClient: function(client) {
        var socket = client.get("socket");
        
        var clientName;
        if(socket.remoteAddress) {
            clientName = socket.remoteAddress + ":" + socket.remotePort;
            client.set("clientName", clientName);
        } else {
            clientName = client.get("clientName");
        }
        
        console.log(">> Client name %s", clientName);
        
        var uid = this.get("clients")[clientName];
        
        if(!uid) {
            return null;
        }
        return this.get("simulations")[uid];
    },
    
    getSimulationList: function() {
        var simulations = this.get("simulations");
        var result = [];
        _.each(_.keys(simulations), function(key){
            var connected = simulations[key].get("playersConnected");
            result.push({ simulationId: key, playersConnected: connected});
        });
        return result;
    },
    
    hasSimulation: function(simulationId) {
        var simulations = this.get("simulations");
        return (true && simulations[simulationId]);
    },
    
    removeSimulation: function(simulation) {
        var simulationId = simulation.get("id"),
            simulations = this.get("simulations");
        delete simulations[simulationId];
    }
});

if (require.main === module) {
    var BotAction = require("./BotAction"),
        Client = require("../client_input/Client");
    
    var config = {
        port: 9000,
        
        width: 21,
        height: 21,
        botsPerPlayer: 5,
        
        positions: {
            team1: {
                barrel: {x: 8, y: 9},
                bots: [{ x: 4, y: 18 },{ x: 7, y: 18 },{ x: 10, y: 18 },{ x: 13, y: 18 },{ x: 16, y: 18 }]
            },
            team2: {
                barrel: {x: 11, y: 9},
                bots: [{ x: 4, y: 2 },{ x: 7, y: 2 },{ x: 10, y: 2 },{ x: 13, y: 2 },{ x: 16, y: 2 }]
            },
        }
    };
    var manager = new SimulationManager(config);
    var uid = manager.createSimulation();
    
    manager.get("emitter").on("simulation-ready", function(simulationState){
        console.log("READY %j", simulationState);
    });
    
    manager.get("emitter").on("team1-turn", function(simulationState){
        console.log(">> TEAM1 %j", simulationState);
    });
    
    manager.get("emitter").on("team2-turn", function(simulationState){
        console.log(">> TEAM2 %j", simulationState);
    });
    
    var client1 = new Client({socket: {remoteAddress: "localhost",remotePort:"1111"}});
    manager.joinSimulation(uid, new PlayerData({
        nick: "gimli",
        playerId: "" + hat(),
        names: ["Dwarf1", "Dwarf2", "Dwarf3", "Dwarf4", "Dwarf5"],
        client: client1
    }));
    
    var client2 = new Client({socket: {remoteAddress: "localhost",remotePort:"2222"}});
    manager.joinSimulation(uid, new PlayerData({
        nick: "gloin",
        playerId: "" + hat(),
        names: ["Dwarf1", "Dwarf2", "Dwarf3", "Dwarf4", "Dwarf5"],
        client: client2 
    }));
    
    manager.sendTurn(client1, new SimulationTurn({
        actions: [
            new BotAction({botId: 1, type: BotAction.Types.MOVE, direction: BotAction.Directions.NORTH}),
            new BotAction({botId: 2, type: BotAction.Types.MOVE, direction: BotAction.Directions.NORTH}),
            new BotAction({botId: 3, type: BotAction.Types.MOVE, direction: BotAction.Directions.NORTH}),
            new BotAction({botId: 4, type: BotAction.Types.MOVE, direction: BotAction.Directions.NORTH}),
            new BotAction({botId: 5, type: BotAction.Types.MOVE, direction: BotAction.Directions.NORTH}),
        ]
    }));

    manager.sendTurn(client2, new SimulationTurn({
        actions: [
            new BotAction({botId: 6,  type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
            new BotAction({botId: 7,  type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
            new BotAction({botId: 8,  type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
            new BotAction({botId: 9,  type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
            new BotAction({botId: 10, type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
        ]
    }));
    
    console.log(manager.get("simulations")[uid].toString());
    console.log("%j", manager.getSimulationList());
}

module.exports = SimulationManager;