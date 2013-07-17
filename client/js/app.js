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
        var turn = 0;

        app.socket.on('turn', function (data) {
            turn++;

            setTimeout(function(){
                console.log(data);
                app.turn = data;

                if(firstTurn) {
                    app.barrel.init();
                    app.dwarf.init();

                    app.stage.add(app.layer);
                    firstTurn = false;
                }else{
                    app.barrel.move();
                    app.dwarf.move();
                }
            }, turn * 1000);
        });

        app.play(0);
    });
};

app.config.init();
