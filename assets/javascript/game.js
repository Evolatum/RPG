class characterClass{
    constructor(name, HP, AP, critChance, attIcon, specAP, specCD, specIcon, img){
        this.name = name;
        this.HP = HP*5;
        this.AP = AP;
        this.critChance = critChance;
        this.attIcon = attIcon;
        this.specAP = specAP;
        this.specCD = specCD;
        this.specIcon = specIcon;
        this.img = img;
    }
    get attack(){
        if(this.critChance >= randomNumber(100,1)){
            return [randomNumber(this.AP)*2,true];
        } else{
            return [randomNumber(this.AP),false];
        }
    }

    get specAttack(){
        if(this.critChance >= randomNumber(100,1)){
            return [randomNumber(this.specAP,this.specAP/2)*2,true];
        } else{
            return [randomNumber(this.specAP),false];
        }
    }

    generateStartCard(){
        var newCol = $("<div>");
        newCol.attr("class", "col-md-4 col-sm-6");
        var newCard = $("<div>");
        newCard.attr("class", "character jumbotron");
        newCard.attr("id", this.name);
        var newImg = $("<img>");
        newImg.attr("class", "img-fluid imgClass");
        newImg.attr("src", this.img);
        newImg.attr("alt", this.name + " image");
        var newTitle = $("<h5>");
        newTitle.attr("class", "text-center");
        newTitle.text(this.name);
        var newText = $("<p>");
        newText.attr("class", "text-center");

        $("#mainRow").append(newCol);
        newCol.append(newCard);
        newCard.append(newImg);
        newCard.append(newTitle);
        newCard.append(newText);

        var newSpan1 = $("<span>");
        newSpan1.attr("data-toggle","tooltip");
        newSpan1.attr("data-placement","top");
        newSpan1.attr("title","Hit Points");
        newSpan1.text("HP:");
        var newSpanId1 = $("<span>");
        newSpanId1.attr("class","HP");
        newText.append(newSpan1);
        newText.append(newSpanId1);

        var newSpan2 = $("<span>");
        newSpan2.attr("data-toggle","tooltip");
        newSpan2.attr("data-placement","top");
        newSpan2.attr("title","Attack Power");
        newSpan2.text("  AP:");
        var newSpanId2 = $("<span>");
        newSpanId2.attr("class","AP");
        newText.append(newSpan2);
        newText.append(newSpanId2);

        var newSpan3 = $("<span>");
        newSpan3.attr("data-toggle","tooltip");
        newSpan3.attr("data-placement","top");
        newSpan3.attr("title","Critical Chance (x2)");
        newSpan3.text("  Crit:");
        var newSpanId3 = $("<span>");
        newSpanId3.attr("class","crit");
        newText.append(newSpan3);
        newText.append(newSpanId3);
    }

    addAttacks(){
        $("#"+this.name).children("h5").text("Hero: "+this.name);
        var newButton = $("<button>");
        newButton.attr("class", "btn btn-secondary");
        newButton.attr("id","attBttn");
        newButton.attr("data-toggle","tooltip");
        newButton.attr("data-placement","top");
        newButton.attr("title","Deals damage between 1 and "+this.AP);
        newButton.html(`<i class="${this.attIcon}" id="${this.name}Btn" alt="${this.name} attack button"></i> Attack`);
        $("#"+this.name).append(newButton);
        var newSpan = $("<span>");
        newSpan.text(`   CD: ${this.specCD}`);
        newSpan.attr("id", "cdSpan");
        newSpan.attr("data-toggle","tooltip");
        newSpan.attr("data-placement","top");
        newSpan.attr("title", "Cooldown of Special Attack");
        $("#"+this.name).append(newSpan);
        var newButton2 = $("<button>");
        newButton2.attr("class", "btn btn-secondary");
        newButton2.attr("id","specAttBttn");
        newButton2.attr("data-toggle","tooltip");
        newButton2.attr("data-placement","top");
        newButton2.attr("title",`Deals damage between ${this.specAP/2} and ${this.specAP}`);
        newButton2.html(`<i class="${this.specIcon}" id="${this.name}SpecBtn" alt="${this.name} special attack button"></i> Special Attack`);
        $("#"+this.name).append(newButton2);
    }

    updateHTML(){
        $("#"+this.name).children("p").children(".HP").text(this.HP);
        $("#"+this.name).children("p").children(".AP").text(this.AP);
        $("#"+this.name).children("p").children(".crit").text(this.critChance+"%");
    }
}

let characters = [
    new characterClass("Archer", 6, 8, 30, "far fa-bow-arrow", 16, 4, "far fa-bullseye-arrow", "assets/images/Archer.png"),
    new characterClass("Warrior", 10, 8, 10, "far fa-sword", 10, 2, "far fa-shield-alt", "assets/images/Warrior.png"),
    new characterClass("Rogue", 8, 6, 50, "far fa-dagger", 20, 6, "far fa-flask-poison", "assets/images/Rogue.png"),
    new characterClass("Mage", 6, 8, 30, "far fa-wand-magic", 16, 4, "far fa-book-spells", "assets/images/Mage.png"),
    new characterClass("Druid", 8, 8, 20, "far fa-staff", 20, 5, "far fa-paw-claws", "assets/images/Druid.png")
];

/*characters[1].specAttack = new function(){
    this.HP += randomNumber(this.specAP);
    if(this.critChance >= randomNumber(100,1)){
        console.log("SPEC-CRITICAL!");
        return randomNumber(this.specAP)*2;
    } else{
        return randomNumber(this.specAP);
    }
}*/

var selectedHero;
var heroCD;
var selectedEnemy;
var gameState = 0;

$(document).ready(function() {

    //Tooltop Inizialization
    $(function () {$('[data-toggle="tooltip"]').tooltip()})

    //Character cards initialization
    for(let character of characters){
        character.generateStartCard();
        character.updateHTML();
    }

    //Attacking
    $(document).on("click","#attBttn",function(){
        //Hero damages enemy
        var dmg = characters[indexChar(selectedHero)].attack;
        if(dmg[1]){
            $(".modal-title").text("Critical Hit!");
            $(".modal-body").text(`You dealt ${dmg[0]/2} damage twice, for a total of ${dmg[0]}.`);
        } else{
            $(".modal-title").text("Hit!");
            $(".modal-body").text(`You dealt ${dmg[0]} damage.`);
        }
        characters[indexChar(selectedEnemy)].HP -= dmg[0];
        characters[indexChar(selectedEnemy)].updateHTML();

        //Enemy damages hero
        var dmg2 = characters[indexChar(selectedEnemy)].attack;
        console.log(dmg2[0]);
        if(dmg2[1]){
            $('#alert2').children().children().children().children(".modal-title").text("Critical counter-hit!");
            $('#alert2').children().children().children(".modal-body").text(`You were dealt ${dmg2[0]/2} damage twice, for a total of ${dmg2[0]}.`);
        } else{
            $('#alert2').children().children().children().children(".modal-title").text("Counter-hit!");
            $('#alert2').children().children().children(".modal-body").text(`You were dealt ${dmg2[0]} damage.`);
        }
        characters[indexChar(selectedHero)].HP -= dmg2[0];
        characters[indexChar(selectedHero)].updateHTML();

        //Alerts
        $('#alert').modal('show');
        $('#alert2').modal('show');

        //Special Attack CD
        if(heroCD>1){
            $("#cdSpan").text(`   CD: ${--heroCD}`);
        } else{
            $("#cdSpan").text(`   CD: ${characters[indexChar(selectedHero)].specCD}`);
            $("#specAttBttn").attr("disabled",false);
            $("#cdSpan").css("color","");
            heroCD = characters[indexChar(selectedHero)].specCD;
        }
    });

    //Special Attacking
    $(document).on("click","#specAttBttn",function(){
        //Hero damages enemy
        var dmg = characters[indexChar(selectedHero)].specAttack;
        if(dmg[1]){
            $(".modal-title").text("Critical Special Hit!");
            $(".modal-body").text(`You dealt ${dmg[0]/2} damage twice with your special attack, for a total of ${dmg[0]}.`);
        } else{
            $(".modal-title").text("Special Hit!");
            $(".modal-body").text(`You dealt ${dmg[0]} damage with your special attack!`);
        }
        characters[indexChar(selectedEnemy)].HP -= dmg[0];
        characters[indexChar(selectedEnemy)].updateHTML();
        $("#cdSpan").text(`   CD: ${heroCD}`);
        $("#cdSpan").css("color","darkred");
        $("#specAttBttn").attr("disabled",true);

        //Enemy damages hero
        var dmg2 = characters[indexChar(selectedEnemy)].attack;
        console.log(dmg2[0]);
        if(dmg2[1]){
            $('#alert2').children().children().children().children(".modal-title").text("Critical counter-hit!");
            $('#alert2').children().children().children(".modal-body").text(`You were dealt ${dmg2[0]/2} damage twice, for a total of ${dmg2[0]}.`);
        } else{
            $('#alert2').children().children().children().children(".modal-title").text("Counter-hit!");
            $('#alert2').children().children().children(".modal-body").text(`You were dealt ${dmg2[0]} damage.`);
        }
        characters[indexChar(selectedHero)].HP -= dmg2[0];
        characters[indexChar(selectedHero)].updateHTML();

        //Alerts
        $('#alert').modal('show');
        $('#alert2').modal('show');
    });

    //Clicking a character
    $(document).on("click", ".character",function() {
        if(gameState === 0){
            selectedHero = $(this).attr('id').toString();
            console.log("Hero: "+selectedHero);
            $(".modal-title").text("Confirm Class");
            $(".modal-body").text(`Your class will be ${selectedHero}, confirm choice?`);
            $('#confirm').modal('show');
        } else if(gameState === 1){
            selectedEnemy = $(this).attr('id').toString();
            console.log("Enemy: "+selectedEnemy);
            $(".modal-title").text("Confirm Enemy");
            $(".modal-body").text(`Your enemy will be ${selectedEnemy}, confirm choice?`);
            $('#confirm').modal('show');
        }
    });

    //Clicking yes on Confirm
    $('#confirm').on('click', '#btnYes', function(){
        if(gameState===0){
            console.log("Accepted Hero: " + selectedHero);
            heroCD = characters[indexChar(selectedHero)].specCD;
            gameState=1;
            $(`#${selectedHero}`).parent().remove();;
            $("#title").text("Choose an enemy to fight!");
        } else if(gameState===1){
            console.log("Accepted enemy: " + selectedEnemy);
            gameState=2;
            $("#mainRow").empty();
            $("#title").text("Fight!");
            characters[indexChar(selectedHero)].generateStartCard();
            characters[indexChar(selectedHero)].updateHTML();
            characters[indexChar(selectedHero)].addAttacks();
            emptyCol();
            characters[indexChar(selectedEnemy)].generateStartCard();
            characters[indexChar(selectedEnemy)].updateHTML();
            $(`#${selectedEnemy}`).children("h5").text(`Enemy: ${selectedEnemy}`);
        }
    });



});

function indexChar(value){
    for(let i = 0 ; i < characters.length ; i++){
        if(characters[i].name === value) return i;
    }
    return null;
}

function randomNumber (max=10, min=1){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function emptyCol(){
    var newCol = $("<div>");
    newCol.attr("class", "col-md-4 col-sm-6");
    $("#mainRow").append(newCol);
}