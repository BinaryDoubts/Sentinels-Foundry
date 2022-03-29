import * as dice from "../dice.js";
import * as status from "../status.js";

/**
 * An Actor sheet for hero or villain type actors.
 */

export default class SCRPGCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/scrpg/templates/sheets/heroCharacter-sheet.hbs",
            classes: ["SCRPG", "sheet", "actor"],
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "info" }]
        })
    }

    get template() {
        if (this.actor.data.type == "hero" || this.actor.data.type == "villain") {
            return "systems/scrpg/templates/sheets/heroCharacter-sheet.hbs";
        } else {
            return "systems/scrpg/templates/sheets/" + this.actor.data.type + "-sheet.hbs"
        }
    }


    getData() {
        const data = super.getData();
        data.config = CONFIG.SCRPG;
        //prepares items for actor

        if (this.actor.data.type == 'hero' || this.actor.data.type == 'villain') {
            this._prepareCharacterItems(data);
        } else if (this.actor.type == 'environment') {
            this._prepareEnvironmentItems(data);
        };
        return data;
    }

    //Prepares all items associated with the hero/villain sheets
    _prepareCharacterItems(sheetData) {
        const actorData = sheetData.actor;
        const abilities = [];
        const powers = [];
        const qualities = [];
        const heroMinions = [];
        const minionForms = [];
        const mods = [];
        const villainstatus = [];

        for (let i of sheetData.items) {
            i.img = i.img;
            if (i.type === "power") {
                powers.push(i);
            }
            if (i.type === "quality") {
                qualities.push(i)
            }
            if (i.type === "villainStatus") {
                villainstatus.push(i)
            }
            if (i.type === "heroMinion") {
                heroMinions.push(i)
            }
            if (i.type === "minionForm") {
                minionForms.push(i)
            }
            if (i.type === "mod") {
                mods.push(i)
            }
            else if (i.type === 'ability') {
                abilities.push(i)
            }
        }

        actorData.ability = abilities;
        actorData.power = powers;
        actorData.quality = qualities;
        actorData.heroMinion = heroMinions;
        actorData.minionForm = minionForms;
        actorData.mod = mods;
        actorData.villainStatus = villainstatus;
    }

    //Prepares all items associated with the environment sheets
    _prepareEnvironmentItems(sheetData) {
        const actorData = sheetData.actor
        const twists = [];

        for (let i of sheetData.items) {
            i.img = i.img;
            if (i.type === "environmentTwist") {
                twists.push(i);
            };
        }

        actorData.environmentTwist = twists;
    }

    getNextMinionIndex() {
        let minions = this.object.heroMinion;
        let names = [];
        let highestIndex = 0;

        for (let i = 0; i < minions.length; i++) {
            let curname = minions[i].name;
            let curindex;
            let minionPrefix = game.i18n.localize("SCRPG.sheet.newMinion");

            // Only check index if name starts with the minionPrefix
            if (curname.startsWith(minionPrefix)) {
                let curNamePostfix = curname.substring(minionPrefix.length);
                curindex = parseInt(curNamePostfix);
            }

            //Update highestindex
            if (!isNaN(curindex) && curindex > highestIndex) { highestIndex = curindex; }
        }

        return highestIndex + 1;
    }

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers
    /* -------------------------------------------- */

    activateListeners(html) {

        if (this.actor.isOwner) {
            //item creation
            html.find(".item-create").click(this._onItemCreate.bind(this));
            //item deletion
            html.find(".item-delete").click(this._onItemDelete.bind(this));
            //item edit
            html.find(".item-edit").click(this._onItemEdit.bind(this));
            //set power to main roll
            html.find(".set-power").click(this._onSetPower.bind(this));
            //set quality to main roll
            html.find(".set-quality").click(this._onSetQuality.bind(this));
            //set villain status to main roll
            html.find(".set-villain-status").click(this._onSetVillainStatus.bind(this));
            //roll set power, quality and status
            html.find(".make-roll").click(this._onMakeRoll.bind(this));
            //roll just power die
            html.find(".roll-power").click(this._onRollPower.bind(this));
            //roll just quality die
            html.find(".roll-quality").click(this._onRollQuality.bind(this));
            //roll just status die
            html.find(".roll-status").click(this._onRollStatus.bind(this));
            //update health ranges after max health update
            html.find(".max-update").focusout(this._onMaxUpdate.bind(this));
            //update status when health changed
            html.find(".health-update").focusout(this._onHealthUpdate.bind(this));
            //update status if status die type changed
            html.find(".status-die-update").focusout(this._onStatusDieUpdate.bind(this));
            //update status if scene changes
            html.find(".scene-update").focusout(this._onSceneUpdate.bind(this));
            //create new ability
            html.find(".add-ability").click(this._onAddAbility.bind(this));
            //create new power
            html.find(".create-power").click(this._onCreatePower.bind(this));
            //expand first green mode/form
            html.find(".show-green1").click(this._onShowGreen1.bind(this));
            //expand second green mode/form
            html.find(".show-green2").click(this._onShowGreen2.bind(this));
            //expand first yellow mode/form
            html.find(".show-yellow1").click(this._onShowYellow1.bind(this));
            //expand second yellow mode/form
            html.find(".show-yellow2").click(this._onShowYellow2.bind(this));
            //expand red mode/form
            html.find(".show-red1").click(this._onShowRed1.bind(this));
            //Set mode/form
            html.find(".set-mode").click(this._onSetMode.bind(this));
            //Turns on/off modular archetype for character
            html.find(".set-modular").click(this._onSetModular.bind(this));
            //Turns on/off formchanger archetype for character
            html.find(".set-formchanger").click(this._onSetFormChanger.bind(this));
            //Turns on/off divided
            html.find(".set-divided").click(this._onSetDivided.bind(this));
            //Turns on divided psyche powered mode and turns off civilian mode
            html.find(".set-powered").click(this._onSetPowered.bind(this));
            //Turns on divided psyche civilian mode and turns off powered mode
            html.find(".set-civilian").click(this._onSetCivilian.bind(this));
            //expand default mode/form
            html.find(".show-main").click(this._onShowMain.bind(this));
            //create new power
            html.find(".create-twist").click(this._onCreateTwist.bind(this));
            //roll minnion
            html.find(".roll-minion").click(this._onRollMinion.bind(this));
            //downgrade minion
            html.find(".downgrade-minion").click(this._onDowngradeMinion.bind(this));
            //create mod
            html.find(".create-mod").click(this._onCreateMod.bind(this));
        }


        super.activateListeners(html);
    }

    //checks item type and creates new item of that type
    _onItemCreate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemData = null;

        switch (element.dataset.type) {
            case "heroMinion":
                itemData = {
                    name: game.i18n.localize("SCRPG.sheet.newMinion") + " " + this.getNextMinionIndex(),
                    type: element.dataset.type
                };
                break;
            default:
                itemData = {
                    name: game.i18n.localize("SCRPG.sheet.newItem"),
                    type: element.dataset.type
                };
        }

        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    //deletes the closest item
    _onItemDelete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;

        let d = Dialog.confirm({
            title: "Delete",
            content: "<p>Are you sure you want to delete this item?</p>",
            yes: () => this.actor.deleteEmbeddedDocuments("Item", [itemId]),
            no: () => console.log("Foundry VTT | Item with id [" + itemId + "] was not deleted"),
            defaultYes: false
        });

        return d
    }

    //Opens item sheet so it can be edited
    _onItemEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true)
    }

    //Assigns power to main roll
    _onSetPower(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        //data.firstDie represents the die that will be used in the main roll for power
        this.actor.update({ "data.firstDie": item.data.data.dieType });
        this.actor.update({ "data.firstDieName": item.data.name });
    }

    //Assigns quality to main roll
    _onSetQuality(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        //data.secondDie represents the die that will be used in the main roll for quality
        this.actor.update({ "data.secondDie": item.data.data.dieType });
        this.actor.update({ "data.secondDieName": item.data.name });
    }

    // Reduces the minion die one type
    _onDowngradeMinion(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let dieNum = parseInt(item.data.data.dieType.match(/[0-9]+/g)[0]);
        if (dieNum > 4) {
            dieNum -= 2;
        }
        let dieType = "d" + dieNum;
        item.update({ "data.dieType": dieType });
    }

    //Assigns villain status to main roll
    _onSetVillainStatus(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        //data.thirdDie represents the die that will be used in the main roll for status
        this.actor.update({ "data.thirdDie": item.data.data.dieType });
        this.actor.update({ "data.thirdDieName": item.data.name });
    }

    //Rolls currently assigned power, quality and status
    _onMakeRoll(event) {
        event.preventDefault();
        let actor = this.actor;
        dice.TaskCheck(actor);
    }

    //Rolls just the power die
    _onRollPower(event) {
        event.preventDefault();
        //dice type and name of power
        let roll = this.actor.data.data.firstDie;
        let rollType = "power";
        let actor = this.actor
        if (this.actor.data.data.civilianMode == true) {
            rollType = "quality";
        };
        let rollName = this.actor.data.data.firstDieName;
        dice.SingleCheck(roll, rollType, rollName, actor);
    }

    //Rolls just the quality die
    _onRollQuality(event) {
        event.preventDefault();
        //dice type and name of quality
        let roll = this.actor.data.data.secondDie;
        let rollType = "quality";
        let actor = this.actor
        if (this.actor.data.data.poweredMode == true) {
            rollType = "power";
        };
        let rollName = this.actor.data.data.secondDieName;
        dice.SingleCheck(roll, rollType, rollName, actor);
    }

    //Rolls just the status die
    _onRollStatus(event) {
        event.preventDefault();
        //dice type and name of status
        let roll = this.actor.data.data.thirdDie;
        let rollType = "status";
        let rollName = this.actor.data.data.thirdDieName;
        let actor = this.actor
        dice.SingleCheck(roll, rollType, rollName, actor);
    }

    // Rolls the minion die
    _onRollMinion(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let rollName = item.data.name
        let rollType = "minion"
        let roll = item.data.data.dieType
        let actor = this.actor

        dice.SingleCheck(roll, rollType, rollName, actor);
    }

    //Updates heath ranges when Max health set
    _onMaxUpdate(event) {
        event.preventDefault();
        let element = event.currentTarget;

        let max = element.value;

        //health ranges as follows
        //max health: [greenLow, yellowhigh, yellowlow, redhigh]
        //red low is always 1
        var health = {
            40: [30, 29, 15, 14],
            39: [30, 29, 15, 14],
            38: [29, 28, 14, 13],
            37: [29, 28, 14, 13],
            36: [28, 27, 13, 12],
            35: [27, 26, 13, 12],
            34: [26, 25, 13, 12],
            33: [26, 25, 13, 12],
            32: [25, 24, 12, 11],
            31: [24, 23, 12, 11],
            30: [23, 22, 12, 11],
            29: [23, 22, 11, 10],
            28: [22, 21, 11, 10],
            27: [21, 20, 11, 10],
            26: [21, 20, 10, 9],
            25: [20, 19, 10, 9],
            24: [19, 18, 10, 9],
            23: [19, 18, 9, 8],
            22: [18, 17, 9, 8],
            21: [17, 16, 9, 8],
            20: [16, 15, 8, 7],
            19: [15, 14, 8, 7],
            18: [15, 14, 8, 7],
            17: [14, 13, 7, 6]
        };

        //updates actor data with new range values
        this.actor.update({ "data.health.greenLow": health[max][0] });
        this.actor.update({ "data.health.yellowHigh": health[max][1] });
        this.actor.update({ "data.health.yellowLow": health[max][2] });
        this.actor.update({ "data.health.redHigh": health[max][3] });
    }

    //updates status die when current health changes
    _onHealthUpdate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let health = parseFloat(element.value);
        let scene = this.actor.data.data.scene;
        let actor = this.actor;

        status.HealthUpdate(scene, health, actor);

    }

    //updates status die when any status die type is changed
    _onStatusDieUpdate(event) {
        event.preventDefault();
        let health = this.actor.data.data.wounds.value;
        let scene = this.actor.data.data.scene;
        let actor = this.actor;

        status.HealthUpdate(scene, health, actor);

    }

    //updates status die when scene status is changed
    _onSceneUpdate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let health = this.actor.data.data.wounds.value;
        let scene = element.value;
        let actor = this.actor;

        status.HealthUpdate(scene, health, actor);
    }

    //creates a new ability
    _onAddAbility(event) {
        event.preventDefault();
        let element = event.currentTarget;
        //checks datatype of element and assigns that to the ability aux
        //aux is used to determine where the ability goes, ex in a mode/form
        var aux = "green"
        if (element.dataset.aux) {
            aux = element.dataset.aux
        }

        let itemData = {
            name: game.i18n.localize("SCRPG.sheet.newItem"),
            type: element.dataset.type,
            "data.aux": aux
        };
        //creates new ability and assigns it to actor
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    //creates a new power
    _onCreatePower(event) {
        event.preventDefault();
        let element = event.currentTarget;
        //checks datatype of element and assigns that to the ability aux
        //aux is used to determine where the ability goes, ex in a mode/form
        var aux = "main"
        if (element.dataset.aux) {
            aux = element.dataset.aux
        }

        let itemData = {
            name: game.i18n.localize("SCRPG.sheet.newItem"),
            type: element.dataset.type,
            "data.aux": aux
        };
        //creates new power and assigns it to actor
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    //Displays or hides first green mode/form
    _onShowGreen1(event) {
        event.preventDefault();
        let display = this.actor.data.data.modeDisplayed.green1;
        if (display) {
            this.actor.update({ "data.modeDisplayed.green1": false });
        } else {
            this.actor.update({ "data.modeDisplayed.green1": true });
        }
    }

    //Displays or hides second green mode/form
    _onShowGreen2(event) {
        event.preventDefault();
        let display = this.actor.data.data.modeDisplayed.green2;
        if (display) {
            this.actor.update({ "data.modeDisplayed.green2": false });
        } else {
            this.actor.update({ "data.modeDisplayed.green2": true });
        }
    }

    //Displays or hides first yellow mode/form
    _onShowYellow1(event) {
        event.preventDefault();
        let display = this.actor.data.data.modeDisplayed.yellow1;
        if (display) {
            this.actor.update({ "data.modeDisplayed.yellow1": false });
        } else {
            this.actor.update({ "data.modeDisplayed.yellow1": true });
        }
    }

    //Displays or hides second yellow mode/form
    _onShowYellow2(event) {
        event.preventDefault();
        let display = this.actor.data.data.modeDisplayed.yellow2;
        if (display) {
            this.actor.update({ "data.modeDisplayed.yellow2": false });
        } else {
            this.actor.update({ "data.modeDisplayed.yellow2": true });
        }
    }

    //Displays or hides red mode/form
    _onShowRed1(event) {
        event.preventDefault();
        let display = this.actor.data.data.modeDisplayed.red1;
        if (display) {
            this.actor.update({ "data.modeDisplayed.red1": false });
        } else {
            this.actor.update({ "data.modeDisplayed.red1": true });
        }
    }

    //Applies the selected mode/form to the character
    _onSetMode(event) {
        event.preventDefault();
        let element = event.currentTarget;
        this.actor.update({ "data.mode": element.dataset.aux });
    }

    //Turns on and off modular
    //Disables formchanger if modular active
    _onSetModular(event) {
        if (this.actor.data.data.modular == true) {
            this.actor.update({ "data.mode": "main" });
            this.actor.update({ "data.modeDisplayed.green1": false });
            this.actor.update({ "data.modeDisplayed.green2": false });
            this.actor.update({ "data.modeDisplayed.yellow1": false });
            this.actor.update({ "data.modeDisplayed.yellow2": false });
            this.actor.update({ "data.modeDisplayed.red1": false });
        } else {
            this.actor.update({ "data.powerless": false });
            this.actor.update({ "data.formchanger": false });
            this.actor.update({ "data.divided": false })
            this.actor.update({ "data.poweredMode": false })
            this.actor.update({ "data.civilianMode": false })
            this.actor.update({ "data.mode": "main" });
        }
    }

    //Turns on and off formchanger
    //Disables modular if modular active
    _onSetFormChanger(event) {
        if (this.actor.data.data.formchanger == true) {
            this.actor.update({ "data.mode": "main" });
            this.actor.update({ "data.modeDisplayed.green1": false });
            this.actor.update({ "data.modeDisplayed.green2": false });
            this.actor.update({ "data.modeDisplayed.yellow1": false });
        } else {
            this.actor.update({ "data.modular": false });
            this.actor.update({ "data.powerless": true });
            this.actor.update({ "data.mode": "main" });
        }
    }

    //turns on the divided psyche mode and set the mode powered
    //turns off modular mode
    _onSetDivided(event) {
        let currentStatus = this.actor.data.data.thirdDieName;
        let actor = this.actor
        if (this.actor.data.data.divided == true) {
            this.actor.update({ "data.mode": "main" });
            this.actor.update({ "data.poweredMode": false });
            this.actor.update({ "data.civilianMode": false });
            this.actor.update({ "data.dividedStatus": false });
            this.actor.update({ "data.dividedPsyche": false });
            status.DividedHealthChange(currentStatus, actor)

        } else {
            this.actor.update({ "data.modular": false });
            this.actor.update({ "data.mode": "main" });
            this.actor.update({ "data.poweredMode": true });

        }
    }

    //Turns on divided psyche powered mode and turns off civilian mode
    _onSetPowered(event) {
        let currentStatus = this.actor.data.data.thirdDieName;
        let actor = this.actor
        if (this.actor.data.data.poweredMode == true) {
            this.actor.update({ "data.civilianMode": true });
        } else {
            this.actor.update({ "data.civilianMode": false });
        }
        status.DividedHealthChange(currentStatus, actor)
    }

    //Turns on divided psyche civilian mode and turns off powered mode
    _onSetCivilian(event) {
        let currentStatus = this.actor.data.data.thirdDieName;
        let actor = this.actor
        if (this.actor.data.data.civilianMode == true) {
            this.actor.update({ "data.poweredMode": true });
        } else {
            this.actor.update({ "data.poweredMode": false });
        }
        status.DividedHealthChange(currentStatus, actor)
    }

    //Displays or hides red mode/form
    _onShowMain(event) {
        event.preventDefault();
        let display = this.actor.data.data.modeDisplayed.main;
        if (display) {
            this.actor.update({ "data.modeDisplayed.main": false });
        } else {
            this.actor.update({ "data.modeDisplayed.main": true });
        }
    }

    //creates a new mod
    _onCreateMod(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let named = false;
        let name = game.i18n.localize("SCRPG.sheet.newItem");
        //checks datatype of element and assigns that to the ability value
        //value is used to determine where the ability goes, ex in a mode/form
        var value = "+1"
        if (element.dataset.value) {
            value = element.dataset.value
        }

        if (this.actor.data.data.modName != "") {
            name = this.actor.data.data.modName
            named = true;
        }

        let itemData = {
            name: name,
            type: element.dataset.type,
            "data.named": named,
            "data.value": value,
            "data.persistant": this.actor.data.data.persistant,
            "data.exclusive": this.actor.data.data.exclusive
        };
        this.actor.update({ "data.persistant": false });
        this.actor.update({ "data.exclusive": false });
        this.actor.update({ "data.modName": "" })

        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    //creates a new environment twist
    _onCreateTwist(event) {
        event.preventDefault();
        let element = event.currentTarget;
        //checks datatype of element and assigns that to the ability aux
        //aux is used to determine where the ability goes, ex in a mode/form
        var aux = "greenminor"
        if (element.dataset.aux) {
            aux = element.dataset.aux
        }

        let itemData = {
            name: game.i18n.localize("SCRPG.sheet.newItem"),
            type: element.dataset.type,
            "data.type": aux
        };
        //creates new power and assigns it to actor
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }
}