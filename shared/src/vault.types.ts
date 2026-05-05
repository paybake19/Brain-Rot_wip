/**
 * @fileoverview TypeScript types related to the vault system.
 * Defines common structures for storing and accessing sensitive information.
 */

/**
 * Represents a key-value pair stored in the vault.
 * @param key The unique identifier for the stored item.
 * @param value The encrypted or sensitive content.
 * @param description A brief description of the item's purpose.
 */
export interface VaultItem {
    key: string;
    value: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface VaultSearchResult {
  vaultItem: VaultItem;
  score: number
}

// Defines potential authentication methods or access roles for the vault.
export type VaultRole = 'master' | 'admin' | 'read' | 'write';

/**
 * Configuration structure for initializing or connecting to the vault service.
 */
export interface VaultConfig {
    vaultEndpoint: string;
    apiToken: string;
    allowedRoles: VaultRole[];
}

// Minimal export to make the module structure clear
export type VaultType = VaultItem;
