"use strict";

var backbone = require('backbone');


var Client = backbone.Model.extend({

    defaults: {
        socket: null,
        server: null
    },

    initialize: function(soc, srv) {
        this.socket = soc;
        this.server = srv;
    },

    dataProcess: function(data) {
        console.log('Received: ' + data);
        this.socket.write(data);
    },

    endConnection: function(socket) {
        console.log('bye!!\n');
        this.server.removeClient(this);
    }

});


module.exports = Client;
