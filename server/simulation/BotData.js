var Backbone = require("backbone");

var BotData = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: "",
        coords: { x: 0, y: 0 },
        team: null
    },
    
    cloneData: function() {
        return new BotData({
            id: this.get("id"),
            name: this.get("name"),
            team: this.get("team"),
            coords: { x: this.get("coords").x, y: this.get("coords").y }
        });
    }
});

module.exports = BotData;