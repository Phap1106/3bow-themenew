import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFileSync } from "fs";

const SRC = "src/app/icon.png";          // PNG gốc (512x512 hoặc 256x256, nền trong)
const OUT = "src/app/favicon.ico";
const sizes = [16, 32, 48];

const bufs = await Promise.all(
  sizes.map(s => sharp(SRC).resize(s, s).png({ compressionLevel: 9 }).toBuffer())
);
const ico = await pngToIco(bufs);
writeFileSync(OUT, ico);                  // ghi dạng binary
console.log("✅ Generated", OUT, "(sizes:", sizes.join("/"), ")");
