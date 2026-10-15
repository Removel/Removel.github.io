/**
 * 把 dist 部署到 gh-pages 分支。
 *
 * 替代 gh-pages 包：它在部署前会执行 `git rm` 清理发布目录，做法是把发布分支里
 * 每一个文件的路径都拼成同一条命令的参数。本仓库发布分支有 800 多个文件、路径
 * 拼接后约 33k 字符，超过了 Windows 单条命令行 32k 的上限，于是抛出
 * `spawn ENAMETOOLONG`（Linux 的 ARG_MAX 约 2MB，所以只在 Windows 上复现）。
 *
 * 这里改成让 git 自己扫描目录（`git add -A`），任何文件数量都不会超限。
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const REMOTE =
	process.env.DEPLOY_REMOTE ??
	"https://github.com/Removel/Removel.github.io.git";
const BRANCH = "gh-pages";

function git(args, cwd = DIST) {
	return execFileSync("git", args, { cwd, stdio: "inherit" });
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

// 每次从零初始化：构建产物由 dist/ 完整决定，不需要和分支历史耦合。
// 顺带清掉 dist/ 里可能残留的上一次部署的仓库。
fs.rmSync(path.join(DIST, ".git"), { recursive: true, force: true });

const name = readConfig("user.name") || "deploy-bot";
const email =
	readConfig("user.email") || "deploy-bot@users.noreply.github.com";

console.log(`> 部署 ${DIST} 到 ${BRANCH}`);
git(["init", "-b", BRANCH]);
git(["add", "-A"]);
git([
	"-c",
	`user.name=${name}`,
	"-c",
	`user.email=${email}`,
	"commit",
	"-m",
	`Deploy ${new Date().toISOString()}`,
]);
git(["remote", "add", "origin", REMOTE]);
// --force：gh-pages 分支只承载构建产物，不需要和本地历史保持可快进关系。
git(["push", "--force", "origin", `HEAD:${BRANCH}`]);
