

class Listener {

    constructor (wrapped, name) {
	const _name = Symbol.for('name');
	wrapped[_name] = name;
	return wrapped;
    }
}


export default class Signals {

    signals = {};

    constructor (log) {
	this.log = log;
    }

    emit = async (name, params) => {
	this.log('emitting', name, this.signals[name]);
	if (Object.keys(this.signals).indexOf(name) === -1) {
	    return;
	}
        this.signals[name].forEach(async signal => {
	    // add err!
	    try {
		await signal(name, params);
	    } catch (err) {
		console.error('emitting failed', err);
	    }
        });
    }

    listen = (name, cb, listenerName) => {
        if (Object.keys(this.signals).indexOf(name) === -1) {
            this.signals[name] = [];
        }
        this.signals[name].push(
	    new Listener(cb, listenerName));
	this.log('listener added', name, listenerName, this.signals);
    }

    unlisten = (name, cb) => {
	this.log('unlistening', name, cb);
	if (!cb) {
	    delete this.signals[name];
	} else {
	    let i = this.signals[name].indexOf(cb);
	    if (i !== -1) {
		this.signals[name].splice(i, 1);
	    }
	    if (this.signals[name].length === 0) {
		delete this.signals[name];
	    }
	}
    }

    listening = async (listenTo, andDo, andCallback, params) => {
	if (!Array.isArray(listenTo)) {
	    listenTo = [listenTo];
	}
	listenTo.forEach(signal => this.listen(signal, andCallback));
	const  result = await andDo(params);
	listenTo.forEach(signal => this.unlisten(signal, andCallback));
	return result;
    }
}
