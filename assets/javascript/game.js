class characterClass{
    constructor(name, HP, AP, critChance, attIcon, specAP, specCD, specIcon){
        this.name = name;
        this.HP = HP*2;
        this.AP = AP;
        this.critChance = critChance;
        this.attIcon = attIcon;
        this.specAP = specAP;
        this.specCD = specCD;
        this.specIcon = specIcon;
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

    updateHTML(){
        $("#"+this.name).children("p").children(".HP").text(this.HP);
        $("#"+this.name).children("p").children(".AP").text(this.AP);
        $("#"+this.name).children("p").children(".crit").text(this.critChance);
    }
}

let characters = [
    new characterClass("Archer", 6, 8, 30, "far fa-bow-arrow", 16, 4, "far fa-bullseye-arrow"),
    new characterClass("Warrior", 10, 8, 10, "far fa-sword", 4, 2, "far fa-shield-alt"),
    new characterClass("Rogue", 8, 6, 50, "far fa-dagger", 20, 6, "far fa-flask-poison"),
    new characterClass("Mage", 6, 8, 30, "far fa-wand-magic", 16, 4, "far fa-book-spells"),
    new characterClass("Druid", 8, 8, 20, "far fa-staff", 20, 5, "far fa-paw-claws")
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

    //Character stats initialization
    for(let character of characters) character.updateHTML();


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
            $(`#${selectedClass}`).hide();;
            gameState=1;
            $("#title").text("Choose an enemy to fight!");
        } else if(gameState===1){
            console.log("Accepted enemy: " + selectedEnemy);
            $(`#${selectedEnemy}`).hide();;
            gameState=2;
            $("#title").text("Fight!");
        }
    });

});

function randomNumber (max=10, min=1){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}