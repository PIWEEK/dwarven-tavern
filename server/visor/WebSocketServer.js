"use strict";

var Backbone = require('backbone'),
    socketio = require('socket.io'),
    EventEmitter = require('events').EventEmitter,
    _ = require('underscore');

var WebSocketServer = Backbone.Model.extend({
    defaults: {
        port: 8080,
        io: null,
        socketList: null,
        emitter: null
    },

    initialize: function() {
        this.set("socketList", []);
        this.set("emitter", new EventEmitter());
    },

    start: function(server) {
        var self = this;

        this.set("io", socketio.listen(server));

        this.get("io").sockets.on('connection', function(socket) {

            self.addSocket(socket);

            socket.on('disconnect', function() {
                self.removeSocket(socket);
            });

            socket.on('request-simulation-list', function() {
                self.get("emitter").emit('simulation-list', socket);
            });

        });

        console.log('===== WebServer started! =====\n++ Listening on ' + this.get("port") + '...');
    },

    addSocket: function(socket) {
        this.get("socketList").push(socket);
    },

    removeSocket: function(socket) {
        this.set("socketList", _.without(this.get("socketList"), socket));
    },

    emitBroadcast: function(eventName, data) {
        _.each(this.get("socketList"), function(socket) {
            socket.emit(eventName, data);
        });
    }

});


module.exports = WebSocketServer;
