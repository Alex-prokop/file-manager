import zlib from 'node:zlib';
import fss from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { operationFailed } from '../io/errors.js';
import { ensureDir, ensureFile, ensureNotExists } from '../utils/validators.js';
import { isInsideRoot, resolveWithin } from '../utils/pathing.js';


export async function compress(session, [srcPath, dstPath]) {
    try {
        const src = resolveWithin(session, srcPath);
        const dst = resolveWithin(session, dstPath);
        if (!isInsideRoot(src, session.root) || !isInsideRoot(dst, session.root)) throw operationFailed();

        await ensureFile(src);

        const dstDir = path.dirname(dst);
        await ensureDir(dstDir);
        await ensureNotExists(dst);

        const rs = fss.createReadStream(src);
        const ws = fss.createWriteStream(dst, { flags: 'wx' });
        const brotli = zlib.createBrotliCompress();

        await pipeline(rs, brotli, ws);
    } catch {
        throw operationFailed();
    }
}

export async function decompress(session, [srcPath, dstPath]) {
    try {
        const src = resolveWithin(session, srcPath);
        const dst = resolveWithin(session, dstPath);
        if (!isInsideRoot(src, session.root) || !isInsideRoot(dst, session.root)) throw operationFailed();

        await ensureFile(src);

        const dstDir = path.dirname(dst);
        await ensureDir(dstDir);
        await ensureNotExists(dst);

        const rs = fss.createReadStream(src);
        const ws = fss.createWriteStream(dst, { flags: 'wx' });
        const brotli = zlib.createBrotliDecompress();

        await pipeline(rs, brotli, ws);
    } catch {
        throw operationFailed();
    }
}
