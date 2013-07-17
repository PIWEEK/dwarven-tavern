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

        this.set("io", socketio.listen(this.get("port")));
    },

    start: function() {
        var self = this;

        this.get("io").sockets.on('connection', function(socket) {

            self.addSocket(socket);

            socket.on('disconnect', function() {
                self.removeSocket(socket);
            });

        });
    },

    addSocket: function(socket) {
        console.log('===== WebSocketServer started! =====\n++ Listening on ' + this.get("port") + '...');
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
