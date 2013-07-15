var Backbone = require('backbone');

var BotAction = Backbone.Model.extend({
	defaults: {
		botId: null,
		type: null,
		direction: null
	}
});

module.exports = BotAction;