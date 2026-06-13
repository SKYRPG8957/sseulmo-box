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
  }
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
