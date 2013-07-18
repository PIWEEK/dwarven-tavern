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
        emitter: null,
        rooms: null
    },

    initialize: function() {
        this.set("socketList", []);
        this.set("rooms", {});
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

            socket.on('watch-request', function(data) {
                console.log('>>> Me llega un watch request');
                console.log(' >> rooms: ' + _.keys(self.get("rooms")));
                var rooms = self.get("rooms");

                if (!_.has(rooms, data.id)) {
                    rooms[data.id] = [];
                    self.set("rooms", rooms);
                }

                rooms[data.id].push(socket);
                self.set("rooms", rooms);
                console.log('>>> Tras añadirlo, tenemos');
                console.log(' >> rooms: ' + _.keys(self.get("rooms")));
                //console.log(' >> ' + this.get("rooms")[0]);

                socket.emit('watch-response', '{"type", "ok"}');
            });

        });

        console.log('===== WebServer started! =====\n++ Listening on ' + this.get("port") + '...');
    },

    addSocket: function(socket) {
        this.get("socketList").push(socket);
    },

    removeSocket: function(socket) {
        this.set("socketList", _.without(this.get("socketList"), socket));

        console.log('>>> Se va un socket');
        console.log(' >> rooms: ' + _.keys(this.get("rooms")));
        console.log(' >> ' + this.get("rooms")[0]);

        var rooms = this.get("rooms");
        _.each(_.keys(rooms), function(room) {
            if(_.indexOf(rooms.room, socket) !== -1) {
                var roomToChange = room;
            }
        });

        if (typeof roomToChange !== undefined) {
            rooms.roomToChange = _.without(rooms.roomToChange, socket);

            this.set("rooms", rooms);
            console.log('>>> Tras eliminarlo, tenemos');
            console.log(' >> rooms: ' + _.keys(this.get("rooms")));
            console.log(' >> ' + this.get("rooms")[0]);
        }
    },

    emitBroadcast: function(eventName, data) {
        _.each(this.get("socketList"), function(socket) {
            socket.emit(eventName, data);
        });
    }

});


module.exports = WebSocketServer;
