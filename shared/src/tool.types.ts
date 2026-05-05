// shared/tool.types.ts
/**
 * Represents a definition for an executable tool or function available to the AI assistant.
 * @typedef {object} ToolDefinition
 * @property {string} name - The unique name of the tool.
 * @property {string} description - A brief description of what the tool does.
 * @property {string[]} parameters - An array of required or optional parameters the tool accepts.
 * @property {('function'|'api')} type - The type of the tool (e.g., native function or API call).
 */

/**
 * Represents the input parameters passed to a specific tool invocation.
 * @typedef {object} ToolParameters
 * @property {Record<string, any>} params - The actual key-value parameters for the tool.
 */

/**
 * Represents the result structure returned after a tool has been executed.
 * @typedef {object} ToolResult
 * @property {boolean} success - Indicates if the tool execution was successful.
 * @property {string} [errorMessage] - An error message if the execution failed.
 * @property {any} [data] - The data returned by the tool.
 */

export { };
