
import {
    AsyncParallelHook, AsyncSeriesBailHook, SyncBailHook,
    AsyncSeriesWaterfallHook} from 'tapable';
import {DebugManager} from './debugging';


export class PluggableApp {
    apps = {}
    data = {}
    hooks = {}
    permissions = [];
    manager = {}
    plugins = {};
    providers = {};
    setting = {};
    tasks = {}
    utils = {};

    _managers = {}
    _loaded = false;
    _failed = false;
    _hooks = {
	actions: [AsyncParallelHook, ['action']],
        managers: [AsyncParallelHook, ['result']],
	i18n: [SyncBailHook, []],
	// parallel hook ?
        l10n: [AsyncSeriesWaterfallHook, ['strings']],
        l10nExtra: [AsyncSeriesWaterfallHook, ['strings']],
	exporters: [AsyncSeriesWaterfallHook, ['exporter']],
	apps: [AsyncParallelHook, ['app']],
	data: [AsyncParallelHook, ['data']],
        providers: [AsyncSeriesWaterfallHook, ['data']],
	settings: [AsyncParallelHook, ['setting']],
	utils: [AsyncParallelHook, ['util']],
	worker: [AsyncSeriesBailHook, ['app']],
	tasks: [AsyncParallelHook, ['task']],
	signals: [SyncBailHook, []],
	logger: [SyncBailHook, []],
	crypto: [SyncBailHook, []]};

    constructor (debugging, onReady) {
	this.createDebugger(debugging);
	this.configure();
	this.log('configuration complete');	
	this.onReady = onReady;
    }

    configure () {
	this.log('configuration starting');
	this.getHooks();
    }

    createDebugger (debugging) {
	console.log('creating debugger', debugging);	
	this.manager['debug'] = new DebugManager(this, debugging);
	this.manager['debug'].setDebugging(debugging);	
	this.debug = this.manager['debug'].debug;
	this.log = this.debug('app:loader');
    }

    getHooks () {
	const {_hooks} = this;
	Object.entries(_hooks).forEach(([k, [hook, params]]) => {
	    this.hooks[k] = new hook(params);
	    this.log('hook added', k);
	});
	this.log('hooks added');
    }

    get isLoaded () {
	return this._loaded;
    }

    get hasFailed () {
	return this._failed;
    }

    _getManager = (name) => {
        return new this._managers[name](this);
    }

    _loadManager = async (name) => {
        return await this._getManager(name).load();
    }

    async _loadHooks (loaders) {
	const {hooks, log} = this;
	await Promise.all(loaders.map(async loader => {
		await hooks[loader].promise(this[loader]);
		log(loader + ' loaded', this[loader]);
	}));
    }
}
