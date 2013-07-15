"use strict";

var net = require('net'),
    backbone = require('backbone'),
    _ = require('underscore'),
    Client = require('./client'),
    EventEmitter = require('events').EventEmitter;


var InputServer = backbone.Model.extend({

    defaults: {
        port: 9000,
        server: null,
        emitter: new EventEmitter(),
        clients: []
    },

    initialize: function(port) {
        this.port = port;
        this.clients = [];
        var self = this;

        this.server = net.createServer(function(socket) {
            console.log('New connection received!');

            var client = new Client(socket, self);
            self.addClient(client);

            socket.on('data', _.bind(client.dataProcess, client));
            socket.on('end', _.bind(client.endConnection, client));
        });
    },

    start: function() {
        var self = this;

        this.server.listen(this.port, function() {
            console.log('Listening on ' + self.port + '...');
        });
    },

    addClient: function(client) {
        this.clients.push(client);
        console.log('>> New client: ' + this.clients);
    },

    removeClient: function(client) {
        this.clients = _.without(this.clients, client);
    }

});


module.exports = InputServer;
