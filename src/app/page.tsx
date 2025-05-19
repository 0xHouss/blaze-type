import { getQuotes, getWords } from "./actions";
import Game from "./game";

export default async function Home() {
  const quotes = await getQuotes();
  const words = await getWords();


  return (
    <Game quotes={quotes} words={words} />
  );
}

