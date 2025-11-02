import os from 'node:os';
import path from 'node:path';
import { isInsideRoot } from '../utils/pathing.js';

export function createSession({ username }) {
    const cwd = os.homedir();
    const { root } = path.parse(cwd);

    return {
        username,
        cwd,
        root,
        setCwd(next) {
            if (isInsideRoot(next, root))   this.cwd = next;
        }
    };
}
