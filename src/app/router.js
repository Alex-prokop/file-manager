import { printInvalidInput } from '../io/print.js';

//!! Пока: временное решение
export async function dispatch(raw, _session) {
    if (!raw) return;
    printInvalidInput();
}
