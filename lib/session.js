
import { cookies } from "next/headers";
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "auth-store.json");

const defaultUsers = [
  { id: "user-1", username: "wey", name: "Weynshet Kebede", role: "customer" },
  { id: "user-2", username: "abebe", name: "Abebe Bekele", role: "customer" },
  { id: "staff-1", username: "kitchen", name: "Kitchen Staff", role: "staff" },
  { id: "admin-1", username: "admin", name: "Addis Eats Admin", role: "admin" },
];

const defaultPasswords = {
  wey: "123456",
  abebe: "123456",
  admin: "123456",
};

const defaultSessions = {
  "wey-session": "user-1",
  "abebe-session": "user-2",
  "admin-session": "admin-1",
};

function hashPassword(password, salt) {
  return scryptSync(password, salt, 64).toString("hex");
}

async function loadStore() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    return JSON.parse(await readFile(dataFile, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;

    const store = {
      users: [],
      passwords: {},
      sessions: {},
    };

    await writeFile(dataFile, JSON.stringify(store, null, 2));
    return store;
  }
}

async function saveStore(store) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(dataFile, JSON.stringify(store, null, 2));
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  const store = await loadStore();
  const userId = store.sessions[token] ?? defaultSessions[token];

  if (!userId) return null;

  return (
    defaultUsers.find((user) => user.id === userId) ??
    store.users.find((user) => user.id === userId) ??
    null
  );
}

export async function authenticateUser(username, password) {
  const normalizedUsername = username.trim().toLowerCase();

  const builtInUser = defaultUsers.find(
    (user) => user.username === normalizedUsername
  );

  if (builtInUser && defaultPasswords[normalizedUsername] === password) {
    const token = Object.keys(defaultSessions).find(
      (key) => defaultSessions[key] === builtInUser.id
    );

    return token ? { token, user: builtInUser } : null;
  }

  const store = await loadStore();

  const user = store.users.find(
    (item) => item.username === normalizedUsername
  );

  const saved = store.passwords[normalizedUsername];

  if (!user || !saved) return null;

  const suppliedHash = Buffer.from(
    hashPassword(password, saved.salt),
    "hex"
  );
  const savedHash = Buffer.from(saved.hash, "hex");

  if (
    suppliedHash.length !== savedHash.length ||
    !timingSafeEqual(suppliedHash, savedHash)
  ) {
    return null;
  }

  const token = randomBytes(32).toString("hex");
  store.sessions[token] = user.id;
  await saveStore(store);

  return { token, user };
}

export async function registerUser({ name, username, password }) {
  const cleanName = name.trim();
  const cleanUsername = username.trim().toLowerCase();

  if (!cleanName || !cleanUsername || password.length < 8) {
    return {
      error: "Complete all fields and use a password of at least 8 characters.",
    };
  }

  if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
    return {
      error: "Username must be 3–20 characters using letters, numbers, or underscores.",
    };
  }

  const store = await loadStore();

  if (
    defaultUsers.some((user) => user.username === cleanUsername) ||
    store.users.some((user) => user.username === cleanUsername)
  ) {
    return {
      error: "That username is already taken. Please choose another.",
    };
  }

  const salt = randomBytes(16).toString("hex");

  const user = {
    id: randomBytes(16).toString("hex"),
    username: cleanUsername,
    name: cleanName,
    role: "customer",
  };

  const token = randomBytes(32).toString("hex");

  store.users.push(user);
  store.passwords[cleanUsername] = {
    salt,
    hash: hashPassword(password, salt),
  };
  store.sessions[token] = user.id;

  await saveStore(store);

  return { token, user };
}
