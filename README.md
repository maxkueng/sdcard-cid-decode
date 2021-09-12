sdcard-cid-decode
=================

**Decode the Card Identification (CID) of an SD card on Node.js and the browser.**

[![NPM](https://nodei.co/npm/sdcard-cid-decode.png)](https://nodei.co/npm/sdcard-cid-decode/)

This module will extract the information in the CID of an SD card. The CID can typically be found in `/sys/block/mmcblk0/device/cid`.

## Installation

```sh
npm install --save sdcard-cid-decode
```

## Example

```js
import fs from 'fs';
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
```js
const cid = '27504853443332473001b44eed00f221';
const info = decodeCID(cid);
console.log(info);

// {
//   manufacturerId: '0x000027',
//   manufacturerIdDecimal: 39,
//   manufacturer: 'Phision',
//   oemId: 'PH',
//   productName: 'SD32G',
//   productRevision: '3.0',
//   serialNumber: 28593901,
//   manufactureDate: '02/2015',
//   crc7Checksum: 33
// }
```

## API

### `type CardIdentification`

 - `manufacturerId: string`: Hex representation of the manufacturer ID assigned by SD-3C, LLC.
 - `manufacturerIdDecimal: number`: Decimal representation of the manufacturer ID assigned by SD-3C, LLC
 - `manufacturer: string`: A guessed manufacturer name based on [this list](https://www.cameramemoryspeed.com/sd-memory-card-faq/reading-sd-card-cid-serial-psn-internal-numbers/). If the name is unknown then value will be `"Unknown"`
 - `oemId: string`: OEM / Application ID assigned by SD-3C, LLC
 - `productName: string`: Product name
 - `productRevision: string`: Product revision
 - `serialNumber: number` Serial number
 - `manufactureDate: string`: Manufacture date
 - `crc7Checksum:` 7-bit checksum

### `decodeCID(cid: string): CardIdentification`

Decodes a CID and returns all the information.

## License

Copyright (c) 2021 Max Kueng

MIT License