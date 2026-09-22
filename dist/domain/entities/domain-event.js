export class DomainEvent {
    type;
    at;
    payload;
    constructor(type, at, payload) {
        this.type = type;
        this.at = at;
        this.payload = payload;
    }
}
//# sourceMappingURL=domain-event.js.map