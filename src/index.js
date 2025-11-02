import { parseUsername } from './cli/argv.js';
import { createSession } from './app/session.js';
import { startRepl } from './cli/repl.js';
import { printWelcome, printGoodbye, printCwd } from './io/print.js';

async function main() {
    const username = parseUsername(process.argv);

    const session = createSession({ username });

    printWelcome(session.username);
    printCwd(session.cwd);

    await startRepl(session);

    printGoodbye(session.username);
}

main().catch(() => {

});
