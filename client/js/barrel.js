app.barrel = (function () {
    var defaultBarrel = {
        width: 32,
        height: 32
    };

    var initBarrels = function(){
        var barrel = new Kinetic.Image({
            x: app.grid.getXYGrid(app.width/2 + 2, app.height/2).x,
            y: app.grid.getXYGrid(10, 10).y,
            image: app.img.barrel,
            width: 32,
            height: 32
        });

        var barrel2 = new Kinetic.Image({
            x: app.grid.getXYGrid(app.width/2 - 2, app.height/2).x,
            y: app.grid.getXYGrid(10, 10).y,
            image: app.img.barrel,
            width: 32,
            height: 32
        });

        app.layer.add(barrel);
        app.layer.add(barrel2);
       
    };

    return {
        init: initBarrels
    };
})();
