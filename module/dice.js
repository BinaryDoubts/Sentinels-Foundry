/* Dice rolling functions */

/* Rolls power, quality, and status and outputs to chat */
export async function TaskCheck(d1 = null, d2 = null, d3 = null, power = null, quality = null, status = null, poweredMode = null, civilianMode = null, type = null) {

    let color = game.settings.get("scrpg", "coloredDice");
    const messageTemplate = "systems/scrpg/templates/chat/mainroll.hbs";

    let rollFormula = "{" + d1 + "," + d2 + "," + d3 + "}";
    let rollResult = new Roll(rollFormula).roll({ async: false });

    //sorts dice in order of highest result
    let diceresults = rollResult.dice.sort(function (a, b) { if (b.total - a.total == 0) { return b.faces - a.faces } else { return b.total - a.total } });

    //assigns the higest result Max, mid result Mid and lowest result Min
    let dicePosition = ["Max", "Mid", "Min"];

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
        type: type
    }

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
export async function SingleCheck(roll = null, rollType = null, rollName = null) {
    const messageTemplate = "systems/scrpg/templates/chat/minorroll.hbs";

    let color = game.settings.get("scrpg", "coloredDice");
    let rollResult = new Roll(roll).evaluate({ async: false });
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

    let chatData = {
        rollResult: rollResult,
    };

    //renders roll template using minorroll.hbs
    let render = await renderTemplate(messageTemplate, chatData);

    let messageData = {
        speaker: ChatMessage.getSpeaker(),
        content: render
    };

    //push roll result to chat
    rollResult.toMessage(messageData);
}

