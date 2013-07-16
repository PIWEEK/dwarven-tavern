var _ = require('underscore'),
    BotAction = require('./BotAction'),
    Backbone = require('backbone');

var SimulationTurn = Backbone.Model.extend({
    defaults: {
        jsonContent: {},
        actions: null
    },

    initialize: function() {
        if(!_.isEmpty(this.get("jsonContent"))) {
            this.set("actions", []);
            this.buildActions(this.get("jsonContent").actions);
        }
    },

    buildActions: function(jsonActions) {
        var self = this;
        _.each(jsonActions, function(action) {
            self.get("actions").push(new BotAction({
                botId: action.botId,
                typeString: action.type,
                directionString: action.direction
            }));
        });
    },

    valid: function() {
        var valid = true;

        if (_.isEmpty(this.get("actions")))
            valid = false;

        _.each(this.get("actions"), function(action) {
            var moveAction = (action.get("botId") && (action.get("type") != BotAction.Types.PASS) && _.has(BotAction.Types, action.get("typeString")) && _.has(BotAction.Directions, action.get("directionString")));
            var passAction = (action.get("botId") && (action.get("type") == BotAction.Types.PASS));

            if (!moveAction && !passAction) {
            	valid = false;
            }
                
        });

        return valid;
    }
});

module.exports = SimulationTurn;
