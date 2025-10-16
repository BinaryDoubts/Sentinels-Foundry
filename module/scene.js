export async function SceneReset(actor = null) {
    actor.update({ "system.redSpace.current": 0 });
    actor.update({ "system.yellowSpace.current": 0 });
    actor.update({ "system.greenSpace.current": 0 });
};

export async function SetGreen() {
    for (const actor of game.actors) {
        if (actor.type == "hero") {
            let health = actor.system.wounds.value;
            let redHigh = actor.system.health.redHigh;
            let yellowHigh = actor.system.health.yellowHigh;
            actor.update({ "system.scene": "green" });
            if (health <= redHigh) {
                actor.update({ "system.thirdDieName": "red" });
                if (actor.system.civilianMode == true) {
                    actor.update({ "system.thirdDie": actor.system.statusDie.civilianRed });
                } else {
                    actor.update({ "system.thirdDie": actor.system.statusDie.red });
                };
            } else if (health <= yellowHigh) {
                actor.update({ "system.thirdDieName": "yellow" });
                if (actor.system.civilianMode == true) {
                    actor.update({ "system.thirdDie": actor.system.statusDie.civilianYellow });
                } else {
                    actor.update({ "system.thirdDie": actor.system.statusDie.yellow });
                };
            } else {
                actor.update({ "system.thirdDieName": "green" });
                if (actor.system.civilianMode == true) {
                    actor.update({ "system.thirdDie": actor.system.statusDie.civilianGreen });
                } else {
                    actor.update({ "system.thirdDie": actor.system.statusDie.green });
                };
            };
        };
    };
};

export async function SetYellow() {
    for (const actor of game.actors) {
        if (actor.type == "hero") {
            let health = actor.system.wounds.value;
            let redHigh = actor.system.health.redHigh;
            actor.update({ "system.scene": "yellow" });
            if (health <= redHigh) {
                actor.update({ "system.thirdDieName": "red" });
                if (actor.system.civilianMode == true) {
                    actor.update({ "system.thirdDie": actor.system.statusDie.civilianRed });
                } else {
                    actor.update({ "system.thirdDie": actor.system.statusDie.red });
                };
            } else {
                actor.update({ "system.thirdDieName": "yellow" });
                if (actor.system.civilianMode == true) {
                    actor.update({ "system.thirdDie": actor.system.statusDie.civilianYellow });
                } else {
                    actor.update({ "system.thirdDie": actor.system.statusDie.yellow });
                };
            };
        };
    };
};

export async function SetRed() {
    for (const actor of game.actors) {
        if (actor.type == "hero") {
            actor.update({ "system.scene": "red" });
            if (actor.system.civilianMode == true) {
                actor.update({ "system.thirdDie": actor.system.statusDie.civilianRed });
            } else {
                actor.update({ "system.thirdDie": actor.system.statusDie.red });
            };
            actor.update({ "system.thirdDieName": "red" });
        };
    };
};

export async function SceneStatus(gc = 0, yc = 0, rc = 0, gt = 0, yt = 0, rt = 0) {

    let chatData = {
        gc: gc,
        yc: yc,
        rc: rc,
        gt: gt,
        yt: yt,
        rt: rt
    }

    const messageTemplate = "systems/Sentinels-Foundry/templates/chat/scenestatus.hbs";

    let render = await foundry.applications.handlebars.renderTemplate(messageTemplate, chatData)

    let messageData = {
        speaker: ChatMessage.getSpeaker(),
        content: render,
    };

    return ChatMessage.create(messageData);

}