app.stage = new Kinetic.Stage({
    container: "container",
    width: 640,
    height: 640
});

app.layer = new Kinetic.Layer();

app.loadImgs.done(function(){
    app.barrel.init();

    app.stage.add(app.layer);
});
