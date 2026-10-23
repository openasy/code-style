import { useState } from "react";

export function List({ items, open }: { items: string[]; open: boolean }) {
  if (open) useState(0);
  return <ul>{items.map((item) => <li>{item}</li>)}</ul>;
}
