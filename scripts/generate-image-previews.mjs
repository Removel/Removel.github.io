import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const publicDir = path.join(projectRoot, "public");

const supportedExtensions = new Set([
	".avif",
	".bmp",
	".jpeg",
	".jpg",
	".png",
	".tif",
	".tiff",
	".webp",
]);

const targets = [
	{
		name: "album",
		inputDir: path.join(publicDir, "images/albums"),
		outputDir: path.join(publicDir, "generated/image-previews/albums"),
		width: 1280,
		quality: 82,
	},
	{
		name: "desktop wallpaper",
		inputDir: path.join(publicDir, "assets/desktop-banner"),
		outputDir: path.join(
			publicDir,
			"generated/image-previews/wallpapers/desktop-banner",
		),
		width: 2560,
		quality: 84,
	},
	{
		name: "mobile wallpaper",
		inputDir: path.join(publicDir, "assets/mobile-banner"),
		outputDir: path.join(
			publicDir,
			"generated/image-previews/wallpapers/mobile-banner",
		),
		width: 1280,
		quality: 82,
	},
];

function collectImages(directory) {
	if (!fs.existsSync(directory)) {
		return [];
	}

	return fs
		.readdirSync(directory, { withFileTypes: true })
		.flatMap((entry) => {
			const entryPath = path.join(directory, entry.name);
			if (entry.isDirectory()) {
				return collectImages(entryPath);
			}

			const extension = path.extname(entry.name).toLowerCase();
			return supportedExtensions.has(extension) ? [entryPath] : [];
		});
}

function getOutputPath(inputPath, target) {
	const relativePath = path.relative(target.inputDir, inputPath);
	const parsedPath = path.parse(relativePath);
	return path.join(
		target.outputDir,
		parsedPath.dir,
		`${parsedPath.name}-preview.webp`,
	);
}

function shouldGenerate(inputPath, outputPath) {
	if (!fs.existsSync(outputPath)) {
		return true;
	}

	const inputStat = fs.statSync(inputPath);
	const outputStat = fs.statSync(outputPath);
	return inputStat.mtimeMs > outputStat.mtimeMs;
}

async function generatePreview(inputPath, outputPath, target) {
	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	await sharp(inputPath)
		.rotate()
		.resize({
			width: target.width,
			withoutEnlargement: true,
		})
		.webp({
			quality: target.quality,
			effort: 4,
		})
		.toFile(outputPath);
}

async function main() {
	const summary = {
		generated: 0,
		skipped: 0,
		failed: 0,
	};

	for (const target of targets) {
		const images = collectImages(target.inputDir);
		console.log(`\n${target.name}: ${images.length} source images`);

		for (const inputPath of images) {
			const outputPath = getOutputPath(inputPath, target);
			if (!shouldGenerate(inputPath, outputPath)) {
				summary.skipped += 1;
				continue;
			}

			try {
				await generatePreview(inputPath, outputPath, target);
				summary.generated += 1;
				console.log(
					`generated ${path.relative(projectRoot, outputPath)}`,
				);
			} catch (error) {
				summary.failed += 1;
				console.error(
					`failed ${path.relative(projectRoot, inputPath)}: ${error.message}`,
				);
			}
		}
	}

	console.log(
		`\nimage previews: ${summary.generated} generated, ${summary.skipped} skipped, ${summary.failed} failed`,
	);
}

main().catch((error) => {
	console.error("image preview generation failed:", error);
	process.exitCode = 1;
});
