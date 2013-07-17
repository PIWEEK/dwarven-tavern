var Backbone = require("backbone");

var BarrelData = Backbone.Model.extend({
    defaults: {
        team: null,
        coords: { x: 0, y: 0 }
    }
});

module.exports = BarrelData;