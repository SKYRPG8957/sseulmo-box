import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { plannedTools } from "../data/tools";

const sourceRoots = ["src/components", "src/data", "src/lib", "src/pages"];
const forbiddenPatterns = [
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\bsendBeacon\s*\(/,
  /\bFormData\s*\(/,
  /method=["']post["']/i,
  /\baction=/
];
const forbiddenMarketingCopy = [
  "혁신",
  "강력",
  "올인원",
  "최고",
  "생산성을 극대화",
  "모든 것을 한 번에",
  "완벽하게",
  "안전하게 보호",
  "신박",
  "압도",
  "무료 시작하기",
  "도구 열기"
];

async function collectSourceFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(path);
    if (/\.(astro|tsx?|jsx?)$/.test(entry.name)) return [path];
    return [];
  }));
  return nested.flat();
}

describe("source policy", () => {
  it("does not include browser code paths that send files or text to a server", async () => {
    const files = (await Promise.all(sourceRoots.map(collectSourceFiles))).flat();

    for (const file of files) {
      const source = await readFile(file, "utf8");
      for (const pattern of forbiddenPatterns) {
        expect(pattern.test(source), `${file} should not match ${pattern}`).toBe(false);
      }
    }
  });

  it("keeps public copy away from oversized marketing phrases", async () => {
    const files = (await Promise.all(sourceRoots.map(collectSourceFiles))).flat();

    for (const file of files) {
      const source = await readFile(file, "utf8");
      for (const phrase of forbiddenMarketingCopy) {
        expect(source.includes(phrase), `${file} should not include "${phrase}"`).toBe(false);
      }
    }
  });

  it("keeps repeated file action buttons identifiable to assistive technology", async () => {
    const pdfSource = await readFile("src/components/tools/PdfKit.tsx", "utf8");
    const documentSource = await readFile("src/components/tools/DocumentPackager.tsx", "utf8");

    expect(pdfSource).toContain("aria-label={`${file.name} 위로 이동`}");
    expect(pdfSource).toContain("aria-label={`${file.name} 아래로 이동`}");
    expect(pdfSource).toContain("aria-label={`${file.name} 삭제`}");
    expect(documentSource).toContain("aria-label={`${item} 연결 여부`}");
    expect(documentSource).toContain("aria-label={`${item} 항목 삭제`}");
  });

  it("keeps ad placeholders plain and scripts gated by environment", async () => {
    const slotSource = await readFile("src/components/AdSlot.astro", "utf8");
    const headSource = await readFile("src/components/AdSenseHead.astro", "utf8");
    const adsTxtSource = await readFile("src/pages/ads.txt.ts", "utf8");
    const checklist = await readFile("docs/adsense-checklist.md", "utf8");

    expect(slotSource).toContain("광고가 들어갈 자리입니다.");
    expect(slotSource).not.toContain("placeholder 영역입니다");
    expect(slotSource).not.toContain("심사 전 placeholder");
    expect(slotSource).toContain("normalizeAdSenseClient");
    expect(slotSource).toContain("normalizeAdSenseSlot");
    expect(slotSource).toContain("client && slot");
    expect(slotSource).toContain("data-ad-slot={slot}");
    expect(slotSource).not.toContain('data-ad-slot="0000000000"');
    expect(headSource).toContain("normalizeAdSenseClient");
    expect(headSource).toContain("{client ?");
    expect(headSource).toContain(": null}");
    expect(adsTxtSource).toContain("PUBLIC_ADSENSE_CLIENT");
    expect(adsTxtSource).toContain("makeAdsTxt");
    expect(adsTxtSource).not.toContain("pub-0000000000000000");
    expect(checklist).toContain("PUBLIC_ADSENSE_CLIENT");
    expect(checklist).toContain("PUBLIC_ADSENSE_SLOT");
    expect(checklist).toContain("PUBLIC_CONTACT_EMAIL");
    expect(checklist).toContain("PUBLIC_SITE_URL");
    expect(checklist).toContain("파일 선택 영역");
    expect(checklist).not.toContain("파일 업로드 영역");
  });

  it("does not expose a fake contact email on the contact page", async () => {
    const contactSource = await readFile("src/pages/contact.astro", "utf8");

    expect(contactSource).toContain("PUBLIC_CONTACT_EMAIL");
    expect(contactSource).toContain("normalizeContactEmail");
    expect(contactSource).toContain("makeContactMailto");
    expect(contactSource).not.toContain("hello@example.com");
    expect(contactSource).not.toContain("mailto:hello@example.com");
  });

  it("keeps the 404 page quiet and tool-focused", async () => {
    const source = await readFile("src/pages/404.astro", "utf8");

    expect(source).not.toContain("font-black");
    expect(source).not.toContain("py-16");
    expect(source).toContain("도구 목록 보기");
    expect(source).toContain("availableTools");
  });

  it("announces search result counts and selected filters", async () => {
    const homeSource = await readFile("src/components/HomeToolSearch.tsx", "utf8");
    const directorySource = await readFile("src/components/ToolDirectory.tsx", "utf8");
    const homePageSource = await readFile("src/pages/index.astro", "utf8");

    expect(homeSource).toContain("const hasQuery = Boolean(query.trim())");
    expect(homeSource).toContain('role="status"');
    expect(homeSource).toContain('aria-live="polite"');
    expect(homeSource).toContain("검색 결과 ${filtered.length}개");
    expect(homeSource).toContain("자주 쓰는 도구 바로가기");
    expect(homeSource).toContain("{hasQuery && (");
    expect(homeSource).toContain("PDF 합치기, 전화번호 가리기, QR 만들기처럼 검색해보세요");
    expect(homeSource).not.toContain("시험 중");
    expect(homeSource).toContain("const shortcutIds");
    expect(homeSource).toContain("shortcuts.map");
    expect(homeSource).toContain('className="btn-secondary gap-2 no-underline"');
    expect(homePageSource).toContain("가입 없이 바로 쓰는 무료 생활 도구");
    expect(homePageSource).toContain("로그인 없음");
    expect(homePageSource).toContain("서버 업로드 없음");
    expect(directorySource).toContain("aria-pressed={item === category}");
    expect(directorySource).toContain('role="status"');
    expect(directorySource).toContain('aria-live="polite"');
    expect(directorySource).toContain("검색 결과 {resultCount}개");
    expect(directorySource).toContain("const resultCount = filteredAvailable.length");
    expect(directorySource).not.toContain("const resultCount = filteredAvailable.length + filteredPlanned.length");
    expect(directorySource).not.toContain("사용 가능한 도구 ${availableTools.length}개");
    expect(directorySource).not.toContain("open={hasQuery}");
    expect(directorySource).not.toContain("시험 중");
  });

  it("does not prefill the QR tool with an example URL", async () => {
    const source = await readFile("src/components/tools/QrStudio.tsx", "utf8");

    expect(source).toContain('const [url, setUrl] = useState("")');
    expect(source).toContain('const [text, setText] = useState("")');
    expect(source).not.toContain('useState("https://example.com")');
    expect(source).not.toContain('placeholder="https://example.com"');
  });

  it("does not expose example.com as a public site fallback", async () => {
    const astroConfig = await readFile("astro.config.mjs", "utf8");
    const seoSource = await readFile("src/components/SEO.astro", "utf8");
    const sitemapSource = await readFile("src/pages/sitemap.xml.ts", "utf8");
    const robotsSource = await readFile("src/pages/robots.txt.ts", "utf8");
    const privacyToolSource = await readFile("src/components/tools/PrivacyMasker.tsx", "utf8");

    expect(astroConfig).toContain("normalizeSiteUrl");
    expect(astroConfig).toContain("site: normalizeSiteUrl(process.env.PUBLIC_SITE_URL)");
    expect(astroConfig).not.toContain("https://example.com");
    expect(seoSource).toContain("PUBLIC_SITE_URL");
    expect(seoSource).toContain("normalizeSiteUrl");
    expect(seoSource).not.toContain("https://example.com");
    expect(sitemapSource).toContain("normalizeSiteUrl");
    expect(sitemapSource).not.toContain("https://example.com");
    expect(robotsSource).toContain("normalizeSiteUrl");
    expect(robotsSource).not.toContain("https://example.com");
    expect(privacyToolSource).toContain("sample.invalid");
    expect(privacyToolSource).not.toContain("example.com");
  });

  it("keeps repeated guide links large enough to tap", async () => {
    const guideCardSource = await readFile("src/components/GuideCard.astro", "utf8");
    const homeSource = await readFile("src/pages/index.astro", "utf8");

    expect(guideCardSource).toContain('class="btn-secondary mt-4 no-underline"');
    expect(guideCardSource).not.toContain("inline-flex text-sm font-semibold");
    expect(homeSource).toContain('class="btn-secondary hidden shrink-0 no-underline md:inline-flex"');
    expect(homeSource).toContain('class="btn-secondary shrink-0 no-underline">전체 보기</a>');
  });

  it("shows home trust badges and a stronger landing structure", async () => {
    const homeSource = await readFile("src/pages/index.astro", "utf8");

    expect(homeSource).toContain("hero-surface text-white");
    expect(homeSource).toContain("로그인 없음");
    expect(homeSource).toContain("서버 업로드 없음");
    expect(homeSource).toContain("브라우저 처리");
    expect(homeSource).toContain("무료 사용");
    expect(homeSource).toContain("복사·다운로드 가능");
    expect(homeSource).toContain("siteDescription");
    expect(homeSource).toContain("localStorage");
  });

  it("keeps shared notices and menus visually quiet", async () => {
    const layoutSource = await readFile("src/components/Layout.astro", "utf8");
    const noticeSource = await readFile("src/components/PrivacyNotice.astro", "utf8");
    const headerSource = await readFile("src/components/Header.astro", "utf8");

    expect(layoutSource).toContain('href="#main-content"');
    expect(layoutSource).toContain('id="main-content"');
    expect(layoutSource).toContain("본문으로 이동");
    expect(noticeSource).toContain('class="rounded-lg border border-border bg-white p-4 text-sm leading-7 text-secondary"');
    expect(noticeSource).not.toContain("border-teal-200");
    expect(noticeSource).not.toContain("bg-brand-soft");
    expect(headerSource).not.toContain("shadow-sm");
  });

  it("does not keep implementation files for planned tools", async () => {
    const files = (await Promise.all(sourceRoots.map(collectSourceFiles)))
      .flat()
      .map((file) => file.replaceAll("\\", "/"));
    const plannedImplementationFiles = [
      "src/components/tools/FairRandom.tsx",
      "src/components/tools/MeetingNotice.tsx",
      "src/components/tools/MessageTemplate.tsx",
      "src/components/tools/MovingChecklist.tsx",
      "src/components/tools/TravelPacking.tsx",
      "src/components/tools/UsedMarketPhotoEditor.tsx",
      "src/lib/checklists/movingChecklist.ts",
      "src/lib/checklists/travelPacking.ts",
      "src/lib/messages/meetingNotice.ts",
      "src/lib/messages/messageTemplate.ts",
      "src/lib/random/fairRandom.ts"
    ];

    expect(plannedImplementationFiles.length).toBeGreaterThan(plannedTools.length);
    for (const file of plannedImplementationFiles) {
      expect(files).not.toContain(file);
    }
  });

  it("uses file selection wording for browser-side image tools", async () => {
    const screenshotSource = await readFile("src/components/tools/ScreenshotRedactor.tsx", "utf8");
    const pdfSource = await readFile("src/components/tools/PdfKit.tsx", "utf8");

    expect(screenshotSource).toContain("이미지 선택");
    expect(screenshotSource).toContain("이미지를 선택한 뒤");
    expect(screenshotSource).toContain("fileInputRef.current.value = \"\"");
    expect(screenshotSource).not.toContain("이미지 올리기");
    expect(screenshotSource).not.toContain("이미지를 먼저 올려");
    expect(pdfSource).toContain("PDF를 끌어다 놓거나 선택하세요");
    expect(pdfSource).toContain("onDragOver");
    expect(pdfSource).toContain("onDrop");
    expect(pdfSource).toContain("아직 선택한 PDF가 없습니다.");
    expect(pdfSource).toContain("fileInputRef.current.value = \"\"");
    expect(pdfSource).not.toContain("PDF 파일을 올리세요");
    expect(pdfSource).not.toContain("PDF 파일만 올릴 수 있습니다.");
  });

  it("keeps ready and beta tool action buttons specific", async () => {
    const privacySource = await readFile("src/components/tools/PrivacyMasker.tsx", "utf8");
    const qrSource = await readFile("src/components/tools/QrStudio.tsx", "utf8");
    const screenshotSource = await readFile("src/components/tools/ScreenshotRedactor.tsx", "utf8");
    const marketSource = await readFile("src/components/tools/UsedMarketWriter.tsx", "utf8");
    const documentSource = await readFile("src/components/tools/DocumentPackager.tsx", "utf8");

    expect(privacySource).toContain("가린 텍스트 복사");
    expect(privacySource).toContain("가린 텍스트 TXT 저장");
    expect(qrSource).toContain("QR PNG 저장");
    expect(qrSource).toContain("QR SVG 저장");
    expect(screenshotSource).toContain("가린 이미지 PNG 저장");
    expect(screenshotSource).toContain("가린 이미지를 ${fileTypeLabels[type]}로 저장했습니다.");
    expect(screenshotSource).toContain('"image/jpeg": "JPG"');
    expect(screenshotSource).toContain('"image/webp": "WebP"');
    expect(screenshotSource).toContain("가림 초기화");
    expect(marketSource).toContain("판매글 복사");
    expect(documentSource).toContain("서류 ZIP 만들기");
  });

  it("marks result tabs and copy status in the used market writer", async () => {
    const marketSource = await readFile("src/components/tools/UsedMarketWriter.tsx", "utf8");

    expect(marketSource).toContain('role="tablist"');
    expect(marketSource).toContain('role="tab"');
    expect(marketSource).toContain("aria-selected={tab === item.id}");
    expect(marketSource).toContain('aria-controls="used-market-result-panel"');
    expect(marketSource).toContain('role="tabpanel"');
    expect(marketSource).toContain('role="status"');
    expect(marketSource).toContain('aria-live="polite"');
    expect(marketSource).toContain("hasMarketRequiredInput");
    expect(marketSource).toContain("const canCopy = hasMarketRequiredInput(input)");
    expect(marketSource).toContain("상품명을 입력하면 복사할 수 있습니다.");
    expect(marketSource).toContain("disabled={!canCopy}");
    expect(marketSource).toContain("판매글을 복사했습니다.");
  });

  it("handles clipboard copy failures in ready and beta copy tools", async () => {
    const privacySource = await readFile("src/components/tools/PrivacyMasker.tsx", "utf8");
    const marketSource = await readFile("src/components/tools/UsedMarketWriter.tsx", "utf8");

    for (const source of [privacySource, marketSource]) {
      expect(source).toContain("try {");
      expect(source).toContain("} catch {");
      expect(source).toContain("복사하지 못했습니다. 직접 선택해 복사해 주세요.");
      expect(source).toContain('includes("못했습니다")');
      expect(source).toContain("text-danger");
    }
    expect(privacySource).toContain("const statusMessage = copied ? \"가린 텍스트를 복사했습니다.\" : status");
    expect(privacySource).toContain('!statusMessage ? "sr-only"');
    expect(marketSource).toContain('const [copyStatus, setCopyStatus] = useState("")');
    expect(marketSource).toContain('!copyStatus ? "sr-only"');
    expect(marketSource).toContain('setCopyStatus("판매글을 복사했습니다.")');
    expect(marketSource).toContain("setCopied(false);");
  });

  it("handles privacy TXT saves as recoverable browser actions", async () => {
    const privacySource = await readFile("src/components/tools/PrivacyMasker.tsx", "utf8");

    expect(privacySource).toContain("const handleDownload = ()");
    expect(privacySource).toContain('downloadText(result.output, "masked-text.txt")');
    expect(privacySource).toContain("가린 텍스트 TXT를 저장했습니다.");
    expect(privacySource).toContain("TXT로 저장하지 못했습니다. 직접 선택해 복사해 주세요.");
    expect(privacySource).toContain("} finally {");
    expect(privacySource).toContain("URL.revokeObjectURL(url);");
    expect(privacySource).toContain("onClick={handleDownload}");
  });

  it("announces QR preview readiness and errors", async () => {
    const qrSource = await readFile("src/components/tools/QrStudio.tsx", "utf8");

    expect(qrSource).toContain('role="img"');
    expect(qrSource).toContain('aria-label="생성된 QR 미리보기"');
    expect(qrSource).toContain('aria-label="QR 미리보기 대기"');
    expect(qrSource).toContain("입력 대기");
    expect(qrSource).toContain('role="status"');
    expect(qrSource).toContain('aria-live="polite"');
    expect(qrSource).toContain("QR을 만들었습니다.");
    expect(qrSource).toContain("QR PNG를 저장했습니다.");
    expect(qrSource).toContain("QR SVG를 저장했습니다.");
    expect(qrSource).toContain("PNG로 저장하지 못했습니다. SVG로 저장해 주세요.");
    expect(qrSource).toContain("SVG로 저장하지 못했습니다. 다시 시도해 주세요.");
    expect(qrSource).toContain("const statusMessage = preview.error || saveStatus || \"QR을 만들었습니다.\"");
    expect(qrSource).toContain("const statusClass = preview.error || saveStatus.includes(\"못했습니다\")");
  });

  it("keeps QR save actions recoverable and cleans up object URLs", async () => {
    const qrSource = await readFile("src/components/tools/QrStudio.tsx", "utf8");

    expect(qrSource.match(/try \{/g)?.length).toBeGreaterThanOrEqual(4);
    expect(qrSource.match(/catch \{/g)?.length).toBeGreaterThanOrEqual(4);
    expect(qrSource.match(/finally \{/g)?.length).toBeGreaterThanOrEqual(2);
    expect(qrSource.match(/URL\.revokeObjectURL/g)?.length).toBeGreaterThanOrEqual(3);
    expect(qrSource).toContain("if (url) URL.revokeObjectURL(url);");
  });

  it("clears QR save status when QR inputs change", async () => {
    const qrSource = await readFile("src/components/tools/QrStudio.tsx", "utf8");

    for (const handler of ["changeType", "changeLabel", "changeUrl", "changeText", "changeSsid", "changePassword", "changeSecurity"]) {
      expect(qrSource).toContain(`const ${handler} =`);
    }
    expect(qrSource.match(/setSaveStatus\(""\);/g)?.length).toBeGreaterThanOrEqual(9);
    expect(qrSource).toContain("onChange={(event) => changeType(event.target.value as QrType)}");
    expect(qrSource).toContain("onChange={(event) => changeLabel(event.target.value)}");
    expect(qrSource).toContain("onChange={(event) => changeUrl(event.target.value)}");
    expect(qrSource).toContain("onChange={(event) => changeText(event.target.value)}");
    expect(qrSource).toContain("onChange={(event) => changeSsid(event.target.value)}");
    expect(qrSource).toContain("onChange={(event) => changePassword(event.target.value)}");
    expect(qrSource).toContain("onChange={(event) => changeSecurity(event.target.value)}");
  });

  it("does not keep Wi-Fi passwords in QR codes for open networks", async () => {
    const qrSource = await readFile("src/components/tools/QrStudio.tsx", "utf8");
    const qrLibSource = await readFile("src/lib/qr/qrStudio.ts", "utf8");

    expect(qrLibSource).toContain('const safePassword = type === "nopass" ? "" : escapeWifiField(password)');
    expect(qrSource).toContain('if (value === "없음") setPassword("")');
    expect(qrSource).toContain('disabled={security === "없음"}');
    expect(qrSource).toContain('placeholder={security === "없음" ? "필요 없음" : ""}');
  });

  it("announces processing status in file and privacy tools", async () => {
    const pdfSource = await readFile("src/components/tools/PdfKit.tsx", "utf8");
    const documentSource = await readFile("src/components/tools/DocumentPackager.tsx", "utf8");
    const screenshotSource = await readFile("src/components/tools/ScreenshotRedactor.tsx", "utf8");
    const privacySource = await readFile("src/components/tools/PrivacyMasker.tsx", "utf8");

    expect(pdfSource).toContain('role="status" aria-live="polite"');
    expect(documentSource).toContain('role="status"');
    expect(documentSource).toContain('aria-live="polite"');
    expect(screenshotSource).toContain('role="status" aria-live="polite"');
    expect(privacySource).toContain('role="status" aria-live="polite"');
    expect(privacySource).toContain("가린 텍스트를 복사했습니다.");
  });

  it("keeps PDF file selection and status recoverable", async () => {
    const pdfSource = await readFile("src/components/tools/PdfKit.tsx", "utf8");

    expect(pdfSource).toContain("const fileInputRef = useRef<HTMLInputElement>(null)");
    expect(pdfSource).toContain('const statusClass = status.includes("못했습니다") || status.includes("선택할 수") ? "mt-3 text-sm text-danger" : "mt-3 text-sm text-muted"');
    expect(pdfSource).toContain("if (fileInputRef.current) fileInputRef.current.value = \"\"");
    expect(pdfSource).toContain("if (isWorking) return;");
    expect(pdfSource).toContain("ref={fileInputRef}");
    expect(pdfSource).toContain("setStatus(\"\");");
    expect(pdfSource).toContain("role=\"status\"");
    expect(pdfSource).toContain("aria-live=\"polite\"");
  });

  it("keeps PDF saves recoverable and cleans up object URLs", async () => {
    const pdfSource = await readFile("src/components/tools/PdfKit.tsx", "utf8");

    expect(pdfSource).toContain('let url = ""');
    expect(pdfSource).toContain("PDF를 저장하지 못했습니다. 다시 시도해 주세요.");
    expect(pdfSource).toContain("} finally {");
    expect(pdfSource).toContain("if (url) URL.revokeObjectURL(url);");
    expect(pdfSource).toContain("setIsWorking(false)");
  });

  it("keeps screenshot file selection and errors recoverable", async () => {
    const screenshotSource = await readFile("src/components/tools/ScreenshotRedactor.tsx", "utf8");

    expect(screenshotSource).toContain("const fileInputRef = useRef<HTMLInputElement>(null)");
    expect(screenshotSource).toContain('const statusClass = status.includes("못했습니다") || status.includes("없습니다") || status.includes("선택할 수") ? "mt-3 text-sm text-danger" : "mt-3 text-sm text-muted"');
    expect(screenshotSource).toContain("이미지 파일만 선택할 수 있습니다.");
    expect(screenshotSource).toContain("이미지를 읽지 못했습니다. 다른 파일을 선택해 주세요.");
    expect(screenshotSource).toContain("const clearFileInput = ()");
    expect(screenshotSource).toContain("const revokeImageUrl = ()");
    expect(screenshotSource).toContain('imageUrlRef.current = ""');
    expect(screenshotSource.match(/revokeImageUrl\(\);/g)?.length).toBeGreaterThanOrEqual(5);
    expect(screenshotSource.match(/clearFileInput\(\);/g)?.length).toBeGreaterThanOrEqual(5);
    expect(screenshotSource).toContain("ref={fileInputRef}");
    expect(screenshotSource).toContain('role="status"');
    expect(screenshotSource).toContain('aria-live="polite"');
  });

  it("keeps screenshot save failures recoverable", async () => {
    const screenshotSource = await readFile("src/components/tools/ScreenshotRedactor.tsx", "utf8");

    expect(screenshotSource).toContain('let url = ""');
    expect(screenshotSource).toContain("try {");
    expect(screenshotSource).toContain("const url = canvas.toDataURL(type, 0.92)");
    expect(screenshotSource).toContain("이미지를 ${fileTypeLabels[type]}로 저장하지 못했습니다. 다시 시도해 주세요.");
    expect(screenshotSource).toContain("저장할 이미지가 없습니다.");
  });

  it("keeps privacy temporary save explicit and reversible", async () => {
    const privacySource = await readFile("src/components/tools/PrivacyMasker.tsx", "utf8");
    const draftStorageSource = await readFile("src/lib/privacyDraftStorage.ts", "utf8");

    expect(draftStorageSource).toContain('privacyDraftSaveKey = "privacy-masker:save"');
    expect(draftStorageSource).toContain('privacyDraftTextKey = "privacy-masker:text"');
    expect(draftStorageSource).toContain("readPrivacyDraft");
    expect(draftStorageSource).toContain("savePrivacyDraft");
    expect(draftStorageSource).toContain("clearPrivacyDraft");
    expect(draftStorageSource.match(/catch/g)?.length).toBeGreaterThanOrEqual(4);
    expect(privacySource).toContain("readPrivacyDraft(window.localStorage)");
    expect(privacySource).toContain("savePrivacyDraft(window.localStorage, text)");
    expect(privacySource).toContain("updatePrivacyDraftText(window.localStorage, value)");
    expect(privacySource).toContain("clearPrivacyDraft(window.localStorage)");
    expect(privacySource).toContain("const handleSave = (checked: boolean)");
    expect(privacySource).toContain("이 브라우저에 임시 저장합니다.");
    expect(privacySource).toContain("임시 저장을 사용할 수 없습니다. 텍스트 처리는 계속됩니다.");
    expect(privacySource).toContain("임시 저장을 껐습니다.");
  });

  it("clears document file matches when files are selected again", async () => {
    const documentSource = await readFile("src/components/tools/DocumentPackager.tsx", "utf8");

    expect(documentSource).toContain("const fileInputRef = useRef<HTMLInputElement>(null)");
    expect(documentSource).toContain("const handleFiles = (nextFiles: File[])");
    expect(documentSource).toContain("setFiles(nextFiles)");
    expect(documentSource).toContain("setMatches({})");
    expect(documentSource).toContain("if (fileInputRef.current) fileInputRef.current.value = \"\"");
    expect(documentSource).toContain("ref={fileInputRef}");
    expect(documentSource).toContain("항목에 다시 연결해 주세요.");
    expect(documentSource).toContain("onChange={(event) => handleFiles(Array.from(event.target.files ?? []))}");
  });

  it("handles document ZIP generation as a recoverable browser action", async () => {
    const documentSource = await readFile("src/components/tools/DocumentPackager.tsx", "utf8");

    expect(documentSource).toContain("const [isWorking, setIsWorking] = useState(false)");
    expect(documentSource).toContain('const statusClass = status.includes("못했습니다") ? "mt-3 text-sm text-danger" : "mt-3 text-sm text-muted"');
    expect(documentSource).toContain("if (isWorking) return;");
    expect(documentSource).toContain("setIsWorking(true)");
    expect(documentSource).toContain("} catch {");
    expect(documentSource).toContain("ZIP을 만들지 못했습니다. 파일을 다시 선택해 주세요.");
    expect(documentSource).toContain("ZIP을 저장하지 못했습니다. 다시 시도해 주세요.");
    expect(documentSource).toContain("} finally {");
    expect(documentSource).toContain("if (url) URL.revokeObjectURL(url);");
    expect(documentSource).toContain("setIsWorking(false)");
    expect(documentSource).toContain("disabled={isWorking || files.length === 0}");
    expect(documentSource).toContain('{isWorking ? "ZIP 만드는 중" : "서류 ZIP 만들기"}');
  });

  it("keeps guide copy aligned with selection and sharing wording", async () => {
    const guideSource = await readFile("src/data/guides.ts", "utf8");
    const toolsSource = await readFile("src/data/tools.ts", "utf8");
    const homeSource = await readFile("src/pages/index.astro", "utf8");
    const toolPageSource = await readFile("src/pages/tools/_ToolPage.astro", "utf8");

    expect(guideSource).toContain("파일이 서버로 전송되나요?");
    expect(guideSource).toContain("파일을 선택합니다.");
    expect(guideSource).toContain("스크린샷 공유 전 확인할 것들");
    expect(guideSource).toContain("이미지를 선택하고");
    expect(guideSource).not.toContain("서버로 올라가나요");
    expect(guideSource).not.toContain("파일을 올립니다");
    expect(guideSource).not.toContain("이미지를 올리고");
    expect(toolsSource).toContain("이미지 위를 블러, 모자이크, 박스로 덮어 저장합니다.");
    expect(toolsSource).toContain("단톡방에 공유할 모임 공지문");
    expect(toolsSource).not.toContain("박스를 올려 저장합니다");
    expect(toolsSource).not.toContain("단톡방에 올릴");
    expect(homeSource).toContain("파일이 서버로 업로드되나요?");
    expect(toolPageSource).toContain("커뮤니티 글을 공유하기 전");
    expect(toolPageSource).not.toContain("커뮤니티 글을 올리기 전");
  });

  it("does not expose beta wording on public pages and shared public components", async () => {
    const files = (await Promise.all(sourceRoots.map(collectSourceFiles))).flat();

    for (const file of files) {
      if (file.includes("\\test\\") || file.includes("/test/")) continue;
      const source = await readFile(file, "utf8");
      expect(source.includes("시험 중"), `${file} should not include public beta wording`).toBe(false);
    }
  });
});
