// CREDITS:  WDELENCLOS.FR --- \\°

// Bibliothèque de fonctions ----------------------------

function updateSource( a, nb) {
    var audio = document.getElementById('parole');
    audio.src='./sound/'+a+'/' + nb +'.mp3';
    audio.load(); //call this to just preload the audio without playing
    audio.play(); //call this to play the song right away
}

function question() {
    var nb = Math.floor((Math.random() * 9) + 1);
    updateSource('questions', nb);
}

function reponsePos() {
    var nb = Math.floor((Math.random() * 17) + 1);
    updateSource('reponses/pos', nb);
}
function reponseNeg() {
    var nb = Math.floor((Math.random() * 16) + 1);
    updateSource('reponses/neg', nb);
}


function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function ecouteActive() {

// Test si le navigateur est compatible avec Web Speech API
    if ('webkitSpeechRecognition' in window) {


        var recognition = new webkitSpeechRecognition();
        recognition.lang = "fr-FR";
        recognition.continuous = false;
        recognition.interimResults = true;
        function demarrer(){
            function starter() {
                recognition.start();
                $('#result').text();
            }
            setTimeout(starter, 1700);
        }
        // Début enregistrement vocal
        $('#canvas-shapes').click(
            demarrer()
        );

        // Récuperation des mots
        recognition.onresult = function (event) {
            $('#result').text('');
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {

                    recognition.stop();
                    var transcript = event.results[i][0].transcript;

                    // Majuscule à chaque mots (recherche wikipédia)
                    var words = transcript.split(' ');
                    for(var j = 1; j < words.length ; ++j){
                        words[j] = words[j].charAt(0).toUpperCase() + words[j].substring(1).toLowerCase();
                    }

                    // Création de la commande
                    var cmd = new command(words[0], transcript.replace(words[0], ''));

                    $('#result').text(transcript);

                } else {
                    $('#result').text($('#result').text() + event.results[i][0].transcript);
                }
            }
        };

        // Efface la saisie
        recognition.onend = function(){
            window.setTimeout(function(){
                $('#result').text('');
            }, 2000);
            $( "#canvas-shapes" ).toggleClass( "lisen" );
            imageVisible = !imageVisible;
        };
    }
}

function init() {
    // Initialisation de l'interface
    stageImage = document.getElementById("canvas-image");
    stageImageCtx = stageImage.getContext('2d');
    stageImage.width = stageImageWidth;
    stageImage.height = stageImageHeight;

    stage = document.getElementById("canvas-shapes");
    stageCtx = stage.getContext('2d');
    stage.width = stageWidth;
    stage.height = stageHeight;

    stageImageOffsetX = (stageWidth - stageImageWidth) / 2;
    stageImageOffsetY = (stageHeight - stageImageHeight) / 2;
}

function Dot(x, y, red, blue, green, imageX, imageY) {

    var _this = this;

    _this.x = x;
    _this.y = y;
    _this.red = red;
    _this.green = blue;
    _this.blue = green;
    _this.imageX = imageX;
    _this.imageY = imageY;

    this.draw = function() {
        stageCtx.beginPath();
        stageCtx.arc(_this.x, _this.y, circleRadius, 0, 2 * Math.PI, false);
        stageCtx.fillStyle = 'rgb(' + _this.red + ', ' + _this.green + ', ' + _this.blue + ')';
        stageCtx.fill();
    }

}

/*
 Desc: Redraw loops
 */
function loop() {

    stageCtx.clearRect(0, 0, stageWidth, stageHeight);

    for (var i = 0; i < dots.length; i++) {
        dots[i].draw(stageCtx);
    }

    requestAnimationFrame(loop);

}

// Bibliothèque de variables --------------------------------
var stageImageCtx,
    stageImageWidth = 380,
    stageImageHeight = 414,
    stageImageOffsetX,
    stageImageOffsetY,

    stage,
    stageCtx,
    stageWidth = window.innerWidth,
    stageHeight = window.innerHeight,
    stageCenterX = stageWidth / 2,
    stageCenterY = stageHeight / 2,

    circleOuterRadius = 250,
    circlePoints = [],

    imageVisible = false,
    dots = [],
    imagePixelCoordinates,
    circleRadius = 2,
    lisenMode = 0;



init();

// switch mode ecoute / mode attente.
stage.addEventListener('click', function() {

    if(lisenMode === 0){
        question();
        ecouteActive();
        lisenMode = 1;
    }
    imageVisible = !imageVisible;
}, false);
$('body').keyup(function(e){

        if(lisenMode === 0){
            question();
            ecouteActive();
            lisenMode = 1;
        }
        imageVisible = !imageVisible;

});

loop();

drawImage();

function drawImage() {

    var img = new Image;
    img.crossOrigin = "Anonymous";
    img.src = 'img/icon.png';

    img.onload = function() {
        stageImageCtx.drawImage(img, 0, 0);
        getImageData();
    }

}

/*
 Desc: Get image data
 */
function getImageData() {

    var ctx = document.getElementById('canvas-image').getContext('2d');

    var imageData = ctx.getImageData(0, 0, stageImageWidth, stageImageHeight).data;

    imagePixelCoordinates = [];

    for (var i = imageData.length; i >= 0; i -= 4) {

        if (imageData[i] !== 0) {

            var x = (i / 4) % stageImageWidth;
            var y = Math.floor(Math.floor(i / stageImageWidth) / 4);

            if ((x && x % ((circleRadius * 2) + 1) == 0) && (y && y % ((circleRadius * 2) + 1) == 0)) {

                imagePixelCoordinates.push({
                    x: x,
                    y: y,
                    red: imageData[i],
                    green: imageData[i + 1],
                    blue: imageData[i + 2]
                });

            }

        }
    }

    formImage();

}

/*
 Desc: From image using dots
 */
function formImage() {

    for (var i = 0; i < imagePixelCoordinates.length; i++) {

        // Create a list of coordinates that represent a circle
        var p = Math.random(),
            x = stageCenterX + circleOuterRadius * Math.cos(2 * Math.PI * p),
            y = stageCenterY + circleOuterRadius * Math.sin(2 * Math.PI * p);

        circlePoints.push({
            x: x,
            y: y
        });


        // Create dots
        var dot = new Dot(
            x,
            y,
            imagePixelCoordinates[i].red,
            imagePixelCoordinates[i].green,
            imagePixelCoordinates[i].blue,
            imagePixelCoordinates[i].x,
            imagePixelCoordinates[i].y
        );

        dots.push(dot);

        // Tween dots
        tweenDots(dots[i], circlePoints[i], 'circle');

    }

}

/*
 Desc: Animate dots
 */
function tweenDots(dot, circlePos, type) {

    if (type === 'circle') {

        // Tween dot to coordinate to form image
        TweenLite.to(dot, (1.8 + Math.round(Math.random() * 100) / 100), {
            x: circlePos.x,
            y: circlePos.y,
            ease: Cubic.easeInOut,
            onComplete: function() {

                if (!imageVisible) {

                    tweenDots(dot, circlePoints[randomNumber(0, circlePoints.length)], 'circle');
                } else {
                    tweenDots(dot, '', '');
                }

            }
        });

    } else {

        // Tween dot to coordinate to form image
        TweenLite.to(dot, (0.4 + Math.round(Math.random() * 100) / 100), {
            x: (dot.imageX + stageImageOffsetX),
            y: (dot.imageY + stageImageOffsetY),
            ease: Cubic.easeInOut,
            onComplete: function() {

                if (!imageVisible) {
                    tweenDots(dot, circlePoints[randomNumber(0, circlePoints.length)], 'circle');
                } else {
                    tweenDots(dot, '', '');
                }

            }
        });

    }

}

