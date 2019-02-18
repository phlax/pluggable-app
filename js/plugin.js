

export default class Plugin {

    constructor (app) {
	this.app = app;
    }

    get log () {
	return this.app.debug('app:' + this.name);
    }
    
    apps = async (result) => {
	for (let [k, App] of Object.entries(this.appConfig.apps || {})) {
	    result[k] = new App(this);
	    result[k][Symbol.for('plugin')] = this.name;
	}
	return result
    }    
    
    data = async (result) => {
	const {data} = this.appConfig;
	return result.push.apply(result, data || []);
    }

    managers = async (result) => {
	const {managers} = this.appConfig;
	return Object.assign(result, managers || {});
    }

    providers = async (result) => {
	const {providers} = this.appConfig;
	Object.keys(providers || {}).forEach(k => {
	    result[k] = new providers[k](this.app)
	});
    }

    settings = async (result) => {
	const {settings} = this.appConfig;
	return Object.assign(result, settings || {});
    }

    tasks = async (result) => {
	const {tasks} = this.appConfig;
	return Object.assign(result, tasks || {});
    }

    utils = async (result) => {
	const {utils} = this.appConfig;
	return Object.assign(result, utils || {});
    }
}
