export function parseParticipants(value: string) {
  const seen = new Set<string>();
  const participants: string[] = [];

  for (const item of value.split(/[\n,]/)) {
    const name = item.trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    participants.push(name);
  }

  return participants;
}

export function pickRandomItems<T>(items: T[], count: number, random = Math.random) {
  const pool = [...items];
  const result: T[] = [];
  const limit = Math.max(0, Math.min(Math.trunc(count), pool.length));

  for (let i = 0; i < limit; i++) {
    const index = Math.floor(random() * pool.length);
    result.push(pool[index]);
    pool.splice(index, 1);
  }

  return result;
}
