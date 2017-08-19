'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function mkdirpErrorHandler(err) {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
}
exports.mkdirpErrorHandler = mkdirpErrorHandler;
//# sourceMappingURL=helpers.js.map
