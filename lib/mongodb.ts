import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabases(
  useProdDB: boolean
): Promise<{ client: MongoClient; mainDb: Db; }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, mainDb: cachedDb };
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define MONGODB_URI in your environment variables.");
  }

  const client = new MongoClient(uri);
  await client.connect();

  const mainDb = useProdDB
    ? client.db("Petezah-Next-Links-Prod")
    : client.db(process.env.DEVLINKSDBNAME || "Petezah-Next-Links-Dev");

  // Cache the connections
  cachedClient = client;
  cachedDb = mainDb;

  return { client, mainDb: mainDb };
}
