

export default class SettingsManager {

    constructor (app) {
	this.app = app;
    }

    getSetting (dbSettings, s, setting) {
	let {l10n} = this.app;
	const {'default': sdefault} = setting; 
        setting.key = s;
        setting.value = sdefault;
        setting.custom = false;
        if (Object.keys(dbSettings).indexOf(s) !== -1) {
            setting._rev = dbSettings[s]._rev;
            if (dbSettings[s].value !== sdefault) {
                setting.value = dbSettings[s].value;
                setting.custom = true;
            }
        }
	try {
	    return new setting.type(setting, l10n);
	} catch (err) {
	    console.warn(err);
	}
    }

    _getSettings = async () => {
	let {hooks} = this.app;	
        const _settings = {};
	await hooks.settings.promise(_settings);
	return _settings;
    }

    _getDBSettings = async () => {
	let {worker} = this.app;
	return await worker.call({cmd: 'settings'})
    }

    async load () {
	let {active, setting} = this.app;	
	const _settings = await this._getSettings();
	const dbSettings = {}
	if (active.user) {
	    // dbSettings = await this._getDBSettings();
	}	
        Object.keys(_settings).forEach(s => {
	    setting[s] = this.getSetting(dbSettings, s, _settings[s])
        });
	return this;
    }    
}
