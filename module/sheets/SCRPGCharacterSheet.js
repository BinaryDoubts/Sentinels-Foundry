import * as dice from "../dice.js";
import * as status from "../status.js";
import * as scene from "../scene.js";

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
    itemContextMenu = [
        {
            name: game.i18n.localize("SCRPG.button.edit"),
            icon: '<i class="fas fa-edit"></i>',
            callback: element => {
                const item = this.actor.items.get(element.data("item-id"));
                item.sheet.render(true);
            }
        },
        {
            name: game.i18n.localize("SCRPG.button.delete"),
            icon: '<i class="fas fa-trash"></i>',
            callback: element => {
                this.actor.deleteEmbeddedDocuments("Item", [element.data("item-id")])
            }
        }
    ]

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
        } else if (this.actor.type == 'scene') {
            this._prepareSceneTrackerItems(data);
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
        const minionForms = [];
        const heroMinions = [];

        for (let i of sheetData.items) {
            i.img = i.img;
            if (i.type === "environmentTwist") {
                twists.push(i);
            };
            if (i.type === "heroMinion") {
                heroMinions.push(i)
            };
            if (i.type === "minionForm") {
                minionForms.push(i)
            };
        }

        actorData.heroMinion = heroMinions;
        actorData.minionForm = minionForms;
        actorData.environmentTwist = twists;
    }

    _prepareSceneTrackerItems(sheetData) {
        const actorData = sheetData.actor;
        const inits = [];

        for (let i of sheetData.items) {
            i.img = i.img;
            if (i.type === "initiativeActor") {
                inits.push(i)
            }
        }

        actorData.initiativeActor = inits;
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

            new ContextMenu(html, ".ability-item", this.itemContextMenu);
            new ContextMenu(html, ".power-item", this.itemContextMenu);
            new ContextMenu(html, ".quality-item", this.itemContextMenu);
            new ContextMenu(html, ".villain-status-item", this.itemContextMenu);
            new ContextMenu(html, ".mod-item", this.itemContextMenu);
            new ContextMenu(html, ".environmentTwist-item", this.itemContextMenu);
            new ContextMenu(html, ".heroMinion-item", this.itemContextMenu);
            new ContextMenu(html, ".minionForm-item", this.itemContextMenu);
            new ContextMenu(html, ".initiativeActor-item", this.itemContextMenu);

            //item creation
            html.find(".item-create").click(this._onItemCreate.bind(this));
            //item deletion
            html.find(".item-delete").click(this._onItemDelete.bind(this));
            //item edit
            html.find(".item-edit").click(this._onItemEdit.bind(this));
            //edit items on character sheet
            html.find(".inline-edit").change(this._onItemEditInline.bind(this))
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
            html.find(".health-update").change(this._onHealthUpdate.bind(this));
            //update status if status die type changed
            html.find(".status-die-update").focusout(this._onStatusDieUpdate.bind(this));
            //update status if scene changes
            html.find(".scene-update").focusout(this._onSceneUpdate.bind(this));
            //create new ability
            html.find(".add-ability").click(this._onAddAbility.bind(this));
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
            //Turns off powerless
            html.find(".set-powerless").click(this._onSetPowerless.bind(this));
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
            //upgrade minion
            html.find(".upgrade-minion").click(this._onUpgradeMinion.bind(this));
            //create mod
            html.find(".create-mod").click(this._onCreateMod.bind(this));
            //push ability to chat
            html.find(".roll-item").click(this._onRollItem.bind(this));
            //Select the current Scene status
            html.find(".set-scene").click(this._onSetScene.bind(this));
            //Change the number of elements in a scene
            html.find(".update-scene").focusout(this._onUpdateScene.bind(this));
            //Set Scene Tracker to standard settings
            html.find(".scene-tracker-setting").click(this._onSceneTrackerSetting.bind(this));
            //Changes status from available to done  and back
            html.find(".change-acted-status").click(this._onChangeActedStatus.bind(this));
            //Open and closes Scene tracker options
            html.find(".scene-options").click(this._onSceneOptions.bind(this));
            //mod select
            html.find(".mod-select").click(this._onModSelect.bind(this));
            //DeleteAll
            html.find(".delete-all").click(this._onDeleteAll.bind(this));
            //Changes status of all to available
            html.find(".reset-initiative").click(this._onResetInitiative.bind(this));
            //Increases player health by 1 and then updates status
            html.find(".increase-health").click(this._onIncreaseHealth.bind(this));
            //Decreases player health by 1 and then updates status
            html.find(".decrease-health").click(this._onDecreaseHealth.bind(this));
        }

        super.activateListeners(html);
    }

    //checks item type and creates new item of that type
    _onItemCreate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let action = "all"
        let itemData = null;
        var aux = "main";

        switch (element.dataset.type) {
            case "power":
                if (element.dataset.aux) {
                    aux = element.dataset.aux
                }
                itemData = {
                    name: game.i18n.localize("SCRPG.sheet.newItem"),
                    type: element.dataset.type,
                    "data.aux": aux
                }
                break;
            case "heroMinion":
                if (this.actor.type == "hero") {
                    action = "attack"
                }
                itemData = {
                    name: game.i18n.localize("SCRPG.sheet.newMinion") + " " + this.getNextMinionIndex(),
                    type: element.dataset.type,
                    "data.action": action
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

    //Rolls an item into the chat
    _onRollItem(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);

        dice.ItemRoll(item);
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

    //deletes all
    _onDeleteAll(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemsId = this.actor.items.filter(it => it.data.type == element.dataset.type).map(m => m.data._id);
        let content = ""

        switch (element.dataset.type) {
            case "mod":
                content = "<p>Are you sure you want to delete all Bonuses and Penalties?</p>"
                break
            case "heroMinion":
                content = "<p>Are you sure you want to delete all Hero Minions?</p>"
                break
            case "initiativeActor":
                content = "<p>Are you sure you want to clear the Initiative Tracker?</p>"
                break
        }

        let d = Dialog.confirm({
            title: "Delete",
            content: content,
            yes: () => this.actor.deleteEmbeddedDocuments("Item", itemsId),
            no: () => console.log("Foundry VTT | Items of type " + element.dataset.type + " were not deleted"),
            defaultYes: false
        });

        return d;
    }

    //Opens item sheet so it can be edited
    _onItemEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true)
    }

    //edit items on character sheet
    _onItemEditInline(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let field = element.dataset.field;

        return item.update({ [field]: element.value })
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

    // Increases the minion die one type
    _onUpgradeMinion(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let dieNum = parseInt(item.data.data.dieType.match(/[0-9]+/g)[0]);
        if (dieNum < 12) {
            dieNum += 2;
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
            36: [28, 27, 14, 13],
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
            this.actor.update({ "data.dividedPsyche": false })
            this.actor.update({ "data.dividedStatus": false })
            this.actor.update({ "data.poweredMode": false })
            this.actor.update({ "data.civilianMode": false })
            this.actor.update({ "data.mode": "main" });
        }
    }

    _onSetPowerless(event) {
        if (this.actor.data.data.powerless == true) {
            this.actor.update({ "data.mode": "main" })
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

    //deletes the closest item
    _onModSelect(event) {
        event.preventDefault();

        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let isExclusive = item.data.data.exclusive;
        let updatedSelectedValue = !item.data.data.selected;

        //if exclusive, deselect all other exclusive mods
        if (isExclusive && updatedSelectedValue) {
            let isBonus = parseInt(item.data.data.value) > 0;       //Check if Bonus or Penality
            let otherExclusives;

            if (isBonus) {
                otherExclusives = this.actor.items.filter(it => it.data.type == "mod" && it.data.data.exclusive == true && parseInt(it.data.data.value) > 0);
            }
            else {
                otherExclusives = this.actor.items.filter(it => it.data.type == "mod" && it.data.data.exclusive == true && parseInt(it.data.data.value) < 0);
            }

            //Foreach exclusive, deselect
            otherExclusives.forEach(oe => oe.update({ 'data.selected': false }))
        }

        //Toggle selected state for current
        item.update({ 'data.selected': updatedSelectedValue });
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

    //Increases health by 1 and then updates status
    _onIncreaseHealth(event) {
        event.preventDefault();
        let health = this.actor.data.data.wounds.value + 1;
        let scene = this.actor.data.data.scene;
        let actor = this.actor;
        if (health <= this.actor.data.data.wounds.max) {
            status.HealthUpdate(scene, health, actor);
            this.actor.update({ "data.wounds.value": health });
        }
    }

    //Decreased health by 1 and then updates status
    _onDecreaseHealth(event) {
        event.preventDefault();
        let health = this.actor.data.data.wounds.value - 1;
        let scene = this.actor.data.data.scene;
        let actor = this.actor;
        if (health >= 0) {
            status.HealthUpdate(scene, health, actor);
            this.actor.update({ "data.wounds.value": health });
        }
    }

    async _onDropItem(event, data) {
        if (!this.actor.isOwner) return false;
        const item = await Item.implementation.fromDropData(data);
        const itemData = item.toObject();

        switch (itemData.type) {
            case "principles":
                if (this.checkDropTarget(event, "DroppableFirstPrinciple")) {
                    this.actor.update({ "data.firstPrinciple.name": itemData.name });
                    this.actor.update({ "data.firstPrinciple.roleplaying": itemData.data.roleplaying });
                    this.actor.update({ "data.firstPrinciple.minorTwist": itemData.data.minorTwist });
                    this.actor.update({ "data.firstPrinciple.majorTwist": itemData.data.majorTwist });
                }

                if (this.checkDropTarget(event, "DroppableSecondPrinciple")) {
                    this.actor.update({ "data.secondPrinciple.name": itemData.name });
                    this.actor.update({ "data.secondPrinciple.roleplaying": itemData.data.roleplaying });
                    this.actor.update({ "data.secondPrinciple.minorTwist": itemData.data.minorTwist });
                    this.actor.update({ "data.secondPrinciple.majorTwist": itemData.data.majorTwist });
                }

                return false;
            case "backgrounds":
                this.actor.update({ "data.background": itemData.name });
                return false;
            case "powerSources":
                this.actor.update({ "data.powerSource": itemData.name });
                return false;
            case "archetypes":
                this.actor.update({ "data.archetype": itemData.name });
                return false;
            case "personality":
                this.actor.update({ "data.personality": itemData.name });
                this.actor.update({ "data.out": itemData.data.out });
                this.actor.update({ "data.statusDie.green": itemData.data.statusDie.green });
                this.actor.update({ "data.statusDie.yellow": itemData.data.statusDie.yellow });
                this.actor.update({ "data.statusDie.red": itemData.data.statusDie.red });
                return false;
        }


        // Handle item sorting within the same Actor
        if (await this._isFromSameActor(data)) return this._onSortItem(event, itemData);

        // Create the owned item
        return this._onDropItemCreate(itemData);
    }

    // Helper Function for _onDropItem. target example: "DroppableFirstPrinciple"
    checkDropTarget(event, target) {
        //Checks if any parts of the elements have the class name

        function checkClass(event, target) {
            if (event.srcElement.className.includes(target)) { return true; }
            if (!event.srcElement.parentElement) { return false; }
            return checkClassRecursive(event.srcElement.parentElement, target);
        }


        function checkClassRecursive(pElement, target) {
            if (pElement.className.includes(target)) { return true; }
            if (!pElement.parentElement) { return false; }
            return checkClassRecursive(pElement.parentElement, target);
        }

        if (event.path) {
            for (let i = 0; i < event.path.length; i++) {
                if (event.path[i].className != null && event.path[i].className.includes(target)) {
                    return true;
                }
            }
        } else {
            return checkClass(event, target);
        }

        return false;

    }

    //When selecting a space on the scene, updates all section that should be selected and updates character scene
    _onSetScene(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let current = parseInt(element.dataset.num);
        let greenCurrent = this.actor.data.data.greenSpace.current;
        let greenSetting = this.actor.data.data.greenSpace.setting;
        let yellowCurrent = this.actor.data.data.yellowSpace.current;
        let yellowSetting = this.actor.data.data.yellowSpace.setting;
        let redCurrent = this.actor.data.data.redSpace.current;
        let redSetting = this.actor.data.data.redSpace.setting;

        switch (element.dataset.color) {
            case "green":
                if (greenSetting == current && (yellowCurrent == 0 || redCurrent > 0 || yellowCurrent == yellowSetting)) {
                    scene.SetYellow();
                    scene.SceneChat("yellow")
                } else if (current < greenSetting && greenSetting == greenCurrent) {
                    scene.SetGreen();
                    scene.SceneChat("green")
                }
                this.actor.update({ "data.greenSpace.current": current });
                this.actor.update({ "data.yellowSpace.current": 0 });
                this.actor.update({ "data.redSpace.current": 0 });
                if (greenCurrent == current && yellowCurrent == 0) {
                    scene.SceneReset(this.actor);
                    scene.SetGreen();
                    scene.SceneChat("reset")
                }
                break

            case "yellow":
                if ((greenCurrent < greenSetting || yellowCurrent == yellowSetting) && current != yellowSetting) {
                    scene.SetYellow();
                    scene.SceneChat("yellow")
                } else if (yellowSetting == current && yellowCurrent < yellowSetting) {
                    scene.SetRed();
                    scene.SceneChat("red")
                }
                this.actor.update({ "data.yellowSpace.current": current });
                this.actor.update({ "data.greenSpace.current": greenSetting });
                this.actor.update({ "data.redSpace.current": 0 });
                if (yellowCurrent == current && redCurrent == 0) {
                    scene.SceneReset(this.actor);
                    scene.SetGreen();
                    scene.SceneChat("reset")
                }
                break

            case "red":
                this.actor.update({ "data.redSpace.current": current });
                if (redSetting == current) {
                    scene.SceneChat("failure")
                    scene.SetRed();
                } else if (yellowCurrent < this.actor.data.data.yellowSpace.setting) {
                    scene.SetRed();
                    scene.SceneChat("red")
                }
                this.actor.update({ "data.yellowSpace.current": yellowSetting });
                this.actor.update({ "data.greenSpace.current": greenSetting });
                if (redCurrent == current) {
                    scene.SceneReset(this.actor);
                    scene.SetGreen();
                    scene.SceneChat("reset")
                }
        }
    }

    //when changing the number of scene elements updates selected elements
    _onUpdateScene(event) {
        event.preventDefault();
        scene.SceneReset(this.actor);
        scene.SetGreen();
    }

    //Set the scene tracker to one of the defaults from the books
    _onSceneTrackerSetting(event) {
        event.preventDefault();
        let element = event.currentTarget;

        switch (element.dataset.type) {
            case "standard":
                this.actor.update({ "data.greenSpace.setting": 2 });
                this.actor.update({ "data.yellowSpace.setting": 4 });
                this.actor.update({ "data.redSpace.setting": 2 });
                break;
            case "prolonged":
                this.actor.update({ "data.greenSpace.setting": 3 });
                this.actor.update({ "data.yellowSpace.setting": 5 });
                this.actor.update({ "data.redSpace.setting": 3 });
                break;
            case "epic":
                this.actor.update({ "data.greenSpace.setting": 1 });
                this.actor.update({ "data.yellowSpace.setting": 3 });
                this.actor.update({ "data.redSpace.setting": 4 });
                break;
        }
        scene.SceneReset(this.actor);
        scene.SetGreen();
    }

    //Changes status from acted to has not acted and back
    _onChangeActedStatus(event) {
        event.preventDefault()
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        if (item.data.data.acted) {
            item.update({ "data.acted": false });
        } else {
            item.update({ "data.acted": true });
        }

    }

    _onResetInitiative(event) {
        event.preventDefault()
        let element = event.currentTarget;
        let itemsId = this.actor.items.filter(it => it.data.type == element.dataset.type).map(m => m.data._id);
        for (let i = 0; i < itemsId.length; i++) {
            this.actor.items.get(itemsId[i]).update({ "data.acted": false });;
        }
    }

    _onSceneOptions() {
        if (this.actor.data.data.options) {
            this.actor.update({ "data.options": false })
        } else {
            this.actor.update({ "data.options": true })
        }
    }
}