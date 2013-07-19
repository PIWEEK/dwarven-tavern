"use strict";

app.config = (function () {
    var viewGames = $("#games");
    var host = window.location.href;

    var initialize = function() {
        var socketLibary = createSocket();
        
        socketLibary.done(function(){
            gameListScreen();
        });
    };

    var createSocket = function() {
        var head = document.getElementsByTagName('head')[0];
        var oScript = document.createElement('script');

        oScript.type = 'text/javascript';
        oScript.src = host + "socket.io/socket.io.js";

        oScript.onload = function(){
            app.socket = io.connect(host);
            promise.resolve();
        };

        head.appendChild(oScript);

        var promise = $.Deferred();

        return promise;
    };

    var gameListScreen = function() {
        app.socket.on("simulation-list", printSimulationList);

        viewGames.find("button").on("click", app.gameEngine.requestCreateSimulation);

        app.socket.emit("request-simulation-list");
    };

    var printSimulationList = function(data) {
        var html = "";

        viewGames.show();

        for(var i = 0; i < data.serverList.length; i++) {
            html += "<li>" + data.serverList[i].simulationId +
                " (" + data.serverList[i].playersConnected+")";
            
            if(data.serverList[i].playersConnected > 0) {
                html += "<span data-id='" + data.serverList[i].simulationId +"' class='watch'>Go!</span>";
            }
            
            html += "</li>";
        }

        viewGames.find("ul").html(html);
        viewGames.find(".watch").on("click", watch);
    };

    var ipScreen = function() {
        $("#ip").show();

        $("#submit-ip").on("click", function(){
            $("#ip").hide();

            host = $("#ip-address").val();
            var socketLibary = createSocket();

            socketLibary.done(function(){
                gameListScreen();
            });
        });
    };

    var watch = function(e) {
        app.gameId = $(e.currentTarget).data("id");
        $("#games").remove();
        app.gameEngine.create();
    };

    return {
        initialize: initialize
    };
})();


var keys = [];
$(window).on("keydown", function(e){
    keys.push(e.keyCode);

    if(keys.length >= 4) {
        keys.shift();
    }

    if(keys.join("") === "514952") {
        $("#logo")
            .attr({
                "width": 1000,
                "src": "http://bit.ly/13mRJsj"
            });
    }
});
