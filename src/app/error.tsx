"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h1>ERROR</h1>
      <p>
        Something has gone horribly wrong and I have no idea what to do about
        it.
      </p>
      <button onClick={reset}>Try resetting?</button>
    </div>
  );
}
