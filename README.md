sdcard-cid-decode
=================

**Decode the Card Identification (CID) of an SD card on Node.js and the browser.**

[![NPM](https://nodei.co/npm/sdcard-cid-decode.png)](https://nodei.co/npm/sdcard-cid-decode/)

This module will extract the information in the CID of an SD card. The CID can typically be found in `/sys/block/mmcblk0/device/cid`.

## Breaking changes in 2.0.0

- **CommonJS default export**: `require('sdcard-cid-decode')` now returns the function directly. Previously it returned `{ default: fn }` and consumers had to write `require('sdcard-cid-decode').default`. ESM `import decodeCID from 'sdcard-cid-decode'` is unchanged.
- **CRC7 checksum value**: `crc7Checksum` now returns the 7-bit CRC value as defined by the SD specification (the trailing byte right-shifted by 1 to drop the stop bit). Previous versions returned the raw trailing byte including the stop bit. If you compared this value against externally-computed CRC7s, you were comparing the wrong number; the new value is correct.
- **Input validation**: `decodeCID()` now throws `TypeError` for non-string or non-hex input and `RangeError` for inputs that are not 32 hex characters. Previously it silently produced garbage.
- **Manufacturer name fixes**: `0x000027` is now spelled `Phison` (was `Phision`), `0x000002` is now `Kioxia` (was `Toshiba`, rebranded in 2019), `0x00001d` is now `ADATA` (was `AData`).
- **Node 18+** required.

## Installation

```sh
npm install --save sdcard-cid-decode
```

## Example

ESM:

```js
import fs from 'node:fs';
import decodeCID from 'sdcard-cid-decode';

const cid = fs.readFileSync('/sys/block/mmcblk0/device/cid', 'utf8');

const info = decodeCID(cid);
console.log(info);

// {
//   manufacturerId: '0x000003',
//   manufacturerIdDecimal: 3,
//   manufacturer: 'SanDisk',
//   oemId: 'SD',
//   productName: 'SL16G',
//   productRevision: '8.0',
//   serialNumber: 724511351,
//   manufactureDate: '03/2019',
//   crc7Checksum: 0
// }
```

CommonJS:

```js
const decodeCID = require('sdcard-cid-decode');

const info = decodeCID('27504853443332473001b44eed00f221');
console.log(info);

// {
//   manufacturerId: '0x000027',
//   manufacturerIdDecimal: 39,
//   manufacturer: 'Phison',
//   oemId: 'PH',
//   productName: 'SD32G',
//   productRevision: '3.0',
//   serialNumber: 28593901,
//   manufactureDate: '02/2015',
//   crc7Checksum: 16
// }
```

## API

### `type CardIdentification`

 - `manufacturerId: string`: Hex representation of the manufacturer ID assigned by SD-3C, LLC.
 - `manufacturerIdDecimal: number`: Decimal representation of the manufacturer ID assigned by SD-3C, LLC
 - `manufacturer: string`: A guessed manufacturer name based on [this list](https://www.cameramemoryspeed.com/sd-memory-card-faq/reading-sd-card-cid-serial-psn-internal-numbers/), [this list](https://www.bahjeez.com/sd-card-manufacturer-ids/), and [the Linux kernel](https://github.com/torvalds/linux/blob/master/drivers/mmc/core/card.h). If the name is unknown then value will be `"Unknown"`
 - `oemId: string`: OEM / Application ID assigned by SD-3C, LLC
 - `productName: string`: Product name
 - `productRevision: string`: Product revision
 - `serialNumber: number` Serial number
 - `manufactureDate: string`: Manufacture date
 - `crc7Checksum:` 7-bit checksum

### `decodeCID(cid: string): CardIdentification`

Decodes a CID and returns all the information.

## License

Copyright (c) 2021-2026 Max Kueng

MIT License