export declare class DomainEvent {
    readonly type: string;
    readonly at: string;
    readonly payload: Record<string, unknown>;
    constructor(type: string, at: string, payload: Record<string, unknown>);
}
