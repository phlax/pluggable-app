

export class Logs {

    constructor (worker) {
	this.worker = worker;
    }

    rotate = async () => {
	// prune any older than `n`
	// if still > `n2` then prune more
    }

    log = async (of, msg, params) => {
	const {data, utils} = this.worker;
	let {type, ...rest} = params || {};
	const uuid = utils.uuidv4();
	type = type || 'info';
	const _id = of + '@' + (new Date()).getTime() + '@' + uuid;
	const log = {_id, type, of, msg, ...rest}
	try {
	    await data['core.log'].put(log);
	    await this.notify(of, log);
	} catch (err) {
	    console.error('failed saving', log, err);
	}
    }

    notify = async (of, log) => {
	await this.worker.port.postMessage({
	    cmd: 'emit',
	    emit: 'log.' + of,
	    msg: {log}});
    }

    of = async (of, params) => {
	const {data} = this.worker;
	let {limit} = params || {};
	limit = limit || 100;
	// await this.log('worker', 'started')
	const logs = await data['core.log'].allDocs({
	    include_docs: true,
	    startkey: of + '@',
	    endkey: of + '@\uffff',
	    limit});
	return logs.rows.map(r => {
	    return {
		timestamp: parseInt(r.id.split('@')[1]),
		msg: r.doc.msg,
		type: r.doc.type,
		info: r.doc.info};
	});
    }

    truncate = async (of) => {
	// THIS SHOULD BATCH!
	const {data} = this.worker;
	const logs = await data['core.log'].allDocs(
	    {startkey: of + '@',
	     endkey: of + '@\uffff'});
	await data['core.log'].bulkDocs(
	    logs.rows.map(r => {
		let _r = {};
		_r._deleted = true;
		_r._rev = r.value.rev;
		_r._id = r.id;
		return _r;
	    }));
    }
}
