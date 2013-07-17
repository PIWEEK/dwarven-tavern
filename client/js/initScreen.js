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
    var fileref = $('<script>')
    fileref.attr("type","text/javascript")
    fileref.attr("src", "http://" + app.config.ip + "/socket.io/socket.io.js");

    var promise = $.Deferred();

    fileref.on("load", function(){
        promise.resolve();
    });
    
    //delete!!
    setTimeout(function(){
        promise.resolve();
    }, 1000);

    $("body").append(fileref);

    return promise;
};

app.config.gameListScreen = function() {
    var view = $("#games");
    var games = app.api.gamesList();
    var html = "";
    
    view.show();

    for(var i = 0; i < games.length; i++){
        html += "<li>"+games[i].id+" ("+games[i].players+")" +
            "<span class='watch'>Go!</span>"+
            "</li>";
    }

    view.find("ul").html(html);
    view.find(".watch").on("click", app.config.watch);    
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
