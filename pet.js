

var game = new Phaser.Game(900, 540, Phaser.CANVAS, 'petGame', {preload: preload, create: create, update: update, render: render});

function preload() {
    //phaser assets
    game.load.image('dog', 'content/assets/newassets/Dog.png');
    game.load.image('cat', 'content/assets/phaser-dude.png');
    game.load.spritesheet('button', 'content/assets/button_sprite_sheet.png', 193, 71);
    //custom and downloaded assets
    game.load.image('empty', 'content/assets/bowlEmpty.png');
    game.load.image('yes', 'content/assets/yes.png');
    game.load.image('no', 'content/assets/no.png');
    
    game.load.image('background', 'content/assets/newassets/background.png');
    game.load.image('dog-food', 'content/assets/newassets/DogFood.png');
    game.load.image('dog-water', 'content/assets/newassets/DogWater.png');
    game.load.image('dog-house', 'content/assets/newassets/DogHouse.png');

}

var sprite = null;
var button;
var animal;
var house;
var popup;
var tweenGrow = null;
var tweenShrink = null;
var tweenMove = null; 
var emptyFood;
var fullFood;
var emptyWater;
var fullWater;
var fillDialog;
var action;
var tranDes;
var tranVal;
var style = {font: "12px Arial", wordWrap: true, wordWrapWidth: 0};

function create() {
    
    game.add.tileSprite(0, 0, game.width, game.height, 'background');

    if (sprite !== null) {

        game.add.sprite(game.world.centerX, game.world.centerY, sprite);
        addBasic(sprite);

    } else {

        button = game.add.button(game.world.centerX - 71, game.world.centerY, 'button', openWindow, this, 2, 1, 0);

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
        var dog = game.make.sprite(-100, -45, 'dog');
        dog.scale.set(0.15);
        dog.inputEnabled = true;
        dog.input.priorityID = 1;
        dog.input.useHandCursor = true;
        dog.events.onInputDown.add(closeWindow, {pet: 'dog'});

        var cat = game.make.sprite(50, -15, 'cat');
        cat.inputEnabled = true;
        cat.input.priorityID = 1;
        cat.input.useHandCursor = true;
        cat.events.onInputDown.add(closeWindow, {pet: 'cat'});
        
        style.wordWrapWidth = popup.width;
        var charText = game.add.text(0, -70, "Select Your Pet", style);
        charText.anchor.set(0.5);
        charText.scale.set(1.5);

        //  Add the "close button" to the popup window image
        popup.addChild(dog);
        popup.addChild(cat);
        popup.addChild(charText);

        //  Hide it awaiting a click
        popup.scale.set(0.1);
    }

}

function update() {    

}


function render() {

}

function openWindow() {

    popup.visible = true;

    if ((tweenGrow !== null && tween.isRunning) || popup.scale.x === 1) {
        return;
    }

    tweenGrow = game.add.tween(popup.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out, true);

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

    tweenMove = game.add.tween(newButton).to({x: game.world.randomX, y: game.world.randomY}, 3000, Phaser.Easing.Default, true);

}

function addBasic(pet) {

    type = pet;
    animal = game.add.button(game.world.centerX - 100, game.world.centerY + 100, pet, moveAgain);
    animal.scale.set(0.15);
    
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

}

function fillFood() {
    
    action = 'food';

    emptyFood.inputEnabled = false;

    var bmd = game.add.bitmapData(120, 75);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 120, 75);
    bmd.ctx.fillStyle = '#ffffff';
    bmd.ctx.fill();

    fillDialog = game.add.sprite(game.world.centerX - 295, game.world.centerY + 115, bmd);
    fillDialog.anchor.set(0.5);
    
    style.wordWrapWidth = fillDialog.width;
    
    var yesBtn = game.make.button(-50, 0, 'yes', yesBox);
    var noBtn = game.make.button(10, 0, 'no', noBox);

    var foodText = game.add.text(0, -15, "Buy more food? $5", style);
    foodText.anchor.set(0.5);

    fillDialog.addChild(yesBtn);
    fillDialog.addChild(noBtn);
    fillDialog.addChild(foodText);
    fillDialog.scale.set(0.1);
    tweenGrow = game.add.tween(fillDialog.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out, true);

}

function fillWater() {
    
    action = 'water';
    
    emptyWater.inputEnabled = false;
    
    var bmd = game.add.bitmapData(120, 75);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 120, 75);
    bmd.ctx.fillStyle = '#ffffff';
    bmd.ctx.fill();
    
    fillDialog = game.add.sprite(game.world.centerX - 360, game.world.centerY + 115, bmd);
    fillDialog.anchor.set(0.5);
    
    style.wordWrapWidth = fillDialog.width;
    
    var yesBtn = game.make.button(-50, 0, 'yes', yesBox);
    var noBtn = game.make.button(10, 0, 'no', noBox);
    
    var waterText = game.add.text(0, -15, "Refill water? $7", style);
    waterText.anchor.set(0.5);
    
    fillDialog.addChild(yesBtn);
    fillDialog.addChild(noBtn);
    fillDialog.addChild(waterText);
    fillDialog.scale.set(0.1);
    tweenGrow = game.add.tween(fillDialog.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out, true);
    
}

function yesBox() {
    
    fillDialog.visible = false;
    
    if (action == 'food') {
        emptyFood.visible = false;
        fullFood.visible = true;
        
        tranDes = "Feed pet";
        tranVal = 5;
    } else if (action == 'water') {
        emptyWater.visible = false;
        fullWater.visible = true;
        
        tranDes = "Give pet water";
        tranVal = 7;
    }

    document.getElementById('addTran').click();

}

function noBox() {
    
    fillDialog.visible = false;
    
    if (action == 'food') {
        emptyFood.inputEnabled = true;
    } else if (action == 'water') {
        emptyWater.inputEnabled = true;
    }

}

