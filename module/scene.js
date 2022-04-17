export async function SceneReset(actor = null) {
    actor.update({ "data.redSpace.current": 0 });
    actor.update({ "data.yellowSpace.current": 0 });
    actor.update({ "data.greenSpace.current": 0 });
};

export async function SetGreen() {
    let actors = game.actors.apps[0].documents;
    for (let i = 0; i < actors.length; i++) {
        if (actors[i].type == "hero") {
            let health = actors[i].data.data.wounds.value;
            let redHigh = actors[i].data.data.health.redHigh;
            let yellowHigh = actors[i].data.data.health.yellowHigh;
            actors[i].update({ "data.scene": "green" });
            if (health <= redHigh) {
                actors[i].update({ "data.thirdDieName": "red" });
                if (actors[i].data.data.civilianMode == true) {
                    actors[i].update({ "data.thirdDie": actors[i].data.data.statusDie.civilianRed });
                } else {
                    actors[i].update({ "data.thirdDie": actors[i].data.data.statusDie.red });
                };
            } else if (health <= yellowHigh) {
                actors[i].update({ "data.thirdDieName": "yellow" });
                if (actors[i].data.data.civilianMode == true) {
                    actors[i].update({ "data.thirdDie": actors[i].data.data.statusDie.civilianYellow });
                } else {
                    actors[i].update({ "data.thirdDie": actors[i].data.data.statusDie.yellow });
                };
            } else {
                actors[i].update({ "data.thirdDieName": "green" });
                if (actors[i].data.data.civilianMode == true) {
                    actors[i].update({ "data.thirdDie": actors[i].data.data.statusDie.civilianGreen });
                } else {
                    actors[i].update({ "data.thirdDie": actors[i].data.data.statusDie.green });
                };
            };
        };
    };
};

export async function SetYellow() {
    let actors = game.actors.apps[0].documents;
    for (let i = 0; i < actors.length; i++) {
        if (actors[i].type == "hero") {
            let health = actors[i].data.data.wounds.value;
            let redHigh = actors[i].data.data.health.redHigh;
            actors[i].update({ "data.scene": "yellow" });
            if (health <= redHigh) {
                actors[i].update({ "data.thirdDieName": "red" });
                if (actors[i].data.data.civilianMode == true) {
                    actors[i].update({ "data.thirdDie": actors[i].data.data.statusDie.civilianRed });
                } else {
                    actors[i].update({ "data.thirdDie": actors[i].data.data.statusDie.red });
                };
            } else {
                actors[i].update({ "data.thirdDieName": "yellow" });
                if (actors[i].data.data.civilianMode == true) {
                    actors[i].update({ "data.thirdDie": actors[i].data.data.statusDie.civilianYellow });
                } else {
                    actors[i].update({ "data.thirdDie": actors[i].data.data.statusDie.yellow });
                };
            };
        };
    };
};

export async function SetRed() {
    let actors = game.actors.apps[0].documents;
    for (let i = 0; i < actors.length; i++) {
        if (actors[i].type == "hero") {
            actors[i].update({ "data.scene": "red" });
            if (actors[i].data.data.civilianMode == true) {
                actors[i].update({ "data.thirdDie": actors[i].data.data.statusDie.civilianRed });
            } else {
                actors[i].update({ "data.thirdDie": actors[i].data.data.statusDie.red });
            };
            actors[i].update({ "data.thirdDieName": "red" });
        };
    };
};

export async function SceneChat(type = null) {
    let coloring = ""

    if (type == "reset" || type == "failure") {
        coloring = "villain"
    } else {
        coloring = type
    }

    let chatData = {
        coloring: coloring,
        type: type
    }
    const messageTemplate = "systems/scrpg/templates/chat/sceneupdate.hbs";

    let render = await renderTemplate(messageTemplate, chatData)

    let messageData = {
        speaker: ChatMessage.getSpeaker(),
        content: render,
    };

    return ChatMessage.create(messageData);
};