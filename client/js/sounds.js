app.sounds = {
    attack: [
        "attack-1.ogg",
        "attack-2.ogg",
        "attack-3.ogg",
        "attack-short-1.ogg",
        "attack-short-2.ogg",
        "attack-short-3.ogg"
    ],
    bonus: [
        "bonus-1.ogg",
        "bonus-2.ogg"
    ],
    bye: [
        "bye-1.ogg",
        "bye-2.ogg",
        "bye-3.ogg"
    ],
    crazy: [
        "crazy-1.ogg",
        "crazy-2.ogg",
        "crazy-3.ogg"
    ],
    death: [
        "death-1.ogg",
        "death-2.ogg",
        "death-3.ogg"
    ],
    greetings: [
        "greetings-1.ogg",
        "greetings-2.ogg",
        "greetings-3.ogg"
    ],
    joy: [
        "joy-1.ogg",
        "joy-2.ogg",
        "joy-3.ogg"
    ],
    lowMoral: [
        "low-moral-1.ogg",
        "low-moral-2.ogg",
        "low-moral-3.ogg"
    ],
    healing: [
        "healing-1.ogg",
        "healing-2.ogg",
        "healing-3.ogg"
    ],
    pain: [
        "pain-1.ogg",
        "pain-2.ogg",
        "pain-3.ogg",
    ]
};

app.play = function(key){
    var playSound = function(sounds){
        var randomNumber = Math.floor(Math.random() * sounds.length);
        
        var mySound = new buzz.sound( "sounds/" + sounds[randomNumber]);
        mySound.play();
    };

    switch(key){
        case 1: 
        //attack
        playSound(app.sounds.attack);
        
        break;

        case 2: 
        //win game
        playSound(app.sounds.bye);
        
        break;

        case 3: 
        //+1
        playSound(app.sounds.bonus);
        
        break;

        case 100: 
        //app start
        playSound(app.sounds.joy.concat(app.sounds.greetings));
        
        break;

        case 110: 
        //attack me
        playSound(app.sounds.death.concat(app.sounds.healing, app.sounds.pain));
        
        break;

        case 120: 
        //-1
        playSound(app.sounds.lowMoral);
        
        break;

        case 130:
        //crazy
        playSound(app.sounds.crazy); 
    }
};
