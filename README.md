# rikka7061.github.io

게임 개발자 김민수의 프로필 사이트입니다. GitHub Pages 로 `https://rikka7061.github.io/` 에 공개됩니다.
빌드 과정 없이 HTML·CSS 파일 그대로 올라가므로, 파일을 고쳐 `main` 에 push 하면 1~2분 뒤 사이트에 반영됩니다.

## 구조

```
index.html                  첫 화면 (소개 · 게임 목록 · 연락)
games/<게임>/index.html      게임별 페이지 (소개 · 스토어 링크 · 문의)
assets/site.css             공통 디자인 (라이트/다크 색은 맨 위 :root 변수)
assets/site.js              화면 테마 버튼
businessCard.html           웹 명함
portfolio.html              예전 주소 유지용 → 첫 화면 게임 목록으로 이동 (명함 QR 이 이 주소를 가리킴)
404.html                    없는 주소로 들어왔을 때
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

## 새 게임 추가하기

1. `games/dna/` 폴더를 복사해 새 이름(영문 소문자·하이픈, 예: `games/my-new-game/`)으로 만듭니다. 이 이름이 게임 속 링크 주소가 됩니다.
2. 새 폴더의 `index.html` 에서 제목, 장르, 플랫폼, 팀, 역할, 스토어 링크, 메일 제목(`subject=`)을 고칩니다.
3. `index.html`(첫 화면)의 `<ul class="games">` 안에 카드 `<li class="game">…</li>` 하나를 복사해 넣고 내용을 고칩니다.
4. 표지 색은 `assets/site.css` 의 `.cover-dna` 같은 규칙을 복사해 `--cover` 색과 무늬를 바꾸면 됩니다.

## 앞으로 넣으면 좋은 것

- **개인정보처리방침**: Google Play·App Store 는 게임마다 개인정보처리방침 URL 을 요구합니다.
  게임 페이지 아래에 `privacy.html`(예: `games/dna/privacy.html`)로 두면 스토어에 그 주소를 등록할 수 있습니다.
  광고·분석 SDK 사용 여부에 따라 내용이 달라지므로 게임별로 확인 후 작성하세요.
- 게임 스크린샷: 각 게임 폴더에 이미지를 넣고 `.cover` 대신 `<img>` 로 바꾸면 됩니다.
