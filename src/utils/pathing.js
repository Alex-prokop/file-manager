import path from 'node:path';

function normalizeWin(p) {
    return process.platform === 'win32' ? p.toLowerCase() : p;
}

export function isInsideRoot(absPath, root) {
    const a = normalizeWin(path.resolve(absPath));
    const r = normalizeWin(path.resolve(root));
    const rWithSep = r.endsWith(path.sep) ? r : r + path.sep;
    return a === r || a.startsWith(rWithSep);
}

export function resolveWithin(session, inputPath) {
    const base = session.cwd;
    const abs = path.isAbsolute(inputPath)
        ? path.resolve(inputPath)
        : path.resolve(base, inputPath);
    return abs;
}
