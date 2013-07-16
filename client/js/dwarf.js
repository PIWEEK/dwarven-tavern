app.dwarf = (function () {
    var dwarfAnimation = {
        "top": [{ x: 0, y: 95, width: 29, height: 32}],
        "bottom": [{ x: 0, y: 0, width: 29, height: 32}]
    };

    var printDwarf = function(xGrid, yGrid, direction) {
        var position = app.grid.getXYGrid(xGrid, yGrid);

        var dwarf = new Kinetic.Sprite({
            x: position.x,
            y: position.y,
            image: app.img.team1,
            animation: direction,
            animations: dwarfAnimation
        });

        app.layer.add(dwarf);

        dwarf.start();
    };

    var initTeam1 =  function() {
        var dwarfsTeam1 = app.api.getTeam1Dwafs();

        for(var i = 0; i < dwarfsTeam1.length; i++) {
            printDwarf(dwarfsTeam1[i].x, dwarfsTeam1[i].y, "top");
        }

        var dwarfsTeam2 = app.api.getTeam2Dwafs();

        for(var i = 0; i < dwarfsTeam2.length; i++) {
            printDwarf(dwarfsTeam2[i].x, dwarfsTeam2[i].y, "bottom");
        }
    };

    var initDwarfs = function() {
        initTeam1();
    };

    return {
        init: initDwarfs
    };
})();
