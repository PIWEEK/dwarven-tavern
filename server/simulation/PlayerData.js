var Backbone = require("backbone");

var PlayerData = Backbone.Model.extend({
    defaults: {
        nick: null,
        playerId: null,
        names: null
    }
});

module.exports = PlayerData;