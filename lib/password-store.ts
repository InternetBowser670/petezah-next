import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const nouns = [
  "apple",
  "river",
  "tiger",
  "cloud",
  "planet",
  "forest",
  "rocket",
  "ocean",
  "castle",
  "wizard",
];
const verbs = [
  "runs",
  "flies",
  "shines",
  "jumps",
  "sleeps",
  "grows",
  "drifts",
  "explores",
  "builds",
  "sings",
];

function getMonthKey(offset: number = 0): string {
  const now = new Date();
  const target = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset)
  );
  return `${target.getUTCFullYear()}-${String(
    target.getUTCMonth() + 1
  ).padStart(2, "0")}`;
}

function generateFormattedPassword(): string {
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${noun}_${verb}-${number}`;
}

export async function generateNextMonthPasswordIfEligible() {
  const now = new Date();
  const nextMonthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
  );
  const fourteenDaysBefore = new Date(
    nextMonthStart.getTime() - 14 * 24 * 60 * 60 * 1000
  );

  if (now < fourteenDaysBefore) {
    console.log(
      "Not within the 2-week window yet. Skipping password generation."
    );
    return;
  }

  const nextMonthKey = getMonthKey(1);
  const existingPassword = await redis.get<string>(`password:${nextMonthKey}`);

  if (existingPassword) {
    console.log(`Password for ${nextMonthKey} already exists.`);
    return;
  }

  const newPassword = generateFormattedPassword();
  await redis.set(`password:${nextMonthKey}`, newPassword);
  console.log(`Generated password for ${nextMonthKey}: ${newPassword}`);
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  const currentMonth = getMonthKey(0);
  const nextMonth = getMonthKey(1);

  const passwords = await redis.mget(
    `password:${currentMonth}`,
    `password:${nextMonth}`
  );

  for (const pwd of passwords) {
    if (pwd !== null && pwd === candidate) {
      return true;
    }
  }
  return false;
}

export async function getAllPasswords(): Promise<Record<string, string>> {
  const keys = await redis.keys("password:*");
  if (keys.length === 0) return {};

  const values: (string | null)[] = await redis.mget(...keys);

  const result: Record<string, string> = {};

  keys.forEach((key, i) => {
    const month = key.replace("password:", "");
    if (values[i] !== null && values[i] !== undefined) {
      result[month] = values[i]!;
    }
  });

  return result;
}
