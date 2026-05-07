"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolRegistry = void 0;
exports.toolRegistry = [
    {
        name: "read_note",
        description: "Reads a specific note from the Obsidian vault by its file path",
        parameters: {
            type: "object",
            properties: {
                path: { type: "string", description: "Relative path to the note e.g. 00-Core/AI-Memory.md" },
            },
            required: ["path"],
        },
    },
    {
        name: "write_note",
        description: "Creates or overwrites a note in the Obsidian vault",
        parameters: {
            type: "object",
            properties: {
                path: { type: "string", description: "Relative path for the note" },
                content: { type: "string", description: "Full markdown content to write" },
            },
            required: ["path", "content"],
        },
    },
    {
        name: "append_note",
        description: "Appends text to an existing vault note without overwriting it",
        parameters: {
            type: "object",
            properties: {
                path: { type: "string", description: "Relative path to the note" },
                content: { type: "string", description: "Text to append" },
            },
            required: ["path", "content"],
        },
    },
    {
        name: "search_vault",
        description: "Searches the Obsidian vault for notes relevant to a query",
        parameters: {
            type: "object",
            properties: {
                query: { type: "string", description: "Search query string" },
                limit: { type: "number", description: "Max results to return (default 5)" },
            },
            required: ["query"],
        },
    },
    {
        name: "semantic_search",
        description: "Performs semantic vector search across the vault knowledge base",
        parameters: {
            type: "object",
            properties: {
                query: { type: "string", description: "Natural language query" },
            },
            required: ["query"],
        },
    },
    {
        name: "screenshot",
        description: "Captures the user's screen and returns a visual description",
        parameters: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "browser_navigate",
        description: "Navigates the browser to a URL",
        parameters: {
            type: "object",
            properties: {
                url: { type: "string", description: "Full URL to navigate to" },
            },
            required: ["url"],
        },
    },
    {
        name: "browser_scrape",
        description: "Extracts visible text and links from the current browser page",
        parameters: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "get_clipboard",
        description: "Reads the current content of the system clipboard",
        parameters: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "set_clipboard",
        description: "Writes text to the system clipboard",
        parameters: {
            type: "object",
            properties: {
                text: { type: "string", description: "Text to write to clipboard" },
            },
            required: ["text"],
        },
    },
    {
        name: "run_shell",
        description: "Executes an allowlisted shell command and returns stdout",
        parameters: {
            type: "object",
            properties: {
                command: { type: "string", description: "Shell command to execute" },
            },
            required: ["command"],
        },
    },
];
