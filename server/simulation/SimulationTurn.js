var _ = require('underscore'),
    BotAction = require('./BotAction'),
    Backbone = require('backbone');

var SimulationTurn = Backbone.Model.extend({
    defaults: {
        jsonContent: {},
        playerId: null,
        actions: null
    },

    initialize: function() {
        this.set("actions", []);
        this.set("playerId", this.get("jsonContent").playerId);

        this.buildActions(this.get("jsonContent").actions);
    },

    buildActions: function(jsonActions) {
        var self = this;

        _.each(jsonActions, function(action) {
            self.get("actions").push(new BotAction({
                botId: action.botId,
                type: action.type,
                direction: action.direction
            }));
        });
    },

    valid: function() {
        var valid = true;

        if (!this.get("playerId") || _.isEmpty(this.get("actions")))
            valid = false;

        _.each(this.get("actions"), function(action) {
            var moveAction = (action.get("botId") && (action.get("type") != "PASS") && _.has(BotAction.Types, action.get("type")) && _.has(BotAction.Directions, action.get("direction")));
            var passAction = (action.get("botId") && (action.get("type") == "PASS"));

            if (!moveAction && !passAction)
                valid = false;
        });

        return valid;
    }
});

module.exports = SimulationTurn;
