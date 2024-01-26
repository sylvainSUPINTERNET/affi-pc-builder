import readline from 'readline';

export function waitForEnter() {
    return new Promise<void>((resolve) => {
        const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
        });

        console.log('Appuyez sur "Entrée" pour continuer...');
        rl.on('line', () => {
        rl.close();
        resolve();
        });
    });
}

export let timeout = (milliseconds: number) => new Promise(r => setTimeout(r, milliseconds));
