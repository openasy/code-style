import { useState } from "react";

export function Counter({ items }: { items: string[] }) {
  const [count, setCount] = useState(0);
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>
          <button type="button" onClick={() => setCount(count + 1)}>
            {item}
          </button>
        </li>
      ))}
    </ul>
  );
}
