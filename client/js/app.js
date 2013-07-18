app.createGame = function() {
    $("#game").show();

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
        
        app.socket.on('turn', function (data) {
            app.turns.push(data);
        });

        app.play(100);
    });

    //turn every 400ms
    setInterval(function() {
        app.processTurn();
    }, 400);
};

app.processTurn = function() {
    if(app.turns.length) {
        app.turn = app.turns.shift();

        if(app.firstTurn) {
            app.barrel.init();
            app.dwarf.init();
            app.msgs.update();

            app.stage.add(app.layer);
            app.firstTurn = false;
        }else{
            app.barrel.move();
            app.dwarf.move();
            app.msgs.update();
        }
    }
}

app.config.init();
