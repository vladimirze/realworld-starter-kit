export default class Observable {
    constructor() {
        this.subscriptions = [];
    }

    subscribe(observer) {
        // TODO: should new observers get latest value when subscribed?
        this.subscriptions.push(observer);
        if (this.currentValue) {
            observer(this.currentValue);
        }
    }

    unsubscribe(observer) {
        const index = this.subscriptions.findIndex((subscription) => { return observer === subscription; });
        if (index >= 0) {
            this.subscriptions.splice(1, index);
        }
    }

    notify(value) {
        for (const observer of this.subscriptions) {
            observer(value);
        }

        this.currentValue = value;
    }
}



