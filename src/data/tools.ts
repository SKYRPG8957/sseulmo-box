export const categories = [
  "PDF/서류",
  "개인정보",
  "이미지",
  "문서",
  "중고거래",
  "QR",
  "기타"
] as const;

export type ToolStatus = "ready" | "beta" | "planned";

type ToolBase = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: (typeof categories)[number];
  priority: number;
  description: string;
  cardDescription: string;
  useCase: string;
  badges: string[];
  cta: string;
  tags: string[];
  features: string[];
  privacyNote: string;
  relatedTools: string[];
  relatedGuides: string[];
  featured: boolean;
  related: string[];
  faqs: string[];
  sections: string[];
};

export type AvailableToolMeta = ToolBase & {
  status: "ready" | "beta";
  route: string;
  path: string;
};

export type PlannedToolMeta = ToolBase & {
  status: "planned";
};

export type ToolMeta = AvailableToolMeta | PlannedToolMeta;

export type AvailableToolSummary = Pick<AvailableToolMeta, "id" | "name" | "shortName" | "route" | "category" | "status" | "description" | "cardDescription" | "useCase" | "badges" | "cta" | "tags" | "features" | "privacyNote">;

export type HomeToolSummary = Pick<AvailableToolMeta, "id" | "name" | "shortName" | "route" | "category" | "status" | "cardDescription" | "useCase" | "badges" | "cta" | "tags" | "privacyNote">;

export type PlannedToolSummary = Pick<PlannedToolMeta, "id" | "name" | "shortName" | "category" | "status" | "cardDescription" | "tags">;

const baseFaqs = [
  "파일이나 텍스트가 서버로 전송되나요?",
  "로그인 없이 사용할 수 있나요?",
  "모바일에서도 사용할 수 있나요?",
  "결과를 다시 확인해야 하나요?",
  "광고가 표시될 수 있나요?"
];

export const tools: ToolMeta[] = [
  {
    id: "pdf-kit",
    slug: "pdf-kit",
    name: "PDF 정리",
    shortName: "PDF",
    route: "/tools/pdf-kit",
    path: "/tools/pdf-kit",
    category: "PDF/서류",
    status: "ready",
    priority: 1,
    description: "PDF 여러 개를 원하는 순서대로 합쳐 새 파일로 저장합니다.",
    cardDescription: "PDF를 원하는 순서대로 합쳐 새 파일로 저장합니다.",
    useCase: "입사지원, 지원사업, 스캔 서류 제출 전에 PDF 순서를 맞추고 한 파일로 정리할 때 씁니다.",
    badges: ["브라우저 처리", "다운로드 가능"],
    cta: "PDF 정리하기",
    tags: ["PDF", "합치기", "순서", "다운로드", "제출"],
    features: ["PDF", "합치기", "다운로드"],
    privacyNote: "선택한 PDF는 서버로 업로드하지 않고 브라우저에서 처리합니다.",
    relatedTools: ["document-packager", "privacy-masker"],
    relatedGuides: ["merge-pdf-files", "pdf-submit-order"],
    featured: true,
    related: ["document-packager", "privacy-masker"],
    faqs: [...baseFaqs, "암호가 있는 PDF도 되나요?"],
    sections: ["사용 예시", "알아둘 점"]
  },
  {
    id: "privacy-masker",
    slug: "privacy-masker",
    name: "개인정보 가리기",
    shortName: "개인정보",
    route: "/tools/privacy-masker",
    path: "/tools/privacy-masker",
    category: "개인정보",
    status: "ready",
    priority: 2,
    description: "텍스트에서 전화번호, 이메일, 계좌번호처럼 보이는 내용을 가려서 복사할 수 있습니다.",
    cardDescription: "전화번호, 이메일, 계좌번호처럼 보이는 내용을 가립니다.",
    useCase: "커뮤니티 글, 회사 문서, 중고거래 대화 내용을 공유하기 전에 민감한 텍스트를 빠르게 가립니다.",
    badges: ["서버 전송 없음", "결과 복사"],
    cta: "개인정보 가리기",
    tags: ["텍스트", "개인정보", "복사", "마스킹"],
    features: ["텍스트", "복사", "브라우저 처리"],
    privacyNote: "입력한 텍스트는 마스킹 결과를 만들기 위해 서버로 보내지 않습니다.",
    relatedTools: ["screenshot-redactor", "pdf-kit"],
    relatedGuides: ["privacy-before-sharing", "screenshot-before-upload"],
    featured: true,
    related: ["screenshot-redactor", "pdf-kit"],
    faqs: [
      "주민등록번호를 정확히 판별하나요?",
      "결과가 서버로 전송되나요?",
      "카드번호 검증 기능인가요?",
      "URL 쿼리도 가릴 수 있나요?",
      "마스킹 강도는 무엇이 다른가요?"
    ],
    sections: ["사용 예시", "알아둘 점"]
  },
  {
    id: "screenshot-redactor",
    slug: "screenshot-redactor",
    name: "스크린샷 가리기",
    shortName: "스크린샷",
    route: "/tools/screenshot-redactor",
    path: "/tools/screenshot-redactor",
    category: "이미지",
    status: "ready",
    priority: 3,
    description: "이미지 위를 블러, 모자이크, 박스로 덮어 저장합니다.",
    cardDescription: "이미지 위를 블러, 모자이크, 박스로 덮어 저장합니다.",
    useCase: "주문 내역, 채팅 캡처, 오류 화면을 공유하기 전에 이름, 주소, 계정 정보를 가립니다.",
    badges: ["이미지 저장", "PNG 저장"],
    cta: "스크린샷 가리기",
    tags: ["이미지", "블러", "모자이크", "다운로드"],
    features: ["이미지", "블러", "다운로드"],
    privacyNote: "선택한 이미지는 브라우저 안에서 편집합니다.",
    relatedTools: ["privacy-masker", "pdf-kit"],
    relatedGuides: ["screenshot-before-upload", "privacy-before-sharing"],
    featured: true,
    related: ["privacy-masker", "pdf-kit"],
    faqs: [...baseFaqs, "EXIF 정보는 어떻게 되나요?"],
    sections: ["사용 예시", "알아둘 점"]
  },
  {
    id: "document-packager",
    slug: "document-packager",
    name: "서류 묶기",
    shortName: "서류",
    route: "/tools/document-packager",
    path: "/tools/document-packager",
    category: "PDF/서류",
    status: "beta",
    priority: 4,
    description: "제출할 파일명을 정리하고 ZIP으로 묶습니다.",
    cardDescription: "제출할 파일명을 정리하고 ZIP으로 묶습니다.",
    useCase: "이력서, 포트폴리오, 증빙서류처럼 여러 제출 파일을 이름 기준으로 정리할 때 씁니다.",
    badges: ["ZIP 다운로드", "파일명 정리"],
    cta: "서류 묶기",
    tags: ["서류", "파일명", "ZIP", "체크리스트"],
    features: ["파일명", "ZIP", "체크리스트"],
    privacyNote: "ZIP 파일은 사용자의 브라우저에서 만들어 저장합니다.",
    relatedTools: ["pdf-kit", "privacy-masker"],
    relatedGuides: ["document-file-name-rules", "pdf-submit-order"],
    featured: true,
    related: ["pdf-kit", "privacy-masker"],
    faqs: [...baseFaqs, "누락 항목은 어떻게 표시되나요?"],
    sections: ["사용 예시", "알아둘 점"]
  },
  {
    id: "qr-studio",
    slug: "qr-studio",
    name: "QR 만들기",
    shortName: "QR",
    route: "/tools/qr-studio",
    path: "/tools/qr-studio",
    category: "QR",
    status: "beta",
    priority: 5,
    description: "URL, 와이파이 정보, 안내 문구를 QR 코드로 만들 수 있습니다.",
    cardDescription: "URL, 와이파이, 안내 문구를 QR 코드로 만듭니다.",
    useCase: "가게 Wi-Fi, 행사 안내, 설문 링크, 메뉴판 주소를 종이나 화면에 붙일 QR로 만들 때 씁니다.",
    badges: ["PNG/SVG 저장", "QR 저장"],
    cta: "QR 만들기",
    tags: ["QR", "URL", "Wi-Fi", "PNG", "SVG"],
    features: ["QR", "PNG", "SVG"],
    privacyNote: "입력한 QR 내용은 브라우저에서 코드 이미지로 만듭니다.",
    relatedTools: ["document-packager", "used-market-writer"],
    relatedGuides: ["privacy-before-sharing", "screenshot-before-upload"],
    featured: true,
    related: ["document-packager", "used-market-writer"],
    faqs: [...baseFaqs, "Wi-Fi QR은 어떤 정보가 들어가나요?"],
    sections: ["사용 예시", "알아둘 점"]
  },
  {
    id: "used-market-writer",
    slug: "used-market-writer",
    name: "중고거래 글 작성",
    shortName: "판매글",
    route: "/tools/used-market-writer",
    path: "/tools/used-market-writer",
    category: "중고거래",
    status: "beta",
    priority: 6,
    description: "상품 상태와 거래 조건을 정리해서 판매글로 만듭니다.",
    cardDescription: "상품 상태와 거래 조건을 정리해 판매글을 만듭니다.",
    useCase: "상품명, 상태, 구성품, 하자, 거래 장소를 빠뜨리지 않고 판매글로 정리할 때 씁니다.",
    badges: ["결과 복사", "체크리스트"],
    cta: "중고거래 글 작성",
    tags: ["판매글", "중고거래", "복사", "체크리스트"],
    features: ["판매글", "복사", "체크리스트"],
    privacyNote: "작성한 판매글은 복사 전 브라우저 화면에서 확인합니다.",
    relatedTools: ["privacy-masker", "screenshot-redactor"],
    relatedGuides: ["used-market-required-text", "privacy-before-sharing"],
    featured: true,
    related: ["privacy-masker", "screenshot-redactor"],
    faqs: [...baseFaqs, "하자 설명은 어디에 들어가나요?"],
    sections: ["사용 예시", "알아둘 점"]
  },
  {
    id: "used-market-photo",
    slug: "used-market-photo",
    name: "중고거래 사진 가리기",
    shortName: "사진 가리기",
    category: "중고거래",
    status: "planned",
    priority: 20,
    description: "중고거래 사진에서 주소, 얼굴, 송장번호 같은 부분을 가립니다.",
    cardDescription: "중고거래 사진에서 보여주기 싫은 부분을 가립니다.",
    useCase: "판매 사진을 공유하기 전에 주소, 얼굴, 송장번호 같은 부분을 가릴 때 씁니다.",
    badges: ["이미지", "가리기"],
    cta: "준비 중",
    tags: ["사진", "중고거래", "가리기"],
    features: ["사진", "가리기"],
    privacyNote: "출시 후 브라우저에서 처리하는 방식으로 제공합니다.",
    relatedTools: ["used-market-writer", "screenshot-redactor"],
    relatedGuides: ["used-market-required-text", "screenshot-before-upload"],
    featured: false,
    related: ["used-market-writer", "screenshot-redactor"],
    faqs: baseFaqs,
    sections: ["사용 예시", "알아둘 점"]
  },
  {
    id: "fair-random",
    slug: "fair-random",
    name: "공정 추첨",
    shortName: "추첨",
    category: "기타",
    status: "planned",
    priority: 21,
    description: "참가자를 입력해 추첨, 팀 나누기, 발표 순서를 만듭니다.",
    cardDescription: "참가자 목록으로 추첨과 팀 나누기를 합니다.",
    useCase: "모임이나 수업에서 순서, 팀, 당첨자를 정할 때 씁니다.",
    badges: ["추첨", "팀"],
    cta: "준비 중",
    tags: ["추첨", "팀", "자리"],
    features: ["추첨", "팀"],
    privacyNote: "출시 후 브라우저에서 처리하는 방식으로 제공합니다.",
    relatedTools: ["meeting-notice"],
    relatedGuides: [],
    featured: false,
    related: ["meeting-notice"],
    faqs: baseFaqs,
    sections: ["사용 예시", "알아둘 점"]
  },
  {
    id: "meeting-notice",
    slug: "meeting-notice",
    name: "모임 공지",
    shortName: "공지",
    category: "문서",
    status: "planned",
    priority: 22,
    description: "모임 일정, 장소, 회비 안내문을 만듭니다.",
    cardDescription: "단톡방에 공유할 모임 공지문을 만듭니다.",
    useCase: "모임 시간, 장소, 회비, 준비물을 짧은 공지문으로 정리할 때 씁니다.",
    badges: ["공지", "복사"],
    cta: "준비 중",
    tags: ["공지", "모임", "회비"],
    features: ["공지", "복사"],
    privacyNote: "출시 후 브라우저에서 처리하는 방식으로 제공합니다.",
    relatedTools: ["fair-random"],
    relatedGuides: [],
    featured: false,
    related: ["fair-random"],
    faqs: baseFaqs,
    sections: ["사용 예시", "알아둘 점"]
  },
  {
    id: "travel-packing",
    slug: "travel-packing",
    name: "여행 준비물",
    shortName: "여행",
    category: "기타",
    status: "planned",
    priority: 23,
    description: "여행 조건에 맞춰 준비물 목록을 만듭니다.",
    cardDescription: "여행 전 챙길 물건을 목록으로 정리합니다.",
    useCase: "여행 기간, 계절, 이동 방식에 맞춰 준비물을 빠뜨리지 않게 정리할 때 씁니다.",
    badges: ["목록", "체크"],
    cta: "준비 중",
    tags: ["여행", "체크리스트"],
    features: ["목록", "체크"],
    privacyNote: "출시 후 브라우저에서 처리하는 방식으로 제공합니다.",
    relatedTools: ["moving-checklist"],
    relatedGuides: [],
    featured: false,
    related: ["moving-checklist"],
    faqs: baseFaqs,
    sections: ["사용 예시", "알아둘 점"]
  },
  {
    id: "moving-checklist",
    slug: "moving-checklist",
    name: "이사 체크리스트",
    shortName: "이사",
    category: "기타",
    status: "planned",
    priority: 24,
    description: "이사 날짜에 맞춰 해야 할 일을 정리합니다.",
    cardDescription: "이사 전후에 할 일을 날짜별로 정리합니다.",
    useCase: "이사 전 계약, 주소 변경, 공과금, 청소, 입주 확인 일정을 정리할 때 씁니다.",
    badges: ["일정", "체크"],
    cta: "준비 중",
    tags: ["이사", "체크리스트", "일정"],
    features: ["목록", "일정"],
    privacyNote: "출시 후 브라우저에서 처리하는 방식으로 제공합니다.",
    relatedTools: ["travel-packing"],
    relatedGuides: [],
    featured: false,
    related: ["travel-packing"],
    faqs: baseFaqs,
    sections: ["사용 예시", "알아둘 점"]
  },
  {
    id: "message-template",
    slug: "message-template",
    name: "이메일·카톡 문구",
    shortName: "문구",
    category: "문서",
    status: "planned",
    priority: 25,
    description: "상황과 상대에 맞는 이메일이나 카톡 문구를 만듭니다.",
    cardDescription: "상황에 맞는 짧은 문구를 만듭니다.",
    useCase: "문의, 거절, 일정 변경, 감사 인사처럼 자주 쓰는 문구를 빠르게 정리할 때 씁니다.",
    badges: ["문구", "복사"],
    cta: "준비 중",
    tags: ["이메일", "카톡", "문구"],
    features: ["문구", "복사"],
    privacyNote: "출시 후 브라우저에서 처리하는 방식으로 제공합니다.",
    relatedTools: ["meeting-notice"],
    relatedGuides: ["used-market-required-text", "privacy-before-sharing"],
    featured: false,
    related: ["meeting-notice"],
    faqs: baseFaqs,
    sections: ["사용 예시", "알아둘 점"]
  }
];

const statusRank: Record<ToolStatus, number> = { ready: 0, beta: 1, planned: 2 };

export const sortedTools = [...tools].sort((a, b) => {
  const statusDiff = statusRank[a.status] - statusRank[b.status];
  return statusDiff || a.priority - b.priority;
});

export const availableTools = sortedTools.filter((tool): tool is AvailableToolMeta => tool.status === "ready" || tool.status === "beta");
export const plannedTools = sortedTools.filter((tool): tool is PlannedToolMeta => tool.status === "planned");
export const directoryToolSummaries: AvailableToolSummary[] = availableTools.map(({ id, name, shortName, route, category, status, description, cardDescription, useCase, badges, cta, tags, features, privacyNote }) => ({
  id,
  name,
  shortName,
  route,
  category,
  status,
  description,
  cardDescription,
  useCase,
  badges,
  cta,
  tags,
  features,
  privacyNote
}));
export const homeToolSummaries: HomeToolSummary[] = availableTools.map(({ id, name, shortName, route, category, status, cardDescription, useCase, badges, cta, tags, privacyNote }) => ({
  id,
  name,
  shortName,
  route,
  category,
  status,
  cardDescription,
  useCase,
  badges,
  cta,
  tags,
  privacyNote
}));
export const plannedToolSummaries: PlannedToolSummary[] = plannedTools.map(({ id, name, shortName, category, status, cardDescription, tags }) => ({
  id,
  name,
  shortName,
  category,
  status,
  cardDescription,
  tags
}));

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getAvailableTool(slug: string) {
  return availableTools.find((tool) => tool.slug === slug);
}
