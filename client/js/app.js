app.createGame = function() {
    $("#game").show();

    app.stage = new Kinetic.Stage({
        container: "container",
        width: 672,
        height: 672
    });

    app.layer = new Kinetic.Layer();

    app.loadImgs().done(function(){
        app.socket.on('watch-response', function (data) {
            app.turn = data;
            
            app.dwarf.init();
            app.barrel.init();
            app.stage.add(app.layer);

        	app.socket.on('turn', function (data) {
            	app.turns.push(data);
        	});

        	app.socket.on('end-game', function (data) {
                app.endedGame = true;
                app.turns.push(data);
        	});

        	app.socket.on('player-score', function (data) {
                app.turns.push(data);
        	});
        });

        app.play(100);
        app.socket.emit("watch-request", {id: app.gameId});

        app.createInterval();
    });
};

app.endedGame = false;

app.createInterval = function() {
    //turn every 400ms
    app.interval = setInterval(function() {
        app.processTurn();
    }, 400);
};

app.requestCreateSimulation = function() {
    app.socket.emit('request-create-simulation');
}

app.finishTheGame = function() {
    clearInterval(app.interval);
    app.showScores();
};

app.showScores = function() {
    $("#team1-dwarf .points").text(app.scores.team1);
    $("#team2-dwarf .points").text(app.scores.team2);

    $("#dwarf-score").fadeIn();
};

app.scores = {"team1": 0, "team2": 0};

app.firstTurn = true;

app.processTurn = function() {
    if(app.turns.length) {
        app.turn = app.turns.shift();
        console.log(app.turn)
        if(app.turn.winner && app.turn.loser) {
            app.finishTheGame();
        } else if(app.turn.type === "player-score") {
            clearInterval(app.interval);

            if(app.turn.team === "team1") {
                app.scores.team1++;
            }else{
                app.scores.team2++;
            }

            if(app.endedGame && app.turns.length > 1) {
                app.showScores();

                setTimeout(function(){
                    $("#dwarf-score").hide();
                    app.createInterval();
                }, 2000);
            }
        } else {
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
}

app.config.init();
