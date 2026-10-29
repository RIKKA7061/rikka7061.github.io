# rikka7061.github.io

게임 개발자 Sanamichi의 프로필 사이트입니다. GitHub Pages 로 `https://rikka7061.github.io/` 에 공개됩니다.
HTML·CSS 파일을 고쳐 `main` 에 올리면(웹에서 Commit 해도) GitHub Actions 가 1~2분 안에 배포합니다.
배포 진행 상황은 저장소의 **Actions** 탭 「사이트 배포」에서 볼 수 있습니다.

## 플레이스토어 이미지 (자동)

게임 페이지에 플레이스토어 링크(`https://play.google.com/store/apps/details?id=...`)가 있으면,
배포할 때 그 게임의 **아이콘·대표 이미지·스크린샷(최대 8장)** 을 플레이스토어에서 가져와 함께 올립니다.

- 첫 화면 카드: 표지가 대표 이미지(없으면 첫 스크린샷)로 바뀌고 제목 옆에 아이콘이 붙습니다.
  표지를 누르면 플레이스토어로, 스토어 링크가 없는 게임은 그 게임의 정보 페이지로 갑니다.
- 게임 페이지: 위쪽 이미지, 제목 옆 아이콘, 옆으로 넘겨 보는 스크린샷 모음. 링크 미리보기(카카오톡 등) 이미지도 자동 설정.
- 스토어 링크가 없는 게임(예: 악몽회귀자)은 원래 색 표지를 그대로 씁니다.
- 새 게임: 게임 폴더를 만들고 스토어 링크만 넣으면 다음 배포 때 이미지가 자동으로 붙습니다.
- 스토어에서 이미지를 바꾸면: 매주 월요일 자동으로 새로 가져오고, 바로 반영하려면 Actions 탭 「사이트 배포」→ **Run workflow**.
- 플레이스토어 접속에 실패해도 배포는 멈추지 않고, 지금 사이트에 있던 이미지를 그대로 씁니다. 결과는 Actions 실행 화면의 요약에 나옵니다.
- 이미지는 저장소에 저장되지 않고 배포할 때만 만들어집니다 (`tools/store-images.mjs`, `.github/workflows/pages.yml`).
- 내 컴퓨터에서 HTML 파일을 바로 열면 이미지 없이 원래 표지로 보입니다(정상).

## 구조

```
index.html                  첫 화면 (소개 · 게임 목록 · 연락)
games/<게임>/index.html      게임별 페이지 (소개 · 스토어 링크 · 문의)
assets/site.css             공통 디자인 (라이트/다크 색은 맨 위 :root 변수)
assets/site.js              화면 테마 버튼
businessCard.html           웹 명함
portfolio.html              예전 주소 유지용 → 첫 화면 게임 목록으로 이동 (명함 QR 이 이 주소를 가리킴)
404.html                    없는 주소로 들어왔을 때
print.html                  인쇄용 포트폴리오 (A4, QR 코드)
assets/print.css            인쇄용 디자인
assets/qr/, assets/print/   인쇄용 QR 코드, 사이드 프로젝트 화면 사진
tools/store-images.mjs      배포 때 플레이스토어 이미지를 가져오는 스크립트
.github/workflows/pages.yml 배포 설정 (main 에 올릴 때, 매주 월요일, 수동 실행)
livealone/                  사이드 프로젝트 '자취생활 마스터' 데모 (LiveAlone 저장소에서 npm run build:demo 결과물)
_drafts/                    공개 전 초안 (밑줄로 시작하는 폴더라 사이트에 올라가지 않음)
```

## 게임 안에 넣을 링크

게임마다 아래 주소를 쓰세요. **한 번 게임에 넣은 주소는 바꾸지 마세요** (출시된 게임 속 링크는 고칠 수 없으므로).
내용(설명, 스토어 링크, 공지)은 페이지에서만 고치면 됩니다.

| 게임 | 주소 |
| --- | --- |
| DNA | https://rikka7061.github.io/games/dna/ |
| OrBit | https://rikka7061.github.io/games/orbit/ |
| 악몽회귀자 | https://rikka7061.github.io/games/nightmare-regressor/ |
| 판타즘 초대장 사건 | https://rikka7061.github.io/games/phantasm/ |

## 인쇄용 포트폴리오 (면접 제출용)

- `print.html`: A4 세로·흰 배경·사진 중심. 링크 대신 QR 코드(사이트, 게임별 페이지, 사이드 프로젝트 데모)가 들어갑니다.
  사이트에서 열면 플레이스토어 이미지가 자동으로 채워지고, 위쪽 **인쇄하기** 버튼으로 바로 인쇄할 수 있습니다.
- `portfolio.pdf`: 배포할 때마다 `print.html` 을 스토어 이미지까지 넣어 PDF 로 자동 생성합니다
  (`https://rikka7061.github.io/portfolio.pdf`, `print.html` 의 **PDF 받기**). 결과는 Actions 실행 화면의 「인쇄용 PDF」 알림에 나옵니다.
- 내용(소개, 표, 게임별 설명)은 `print.html` 을 직접 고치면 됩니다. 사진 배치는 `assets/print.css`.
- QR 코드 이미지는 `assets/qr/` (주소가 바뀌지 않으므로 다시 만들 일은 거의 없습니다).
- 사이드 프로젝트 화면 사진: `assets/print/livealone-*.webp`

## 사이드 프로젝트 데모 갱신

LiveAlone 저장소에서 `npm run build:demo` 를 실행한 뒤 `dist-demo/` 안의 파일로 `livealone/` 폴더를 통째로 바꾸면 됩니다.
공개 데모 빌드에는 마스코트 일러스트가 들어가지 않습니다(권리 확인 전).

## 새 게임 추가하기

1. `games/dna/` 폴더를 복사해 새 이름(영문 소문자·하이픈, 예: `games/my-new-game/`)으로 만듭니다. 이 이름이 게임 속 링크 주소가 됩니다.
2. 새 폴더의 `index.html` 에서 제목, 장르, 플랫폼, 팀, 역할, 스토어 링크, 메일 제목(`subject=`)을 고칩니다.
   스토어 링크를 넣으면 이미지는 배포 때 자동으로 붙습니다.
3. `index.html`(첫 화면)의 `<ul class="games">` 안에 카드 `<li class="game">…</li>` 하나를 복사해 넣고 내용을 고칩니다.
4. 표지 색은 `assets/site.css` 의 `.cover-dna` 같은 규칙을 복사해 `--cover` 색과 무늬를 바꾸면 됩니다.

## 앞으로 넣으면 좋은 것

- **개인정보처리방침**: 출시한 3개 게임의 초안이 `_drafts/privacy/` 에 있습니다.
  확인할 것과 공개하는 방법은 `_drafts/README.md` 를 보세요.
