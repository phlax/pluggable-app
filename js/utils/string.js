
import {default as trunc} from "truncate-utf8-bytes";


export function capitalize (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}


export class Strip {

    /**
     * This provides a utility for stripping chars from beginning or end
     * of strings.
     *
     * By default it will strip whitespace - spaces,
     */

    strip = (str, char) => {
        return this.rstrip(this.lstrip(str, char), char)
    }

    lstrip = (str, char) => {
        return str.replace(new RegExp('^' + (char || '\\s') + '+'), '');
    }

    rstrip = (str, char) => {
        const match = new RegExp('^[^' + (char || '\\s') + ']')
        for (var i = str.length - 1; i >= 0; i--) {
            if (match.test(str.charAt(i))) {
                return str.substring(0, i + 1);
            }
        }
    }
}

export const strip = new Strip().strip;


export function truncate (string, chars, suffix) {
    if (string.length <= chars) {
	return string;
    }    
    if (!suffix && suffix !== null) {
	suffix = '...';
    } else if (suffix === null) {
	suffix = '';
    }
    return trunc(string, chars - suffix.length) + suffix;
}
