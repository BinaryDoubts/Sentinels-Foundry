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
        "systems/scrpg/templates/partials/environmenttwist.hbs",
        "systems/scrpg/templates/partials/minions.hbs",
        "systems/scrpg/templates/partials/mod.hbs"
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
        default: false
    });
    game.settings.register("scrpg", "mod", {
        config: true,
        scope: "client",
        name: "SETTINGS.mod.name",
        hint: "SETTINGS.mod.hint",
        type: Boolean,
        default: false
    });
    game.settings.register("scrpg", "availableAbilities", {
        config: true,
        scope: "client",
        name: "SETTINGS.availableAbilities.name",
        hint: "SETTINGS.availableAbilities.hint",
        type: Boolean,
        default: false
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

// handlebars helper that returns the localized minion ability. Returns empty string on invalid.
Handlebars.registerHelper("getLocalizeMinionAbility", function (minionability) {

    if (minionability) { return game.i18n.localize(SCRPG.actionType[minionability]); }
    return "";
});

// handlebars helper that returns the localized bonus. Returns empty string on invalid 
Handlebars.registerHelper("getLocalizeMinionBonus", function (bonus) {

    if (bonus) { return game.i18n.localize(SCRPG.bonus[bonus]); }
    return "";
});

// handlebars helper if statement that checks system setting
Handlebars.registerHelper("ifSetting", function (setting, options) {
    let settingState = game.settings.get("scrpg", setting);
    if (settingState) {
        return new Handlebars.SafeString(options.fn(this));
    }
});
// handlebars helper that returns a css class depending if the abilities would be enabled by the scene/character status.
Handlebars.registerHelper("getAbilitiesEnabledFromStatusClass", function (mode, actor) {

    let setting = game.settings.get("scrpg", "availableAbilities")
    let scene = actor.scene;
    let actorStatus = actor.thirdDieName;

    if (setting) {
        if (scene == "red" || actorStatus == "red") {
            //Enable green, yellow and red
        } else if (scene == "yellow" || actorStatus == "yellow") {
            if (mode == "red") { return "filter: grayscale(70%);" }
            //Enabled green
            //enable yellow
        } else {
            if (mode == "yellow" || mode == "red") { return "filter: grayscale(70%);" }
            //enable green
        }
    }

    return "";
});