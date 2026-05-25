import { describe, expect, it } from 'vitest';
import decodeCID from './index.js';

describe('decodeCID', () => {
  describe('decodes known CIDs', () => {
    it('decodes a Phison SD32G card', () => {
      const result = decodeCID('27504853443332473001b44eed00f221');
      expect(result).toEqual({
        manufacturerId: '0x000027',
        manufacturerIdDecimal: 39,
        manufacturer: 'Phison',
        oemId: 'PH',
        productName: 'SD32G',
        productRevision: '3.0',
        serialNumber: 28593901,
        manufactureDate: '02/2015',
        crc7Checksum: 16,
      });
    });

    it('decodes a SanDisk SL16G card', () => {
      const result = decodeCID('035344534c313647802b2f2a77013300');
      expect(result).toEqual({
        manufacturerId: '0x000003',
        manufacturerIdDecimal: 3,
        manufacturer: 'SanDisk',
        oemId: 'SD',
        productName: 'SL16G',
        productRevision: '8.0',
        serialNumber: 724511351,
        manufactureDate: '03/2019',
        crc7Checksum: 0,
      });
    });
  });

  describe('manufacturer lookup', () => {
    it('returns Unknown for unmapped manufacturer IDs', () => {
      const result = decodeCID('ff504853443332473001b44eed00f221');
      expect(result.manufacturer).toBe('Unknown');
      expect(result.manufacturerId).toBe('0x0000ff');
      expect(result.manufacturerIdDecimal).toBe(255);
    });
  });

  describe('CRC7 extraction', () => {
    it('extracts the upper 7 bits of the trailing byte (ignoring stop bit)', () => {
      // trailing byte 0xff -> CRC7 = 0x7f (127), stop bit dropped
      const result = decodeCID('035344534c313647800000000000ffff');
      expect(result.crc7Checksum).toBe(0x7f);
    });

    it('returns 0 for trailing byte 0x01 (only stop bit set)', () => {
      const result = decodeCID('035344534c3136478000000000000001');
      expect(result.crc7Checksum).toBe(0);
    });
  });

  describe('case insensitivity', () => {
    it('accepts uppercase hex', () => {
      const lower = decodeCID('27504853443332473001b44eed00f221');
      const upper = decodeCID('27504853443332473001B44EED00F221');
      expect(upper).toEqual(lower);
    });
  });

  describe('whitespace handling', () => {
    it('trims surrounding whitespace and newlines', () => {
      const result = decodeCID('  27504853443332473001b44eed00f221\n');
      expect(result.manufacturer).toBe('Phison');
    });
  });

  describe('input validation', () => {
    it('throws TypeError for non-string input', () => {
      // biome-ignore lint/suspicious/noExplicitAny: testing runtime behavior with bad input
      expect(() => decodeCID(123 as any)).toThrow(TypeError);
    });

    it('throws RangeError for wrong length', () => {
      expect(() => decodeCID('27504853')).toThrow(RangeError);
      expect(() => decodeCID('27504853443332473001b44eed00f22100')).toThrow(RangeError);
    });

    it('throws TypeError for non-hex characters', () => {
      expect(() => decodeCID('zz504853443332473001b44eed00f221')).toThrow(TypeError);
    });
  });
});
