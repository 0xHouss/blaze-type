'use server'

import { Quote } from "@/lib/definitions";

export async function getQuotes() {
  const res = await fetch("https://monkeytype.com/quotes/english.json")

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data.quotes as Quote[];
}

export async function getWords() {
  const res = await fetch("https://monkeytype.com/languages/english.json")

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data.words;
}