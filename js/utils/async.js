
import uuidv4 from 'uuid/v4';

import {OutOfTime} from '../errors';


export class Syncify {
    uuid = null;

    constructor (params) {
        const {
            signals,
            todo,
            resolves=null,
            rejects=null,
            timeout=10000} = params;
	this.signals = signals;
	this.todo = todo;
	this.resolves = resolves;
	this.rejects = rejects;
        this._timeout = timeout;
    }

    getUUID () {
        return uuidv4();
    }

    onEmit = (uuid, msg) => {
        if (this.rejects) {
            const failure = this.rejects(msg);
            if (failure) {
                this.reject(failure);
            }
        }
        if (this.resolves !== null) {
            const resolves = this.resolves(msg);
            if (resolves) {
                this.resolve(msg);
            }
        } else {
            this.resolve(msg);
        }
    }

    onTimeout = () => {
        this.reject(new OutOfTime(this.uuid));
    }

    setTimer () {
        if (this._timeout) {
            this.timeout = setTimeout(
                this.onTimeout,
                this._timeout);
        }
    }

    release (response) {
	if (response.uuid) {
	    delete response.uuid;
	}
        clearTimeout(this.timeout);        
        this.signals.unlisten(
	    this.uuid,
	    this.onEmit)
    }

    resolve (response) {
        this.release(response);
        this._resolve(response);
    }

    reject (error) {
        this.release(error);
        this._reject(error);
    }
    
    async syncify () {
        this.uuid = this.getUUID();
        this.signals.listen(this.uuid, this.onEmit, 'syncify');
        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
            this.setTimer();
            this.todo(this.uuid);
        });

    }
}


export async function syncify (params) {
    return await new Syncify(params).syncify();
}
