import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor() {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey || encryptionKey.length !== 64) {
      throw new Error(
        'ENCRYPTION_KEY must be a 64-character hex string (32 bytes)',
      );
    }
    this.key = Buffer.from(encryptionKey, 'hex');
  }

  /**
   * Encrypts text using AES-256-GCM
   * @param text - Plain text to encrypt
   * @returns Encrypted string in format: iv:authTag:encrypted
   */
  encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      // Return IV + authTag + encrypted data
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
      this.logger.error('Encryption failed', error.stack);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypts text using AES-256-GCM
   * @param encryptedData - Encrypted string in format: iv:authTag:encrypted
   * @returns Decrypted plain text
   */
  decrypt(encryptedData: string): string {
    try {
      const parts = encryptedData.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      this.logger.error('Decryption failed', error.stack);
      throw new Error('Failed to decrypt data');
    }
  }
}
