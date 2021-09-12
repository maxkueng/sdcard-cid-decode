function hex2dec(hex: string): number {
  return Number.parseInt(hex, 16);
}

function hex2ascii(hex: string): string {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

// https://www.cameramemoryspeed.com/sd-memory-card-faq/reading-sd-card-cid-serial-psn-internal-numbers/
function getManufacturerName(mid: string): string {
  return {
    '0x000001': 'Panasonic',
    '0x000002': 'Toshiba',
    '0x000003': 'SanDisk',
    '0x00001b': 'Samsung',
    '0x00001d': 'AData',
    '0x000027': 'Phision',
    '0x000028': 'Lexar',
    '0x000031': 'Silicon Power',
    '0x000041': 'Kingston',
    '0x000074': 'Transcend',
    '0x000082': 'Sony',
  }[mid] || 'Unknown';
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
  const mid = cid.slice(0, 2);
  const manufacturerId = `0x${mid.padStart(6, '0')}`;
  const manufacturerIdDecimal = hex2dec(mid);
  const manufacturer = getManufacturerName(manufacturerId);
  const oemId = hex2ascii(cid.slice(2, 6));
  const productName = hex2ascii(cid.slice(6, 16));
  const productRevision = `${hex2dec(cid[16])}.${hex2dec(cid[17])}`;
  const serialNumber = hex2dec(cid.slice(18, 26));
  const manufactureYear = hex2dec(cid.slice(27, 29)) + 2000;
  const manufactureMonth = hex2dec(cid[29]);
  const manufactureDate = `${String(manufactureMonth).padStart(2, '0')}/${manufactureYear}`;
  const crc7Checksum = hex2dec(cid.slice(30, 32));

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
