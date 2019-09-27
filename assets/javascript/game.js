//Class that gives structure to each character object
class characterClass{
    constructor(name, HP, AP, critChance, attIcon, specAP, specCD, specIcon, img){
        this.name = name;
        this.maxHP = HP;
        this.HP = HP*5;
        this.AP = AP;
        this.critChance = critChance;
        this.attIcon = attIcon;
        this.specAP = specAP;
        this.specCD = specCD;
        this.specIcon = specIcon;
        this.img = img;
        this.lvl = 1;
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
            return [randomNumber(this.specAP,this.specAP),false];
        }
    }

    generateStartCard(){
        var newCol = $("<div>");
        newCol.attr("class", "col-lg-4 col-md-6");
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
        $("#"+this.name).children("h5").text(`Hero:${this.name} Lvl:${this.lvl}`);
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

//Array of objects that are constructed from characterClass
let characters = [
    new characterClass("Archer", 6, 8, 30, "far fa-bow-arrow", 16, 4, "far fa-bullseye-arrow", "assets/images/Archer.png"),
    new characterClass("Warrior", 10, 8, 10, "far fa-sword", 10, 2, "far fa-shield-alt", "assets/images/Warrior.png"),
    new characterClass("Rogue", 8, 6, 50, "far fa-dagger", 20, 6, "far fa-flask-poison", "assets/images/Rogue.png"),
    new characterClass("Mage", 6, 8, 30, "far fa-wand-magic", 16, 4, "far fa-book-spells", "assets/images/Mage.png"),
    new characterClass("Druid", 8, 8, 20, "far fa-staff", 20, 5, "far fa-paw-claws", "assets/images/Druid.png")
];

//Object with properties and methods singular to game, gE = gameEngine
let gE = {
    selectedHero:"",
    //hero:"",gE.hero = jQuery.extend(true, {}, characters[gE.index(gE.selectedHero)]);
    heroCD:"",
    selectedEnemy:"",
    alreadySelected:[],
    state:0,

    emptyCol:function(){
        var newCol = $("<div>");
        newCol.attr("class", "col-lg-4 col-md-0");
        $("#mainRow").append(newCol);
    },
    
    attack:function(dmg){
        if(dmg[1]){
            $(".modal-title").text("Critical Hit!");
            $(".modal-body").text(`You dealt ${dmg[0]/2} damage twice, for a total of ${dmg[0]}.`);
        } else{
            $(".modal-title").text("Hit!");
            $(".modal-body").text(`You dealt ${dmg[0]} damage.`);
        }
        characters[gE.index(gE.selectedEnemy)].HP -= dmg[0];
        characters[gE.index(gE.selectedEnemy)].updateHTML();
        $('#alert').modal('show');
    },
    
    specialAttack:function(dmg){
        if(dmg[1]){
            $(".modal-title").text("Critical Special Hit!");
            $(".modal-body").text(`You dealt ${dmg[0]/2} damage twice with your special attack, for a total of ${dmg[0]}.`);
        } else{
            $(".modal-title").text("Special Hit!");
            $(".modal-body").text(`You dealt ${dmg[0]} damage with your special attack!`);
        }
        characters[gE.index(gE.selectedEnemy)].HP -= dmg[0];
        characters[gE.index(gE.selectedEnemy)].updateHTML();
        $('#alert').modal('show');

        //Disable button & color CD red
        $("#cdSpan").css("color","darkred");
        $("#specAttBttn").attr("disabled",true);
    },
    
    counterAttack:function(dmg){
        if(dmg[1]){
            $('#alert2').children().children().children().children(".modal-title").text("Critical counter-hit!");
            $('#alert2').children().children().children(".modal-body").text(`You were dealt ${dmg[0]/2} damage twice, for a total of ${dmg[0]}.`);
        } else{
            $('#alert2').children().children().children().children(".modal-title").text("Counter-hit!");
            $('#alert2').children().children().children(".modal-body").text(`You were dealt ${dmg[0]} damage.`);
        }
        characters[gE.index(gE.selectedHero)].HP -= dmg[0];
        characters[gE.index(gE.selectedHero)].updateHTML();
        $('#alert2').modal('show');
    },

    cdCheck:function(){
        if(gE.heroCD>1){
            $("#cdSpan").text(`   CD: ${--gE.heroCD}`);
        } else{
            $("#cdSpan").text(`   CD: ${characters[gE.index(gE.selectedHero)].specCD}`);
            $("#specAttBttn").attr("disabled",false);
            $("#cdSpan").css("color","");
            gE.heroCD = characters[gE.index(gE.selectedHero)].specCD;
        }
    },

    index:function(value){
        for(let i = 0 ; i < characters.length ; i++){
            if(characters[i].name === value) return i;
        }
        return null;
    },

    enemyAlive:function(){
        if(characters[gE.index(gE.selectedEnemy)].HP>0) return true;
        else return false;
    },
    
    victory:function(){
        gE.state=3;
        $('#alert2').children().children().children().children(".modal-title").text(`Victory!`);
        $('#alert2').children().children().children(".modal-body").text(`You defeated the ${gE.selectedEnemy} and leveled up!`);
        $('#alert2').modal('show');

        //Leveling up
        characters[gE.index(gE.selectedHero)].lvl++;
        characters[gE.index(gE.selectedHero)].maxHP++;
        characters[gE.index(gE.selectedHero)].HP=characters[gE.index(gE.selectedHero)].maxHP*5;
        characters[gE.index(gE.selectedHero)].specAP+=2;
        characters[gE.index(gE.selectedHero)].critChance+=10;
    },

    gameEnd:function(won){
        var newP = $("<h2>");
        newP.attr("class","text-center col-12");
        if(won){
            $("#title").text("YOU WIN!!");
            newP.html(`
            You defeated all ${characters.length-1} enemies!<br>
            You reached level ${characters[this.index(this.selectedHero)].lvl}!<br>
            <br>
            Congratulations!!!
            `);
        } 
        else{ 
            $("#mainRow").empty();
            $("#title").text("YOU DIED...");
            newP.html(`
            You only defeated ${this.alreadySelected.length-2} enemies.<br>
            You died at level ${characters[this.index(this.selectedHero)].lvl}.<br>
            You died by the hands of the ${this.selectedEnemy}!<br>
            <br>
            Try again...
            `);
        }

        $("#mainRow").append(newP);
    },

    newEnemy:function(){
        $("#mainRow").empty();
        if(characters.length===this.alreadySelected.length){
            this.gameEnd(true);
        } else {
            $("#title").text("Choose a new enemy to fight!");

            for(let i = 0 ; i < characters.length ; i++){
                var already = false;
                for(let j = 0 ; j < this.alreadySelected.length ; j++){
                    if(characters[i].name===this.alreadySelected[j]){
                        already = true;
                        break;
                    }
                }
                if(!already){
                    characters[i].generateStartCard();
                    characters[i].updateHTML();
                }
            }
        }
    }
}

//Receiving clicks
$(document).ready(function() {

    //Tooltop Inizialization
    $(function () {$('[data-toggle="tooltip"]').tooltip()})

    //Character cards initialization
    for(let character of characters){
        character.generateStartCard();
        character.updateHTML();
    }

    //Clicking on a character
    $(document).on("click", ".character",function() {
        if(gE.state === 0){
            gE.selectedHero = $(this).attr('id').toString();
            console.log("Hero: "+gE.selectedHero);
            $(".modal-title").text("Confirm Class");
            $(".modal-body").text(`Your class will be ${gE.selectedHero}, confirm choice?`);
            $('#confirm').modal('show');
        } else if(gE.state === 1){
            gE.selectedEnemy = $(this).attr('id').toString();
            console.log("Enemy: "+gE.selectedEnemy);
            $(".modal-title").text("Confirm Enemy");
            $(".modal-body").text(`Your enemy will be ${gE.selectedEnemy}, confirm choice?`);
            $('#confirm').modal('show');
        }
    });

    //Clicking yes on Confirm (Choosing Hero and Enemies)
    $('#confirm').on('click', '#btnYes', function(){
        if(gE.state===0){
            console.log("Accepted Hero: " + gE.selectedHero);
            gE.heroCD = characters[gE.index(gE.selectedHero)].specCD;
            gE.state=1;
            $(`#${gE.selectedHero}`).parent().remove();;
            $("#title").text("Choose an enemy to fight!");
            gE.alreadySelected.push(gE.selectedHero);
        } else if(gE.state===1){
            console.log("Accepted enemy: " + gE.selectedEnemy);
            gE.state=2;
            $("#mainRow").empty();
            $("#title").text("Fight!");
            characters[gE.index(gE.selectedHero)].generateStartCard();
            characters[gE.index(gE.selectedHero)].updateHTML();
            characters[gE.index(gE.selectedHero)].addAttacks();
            gE.emptyCol();
            characters[gE.index(gE.selectedEnemy)].generateStartCard();
            characters[gE.index(gE.selectedEnemy)].updateHTML();
            $(`#${gE.selectedEnemy}`).children("h5").text(`Enemy: ${gE.selectedEnemy}`);
            gE.alreadySelected.push(gE.selectedEnemy);
        }
    });

    //Attacking
    $(document).on("click","#attBttn",function(){
        //Hero damages enemy
        gE.attack(characters[gE.index(gE.selectedHero)].attack);

        //Check if enemy died
        if(gE.enemyAlive()){
            //Enemy damages hero
            gE.counterAttack(characters[gE.index(gE.selectedEnemy)].attack);

            //Check if died
            if(characters[gE.index(gE.selectedHero)].HP <= 0) gE.gameEnd(false);
        } else{
            //Select new enemy
            gE.victory();
        }
        
        //Decrease special attack CD & refreshes it if done
        gE.cdCheck();
    });
    

    //Special Attacking
    $(document).on("click","#specAttBttn",function(){
        //Hero damages enemy & triggers CD
        gE.specialAttack(characters[gE.index(gE.selectedHero)].specAttack);

        //Check if enemy died
        if(gE.enemyAlive()){
            //Enemy damages hero
            gE.counterAttack(characters[gE.index(gE.selectedEnemy)].attack);

            //Check if died
            if(characters[gE.index(gE.selectedHero)].HP <= 0) gE.gameEnd(false);
        } else{
            //Select new enemy
            gE.victory();
        }
    });

    //Check if defeated an enemy
    $(document).on('hide.bs.modal','#alert2', function () {
        if(gE.state === 3){
            gE.newEnemy();
            gE.state = 1;
        }
    });


});

function randomNumber (max=10, min=1){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}