app.stage = new Kinetic.Stage({
    container: "container",
    width: 672,
    height: 672
});

app.layer = new Kinetic.Layer();

app.loadImgs.done(function(){
    app.barrel.init();
    app.dwarf.init();

    app.stage.add(app.layer);
});
