"use strict";

var Backbone = require("backbone"),
    _ = require("underscore"),
    BotAction = require("./BotAction");

var GridCellState = {
   EMPTY: 0,
   BOT: 1,
   BARREL: 2
};

var BotData = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: "",
        coords: { x: 0, y: 0 },
        life : 0,
        team: 0
    },
    
    move: function(grid, direction, width, height) {
        console.log("Moving: " + this.get("id") + " > " + direction);
        
        grid[this.get("coords").y][this.get("coords").x] = { state: GridCellState.EMPTY };
        
        switch(direction) {
            case BotAction.Directions.NORTH:
                this.get("coords").y -= 1;
                if (this.get("coords").y < 0) this.get("coords").y = 0;
                break;
            case BotAction.Directions.SOUTH:
                this.get("coords").y += 1;
                if (this.get("coords").y >= height) this.get("coords").y = height-1;
                break;
            case BotAction.Directions.EAST:
                this.get("coords").x += 1;
                if (this.get("coords").y < 0) this.get("coords").x = 0;
                break;
            case BotAction.Directions.WEST:
                this.get("coords").x -= 1;
                if (this.get("coords").y >= width) this.get("coords").x = width-1;
                break;
        }
        var teamId = this.get("team");
        var botId = this.get("id");
        grid[this.get("coords").y][this.get("coords").x] = { 
            state: GridCellState.BOT, 
            team: teamId,
            botId: botId
        };
    }
});

var Simulation = Backbone.Model.extend({
    defaults: {
        grid: null,
        barrels: {},
        bots: {}
    },
    
    initialize: function(){
        var width = this.get("width");
        var height = this.get("height");
        
        var grid = new Array();
        
        for(var row=0; row<height; row++) {
            grid[row] = new Array();
            for(var col=0; col<width; col++) {
                grid[row][col] = { state: GridCellState.EMPTY };
            }
        }
        this.set("grid", grid);
    },
    
    processTurn: function(team, actions) {
        console.log("processing turn " + actions.length);
        var bots = this.get("bots");
        var grid = this.get("grid");
        var width = this.get("width");
        var height = this.get("height");
        
        _.each(actions, function(botAction){
            if (botAction.get("type") === BotAction.Types.MOVE) {
                bots[botAction.get("botId")].move(grid, botAction.get("direction"), width, height);
            }
        });
    },
    
    currentState: function() {
        var grid = this.get("grid");
        var state = "";
        _.each(grid, function(row) {
            _.each(row, function(value) {
                if(value.state === GridCellState.EMPTY) {
                    state = state + "[  ]";
                } else if(value.state === GridCellState.BARREL) {
                    state = state + "[b" + value.team + "]";
                } else if(value.state === GridCellState.BOT) {
                    state = state + "[D" + value.team + "]";
                } else {
                    state = state + "[??]";
                }
            });
            state = state + "\n";
        });
        return state;
    },
    
    setTeam: function(teamId, barrelPos, botDataList) {
        var grid = this.get("grid");
        var bots = this.get("bots");
        
        grid[barrelPos.y][barrelPos.x] = { state: GridCellState.BARREL, team: teamId };
        _.each(botDataList, function(botData){
            botData.set("team", teamId);
            grid[botData.get("coords").y][botData.get("coords").x] = { 
                state: GridCellState.BOT, 
                team: teamId,
                botId: botData.id
            };
            bots[botData.get("id")] = botData;
        });
    }
});

if (require.main === module) {
    var simulation = new Simulation({width: 21, height: 21});
    
    simulation.setTeam(0, {x: 8, y: 9}, [
        new BotData({
            id: 1,
            name: "Rhun Diamondfighter",
            coords: { x: 4, y: 16 },
            life : 10
        }),
        new BotData({
            id: 2,
            name: "Balgairen Marble-Flame",
            coords: { x: 7, y: 16 },
            life : 10
        }),
        new BotData({
            id: 3,
            name: "Tavio Bluefeldspar",
            coords: { x: 10, y: 16 },
            life : 10
        }),
        new BotData({
            id: 4,
            name: "Caith Scarletjasper",
            coords: { x: 13, y: 16 },
            life : 10
        }),
        new BotData({
            id: 5,
            name: "Riagan Rubygold",
            coords: { x: 16, y: 16 },
            life : 10
        })
    ]);
    
    simulation.setTeam(1, {x: 11, y: 9}, [
        new BotData({
            id: 6,
            name: "Keenon Bismuth-Fulvous",
            coords: { x: 4, y: 2 },
            life : 10
        }),
        new BotData({
            id: 7,
            name: "Edmyg Earthyagate",
            coords: { x: 7, y: 2 },
            life : 10
        }),
        new BotData({
            botId: 8,
            name: "Brady Metaldwarf",
            coords: { x: 10, y: 2 },
            life : 10
        }),
        new BotData({
            botId: 9,
            name: "Tadd Talchief",
            coords: { x: 13, y: 2 },
            life : 10
        }),
        new BotData({
            name: "Ceithin Feldspardigger",
            coords: { x: 16, y: 2 },
            life : 10
        })
    ]);
    console.log(simulation.currentState());
    
    console.log("\n\n####################################################################################\n\n");
    
    simulation.processTurn(0, [
        new BotAction({botId: 1, type: BotAction.Types.MOVE, direction: BotAction.Directions.NORTH}),
        new BotAction({botId: 2, type: BotAction.Types.MOVE, direction: BotAction.Directions.EAST}),
        new BotAction({botId: 3, type: BotAction.Types.MOVE, direction: BotAction.Directions.WEST}),
        new BotAction({botId: 4, type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
        new BotAction({botId: 5, type: BotAction.Types.MOVE, direction: BotAction.Directions.NORTH}),
    ]);
    
    console.log(simulation.currentState());
}

module.exports = Simulation;