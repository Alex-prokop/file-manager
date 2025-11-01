import { invalidInput } from '../io/errors.js';

export function parseUsername(argv) {
    // npm run start -- --username=your_username
    const arg = argv.find((a) => a.startsWith('--username='));
    if (!arg) throw invalidInput(); // строго по ТЗ
    const value = arg.split('=')[1]?.trim();
    if (!value) throw invalidInput();
    return value;
}
