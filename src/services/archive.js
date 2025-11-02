import zlib from 'node:zlib';
import fss from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { operationFailed } from '../io/errors.js';
import { ensureDir, ensureFile, ensureNotExists } from '../utils/validators.js';
import { isInsideRoot, resolveWithin } from '../utils/pathing.js';

async function pathStats(p) {
    try {
        return await fs.lstat(p);
    } catch (e) {
        if (e && e.code === 'ENOENT') return null;
        throw e;
    }
}

function stripBrExtension(filename) {
    return filename.toLowerCase().endsWith('.br')
        ? filename.slice(0, -3)
        : `${filename}.decompressed`;
}

async function resolveCompressDest(session, srcAbs, dstInputAbs) {
    const st = await pathStats(dstInputAbs);
    if (st && st.isDirectory()) {
        const outName = `${path.basename(srcAbs)}.br`;
        return path.resolve(dstInputAbs, outName);
    }
    return dstInputAbs;
}

async function resolveDecompressDest(session, srcAbs, dstInputAbs) {
    const st = await pathStats(dstInputAbs);
    if (st && st.isDirectory()) {
        const outName = stripBrExtension(path.basename(srcAbs));
        return path.resolve(dstInputAbs, outName);
    }
    return dstInputAbs;
}

export async function compress(session, [srcPath, dstPath]) {
    try {
        const srcAbs = resolveWithin(session, srcPath);
        const dstAbsInput = resolveWithin(session, dstPath);

        if (!isInsideRoot(srcAbs, session.root) || !isInsideRoot(dstAbsInput, session.root)) {
            throw operationFailed();
        }

        await ensureFile(srcAbs);

        const dstAbs = await resolveCompressDest(session, srcAbs, dstAbsInput);

        const parentDir = path.dirname(dstAbs);
        await ensureDir(parentDir);

        await ensureNotExists(dstAbs);

        const rs = fss.createReadStream(srcAbs);
        const ws = fss.createWriteStream(dstAbs, { flags: 'wx' });
        const brotli = zlib.createBrotliCompress();

        await pipeline(rs, brotli, ws);
    } catch {
        throw operationFailed();
    }
}

export async function decompress(session, [srcPath, dstPath]) {
    try {
        const srcAbs = resolveWithin(session, srcPath);
        const dstAbsInput = resolveWithin(session, dstPath);

        if (!isInsideRoot(srcAbs, session.root) || !isInsideRoot(dstAbsInput, session.root)) {
            throw operationFailed();
        }

        await ensureFile(srcAbs);

        const dstAbs = await resolveDecompressDest(session, srcAbs, dstAbsInput);

        const parentDir = path.dirname(dstAbs);
        await ensureDir(parentDir);

        await ensureNotExists(dstAbs);

        const rs = fss.createReadStream(srcAbs);
        const ws = fss.createWriteStream(dstAbs, { flags: 'wx' });
        const brotli = zlib.createBrotliDecompress();

        await pipeline(rs, brotli, ws);
    } catch {
        throw operationFailed();
    }
}
