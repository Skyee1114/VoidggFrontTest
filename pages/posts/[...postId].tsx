import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PlayerDetail() {
  const router = useRouter();
  const [id, setId] = useState<string>('');

  useEffect(() => {
    setId(router.query.postId?.[0] ?? '');
  }, [router.query.postId]);

  return (
    <h1>Id: {id}</h1>
  );
}
