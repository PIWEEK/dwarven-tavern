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
        var bots = this.get("bots");
        var self = this;
        
        _.each(actions, function(botAction){
            if (botAction.get("type") === BotAction.Types.MOVE) {
            	self.moveBot(bots[botAction.get("botId")], botAction.get("direction"));
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
    },
    
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
                if (botData.get("coords").y < 0) newCoords.y = 0;
                break;
                
            case BotAction.Directions.SOUTH:
            	newCoords.y += 1;
                if (newCoords.y >= height) newCoords.y = height-1;
                break;
                
            case BotAction.Directions.EAST:
            	newCoords.x += 1;
                if (newCoords.x < 0) newCoords.x = 0;
                break;
                
            case BotAction.Directions.WEST:
            	newCoords.x -= 1;
                if (newCoords.x >= width) newCoords.x = width-1;
                break;
        }
        
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
        	
        	if(grid[newCoords.y][newCoords.x].state == GridCellState.BARREL){
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
    
    moveBarrel: function(barrelCoords, direction) {
    	var grid = this.get("grid"), 
			width = this.get("width"), 
			height = this.get("height"),
			oldCoords = barrelCoords,
    		newCoords = { x: oldCoords.x, y: oldCoords.y },
    		teamId = grid[oldCoords.y][oldCoords.x].team;
    
	    switch(direction) {
	        case BotAction.Directions.NORTH:
	        	newCoords.y -= 1;
	            if (botData.get("coords").y < 1) newCoords.y = 1;
	            break;
	            
	        case BotAction.Directions.SOUTH:
	        	newCoords.y += 1;
	            if (newCoords.y >= height-1) newCoords.y = height-2;
	            break;
	            
	        case BotAction.Directions.EAST:
	        	newCoords.x += 1;
	            if (newCoords.x < 1) newCoords.x = 1;
	            break;
	            
	        case BotAction.Directions.WEST:
	        	newCoords.x -= 1;
	            if (newCoords.x >= width-1) newCoords.x = width-2;
	            break;
	    }
	    
	    grid[oldCoords.y][oldCoords.x] = { state: GridCellState.EMPTY };
	    grid[newCoords.y][newCoords.x] = { state: GridCellState.BARREL, team: teamId };
    }
});

if (require.main === module) {
    var simulation = new Simulation({width: 21, height: 21});
    
    simulation.setTeam(0, {x: 8, y: 9}, [
        new BotData({
            id: 1,
            name: "Rhun Diamondfighter",
            coords: { x: 4, y: 18 },
            life : 10
        }),
        new BotData({
            id: 2,
            name: "Balgairen Marble-Flame",
            coords: { x: 7, y: 18 },
            life : 10
        }),
        new BotData({
            id: 3,
            name: "Tavio Bluefeldspar",
            coords: { x: 10, y: 18 },
            life : 10
        }),
        new BotData({
            id: 4,
            name: "Caith Scarletjasper",
            coords: { x: 13, y: 18 },
            life : 10
        }),
        new BotData({
            id: 5,
            name: "Riagan Rubygold",
            coords: { x: 16, y: 18 },
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
            id: 8,
            name: "Brady Metaldwarf",
            coords: { x: 10, y: 2 },
            life : 10
        }),
        new BotData({
        	id: 9,
            name: "Tadd Talchief",
            coords: { x: 13, y: 2 },
            life : 10
        }),
        new BotData({
        	id: 10,
            name: "Ceithin Feldspardigger",
            coords: { x: 16, y: 2 },
            life : 10
        }),
        new BotData({
        	id: 99,
            name: "Fulanito de tal",
            coords: { x: 8, y: 8 },
            life : 10
        })
    ]);
    console.log(simulation.currentState());
    
    simulation.processTurn(0, [
        new BotAction({botId: 1, type: BotAction.Types.MOVE, direction: BotAction.Directions.NORTH}),
        new BotAction({botId: 2, type: BotAction.Types.MOVE, direction: BotAction.Directions.EAST}),
        new BotAction({botId: 3, type: BotAction.Types.MOVE, direction: BotAction.Directions.WEST}),
        new BotAction({botId: 4, type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
        new BotAction({botId: 5, type: BotAction.Types.MOVE, direction: BotAction.Directions.NORTH}),
    ]);

    console.log("\n\n####################################################################################\n\n");
    console.log(simulation.currentState());

    simulation.processTurn(1, [
       new BotAction({botId: 6, type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
       new BotAction({botId: 7, type: BotAction.Types.MOVE, direction: BotAction.Directions.EAST}),
       new BotAction({botId: 8, type: BotAction.Types.MOVE, direction: BotAction.Directions.WEST}),
       new BotAction({botId: 9, type: BotAction.Types.MOVE, direction: BotAction.Directions.NORTH}),
       new BotAction({botId: 10, type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
       
       new BotAction({botId: 99, type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
       new BotAction({botId: 99, type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
       new BotAction({botId: 99, type: BotAction.Types.MOVE, direction: BotAction.Directions.SOUTH}),
   ]);

    console.log("\n\n####################################################################################\n\n");
    console.log(simulation.currentState());
    
}

module.exports = Simulation;