/* Functions related to Status */

//Determine characters status from current health and scene status and set it
//to main roll
export function HealthUpdate(scene = null, health = null, actor = null) {
    if (scene == "red" || health <= actor.system.health.redHigh) {
        if (actor.system.dividedStatus == true && actor.system.civilianMode == true) {
            actor.update({ "system.thirdDie": actor.system.statusDie.civilianRed });
        } else {
            actor.update({ "system.thirdDie": actor.system.statusDie.red });
        }
        actor.update({ "system.thirdDieName": "red" });
    } else if (scene == "yellow" || health <= actor.system.health.yellowHigh) {
        if (actor.system.dividedStatus == true && actor.system.civilianMode == true) {
            actor.update({ "system.thirdDie": actor.system.statusDie.civilianYellow });
        } else {
            actor.update({ "system.thirdDie": actor.system.statusDie.yellow });
        }
        actor.update({ "system.thirdDieName": "yellow" });
    } else {
        if (actor.system.dividedStatus == true && actor.system.civilianMode == true) {
            actor.update({ "system.thirdDie": actor.system.statusDie.civilianGreen });
        } else {
            actor.update({ "system.thirdDie": actor.system.statusDie.green });
        }
        actor.update({ "system.thirdDieName": "green" });
    }
}

//updates the set status die when changing between civilian and powered modes
export function DividedHealthChange(status = null, actor = null) {
    if (status == "green" && actor.system.civilianMode == false) {
        actor.update({ "system.thirdDie": actor.system.statusDie.civilianGreen });
    } else if (status == "green" && actor.system.civilianMode == true) {
        actor.update({ "system.thirdDie": actor.system.statusDie.green });
    } else if (status == "yellow" && actor.system.civilianMode == false) {
        actor.update({ "system.thirdDie": actor.system.statusDie.civilianYellow });
    } else if (status == "yellow" && actor.system.civilianMode == true) {
        actor.update({ "system.thirdDie": actor.system.statusDie.yellow });
    } else if (status == "red" && actor.system.civilianMode == false) {
        actor.update({ "system.thirdDie": actor.system.statusDie.civilianRed });
    } else {
        actor.update({ "system.thirdDie": actor.system.statusDie.red });
    }
}