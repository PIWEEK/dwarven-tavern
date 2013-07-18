app.imgs = [
    {"key": "barrelteam1", "url": 'imgs/barrel-team1.png'},
    {"key": "barrelteam2", "url": 'imgs/barrel-team2.png'},
    {"key": "team1", "url": 'imgs/team1.png'},
    {"key": "team2", "url": 'imgs/team2.png'},
];

app.img = {};

app.loadImgs = function () {
    var countLoaded = 0;
    var promise = $.Deferred();

    var onload = function() {
        countLoaded++;

        if(countLoaded === app.imgs.length) {
            promise.resolve();
        }
    };

    var createImg = function(key, url){
        app.img[key] = new Image();
        app.img[key].src = url;
        app.img[key].onload = onload;
    };

    for(var i = 0; i < app.imgs.length; i++) {
        createImg(app.imgs[i].key, app.imgs[i].url);
    }

    return promise;
};
