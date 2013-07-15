var Backbone = require('backbone');

var SimulationTurn = Backbone.Model.extend({
	defaults: {
		jsonContent: {},
		playerId: null,
		actions: []
	},
	
	initialize: function(rawContent) {
		// TODO
	}
});

module.exports = SimulationTurn;