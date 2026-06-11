const fs = require('fs');

function getJpgDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    if (buffer[0] !== 0xFF || buffer[1] !== 0xD8) {
      return 'Not a valid JPEG';
    }
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xFF) {
        // Skip padding bytes
        offset++;
        continue;
      }
      const marker = buffer[offset + 1];
      if (marker === 0xD9 || marker === 0xDA) {
        // End of image or start of scan, stop searching
        break;
      }
      
      const length = buffer.readUInt16BE(offset + 2);
      // SOF0 (0xC0) or SOF2 (0xC2)
      if (marker === 0xC0 || marker === 0xC2 || marker === 0xC1) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return `${width}x${height}`;
      }
      offset += 2 + length;
    }
    return 'SOF marker not found';
  } catch (err) {
    return 'Error: ' + err.message;
  }
}

console.log('profile_photo.jpg:', getJpgDimensions('public/profile_photo.jpg'));
console.log('profile_avatar.png:', getJpgDimensions('public/profile_avatar.png'));
