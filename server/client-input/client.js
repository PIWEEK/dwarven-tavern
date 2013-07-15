"use strict";

var Backbone = require('backbone');


var Client = Backbone.Model.extend({

    defaults: {
        socket: null,
        server: null
    },

    initialize: function(soc, srv) {
        this.set("socket", soc);
        this.set("server", srv);
    },

    endConnection: function(socket) {
        console.log('bye!!\n');
        this.get("server").removeClient(this);
    }

});


module.exports = Client;
