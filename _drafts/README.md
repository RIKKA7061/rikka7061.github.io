# 공개 전 초안 (사이트에 올라가지 않음)

`_drafts` 폴더는 GitHub Pages 가 사이트에 올리지 않습니다. 다만 저장소가 공개라면 GitHub 에서는 누구나 볼 수 있습니다.

## 개인정보처리방침 초안 (`privacy/`)

플레이스토어에 출시한 3개 게임(DNA, OrBit, 판타즘 초대장 사건)의 초안입니다.
노란색 **[확인 필요]** 표시가 있는 곳은 실제 게임에 맞게 고쳐야 합니다. 특히:

1. **광고**: AdMob·Unity Ads 등을 넣었는지
2. **Unity 서비스**: Unity Analytics·Cloud Diagnostics(오류 보고)가 켜져 있는지
3. **로그인·서버**: Google Play 게임즈 로그인, 랭킹, 서버 저장 기능이 있는지
4. **인앱 결제** 여부
5. **개발자 이름**: Play 스토어에 표시되는 개발자(계정 주인)와 같게. 팀 프로젝트라 계정 주인이 팀원이면 그 팀원과 함께 정하세요.
6. **시행일**, 문의 메일 **보관 기간**, **책임자** 이름

Play Console 의 「앱 콘텐츠 → 데이터 보안」에 적은 내용과 이 방침이 서로 맞아야 합니다.

## 공개하는 방법

1. [확인 필요] 표시를 모두 고치고 지웁니다.
2. 파일을 `games/<게임>/privacy.html` 로 옮깁니다. (예: `privacy/dna.html` → `games/dna/privacy.html`)
3. 게임 페이지(`games/<게임>/index.html`)에 `<a href="privacy.html">개인정보처리방침</a>` 링크를 넣습니다.
4. Play Console 의 개인정보처리방침 URL 에 `https://rikka7061.github.io/games/<게임>/privacy.html` 을 등록합니다.
