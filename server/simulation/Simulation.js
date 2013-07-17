"use strict";

var Backbone = require("backbone"),
    _ = require("underscore"),
    BotAction = require("./BotAction"),
    BotData = require("./BotData"),
    BarrelData = require("./BarrelData");

var GridCellState = {
   EMPTY: 0,
   BOT: 1,
   BARREL: 2
};

var SimulationEventType  = {
    BOT_MOVE: 0,
    BARREL_HIT: 1,
    END_GAME: 2,
    SCORE: 3,
    BOT_HIT: 4,
};

var Simulation = Backbone.Model.extend({
    defaults: {
        grid: null,
        barrels: {},
        bots: {},
        currentTurn: 0,
        teams: null,
        simulationFinished: false
    },
    
    /**
     * Initialize the game grid with the heiht/width passed as parameters 
     */
    initialize: function(){
        var width = this.get("width"),
            height = this.get("height"),
            grid = new Array();
        
        for(var row=0; row<height; row++) {
            grid[row] = new Array();
            for(var col=0; col<width; col++) {
                grid[row][col] = { state: GridCellState.EMPTY };
            }
        }
        this.set("grid", grid);
        this.set("turnEvents", {});
        this.set("teams", []);
    },
    
    getTurnEvents: function(){
        var turn = this.get("currentTurn");
        if(this.get("turnEvents")[turn]) {
            return this.get("turnEvents")[turn];
        } else {
            return [];
        }
    },
    
    addTurnEvent: function(event){
        var turn = this.get("currentTurn");
        
        if(!this.get("turnEvents")[turn]) {
            this.get("turnEvents")[turn] = [];
        } 
        this.get("turnEvents")[turn].push(event);
    },
    
    /**
     * Process a turn with the list of actions passed as argument
     * @param actions list of BotAction that the simulation has to execute
     */
    processTurn: function(actions) {
        var bots = this.get("bots");
        var self = this;
        
        var currentTurn = this.get("currentTurn") + 1;
        this.set("currentTurn", currentTurn);
        
        _.each(actions, function(botAction){
            if (botAction.get("type") === BotAction.Types.MOVE) {
                if(bots[botAction.get("botId")]) {
                    self.moveBot(bots[botAction.get("botId")], botAction.get("direction"));
                } 
            }
        });

        // Check the barrels and to end the game
        var barrels = this.get("barrels");
        var teams = this.get("teams");
        
        if (barrels[teams[0]].get("coords").y == 0) {
            this.set("simulationFinished", true);
            this.set("loser", this.get("player1"));
            this.set("winner", this.get("player2"));
        }
        if (barrels[teams[1]].get("coords").y == this.get("height")-1) {
            this.set("simulationFinished", true);
            this.set("winner", this.get("player1"));
            this.set("loser", this.get("player2"));
        }
    },
    
    /**
     * Returns a String with the representation of the grid (testing only)
     * @returns {String}
     */
    toString: function() {
        var grid = this.get("grid");
        var simulationTeams = this.get("teams");
        var state = "";
        _.each(grid, function(row) {
            _.each(row, function(value) {
                var team = _.indexOf(simulationTeams, value.team) +1;
                if(value.state === GridCellState.EMPTY) {
                    state = state + "[  ]";
                } else if(value.state === GridCellState.BARREL) {
                    state = state + "[b" + team + "]";
                } else if(value.state === GridCellState.BOT) {
                    state = state + "[D" + team + "]";
                } else {
                    state = state + "[??]";
                }
            });
            state = state + "\n";
        });
        return state;
    },
    
    /**
     * Returns a String with the representation of the grid (testing only)
     * @returns {String}
     */
    getCurrentState: function() {
        var barrels = this.get("barrels"),
            bots = this.get("bots");
        
        var result = {
            barrels: barrels,
        };
        
        _.each(bots, function(botData){
            var team = botData.get("team");
            if(!result[team]) {
                result[team] = [];
            }
            result[team].push(botData);
        });
        
        return result;
    },
    
    /**
     * Set the team data inside the grid for the beginning of the simulation
     * @param teamId 0/1 for two teams
     * @param barrelPos Barrel position
     * @param botDataList List of the different bot data
     */
    setTeam: function(teamId, barrelPos, botDataList) {
        var grid = this.get("grid"),
            bots = this.get("bots"),
            barrels = this.get("barrels");
        
        // Set barrel data inside the simulator
        var barrelData = new BarrelData({ team: teamId, coords: barrelPos });
        grid[barrelPos.y][barrelPos.x] = { state: GridCellState.BARREL, team: teamId };
        barrels[teamId] = barrelData;
        
        // Start position for the different bots
        _.each(botDataList, function(botData){
            botData.set("team", teamId);
            grid[botData.get("coords").y][botData.get("coords").x] = { 
                state: GridCellState.BOT, 
                team: teamId,
                botId: botData.id
            };
            bots[botData.get("id")] = botData;
        });
        this.get("teams").push(teamId);
    },
    
    /**
     * Move the selected bot inside the grid simulation
     * @param botData
     * @param direction
     */
    moveBot: function(botData, direction) {
        var grid = this.get("grid"), 
            width = this.get("width"), 
            height = this.get("height"),
            teamId = botData.get("team"),
            botId = botData.get("id");
        
        var oldCoords = botData.get("coords"),
            newCoords = { x: oldCoords.x, y: oldCoords.y };
        
        switch(direction) {
            case BotAction.Directions.NORTH:
                newCoords.y -= 1;
                if (newCoords.y < 0) newCoords.y = 0;
                break;
                
            case BotAction.Directions.SOUTH:
                newCoords.y += 1;
                if (newCoords.y >= height) newCoords.y = height-1;
                break;
                
            case BotAction.Directions.EAST:
                newCoords.x += 1;
                if (newCoords.x >= width) newCoords.x = width-1;
                
                break;
                
            case BotAction.Directions.WEST:
                newCoords.x -= 1;
                if (newCoords.x < 0) newCoords.x = 0;
                break;
        }
        
        this.addTurnEvent({type: SimulationEventType.BOT_MOVE, message: botData.get("name") + " moves toward " + direction});
        
        // TODO: We should check conflicts
        
        // We empty the old grid data
        grid[oldCoords.y][oldCoords.x] = { 
            state: GridCellState.EMPTY 
        };
        
        if(grid[newCoords.y][newCoords.x].state == GridCellState.EMPTY) {
            // We put the new data on the related grid
            grid[newCoords.y][newCoords.x] = { 
                state: GridCellState.BOT, 
                team: teamId,
                botId: botId
            };
        } else if(grid[newCoords.y][newCoords.x].state == GridCellState.BARREL){
            this.moveBarrel(newCoords, direction);
            
            if(grid[newCoords.y][newCoords.x].state != GridCellState.EMPTY){
                // If we are unable to move the barrel, we stay in the same coord
                newCoords = oldCoords;
            } 
            grid[newCoords.y][newCoords.x] = { 
                state: GridCellState.BOT, 
                team: teamId,
                botId: botId
            };

        }
        
        // Update the bot data with the new coords
        botData.set("coords", newCoords);
    },
    
    /**
     * Move the barrel inside the grid simulation
     * @param botData
     * @param direction
     */
    moveBarrel: function(barrelCoords, direction) {
        var grid = this.get("grid"), 
            width = this.get("width"), 
            height = this.get("height"),
            bots = this.get("bots"),
            barrels = this.get("barrels"),
            oldCoords = barrelCoords,
            newCoords = { x: oldCoords.x, y: oldCoords.y },
            teamId = grid[oldCoords.y][oldCoords.x].team;
        
        switch(direction) {
            case BotAction.Directions.NORTH:
                newCoords.y -= 1;
                if (newCoords.y < 0) newCoords.y = 0;
                break;
                
            case BotAction.Directions.SOUTH:
                newCoords.y += 1;
                if (newCoords.y >= height) newCoords.y = height-1;
                break;
                
            case BotAction.Directions.EAST:
                newCoords.x += 1;
                if (newCoords.x >= width) newCoords.x = width-1;
                
                break;
                
            case BotAction.Directions.WEST:
                newCoords.x -= 1;
                if (newCoords.x < 0) newCoords.x = 0;
                break;
        }
        
        this.addTurnEvent({type: SimulationEventType.BOT_MOVE, message: "Barrel of team" + (teamId+1) + " moves toward " + direction});

        grid[oldCoords.y][oldCoords.x] = { state: GridCellState.EMPTY };
        if(grid[newCoords.y][newCoords.x].state == GridCellState.EMPTY) {
            grid[newCoords.y][newCoords.x] = { state: GridCellState.BARREL, team: teamId };
            barrels[teamId].coords = {x: newCoords.x, y: newCoords.y};
        } else if(grid[newCoords.y][newCoords.x].state == GridCellState.BARREL) {
            grid[oldCoords.y][oldCoords.x] = { state: GridCellState.BARREL, team: teamId };
            barrels[teamId].coords = {x: oldCoords.x, y: oldCoords.y};
        } else if(grid[newCoords.y][newCoords.x].state == GridCellState.BOT) {
            this.hitBot(bots[grid[newCoords.y][newCoords.x].botId], direction);
            
            if(grid[newCoords.y][newCoords.x].state != GridCellState.EMPTY){
                // If we are unable to "clean" de space, we stay where we were
                newCoords = oldCoords;
            } 
            grid[newCoords.y][newCoords.x] = { 
                state: GridCellState.BARREL, 
                team: teamId
            };
            barrels[teamId].coords = {x: newCoords.x, y: newCoords.y};
        }
    },
    
    /**
     * Method invoked when a barrel hits a bot. We resolve the conflicts inside the grid
     * @param botData
     * @param direction
     */
    hitBot: function(botData, direction) {
        var grid = this.get("grid"), 
            width = this.get("width"), 
            height = this.get("height"),
            teamId = botData.get("team"),
            botId = botData.get("id");
        
        this.addTurnEvent({type: SimulationEventType.BARREL_HIT, message: "Barrel of team" + (teamId+1) + " hit " + botData.get("name")});

        var oldCoords = botData.get("coords"),
            newCoords = { x: oldCoords.x, y: oldCoords.y };
        
        var kindOfHit = Math.floor(Math.random()*3);
    
        switch(direction) {
            case BotAction.Directions.NORTH:
                newCoords.y -= 1;
                if(kindOfHit == 0) { newCoords.x -= 1; } 
                else if (kindOfHit == 1) { newCoords.y -= 1; } 
                else { newCoords.x += 1; }
                break;
                
            case BotAction.Directions.SOUTH:
                newCoords.y += 1;
                if(kindOfHit == 0) { newCoords.x -= 1; } 
                else if (kindOfHit == 1) { newCoords.y += 1; } 
                else { newCoords.x += 1; }
                break;
                
            case BotAction.Directions.EAST:
                newCoords.x += 1;
                if(kindOfHit == 0) { newCoords.y -= 1; } 
                else if (kindOfHit == 1) { newCoords.x += 1; } 
                else { newCoords.y += 1; }
                break;
                
            case BotAction.Directions.WEST:
                newCoords.x -= 1;
                if(kindOfHit == 0) { newCoords.y -= 1; } 
                else if (kindOfHit == 1) { newCoords.x -= 1; } 
                else { newCoords.y += 1; }
                break;
        }
        
        if (newCoords.y < 0) newCoords.y = 0;
        if (newCoords.y >= height-1) newCoords.y = height-2;
        if (newCoords.x >= width-1) newCoords.x = width-2;                
        if (newCoords.x < 1) newCoords.x = 1;
        
        grid[oldCoords.y][oldCoords.x] = { state: GridCellState.EMPTY };
        
        if(grid[newCoords.y][newCoords.x].state == GridCellState.EMPTY) {
            // We put the new data on the related grid
            grid[newCoords.y][newCoords.x] = { 
                state: GridCellState.BOT, 
                team: teamId,
                botId: botId
            };
        } else if(grid[newCoords.y][newCoords.x].state == GridCellState.BARREL){
            this.moveBarrel(newCoords, direction);
            
            if(grid[newCoords.y][newCoords.x].state != GridCellState.EMPTY){
                // If we are unable to move the barrel, we stay in the same coord
                newCoords = oldCoords;
            } 
            grid[newCoords.y][newCoords.x] = { 
                state: GridCellState.BOT, 
                team: teamId,
                botId: botId
            };
        }
        
        // Update the bot data with the new coords
        botData.set("coords", newCoords);
    }
});

if (require.main === module) {
    var simulation = new Simulation({width: 21, height: 21});
    
    simulation.setTeam(0, {x: 8, y: 9}, [
        new BotData({
            id: 1,
            name: "Rhun Diamondfighter",
            coords: { x: 4, y: 18 },
        }),
        new BotData({
            id: 2,
            name: "Balgairen Marble-Flame",
            coords: { x: 7, y: 18 },
        }),
        new BotData({
            id: 3,
            name: "Tavio Bluefeldspar",
            coords: { x: 10, y: 18 },
        }),
        new BotData({
            id: 4,
            name: "Caith Scarletjasper",
            coords: { x: 13, y: 18 },
        }),
        new BotData({
            id: 5,
            name: "Riagan Rubygold",
            coords: { x: 16, y: 18 },
        })
    ]);
    
    simulation.setTeam(1, {x: 11, y: 9}, [
        new BotData({
            id: 6,
            name: "Keenon Bismuth-Fulvous",
            coords: { x: 4, y: 2 },
        }),
        new BotData({
            id: 7,
            name: "Edmyg Earthyagate",
            coords: { x: 7, y: 2 },
        }),
        new BotData({
            id: 8,
            name: "Brady Metaldwarf",
            coords: { x: 10, y: 2 },
        }),
        new BotData({
            id: 9,
            name: "Tadd Talchief",
            coords: { x: 13, y: 2 },
        }),
        new BotData({
            id: 10,
            name: "Ceithin Feldspardigger",
            coords: { x: 16, y: 2 },
        }),
        new BotData({
            id: 98,
            name: "Fulanito de tal",
            coords: { x: 8, y: 8 },
        }),
        new BotData({
            id: 99,
            name: "Fulanito de tal II",
            coords: { x: 8, y: 10 },
        })
    ]);
    console.log(simulation.toString());
    
    simulation.processTurn([
        new BotAction({botId: 1, type: BotAction.Types.MOVE, direction: BotAction.Directions.NORTH}),
        new BotAction({botId: 2, type: BotAction.Types.MOVE, direction: BotAction.Directions.EAST}),
        new BotAction({botId: 3, type: BotAction.Types.MOVE, direction: BotAction.Directions.WEST}),
        new BotAction({botId: 4, type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
        new BotAction({botId: 5, type: BotAction.Types.MOVE, direction: BotAction.Directions.NORTH}),
        new BotAction({botId: 6, type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
        new BotAction({botId: 7, type: BotAction.Types.MOVE, direction: BotAction.Directions.EAST}),
        new BotAction({botId: 8, type: BotAction.Types.MOVE, direction: BotAction.Directions.WEST}),
        new BotAction({botId: 9, type: BotAction.Types.MOVE, direction: BotAction.Directions.NORTH}),
        new BotAction({botId: 10, type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
        
        new BotAction({botId: 98, type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
    ]);

//    console.log("\n\n####################################################################################\n\n");
    console.log(simulation.toString());
//    console.log(JSON.stringify(simulation.getCurrentState(), undefined, 2));
    
//    console.log(JSON.stringify(simulation.getTurnEvents(1), undefined, 2));
    
}

module.exports = Simulation;