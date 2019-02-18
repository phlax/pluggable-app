

export class OutOfTime extends Error {
    constructor(message) {
        super(message);
        this.name = "OutOfTimeError";
    }
}
