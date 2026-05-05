/**
 * @fileoverview TypeScript definitions for API related types and structures.
 * @module api.types
 */

/**
 * Defines a standard API response structure.
 * @template T - The expected data type of the successful response payload.
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errorCode?: string;
}

/**
 * Defines parameters for an API request.
 * @template T - The expected input payload.
 */
export interface ApiParams<T> {
    params: T;
    // Add common query/pagination parameters here if needed
    limit?: number;
    offset?: number;
}

/**
 * Example specific API type for a user profile.
 */
export interface UserProfile {
    id: string;
    username: string;
    email: string;
    lastLogin: Date;
}

// Placeholder for other API specific types
export type APIKey = string;
