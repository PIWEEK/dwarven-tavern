app.createGame = function() {
    /*
    var socket = io.connect('http://10.8.1.25:8080');

    socket.on('watch-response', function (data) {
        if(data.type === "ok"){
            socket.on('turn', function (data) {
                app.api.save(data);
            });
        }else{
            alert(data.message);
        }
    });

    socket.emit("watch-request");
    */

    $("#container").show();

    app.stage = new Kinetic.Stage({
        container: "container",
        width: 672,
        height: 672
    });

    app.layer = new Kinetic.Layer();

    app.loadImgs().done(function(){
        app.barrel.init();
        app.dwarf.init();

        app.stage.add(app.layer);

        app.play(0);
    });
};

app.config.init();
