app.api = {};

var countt1 = 0;
var countt2 = 0;

app.api.getTeam1Dwafs = function(){
    countt1++;

    if(countt1 == 1){
        return [
            {id: 1, x: 20, y: 20},
            {id: 2, x: 19, y: 20},
            {id: 3, x: 18, y: 20},
            {id: 4, x: 17, y: 20},
            {id: 5, x: 16, y: 20}
        ];
    }

    if(countt1 == 2){
        return [
            {id: 1, x: 20, y: 19},
            {id: 2, x: 19, y: 19},
            {id: 3, x: 18, y: 19},
            {id: 4, x: 17, y: 19},
            {id: 5, x: 15, y: 20}
        ];
    }
};

app.api.getTeam2Dwafs = function(){
    countt2++;

    if(countt2 == 1){
        return [
            {id: 6, x: 20, y: 0},
            {id: 7, x: 19, y: 0},
            {id: 8, x: 18, y: 0},
            {id: 9, x: 17, y: 0},
            {id: 10, x: 16, y: 0}
        ];
    }

    if(countt2 == 2){
        return [
            {id: 6, x: 20, y: 1},
            {id: 7, x: 19, y: 1},
            {id: 8, x: 18, y: 1},
            {id: 9, x: 17, y: 1},
            {id: 10, x: 16, y: 1}
        ];
    }
};


updatePosition = function(){
    app.dwarf.move();
};
