class characterClass{
    constructor(name, HP, AP, critChance, attIcon, specAP, specCD, specIcon, img){
        this.name = name;
        this.HP = HP*2;
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
            console.log("CRITICAL!");
            return randomNumber(this.AP)*2;
        } else{
            return randomNumber(this.AP);
        }
    }

    get specAttack(){
        if(this.critChance >= randomNumber(100,1)){
            console.log("SPEC-CRITICAL!");
            return randomNumber(this.specAP)*2;
        } else{
            return randomNumber(this.specAP);
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
        var newButton = $("<button>");
        newButton.attr("class", "btn btn-secondary");
        newButton.html(`<i class="${this.attIcon}" id="${this.name}Btn" alt="${this.name} attack button"></i> Attack`);
        $("#"+this.name).append(newButton);
        var newButton2 = $("<button>");
        newButton2.attr("class", "btn btn-secondary");
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
    new characterClass("Warrior", 10, 8, 10, "far fa-sword", 4, 2, "far fa-shield-alt", "assets/images/Warrior.png"),
    new characterClass("Rogue", 8, 6, 50, "far fa-dagger", 20, 6, "far fa-flask-poison", "assets/images/Rogue.png"),
    new characterClass("Mage", 6, 8, 30, "far fa-wand-magic", 16, 4, "far fa-book-spells", "assets/images/Mage.png"),
    new characterClass("Druid", 8, 8, 20, "far fa-staff", 20, 5, "far fa-paw-claws", "assets/images/Druid.png")
];

characters[1].specAttack = new function(){
    this.HP += randomNumber(this.specAP);
    /*super.specAttack();*/
    console.log("Healed HP");
    if(this.critChance >= randomNumber(100,1)){
        console.log("SPEC-CRITICAL!");
        return randomNumber(this.specAP)*2;
    } else{
        return randomNumber(this.specAP);
    }
}

var selectedClass;
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


    //Clicking a character
    $(".character").on("click", function() {
        if(gameState === 0){
            selectedClass = $(this).attr('id').toString();
            console.log(selectedClass);
            $(".modal-title").text("Confirm Class");
            $(".modal-body").text(`Your class will be ${selectedClass}, confirm choice?`);
            $('#confirm').modal('show');
        } else if(gameState === 1){
            selectedEnemy = $(this).attr('id').toString();
            console.log(selectedEnemy);
            $(".modal-title").text("Confirm Enemy");
            $(".modal-body").text(`Your enemy will be ${selectedEnemy}, confirm choice?`);
            $('#confirm').modal('show');
        }
    });

    $('#confirm').on('click', '#btnYes', function(){
        if(gameState===0){
            console.log("Accepted class: " + selectedClass);
            gameState=1;
            $(`#${selectedClass}`).parent().remove();;
            $("#title").text("Choose an enemy to fight!");
        } else if(gameState===1){
            console.log("Accepted enemy: " + selectedEnemy);
            gameState=2;
            $("#mainRow").empty();
            $("#title").text("Fight!");
            characters[getValue(characters, selectedClass)].generateStartCard();
            characters[getValue(characters, selectedClass)].updateHTML();
            characters[getValue(characters, selectedClass)].addAttacks();

        }
    });

});

function getValue(array, value){
    for(let i = 0 ; i < array.length ; i++){
        if(array[i].name === value) return i;
    }
    return null;
}

function randomNumber (max=10, min=1){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}