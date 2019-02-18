
import CryptoJS from "crypto-js";


export default class Crypto {

    encrypt (string, password) {
	return CryptoJS.AES.encrypt(string, password)
    }
    
    decrypt (string, password) {
        return CryptoJS.AES.decrypt(string, password).toString(CryptoJS.enc.Utf8);
    }
    
    hash (object) {
        return CryptoJS.SHA256(JSON.stringify(object)).toString();
    }
}
