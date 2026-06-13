export type GuideMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  path: string;
  tool: string;
  body: string;
};

const faq = `
<h2>FAQ</h2>
<h3>이 순서대로만 해야 하나요?</h3>
<p>아닙니다. 제출처나 상황에 맞게 필요한 부분만 적용하면 됩니다.</p>
<h3>파일이 서버로 전송되나요?</h3>
<p>관련 도구는 가능한 한 이 화면 안에서 처리합니다. 민감한 파일은 저장 전 결과를 직접 확인하세요.</p>
<h3>결과를 그대로 제출해도 되나요?</h3>
<p>제출 전 파일명, 순서, 개인정보 포함 여부를 다시 확인하는 것이 좋습니다.</p>
`;

export const guides: GuideMeta[] = [
  {
    slug: "merge-pdf-files",
    title: "PDF 여러 개 합치는 법",
    description: "여러 PDF를 한 파일로 묶기 전 확인할 순서입니다.",
    category: "PDF/서류",
    path: "/guides/merge-pdf-files",
    tool: "pdf-kit",
    body: `
<p>지원 서류나 스캔 파일을 제출할 때 PDF가 여러 개로 나뉘어 있으면 받는 사람이 확인하기 어렵습니다. 먼저 제출할 순서를 정하고, 필요 없는 파일을 제외한 뒤 하나의 PDF로 합치면 됩니다.</p>
<h2>순서대로 하기</h2>
<ol>
  <li>제출처 안내에서 필요한 파일을 확인합니다.</li>
  <li>PDF 파일명을 보고 순서를 정합니다.</li>
  <li><a href="/tools/pdf-kit">PDF 정리</a>에서 파일을 선택합니다.</li>
  <li>위/아래 버튼으로 순서를 맞춥니다.</li>
  <li>새 파일명을 입력하고 저장합니다.</li>
</ol>
<h2>자주 실수하는 부분</h2>
<p>스캔본 앞뒤가 바뀌거나, 같은 파일을 두 번 넣는 경우가 많습니다. 합친 뒤에는 첫 페이지와 마지막 페이지를 열어 확인하세요.</p>
${faq}`
  },
  {
    slug: "pdf-submit-order",
    title: "PDF 제출 전에 파일 순서 정리하는 법",
    description: "제출용 PDF 순서를 정할 때 확인할 항목입니다.",
    category: "PDF/서류",
    path: "/guides/pdf-submit-order",
    tool: "pdf-kit",
    body: `
<p>제출용 PDF는 내용보다 순서에서 실수가 자주 납니다. 신청서, 증빙, 신분 확인 자료처럼 읽는 순서가 있는 파일은 먼저 목록을 적어두면 덜 헷갈립니다.</p>
<h2>실제 예시</h2>
<p>입사지원이라면 이력서, 자기소개서, 포트폴리오, 자격증 사본 순서로 정리할 수 있습니다. 지원사업은 신청서, 계획서, 증빙자료 순서가 보통 읽기 쉽습니다.</p>
<h2>순서대로 하기</h2>
<ol>
  <li>제출 안내문에 나온 순서를 확인합니다.</li>
  <li>파일명 앞에 01, 02처럼 번호를 붙입니다.</li>
  <li><a href="/tools/pdf-kit">PDF 정리</a>에서 같은 순서로 선택합니다.</li>
  <li>합친 뒤 페이지가 누락되지 않았는지 봅니다.</li>
</ol>
${faq}`
  },
  {
    slug: "document-file-name-rules",
    title: "제출서류 파일명 정리하는 법",
    description: "파일명을 제출자와 서류명 기준으로 맞추는 방법입니다.",
    category: "PDF/서류",
    path: "/guides/document-file-name-rules",
    tool: "document-packager",
    body: `
<p>파일명이 제각각이면 제출 전에 빠진 서류를 찾기 어렵습니다. 이름, 서류명, 날짜 정도만 넣어도 확인이 훨씬 쉬워집니다.</p>
<h2>파일명 예시</h2>
<ul>
  <li>홍길동_이력서.pdf</li>
  <li>홍길동_포트폴리오.pdf</li>
  <li>홍길동_경력증명서.pdf</li>
</ul>
<h2>순서대로 하기</h2>
<ol>
  <li><a href="/tools/document-packager">서류 묶기</a>에서 제출 상황을 고릅니다.</li>
  <li>체크리스트에 필요한 서류를 추가합니다.</li>
  <li>파일을 항목에 연결하고 추천 파일명을 확인합니다.</li>
  <li>누락 항목이 없으면 ZIP으로 저장합니다.</li>
</ol>
${faq}`
  },
  {
    slug: "privacy-before-sharing",
    title: "개인정보 공유 전 가릴 것들",
    description: "글이나 대화 내용을 공유하기 전 확인할 개인정보입니다.",
    category: "개인정보",
    path: "/guides/privacy-before-sharing",
    tool: "privacy-masker",
    body: `
<p>대화 내용이나 문서 일부를 공유할 때 이름보다 연락처, 이메일, 주소, 계좌번호가 더 쉽게 남습니다. 공유하기 전에 한 번 가리는 습관이 필요합니다.</p>
<h2>확인할 내용</h2>
<ul>
  <li>휴대폰 번호와 이메일</li>
  <li>주소, 동호수, 택배 송장번호</li>
  <li>계좌번호나 카드번호처럼 보이는 숫자</li>
  <li>링크 뒤에 붙은 긴 query 값</li>
</ul>
<h2>순서대로 하기</h2>
<p><a href="/tools/privacy-masker">개인정보 가리기</a>에 텍스트를 붙여넣고 결과를 확인하세요. 패턴 기준이므로 빠진 부분은 직접 지워야 합니다.</p>
${faq}`
  },
  {
    slug: "screenshot-before-upload",
    title: "스크린샷 공유 전 확인할 것들",
    description: "캡처 이미지에서 가릴 부분을 찾는 간단한 기준입니다.",
    category: "이미지",
    path: "/guides/screenshot-before-upload",
    tool: "screenshot-redactor",
    body: `
<p>스크린샷은 눈에 보이는 정보가 많습니다. 주문 내역, 채팅, 오류 화면을 공유할 때는 본문보다 화면 가장자리의 계정명이나 알림이 더 자주 남습니다.</p>
<h2>가릴 부분</h2>
<ul>
  <li>이름, 닉네임, 프로필 사진</li>
  <li>주소, 전화번호, 주문번호</li>
  <li>계정 이메일, 토큰, URL 뒤 긴 값</li>
  <li>지도나 배송 화면의 위치 정보</li>
</ul>
<h2>순서대로 하기</h2>
<p><a href="/tools/screenshot-redactor">스크린샷 가리기</a>에서 이미지를 선택하고, 블러보다 확실히 숨겨야 하는 부분은 박스로 가리세요.</p>
${faq}`
  },
  {
    slug: "used-market-required-text",
    title: "중고거래 글에 꼭 넣을 내용",
    description: "중고거래 판매글을 게시하기 전 적어야 할 기본 항목입니다.",
    category: "중고거래",
    path: "/guides/used-market-required-text",
    tool: "used-market-writer",
    body: `
<p>중고거래 글은 짧아도 핵심 정보가 있어야 문의가 줄어듭니다. 상품명, 상태, 구성품, 거래 장소, 환불 조건만 분명해도 거래가 훨씬 편합니다.</p>
<h2>넣을 내용</h2>
<ul>
  <li>상품명과 구매 시기</li>
  <li>사용 기간과 현재 상태</li>
  <li>구성품과 빠진 구성품</li>
  <li>하자 여부와 사진</li>
  <li>직거래 장소, 택배, 네고 가능 여부</li>
</ul>
<h2>순서대로 하기</h2>
<p><a href="/tools/used-market-writer">중고거래 글 만들기</a>에서 항목을 채운 뒤 짧은 글이나 자세한 글을 복사하세요. 하자가 있으면 설명을 꼭 남기세요.</p>
${faq}`
  },
  {
    slug: "screenshot-mosaic-blur-difference",
    title: "스크린샷 모자이크와 블러 차이",
    description: "이미지를 공유하기 전 모자이크, 블러, 박스 가리기를 고르는 기준입니다.",
    category: "이미지",
    path: "/guides/screenshot-mosaic-blur-difference",
    tool: "screenshot-redactor",
    body: `
<p>스크린샷을 올릴 때는 무엇을 가릴지에 따라 방식이 달라집니다. 블러는 화면 흐름을 남기면서 흐리게 보이게 하고, 모자이크는 픽셀 단위로 뭉개서 내용을 알아보기 어렵게 만듭니다. 박스 가리기는 가장 단순하지만 확실합니다.</p>
<h2>언제 무엇을 쓰나요?</h2>
<ul>
  <li>이름, 전화번호, 주소처럼 확실히 숨겨야 하는 정보는 박스로 덮습니다.</li>
  <li>대화 흐름은 남기고 일부만 흐리게 하고 싶으면 블러를 씁니다.</li>
  <li>화면 일부를 자연스럽게 가리고 싶으면 모자이크를 씁니다.</li>
  <li>작은 글씨나 숫자는 블러보다 박스가 안전합니다.</li>
</ul>
<h2>공유 전 확인</h2>
<p><a href="/tools/screenshot-redactor">스크린샷 가리기</a>에서 저장한 이미지를 다시 열어 보세요. 확대했을 때 숫자나 주소가 읽히면 다시 가리는 것이 좋습니다.</p>
${faq}`
  },
  {
    slug: "resident-number-front-mask",
    title: "주민번호 앞자리도 가려야 하는 이유",
    description: "생년월일처럼 보이는 6자리 숫자를 공유하기 전 확인할 점입니다.",
    category: "개인정보",
    path: "/guides/resident-number-front-mask",
    tool: "privacy-masker",
    body: `
<p>주민등록번호 전체가 아니어도 앞 6자리만으로 생년월일을 추정할 수 있습니다. 중고거래 인증 화면, 회사 문서 예시, 고객 상담 캡처를 공유할 때 앞자리만 남겨도 민감한 정보가 될 수 있습니다.</p>
<h2>확인할 숫자</h2>
<ul>
  <li>900101처럼 생년월일로 보이는 6자리 숫자</li>
  <li>900101-1처럼 뒤 첫 자리까지 보이는 번호</li>
  <li>신분증, 증명서, 신청서 캡처에 남은 번호</li>
  <li>파일명이나 메모에 들어간 생년월일</li>
</ul>
<h2>가리는 방법</h2>
<p><a href="/tools/privacy-masker">개인정보 가리기</a>에 텍스트를 붙여넣으면 주민번호처럼 보이는 패턴을 가립니다. 자동 감지는 보조용이므로 결과를 복사하기 전 원문과 비교하세요.</p>
${faq}`
  },
  {
    slug: "online-submit-privacy-checklist",
    title: "온라인 제출 전 개인정보 체크리스트",
    description: "파일이나 글을 제출하기 전 개인정보가 남았는지 확인하는 순서입니다.",
    category: "개인정보",
    path: "/guides/online-submit-privacy-checklist",
    tool: "privacy-masker",
    body: `
<p>온라인 제출은 한 번 올리면 취소하거나 수정하기 어려운 경우가 많습니다. 파일을 첨부하거나 글을 붙여넣기 전에 전화번호, 이메일, 주소, 계좌번호, 주민번호 일부가 남았는지 확인해야 합니다.</p>
<h2>제출 전 순서</h2>
<ol>
  <li>제출 화면에 붙여넣을 텍스트를 먼저 따로 확인합니다.</li>
  <li>전화번호, 이메일, 주소, 계좌번호를 찾습니다.</li>
  <li>스크린샷이나 PDF 안의 개인정보도 확인합니다.</li>
  <li>가린 결과를 저장하거나 복사한 뒤 다시 읽어 봅니다.</li>
</ol>
<h2>도구로 줄일 수 있는 실수</h2>
<p>텍스트는 <a href="/tools/privacy-masker">개인정보 가리기</a>, 이미지는 <a href="/tools/screenshot-redactor">스크린샷 가리기</a>를 함께 쓰면 빠뜨리는 항목을 줄일 수 있습니다.</p>
${faq}`
  },
  {
    slug: "qr-code-print-checklist",
    title: "QR 코드를 인쇄할 때 확인할 것",
    description: "QR을 종이에 붙이기 전 크기, URL, 저장 형식을 확인하는 방법입니다.",
    category: "QR",
    path: "/guides/qr-code-print-checklist",
    tool: "qr-studio",
    body: `
<p>QR 코드는 화면에서는 잘 보여도 인쇄하면 작거나 흐려져 인식이 안 될 수 있습니다. 안내문, 메뉴판, 행사 포스터에 넣기 전에는 URL과 이미지 크기를 같이 확인해야 합니다.</p>
<h2>인쇄 전 확인</h2>
<ul>
  <li>URL이 실제로 열리는지 먼저 확인합니다.</li>
  <li>종이에 넣을 때 너무 작게 줄이지 않습니다.</li>
  <li>배경과 QR 사이의 대비가 충분한지 봅니다.</li>
  <li>휴대폰 카메라로 멀리서 한 번, 가까이서 한 번 읽어봅니다.</li>
</ul>
<h2>파일 형식</h2>
<p><a href="/tools/qr-studio">QR 만들기</a>에서 PNG는 일반 문서나 이미지 편집에 쓰기 쉽고, SVG는 크기를 키워도 선명합니다. 인쇄물이 크다면 SVG 저장도 고려하세요.</p>
${faq}`
  },
  {
    slug: "wifi-qr-share-safely",
    title: "와이파이 QR 공유 전 확인할 것",
    description: "Wi-Fi QR에 어떤 정보가 들어가는지 확인하고 공유하는 기준입니다.",
    category: "QR",
    path: "/guides/wifi-qr-share-safely",
    tool: "qr-studio",
    body: `
<p>Wi-Fi QR은 네트워크 이름과 비밀번호를 QR 안에 담습니다. 가게, 사무실, 모임 공간에서 편리하지만, QR 이미지를 공개 게시하면 비밀번호도 함께 공유되는 점을 알아야 합니다.</p>
<h2>공유 전 확인</h2>
<ul>
  <li>공개해도 되는 방문자용 네트워크인지 확인합니다.</li>
  <li>개인 집이나 회사 내부망 비밀번호는 공개하지 않습니다.</li>
  <li>비밀번호를 바꿨다면 QR도 다시 만듭니다.</li>
  <li>보안 방식이 없는 네트워크라면 비밀번호를 넣지 않습니다.</li>
</ul>
<h2>만드는 방법</h2>
<p><a href="/tools/qr-studio">QR 만들기</a>에서 유형을 Wi-Fi로 바꾸고 네트워크 이름, 비밀번호, 보안 방식을 입력하세요. 저장 전 미리보기를 확인하면 됩니다.</p>
${faq}`
  },
  {
    slug: "used-market-photo-checklist",
    title: "중고거래 사진 올리기 전 체크리스트",
    description: "판매 사진에 주소, 얼굴, 송장번호가 남지 않게 확인하는 순서입니다.",
    category: "중고거래",
    path: "/guides/used-market-photo-checklist",
    tool: "screenshot-redactor",
    body: `
<p>중고거래 사진은 상품 상태를 보여주는 데 필요하지만, 주변 정보도 같이 찍히기 쉽습니다. 택배 박스, 영수증, 책상 위 서류, 창문 밖 위치 정보가 사진에 남을 수 있습니다.</p>
<h2>사진에서 확인할 것</h2>
<ul>
  <li>송장번호, 주소, 전화번호가 보이는지 확인합니다.</li>
  <li>얼굴, 차량번호, 회사 로고가 비치지 않았는지 봅니다.</li>
  <li>구매 영수증의 주문번호와 결제 정보를 가립니다.</li>
  <li>제품 시리얼 번호가 필요한 경우만 공개합니다.</li>
</ul>
<h2>가리는 방법</h2>
<p>사진 안의 민감한 부분은 <a href="/tools/screenshot-redactor">스크린샷 가리기</a>에서 박스나 모자이크로 덮은 뒤 저장하세요. 올리기 전 저장본을 다시 확인하는 것이 좋습니다.</p>
${faq}`
  },
  {
    slug: "used-market-title-examples",
    title: "중고거래 제목과 첫 문장 예시",
    description: "문의가 줄어드는 판매글 제목과 첫 문장을 쓰는 기준입니다.",
    category: "중고거래",
    path: "/guides/used-market-title-examples",
    tool: "used-market-writer",
    body: `
<p>중고거래 글은 제목과 첫 문장에서 구매자가 필요한 정보를 바로 봐야 합니다. 상품명만 적기보다 모델, 용량, 상태, 거래 지역을 같이 넣으면 불필요한 문의를 줄일 수 있습니다.</p>
<h2>제목 예시</h2>
<ul>
  <li>아이패드 9세대 64GB 판매합니다</li>
  <li>사무용 의자 사용감 있음, 직접 가져가실 분</li>
  <li>아기 장난감 세트, 구성품 사진 참고</li>
</ul>
<h2>첫 문장에 넣을 내용</h2>
<p>구매 시기, 사용 기간, 하자 여부, 구성품, 직거래 장소를 짧게 적으세요. <a href="/tools/used-market-writer">중고거래 글 작성</a>에서 상품 정보를 채우면 짧은 글과 자세한 글을 바로 만들 수 있습니다.</p>
${faq}`
  },
  {
    slug: "document-zip-submit-checklist",
    title: "서류 ZIP 제출 전 확인할 것",
    description: "여러 제출 파일을 ZIP으로 묶기 전 빠뜨리기 쉬운 항목입니다.",
    category: "PDF/서류",
    path: "/guides/document-zip-submit-checklist",
    tool: "document-packager",
    body: `
<p>여러 서류를 ZIP으로 제출할 때는 파일을 넣는 것보다 누락 확인이 더 중요합니다. 한 파일이 빠지거나 이름이 애매하면 제출처에서 다시 요청할 수 있습니다.</p>
<h2>확인 순서</h2>
<ol>
  <li>제출 안내문에 나온 필수 서류를 목록으로 만듭니다.</li>
  <li>각 항목에 실제 파일이 연결됐는지 확인합니다.</li>
  <li>파일명에 제출자 이름과 서류명을 넣습니다.</li>
  <li>ZIP을 만든 뒤 압축을 열어 파일 목록을 다시 봅니다.</li>
</ol>
<h2>도구로 정리하기</h2>
<p><a href="/tools/document-packager">서류 묶기</a>는 제출 상황별 체크리스트와 추천 파일명을 보여줍니다. ZIP 저장 전 누락 항목이 없는지 확인하세요.</p>
${faq}`
  },
  {
    slug: "travel-checklist-make",
    title: "여행 준비물 체크리스트 만드는 법",
    description: "여행 전에 준비물을 빠뜨리지 않도록 분류해서 확인하는 방법입니다.",
    category: "기타",
    path: "/guides/travel-checklist-make",
    tool: "document-packager",
    body: `
<p>여행 준비물은 생각나는 순서대로 적으면 빠지는 물건이 생깁니다. 신분증, 결제수단, 의류, 충전기, 상비약처럼 묶음으로 나누면 확인하기 쉽습니다.</p>
<h2>분류해서 적기</h2>
<ul>
  <li>필수: 신분증, 여권, 예약 내역, 결제수단</li>
  <li>전자기기: 휴대폰 충전기, 보조배터리, 이어폰</li>
  <li>생활용품: 세면도구, 렌즈, 상비약</li>
  <li>상황별: 우산, 수영복, 멀티어댑터</li>
</ul>
<h2>파일로 정리할 때</h2>
<p>예약 확인서나 보험 서류를 같이 제출하거나 보관해야 한다면 <a href="/tools/document-packager">서류 묶기</a>로 파일명을 맞춰 보관할 수 있습니다.</p>
${faq}`
  },
  {
    slug: "moving-before-checklist",
    title: "이사 전 빠뜨리기 쉬운 일",
    description: "이사 전에 주소, 공과금, 인터넷, 택배 정보를 정리하는 기준입니다.",
    category: "기타",
    path: "/guides/moving-before-checklist",
    tool: "privacy-masker",
    body: `
<p>이사는 짐보다 계정과 주소 변경에서 실수가 자주 납니다. 택배 주소, 인터넷 이전, 관리비, 공과금, 우편물 수령지를 미리 정리하면 이사 후 확인할 일이 줄어듭니다.</p>
<h2>확인할 일</h2>
<ul>
  <li>택배 앱과 쇼핑몰 기본 배송지 변경</li>
  <li>인터넷, 정수기, 가스, 전기 이전 신청</li>
  <li>관리비 정산과 자동이체 확인</li>
  <li>회사, 학교, 은행에 등록된 주소 확인</li>
</ul>
<h2>개인정보 공유 주의</h2>
<p>이사 견적이나 중고거래 글에 주소를 올릴 때는 상세 주소를 그대로 공개하지 마세요. 공유 전 텍스트는 <a href="/tools/privacy-masker">개인정보 가리기</a>로 한 번 확인하는 것이 좋습니다.</p>
${faq}`
  }
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
