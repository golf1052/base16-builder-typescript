'use strict';

export function mkdirpErrorHandler(err: NodeJS.ErrnoException): void {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
}
