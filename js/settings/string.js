
import Setting from './base';


export default class StringSetting extends Setting {
    name = "String"

    get key () {
        return this.setting.key;
    }

    get _rev () {
        return this.setting._rev;
    }

    get value () {
        return this.setting.value;
    }

    get custom () {
        return this.setting.custom;
    }
}
