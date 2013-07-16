//team 1 bottom dwarfs
//team 2 top dwarfs

app.dwarf = (function () {
    var dwarfAnimation = {
        "top": [{ x: 0, y: 95, width: 29, height: 32}],
        "bottom": [{ x: 0, y: 0, width: 29, height: 32}],
        "left": [{ x: 0, y: 32, width: 29, height: 32}],
        "right": [{ x: 0, y: 64, width: 29, height: 32}],
        "walktop": [
            { x: 0, y: 95, width: 29, height: 32},
            { x: 33, y: 95, width: 29, height: 32},
            { x: 66, y: 95, width: 29, height: 32}            
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
    };

    var initTeam = function(team, direction, teamImage) {
        for(var i = 0; i < team.length; i++) {
            printDwarf(team[i].id, team[i].x, team[i].y, direction, teamImage);
        }
    }

    var initTeam1 =  function() {
        var dwarfsTeam1 = app.api.getTeam1Dwafs();

        initTeam(dwarfsTeam1, "top", app.img.team1);

        app.history.team1 = dwarfsTeam1;
    };

    var initTeam2 = function() {
        var dwarfsTeam2 = app.api.getTeam2Dwafs();

        initTeam(dwarfsTeam2,  "bottom", app.img.team2);

        app.history.team2 = dwarfsTeam2;
    };

    var moveDward = function(dwarfNew, direction) {
        var dwarf = searchDwarf(dwarfNew.id);

        dwarf.sprite.setAnimation("walk" + direction);;

        var newPosition = app.grid.getXYGrid(dwarfNew.x, dwarfNew.y);

        var tween = new Kinetic.Tween({
            node: dwarf.sprite, 
            duration: 0.3,
            x: newPosition.x,
            y: newPosition.y,
            onFinish: function() {
                dwarf.sprite.setAnimation(direction);
            }
        });

        tween.play();
    };

    var updateDwarf = function(dwarf, teamHistory) {
        for(var z = 0; z < teamHistory.length; z++) {
            if(dwarf.id === teamHistory[z].id) {
                if(dwarf.x !== teamHistory[z].x){
                    if(teamHistory[z].x > dwarf.x) {
                        moveDward(dwarf, "left");
                    }else {
                        moveDward(dwarf, "right");
                    }
                }else if (dwarf.y !== teamHistory[z].y){
                    if(teamHistory[z].y > dwarf.y) {
                        moveDward(dwarf, "top");
                    }else if(teamHistory[z].y < dwarf.y) {
                        moveDward(dwarf, "bottom");
                    }
                }
            }
        }        
    };

    var moveTeam1 = function() {
        var dwarfsTeam1 = app.api.getTeam1Dwafs();

        for(var i = 0; i < dwarfsTeam1.length; i++) {
            updateDwarf(dwarfsTeam1[i], app.history.team1);
        }

        app.history.team1 = dwarfsTeam1;
    };


    var moveTeam2 = function() {
        var dwarfsTeam2 = app.api.getTeam2Dwafs();

        for(var i = 0; i < dwarfsTeam2.length; i++) {
            updateDwarf(dwarfsTeam2[i], app.history.team2);
        }

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
        move: moveDwarfs
    };
})();
