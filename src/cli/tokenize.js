export function tokenize(input) {
    if (!input) return [];
    const tokens = [];
    let cur = '';
    let quote = null;

    for (let i = 0; i < input.length; i += 1) {
        const ch = input[i];

        if (quote) {
            if (ch === '\\') {
                const next = input[i + 1];
                if (next) {
                    cur += next;
                    i += 1;
                } else {
                    cur += ch;
                }
            } else if (ch === quote) {
                quote = null;
            } else {
                cur += ch;
            }
            continue;
        }

        if (ch === '"' || ch === "'") {
            quote = ch;
            continue;
        }
        if (/\s/.test(ch)) {
            if (cur.length) {
                tokens.push(cur);
                cur = '';
            }
            continue;
        }
        if (ch === '\\') {
            const next = input[i + 1];
            if (next) {
                cur += next;
                i += 1;
            } else {
                cur += ch;
            }
            continue;
        }
        cur += ch;
    }

    if (quote) {
        tokens.__unclosedQuote = true;
    }
    if (cur.length) tokens.push(cur);
    return tokens;
}
