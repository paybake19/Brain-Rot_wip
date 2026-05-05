// shared/email.types.ts

/**
 * Defines the structure for a sender email address.
 * @param email The email address of the sender.
 * @param name The display name of the sender.
 */
export interface Sender {
    email: string;
    name: string;
}

/**
 * Defines the structure for a single recipient email address.
 * @param email The email address of the recipient.
 * @param type The type of recipient (e.g., 'to', 'cc', 'bcc').
 */
export interface Recipient {
    email: string;
    type: 'to' | 'cc' | 'bcc';
}

/**
 * Defines the basic structure of an email message.
 */
export interface EmailMessage {
    sender: Sender;
    recipients: Recipient[];
    subject: string;
    body: string;
    timestamp: Date;
}
