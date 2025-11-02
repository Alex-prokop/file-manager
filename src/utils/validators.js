import fs from 'node:fs/promises';

export async function ensureDir(p) {
    const st = await fs.lstat(p);
    if (!st.isDirectory()) throw new Error('not a directory');
}

export async function ensureExists(p) {
    await fs.lstat(p);
}

export async function ensureFile(p) {
    const st = await fs.lstat(p);
    if (!st.isFile()) throw new Error('not a file');
}

export async function ensureNotExists(p) {
    try {
        await fs.lstat(p);
        throw new Error('already exists');
    } catch (e) {
        if (e && e.code === 'ENOENT') return;
        throw e;
    }
}