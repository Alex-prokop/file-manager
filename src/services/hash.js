import crypto from 'node:crypto';
import fss from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { ensureFile } from '../utils/validators.js';
import { isInsideRoot, resolveWithin } from '../utils/pathing.js';
import { operationFailed } from '../io/errors.js';

export async function hash(session, [filePath]) {
    try {
        const abs = resolveWithin(session, filePath);
        if (!isInsideRoot(abs, session.root)) throw operationFailed();
        await ensureFile(abs);

        const rs = fss.createReadStream(abs);
        const hash = crypto.createHash('sha256');
        hash.setEncoding('hex');

        await pipeline(rs, hash);
        console.log(hash.read());
    } catch {
        throw operationFailed();
    }
}
