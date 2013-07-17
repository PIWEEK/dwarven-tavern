var Backbone = require('backbone');

var BotActionTypes = {
    MOVE: 0,
    PASS: 1
};

var BotActionDirections = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3
};

var BotAction = Backbone.Model.extend({
    defaults: {
        botId: null,
        type: null,
        direction: null
    },
    
    initialize: function() {
        if(this.get("typeString")) {
            if (this.get("typeString") == "MOVE") {
                this.set("type", BotActionTypes.MOVE);
            } else if (this.get("typeString") == "PASS") {
                this.set("type", BotActionTypes.PASS);
            }
        }
        
        if(this.get("directionString")) {
            if (this.get("directionString") == "NORTH") {
                this.set("direction", BotActionDirections.NORTH);
            } else if (this.get("directionString") == "SOUTH") {
                this.set("direction", BotActionDirections.SOUTH);
            } else if (this.get("directionString") == "EAST") {
                this.set("direction", BotActionDirections.EAST);
            } else if (this.get("directionString") == "WEST") {
                this.set("direction", BotActionDirections.WEST);
            } 
        }
    }

});

BotAction.Types = BotActionTypes,
BotAction.Directions = BotActionDirections,

module.exports = BotAction;
