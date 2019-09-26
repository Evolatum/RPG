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

console.log("Testing warrior attack: " + characters[1].attack);
console.log("Testing warrior special attack: " + characters[1].specAttack);

for(let character of characters) character.updateHTML();

//Tooltop Inizialization
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

function randomNumber (max=10, min=1){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }