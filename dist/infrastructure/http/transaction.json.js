export function transactionJson(tx) {
    return {
        id: tx.id,
        amount: tx.amount,
        merchant: tx.merchant,
        country: tx.country,
        cardLast4: tx.cardLast4,
        createdAt: tx.createdAt,
        status: tx.status,
        score: tx.score
            ? { value: tx.score.value, level: tx.score.level, reasons: tx.score.reasons }
            : null,
        freeze: tx.freeze
            ? {
                frozen: tx.freeze.frozen,
                reference: tx.freeze.reference,
                note: tx.freeze.note,
            }
            : null,
    };
}
//# sourceMappingURL=transaction.json.js.map