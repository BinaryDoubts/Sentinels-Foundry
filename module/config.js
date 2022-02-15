export const SCRPG = {};

//Dice types
SCRPG.dieTypes = {
    d4: "d4",
    d6: "d6",
    d8: "d8",
    d10: "d10",
    d12: "d12"
}

//Scene status
SCRPG.scenes = {
    green: "SCRPG.scene.green",
    yellow: "SCRPG.scene.yellow",
    red: "SCRPG.scene.red"
}

//Ability types if no modes/forms
SCRPG.baseModes = {
    green: "SCRPG.modes.green",
    yellow: "SCRPG.modes.yellow",
    red: "SCRPG.modes.red",
}

//Ability if modes/forms
SCRPG.modes = {
    green: "SCRPG.modes.green",
    yellow: "SCRPG.modes.yellow",
    red: "SCRPG.modes.red",
    villain: "SCRPG.modes.villain",
    green1: "SCRPG.modes.green1",
    green2: "SCRPG.modes.green2",
    yellow1: "SCRPG.modes.yellow1",
    yellow2: "SCRPG.modes.yellow2",
    red1: "SCRPG.modes.red1"
}

//Power modes/forms
SCRPG.types = {
    main: "SCRPG.modes.main",
    green1: "SCRPG.modes.green1",
    green2: "SCRPG.modes.green2",
    green3: "SCRPG.modes.green3",
    yellow1: "SCRPG.modes.yellow1",
    yellow2: "SCRPG.modes.yellow2",
    red1: "SCRPG.modes.red1"
}

//Ability types
SCRPG.abilityType = {
    A: { type: "A", desc: "SCRPG.abilitytypes.A.display", tooltip: "SCRPG.abilitytypes.A.tooltip" },
    I: { type: "I", desc: "SCRPG.abilitytypes.I.display", tooltip: "SCRPG.abilitytypes.I.tooltip" },
    R: { type: "R", desc: "SCRPG.abilitytypes.R.display", tooltip: "SCRPG.abilitytypes.R.tooltip" }
}

//Environment Twist Types
SCRPG.twistType = {
    greenminor: "SCRPG.twist.greenminor",
    greenmajor: "SCRPG.twist.greenmajor",
    yellowminor: "SCRPG.twist.yellowminor",
    yellowmajor: "SCRPG.twist.yellowmajor",
    redminor: "SCRPG.twist.redminor",
    redmajor: "SCRPG.twist.redmajor"
}