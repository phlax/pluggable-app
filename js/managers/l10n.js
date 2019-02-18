

export default class L10nManager  {

    constructor (app) {
	this.app = app;
    }

    load = async () => {
	const {i18n} = this.app;
	return new i18n({en: {}});
    }

    async lazyLoad () {
	const {app} = this;
	const {hooks, l10n} = app;
	await hooks.l10nExtra.promise(l10n, app.active)
	hooks.l10nExtra.promise(l10n)
    }

    async createRecords (plugin, language, filetype, data) {
	const records = [];
	for (let item of Object.keys(data)) {
	    if (item === 'default') {
		continue;
	    }
	    let key = language + '@' + filetype + '@' + plugin.name + '@' + item;
	    records.push({_id: key, value: data[item]})
	}
	return records;
    }

    async saveTranslationData (records) {
	const {server} = this.app;
	await server.call({cmd: 'l10n.push', params: records});
    }

    // this should be in dev
    async pushTranslationFile (plugin, language, filetype) {
        const log = this.app.debug('app:' + plugin.name + ':l10n');
	
        try {
	    const result = await plugin.loadL10n(language, filetype)
	    if (!result) {
		return;
	    }
	    const records = await this.createRecords(plugin, language, filetype, result);
	    if (records.length) {
		this.saveTranslationData(records);
		this.app.signals.emit('l10n.push', {plugin,  language, filetype});
		this.app.signals.emit('log.l10n', [filetype, language, plugin.name].join(', '));
	    }
        } catch (err) {
            log('missing locale', filetype, language, plugin.name, err);
            this.app.signals.emit('l10n.push', {plugin,  language, filetype, error: err});
	    this.app.signals.emit('log.l10n', [filetype, language, plugin.name].join(', '), 'error');
        }
    }

    pushTranslations = async () => {
	const {plugins} = this.app;
	for (let plugin of Object.values(plugins)) {
	    for (let language of plugin.languages || []) {
		for (let filetype of ['essential', 'manifest']) {
		    await this.pushTranslationFile(plugin, language, filetype);
                }
            }
        }
    }
}
