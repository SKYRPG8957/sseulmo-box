import { useMemo, useState } from "react";
import { addDays, daysBetween } from "../../lib/date/dateCalculator";

export default function DateCalculator() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [base, setBase] = useState("");
  const [amount, setAmount] = useState("7");
  const diff = useMemo(() => daysBetween(start, end), [start, end]);
  const added = useMemo(() => addDays(base, Number(amount)), [base, amount]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="panel">
        <h2 className="text-lg font-semibold">날짜 차이</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="label">시작일<input className="field" type="date" value={start} onChange={(event) => setStart(event.target.value)} /></label>
          <label className="label">종료일<input className="field" type="date" value={end} onChange={(event) => setEnd(event.target.value)} /></label>
        </div>
        <div className="mt-5 rounded-lg bg-slate-50 p-4">
          <p className="text-sm text-secondary">차이</p>
          <p className="mt-1 text-3xl font-semibold">{diff === null ? "-" : `${Math.abs(diff)}일`}</p>
          {diff !== null && <p className="mt-1 text-sm text-muted">{diff < 0 ? "종료일이 시작일보다 앞에 있습니다." : "시작일 다음 날부터 센 날짜 차이입니다."}</p>}
        </div>
      </section>
      <section className="panel">
        <h2 className="text-lg font-semibold">며칠 뒤 계산</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="label">기준일<input className="field" type="date" value={base} onChange={(event) => setBase(event.target.value)} /></label>
          <label className="label">더할 일수<input className="field" type="number" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
        </div>
        <div className="mt-5 rounded-lg bg-slate-50 p-4">
          <p className="text-sm text-secondary">계산 결과</p>
          <p className="mt-1 text-3xl font-semibold">{added || "-"}</p>
          <p className="mt-1 text-sm text-muted">음수를 입력하면 이전 날짜를 계산합니다.</p>
        </div>
      </section>
    </div>
  );
}
