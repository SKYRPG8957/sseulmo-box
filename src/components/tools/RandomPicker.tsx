import { useMemo, useState } from "react";
import { parseParticipants, pickRandomItems } from "../../lib/random/randomPicker";

const sample = "민수\n지영\n서준\n하린\n도윤\n수아";

export default function RandomPicker() {
  const [names, setNames] = useState("");
  const [count, setCount] = useState("1");
  const [picked, setPicked] = useState<string[]>([]);
  const participants = useMemo(() => parseParticipants(names), [names]);
  const winnerCount = Math.max(1, Math.min(Number(count) || 1, Math.max(participants.length, 1)));

  const pick = () => {
    setPicked(pickRandomItems(participants, winnerCount));
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <section className="panel">
        <label className="label">참가자
          <textarea
            className="field min-h-72 resize-y"
            value={names}
            onChange={(event) => {
              setNames(event.target.value);
              setPicked([]);
            }}
            placeholder="한 줄에 한 명씩 입력하거나 쉼표로 구분하세요."
          />
        </label>
        <div className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr]">
          <label className="label">뽑을 수
            <input className="field" type="number" min="1" value={count} onChange={(event) => setCount(event.target.value)} />
          </label>
          <div className="flex items-end gap-2">
            <button className="btn" type="button" onClick={pick} disabled={participants.length === 0}>추첨하기</button>
            <button className="btn-secondary" type="button" onClick={() => { setNames(sample); setPicked([]); }}>예시</button>
          </div>
        </div>
      </section>
      <section className="panel">
        <h2 className="text-lg font-semibold">결과</h2>
        <p className="mt-1 text-sm text-muted">중복 이름은 한 번만 계산합니다. 현재 참가자 {participants.length}명</p>
        <ol className="mt-4 space-y-2">
          {picked.length ? picked.map((name, index) => <li key={`${name}-${index}`} className="rounded-lg border border-border px-4 py-3 font-semibold">{index + 1}. {name}</li>) : <li className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-muted">추첨 결과가 여기에 표시됩니다.</li>}
        </ol>
      </section>
    </div>
  );
}
