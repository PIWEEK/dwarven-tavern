app.config = {};

app.config.init = function(){
    app.config.ipScreen();

    /*
      app.config.ip = 'ip';
      var socketLibary = app.config.createSocket();

      socketLibary.done(function(){
      app.config.gameListScreen();
      });
    */
};

app.config.createSocket = function() {
    var head = document.getElementsByTagName('head')[0]
    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = "http://" + app.config.ip + "/socket.io/socket.io.js";
    oScript.onload = function(){
        app.socket = io.connect('http://'+ app.config.ip);
        promise.resolve();
    };

    head.appendChild(oScript);

    var promise = $.Deferred();

    return promise;
};

app.config.gameListScreen = function() {    
    app.socket.on("simulation-list", function (data) {
        console.log(data);
/*
        app.api.saveGameList(data);

        var view = $("#games");
        var games = app.api.getGameList();
        var html = "";
        
        view.show();

        for(var i = 0; i < games.length; i++){
            html += "<li>"+games[i].id+" ("+games[i].players+")" +
                "<span class='watch'>Go!</span>"+
                "</li>";
        }

        view.find("ul").html(html);
        view.find(".watch").on("click", app.config.watch);  */
    });  

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

app.config.watch = function() {
    app.createGame();
    $("#games").remove();
};
