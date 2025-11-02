import { printInvalidInput,printOperationFailed } from '../io/print.js';
import { tokenize } from '../cli/tokenize.js';
import { commands } from './command-registry.js';
import { invalidInput } from '../io/errors.js';

async function notImplemented() {
    throw invalidInput();
}

const handlers = {
    nwd: {
        up: notImplemented,
        cd: notImplemented,
        ls: notImplemented,
    },
    fs: {
        cat: notImplemented, add: notImplemented, mkdir: notImplemented,
        rn: notImplemented,  cp: notImplemented,  mv: notImplemented, rm: notImplemented,
    },
    os:  { os: notImplemented },
    hash:{ hash: notImplemented },
    zip: { compress: notImplemented, decompress: notImplemented },
};

function validateArgs(cmd, spec, args) {
    if (args.__unclosedQuote) throw invalidInput();
    const count = args.length;
    if (spec.args === '0')  return count === 0;
    if (spec.args === '1')  return count === 1;
    if (spec.args === '2')  return count === 2;
    if (spec.args === '0+') return count >= 0;
    return false;
}



export async function dispatch(raw, session) {
    if (!raw) return;
    const tokens = tokenize(raw);
    if (tokens.__unclosedQuote) { printInvalidInput(); return; }
    const [cmd, ...rest] = tokens;
    if (!cmd) return;

    const spec = commands.get(cmd);
    if (!spec || !validateArgs(cmd, spec, rest)) {
        printInvalidInput();
        return;
    }

    if (cmd === 'os' && !spec.variants.has(rest[0])) {
        printInvalidInput();
        return;
    }

    try {
        const group = spec.group;
        const handler = (handlers[group] && handlers[group][cmd]) || notImplemented;
        await handler(session, rest);
    } catch (e) {
        if (e && e.kind === 'invalidInput') {
            printInvalidInput();
        } else {
            printOperationFailed();
        }
    }
}