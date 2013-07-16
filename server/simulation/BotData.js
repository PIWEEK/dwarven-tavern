var Backbone = require("backbone");

var BotData = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: "",
        coords: { x: 0, y: 0 },
        team: 0
    }
});

module.exports = BotData;