import os from 'node:os';
import path from 'node:path';

export function createSession({ username }) {
    const cwd = os.homedir();
    const { root } = path.parse(cwd);

    return {
        username,
        cwd,
        root,
        setCwd(next) {
            this.cwd = next;
        }
    };
}
