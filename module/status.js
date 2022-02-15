/* Functions related to Status */

//Determine characters status from current health and scene status and set it
//to main roll
export function HealthUpdate(scene = null, health = null, actor = null) {
    if (scene == "red" || health <= actor.data.data.health.redHigh) {
        if (actor.data.data.dividedStatus == true && actor.data.data.civilianMode == true) {
            actor.update({ "data.thirdDie": actor.data.data.statusDie.civilianRed });
        } else {
            actor.update({ "data.thirdDie": actor.data.data.statusDie.red });
        }
        actor.update({ "data.thirdDieName": "red" });
    } else if (scene == "yellow" || health <= actor.data.data.health.yellowHigh) {
        if (actor.data.data.dividedStatus == true && actor.data.data.civilianMode == true) {
            actor.update({ "data.thirdDie": actor.data.data.statusDie.civilianYellow });
        } else {
            actor.update({ "data.thirdDie": actor.data.data.statusDie.yellow });
        }
        actor.update({ "data.thirdDieName": "yellow" });
    } else {
        if (actor.data.data.dividedStatus == true && actor.data.data.civilianMode == true) {
            actor.update({ "data.thirdDie": actor.data.data.statusDie.civilianGreen });
        } else {
            actor.update({ "data.thirdDie": actor.data.data.statusDie.green });
        }
        actor.update({ "data.thirdDieName": "green" });
    }
}

//updates the set status die when changing between civilian and powered modes
export function DividedHealthChange(status = null, actor = null) {
    if (status == "green" && actor.data.data.civilianMode == false) {
        actor.update({ "data.thirdDie": actor.data.data.statusDie.civilianGreen });
    } else if (status == "green" && actor.data.data.civilianMode == true) {
        actor.update({ "data.thirdDie": actor.data.data.statusDie.green });
    } else if (status == "yellow" && actor.data.data.civilianMode == false) {
        actor.update({ "data.thirdDie": actor.data.data.statusDie.civilianYellow });
    } else if (status == "yellow" && actor.data.data.civilianMode == true) {
        actor.update({ "data.thirdDie": actor.data.data.statusDie.yellow });
    } else if (status == "red" && actor.data.data.civilianMode == false) {
        actor.update({ "data.thirdDie": actor.data.data.statusDie.civilianRed });
    } else {
        actor.update({ "data.thirdDie": actor.data.data.statusDie.red });
    }
}