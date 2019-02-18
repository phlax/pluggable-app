
import debug from 'debug'
// import PouchDB from "pouchdb";
// import PouchDBDebug from 'pouchdb-debug';


export default class DebugManager {

    get debug () {
	return debug;
    }
    
    setDebugging = (debugging) => {
	console.log('setting debugging actual', debugging);	
	if (debugging) {
	    // PouchDB.plugin(PouchDBDebug);
	    // PouchDB.debug.enable(debugging);
	    this.debug.enable(debugging);
	} else {
	    this.debug.disable();
	}
    }
}
