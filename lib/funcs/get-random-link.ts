"use server";

import { connectToDatabases } from "../../lib/mongodb";

export const dynamic = 'force-dynamic';

export async function getRandomLink() {

  const useProdDB = false;

  const { mainDb } = await connectToDatabases(useProdDB);

  const link = await mainDb.collection("links").aggregate([{ $sample: { size: 1 } }]).toArray()

  return link
}
