"use strict";

var net = require('net'),
    backbone = require('backbone'),
    EventEmitter = require('events').EventEmitter;

var InputServer = backbone.Model.extend({

    defaults: {
        port: 9000,
        server: null,
        emitter: new EventEmitter()
    },

    initialize: function(port) {

        this.port = port;

        this.server = net.createServer(function(socket) {

            console.log('New connection received!');

            socket.on('data', function(data) {
                console.log('Received: ' + data);
                socket.write(data);
            });

            socket.on('end', function() {
                console.log('bye!!\n');
            });

        });

    },

    start: function() {

        var self = this;

        this.server.listen(this.port, function() {
            console.log('Listening on ' + self.port + '...');
        });

    }

});

module.exports = InputServer;
