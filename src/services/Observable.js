export default class Observable {
    constructor(value) {
        this.subscriptions = [];
        this.currentValue = value;
        this._isCurrentValueSet = arguments.length > 0;
    }

    subscribe(observer) {
        this.subscriptions.push(observer);
        if (this._isCurrentValueSet) {
            observer(this.currentValue);
        }
    }

    unsubscribe(observer) {
        const index = this.subscriptions.findIndex((subscription) => { return observer === subscription; });
        if (index >= 0) {
            this.subscriptions.splice(index, 1);
        }
    }

    notify(value) {
        this.currentValue = value;
        this._isCurrentValueSet = true;

        for (const observer of this.subscriptions) {
            observer(value);
        }
    }
}
