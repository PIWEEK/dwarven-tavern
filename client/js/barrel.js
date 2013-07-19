"use strict";

app.barrel = (function () {
    var barrelAnimation = {
        "vertical": [{ x: 0, y: 0, width: 32, height: 32}],
        "horizontal": [{ x: 32, y: 0, width: 32, height: 32}],
    };

    var barrelTeam1 = {};
    var barrelTeam2 = {};

    var createBarrelSprite = function(x, y, barrel){
        var position = app.grid.getXYGrid(x, y);

        return new Kinetic.Sprite({
            x: position.x,
            y: position.y,
            image: barrel,
            width: 32,
            height: 32,
            animation: "vertical",
            animations: barrelAnimation
        });
    };

    var initBarrel = function(team, barrelCoords, image) {
        team.sprite = createBarrelSprite(barrelCoords.x, barrelCoords.y, image);
        
        app.layer.add(team.sprite);

        team.sprite.start();
    };

    var initBarrelTeam1 = function() {
        if (app.turn.state.barrels.team1 && !barrelTeam1.sprite) {
            initBarrel(barrelTeam1, app.turn.state.barrels.team1.coords, app.img.barrelteam1);
        }
    };

    var initBarrelTeam2 = function() {
        if (app.turn.state.barrels.team2 && !barrelTeam2.sprite) {
            initBarrel(barrelTeam2, app.turn.state.barrels.team2.coords, app.img.barrelteam2);
        }
    }

    var initBarrels = function() {
        initBarrelTeam1();    
        initBarrelTeam2();
    };

    var barrelOrientation = function(newPosition, oldPosition) {
        if(oldPosition.x !== newPosition.x) {
            return "vertical";
        }else if(oldPosition.y !== newPosition.y) {
            return "horizontal";
        }
    };

    var updateTeamPosition = function(team, x, y) {
        team.x = x;
        team.y = y;
    };

    var createTween = function(sprite, x, y) {
        var tween = new Kinetic.Tween({
            node: sprite, 
            duration: 0.3,
            x: x,
            y: y
        });

        tween.play();
    };

    var moveBarrel = function(position, barrel) {
        var orientation = barrelOrientation(position, barrel);
        var newPosition = app.grid.getXYGrid(position.x, position.y);
        
        barrel.sprite.setAnimation(orientation);
        createTween(barrel.sprite, newPosition.x, newPosition.y);
    };

    var moveTeam1Barrels = function(){
        var barrel = app.turn.state.barrels.team1.coords;

        moveBarrel(barrel, barrelTeam1);
        updateTeamPosition(barrelTeam1, barrel.x, barrel.y);
    };

    var moveTeam2Barrels = function(){
        var barrel = app.turn.state.barrels.team2.coords;

        moveBarrel(barrel, barrelTeam2);
        updateTeamPosition(barrelTeam2, barrel.x, barrel.y);
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
