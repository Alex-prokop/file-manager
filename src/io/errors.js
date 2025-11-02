export function invalidInput() {
    const e = new Error('Invalid input');
    e.kind = 'invalidInput';
    return e;
}

export function operationFailed() {
    const e = new Error('Operation failed');
    e.kind = 'operationFailed';
    return e;
}
