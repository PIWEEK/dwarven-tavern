app.createGame = function() {
    $("#container").show();

    app.stage = new Kinetic.Stage({
        container: "container",
        width: 672,
        height: 672
    });

    app.layer = new Kinetic.Layer();

    app.loadImgs().done(function(){
        /*app.socket.on('watch-response', function (data) {

        });
        app.socket.emit("watch-request", {id: app.gameId});*/
        
        
        var firstTurn = true;

        app.socket.on('turn', function (data) {
            app.turn = data;

            if(firstTurn) {
                app.barrel.init();

                app.stage.add(app.layer);
                firstTurn = false;
            }else{
                app.barrel.move();
                app.dwarf.move();
            }
        });

        app.play(0);
    });
};

app.config.init();
