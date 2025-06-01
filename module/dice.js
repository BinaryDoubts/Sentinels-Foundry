/* Dice rolling functions */

/* Rolls power, quality, and status and outputs to chat */
export async function TaskCheck(actor = null) {

    let d1 = actor.system.firstDie;
    let d2 = actor.system.secondDie;
    let d3 = actor.system.thirdDie;
    let power = actor.system.firstDieName;
    let quality = actor.system.secondDieName;
    let status = actor.system.thirdDieName;
    let poweredMode = actor.system.poweredMode;
    let civilianMode = actor.system.civilianMode;
    let type = actor.type;
    let mods = actor.mod;
    let color = game.settings.get("scrpg", "coloredDice");
    let modsOn = game.settings.get("scrpg", "mod");
    let coloring = "black";
    let selectedmods = [];
    let penalty = [];
    let bonus = [];

    if (mods) {
        selectedmods = actor.items.filter(it => it.type == "mod" && it.system.selected)
        penalty = mods.filter(m => (m.system.selected == true) && parseInt(m.system.value) < 0).length > 0;
        bonus = mods.filter(m => (m.system.selected == true) && parseInt(m.system.value) > 0).length > 0;
    }

    const messageTemplate = "systems/scrpg/templates/chat/mainroll.hbs";

    //Sets the roll formula and rolls it
    let rollFormula = "{" + d1 + "," + d2 + "," + d3 + "}";
    let rollResult = await new Roll(rollFormula).roll();

    //Sorts dice in order of highest result
    let diceresults = rollResult.dice.sort(function (a, b) { if (b.total - a.total == 0) { return b.faces - a.faces } else { return b.total - a.total } });

    //Assigns the higest result Max, mid result Mid and lowest result Min
    let dicePosition = ["Max", "Mid", "Min"];

    //Checks to see if the actor missed using all available negative mods and then sets penalty true
    if ((actor.type != "environment")
        && modsOn
        && await usedAllValidPenalties(mods)) { coloring = "red" };

    //checks the number of die faces and attachs the corresponding dice image
    for (let i = 0; i < diceresults.length; i++) {
        if ([4, 6, 8, 10, 12].indexOf(diceresults[i].faces) > -1) {
            diceresults[i].img = `icons/svg/d${diceresults[i].faces}-grey.svg`;
            // if the setting for colored dice is enabled, adds a class to to the roll to be used in the template
            if (color) {
                diceresults[i].imgClass = `d${diceresults[i].faces}`
            }
        }
        diceresults[i].dicePosition = dicePosition[i];
    }

    //assign the names of power, quality and status
    let names = [power, quality, status];

    let chatData = {
        dice: diceresults,
        names: names,
        poweredMode: poweredMode,
        civilianMode: civilianMode,
        type: type,
        coloring: coloring,
        selectedmods: selectedmods,
        bonus: bonus,
        penalty: penalty
    }

    await RemoveUsedMods(actor);

    await UnselectPersistentMods(actor);

    //renders roll template using mainroll.hbs
    let render = await renderTemplate(messageTemplate, chatData)

    let messageData = {
        speaker: ChatMessage.getSpeaker(),
        content: render
    };

    //push roll result to chat
    rollResult.toMessage(messageData);
}

/* Rolls either power, quality or status and displays to chat */
export async function SingleCheck(roll = null, rollType = null, rollName = null, actor = null) {
    const messageTemplate = "systems/scrpg/templates/chat/minorroll.hbs";
    let color = game.settings.get("scrpg", "coloredDice");
    let rollResult = new Roll(roll).evaluate({ async: false });
    let coloring = "black";
    let mods = actor.mod;
    let modsOn = game.settings.get("scrpg", "mod");
    let selectedmods = [];
    let penalty = [];
    let bonus = [];

    if (mods && rollType != "minion") {
        selectedmods = actor.items.filter(it => it.type == "mod" && it.system.selected);
        penalty = mods.filter(m => (m.system.selected == true) && parseInt(m.system.value) < 0).length > 0;
        bonus = mods.filter(m => (m.system.selected == true) && parseInt(m.system.value) > 0).length > 0;
    }

    rollResult.rollType = rollType;
    rollResult.rollName = rollName;

    //checks the number of die faces and attachs the corresponding dice image
    if ([4, 6, 8, 10, 12].indexOf(rollResult.dice[0].faces) > -1) {
        rollResult.img = `icons/svg/d${rollResult.dice[0].faces}-grey.svg`;
        // if the setting for colored dice is enabled, adds a class to to the roll to be used in the template
        if (color) {
            rollResult.imgClass = `d${rollResult.dice[0].faces}`
        }
    };

    //Checks to see if the actor missed using all available negative mods and then sets penalty true
    if ((rollType == "power" || rollType == "quality" || rollType == "status")
        && modsOn && await usedAllValidPenalties(mods)) { coloring = "red" };

    let chatData = {
        rollResult: rollResult,
        coloring: coloring,
        selectedmods: selectedmods,
        bonus: bonus,
        penalty: penalty
    };

    if (mods && rollType != "minion") {
        await RemoveUsedMods(actor);
    };

    await UnselectPersistentMods(actor);

    //renders roll template using minorroll.hbs
    let render = await renderTemplate(messageTemplate, chatData);

    let messageData = {
        speaker: ChatMessage.getSpeaker(),
        content: render,
    };

    //push roll result to chat
    rollResult.toMessage(messageData);
}

//Function for displaying an item in the chat window
export async function ItemRoll(item = null) {

    let chatData = {
        item: item
    }
    const messageTemplate = "systems/scrpg/templates/chat/" + item.type + "roll.hbs";

    let render = await renderTemplate(messageTemplate, chatData)

    let messageData = {
        speaker: ChatMessage.getSpeaker(),
        content: render,
    };

    return ChatMessage.create(messageData);
}

// Rolls all minions that are part of the same group
export async function RollAllMinions(actor = null, group = 1) {

    let minions = [];
    let rollResult = {};
    let color = game.settings.get("scrpg", "coloredDice");
    let groupName = "";

    switch (parseInt(group)) {
        case 1:
            groupName = actor.system.groupName.one
            break
        case 2:
            groupName = actor.system.groupName.two
            break
        case 3:
            groupName = actor.system.groupName.three
            break
        case 4:
            groupName = actor.system.groupName.four
            break
        case 5:
            groupName = actor.system.groupName.five
            break
        case 6:
            groupName = actor.system.groupName.six
            break
        case 7:
            groupName = actor.system.groupName.seven
            break
        case 8:
            groupName = actor.system.groupName.eight
            break
        case 9:
            groupName = actor.system.groupName.nine
            break
        case 10:
            groupName = actor.system.groupName.ten
            break
    }

    for (let i = 0; i < actor.heroMinion.length; i++) {
        if (actor.heroMinion[i].system.group == group) {

            rollResult = new Roll(actor.heroMinion[i].system.dieType).evaluate({ async: false });

            //checks the number of die faces and attachs the corresponding dice image
            if ([4, 6, 8, 10, 12].indexOf(rollResult.dice[0].faces) > -1) {
                rollResult.img = `icons/svg/d${rollResult.dice[0].faces}-grey.svg`;
                // if the setting for colored dice is enabled, adds a class to to the roll to be used in the template
                if (color) {
                    rollResult.imgClass = `d${rollResult.dice[0].faces}`
                }
            };

            minions[i] = {
                groupName: groupName,
                dice: actor.heroMinion[i].system.dieType,
                name: actor.heroMinion[i].name,
                rollResult: rollResult
            };
        };
    };

    let chatData = {
        minions: minions,
        groupName: groupName
    }
    const messageTemplate = "systems/scrpg/templates/chat/minionsroll.hbs";

    let render = await renderTemplate(messageTemplate, chatData)

    let messageData = {
        speaker: ChatMessage.getSpeaker(),
        content: render,
    };

    return ChatMessage.create(messageData);

}

//Function for displaying out ability in the chat window
export async function OutRoll(out = null) {

    let chatData = {
        out: out
    }
    const messageTemplate = "systems/scrpg/templates/chat/outroll.hbs";

    let render = await renderTemplate(messageTemplate, chatData)

    let messageData = {
        speaker: ChatMessage.getSpeaker(),
        content: render,
    };

    return ChatMessage.create(messageData);
}

//helper functions
async function RemoveUsedMods(actor) {
    //Delete mods afterwards
    let toDelId = actor.items.filter(it => it.type == "mod" && it.system.selected && !it.system.persistent).map(m => m._id);
    actor.deleteEmbeddedDocuments("Item", toDelId);
}

async function UnselectPersistentMods(actor) {
    //unselects mods after roll
    let toUnselectId = actor.items.filter(it => it.type == "mod" && it.system.selected && it.system.persistent).map(m => m._id);
    for (let i = 0; i < toUnselectId.length; i++) {
        actor.items.get(toUnselectId[i]).update({ "system.selected": false });;
    }
}

//Function for checking if all valid penalties have been used
async function usedAllValidPenalties(mods) {
    let selectedPenalties = mods.filter(m => (m.system.selected == true) && parseInt(m.system.value) < 0);
    let unselectedPenalties = mods.filter(m => !(m.system.selected == true) && parseInt(m.system.value) < 0);

    let totalPersistentPenalities = mods.filter(m => m.system.persistent == true && m.system.exclusive == false && parseInt(m.system.value) < 0).length;     //Excluding penalties with both persistent & exlcusive, because gonna to have the exclusive check cover this case

    let unusedVirginPenalities = unselectedPenalties.filter(m => m.system.persistent == false && m.system.exclusive == false).length;
    let stillHaveUnusedExclusivePenalities = unselectedPenalties.filter(m => m.system.exclusive == true).length;
    let usedPersistentPenalities = selectedPenalties.filter(m => m.system.persistent == true && m.system.exclusive == false).length;
    let usedExclusivePenalities = selectedPenalties.filter(m => m.system.exclusive == true).length;

    //Has non-persistent and non-exclusive Penalities unused 
    if (unusedVirginPenalities) {
        return true;
    }

    //If there are any unused persistance penalty
    if (unselectedPenalties.length && (usedPersistentPenalities != totalPersistentPenalities)) {
        return true;
    }

    //Didnt use a exclusive and exclusive unused
    if (unselectedPenalties.length && !usedExclusivePenalities && stillHaveUnusedExclusivePenalities) {
        return true;
    }

    return false;
}