"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserNavigateTool = browserNavigateTool;
const actions_1 = require("../browser/actions");
async function browserNavigateTool(args) {
    try {
        await (0, actions_1.navigate)(args.url);
        return `Navigated to ${args.url}`;
    }
    catch {
        return `Error: failed to navigate to "${args.url}"`;
    }
}
