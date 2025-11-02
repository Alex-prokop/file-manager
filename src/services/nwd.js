import fs from 'node:fs/promises';
import path from 'node:path';
import { printDirList } from '../io/print.js';
import { operationFailed } from '../io/errors.js';
import { isInsideRoot, resolveWithin } from '../utils/pathing.js';
import { ensureDir } from '../utils/validators.js';

export async function up(session) {
    const parent = path.resolve(session.cwd, '..');
    if (!isInsideRoot(parent, session.root)) {
        return;
    }
    session.setCwd(parent);
}

export async function cd(session, [targetPath]) {
    try {
        const abs = resolveWithin(session, targetPath);
        //!! пока  не  уходит за root и не меняет диск на Windows
        if (!isInsideRoot(abs, session.root)) throw operationFailed();

        await ensureDir(abs);
        session.setCwd(abs);
    } catch {
        throw operationFailed();
    }
}

export async function ls(session) {
    try {
        const entries = await fs.readdir(session.cwd, { withFileTypes: true });
        const dirs = [];
        const files = [];
        for (const d of entries) {
            if (d.isDirectory()) dirs.push({ name: d.name, type: 'directory' });
            else files.push({ name: d.name, type: 'file' });
        }
        const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        dirs.sort(byName);
        files.sort(byName);
        printDirList([...dirs, ...files]);
    } catch {
        throw operationFailed();
    }
}
