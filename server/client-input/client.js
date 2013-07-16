"use strict";

var Backbone = require('backbone');


var Client = Backbone.Model.extend({

    defaults: {
        socket: null,
        server: null
    },

    endConnection: function(socket) {
        console.log('++ Client Disconnected\n');
        this.get("server").removeClient(this);
    }

});


module.exports = Client;
