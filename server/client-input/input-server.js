"use strict";

var net = require('net'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    Client = require('./client'),
    EventEmitter = require('events').EventEmitter;


var InputServer = Backbone.Model.extend({

    defaults: {
        port: 9000,
        server: null,
        emitter: new EventEmitter(),
        clients: []
    },

    initialize: function() {
        var self = this;

        this.set("server", net.createServer(function(socket) {
            console.log('New connection received!');

            var client = new Client({socket: socket, server: self});
            self.addClient(client);

            socket.on('data', function(data) {
                console.log('>> Data received: ' + data.toString());
                try {
                    var jsonContent = JSON.parse(data.toString());
                } catch(err) {
                    console.log('##### PARSER ERROR #####');
                    console.log(err);
                }

                if (typeof jsonContent !== 'undefined') self.get("emitter").emit('input-received', jsonContent, client);
            });

            socket.on('end', _.bind(client.endConnection, client));
        }));
    },

    start: function() {
        var self = this;

        this.get("server").listen(this.get("port"), function() {
            console.log('Listening on ' + self.get("port") + '...');
        });
    },

    addClient: function(client) {
        this.get("clients").push(client);
    },

    removeClient: function(client) {
        this.set("clients", _.without(this.clients, client));
    }

});


module.exports = InputServer;
