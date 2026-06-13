export type MarketInput = {
  category: string;
  product: string;
  boughtAt: string;
  usedFor: string;
  originalPrice: string;
  price: string;
  included: string;
  condition: "거의 새것" | "사용감 있음" | "하자 있음";
  defect: string;
  place: string;
  delivery: boolean;
  negotiable: boolean;
  refund: string;
};

export function formatMarketPrice(value: string) {
  const price = value.trim();
  if (!price) return "";
  return /^\d[\d,]*$/.test(price) ? `${price}원` : price;
}

const cleanMarketText = (value: string, fallback: string) => value.trim() || fallback;

export function hasMarketRequiredInput(input: Pick<MarketInput, "product">) {
  return Boolean(input.product.trim());
}

export function makeMarketTitle(input: Pick<MarketInput, "product" | "price" | "category">) {
  const product = cleanMarketText(input.product, "상품");
  const price = formatMarketPrice(input.price);
  return `[${input.category}] ${product} 판매합니다${price ? ` (${price})` : ""}`;
}

export function makeDefectNotice(input: Pick<MarketInput, "condition" | "defect">) {
  if (input.condition === "하자 있음") {
    return `하자 고지: ${input.defect.trim() || "하자가 있습니다. 자세한 내용은 거래 전 확인해 주세요."}`;
  }
  if (input.condition === "사용감 있음") return "사용감은 조금 있지만 사용에는 문제 없습니다.";
  return "사용감이 적은 편입니다.";
}

export function makeTradeTerms(input: Pick<MarketInput, "place" | "delivery" | "negotiable" | "refund">) {
  return [
    `직거래: ${input.place.trim() || "협의"}`,
    `택배: ${input.delivery ? "가능" : "불가"}`,
    input.negotiable ? "가격 제안은 상황에 따라 가능합니다." : "가격 제안은 어렵습니다.",
    `교환/환불: ${input.refund.trim() || "중고거래 특성상 거래 후 교환/환불은 어렵습니다."}`
  ];
}

export function makeMarketShortBody(input: MarketInput) {
  return [
    makeMarketTitle(input),
    "",
    `${cleanMarketText(input.product, "상품")} 판매합니다.`,
    `상태: ${input.condition}`,
    makeDefectNotice(input),
    `구성품: ${input.included.trim() || "사진에 보이는 구성 기준"}`,
    ...makeTradeTerms(input)
  ].join("\n");
}

export function makeMarketLongBody(input: MarketInput) {
  const originalPrice = formatMarketPrice(input.originalPrice);
  const price = formatMarketPrice(input.price);
  return [
    makeMarketTitle(input),
    "",
    `상품명: ${cleanMarketText(input.product, "미입력")}`,
    `카테고리: ${input.category}`,
    `구매 시기: ${cleanMarketText(input.boughtAt, "미기재")}`,
    `사용 기간: ${cleanMarketText(input.usedFor, "미기재")}`,
    originalPrice ? `구매가: ${originalPrice}` : "",
    price ? `희망 판매가: ${price}` : "",
    `구성품: ${input.included.trim() || "사진에 보이는 구성 기준"}`,
    `상태: ${input.condition}`,
    makeDefectNotice(input),
    "",
    ...makeTradeTerms(input),
    "",
    "사진 기준으로 상태 확인 부탁드립니다. 궁금한 부분은 거래 전에 문의해 주세요."
  ].filter(Boolean).join("\n");
}

export function makeMarketBody(input: MarketInput & { detail?: "short" | "long" }) {
  return input.detail === "short" ? makeMarketShortBody(input) : makeMarketLongBody(input);
}

export function defectChecklist(input: Pick<MarketInput, "condition" | "defect">) {
  const common = ["외관 흠집 확인", "작동 여부 확인", "구성품 누락 확인"];
  if (input.condition === "하자 있음") return [...common, input.defect.trim() || "하자 설명을 본문에 추가"];
  return [...common, "사진에 사용감이 보이게 촬영"];
}

export function checklistForCategory(category: string) {
  const common = ["제품 전체 사진", "하자 부분 근접 사진", "구성품 사진", "거래 조건 캡처"];
  const extra: Record<string, string[]> = {
    "전자기기": ["전원 켜진 사진", "배터리 상태"],
    "가전": ["작동 중인 사진", "모델명 라벨"],
    "의류": ["사이즈 택", "오염/보풀 확인"],
    "가구": ["실측 사이즈", "모서리 흠집"],
    "도서": ["표지와 책등", "필기나 찢김 확인"]
  };
  return [...common, ...(extra[category] ?? ["실사용 사진"])];
}
