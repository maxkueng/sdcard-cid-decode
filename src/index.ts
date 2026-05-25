// MID -> silicon vendor.
// Note: many SD cards are sold under retail brands that differ from
// the silicon vendor.
// Sources:
//  - https://www.bahjeez.com/sd-card-manufacturer-ids/
//  - https://www.cameramemoryspeed.com/sd-memory-card-faq/reading-sd-card-cid-serial-psn-internal-numbers/
//  - https://github.com/torvalds/linux/blob/master/drivers/mmc/core/card.h
const MANUFACTURERS: Record<string, string> = {
  '0x000001': 'Panasonic',
  '0x000002': 'Kioxia',
  '0x000003': 'SanDisk',
  '0x000009': 'ATP',
  '0x00001b': 'Samsung',
  '0x00001d': 'ADATA',
  '0x000027': 'Phison',
  '0x000028': 'Lexar',
  '0x000031': 'Silicon Power',
  '0x000041': 'Kingston',
  '0x000074': 'Transcend',
  '0x000082': 'Sony',
  '0x00009c': 'Angelbird',
  '0x00009f': 'Kingston',
};

const CID_HEX_LENGTH = 32;
const HEX_PATTERN = /^[0-9a-fA-F]+$/;

function hex2dec(hex: string): number {
  return Number.parseInt(hex, 16);
}

function hex2ascii(hex: string): string {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(Number.parseInt(hex.slice(i, i + 2), 16));
  }
  return str;
}

export type CardIdentification = {
  readonly manufacturerId: string;
  readonly manufacturerIdDecimal: number;
  readonly manufacturer: string;
  readonly oemId: string;
  readonly productName: string;
  readonly productRevision: string;
  readonly serialNumber: number;
  readonly manufactureDate: string;
  readonly crc7Checksum: number;
};

export default function decodeCID(cid: string): CardIdentification {
  if (typeof cid !== 'string') {
    throw new TypeError('CID must be a string');
  }
  const trimmed = cid.trim();
  if (trimmed.length !== CID_HEX_LENGTH) {
    throw new RangeError(`CID must be ${CID_HEX_LENGTH} hex characters, got ${trimmed.length}`);
  }
  if (!HEX_PATTERN.test(trimmed)) {
    throw new TypeError('CID must contain only hexadecimal characters');
  }

  const mid = trimmed.slice(0, 2);
  const manufacturerId = `0x${mid.padStart(6, '0')}`;
  const manufacturerIdDecimal = hex2dec(mid);
  const manufacturer = MANUFACTURERS[manufacturerId] ?? 'Unknown';
  const oemId = hex2ascii(trimmed.slice(2, 6));
  const productName = hex2ascii(trimmed.slice(6, 16));
  const productRevision = `${hex2dec(trimmed[16])}.${hex2dec(trimmed[17])}`;
  const serialNumber = hex2dec(trimmed.slice(18, 26));
  const manufactureYear = hex2dec(trimmed.slice(27, 29)) + 2000;
  const manufactureMonth = hex2dec(trimmed[29]);
  const manufactureDate = `${String(manufactureMonth).padStart(2, '0')}/${manufactureYear}`;
  const crc7Checksum = hex2dec(trimmed.slice(30, 32)) >> 1;

  return {
    manufacturerId,
    manufacturerIdDecimal,
    manufacturer,
    oemId,
    productName,
    productRevision,
    serialNumber,
    manufactureDate,
    crc7Checksum,
  };
}
