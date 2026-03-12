import { useEffect, useState } from "react";

interface Props {
  orderTime: string;
  onComplete: () => void;
}

export function OrderCountdown({ orderTime, onComplete }: Props) {
  const [remaining, setRemaining] = useState(() => {
    const diff = new Date(orderTime).getTime() - Date.now();
    return diff > 0 ? diff : 0;
  });

  useEffect(() => {
    if (remaining <= 0) return;

    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1000) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderTime]);

  const minutes = Math.floor((remaining / 1000 / 60) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return (
    <span>
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}
