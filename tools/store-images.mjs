// 배포할 때 GitHub Actions 에서 실행: 게임 페이지에 있는 플레이스토어 링크를 찾아
// 아이콘·대표 이미지·스크린샷을 내려받고 games/<게임>/store.json 을 만든다.
//
//   node tools/store-images.mjs <사이트 폴더>        (예: _site)
//
// - games/ 아래 각 폴더의 index.html 에서 https://play.google.com/store/apps/details?id=... 링크를 찾는다.
//   그래서 새 게임 폴더를 만들고 스토어 링크만 넣으면 자동으로 이미지가 붙는다.
// - 플레이스토어에서 못 가져오면, 지금 공개된 사이트에 있던 이미지를 그대로 다시 쓴다(사라지지 않게).
// - 어떤 경우에도 배포를 멈추지 않는다. 문제는 Actions 로그에 경고로 남긴다.
import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const SITE = process.argv[2] ?? '_site';
const LIVE = 'https://rikka7061.github.io';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const MAX_SHOTS = 8;
const STORE_RE = /https:\/\/play\.google\.com\/store\/apps\/details\?id=([A-Za-z0-9_.]+)/;
const EXT = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif' };

const warn = (msg) => console.log(`::warning::${msg}`);
const exists = (p) => access(p).then(() => true, () => false);
/** play-lh 이미지 주소에서 크기 옵션(= 뒤)을 떼어낸다 */
const base = (url) => (url ? url.replace(/=[^/]*$/, '') : url);

/** 1순위: google-play-scraper (플레이스토어 페이지의 데이터를 해석하는 라이브러리) */
async function fromScraper(appId) {
  const { default: gplay } = await import('google-play-scraper');
  const app = await gplay.app({ appId, lang: 'ko', country: 'kr' });
  return { title: app.title, icon: app.icon, header: app.headerImage, screenshots: app.screenshots ?? [] };
}

/** 2순위: 페이지 HTML 에서 직접 찾기 (라이브러리가 플레이스토어 변경으로 깨졌을 때 대비) */
async function fromHtml(appId) {
  const res = await fetch(`https://play.google.com/store/apps/details?id=${appId}&hl=en&gl=US`, {
    headers: { 'user-agent': UA, 'accept-language': 'en-US,en' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const meta = (p) => html.match(new RegExp(`<meta[^>]+property="${p}"[^>]+content="([^"]+)"`))?.[1];
  const shots = [];
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/alt="Screenshot image"/i.test(tag)) continue;
    const src = tag.match(/\bsrc="(https:\/\/play-lh\.googleusercontent\.com\/[^"]+)"/)?.[1];
    if (src) shots.push(base(src));
  }
  return { title: meta('og:title'), icon: meta('og:image'), header: null, screenshots: [...new Set(shots)] };
}

/** 이미지 하나 내려받기. 실제 형식(content-type)에 맞는 확장자로 저장하고 상대 경로를 돌려준다 */
async function download(url, dir, name) {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`이미지 HTTP ${res.status}: ${url}`);
  const type = (res.headers.get('content-type') ?? '').split(';')[0].trim();
  const ext = EXT[type];
  if (!ext) throw new Error(`이미지 형식 아님(${type}): ${url}`);
  const file = `${name}.${ext}`;
  await writeFile(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
  return `store/${file}`;
}

/** 지금 공개된 사이트의 store.json 과 이미지를 그대로 복사 (플레이스토어 접속 실패 대비) */
async function fromLive(slug, gameDir) {
  const root = `${LIVE}/games/${slug}/`;
  const res = await fetch(root + 'store.json', { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`공개 사이트에도 없음 (HTTP ${res.status})`);
  const data = await res.json();
  const files = [data.icon, data.header, ...(data.screenshots ?? [])].filter(Boolean);
  await mkdir(path.join(gameDir, 'store'), { recursive: true });
  for (const f of files) {
    const r = await fetch(root + f, { headers: { 'user-agent': UA } });
    if (!r.ok) throw new Error(`공개 사이트 이미지 HTTP ${r.status}: ${f}`);
    await writeFile(path.join(gameDir, f), Buffer.from(await r.arrayBuffer()));
  }
  return { ...data, source: 'live-copy' };
}

async function buildGame(slug, appId, gameDir) {
  let info = null;
  for (const [label, fn] of [['google-play-scraper', fromScraper], ['페이지 HTML', fromHtml]]) {
    try {
      info = await fn(appId);
      if (info?.icon) break;
      warn(`${slug}: ${label} 에서 아이콘을 찾지 못함`);
    } catch (e) {
      warn(`${slug}: ${label} 실패 - ${e.message}`);
    }
    info = null;
  }
  if (!info) throw new Error('플레이스토어 정보를 가져오지 못함');

  const dir = path.join(gameDir, 'store');
  await mkdir(dir, { recursive: true });
  const out = {
    appId,
    storeUrl: `https://play.google.com/store/apps/details?id=${appId}`,
    title: info.title ?? null,
    icon: await download(`${base(info.icon)}=s256`, dir, 'icon'),
    header: null,
    screenshots: [],
    fetchedAt: new Date().toISOString(),
    source: 'play-store',
  };
  if (info.header) {
    try {
      out.header = await download(`${base(info.header)}=w1200`, dir, 'header');
    } catch (e) {
      warn(`${slug}: 대표 이미지 실패 - ${e.message}`);
    }
  }
  const shots = [...new Set((info.screenshots ?? []).map(base))].slice(0, MAX_SHOTS);
  for (const [i, url] of shots.entries()) {
    try {
      out.screenshots.push(await download(`${url}=s960`, dir, `shot-${i + 1}`));
    } catch (e) {
      warn(`${slug}: 스크린샷 ${i + 1} 실패 - ${e.message}`);
    }
  }
  return out;
}

/** 링크 미리보기(카카오톡 등)에 쓰일 og:image 를 게임 페이지에 넣는다 */
async function addOgImage(gameDir, slug, data) {
  const img = data.header ?? data.screenshots?.[0] ?? data.icon;
  if (!img) return;
  const file = path.join(gameDir, 'index.html');
  const html = await readFile(file, 'utf8');
  if (html.includes('property="og:image"')) return;
  const tags = `  <meta property="og:image" content="${LIVE}/games/${slug}/${img}">\n  <meta name="twitter:card" content="summary_large_image">\n</head>`;
  await writeFile(file, html.replace('</head>', tags));
}

const gamesRoot = path.join(SITE, 'games');
const slugs = (await readdir(gamesRoot, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
const summary = [];
for (const slug of slugs) {
  const gameDir = path.join(gamesRoot, slug);
  const page = path.join(gameDir, 'index.html');
  if (!(await exists(page))) continue;
  const appId = (await readFile(page, 'utf8')).match(STORE_RE)?.[1];
  if (!appId) {
    summary.push(`- ${slug}: 플레이스토어 링크 없음 (기본 표지 사용)`);
    continue;
  }
  let data;
  try {
    data = await buildGame(slug, appId, gameDir);
  } catch (e) {
    warn(`${slug}: ${e.message} → 공개 사이트의 이전 이미지를 다시 씁니다`);
    try {
      data = await fromLive(slug, gameDir);
    } catch (e2) {
      warn(`${slug}: 이전 이미지도 없음 - ${e2.message} (기본 표지 사용)`);
      summary.push(`- ${slug} (${appId}): 실패, 기본 표지 사용`);
      continue;
    }
  }
  await writeFile(path.join(gameDir, 'store.json'), JSON.stringify(data, null, 2));
  await addOgImage(gameDir, slug, data);
  summary.push(
    `- ${slug} (${appId}): 아이콘 ${data.icon ? 1 : 0}, 대표 이미지 ${data.header ? 1 : 0}, 스크린샷 ${data.screenshots.length}장 [${data.source}]`,
  );
}
console.log(['플레이스토어 이미지', ...summary].join('\n'));
// Actions 실행 화면에 게임별 결과를 바로 보이게
for (const line of summary) console.log(`::notice title=플레이스토어 이미지::${line.replace(/^- /, '')}`);
if (process.env.GITHUB_STEP_SUMMARY) {
  await writeFile(process.env.GITHUB_STEP_SUMMARY, ['### 플레이스토어 이미지', ...summary].join('\n') + '\n', { flag: 'a' });
}
