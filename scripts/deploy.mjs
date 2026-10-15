/**
 * 把 dist 部署到 gh-pages 分支。
 *
 * 为什么不用 gh-pages 包：它在部署前执行 `git rm` 清理发布目录，做法是把发布分支里
 * 每一个文件的路径都拼成同一条命令的参数。本仓库发布分支有 800 多个文件、参数拼接
 * 约 33k 字符，超过 Windows 单条命令行 32k 的上限，于是抛出 `spawn ENAMETOOLONG`
 * （Linux 的 ARG_MAX 约 2MB，所以只在 Windows 上复现）。
 *
 * 这里改为让 git 自己扫描目录（`git add -A`），任何文件数量都不会超限。
 * 另外把仓库元数据放在 dist 之外并保留下载历史，使每次部署都以上一次发布为基线做
 * 增量推送——dist/ 里有约 1GB 静态资源，不能每次重传。
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const GIT_DIR = path.join(ROOT, "node_modules", ".cache", "deploy-git");
const REMOTE =
	process.env.DEPLOY_REMOTE ??
	"https://github.com/Removel/Removel.github.io.git";
const BRANCH = "gh-pages";

// 仓库元数据放在 dist 之外，免得被 `astro build` 清空 dist 时一起删掉。
const REPO = [`--git-dir=${GIT_DIR}`, `--work-tree=${DIST}`];

function git(args, options = {}) {
	return execFileSync("git", [...REPO, ...args], {
		stdio: "inherit",
		...options,
	});
}

/** 读取 git 配置，取不到时返回空串。 */
function readConfig(key) {
	try {
		return execFileSync("git", ["config", "--get", key], {
			cwd: ROOT,
			encoding: "utf-8",
		}).trim();
	} catch {
		return "";
	}
}

if (!fs.existsSync(DIST) || fs.readdirSync(DIST).length === 0) {
	console.error("dist/ 不存在或为空，请先运行 `pnpm run build`。");
	process.exit(1);
}

// GitHub Pages 默认走 Jekyll，会吞掉 _astro/ 这类下划线开头的目录。
fs.writeFileSync(path.join(DIST, ".nojekyll"), "");

try {
	if (!fs.existsSync(GIT_DIR)) {
		console.log("> 初始化部署仓库");
		fs.mkdirSync(path.dirname(GIT_DIR), { recursive: true });
		git(["init", "--quiet"]);
		git(["remote", "add", "origin", REMOTE]);
	} else {
		git(["remote", "set-url", "origin", REMOTE]);
	}

	// 以上一次发布为基线。首次运行要把整个发布分支拉下来（约 300MB），之后都是增量。
	let baseline = null;
	try {
		git(["fetch", "--quiet", "origin", BRANCH], { stdio: "ignore" });
		baseline = "FETCH_HEAD";
	} catch {
		console.log(`> 远程还没有 ${BRANCH} 分支，按首次发布处理`);
	}
	if (baseline) {
		// --mixed 只挪动 HEAD 和索引，dist/ 里的新构建产物原样保留，
		// 接下来 add -A 就会算出「相对上次发布」的真实差异。
		git(["reset", "--mixed", "--quiet", baseline]);
	}

	git(["add", "-A"]);

	const changed = execFileSync(
		"git",
		[...REPO, "diff", "--cached", "--name-only"],
		{ encoding: "utf-8", maxBuffer: 32 * 1024 * 1024 },
	)
		.split("\n")
		.filter(Boolean);

	if (changed.length === 0) {
		console.log("> 内容没有变化，跳过部署");
		process.exit(0);
	}

	const name = readConfig("user.name") || "deploy-bot";
	const email =
		readConfig("user.email") || "deploy-bot@users.noreply.github.com";

	git([
		"-c",
		`user.name=${name}`,
		"-c",
		`user.email=${email}`,
		"commit",
		"--quiet",
		"-m",
		`Deploy ${new Date().toISOString()}`,
	]);

	// 不带 --force：这次提交是在 FETCH_HEAD 之上长出来的，属于快进推送，
	// 只有真实变化的文件会被传输。
	console.log(`> 推送 ${changed.length} 个变化的文件到 ${BRANCH}`);
	git(["push", "origin", `HEAD:${BRANCH}`]);
} catch (error) {
	const detail = String(error.stderr || error.message || error).trim();
	console.error(`\n部署失败：\n${detail}`);
	process.exit(1);
}
