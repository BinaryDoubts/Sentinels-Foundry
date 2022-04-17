/* Dice rolling functions */

/* Rolls power, quality, and status and outputs to chat */
export async function TaskCheck(actor = null) {

    let d1 = actor.data.data.firstDie;
    let d2 = actor.data.data.secondDie;
    let d3 = actor.data.data.thirdDie;
    let power = actor.data.data.firstDieName;
    let quality = actor.data.data.secondDieName;
    let status = actor.data.data.thirdDieName;
    let poweredMode = actor.data.data.poweredMode;
    let civilianMode = actor.data.data.civilianMode;
    let type = actor.data.type;
    let mods = actor.items.document.mod;
    let color = game.settings.get("scrpg", "coloredDice");
    let modsOn = game.settings.get("scrpg", "mod");
    let coloring = "black";
    let selectedmods = actor.items.filter(it => it.data.type == "mod" && it.data.data.selected);
    let penalty = [];
    let bonus = [];

    if (actor.data.type != "environment") {
        penalty = mods.filter(m => (m.data.selected == true) && parseInt(m.data.value) < 0).length > 0;
        bonus = mods.filter(m => (m.data.selected == true) && parseInt(m.data.value) > 0).length > 0;
    }

    const messageTemplate = "systems/scrpg/templates/chat/mainroll.hbs";

    //Sets the roll formula and rolls it
    let rollFormula = "{" + d1 + "," + d2 + "," + d3 + "}";
    let rollResult = new Roll(rollFormula).roll({ async: false });

    //Sorts dice in order of highest result
    let diceresults = rollResult.dice.sort(function (a, b) { if (b.total - a.total == 0) { return b.faces - a.faces } else { return b.total - a.total } });

    //Assigns the higest result Max, mid result Mid and lowest result Min
    let dicePosition = ["Max", "Mid", "Min"];

    //Checks to see if the actor missed using all available negative mods and then sets penalty true
    if ((actor.data.type != "environment")
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

    await UnselectPersistantMods(actor);

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
    let mods = actor.items.document.mod;
    let modsOn = game.settings.get("scrpg", "mod");
    let selectedmods = actor.items.filter(it => it.data.type == "mod" && it.data.data.selected);
    let penalty = mods.filter(m => (m.data.selected == true) && parseInt(m.data.value) < 0).length > 0;
    let bonus = mods.filter(m => (m.data.selected == true) && parseInt(m.data.value) > 0).length > 0;

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

    await RemoveUsedMods(actor);

    await UnselectPersistantMods(actor);

    //renders roll template using minorroll.hbs
    let render = await renderTemplate(messageTemplate, chatData);

    let messageData = {
        speaker: ChatMessage.getSpeaker(),
        content: render,
    };

    //push roll result to chat
    rollResult.toMessage(messageData);
}

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



//helper functions
async function RemoveUsedMods(actor) {
    //Delete mods afterwards
    let toDelId = actor.items.filter(it => it.data.type == "mod" && it.data.data.selected && !it.data.data.persistant).map(m => m.data._id);
    actor.deleteEmbeddedDocuments("Item", toDelId);
}

async function UnselectPersistantMods(actor) {
    //unselects mods after roll
    let toUnselectId = actor.items.filter(it => it.data.type == "mod" && it.data.data.selected && it.data.data.persistant).map(m => m.data._id);
    for (let i = 0; i < toUnselectId.length; i++) {
        actor.items.get(toUnselectId[i]).update({ "data.selected": false });;
    }
}


async function usedAllValidPenalties(mods) {
    let selectedPenalties = mods.filter(m => (m.data.selected == true) && parseInt(m.data.value) < 0);
    let unselectedPenalties = mods.filter(m => !(m.data.selected == true) && parseInt(m.data.value) < 0);

    let totalPersistantPenalities = mods.filter(m => m.data.persistant == true && m.data.exclusive == false && parseInt(m.data.value) < 0).length;     //Excluding penalties with both persistant & exlcusive, because gonna to have the exclusive check cover this case

    let unusedVirginPenalities = unselectedPenalties.filter(m => m.data.persistant == false && m.data.exclusive == false).length;
    let stillHaveUnusedExclusivePenalities = unselectedPenalties.filter(m => m.data.exclusive == true).length;
    let usedPersistantPenalities = selectedPenalties.filter(m => m.data.persistant == true && m.data.exclusive == false).length;
    let usedExclusivePenalities = selectedPenalties.filter(m => m.data.exclusive == true).length;

    //Has non-Persistant and non-exclusive Penalities unused 
    if (unusedVirginPenalities) {
        return true;
    }

    //If there are any unused persistance penalty
    if (unselectedPenalties.length && (usedPersistantPenalities != totalPersistantPenalities)) {
        return true;
    }

    //Didnt use a exclusive and exclusive unused
    if (unselectedPenalties.length && !usedExclusivePenalities && stillHaveUnusedExclusivePenalities) {
        return true;
    }

    return false;
}