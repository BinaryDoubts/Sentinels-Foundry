/**
 * Loads all item sheets
 */

export default class SCRPGItemSheet extends ItemSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 600,
            height: 300,
            classes: ["SCRPG", "sheet", "item"]
        });
    }

    get template() {
        return 'systems/scrpg/templates/sheets/' + this.item.data.type + '-sheet.hbs';
    }
    getData() {
        const data = super.getData();

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
        let state = this.item.data.data.icon.attack
        if (state) {
            this.item.update({ "data.icon.attack": false });
        } else {
            this.item.update({ "data.icon.attack": true });
        }
    }

    //Set defend icon to true or false
    _onSetDefend(event) {
        event.preventDefault();
        let state = this.item.data.data.icon.defend
        if (state) {
            this.item.update({ "data.icon.defend": false });
        } else {
            this.item.update({ "data.icon.defend": true });
        }
    }

    //Set overcome icon to true or false
    _onSetOvercome(event) {
        event.preventDefault();
        let state = this.item.data.data.icon.overcome
        if (state) {
            this.item.update({ "data.icon.overcome": false });
        } else {
            this.item.update({ "data.icon.overcome": true });
        }
    }

    //Set hinder icon to true or false
    _onSetHinder(event) {
        event.preventDefault();
        let state = this.item.data.data.icon.hinder
        if (state) {
            this.item.update({ "data.icon.hinder": false });
        } else {
            this.item.update({ "data.icon.hinder": true });
        }
    }

    //Set boost icon to true or false
    _onSetBoost(event) {
        event.preventDefault();
        let state = this.item.data.data.icon.boost
        if (state) {
            this.item.update({ "data.icon.boost": false });
        } else {
            this.item.update({ "data.icon.boost": true });
        }
    }

    //Set recover icon to true or false
    _onSetRecover(event) {
        event.preventDefault();
        let state = this.item.data.data.icon.recover
        if (state) {
            this.item.update({ "data.icon.recover": false });
        } else {
            this.item.update({ "data.icon.recover": true });
        }
    }

}