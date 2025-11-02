import os from 'node:os';
import { operationFailed } from '../io/errors.js';

export async function osInfo(_session, [flag]) {
    try {
        switch (flag) {
            case '--EOL': {
                console.log(JSON.stringify(os.EOL));
                return;
            }
            case '--cpus': {
                const cpus = os.cpus() || [];
                console.log(`Overall CPUs: ${cpus.length}`);
                cpus.forEach((c, i) => {
                    const ghz = (c.speed / 1000).toFixed(2);
                    console.log(`#${i + 1}: ${c.model.trim()} | ${ghz} GHz`);
                });
                return;
            }
            case '--homedir': {
                console.log(os.homedir());
                return;
            }
            case '--username': {
                console.log(os.userInfo().username);
                return;
            }
            case '--architecture': {
                console.log(process.arch);
                return;
            }
            default:
                throw operationFailed();
        }
    } catch {
        throw operationFailed();
    }
}
