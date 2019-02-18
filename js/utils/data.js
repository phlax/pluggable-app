

export class Iterator {

    constructor (batch) {
        this.batch = batch;
    }

    async run (cb) {
        // let count = 0;
	while (true) {
            let items = await this.batch.next();
            if (!items || items.length < 1) {
                break;
            }
	    for (let item of items) {
		await cb()
	    }
            // count = count + items.length;
            // console.log(count + ' items procesed');
        }
    }
}


export class Batch {
    _current = null;

    constructor (db, batchSize, initial) {
	this.db = db;
	this.batchSize = batchSize || 1000;
	this._current = initial;
    }

    async _getBatch () {
        let params = {limit: this.batchSize, revs: true} //, include_docs: true};

        if (this._current) {
            params.startkey = this._current;
            params.skip = 1;
        } else if (this.initialOffset) {
	    params.skip = this.initialOffset;
	}

	// params.limit = 1;

        let batch = await this.db.allDocs(params);
        if (batch.rows.length > 0) {
            this._current = batch.rows[batch.rows.length - 1].id;
            return batch.rows;
        }
    }

    async next () {
	let batch = await this._getBatch();
        if (batch) {
            return batch; // .map(r => r.doc);
        }
    }

}
