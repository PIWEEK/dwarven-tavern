var _ = require('underscore'),
    BotAction = require('./BotAction'),
    Backbone = require('backbone');

var SimulationTurn = Backbone.Model.extend({
    defaults: {
        jsonContent: {},
        playerId: null,
        actions: []
    },

    initialize: function() {
        this.set("playerId", this.get("jsonContent").playerId);

        this.buildActions(this.get("jsonContent").actions);
    },

    buildActions: function(jsonActions) {
        _.each(jsonActions, function(action) {
            this.actions.push(new BotAction({
                botId: action.botId,
                type: action.type,
                direction: action.direction
            }));
        });

        console.log('>> Acciones creadas');
        console.log(this.actions);
    }
});

module.exports = SimulationTurn;
