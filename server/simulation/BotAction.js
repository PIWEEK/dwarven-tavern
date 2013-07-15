var Backbone = require('backbone');

var BotActionTypes = {
    MOVE: 0
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
    }
});

BotAction.Types = BotActionTypes,
BotAction.Directions = BotActionDirections,

module.exports = BotAction;
