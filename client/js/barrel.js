app.barrel = (function () {
    var barrelAnimation = {
        "vertical": [{ x: 0, y: 0, width: 32, height: 32}],
        "horizontal": [{ x: 32, y: 0, width: 32, height: 32}],
    };

    var barrelTeam1 = {};
    var barrelTeam2 = {};

    var createBarrelSprite = function(x, y){
        var position = app.grid.getXYGrid(x, y);

        return new Kinetic.Sprite({
            x: position.x,
            y: position.y,
            image: app.img.barrel,
            width: 32,
            height: 32,
            animation: "vertical",
            animations: barrelAnimation
        });
    };

    var initBarrelTeam1 = function(){
        var barrel = app.turn.state.barrels.team1.coords;

        barrelTeam1.sprite = createBarrelSprite(barrel.x, barrel.y);
        
        app.layer.add(barrelTeam1.sprite);
        barrelTeam1.sprite.start();
    };

    var initBarrelTeam2 = function(){
        var barrel = app.turn.state.barrels.team2.coords;

        barrelTeam2.sprite = createBarrelSprite(barrel.x, barrel.y);
        
        app.layer.add(barrelTeam2.sprite);
        barrelTeam2.sprite.start();
    }

    var initBarrels = function(){
        initBarrelTeam1();
        initBarrelTeam2();
    };

    var moveBarrel = function(position, barrel){
        if(barrel.x !== position.x) {
            barrel.sprite.setAnimation("vertical");
        }else if(barrel.y !== position.y) {
            barrel.sprite.setAnimation("horizontal");
        }

        var newPosition = app.grid.getXYGrid(position.x, position.y);

        var tween = new Kinetic.Tween({
            node: barrel.sprite, 
            duration: 0.3,
            x: newPosition.x,
            y: newPosition.y
        });

        tween.play();
    };

    var moveTeam1Barrels = function(){
        var barrel = app.turn.state.barrels.team1.coords;

        if(barrelTeam1.sprite === undefined) {
            initBarrelTeam1(barrel.x, barrel.y);
        } else {
            moveBarrel(barrel, barrelTeam1);
            
            barrelTeam1.x = barrel.x;
            barrelTeam1.y = barrel.y;
        }
    };

    var moveTeam2Barrels = function(){
        var barrel = app.turn.state.barrels.team2.coords;

        if(barrelTeam2.sprite === undefined) {
            initBarrelTeam2(barrel.x, barrel.y);
        } else {
            moveBarrel(barrel, barrelTeam2);
            
            barrelTeam2.x = barrel.x;
            barrelTeam2.y = barrel.y;
        }
    }

    var moveBarrels = function(){
        moveTeam1Barrels();
        moveTeam2Barrels();
    };

    return {
        init: initBarrels,
        move: moveBarrels,
        team1: barrelTeam1,
        team2: barrelTeam2
    };
})();
