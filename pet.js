

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'petGame', {preload: preload, create: create, update: update, render: render});

function preload() {
    //phaser assets
    game.load.image('mushroom', 'content/assets/mushroom2.png');
    game.load.image('phaser', 'content/assets/phaser-dude.png');
    game.load.spritesheet('button', 'content/assets/button_sprite_sheet.png', 193, 71);
    //custom and downloaded assets
    game.load.image('empty', 'content/assets/bowlEmpty.png');
    game.load.image('full', 'content/assets/bowlFull.png');
    game.load.image('yes', 'content/assets/yes.png');
    game.load.image('no', 'content/assets/no.png');

}

var sprite = null;
var button;
var newButton;
var popup;
var tweenGrow = null;
var tweenShrink = null;
var tweenMove = null; 
var emptyBowl;
var fullBowl;
var fillDialog;
var tranDes;
var tranVal;

function create() {

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
        var mushroom = game.make.sprite(-100, -25, 'mushroom');
        mushroom.inputEnabled = true;
        mushroom.input.priorityID = 1;
        mushroom.input.useHandCursor = true;
        mushroom.events.onInputDown.add(closeWindow, {pet: 'mushroom'});

        var phaser = game.make.sprite(50, -15, 'phaser');
        phaser.inputEnabled = true;
        phaser.input.priorityID = 1;
        phaser.input.useHandCursor = true;
        phaser.events.onInputDown.add(closeWindow, {pet: 'phaser'});

        //  Add the "close button" to the popup window image
        popup.addChild(mushroom);
        popup.addChild(phaser);

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

    //tweenMove = game.add.tween(newButton).to({x: game.world.randomX, y: 100}, 3000, Phaser.Easing.Default, true);
    //tweenShrink = game.add.tween(newButton.scale).to({x: 0.50, y: 0.50}, 3000, Phaser.Easing.Default, true);

}

function moveAgain() {

    tweenMove = game.add.tween(newButton).to({x: game.world.randomX, y: game.world.randomY}, 3000, Phaser.Easing.Default, true);

}

function addBasic(pet) {

    newButton = game.add.button(game.world.centerX, game.world.centerY, pet, moveAgain);
    emptyBowl = game.add.button(200, 500, 'empty', fillTransaction);
    fullBowl = game.add.button(200, 500, 'full');
    fullBowl.visible = false;
}

function fillTransaction() {

    emptyBowl.inputEnabled = false;

    var bmd = game.add.bitmapData(120, 75);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 120, 75);
    bmd.ctx.fillStyle = '#ffffff';
    bmd.ctx.fill();

    fillDialog = game.add.sprite(225, 465, bmd);
    fillDialog.anchor.set(0.5);

    var yesBtn = game.make.button(-50, 0, 'yes', yesBox);
    var noBtn = game.make.button(10, 0, 'no', noBox);

    var style = {font: "12px Arial", wordWrap: true, wordWrapWidth: fillDialog.width};
    var foodText = game.add.text(0, -15, "Buy more food? 5$", style);
    foodText.anchor.set(0.5);

    fillDialog.addChild(yesBtn);
    fillDialog.addChild(noBtn);
    fillDialog.addChild(foodText);
    fillDialog.scale.set(0.1);
    tweenGrow = game.add.tween(fillDialog.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out, true);

}

function yesBox() {

    fillDialog.visible = false;
    emptyBowl.visible = false;
    fullBowl.visible = true;

    tranDes = "Feed pet";
    tranVal = 5;
    document.getElementById('addTran').click();

}

function noBox() {

    fillDialog.visible = false;
    emptyBowl.inputEnabled = true;

}

