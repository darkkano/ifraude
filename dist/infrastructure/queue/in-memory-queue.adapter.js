var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var InMemoryQueueAdapter_1;
import { Injectable, Logger } from '@nestjs/common';
let InMemoryQueueAdapter = class InMemoryQueueAdapter {
    static { InMemoryQueueAdapter_1 = this; }
    logger = new Logger(InMemoryQueueAdapter_1.name);
    waiting = [];
    handler = null;
    pumping = false;
    static DELAY_MS = 150;
    async enqueue(transactionId) {
        this.waiting.push(transactionId);
        this.logger.log(`enqueue id=${transactionId} pending=${this.waiting.length}`);
        this.kick();
    }
    consume(handler) {
        this.handler = handler;
        this.kick();
    }
    pendingCount() {
        return this.waiting.length;
    }
    kick() {
        if (this.pumping || !this.handler || this.waiting.length === 0)
            return;
        this.pumping = true;
        setTimeout(() => {
            void this.pump();
        }, InMemoryQueueAdapter_1.DELAY_MS);
    }
    async pump() {
        try {
            while (this.handler && this.waiting.length > 0) {
                const id = this.waiting.shift();
                if (!id)
                    break;
                this.logger.log(`worker toma id=${id}`);
                await this.handler(id);
            }
        }
        finally {
            this.pumping = false;
            if (this.waiting.length > 0)
                this.kick();
        }
    }
};
InMemoryQueueAdapter = InMemoryQueueAdapter_1 = __decorate([
    Injectable()
], InMemoryQueueAdapter);
export { InMemoryQueueAdapter };
//# sourceMappingURL=in-memory-queue.adapter.js.map