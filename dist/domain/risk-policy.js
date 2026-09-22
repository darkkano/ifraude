export function levelFromValue(value) {
    if (value >= 70)
        return 'high';
    if (value >= 40)
        return 'medium';
    return 'low';
}
export function decideAction(score) {
    if (score.level === 'high')
        return 'freeze';
    if (score.level === 'medium')
        return 'flag';
    return 'clear';
}
//# sourceMappingURL=risk-policy.js.map