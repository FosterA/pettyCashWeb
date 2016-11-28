

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
    game.load.image('dog-ball', 'content/assets/newassets/TennisBall.png');
    game.load.image('dog-brush', 'content/assets/newassets/DogBrush.png');

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
var actionDialog;
var brush;
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
    
    var ball = game.add.image(game.world.centerX + 200, game.world.centerY + 165, 'dog-ball');
    ball.scale.set(0.08);
    
    brush = game.add.button(game.world.centerX - 200, game.world.centerY + 165, 'dog-brush', groomPet);
    brush.scale.set(0.08);

}

function fillFood() {
    
    action = 'food';

    emptyFood.inputEnabled = false;
    emptyWater.inputEnabled = false;
    brush.inputEnabled = false;

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

function yesBox() {
    
    actionDialog.visible = false;
    
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
        
        brush.inputEnabled = true;
    }
    
    document.getElementById('addTran').click();

}

function noBox() {
    
    actionDialog.visible = false;

    emptyFood.inputEnabled = true;
    emptyWater.inputEnabled = true;
    brush.inputEnabled = true;

}

