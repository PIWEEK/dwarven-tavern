"use strict";

app.gameEngine = (function() {
    var firstTurn = true;
    var endedGame = false;
    var scores = {"team1": 0, "team2": 0};
    var pointsToWin = null;
    var interval = null;

    var createGame = function() {
        $("#game").show();

        app.stage = new Kinetic.Stage({
            container: "container",
            width: 672,
            height: 672
        });

        app.layer = new Kinetic.Layer();

        app.loadImgs().done(function(){
            app.socket.on('watch-response', watchResponse);

            app.play(100);
            app.socket.emit("watch-request", {id: app.gameId});

            createInterval();
        });
    };

    var watchResponse = function(data) {
        pointsToWin = data.pointsToWin;
        app.turn = data;
        
        app.dwarf.init();
        app.barrel.init();
        app.stage.add(app.layer);

        app.socket.on('turn', function (data) {
            app.turns.push(data);
        });

        app.socket.on('end-game', function (data) {
            endedGame = true;
            app.turns.push(data);
        });

        app.socket.on('player-score', function (data) {
            app.turns.push(data);
        });
    };

    var someoneWin = function(){
        if(scores.team1 === pointsToWin || scores.team2 === pointsToWin) {
            return true;
        } else {
            return false;
        }
    };

    var createInterval = function() {
        //turn every 400ms
        interval = setInterval(function() {
            processTurn();
        }, 400);
    };

    var requestCreateSimulation = function() {
        app.socket.emit('request-create-simulation');
    }

    var finishTheGame = function() {
        clearInterval(interval);
        showScores();

        setTimeout(function(){
            app.play(2);
        }, 500);
    };

    var showScores = function() {
        $("#team1-dwarf .points").text(scores.team1);
        $("#team2-dwarf .points").text(scores.team2);

        $("#dwarf-score").fadeIn();
    };

    var playerScore = function() {
        if(app.turn.team === "team1") {
            scores.team1++;
        }else{
            scores.team2++;
        }

        showScores();

        if(!someoneWin()) {
            clearInterval(interval);

            setTimeout(function(){
                app.play(130);
                $("#dwarf-score").hide();
                createInterval();
            }, 2000);
        }
    };

    var playTurn = function() {
        if(firstTurn) {
            app.barrel.init();
            app.dwarf.init();
            app.msgs.update();
            app.stage.add(app.layer);
            firstTurn = false;
        }else{
            app.barrel.move();
            app.dwarf.move();
            app.msgs.update();
        }
    };

    var processTurn = function() {
        if(app.turns.length) {
            app.turn = app.turns.shift();

            if(app.turn.winner && app.turn.loser) {
                finishTheGame();
            } else if(app.turn.type === "player-score") {
                playerScore();
            } else {
                playTurn();
            }
        }
    };

    return {
        requestCreateSimulation: requestCreateSimulation,
        create: createGame
    };
})();
