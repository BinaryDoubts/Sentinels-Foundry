import { SCRPG } from "./module/config.js";
import SCRPGItemSheet from "./module/sheets/SCRPGItemSheet.js";
import SCRPGCharacterSheet from "./module/sheets/SCRPGCharacterSheet.js";

//register all handlebars templates
async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/scrpg/templates/partials/heroinfo.hbs",
        "systems/scrpg/templates/partials/principles.hbs",
        "systems/scrpg/templates/partials/issuescollections.hbs",
        "systems/scrpg/templates/partials/powerquality.hbs",
        "systems/scrpg/templates/partials/abilities.hbs",
        "systems/scrpg/templates/partials/auxiliary.hbs",
        "systems/scrpg/templates/partials/auxiliarypowers.hbs",
        "systems/scrpg/templates/partials/abilitiestable.hbs",
        "systems/scrpg/templates/partials/formmodularcommon.hbs",
        "systems/scrpg/templates/partials/abilitiesmodeformcommon.hbs",
        "systems/scrpg/templates/partials/environmenttwist.hbs"
    ];

    return loadTemplates(templatePaths)
};

// Sets up a system setting to run on and off colored dice as part of the roll templates
function registerSystemSettings() {
    game.settings.register("scrpg", "coloredDice", {
        config: true,
        scope: "world",
        name: "SETTINGS.coloredDice.name",
        hint: "SETTINGS.coloredDice.hint",
        type: Boolean,
        default: true
    });
};

Hooks.once("init", function () {
    console.log("SCRPG | Initialising SCRPG");

    CONFIG.SCRPG = SCRPG;

    //unregister core item sheets and use SCRPGItemSheet
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("SCRPG", SCRPGItemSheet, { makeDefault: true });

    //unregister core actor sheet and use SCRPGHeroCharacterSheet
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("SCRPG", SCRPGCharacterSheet, { makeDefault: true });

    registerSystemSettings();

    preloadHandlebarsTemplates();
});

//handlebars helper that changes keywords used for ability/power aux to
//a color to allow for more generic handlebars partials
Handlebars.registerHelper("color", function (color) {
    let colors = {
        green: "green",
        yellow: "yellow",
        red: "red",
        green1: "green",
        green2: "green",
        green3: "green",
        yellow1: "yellow",
        yellow2: "yellow",
        red1: "red",
        villain: "villain",
        greenminor: "green",
        greenmajor: "green",
        yellowminor: "yellow",
        yellowmajor: "yellow",
        redminor: "red",
        redmajor: "red"
    }

    return colors[color.fn(this)];
});



// handlebars helper that returns the localize description of an ability type. Returns empty string on invalid.
Handlebars.registerHelper("getLocalizeAbilityTypeDescription", function (abilitytype) {

    if (abilitytype) { return game.i18n.localize(SCRPG.abilityType[abilitytype].desc); }
    return "";
});

// handlebars helper that returns the localize tooltip of an ability type. Returns empty string on invalid.
Handlebars.registerHelper("getLocalizeAbilityTypeTooltip", function (abilitytype) {

    if (abilitytype) { return game.i18n.localize(SCRPG.abilityType[abilitytype].tooltip); }
    return "";
});