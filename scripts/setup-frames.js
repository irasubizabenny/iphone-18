import fs from 'fs';
import path from 'path';

const folder1 = 'C:/Users/pc/Downloads/ezgif-7b8295686ba2c292-png-split';
const folder2 = 'C:/Users/pc/Downloads/ezgif-7a221e314e03f363-png-split';

console.log('Checking folders...');
if (!fs.existsSync(folder1)) {
  console.error('Folder 1 does not exist:', folder1);
  process.exit(1);
}
if (!fs.existsSync(folder2)) {
  console.error('Folder 2 does not exist:', folder2);
  process.exit(1);
}

const f1Files = fs.readdirSync(folder1).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
const f2Files = fs.readdirSync(folder2).filter(f => /\.(png|jpe?g|webp)$/i.test(f));

const extractNumber = (str) => {
  const match = str.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

f1Files.sort((a, b) => extractNumber(a) - extractNumber(b));
f2Files.sort((a, b) => extractNumber(a) - extractNumber(b));

console.log(`Folder 1 found: ${f1Files.length} frames (${f1Files[0]} to ${f1Files[f1Files.length - 1]})`);
console.log(`Folder 2 found: ${f2Files.length} frames (${f2Files[0]} to ${f2Files[f2Files.length - 1]})`);

// Check PNG dimensions from first frame
const sampleBuf = fs.readFileSync(path.join(folder1, f1Files[0]));
const width = sampleBuf.readUInt32BE(16);
const height = sampleBuf.readUInt32BE(20);
console.log(`Frame resolution: ${width}x${height} (aspect ratio: ${(width / height).toFixed(4)})`);

// Ensure public directories exist
const publicFramesDir = path.resolve('public/frames');
fs.mkdirSync(publicFramesDir, { recursive: true });

const targetFolder1 = path.join(publicFramesDir, 'folder1');
const targetFolder2 = path.join(publicFramesDir, 'folder2');

// Try creating junctions or symlinks
try {
  if (!fs.existsSync(targetFolder1)) {
    fs.symlinkSync(folder1, targetFolder1, 'junction');
    console.log('Created junction for folder 1');
  } else {
    console.log('Folder 1 link already exists');
  }
} catch (e) {
  console.warn('Junction for folder 1 failed, will use direct server streaming:', e.message);
}

try {
  if (!fs.existsSync(targetFolder2)) {
    fs.symlinkSync(folder2, targetFolder2, 'junction');
    console.log('Created junction for folder 2');
  } else {
    console.log('Folder 2 link already exists');
  }
} catch (e) {
  console.warn('Junction for folder 2 failed, will use direct server streaming:', e.message);
}

// Generate continuous timeline
const combinedFrames = [
  ...f1Files.map((filename, i) => ({
    index: i,
    folder: 1,
    originalFilename: filename,
    url: `/frames/folder1/${filename}`
  })),
  ...f2Files.map((filename, i) => ({
    index: f1Files.length + i,
    folder: 2,
    originalFilename: filename,
    url: `/frames/folder2/${filename}`
  }))
];

console.log(`Total continuous frames: ${combinedFrames.length}`);

// Write JSON manifest and TS data
const dataDir = path.resolve('src/data');
fs.mkdirSync(dataDir, { recursive: true });

const manifest = {
  totalFrames: combinedFrames.length,
  folder1Count: f1Files.length,
  folder2Count: f2Files.length,
  width,
  height,
  aspectRatio: width / height,
  frames: combinedFrames
};

fs.writeFileSync(path.join(dataDir, 'framesManifest.json'), JSON.stringify(manifest, null, 2));

const tsContent = `// Auto-generated frame sequence manifest
export interface FrameData {
  index: number;
  folder: 1 | 2;
  originalFilename: string;
  url: string;
}

export const FRAME_METADATA = {
  totalFrames: ${combinedFrames.length},
  folder1Count: ${f1Files.length},
  folder2Count: ${f2Files.length},
  width: ${width},
  height: ${height},
  aspectRatio: ${(width / height).toFixed(6)},
} as const;

export const FRAME_SEQUENCE: FrameData[] = ${JSON.stringify(combinedFrames, null, 2)};
`;

fs.writeFileSync(path.join(dataDir, 'frameSequence.ts'), tsContent);
console.log('Successfully generated framesManifest.json and frameSequence.ts!');
