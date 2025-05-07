'use client';

import { useState, useEffect, useRef } from 'react';
import { getWords } from '@/actions/auth';

type Word = {
  id: number;
  japanese: string;
  romaji: string;
};

export default function TypingGame() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isGameCleared, setIsGameCleared] = useState(false);
  const [errorFlash, setErrorFlash] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // 単語の取得
  useEffect(() => {
    const fetchWords = async () => {
      const result = await getWords();
      if (result?.error) {
        setError(result.error);
      } else if (result?.data) {
        setWords(result.data);
      }
    };
    fetchWords();
  }, []);

  // キーボードイベントの設定
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameCleared || error || words.length === 0) return;

      const currentWord = words[currentWordIndex];
      if (!currentWord) return;

      const romaji = currentWord.romaji.toLowerCase();
      const expectedChar = romaji[input.length];

      // アルファベット入力
      if (/^[a-zA-Z]$/.test(e.key)) {
        const key = e.key.toLowerCase();
        if (key === expectedChar) {
          const newInput = input + key;
          setInput(newInput);
          setErrorFlash(false);
          // ローマ字全体と一致したら次の単語へ
          if (newInput === romaji) {
            setScore((prev) => prev + 1);
            setInput('');
            if (currentWordIndex + 1 < words.length) {
              setCurrentWordIndex((prev) => prev + 1);
            } else {
              setIsGameCleared(true);
            }
          }
        } else {
          // 間違った入力でエラー点滅
          setErrorFlash(true);
          setTimeout(() => setErrorFlash(false), 200);
        }
      } else if (e.key === 'Backspace') {
        setInput((prev) => prev.slice(0, -1));
        setErrorFlash(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, currentWordIndex, words, isGameCleared, error]);

  // フォーカスを設定
  const focusGameArea = () => {
    gameAreaRef.current?.focus();
  };

  const resetGame = () => {
    setCurrentWordIndex(0);
    setInput('');
    setScore(0);
    setIsGameCleared(false);
    setErrorFlash(false);
    focusGameArea();
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (words.length === 0) {
    return <p className="text-center">単語を読み込み中...</p>;
  }

  if (isGameCleared) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold text-green-600">ゲームクリア！</h2>
        <p className="text-xl">最終スコア: {score}</p>
        <button
          onClick={resetGame}
          className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          もう一度プレイ
        </button>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];
  const romaji = currentWord.romaji.toLowerCase();
  const typed = input.toLowerCase();

  return (
    <div
      ref={gameAreaRef}
      tabIndex={0}
      onClick={focusGameArea}
      className="space-y-4 outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-4"
    >
      <div className="text-center">
        <p className="text-2xl font-bold">{currentWord.japanese}</p>
        <p className={!errorFlash ? 'text-2xl text-gray-600': 'text-2xl text-red-600'}>
          {romaji.split('').map((char, index) => (
            <span
              key={index}
              className={index < typed.length && typed[index] === char ? 'opacity-50' : ''}
            >
              {char}
            </span>
          ))}
        </p>
      </div>
      <div className="text-center">
        <p className="text-xl">スコア: {score}</p>
        <p className="text-sm text-gray-500">
          単語 {currentWordIndex + 1}/{words.length}
        </p>
      </div>
    </div>
  );
}