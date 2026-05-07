"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executorService = exports.ExecutorService = void 0;
const readNote_tool_1 = require("../tools/readNote.tool");
const writeNote_tool_1 = require("../tools/writeNote.tool");
const appendNote_tool_1 = require("../tools/appendNote.tool");
const searchVault_tool_1 = require("../tools/searchVault.tool");
const semanticSearch_tool_1 = require("../tools/semanticSearch.tool");
const screenshot_tool_1 = require("../tools/screenshot.tool");
const browserNavigate_tool_1 = require("../tools/browserNavigate.tool");
const browserScrape_tool_1 = require("../tools/browserScrape.tool");
const getClipboard_tool_1 = require("../tools/getClipboard.tool");
const setClipboard_tool_1 = require("../tools/setClipboard.tool");
const runShell_tool_1 = require("../tools/runShell.tool");
const bus_1 = require("../events/bus");
const logger_service_1 = require("./logger.service");
class ExecutorService {
    async execute(call) {
        bus_1.bus.emit("tool:called", { name: call.name, args: call.arguments });
        logger_service_1.logger.info("Executing tool", { name: call.name });
        let result = "";
        let isError = false;
        try {
            switch (call.name) {
                case "read_note":
                    result = await (0, readNote_tool_1.readNoteTool)(call.arguments);
                    break;
                case "write_note":
                    result = await (0, writeNote_tool_1.writeNoteTool)(call.arguments);
                    break;
                case "append_note":
                    result = await (0, appendNote_tool_1.appendNoteTool)(call.arguments);
                    break;
                case "search_vault":
                    result = await (0, searchVault_tool_1.searchVaultTool)(call.arguments);
                    break;
                case "semantic_search":
                    result = await (0, semanticSearch_tool_1.semanticSearchTool)(call.arguments);
                    break;
                case "screenshot":
                    result = await (0, screenshot_tool_1.screenshotTool)();
                    break;
                case "browser_navigate":
                    result = await (0, browserNavigate_tool_1.browserNavigateTool)(call.arguments);
                    break;
                case "browser_scrape":
                    result = await (0, browserScrape_tool_1.browserScrapeTool)();
                    break;
                case "get_clipboard":
                    result = await (0, getClipboard_tool_1.getClipboardTool)();
                    break;
                case "set_clipboard":
                    result = await (0, setClipboard_tool_1.setClipboardTool)(call.arguments);
                    break;
                case "run_shell":
                    result = await (0, runShell_tool_1.runShellTool)(call.arguments);
                    break;
                default:
                    result = `Unknown tool: "${call.name}"`;
                    isError = true;
            }
        }
        catch (err) {
            result = `Tool execution error: ${err.message}`;
            isError = true;
        }
        bus_1.bus.emit("tool:result", { name: call.name, result, isError });
        return { toolCallId: call.id, result, isError };
    }
}
exports.ExecutorService = ExecutorService;
exports.executorService = new ExecutorService();
