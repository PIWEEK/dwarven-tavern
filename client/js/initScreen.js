app.config = {};

app.config.init = function(){
    app.config.ip = window.location.href;
    var socketLibary = app.config.createSocket();
    
    socketLibary.done(function(){
        app.config.gameListScreen();
    });
};

app.config.createSocket = function() {
    var head = document.getElementsByTagName('head')[0];
    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = /*"http://" +*/ app.config.ip + "socket.io/socket.io.js";
    console.log("SRC>> " + oScript.src);
    oScript.onload = function(){
        app.socket = io.connect(/*'http://'+*/ app.config.ip);
        promise.resolve();
    };

    head.appendChild(oScript);

    var promise = $.Deferred();

    return promise;
};

app.config.gameListScreen = function() {
    var view = $("#games");

    app.socket.on("simulation-list", function(data){
        var html = "";

        view.show();

        for(var i = 0; i < data.serverList.length; i++) {
            html += "<li>" + data.serverList[i].simulationId +
                " (" + data.serverList[i].playersConnected+")";
            
            if(data.serverList[i].playersConnected > 0) {
                html += "<span data-id='" + data.serverList[i].simulationId +"' class='watch'>Go!</span>";
            }
            
            html += "</li>";
        }

        view.find("ul").html(html);
        view.find(".watch").on("click", app.config.watch);
    });

    view.find("button").on("click", app.gameEngine.requestCreateSimulation);

    app.socket.emit("request-simulation-list");
};

app.config.ipScreen = function(){
    $("#ip").show();

    $("#submit-ip").on("click", function(){
        $("#ip").hide();

        app.config.ip = $("#ip-address").val();
        var socketLibary = app.config.createSocket();

        socketLibary.done(function(){
            app.config.gameListScreen();
        });
    });
};

app.config.watch = function(e) {
    app.gameId = $(e.currentTarget).data("id");
    $("#games").remove();
    app.gameEngine.create();
};

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
                "src": "https://lh6.googleusercontent.com/ZTXxEH7N0tYh49K_okYfRu411cP_iClqLvGMVa-o9sCuRJjjNqurL-oiW5Bxl0nnFA=w1600"
            });
    }
});
