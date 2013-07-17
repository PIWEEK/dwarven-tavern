app.api = {};

var countt1 = 0;
var countt2 = 0;

app.simulateMove = function(dwarf){
    var item = {};
    item.id = dwarf.id;
    var position = app.grid.getPosXY(dwarf.sprite.getX(), dwarf.sprite.getY());

    item.x = position.x;
    item.y = position.y;

    var moves = [];

    if(position.x !== 0){
        moves.push("top");
    }

    if(position.x !== app.width-1){
        moves.push("bottom");
    }

    if(position.y !== 0){
        moves.push("left");
    }

    if(position.y !== app.height-1){
        moves.push("right");
    }

    var randomnumber = Math.floor(Math.random()*moves.length);

    if(moves[randomnumber] === "top"){
        item.x--;
    }else if(moves[randomnumber] === "bottom"){
        item.x++;
    }else if(moves[randomnumber] === "left"){
        item.y--;
    }else if(moves[randomnumber] === "right"){
        item.y++;
    }

    return item;
};

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
    }else{
        var dwarf = null;
        var result = [];

        for(var i = 0; i < app.history.team1.length; i++){
            dwarf = app.dwarf.search(app.history.team1[i].id);

            result.push(app.simulateMove(dwarf));
        }

        return result;
    }
}

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
    }else{
        var dwarf = null;
        var result = [];

        for(var i = 0; i < app.history.team2.length; i++){
            dwarf = app.dwarf.search(app.history.team2[i].id);

            result.push(app.simulateMove(dwarf));
        }

        return result;
    }
};

app.simulateMoveBarrel = function(team){
    var item = {};
    var position = {};
    
    position.x = team.x;
    position.y = team.y;

    item.x = position.x;
    item.y = position.y;

    var moves = [];

    if(position.x !== 0){
        moves.push("top");
    }

    if(position.x !== app.width-1){
        moves.push("bottom");
    }

    if(position.y !== 0){
        moves.push("left");
    }

    if(position.y !== app.height-1){
        moves.push("right");
    }

    var randomnumber = Math.floor(Math.random()*moves.length);

    if(moves[randomnumber] === "top"){
        item.x--;
    }else if(moves[randomnumber] === "bottom"){
        item.x++;
    }else if(moves[randomnumber] === "left"){
        item.y--;
    }else if(moves[randomnumber] === "right"){
        item.y++;
    }

    return item;
}

app.api.getTeam1Barrel = function(){
    return app.simulateMoveBarrel(app.barrel.team1);
};

app.api.getTeam2Barrel = function(){
    return app.simulateMoveBarrel(app.barrel.team2);
};

app.update = function(){
    app.dwarf.move();
    app.barrel.move();
};

app.api.gamesList = function(){
    return [
        {id: 1001, players: 2},
        {id: 1002, players: 1},
        {id: 1003, players: 0},
        {id: 1004, players: 2},
        {id: 1005, players: 2},
        {id: 1006, players: 1},
        {id: 1007, players: 2},
        {id: 1008, players: 1},
        {id: 1009, players: 0},
        {id: 1010, players: 2},
        {id: 1011, players: 2},
        {id: 1012, players: 1},
        {id: 1013, players: 2},
        {id: 1014, players: 2},
        {id: 1015, players: 1},
        {id: 1016, players: 2},
        {id: 1017, players: 2},
        {id: 1018, players: 1},
    ];
}
