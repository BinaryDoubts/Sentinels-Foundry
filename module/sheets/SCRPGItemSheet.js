/**
 * Loads all item sheets
 */

export default class SCRPGItemSheet extends foundry.appv1.sheets.ItemSheet {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["SCRPG", "sheet", "item"]
        });
    }

    get template() {
        return 'systems/Sentinels-Foundry/templates/sheets/' + this.item.type + '-sheet.hbs';
    }

    async getData(options) {
        const data = await super.getData(options);

        data.enrichedAbilityGameText = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.object.system.gameText, { async: true });
        data.enrichedArchetypeDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.object.system.description, { async: true });
        data.enrichedBackgroundDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.object.system.description, { async: true });
        data.enrichedEnvironmentTwistDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.object.system.description, { async: true });
        data.enrichedMinionFormSheetDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.object.system.description, { async: true });
        data.enrichedPersonalityDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.object.system.description, { async: true });
        data.enrichedPowerDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.object.system.description, { async: true });
        data.enrichedPowerSourcesDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.object.system.description, { async: true });
        data.enrichedPrincipleRoleplaying = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.object.system.roleplaying, { async: true });
        data.enrichedPrincipleMinorTwist = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.object.system.minorTwist, { async: true });
        data.enrichedPrincipleMajorTwist = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.object.system.majorTwist, { async: true });
        data.enrichedQualityDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.object.system.description, { async: true });
        data.enrichedVillainStatusDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.object.system.description, { async: true });

        data.config = CONFIG.SCRPG;

        return data;
    }

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers
    /* -------------------------------------------- */

    activateListeners(html) {

        //set ability attack icon
        html.find(".set-attack").click(this._onSetAttack.bind(this));
        //set ability defend icon
        html.find(".set-defend").click(this._onSetDefend.bind(this));
        //set ability overcome icon
        html.find(".set-overcome").click(this._onSetOvercome.bind(this));
        //set ability hinder icon
        html.find(".set-hinder").click(this._onSetHinder.bind(this));
        //set ability boost icon
        html.find(".set-boost").click(this._onSetBoost.bind(this));
        //set ability recover icon
        html.find(".set-recover").click(this._onSetRecover.bind(this));

        super.activateListeners(html);
    }

    //Set attack icon to true or false
    _onSetAttack(event) {
        event.preventDefault();
        let state = this.item.system.icon.attack
        if (state) {
            this.item.update({ "system.icon.attack": false });
        } else {
            this.item.update({ "system.icon.attack": true });
        }
    }

    //Set defend icon to true or false
    _onSetDefend(event) {
        event.preventDefault();
        let state = this.item.system.icon.defend
        if (state) {
            this.item.update({ "system.icon.defend": false });
        } else {
            this.item.update({ "system.icon.defend": true });
        }
    }

    //Set overcome icon to true or false
    _onSetOvercome(event) {
        event.preventDefault();
        let state = this.item.system.icon.overcome
        if (state) {
            this.item.update({ "system.icon.overcome": false });
        } else {
            this.item.update({ "system.icon.overcome": true });
        }
    }

    //Set hinder icon to true or false
    _onSetHinder(event) {
        event.preventDefault();
        let state = this.item.system.icon.hinder
        if (state) {
            this.item.update({ "system.icon.hinder": false });
        } else {
            this.item.update({ "system.icon.hinder": true });
        }
    }

    //Set boost icon to true or false
    _onSetBoost(event) {
        event.preventDefault();
        let state = this.item.system.icon.boost
        if (state) {
            this.item.update({ "system.icon.boost": false });
        } else {
            this.item.update({ "system.icon.boost": true });
        }
    }

    //Set recover icon to true or false
    _onSetRecover(event) {
        event.preventDefault();
        let state = this.item.system.icon.recover
        if (state) {
            this.item.update({ "system.icon.recover": false });
        } else {
            this.item.update({ "system.icon.recover": true });
        }
    }

}