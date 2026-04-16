import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const publicDir = new URL('../public/', import.meta.url).pathname;
const svgBuffer = readFileSync(join(publicDir, 'favicon.svg'));

const sizes = [
  { name: 'favicon-192.png', size: 192 },
  { name: 'favicon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-48.png', size: 48 },
  { name: 'favicon-96.png', size: 96 },
];

for (const { name, size } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(publicDir, name));
  console.log(`Generated ${name} (${size}x${size})`);
}

// Generate a proper multi-size ICO
await sharp(svgBuffer)
  .resize(48, 48)
  .png()
  .toFile(join(publicDir, 'favicon.ico'));
console.log('Generated favicon.ico (48x48 PNG fallback)');
