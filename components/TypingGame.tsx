'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { JSX } from 'react';
import { getWords } from '@/actions/auth';

type Word = {
  readonly id: number;
  readonly japanese: string;
  readonly romaji: string;
};

type GetWordsResponse = {
  data?: Word[];
  error?: string;
};

export default function TypingGame(): JSX.Element {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [input, setInput] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isGameCleared, setIsGameCleared] = useState<boolean>(false);
  const [errorFlash, setErrorFlash] = useState<boolean>(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // 単語取得処理
  useEffect(() => {
    const fetchWords = async (): Promise<void> => {
      const result = await getWords() as GetWordsResponse;
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setWords(result.data);
      }
    };

    fetchWords();
  }, []);

  // 正しい文字入力処理
  const handleCharacterInput = useCallback((key: string): void => {
    const currentWord = words[currentWordIndex];
    const romaji = currentWord.romaji.toLowerCase();
    const expectedChar = romaji[input.length];

    if (key === expectedChar) {
      const newInput = input + key;
      setInput(newInput);
      setErrorFlash(false);

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
      setErrorFlash(true);
      setTimeout(() => setErrorFlash(false), 200);
    }
  }, [input, currentWordIndex, words]);

  // キーボードイベント処理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (isGameCleared || error || words.length === 0) return;

      if (/^[a-zA-Z]$/.test(e.key)) {
        handleCharacterInput(e.key.toLowerCase());
      } else if (e.key === 'Backspace') {
        setInput((prev) => prev.slice(0, -1));
        setErrorFlash(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCharacterInput, isGameCleared, error, words.length]);

  const focusGameArea = (): void => {
    gameAreaRef.current?.focus();
  };

  const resetGame = useCallback((): void => {
    setCurrentWordIndex(0);
    setInput('');
    setScore(0);
    setIsGameCleared(false);
    setErrorFlash(false);
    focusGameArea();
  }, []);

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
  const romaji = currentWord?.romaji.toLowerCase() ?? '';
  const typed = input.toLowerCase();

  return (
    <div
      ref={gameAreaRef}
      tabIndex={0}
      onClick={focusGameArea}
      className="space-y-4 outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-4"
    >
      <div className="text-center">
        <p className="text-2xl font-bold">{currentWord?.japanese}</p>
        <p className={errorFlash ? 'text-2xl text-red-600' : 'text-2xl text-gray-600'}>
          {romaji.split('').map((char, index) => (
            <span
              key={index}
              className={
                index < typed.length && typed[index] === char
                  ? 'opacity-50'
                  : undefined
              }
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
