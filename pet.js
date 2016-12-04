
//Core Phaser Constructor which calls the preload and subsequent builder functions
var game = new Phaser.Game(900, 540, Phaser.CANVAS, 'petGame', {preload: preload, create: create, update: update, render: render});

function preload() {

    //downloaded assets
    game.load.image('background', 'content/assets/background.png');
    game.load.image('dog-poop', 'content/assets/poop.png');
    game.load.image('soap', 'content/assets/soap.png');
    game.load.image('bubble', 'content/assets/bubble256.png');

    //custom assets
    game.load.image('button', 'content/assets/start.png');
    game.load.image('yes', 'content/assets/yes.png');
    game.load.image('no', 'content/assets/no.png');
    game.load.image('dog', 'content/assets/Dog.png');
    game.load.image('dog-food', 'content/assets/DogFood.png');
    game.load.image('dog-water', 'content/assets/DogWater.png');
    game.load.image('dog-house', 'content/assets/DogHouse.png');
    game.load.image('dog-ball', 'content/assets/TennisBall.png');
    game.load.image('dog-brush', 'content/assets/DogBrush.png');

}

var button, popup;
var animal, house, ball, brush, poop, soap;
var boundary;
var tweenGrow = null;
var tweenShrink = null;
var tweenMove = null;
var emptyFood, fullFood;
var emptyWater, fullWater;
var actionDialog;
var action;
var tranDes, tranVal;
var style = {font: "12px Arial", wordWrap: true, wordWrapWidth: 0};

function create() {

    game.add.tileSprite(0, 0, game.width, game.height, 'background');

    button = game.add.button(game.world.centerX , game.world.centerY, 'button', openWindow);
    button.anchor.set(0.5);
    button.scale.set(0.5);

    button.input.useHandCursor = true;

    var bmd = game.add.bitmapData(320, 200);
    // draw to the canvas context like normal
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 320, 200);
    bmd.ctx.fillStyle = '#ffffff';
    bmd.ctx.fill();

    popup = game.add.sprite(game.world.centerX, game.world.centerY, bmd);
    popup.visible = false;
    popup.anchor.set(0.5);
    popup.inputEnabled = true;

    //  And click the close button to close it down again
    var dog = game.make.sprite(0, 0, 'dog');
    dog.anchor.set(0.5);
    dog.scale.set(0.15);
    dog.inputEnabled = true;
    dog.input.priorityID = 1;
    dog.input.useHandCursor = true;
    dog.events.onInputDown.add(closeWindow, {pet: 'dog'});

    style.wordWrapWidth = popup.width;
    var charText = game.add.text(0, -70, "Select Your Pet", style);
    charText.anchor.set(0.5);
    charText.scale.set(1.5);

    //  Add the "close button" to the popup window image
    popup.addChild(dog);
    popup.addChild(charText);

    //  Hide it awaiting a click
    popup.scale.set(0.1);

}

function update() {

}


function render() {

}

function openWindow() {

//    popup.visible = true;
//
//    if ((tweenGrow !== null && tween.isRunning) || popup.scale.x === 1) {
//        return;
//    }
//
//    tweenGrow = game.add.tween(popup.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out, true);
    if (!loggedIn) {
       // window.alert("You must be signed-in to interact with your pet");
        dialog.show(dialog.alert({title: 'Not Signed-In', textContent: 'You must be signed-in to interact with your pet', ok: 'Close'}));
    } else {
        button.pendingDestroy = true;
        addBasic('dog');
    }

}

function closeWindow() {

    popup.visible = false;
    button.pendingDestroy = true;

    if (tweenShrink && tween.isRunning || popup.scale.x === 0.1) {
        return;
    }

    tweenShrink = game.add.tween(popup.scale).to( {x: 0.1, y: 0.1}, 100, Phaser.Easing.Elastic.In, true);

    addBasic(this.pet);

}

function moveAgain() {

    //tweenMove = game.add.tween(newButton).to({x: game.world.randomX, y: game.world.randomY}, 3000, Phaser.Easing.Default, true);

}

function fetchBall() {
    game.add.tween(animal).to({x: ball.x - 30}, 1000, Phaser.Easing.Default, true);
}

function moveBall() {

    var newX = game.world.randomX;
    while (newX <= boundary || newX >= 870) {
        newX = game.world.randomX;
    }

    tweenMove = game.add.tween(ball).to({x: newX}, 500, Phaser.Easing.Default, true);
    tweenMove.onComplete.add(fetchBall, this);

}

function addBasic(pet) {

    type = pet;
    animal = game.add.button(game.world.centerX - 100, game.world.centerY + 100, pet, moveAgain);
    animal.scale.set(0.15);

    boundary = game.world.centerX - 100;

    house = game.add.image(game.world.centerX - 415, game.world.centerY + 0, 'dog-house');
    house.scale.set(0.40);

    emptyFood = game.add.button(game.world.centerX - 335, game.world.centerY + 160, 'dog-food', fillFood);
    emptyFood.scale.set(0.18);
    fullFood = game.add.image(game.world.centerX - 335, game.world.centerY + 160, 'dog-food');
    fullFood.scale.set(0.18);
    fullFood.visible = false;

    emptyWater = game.add.button(game.world.centerX - 400, game.world.centerY + 160, 'dog-water', fillWater);
    emptyWater.scale.set(0.18);
    fullWater = game.add.image(game.world.centerX - 400, game.world.centerY + 160, 'dog-water', fillWater);
    fullWater.scale.set(0.18);
    fullWater.visible = false;

    ball = game.add.button(game.world.centerX + 200, game.world.centerY + 172, 'dog-ball', moveBall);
    ball.scale.set(0.08);

    brush = game.add.button(game.world.centerX - 200, game.world.centerY + 165, 'dog-brush', groomPet);
    brush.scale.set(0.08);

    soap = game.add.button(game.world.centerX - 150, game.world.centerY + 140, 'soap', bathePet);
    soap.scale.set(0.04);

    var chance = Math.floor((Math.random() * 10) + 1);
    if (chance%3 == 0) {

        var poopX = game.world.randomX;
        while (poopX <= boundary || poopX >= 850) {
            poopX = game.world.randomX;
        }

        poop = game.add.button(poopX, game.world.centerY + 180, 'dog-poop', pickupPoop);
        poop.scale.set(0.065);
        poop.anchor.set(0.5);
    }
}

function fillFood() {

    action = 'food';

    emptyFood.inputEnabled = false;
    emptyWater.inputEnabled = false;
    brush.inputEnabled = false;
    soap.inputEnabled = false;
    if (poop != null) {
        poop.inputEnabled = false;
    }

    var bmd = game.add.bitmapData(120, 75);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 120, 75);
    bmd.ctx.fillStyle = '#ffffff';
    bmd.ctx.fill();

    actionDialog = game.add.sprite(game.world.centerX - 295, game.world.centerY + 115, bmd);
    actionDialog.anchor.set(0.5);

    style.wordWrapWidth = actionDialog.width;

    var yesBtn = game.make.button(-50, 0, 'yes', yesBox);
    var noBtn = game.make.button(10, 0, 'no', noBox);

    var foodText = game.add.text(0, -15, "Buy food? $3.50", style);
    foodText.anchor.set(0.5);

    actionDialog.addChild(yesBtn);
    actionDialog.addChild(noBtn);
    actionDialog.addChild(foodText);
    actionDialog.scale.set(0.1);
    tweenGrow = game.add.tween(actionDialog.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out, true);

}

function fillWater() {

    action = 'water';

    emptyWater.inputEnabled = false;
    brush.inputEnabled = false;
    emptyFood.inputEnabled = false;
    soap.inputEnabled = false;
    if (poop != null) {
        poop.inputEnabled = false;
    }

    var bmd = game.add.bitmapData(120, 75);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 120, 75);
    bmd.ctx.fillStyle = '#ffffff';
    bmd.ctx.fill();

    actionDialog = game.add.sprite(game.world.centerX - 360, game.world.centerY + 115, bmd);
    actionDialog.anchor.set(0.5);

    style.wordWrapWidth = actionDialog.width;

    var yesBtn = game.make.button(-50, 0, 'yes', yesBox);
    var noBtn = game.make.button(10, 0, 'no', noBox);

    var waterText = game.add.text(0, -15, "Fill water? $4", style);
    waterText.anchor.set(0.5);

    actionDialog.addChild(yesBtn);
    actionDialog.addChild(noBtn);
    actionDialog.addChild(waterText);
    actionDialog.scale.set(0.1);
    tweenGrow = game.add.tween(actionDialog.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out, true);

}

function groomPet() {

    action = 'groom';

    brush.inputEnabled = false;
    emptyFood.inputEnabled = false;
    emptyWater.inputEnabled = false;
    soap.inputEnabled = false;
    if (poop != null) {
        poop.inputEnabled = false;
    }

    var bmd = game.add.bitmapData(120, 75);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 120, 75);
    bmd.ctx.fillStyle = '#ffffff';
    bmd.ctx.fill();

    actionDialog = game.add.sprite(game.world.centerX - 175, game.world.centerY + 120, bmd);
    actionDialog.anchor.set(0.5);

    style.worldWrapWidth = actionDialog.width;

    var yesBtn = game.make.button(-50, 0, 'yes', yesBox);
    var noBtn = game.make.button(10, 0, 'no', noBox);

    var groomText = game.add.text(0, -15, "Groom Pet? $7.70", style);
    groomText.anchor.set(0.5);

    actionDialog.addChild(yesBtn);
    actionDialog.addChild(noBtn);
    actionDialog.addChild(groomText);
    actionDialog.scale.set(0.1);
    tweenGrow = game.add.tween(actionDialog.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out, true);

}

function pickupPoop() {

    action = 'poop';

    brush.inputEnabled = false;
    emptyFood.inputEnabled = false;
    emptyWater.inputEnabled = false;
    poop.inputEnabled = false;
    soap.inputEnabled = false;

    var bmd = game.add.bitmapData(120, 75);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 120, 75);
    bmd.ctx.fillStyle = '#ffffff';
    bmd.ctx.fill();

    actionDialog = game.add.sprite(poop.x, poop.y - 65, bmd);
    actionDialog.anchor.set(0.5);

    style.worldWrapWidth = actionDialog.width;

    var yesBtn = game.make.button(-50, 0, 'yes', yesBox);
    var noBtn = game.make.button(10, 0, 'no', noBox);

    var poopText = game.add.text(0, -15, "Pickup poop? $2", style);
    poopText.anchor.set(0.5);

    actionDialog.addChild(yesBtn);
    actionDialog.addChild(noBtn);
    actionDialog.addChild(poopText);
    actionDialog.scale.set(0.1);
    tweenGrow = game.add.tween(actionDialog.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out, true);
}

function bathePet() {

    action = 'bathe';

    brush.inputEnabled = false;
    emptyFood.inputEnabled = false;
    emptyWater.inputEnabled = false;
    soap.inputEnabled = false;
    if (poop != null) {
        poop.inputEnabled = false;
    }

    var bmd = game.add.bitmapData(120, 75);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 120, 75);
    bmd.ctx.fillStyle = '#ffffff';
    bmd.ctx.fill();

    actionDialog = game.add.sprite(soap.x + 10, soap.y - 40, bmd);
    actionDialog.anchor.set(0.5);

    style.worldWrapWidth = actionDialog.width;

    var yesBtn = game.make.button(-50, 0, 'yes', yesBox);
    var noBtn = game.make.button(10, 0, 'no', noBox);

    var soapText = game.add.text(0, -15, "Bathe pet? $10", style);
    soapText.anchor.set(0.5);

    actionDialog.addChild(yesBtn);
    actionDialog.addChild(noBtn);
    actionDialog.addChild(soapText);
    actionDialog.scale.set(0.1);
    tweenGrow = game.add.tween(actionDialog.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out, true);
}

function addBubbles() {

    for (var i = 0; i < 20; i++) {

        var randY = game.rnd.realInRange(animal.y - 20, animal.y + 50);
        var randX = game.rnd.realInRange(animal.x, animal.x + 70);
        var bubble = game.add.sprite(randX, randY, 'bubble');
        bubble.scale.set(game.rnd.realInRange(0.04, 0.08));

        var speed = game.rnd.realInRange(6000, 8000);

        tweenMove = game.add.tween(bubble).to({y: -100}, speed, Phaser.Easing.Sinusoidal.InOut, true);
    }

}

function yesBox() {

    actionDialog.visible = false;

    emptyFood.inputEnabled = true;
    emptyWater.inputEnabled = true;
    brush.inputEnabled = true;
    soap.inputEnabled = true;
    if (poop != null) {
        poop.inputEnabled = true;
    }

    if (action == 'food') {
        emptyFood.visible = false;
        fullFood.visible = true;

        tranDes = "Feed pet";
        tranVal = 3.5;
    } else if (action == 'water') {
        emptyWater.visible = false;
        fullWater.visible = true;

        tranDes = "Give pet water";
        tranVal = 4;
    } else if (action == 'groom') {
        tranDes = "Groom pet";
        tranVal = 7.7;

    } else if (action == 'poop') {
        tranDes = "Pickup poop";
        tranVal = 2;

        poop.pendingDestroy = true;
        poop = null;
    } else if (action == 'bathe') {
        tranDes = "Bathe pet";
        tranVal = 10;

        addBubbles();
    }

    document.getElementById('addTran').click();

}

function noBox() {

    actionDialog.visible = false;

    emptyFood.inputEnabled = true;
    emptyWater.inputEnabled = true;
    brush.inputEnabled = true;
    soap.inputEnabled = true;
    if (poop != null) {
        poop.inputEnabled = true;
    }

}
