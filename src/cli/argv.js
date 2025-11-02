import { invalidInput } from '../io/errors.js';

export function parseUsername(argv) {
    const arg = argv.find((a) => a.startsWith('--username='));
    if (!arg) throw invalidInput();
    const value = arg.split('=')[1]?.trim();
    if (!value) throw invalidInput();
    return value;
}
