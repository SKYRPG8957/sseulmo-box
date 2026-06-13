import { useMemo, useState } from "react";
import { countText } from "../../lib/text/characterCounter";

const sample = "중고거래 글을 올리기 전에 연락처와 주소가 남아 있는지 확인하세요.";

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const counts = useMemo(() => countText(text), [text]);
  const rows = [
    ["전체 글자", counts.chars],
    ["공백 제외", counts.charsNoSpaces],
    ["단어", counts.words],
    ["줄", counts.lines],
    ["UTF-8 바이트", counts.bytes]
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <section className="panel">
        <label className="label">확인할 글
          <textarea
            className="field min-h-72 resize-y"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="글자 수를 확인할 문장을 붙여넣으세요."
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn-secondary" type="button" onClick={() => setText(sample)}>예시 넣기</button>
          <button className="btn-secondary" type="button" onClick={() => setText("")}>비우기</button>
        </div>
      </section>
      <section className="panel">
        <h2 className="text-lg font-semibold">결과</h2>
        <dl className="mt-4 divide-y divide-border rounded-lg border border-border">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-secondary">{label}</dt>
              <dd className="text-xl font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm text-muted">공백 제외 글자 수는 모든 공백 문자를 제외하고 셉니다.</p>
      </section>
    </div>
  );
}
