/**
 * @fileoverview Minimal boilerplate for voice-related types used throughout the application.
 * @module voice.types
 */

// Defines the recognized set of voice commands.
export type VoiceCommand = 'Morning' | 'Lets Dual' | 'Bed Down' | 'Switch Mode' | 'Save That' | string;

/**
 * Defines the structure of a captured voice input.
 * @typedef {object} VoiceInput
 * @property {VoiceCommand} command - The recognized command.
 * @property {string} text - The transcribed text of the command.
 * @property {Date} timestamp - The time the command was recorded.
 */

/**
 * Defines the parameters for mode switching.
 * @typedef {string} ModeName
 */

/**
 * Enum-like structure for predefined operating modes.
 * @enum {string}
 */
export const ModeName: {
    TEACHING: 'TEACHING';
    OPERATIONAL: 'OPERATIONAL';
    SLEEP: 'SLEEP';
} = {
    TEACHING: 'TEACHING',
    OPERATIONAL: 'OPERATIONAL',
    SLEEP: 'SLEEP',
};

/**
 * An interface representing the details needed to execute a specific voice command.
 * @typedef {object} VoiceCommandDetails
 * @property {VoiceCommand} command - The specific command executed.
 * @property {Map<string, any>} payload - Additional data associated with the command (e.g., mode name).
 */

//export type VoiceInputHandler = (input: VoiceInput) => Promise<void>;
