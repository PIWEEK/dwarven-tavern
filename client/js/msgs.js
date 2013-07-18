app.msgs = (function () {
    var soundsEnabled = true;

    var showMsg = function(elm, time) {
        setTimeout(function(){
            elm.fadeIn(function(){
                $(this).removeClass("hide");
            });
        }, time);
    };

    var insertMsgs = function() {
        var html = "";
        var moveType = 0;
        var sound = null;

        for(var i = 0; i < app.turn.messages.length; i++) {
            if(app.turn.messages[i].type !== moveType) {
                sound = app.turn.messages[i].type;
                html += "<li class='hide'>" + app.turn.messages[i].message + "</li>";
            }
        }

        $("#msgs ul").prepend(html);

        if(soundsEnabled && sound) {
            app.play(sound);
        }
    };

    var fadeMsgs = function() {
        var hides = $("#msgs .hide");

        //manual reverse :(
        var hides_reverse = [];

        for(var i = 0; i < hides.length; i++) {
            hides_reverse.push(hides[i]);
        }

        hides_reverse.reverse();

        for(var i = 0; i < hides_reverse.length; i++) {
            showMsg($(hides_reverse[i]), i * 200);
        }
    };

    var updateMsgList = function() {
        insertMsgs();
        fadeMsgs();
    };

    return {
        update: updateMsgList
    };
})();
