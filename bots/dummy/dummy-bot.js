/**
 * DUMMY BOT FOR DWARVEN TAVERN
 */
var net = require("net"),
    _ = require("underscore");

var simulationId = "6oojlb5";

var server = null;

var joinSimulation = function() {
    console.log ("CONNECTED >> Sending JOIN");
    var joinMessage = {
        "type" : "join-simulation",
        "nick" : "Dummy",
        "simulationId" : simulationId,
        "names" : [
            "Carawebo",
            "Pantuflo",
            "Chistaburras",
            "Pontato",
            "Jhonny Tablas"
        ]
    };
    server.write(JSON.stringify(joinMessage));
};

server = net.connect({port: 9000}, joinSimulation);

var targetY = 0;
var deffendingY = 0;
var myTeam = "";
var opponentTeam = "";


var getWantedBarrelPos = function(barrelPos, wantedY) {
    var x = barrelPos.x;
    var y = (barrelPos.y > wantedY)?barrelPos.y+1:barrelPos.y-1;
    return {x:x, y:y};
};

var isEqualPos = function(pos1, pos2) {
    return pos1.x == pos2.x && pos2.y == pos2.y;
};

var createActionMoveTo = function(bot, toPosition) {
    var direction;
    if(bot.coords.y < toPosition.y) {
        direction = "SOUTH";
    } else if(bot.coords.y > toPosition.y) { 
        direction = "NORTH";
    } else if(bot.coords.x < toPosition.x) {
        direction = "EAST";
    } else /*if(bot.coords.x > toPosition.x)*/ {
        direction = "WEST";
    }
 
    return { "botId": bot.id, "type": "MOVE", "direction": direction };
};

var runTurn = function(state) {
    var myTeamBarrel = null;
    var opponentBarrel = null;

    var attackers = [];
    var defenders = [];
    var variable = [];

    var actions = [];

    var executeBotAttacker = function(bot) {
        console.log(">> Attacker %j %d", bot, targetY);
        var wantedPos = getWantedBarrelPos(opponentBarrel, targetY);
        
        if(isEqualPos(bot.coords, wantedPos)) {
            actions.push(createActionMoveTo(bot, {x: bot.coords.x, y: targetY}));
        } else {
            actions.push(createActionMoveTo(bot, wantedPos));
        }
    };

    var executeBotDefender = function(bot) {
        console.log(">> Defender %j %d", bot, deffendingY);
        var wantedPos = getWantedBarrelPos(myTeamBarrel, deffendingY);
        
        if(isEqualPos(bot.coords, wantedPos)) {
            actions.push(createActionMoveTo(bot, {x: bot.coords.x, y: targetY}));
        } else {
            actions.push(createActionMoveTo(bot, wantedPos));
        }
    };

    var executeBotVariable = function(bot) {
        console.log(">> Variable %j", bot);
    };
    
    myTeamBarrel = state["barrels"][myTeam]["coords"];
    opponentBarrel = state["barrels"][opponentTeam]["coords"];
    console.log("BARRILES: %j, %j", myTeamBarrel, opponentBarrel);
    
    attackers = [ state[myTeam][0], state[myTeam][1], state[myTeam][4] ];
    _.each(attackers, executeBotAttacker);
    
    defenders = [ state[myTeam][2], state[myTeam][3] ];
    _.each(defenders, executeBotDefender);
    
    variable = [  ];
    _.each(variable, executeBotVariable);
    
    
    var turnMessage = {
        "type" : "player-turn",
        "actions": actions
    };
    
    server.write(JSON.stringify(turnMessage));
};

server.on("data", function(data) {
    console.log(">> " + data);
    var message = JSON.parse(data);
    
    if(message["type"] == "turn") {
        setTimeout(function(){runTurn(message["state"]);}, 500);
    } else if(message["type"] == "game-info") {
        myTeam = message["team"];
        if(message["team"] == "team1") {
            targetY = 0;
            deffendingY = message["height"];
            opponentTeam = "team2";
        } else {
            targetY = message["height"];
            deffendingY = 0;
            opponentTeam = "team1";
        }
        console.log("TARGET: " + targetY);
    } else if(message["type"] == "ready") {
        simulationId = message["simulationId"];
        joinSimulation();
    } else if(message["type"] == "error" && message["message"] == "Wrong simulation ID") {
        server.write(JSON.stringify({"type" : "create-simulation"}));
    } else {
        console.log("ENDING: %s", data);
        server.end();
    }
});

server.on("end", function() {
    console.log("END");
});

