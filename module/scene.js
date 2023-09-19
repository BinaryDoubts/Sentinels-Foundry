export async function SceneReset(actor = null) {
    actor.update({ "system.redSpace.current": 0 });
    actor.update({ "system.yellowSpace.current": 0 });
    actor.update({ "system.greenSpace.current": 0 });
};

export async function SetGreen() {
    let actors = game.actors.apps[0].documents;
    for (let i = 0; i < actors.length; i++) {
        if (actors[i].type == "hero") {
            let health = actors[i].system.wounds.value;
            let redHigh = actors[i].system.health.redHigh;
            let yellowHigh = actors[i].system.health.yellowHigh;
            actors[i].update({ "system.scene": "green" });
            if (health <= redHigh) {
                actors[i].update({ "system.thirdDieName": "red" });
                if (actors[i].system.civilianMode == true) {
                    actors[i].update({ "system.thirdDie": actors[i].system.statusDie.civilianRed });
                } else {
                    actors[i].update({ "system.thirdDie": actors[i].system.statusDie.red });
                };
            } else if (health <= yellowHigh) {
                actors[i].update({ "system.thirdDieName": "yellow" });
                if (actors[i].system.civilianMode == true) {
                    actors[i].update({ "system.thirdDie": actors[i].system.statusDie.civilianYellow });
                } else {
                    actors[i].update({ "system.thirdDie": actors[i].system.statusDie.yellow });
                };
            } else {
                actors[i].update({ "system.thirdDieName": "green" });
                if (actors[i].system.civilianMode == true) {
                    actors[i].update({ "system.thirdDie": actors[i].system.statusDie.civilianGreen });
                } else {
                    actors[i].update({ "system.thirdDie": actors[i].system.statusDie.green });
                };
            };
        };
    };
};

export async function SetYellow() {
    let actors = game.actors.apps[0].documents;
    for (let i = 0; i < actors.length; i++) {
        if (actors[i].type == "hero") {
            let health = actors[i].system.wounds.value;
            let redHigh = actors[i].system.health.redHigh;
            actors[i].update({ "system.scene": "yellow" });
            if (health <= redHigh) {
                actors[i].update({ "system.thirdDieName": "red" });
                if (actors[i].system.civilianMode == true) {
                    actors[i].update({ "system.thirdDie": actors[i].system.statusDie.civilianRed });
                } else {
                    actors[i].update({ "system.thirdDie": actors[i].system.statusDie.red });
                };
            } else {
                actors[i].update({ "system.thirdDieName": "yellow" });
                if (actors[i].system.civilianMode == true) {
                    actors[i].update({ "system.thirdDie": actors[i].system.statusDie.civilianYellow });
                } else {
                    actors[i].update({ "system.thirdDie": actors[i].system.statusDie.yellow });
                };
            };
        };
    };
};

export async function SetRed() {
    let actors = game.actors.apps[0].documents;
    for (let i = 0; i < actors.length; i++) {
        if (actors[i].type == "hero") {
            actors[i].update({ "system.scene": "red" });
            if (actors[i].system.civilianMode == true) {
                actors[i].update({ "system.thirdDie": actors[i].system.statusDie.civilianRed });
            } else {
                actors[i].update({ "system.thirdDie": actors[i].system.statusDie.red });
            };
            actors[i].update({ "system.thirdDieName": "red" });
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

    const messageTemplate = "systems/scrpg/templates/chat/scenestatus.hbs";

    let render = await renderTemplate(messageTemplate, chatData)

    let messageData = {
        speaker: ChatMessage.getSpeaker(),
        content: render,
    };

    return ChatMessage.create(messageData);

}