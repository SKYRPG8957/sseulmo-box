# 사전 조사

- 확인일: 2026-06-13
- 출처 URL: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- 구현에 반영할 점: Astro는 정적 콘텐츠 중심으로 배포할 수 있고 Cloudflare Pages 배포 가이드가 제공된다. 이 MVP는 `astro build` 결과물을 Cloudflare Pages에 배포하도록 구성했다.

- 확인일: 2026-06-13
- 출처 URL: https://developers.cloudflare.com/pages/configuration/build-configuration/
- 구현에 반영할 점: Pages는 빌드 명령과 출력 디렉터리를 설정한다. 빌드 명령은 `npm run build`, 출력 디렉터리는 Astro 기본값인 `dist`로 안내한다.

- 확인일: 2026-06-13
- 출처 URL: https://developers.cloudflare.com/pages/functions/
- 구현에 반영할 점: Pages Functions는 Workers 런타임으로 서버 측 코드를 실행하는 기능이다. 1차 버전은 정적 페이지와 브라우저 처리만 사용하므로 Functions를 추가하지 않았다.

- 확인일: 2026-06-13
- 출처 URL: https://developers.cloudflare.com/pages/functions/pricing/
- 구현에 반영할 점: Pages Functions 요청은 Workers 요청으로 과금된다. 운영비를 0원에 가깝게 유지하기 위해 이 MVP는 Functions 호출 없이 정적 자산으로 동작하도록 했다.

- 확인일: 2026-06-13
- 출처 URL: https://developers.cloudflare.com/pages/functions/bindings/
- 구현에 반영할 점: KV, D1, R2 같은 바인딩은 Pages Functions에서 사용할 수 있다. 1차 버전 요구사항상 서버 저장소를 쓰지 않으므로 바인딩 설정은 제외했다.

- 확인일: 2026-06-13
- 출처 URL: https://support.google.com/adsense/answer/9724
- 구현에 반영할 점: AdSense는 고유하고 흥미로운 고품질 콘텐츠와 HTML 소스 접근 가능성을 요구한다. 도구 페이지와 가이드 글에 독립적인 한국어 설명과 FAQ를 포함했다.

- 확인일: 2026-06-13
- 출처 URL: https://support.google.com/adsense/answer/7299563
- 구현에 반영할 점: 사이트 페이지는 방문자에게 관련성 있는 고유 콘텐츠와 좋은 사용자 경험을 제공해야 한다. /about, /contact, /privacy, /terms 및 충분한 안내 콘텐츠를 구성했다.

- 확인일: 2026-06-13
- 출처 URL: https://support.google.com/adsense/answer/12171612
- 구현에 반영할 점: ads.txt는 루트에서 접근 가능해야 하며 publisher ID 형식이 맞아야 한다. `PUBLIC_ADSENSE_CLIENT`가 있을 때만 실제 publisher ID를 출력하도록 라우트로 구성했다.

- 확인일: 2026-06-13
- 출처 URL: https://support.google.com/adsense/answer/9261307
- 구현에 반영할 점: Auto ads 코드는 사이트 페이지에 삽입할 수 있다. `PUBLIC_ADSENSE_CLIENT`가 있을 때만 head에 스크립트를 출력하도록 분리했다.

- 확인일: 2026-06-13
- 출처 URL: https://support.google.com/adsense/answer/9274019
- 구현에 반영할 점: AdSense 코드와 광고 단위 코드는 계정에서 복사해 HTML에 붙인다. 실제 publisher ID와 ad slot은 환경변수로만 설정하며 값이 없으면 광고 스크립트와 광고 단위를 출력하지 않는다.
