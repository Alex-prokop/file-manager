export function printWelcome(username) {
    console.log(`Welcome to the File Manager, ${username}!`);
}

export function printGoodbye(username) {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
}

export function printCwd(cwd) {
    console.log(`You are currently in ${cwd}`);
}

export function printInvalidInput() {
    console.log('Invalid input');
}

export function printOperationFailed() {
    console.log('Operation failed');
}
