/**
 * Locate the full Google Sans Flex variable font.
 *
 * The repo ships a 106 KB Latin subset (woff2) instead of the original 4 MB
 * variable font, so the design tools recover it from git history on demand.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const REL = 'public/fonts/GoogleSansFlex-Variable.ttf';

export function resolveSourceFont(root) {
  const explicit = process.env.FONT_TTF;
  if (explicit) {
    if (!fs.existsSync(explicit)) {
      throw new Error(`FONT_TTF 指向的文件不存在: ${explicit}`);
    }
    return explicit;
  }

  const tracked = path.join(root, REL);
  if (fs.existsSync(tracked)) return tracked;

  const tmp = path.join(os.tmpdir(), 'GoogleSansFlex-Variable.ttf');
  const git = (args) => execFileSync('git', args, { cwd: root, maxBuffer: 1 << 28 });

  // Still reachable from HEAD (e.g. the deletion is not committed yet).
  try {
    fs.writeFileSync(tmp, git(['show', `HEAD:${REL}`]));
    console.log(`源字体取自 git HEAD -> ${tmp}`);
    return tmp;
  } catch {}

  // Already committed away: find the commit that removed it.
  try {
    const sha = git(['log', '--all', '--diff-filter=D', '--format=%H', '-1', '--', REL])
      .toString()
      .trim();
    if (sha) {
      fs.writeFileSync(tmp, git(['show', `${sha}^:${REL}`]));
      console.log(`源字体取自 git 历史 (${sha.slice(0, 8)}) -> ${tmp}`);
      return tmp;
    }
  } catch {}

  throw new Error(
    `git 历史里找不到 ${REL}。\n` +
      '请用完整可变字体重跑，例如：\n' +
      '  FONT_TTF=/path/to/GoogleSansFlex-Variable.ttf node scripts/<tool>.mjs',
  );
}
