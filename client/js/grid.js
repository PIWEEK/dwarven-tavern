app.grid = (function() {
    var box_width = 32;
    var box_height = 32;

    $("#team-1-area, #team-2-area").css("height", box_height);

    var getXYGrid = function(x, y) {
        var position = {};

        position.x = box_width * x;
        position.y = box_height * y ;

        return position;
    };

    var getPosXY = function(x, y) {
        var position = {};

        position.x = x / box_width;
        position.y = y / box_height;

        return position;
    };

    return {
        getXYGrid: getXYGrid,
        getPosXY: getPosXY
    };
})();
