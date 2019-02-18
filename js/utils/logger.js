

export default class Logger {
    _debug = false;
    _console = false;
    _logs = []
    _bufferSize = null;

    constructor (onLog) {
	this.onLog = onLog;

    }

    setBufferSize (bufferSize) {
	this._bufferSize = bufferSize;
    }
    
    get out () {
	return console;
    }

    get logs () {
	return this._logs;
    }

    _received (recv) {
	this.onLog(recv);
	this._logs.push(recv);
	if (this._bufferSize && this._logs.length > this._bufferSize) {
	    let _logs = [...this._logs].reverse();
	    _logs.length = this._bufferSize;
	    this._logs = _logs.reverse();	    
	}
    }

    log (msg) {
	this._received({type: 'log', msg});
	if (!this._console) {
	    return;
	}
	this.out.log(msg);
    }

    warn (msg) {
	this._received({type: 'warning', msg});
	this.out.warn(msg);
    }

    error (msg, error) {
	this._received({type: 'error', msg, error});
	this.out.error(msg);
	if (error) {
	    this.out.error(error);
	}
    }

    debug (msg, debug) {
	if (!this._debug) {
	    return;
	}
	this.out.debug(msg);
	if (debug) {
	    this.out.debug(debug);
	}
    }
}


export class WorkerLogger {

    constructor (port) {
	this.port = port;
    }

    log (msg) {
	this.port.postMessage({
	    log: true,
	    msg: msg});
    }

    error (msg, error) {
	console.warn(error);
	this.port.postMessage({
	    log: true,
	    error: JSON.stringify(error),
	    msg: msg});
    }

    warn (msg) {
	this.port.postMessage({
	    log: true,
	    warning: msg});
    }

    debug (msg, debug) {
	this.port.postMessage({
	    log: true,
	    debug: debug,
	    msg: msg});
    }
}
