# Eleven 홈페이지 테마 가이드

eleven.me.kr 홈페이지의 디자인을 다른 사이트·프로젝트·AI에 그대로 옮기기 위한 문서입니다.

- **AI에게 줄 때:** 아래 「1. 바로 쓰는 프롬프트」를 통째로 복사해서 붙여 넣으세요.
- **직접 만들 때:** 「3. 시작용 CSS」를 복사해서 쓰면 같은 느낌이 바로 납니다.

---

## 1. 바로 쓰는 프롬프트

```
다음 디자인 테마로 만들어 줘. (Eleven 홈페이지 테마)

[분위기]
- 어두운 밤하늘 같은 보라색 다크 테마. 차분하고 깔끔하며, 강조는 보라색 하나만 쓴다.
- 로고는 보라색 우산. 여백을 넉넉히 두고, 장식보다 큰 글자와 정돈된 배치로 보여 준다.

[색]
- 배경 #0e0b14 (거의 검은 보라)
- 카드·박스 배경 #1a1426
- 구분선·테두리 #2a2338
- 본문 글자 #ece8f5 (밝은 회보라), 보조 글자 #a49bb6
- 강조 글자(링크·작은 제목·현재 메뉴) #b08af5 (밝은 보라)
- 버튼 배경 #7c4dcc + 흰 글자, 버튼 눌림 그림자 #4b2a8a
- 첫 화면(히어로) 배경: 오른쪽 위에 보라빛 번짐
  radial-gradient(ellipse at 75% 40%, rgba(124,77,204,.28), transparent 60%)
  + linear-gradient(160deg, #1b1230, #140e20 55%, #0e0b14)

[글꼴]
- Pretendard (CDN: https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/pretendard.min.css)
- 본문 줄 간격 1.6, 한글은 word-break: keep-all
- 큰 제목은 굵게(800) + 자간을 좁게(-0.02em ~ -0.035em)
- 섹션 위 작은 제목(eyebrow): 0.8rem, 굵기 800, 대문자, 자간 0.16em, 보라색

[레이아웃]
- 내용 최대 너비 1080px, 좌우 여백 16px
- 상단 메뉴: 화면 위에 붙어 있음(sticky), 반투명 어두운 배경 rgba(14,11,20,.85) + 흐림(blur 8px), 아래 1px 구분선
  - 왼쪽: 로고(40px) + 사이트 이름 / 오른쪽: 소문자 영어 메뉴 (about, portfolio ...)
  - 현재 메뉴는 보라색 글자 + 아래 2px 보라 밑줄
  - 휴대폰(640px 이하)에서는 메뉴가 로고 아래 한 줄로 내려가고 글자를 줄인다
- 첫 화면: 왼쪽에 큰 제목(최대 6.5rem, 끝에 보라색 마침표 "."), 설명, 버튼 2개 / 오른쪽에 둥근 그림
  - 800px 이하에서는 한 줄로 쌓고 그림을 위로
- 섹션 위아래 여백 넉넉하게 (56~96px)

[부품]
- 버튼: 모서리 12px, 안쪽 여백 12px 20px, 굵게
  - 기본 버튼: 보라 배경 #7c4dcc + 흰 글자
  - 보조 버튼: 투명 배경 + 2px 밝은 테두리
  - 마우스를 올리면 위로 2px 뜨고 아래에 4px 그림자 생김
- 카드: 모서리 20px, 2px 테두리 #2a2338, 마우스 올리면 테두리가 보라색 + 위로 2px
- 강조 카드: 보라 배경 #7c4dcc
- 정보 박스: 배경 #1a1426, 모서리 20px, 안쪽 여백 24px
- 알약 모양 태그: 보라 배경, 흰 글자, 모서리 99px
- 화면이 바뀔 때 아래에서 8px 올라오며 서서히 나타남(0.35초)

[피할 것]
- 보라 외의 강조색을 추가하지 말 것
- 순수한 흰 배경, 순수한 검정 #000 배경을 쓰지 말 것
- 그림자를 과하게 쓰지 말 것 (보라빛 은은한 번짐만)
```

---

## 2. 디자인 토큰 (값 정리)

### 색

| 이름 | 값 | 쓰는 곳 |
|---|---|---|
| `--bg` | `#0e0b14` | 페이지 배경 |
| `--soft` | `#1a1426` | 카드·정보 박스·메뉴 hover 배경 |
| `--line` | `#2a2338` | 구분선, 카드 테두리 |
| `--ink` | `#ece8f5` | 본문 글자, 보조 버튼 테두리 |
| `--muted` | `#a49bb6` | 설명·보조 글자, 아래쪽(footer) |
| `--purple` | `#b08af5` | 강조 글자, 링크, 현재 메뉴, eyebrow |
| `--btn` | `#7c4dcc` | 버튼·태그·강조 카드 배경 (글자는 흰색) |
| `--purple-deep` | `#4b2a8a` | 기본 버튼 hover 그림자 |
| `--pink` | `#f2a7c8` | 보조 포인트 (거의 안 씀) |

### 글자 크기

| 쓰는 곳 | 크기 | 굵기 |
|---|---|---|
| 첫 화면 큰 제목 | `clamp(3rem, 11vw, 6.5rem)` | 800, 자간 -0.035em, 줄 간격 1 |
| 페이지 제목 | `clamp(2rem, 6vw, 3rem)` | 800, 자간 -0.02em |
| 소개 문장 (강조 본문) | `clamp(1.15rem, 2.6vw, 1.45rem)` | 500, 줄 간격 1.75 |
| 첫 화면 설명 | `clamp(1.05rem, 2.4vw, 1.25rem)` | 기본, 보조 글자색 |
| 사이트 이름 | `1.35rem` | 800 |
| 메뉴 | `1.02rem` (휴대폰 `.86rem`) | 700 |
| eyebrow (작은 제목) | `.8rem`, 대문자, 자간 .16em | 800, 보라 |

### 모양

| 부품 | 모서리 | 기타 |
|---|---|---|
| 버튼 | 12px | 2px 테두리 |
| 메뉴 항목 | 10px | hover 시 `--soft` 배경 |
| 카드·정보 박스 | 20px | 2px `--line` 테두리 |
| 태그 | 99px (알약) | |
| 로고 원형 배경 | 50% | 보라빛 번짐 `0 0 80px rgba(124,77,204,.35)` |

### 반응형 기준

- `800px` 이하: 2단 → 1단
- `640px` 이하: 메뉴가 로고 아래 한 줄로
- `380px` 이하: 메뉴 글자 더 작게, 넘치면 옆으로 스크롤

---

## 3. 시작용 CSS

새 페이지의 `<head>` 안에 넣으면 같은 테마로 시작할 수 있습니다.

```html
<meta name="theme-color" content="#0e0b14">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/pretendard.min.css">
<style>
  :root {
    --bg: #0e0b14; --soft: #1a1426; --line: #2a2338;
    --ink: #ece8f5; --muted: #a49bb6;
    --purple: #b08af5; --btn: #7c4dcc; --purple-deep: #4b2a8a; --pink: #f2a7c8;
    --wrap: 1080px;
    color-scheme: dark;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--bg); color: var(--ink);
    font-family: Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif;
    line-height: 1.6; -webkit-font-smoothing: antialiased; word-break: keep-all;
  }
  a { color: inherit; }
  .wrap { max-width: var(--wrap); margin: 0 auto; padding: 0 16px; }

  /* 상단 메뉴 */
  .header { position: sticky; top: 0; z-index: 10; background: rgba(14,11,20,.85); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
  .header .wrap { display: flex; align-items: center; gap: 24px; min-height: 68px; flex-wrap: wrap; }
  .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; font-weight: 800; font-size: 1.35rem; }
  .brand img { width: 40px; height: 40px; }
  .nav { margin-left: auto; display: flex; gap: 4px; }
  .nav a { text-decoration: none; font-weight: 700; padding: 8px 12px; border-radius: 10px; transition: background .15s, color .15s; }
  .nav a:hover { background: var(--soft); color: var(--purple); }
  .nav a[aria-current="page"] { color: var(--purple); }
  .nav a[aria-current="page"]::after { content: ""; display: block; height: 2px; background: var(--purple); border-radius: 2px; margin-top: 2px; }
  @media (max-width: 640px) {
    .header .wrap { gap: 0; padding-top: 8px; }
    .nav { width: 100%; justify-content: space-between; padding-bottom: 6px; gap: 0; }
    .nav a { font-size: .86rem; padding: 8px 4px; white-space: nowrap; }
  }

  /* 글자 */
  .eyebrow { font-size: .8rem; font-weight: 800; letter-spacing: .16em; color: var(--purple); text-transform: uppercase; margin: 0; }
  h1 { font-size: clamp(2rem, 6vw, 3rem); letter-spacing: -.02em; line-height: 1.15; margin: 6px 0 0; }
  .muted { color: var(--muted); }

  /* 첫 화면 */
  .hero { background: radial-gradient(ellipse at 75% 40%, rgba(124,77,204,.28), transparent 60%), linear-gradient(160deg, #1b1230 0%, #140e20 55%, #0e0b14 100%); padding: 80px 0; }
  .hero h1 { font-size: clamp(3rem, 11vw, 6.5rem); line-height: 1; letter-spacing: -.035em; }
  .hero h1 span { color: var(--purple); } /* 제목 끝 "." */

  /* 버튼 */
  .btn { display: inline-flex; align-items: center; gap: 6px; text-decoration: none; font-weight: 700; padding: 12px 20px; border-radius: 12px; border: 2px solid var(--ink); background: transparent; color: var(--ink); transition: transform .15s, box-shadow .15s; }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 0 var(--ink); }
  .btn.primary { background: var(--btn); border-color: var(--btn); color: #fff; }
  .btn.primary:hover { box-shadow: 0 4px 0 var(--purple-deep); }

  /* 카드 · 박스 · 태그 */
  .card { display: block; text-decoration: none; padding: 22px; border-radius: 20px; border: 2px solid var(--line); transition: border-color .15s, transform .15s; }
  .card:hover { border-color: var(--purple); transform: translateY(-2px); }
  .card.accent { background: var(--btn); border-color: var(--btn); color: #fff; }
  .box { padding: 24px; border-radius: 20px; background: var(--soft); }
  .tag { display: inline-block; background: var(--btn); color: #fff; font-weight: 700; font-size: .85rem; padding: 6px 14px; border-radius: 99px; }

  /* 아래쪽 */
  .footer { border-top: 1px solid var(--line); padding: 22px 0 28px; color: var(--muted); font-size: .88rem; }

  /* 화면 전환 효과 */
  .fade-in { animation: fade .35s ease; }
  @keyframes fade { from { opacity: 0; transform: translateY(8px); } }
</style>
```

---

## 4. 로고

- 파일: `assets/home/logo.svg`(검은 테두리, 밝은 배경·탭 아이콘용), `assets/home/logo-light.svg`(밝은 테두리, 어두운 배경용)
- 모양: 왼쪽으로 기울어진 보라색 우산. 몸통 `#7c4dcc`, 왼쪽 면 밝은 보라 `#a97ff0`.
- 다른 사이트에서 쓸 때: `https://eleven.me.kr/assets/home/logo-light.svg`
