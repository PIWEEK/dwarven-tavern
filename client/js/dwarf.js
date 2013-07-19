"use strict";

//team 1 bottom dwarfs
//team 2 top dwarfs

app.dwarf = (function () {
    var dwarfAnimation = {
        "top": [{ x: 0, y: 96, width: 29, height: 32}],
        "bottom": [{ x: 0, y: 0, width: 29, height: 32}],
        "left": [{ x: 0, y: 32, width: 29, height: 32}],
        "right": [{ x: 0, y: 64, width: 29, height: 32}],
        "walktop": [
            { x: 0, y: 96, width: 29, height: 32},
            { x: 33, y: 96, width: 29, height: 32},
            { x: 66, y: 96, width: 29, height: 32}
        ],
        "walkbottom": [
            { x: 0, y: 0, width: 29, height: 32},
            { x: 33, y: 0, width: 29, height: 32},
            { x: 66, y: 0, width: 29, height: 32}
        ],
        "walkleft": [
            { x: 0, y: 32, width: 29, height: 32},
            { x: 33, y: 32, width: 29, height: 32},
            { x: 66, y: 32, width: 29, height: 32}
        ],
        "walkright": [
            { x: 0, y: 64, width: 29, height: 32},
            { x: 33, y: 64, width: 29, height: 32},
            { x: 66, y: 64, width: 29, height: 32}
        ]
    };

    var dwarfs = [];
    var team1Loaded = false;
    var team2Loaded = false;

    var printDwarf = function(id, xGrid, yGrid, direction, image) {
        var position = app.grid.getXYGrid(xGrid, yGrid);
        var dwarf = {"id": id};

        dwarf.sprite = new Kinetic.Sprite({
            x: position.x,
            y: position.y,
            image: image,
            animation: direction,
            animations: dwarfAnimation
        });

        dwarfs.push(dwarf);
        app.layer.add(dwarf.sprite);
        dwarf.sprite.start();
    };

    var searchDwarf = function(id) {
        for(var i = 0; i < dwarfs.length; i++) {
            if(dwarfs[i].id === id) {
                return dwarfs[i];
            }
        }

        return false;
    };

    var initTeam = function(team, direction, teamImage) {
        for(var i = 0; i < team.length; i++) {
            printDwarf(team[i].id, team[i].coords.x, team[i].coords.y, direction, teamImage);
        }
    }

    var initTeam1 =  function() {
        if(app.turn.state.team1 && !team1Loaded) {
            var dwarfsTeam1 =  app.turn.state.team1;

            initTeam(dwarfsTeam1, "top", app.img.team1);

            app.history.team1 = dwarfsTeam1;
            team1Loaded = true;
        }
    };

    var initTeam2 = function() {
        if(app.turn.state.team2 && !team2Loaded) {
            var dwarfsTeam2 = app.turn.state.team2;

            initTeam(dwarfsTeam2, "bottom", app.img.team2);

            app.history.team2 = dwarfsTeam2;
            team2Loaded = true;
        }
    };

    var createTween = function(sprite, x, y, direction) {
        sprite.setAnimation("walk" + direction);

        var tween = new Kinetic.Tween({
            node: sprite,
            duration: 0.3,
            x: x,
            y: y,
            onFinish: function() {
                sprite.setAnimation(direction);
            }
        });

        tween.play();
    };

    var moveDward = function(dwarfNew, direction) {
        var dwarf = searchDwarf(dwarfNew.id);
        var newPosition = app.grid.getXYGrid(dwarfNew.coords.x, dwarfNew.coords.y);
     
        createTween(dwarf.sprite, newPosition.x, newPosition.y, direction);
    };

    var orientationDwarf = function(newPosition, oldPosition) {
        if(newPosition.x !== oldPosition.x) {
            if(oldPosition.x > newPosition.x) {
                return "left";
            } else {
                return "right";
            }
        }else if (newPosition.y !== oldPosition.y) {
            if(oldPosition.y > newPosition.y) {
                return "top";
            } else if(oldPosition.y < newPosition.y) {
                return "bottom";
            }
        }

        return false;
    };

    var updateDwarf = function(dwarf, teamHistory) {
        var orientation = null;

        for(var z = 0; z < teamHistory.length; z++) {
            if(dwarf.id === teamHistory[z].id) {
                orientation = orientationDwarf(dwarf.coords, teamHistory[z].coords);

                if(orientation) {
                    moveDward(dwarf, orientation);
                }
            }
        }
    };

    var moveTeam = function(team, teamHistory) {
        for(var i = 0; i < team.length; i++) {
            updateDwarf(team[i], teamHistory);
        }
    };

    var moveTeam1 = function() {
        var dwarfsTeam1 = app.turn.state.team1;

        moveTeam(dwarfsTeam1, app.history.team1);
        app.history.team1 = dwarfsTeam1;
    };


    var moveTeam2 = function() {
        var dwarfsTeam2 = app.turn.state.team2;

        moveTeam(dwarfsTeam2, app.history.team2);
        app.history.team2 = dwarfsTeam2;
    };

    var initDwarfs = function() {
        initTeam1();
        initTeam2();
    };

    var moveDwarfs = function() {
        moveTeam1();
        moveTeam2();
    };

    return {
        init: initDwarfs,
        move: moveDwarfs,
        search: searchDwarf
    };
})();
