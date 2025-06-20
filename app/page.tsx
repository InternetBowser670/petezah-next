'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await fetch('/api/submit-password', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      router.push("/");
    } else {
      setMessage('Invalid password.');
    }
  }

  return (
    <main className='text-white'>
      <h1>Enter Password to Access</h1>
      <form onSubmit={handleSubmit}>
        <input type="password" name="password" required />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}
