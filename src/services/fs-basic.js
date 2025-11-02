import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { operationFailed } from '../io/errors.js';
import { isInsideRoot, resolveWithin } from '../utils/pathing.js';
import { ensureDir, ensureFile, ensureNotExists } from '../utils/validators.js';

export async function cat(session, [filePath]) {
    try {
        const abs = resolveWithin(session, filePath);
        if (!isInsideRoot(abs, session.root)) throw operationFailed();
        await ensureFile(abs);

        const rs = fss.createReadStream(abs, { encoding: 'utf8' });

        await new Promise((resolve, reject) => {
            rs.on('data', (chunk) => {
                const ok = process.stdout.write(chunk);
                if (!ok) {
                    rs.pause();
                    process.stdout.once('drain', () => rs.resume());
                }
            });
            rs.on('end', () => {
                process.stdout.write('\n');
                resolve();
            });
            rs.on('error', reject);
        });
    } catch {
        throw operationFailed();
    }
}

export async function add(session, [name]) {
    try {
        if (!name || name.includes('/') || name.includes('\\')) throw operationFailed();

        const target = path.resolve(session.cwd, name);
        if (!isInsideRoot(target, session.root)) throw operationFailed();
        await ensureNotExists(target);

        const fh = await fs.open(target, 'wx');
        await fh.close();
    } catch {
        throw operationFailed();
    }
}

export async function mkdir(session, [name]) {
    try {
        if (!name || name.includes('/') || name.includes('\\')) throw operationFailed();

        const target = path.resolve(session.cwd, name);
        if (!isInsideRoot(target, session.root)) throw operationFailed();
        await fs.mkdir(target, { recursive: false });
    } catch {
        throw operationFailed();
    }
}

export async function rn(session, [filePath, newName]) {
    try {
        if (!newName || newName.includes('/') || newName.includes('\\')) {
            throw operationFailed();
        }

        const src = resolveWithin(session, filePath);
        if (!isInsideRoot(src, session.root)) throw operationFailed();
        await ensureFile(src);

        const dest = path.resolve(path.dirname(src), newName);
        if (!isInsideRoot(dest, session.root)) throw operationFailed();
        await ensureNotExists(dest);

        await fs.rename(src, dest);
    } catch {
        throw operationFailed();
    }
}

export async function cp(session, [filePath, destDirPath]) {
    try {
        const src = resolveWithin(session, filePath);
        const destDir = resolveWithin(session, destDirPath);
        if (!isInsideRoot(src, session.root) || !isInsideRoot(destDir, session.root)) throw operationFailed();

        await ensureFile(src);
        await ensureDir(destDir);

        const dest = path.resolve(destDir, path.basename(src));
        await ensureNotExists(dest);

        const rs = fss.createReadStream(src);
        const ws = fss.createWriteStream(dest, { flags: 'wx' });
        await pipeline(rs, ws);
    } catch {
        throw operationFailed();
    }
}

export async function mv(session, [filePath, destDirPath]) {
    try {
        const src = resolveWithin(session, filePath);
        const destDir = resolveWithin(session, destDirPath);
        if (!isInsideRoot(src, session.root) || !isInsideRoot(destDir, session.root)) throw operationFailed();

        await ensureFile(src);
        await ensureDir(destDir);

        const dest = path.resolve(destDir, path.basename(src));
        await ensureNotExists(dest);

        const rs = fss.createReadStream(src);
        const ws = fss.createWriteStream(dest, { flags: 'wx' });
        await pipeline(rs, ws);

        await fs.unlink(src);
    } catch {
        throw operationFailed();
    }
}

export async function rm(session, [filePath]) {
    try {
        const abs = resolveWithin(session, filePath);
        if (!isInsideRoot(abs, session.root)) throw operationFailed();
        await ensureFile(abs);

        await fs.rm(abs, { force: false });
    } catch {
        throw operationFailed();
    }
}
