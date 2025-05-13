'use client';

import { useEffect, useState } from 'react';

const WORDS = [
  'PeteZah Games.',
  'beauty.',
  'vibrancy.',
  'prosperity.',
  'peace.',
  'stability.',
  'amazement.',
  'resiliency.',
  'friendliness.',
  'flourishment.',
  'sustainability.',
];

const TYPING_DELAY = 100;
const DELETING_DELAY = 50;
const PAUSE_DURATION = 1500;

export default function Typewriter() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);

  useEffect(() => {
    const currentWord = WORDS[loopIndex % WORDS.length];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setText((prev) => prev.slice(0, -1));
      }, DELETING_DELAY);
    } else {
      timeout = setTimeout(() => {
        setText((prev) => currentWord.slice(0, prev.length + 1));
      }, TYPING_DELAY);
    }

    if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), PAUSE_DURATION);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setLoopIndex((prev) => prev + 1);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, loopIndex]);

  return (
    <>
      {text}
      <span className="inline-block font-light animate-pulse text-blue-600">|</span>
    </>
  );
}
