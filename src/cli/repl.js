import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { printCwd } from '../io/print.js';
import { dispatch } from '../app/router.js';

export async function startRepl(session) {
    const rl = readline.createInterface({ input, output, terminal: true });

    const onSigint = () => {
        rl.close();
    };
    process.on('SIGINT', onSigint);

    rl.setPrompt('> ');
    rl.prompt();

    try {
        for await (const line of rl) {
            const raw = line?.trim();

            if (raw === '.exit') {
                rl.close();
                break;
            }

            await dispatch(raw, session);

            printCwd(session.cwd);
            rl.prompt();
        }
    } finally {
        process.off('SIGINT', onSigint);
    }
}
