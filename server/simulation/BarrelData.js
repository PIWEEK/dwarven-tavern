var Backbone = require("backbone");

var BarrelData = Backbone.Model.extend({
    defaults: {
        team: 0,
        coords: { x: 0, y: 0 }
    }
});

module.exports = BarrelData;