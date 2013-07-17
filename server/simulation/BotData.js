var Backbone = require("backbone");

var BotData = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: "",
        coords: { x: 0, y: 0 },
        team: null
    }
});

module.exports = BotData;