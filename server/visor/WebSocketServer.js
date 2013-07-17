"use strict";

var Backbone = require('backbone'),
    socketio = require('socket.io'),
    _ = require('underscore');

var WebSocketServer = Backbone.Model.extend({
    defaults: {
        port: 8080,
        io: null,
        socketList: null
    },

    initialize: function() {
        this.set("socketList", []);
    },

    start: function(server) {
        var self = this;

        this.set("io", socketio.listen(server));

        this.get("io").sockets.on('connection', function(socket) {

            self.addSocket(socket);

            socket.on('disconnect', function() {
                self.removeSocket(socket);
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