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
        if (this.actor.type == "hero" || this.actor.type == "villain") {
            return "systems/scrpg/templates/sheets/heroCharacter-sheet.hbs";
        } else {
            return "systems/scrpg/templates/sheets/" + this.actor.type + "-sheet.hbs"
        }
    }


    async getData(options) {
        const data = super.getData(options);
        data.config = CONFIG.SCRPG;

        if (this.actor.type == "hero") {
            data.enrichedModeDescriptionMain = await TextEditor.enrichHTML(this.object.system.modeDescription.main, { async: true });
            data.enrichedModeDescriptionGreen1 = await TextEditor.enrichHTML(this.object.system.modeDescription.Green1, { async: true });
            data.enrichedModeDescriptionGreen2 = await TextEditor.enrichHTML(this.object.system.modeDescription.Green2, { async: true });
            data.enrichedModeDescriptionYellow1 = await TextEditor.enrichHTML(this.object.system.modeDescription.yellow1, { async: true });
            data.enrichedModeDescriptionYellow2 = await TextEditor.enrichHTML(this.object.system.modeDescription.yellow2, { async: true });
            data.enrichedModeDescriptionRed1 = await TextEditor.enrichHTML(this.object.system.modeDescription.red1, { async: true });
            data.enrichedCostume = await TextEditor.enrichHTML(this.object.system.costume, { async: true });
            data.enrichedFirstPrincipleRoleplaying = await TextEditor.enrichHTML(this.object.system.firstPrinciple.roleplaying, { async: true });
            data.enrichedFirstPrincipleMinorTwist = await TextEditor.enrichHTML(this.object.system.firstPrinciple.minorTwist, { async: true });
            data.enrichedFirstPrincipleMajorTwist = await TextEditor.enrichHTML(this.object.system.firstPrinciple.majorTwist, { async: true });
            data.enrichedSecondPrincipleRoleplaying = await TextEditor.enrichHTML(this.object.system.secondPrinciple.roleplaying, { async: true });
            data.enrichedSecondPrincipleMinorTwist = await TextEditor.enrichHTML(this.object.system.secondPrinciple.minorTwist, { async: true });
            data.enrichedSecondPrincipleMajorTwist = await TextEditor.enrichHTML(this.object.system.secondPrinciple.majorTwist, { async: true });
        }

        //prepares items for actor
        if (this.actor.type == 'hero' || this.actor.type == 'villain') {
            this._prepareCharacterItems(data);
        } else if (this.actor.type == 'environment') {
            this._prepareEnvironmentItems(data);
        } else if (this.actor.type == 'scene') {
            this._prepareSceneTrackerItems(data);
        } else if (this.actor.type == 'minion') {
            this._prepareMinionItems(data);
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

    _prepareMinionItems(sheetData) {
        const actorData = sheetData.actor;
        const heroMinions = [];
        const minionForms = [];

        for (let i of sheetData.items) {
            i.img = i.img;
            if (i.type === "heroMinion") {
                heroMinions.push(i)
            };
            if (i.type === "minionForm") {
                minionForms.push(i)
            };
        }

        actorData.heroMinion = heroMinions;
        actorData.minionForm = minionForms;
    }

    getNextMinionIndex(group = 1, minionName = null) {
        let minions = this.object.heroMinion;
        let names = [];
        let highestIndex = 0;

        for (let i = 0; i < minions.length; i++) {
            let curname = minions[i].name;
            let curindex;
            let minionPrefix = game.i18n.localize("SCRPG.sheet.newMinion");

            if (minionName) {
                minionPrefix = minionName;
            }

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
            //Set mode/form
            html.find(".change-mode").change(this._onChangeMode.bind(this));
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
            //push out ability to chat
            html.find(".roll-out").click(this._onRollOut.bind(this));
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
            //Displays Scene in Chat
            html.find(".display-scene").click(this._onDisplayScene.bind(this));
            //mod select
            html.find(".mod-select").click(this._onModSelect.bind(this));
            //DeleteAll
            html.find(".delete-all").click(this._onDeleteAll.bind(this));
            //Deletes all minions
            html.find(".delete-all-minions").click(this._onDeleteAllMinions.bind(this));
            //Changes status of all to available
            html.find(".reset-initiative").click(this._onResetInitiative.bind(this));
            //Increases player health by 1 and then updates status
            html.find(".increase-health").click(this._onIncreaseHealth.bind(this));
            //Decreases player health by 1 and then updates status
            html.find(".decrease-health").click(this._onDecreaseHealth.bind(this));
            //Roll all minions
            html.find(".roll-all-minions").click(this._onRollAllMinions.bind(this));
        }

        super.activateListeners(html);
    }

    //checks item type and creates new item of that type
    _onItemCreate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let action = "all"
        let dieType = "d4";
        let itemData = null;
        var aux = "main";
        var group = 1;
        let minionName = "";

        switch (element.dataset.type) {
            case "power":
                if (element.dataset.aux) {
                    aux = element.dataset.aux;
                }
                itemData = {
                    name: game.i18n.localize("SCRPG.sheet.newItem"),
                    type: element.dataset.type,
                    "system.aux": aux
                }
                break;
            case "heroMinion":
                if (element.dataset.group) {
                    group = parseInt(element.dataset.group);
                    switch (group) {
                        case 1: minionName = this.actor.system.groupName.one
                            break
                        case 2: minionName = this.actor.system.groupName.two
                            break
                        case 3: minionName = this.actor.system.groupName.three
                            break
                        case 4: minionName = this.actor.system.groupName.four
                            break
                        case 5: minionName = this.actor.system.groupName.five
                            break
                        case 6: minionName = this.actor.system.groupName.six
                            break
                        case 7: minionName = this.actor.system.groupName.seven
                            break
                        case 8: minionName = this.actor.system.groupName.eight
                            break
                        case 9: minionName = this.actor.system.groupName.nine
                            break
                        case 10: minionName = this.actor.system.groupName.ten
                            break
                    }
                    if (minionName == "") {
                        minionName = game.i18n.localize("SCRPG.sheet.newMinion")
                    }
                }
                if (this.actor.type == "hero") {
                    action = "attack";
                }
                if (element.dataset.dietype) {
                    dieType = element.dataset.dietype
                }
                if (this.actor.type == "minion") {
                    itemData = {
                        name: minionName + " " + this.getNextMinionIndex(1, minionName),
                        type: element.dataset.type,
                        "system.action": action,
                        "system.group": group,
                        "system.dieType": dieType
                    };
                } else {
                    itemData = {
                        name: game.i18n.localize("SCRPG.sheet.newMinion") + " " + this.getNextMinionIndex(),
                        type: element.dataset.type,
                        "system.action": action,
                        "system.group": group
                    };
                }
                break;
            case "minionForm":
                if (element.dataset.group) {
                    group = parseInt(element.dataset.group);
                }
                itemData = {
                    name: game.i18n.localize("SCRPG.sheet.newItem"),
                    type: element.dataset.type,
                    "system.group": group
                }
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

    //Rolls out ability into chat
    _onRollOut(event) {
        event.preventDefault();
        dice.OutRoll(this.actor.system.out);
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
        let itemsId = this.actor.items.filter(it => it.type == element.dataset.type).map(m => m._id);
        let content = ""

        switch (element.dataset.type) {
            case "mod":
                content = "<p>Are you sure you want to delete all Bonuses and Penalties?</p>"
                break
            case "heroMinion":
                content = "<p>Are you sure you want to delete all Minions?</p>"
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

    //deletes all minions in a group
    _onDeleteAllMinions(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemsId = this.actor.items.filter(it => it.type == element.dataset.type && it.system.group == parseInt(element.dataset.group)).map(m => m._id);
        console.log(itemsId)
        let content = ""

        content = "<p>Are you sure you want to delete all Minions in this group?</p>"

        let d = Dialog.confirm({
            title: "Delete",
            content: content,
            yes: () => this.actor.deleteEmbeddedDocuments("Item", itemsId),
            no: () => console.log("Foundry VTT | Items of type " + element.dataset.type + " were not deleted in group " + element.dataset.group),
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
        let itemSelected = item.system.selected
        let otherPowers = [];

        if (itemSelected == "power") {
            this.actor.update({ "system.firstDie": "d4" });
            this.actor.update({ "system.firstDieName": game.i18n.localize("SCRPG.sheet.newItem") });
            item.update({ "system.selected": null });
        } else {
            if (itemSelected == "quality") {
                this.actor.update({ "system.secondDie": "d4" });
                this.actor.update({ "system.secondDieName": game.i18n.localize("SCRPG.sheet.newItem") });
            }
            this.actor.update({ "system.firstDie": item.system.dieType });
            this.actor.update({ "system.firstDieName": item.name });
            item.update({ "system.selected": "power" });
            if (this.actor.system.civilianMode) {
                otherPowers = this.actor.items.filter(it => (it.type == "quality" && it.key != itemId && it.system.selected != "quality") || it.type == "power");
            } else {
                otherPowers = this.actor.items.filter(it => it.type == "power" && it.key != itemId && it.system.selected != "quality");
            }
            otherPowers.forEach(oe => oe.update({ 'system.selected': null }));
        }
    }

    //Assigns quality to main roll
    _onSetQuality(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let itemSelected = item.system.selected
        let otherPowers = [];

        if (itemSelected == "quality") {
            this.actor.update({ "system.secondDie": "d4" });
            this.actor.update({ "system.secondDieName": game.i18n.localize("SCRPG.sheet.newItem") });
            item.update({ "system.selected": null });
        } else {
            if (itemSelected == "power") {
                this.actor.update({ "system.firstDie": "d4" });
                this.actor.update({ "system.firstDieName": game.i18n.localize("SCRPG.sheet.newItem") });
            }
            this.actor.update({ "system.secondDie": item.system.dieType });
            this.actor.update({ "system.secondDieName": item.name });
            item.update({ "system.selected": "quality" });
            if (this.actor.system.poweredMode) {
                otherPowers = this.actor.items.filter(it => (it.type == "power" && it.key != itemId && it.system.selected != "power") || it.type == "quality");
            } else {
                otherPowers = this.actor.items.filter(it => it.type == "quality" && it.key != itemId && it.system.selected != "power");
            }
            otherPowers.forEach(oe => oe.update({ 'system.selected': null }));
        }

    }

    //Assigns villain status to main roll
    _onSetVillainStatus(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let itemSelected = item.system.selected

        if (itemSelected) {
            this.actor.update({ "system.thirdDie": "d4" });
            this.actor.update({ "system.thirdDieName": game.i18n.localize("SCRPG.sheet.newItem") });
            item.update({ "system.selected": false });
        } else {
            //system.secondDie represents the die that will be used in the main roll for quality
            let otherPowers = [];
            this.actor.update({ "system.thirdDie": item.system.dieType });
            this.actor.update({ "system.thirdDieName": item.name });
            item.update({ "system.selected": true });
            otherPowers = this.actor.items.filter(it => it.type == "villainStatus" && it.key != itemId);
            otherPowers.forEach(oe => oe.update({ 'system.selected': false }));
        }
    }

    // Reduces the minion die one type
    _onDowngradeMinion(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let dieNum = parseInt(item.system.dieType.match(/[0-9]+/g)[0]);
        if (dieNum > 4) {
            dieNum -= 2;
        }
        let dieType = "d" + dieNum;
        item.update({ "system.dieType": dieType });
    }

    // Increases the minion die one type
    _onUpgradeMinion(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let dieNum = parseInt(item.system.dieType.match(/[0-9]+/g)[0]);
        if (dieNum < 12) {
            dieNum += 2;
        }
        let dieType = "d" + dieNum;
        item.update({ "system.dieType": dieType });
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
        let roll = this.actor.system.firstDie;
        let rollType = "power";
        let actor = this.actor
        if (this.actor.system.civilianMode == true) {
            rollType = "quality";
        };
        let rollName = this.actor.system.firstDieName;
        dice.SingleCheck(roll, rollType, rollName, actor);
    }

    //Rolls just the quality die
    _onRollQuality(event) {
        event.preventDefault();
        //dice type and name of quality
        let roll = this.actor.system.secondDie;
        let rollType = "quality";
        let actor = this.actor
        if (this.actor.system.poweredMode == true) {
            rollType = "power";
        };
        let rollName = this.actor.system.secondDieName;
        dice.SingleCheck(roll, rollType, rollName, actor);
    }

    //Rolls just the status die
    _onRollStatus(event) {
        event.preventDefault();
        //dice type and name of status
        let roll = this.actor.system.thirdDie;
        let rollType = "status";
        let rollName = this.actor.system.thirdDieName;
        let actor = this.actor
        dice.SingleCheck(roll, rollType, rollName, actor);
    }

    // Rolls the minion die
    _onRollMinion(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let rollName = item.name;
        let rollType = "minion";
        let roll = item.system.dieType;
        let actor = this.actor;

        dice.SingleCheck(roll, rollType, rollName, actor);
    }

    _onRollAllMinions(event) {
        event.preventDefault;
        let element = event.currentTarget;
        let actor = this.actor;

        dice.RollAllMinions(actor, element.dataset.group);
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
        this.actor.update({ "system.health.greenLow": health[max][0] });
        this.actor.update({ "system.health.yellowHigh": health[max][1] });
        this.actor.update({ "system.health.yellowLow": health[max][2] });
        this.actor.update({ "system.health.redHigh": health[max][3] });
    }

    //updates status die when current health changes
    _onHealthUpdate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let health = parseFloat(element.value);
        let scene = this.actor.system.scene;
        let actor = this.actor;

        status.HealthUpdate(scene, health, actor);

    }

    //updates status die when any status die type is changed
    _onStatusDieUpdate(event) {
        event.preventDefault();
        let health = this.actor.system.wounds.value;
        let scene = this.actor.system.scene;
        let actor = this.actor;

        status.HealthUpdate(scene, health, actor);

    }

    //updates status die when scene status is changed
    _onSceneUpdate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let health = this.actor.system.wounds.value;
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
            "system.aux": aux
        };
        //creates new ability and assigns it to actor
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    //Displays or hides first green mode/form
    _onShowGreen1(event) {
        event.preventDefault();
        let display = this.actor.system.modeDisplayed.green1;
        if (display) {
            this.actor.update({ "system.modeDisplayed.green1": false });
        } else {
            this.actor.update({ "system.modeDisplayed.green1": true });
        }
    }

    //Displays or hides second green mode/form
    _onShowGreen2(event) {
        event.preventDefault();
        let display = this.actor.system.modeDisplayed.green2;
        if (display) {
            this.actor.update({ "system.modeDisplayed.green2": false });
        } else {
            this.actor.update({ "system.modeDisplayed.green2": true });
        }
    }

    //Displays or hides first yellow mode/form
    _onShowYellow1(event) {
        event.preventDefault();
        let display = this.actor.system.modeDisplayed.yellow1;
        if (display) {
            this.actor.update({ "system.modeDisplayed.yellow1": false });
        } else {
            this.actor.update({ "system.modeDisplayed.yellow1": true });
        }
    }

    //Displays or hides second yellow mode/form
    _onShowYellow2(event) {
        event.preventDefault();
        let display = this.actor.system.modeDisplayed.yellow2;
        if (display) {
            this.actor.update({ "system.modeDisplayed.yellow2": false });
        } else {
            this.actor.update({ "system.modeDisplayed.yellow2": true });
        }
    }

    //Displays or hides red mode/form
    _onShowRed1(event) {
        event.preventDefault();
        let display = this.actor.system.modeDisplayed.red1;
        if (display) {
            this.actor.update({ "system.modeDisplayed.red1": false });
        } else {
            this.actor.update({ "system.modeDisplayed.red1": true });
        }
    }

    //Applies the selected mode/form to the character
    _onSetMode(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let powers = [];
        this.actor.update({ "system.mode": element.dataset.aux });
        powers = this.actor.items.filter(it => it.type == "power");
        powers.forEach(oe => oe.update({ 'system.selected': false }));
        this.actor.update({ "system.firstDie": "d4" });
        this.actor.update({ "system.firstDieName": game.i18n.localize("SCRPG.sheet.newItem") });
    }

    _onChangeMode(event) {
        let powers = [];
        powers = this.actor.items.filter(it => it.type == "power");
        powers.forEach(oe => oe.update({ 'system.selected': false }));
        this.actor.update({ "system.firstDie": "d4" });
        this.actor.update({ "system.firstDieName": game.i18n.localize("SCRPG.sheet.newItem") });
    }

    //Turns on and off modular
    //Disables formchanger if modular active
    _onSetModular(event) {
        if (this.actor.system.modular == true) {
            this.actor.update({ "system.mode": "main" });
            this.actor.update({ "system.modeDisplayed.green1": false });
            this.actor.update({ "system.modeDisplayed.green2": false });
            this.actor.update({ "system.modeDisplayed.yellow1": false });
            this.actor.update({ "system.modeDisplayed.yellow2": false });
            this.actor.update({ "system.modeDisplayed.red1": false });
        } else {
            this.actor.update({ "system.powerless": false });
            this.actor.update({ "system.formchanger": false });
            this.actor.update({ "system.divided": false })
            this.actor.update({ "system.dividedPsyche": false })
            this.actor.update({ "system.dividedStatus": false })
            this.actor.update({ "system.poweredMode": false })
            this.actor.update({ "system.civilianMode": false })
            this.actor.update({ "system.mode": "main" });
        }
    }

    _onSetPowerless(event) {
        if (this.actor.system.powerless == true) {
            this.actor.update({ "system.mode": "main" })
        }
    }

    //Turns on and off formchanger
    //Disables modular if modular active
    _onSetFormChanger(event) {
        if (this.actor.system.formchanger == true) {
            this.actor.update({ "system.mode": "main" });
            this.actor.update({ "system.modeDisplayed.green1": false });
            this.actor.update({ "system.modeDisplayed.green2": false });
            this.actor.update({ "system.modeDisplayed.yellow1": false });
        } else {
            this.actor.update({ "system.modular": false });
            this.actor.update({ "system.powerless": true });
            this.actor.update({ "system.mode": "main" });
        }
    }

    //turns on the divided psyche mode and set the mode powered
    //turns off modular mode
    _onSetDivided(event) {
        let currentStatus = this.actor.system.thirdDieName;
        let actor = this.actor
        if (this.actor.system.divided == true) {
            this.actor.update({ "system.mode": "main" });
            this.actor.update({ "system.poweredMode": false });
            this.actor.update({ "system.civilianMode": false });
            this.actor.update({ "system.dividedStatus": false });
            this.actor.update({ "system.dividedPsyche": false });
            status.DividedHealthChange(currentStatus, actor)

        } else {
            this.actor.update({ "system.modular": false });
            this.actor.update({ "system.mode": "main" });
            this.actor.update({ "system.poweredMode": true });

        }
    }

    //Turns on divided psyche powered mode and turns off civilian mode
    _onSetPowered(event) {
        let currentStatus = this.actor.system.thirdDieName;
        let actor = this.actor;
        let otherPowers = [];
        if (this.actor.system.poweredMode == true) {
            this.actor.update({ "system.civilianMode": true });
        } else {
            this.actor.update({ "system.civilianMode": false });
        }
        otherPowers = this.actor.items.filter(it => it.type == "quality");
        otherPowers.forEach(oe => oe.update({ 'system.selected': null }));
        this.actor.update({ "system.firstDie": "d4" });
        this.actor.update({ "system.firstDieName": game.i18n.localize("SCRPG.sheet.newItem") });
        this.actor.update({ "system.secondDie": "d4" });
        this.actor.update({ "system.secondDieName": game.i18n.localize("SCRPG.sheet.newItem") });
        status.DividedHealthChange(currentStatus, actor)
    }

    //Turns on divided psyche civilian mode and turns off powered mode
    _onSetCivilian(event) {
        let currentStatus = this.actor.system.thirdDieName;
        let actor = this.actor;
        let otherPowers = [];
        if (this.actor.system.civilianMode == true) {
            this.actor.update({ "system.poweredMode": true });
        } else {
            this.actor.update({ "system.poweredMode": false });
        }
        otherPowers = this.actor.items.filter(it => it.type == "power");
        otherPowers.forEach(oe => oe.update({ 'system.selected': null }));
        this.actor.update({ "system.firstDie": "d4" });
        this.actor.update({ "system.firstDieName": game.i18n.localize("SCRPG.sheet.newItem") });
        this.actor.update({ "system.secondDie": "d4" });
        this.actor.update({ "system.secondDieName": game.i18n.localize("SCRPG.sheet.newItem") });
        status.DividedHealthChange(currentStatus, actor)
    }

    //Displays or hides red mode/form
    _onShowMain(event) {
        event.preventDefault();
        let display = this.actor.system.modeDisplayed.main;
        if (display) {
            this.actor.update({ "system.modeDisplayed.main": false });
        } else {
            this.actor.update({ "system.modeDisplayed.main": true });
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

        //Tranverse up the DOM to find the input for Mod Names, then get the value via javascript (as the default value isn't updated until it is deselected)
        let InputBox = this.getInputBoxViaDOM(event);

        //Hopefully, will fix issues with blur triggering after this function is called
        InputBox.blur();

        let modNameTrueValue = InputBox.value;

        if (modNameTrueValue != "") {
            name = modNameTrueValue;
            named = modNameTrueValue !== "";
        }

        let itemData = {
            name: name,
            type: element.dataset.type,
            "system.named": named,
            "system.value": value,
            "system.persistent": this.actor.system.persistent,
            "system.exclusive": this.actor.system.exclusive
        };
        this.actor.update({ "system.persistent": false });
        this.actor.update({ "system.exclusive": false });
        this.actor.update({ "system.modName": "" })

        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    /* Transverse up via parentElements, until we find the class 'mod-create-td', then tranverse back down until we find input with name 'system.modName' */
    getInputBoxViaDOM(event) {
        let DOMDepth = 0;
        let foundItem = false;

        let target = event.target;

        //Look for 'mod-create-td' in the DOM
        while (DOMDepth < 20 && foundItem == false) {
            if (target.classList.contains('mod-create-td')) {
                foundItem = true;
            }
            else {
                target = target.parentElement;
                DOMDepth++;
            }
        }

        if (foundItem == false) { throw "getInputBoxViaDOM(event): Can't find the <td> with class 'mod-create-td'"; }
        //Now look for the input with name 'system.modName'
        DOMDepth = 0;
        foundItem = false;

        while (DOMDepth < 20 && foundItem == false) {
            if (target.attributes['name'] && target.attributes['name'].value == 'system.modName') {
                foundItem = true;
            }
            else {
                target = target.children[0];
                DOMDepth++;
            }
        }

        if (foundItem == false) { throw "getInputBoxViaDOM(event): Can't find the input with the name 'system.modename'"; }

        return target;
    }




    //deletes the closest item
    _onModSelect(event) {
        event.preventDefault();

        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let isExclusive = item.system.exclusive;
        let updatedSelectedValue = !item.system.selected;

        //if exclusive, deselect all other exclusive mods
        if (isExclusive && updatedSelectedValue) {
            let isBonus = parseInt(item.system.value) > 0;       //Check if Bonus or Penality
            let otherExclusives;

            if (isBonus) {
                otherExclusives = this.actor.items.filter(it => it.type == "mod" && it.system.exclusive == true && parseInt(it.system.value) > 0);
            }
            else {
                otherExclusives = this.actor.items.filter(it => it.type == "mod" && it.system.exclusive == true && parseInt(it.system.value) < 0);
            }

            //Foreach exclusive, deselect
            otherExclusives.forEach(oe => oe.update({ 'system.selected': false }))
        }

        //Toggle selected state for current
        item.update({ 'system.selected': updatedSelectedValue });
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

        console.log(element.dataset.type);

        let itemData = {
            name: game.i18n.localize("SCRPG.sheet.newItem"),
            type: element.dataset.type,
            "system.type": aux
        };
        //creates new power and assigns it to actor
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    //Increases health by 1 and then updates status
    _onIncreaseHealth(event) {
        event.preventDefault();
        let health = this.actor.system.wounds.value + 1;
        let scene = this.actor.system.scene;
        let actor = this.actor;
        if (health <= this.actor.system.wounds.max) {
            status.HealthUpdate(scene, health, actor);
            this.actor.update({ "system.wounds.value": health });
        }
    }

    //Decreased health by 1 and then updates status
    _onDecreaseHealth(event) {
        event.preventDefault();
        let health = this.actor.system.wounds.value - 1;
        let scene = this.actor.system.scene;
        let actor = this.actor;
        if (health >= 0) {
            status.HealthUpdate(scene, health, actor);
            this.actor.update({ "system.wounds.value": health });
        }
    }

    async _onDropItem(event, data) {
        if (!this.actor.isOwner) return false;
        const item = await Item.implementation.fromDropData(data);
        const itemData = item.toObject();

        if (!this.isValidDropItem(this.actor.type, itemData.type))
        {
            return false;
        }

        switch (itemData.type) {
            case "principles":
                if (this.checkDropTarget(event, "DroppableFirstPrinciple")) {
                    this.actor.update({ "system.firstPrinciple.name": itemData.name });
                    this.actor.update({ "system.firstPrinciple.roleplaying": item.system.roleplaying });
                    this.actor.update({ "system.firstPrinciple.minorTwist": item.system.minorTwist });
                    this.actor.update({ "system.firstPrinciple.majorTwist": item.system.majorTwist });
                }

                if (this.checkDropTarget(event, "DroppableSecondPrinciple")) {
                    this.actor.update({ "system.secondPrinciple.name": itemData.name });
                    this.actor.update({ "system.secondPrinciple.roleplaying": item.system.roleplaying });
                    this.actor.update({ "system.secondPrinciple.minorTwist": item.system.minorTwist });
                    this.actor.update({ "system.secondPrinciple.majorTwist": item.system.majorTwist });
                }

                return false;
            case "backgrounds":
                this.actor.update({ "system.background": itemData.name });
                return false;
            case "powerSources":
                this.actor.update({ "system.powerSource": itemData.name });
                return false;
            case "archetypes":
                this.actor.update({ "system.archetype": itemData.name });
                return false;
            case "personality":
                this.actor.update({ "system.personality": itemData.name });
                this.actor.update({ "system.out": item.system.out });
                this.actor.update({ "system.statusDie.green": item.system.statusDie.green });
                this.actor.update({ "system.statusDie.yellow": item.system.statusDie.yellow });
                this.actor.update({ "system.statusDie.red": item.system.statusDie.red });
                return false;
        }


        // Handle item sorting within the same Actor
        if (this.actor.uuid === item.parent?.uuid) return this._onSortItem(event, itemData);

        // Create the owned item
        return this._onDropItemCreate(itemData);
    }

    /**    
     *      Helper Function for _onDropItem.
     *      Return true if the dropped itemDataType is a drag and droppable item and is valid for the actorType, else return false
     **/ 
    isValidDropItem(actorType, itemDataType) {

        const dragAndDropableItems = ["power", "quality", "ability", "villainStatus", "environmentTwist", "heroMinion", "minionForm", "mod", "principles", "backgrounds", "powerSources", "archetypes", "personality", "initiativeActor"];     //List of itemTypes that is checked, so item ordering isn't affected.
        const validHeroDrops = ["power", "quality", "ability", "heroMinion", "minionForm", "mod", "principles", "backgrounds", "powerSources", "archetypes", "personality"];
        const validVillainDrops = ["power", "quality", "ability", "villainStatus", "heroMinion", "minionForm", "mod", "archetypes"];
        const validEnvironmentDrops = ["environmentTwist", "heroMinion", "minionForm"];
        const validSceneDrops = ["initiativeActor"];
        const validMinionDrops = ["heroMinion", "minionForm"];

        // This filter is only for Drag and Droppable from side bar, so allow any items that is not a drag and droppable item
        // Basically don't stop the item reorder or create owned item. 
        if (!dragAndDropableItems.includes(itemDataType)) {
            return true;
        }

        if (actorType == 'hero' && !validHeroDrops.includes(itemDataType)) {
            return false;
        }
        else if (actorType == 'villain' && !validVillainDrops.includes(itemDataType)) {
            return false;
        }
        else if (actorType == 'environment' && !validEnvironmentDrops.includes(itemDataType)) {
            return false;
        }
        else if (actorType == 'scene' && !validSceneDrops.includes(itemDataType)) {
            return false;
        }
        else if (actorType == 'minion' && !validMinionDrops.includes(itemDataType)) {
            return false;
        };

        return true;
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
        let greenCurrent = this.actor.system.greenSpace.current;
        let greenSetting = this.actor.system.greenSpace.setting;
        let yellowCurrent = this.actor.system.yellowSpace.current;
        let yellowSetting = this.actor.system.yellowSpace.setting;
        let redCurrent = this.actor.system.redSpace.current;
        let redSetting = this.actor.system.redSpace.setting;

        switch (element.dataset.color) {
            case "green":
                if (greenSetting == current && (yellowCurrent == 0 || redCurrent > 0 || yellowCurrent == yellowSetting)) {
                    scene.SetYellow();
                } else if (current < greenSetting && greenSetting == greenCurrent) {
                    scene.SetGreen();
                }
                this.actor.update({ "system.greenSpace.current": current });
                this.actor.update({ "system.yellowSpace.current": 0 });
                this.actor.update({ "system.redSpace.current": 0 });
                if (greenCurrent == current && yellowCurrent == 0) {
                    scene.SceneReset(this.actor);
                    scene.SetGreen();
                    scene.SceneStatus(0, 0, 0, greenSetting, yellowSetting, redSetting);
                } else {
                    scene.SceneStatus(current, 0, 0, greenSetting - current, yellowSetting, redSetting);
                }
                break

            case "yellow":
                if ((greenCurrent < greenSetting || yellowCurrent == yellowSetting) && current != yellowSetting) {
                    scene.SetYellow();
                } else if (yellowSetting == current && yellowCurrent < yellowSetting) {
                    scene.SetRed();
                }
                this.actor.update({ "system.yellowSpace.current": current });
                this.actor.update({ "system.greenSpace.current": greenSetting });
                this.actor.update({ "system.redSpace.current": 0 });
                if (yellowCurrent == current && redCurrent == 0) {
                    scene.SceneReset(this.actor);
                    scene.SetGreen();
                    scene.SceneStatus(0, 0, 0, greenSetting, yellowSetting, redSetting);
                } else {
                    scene.SceneStatus(greenSetting, current, 0, 0, yellowSetting - current, redSetting);
                }
                break

            case "red":

                if (redSetting == current && redCurrent != current) {
                    scene.SetRed();
                } else if (yellowCurrent < this.actor.system.yellowSpace.setting) {
                    scene.SetRed();
                }
                this.actor.update({ "system.redSpace.current": current });
                this.actor.update({ "system.yellowSpace.current": yellowSetting });
                this.actor.update({ "system.greenSpace.current": greenSetting });
                if (redCurrent == current) {
                    scene.SceneReset(this.actor);
                    scene.SetGreen();
                    scene.SceneStatus(0, 0, 0, greenSetting, yellowSetting, redSetting);
                } else {
                    scene.SceneStatus(greenSetting, yellowSetting, current, 0, 0, redSetting - current);
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
                this.actor.update({ "system.greenSpace.setting": 2 });
                this.actor.update({ "system.yellowSpace.setting": 4 });
                this.actor.update({ "system.redSpace.setting": 2 });
                break;
            case "prolonged":
                this.actor.update({ "system.greenSpace.setting": 3 });
                this.actor.update({ "system.yellowSpace.setting": 5 });
                this.actor.update({ "system.redSpace.setting": 3 });
                break;
            case "epic":
                this.actor.update({ "system.greenSpace.setting": 1 });
                this.actor.update({ "system.yellowSpace.setting": 3 });
                this.actor.update({ "system.redSpace.setting": 4 });
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
        if (item.system.acted) {
            item.update({ "system.acted": false });
        } else {
            item.update({ "system.acted": true });
        }

    }

    //Reets all items on the initiative tracker to available
    _onResetInitiative(event) {
        event.preventDefault()
        let element = event.currentTarget;
        let itemsId = this.actor.items.filter(it => it.type == element.dataset.type).map(m => m._id);
        for (let i = 0; i < itemsId.length; i++) {
            this.actor.items.get(itemsId[i]).update({ "system.acted": false });;
        }
    }

    //Disables and Enables the scene options
    _onSceneOptions() {
        if (this.actor.system.options) {
            this.actor.update({ "system.options": false })
        } else {
            this.actor.update({ "system.options": true })
        }
    }

    //Displays Scene in Chat
    _onDisplayScene() {
        let greenCurrent = this.actor.system.greenSpace.current;
        let greenSetting = this.actor.system.greenSpace.setting;
        let yellowCurrent = this.actor.system.yellowSpace.current;
        let yellowSetting = this.actor.system.yellowSpace.setting;
        let redCurrent = this.actor.system.redSpace.current;
        let redSetting = this.actor.system.redSpace.setting;

        scene.SceneStatus(greenCurrent, yellowCurrent, redCurrent, greenSetting - greenCurrent, yellowSetting - yellowCurrent, redSetting - redCurrent);
    }
}