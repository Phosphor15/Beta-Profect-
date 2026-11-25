"use client";
export function PrintButton() {
  return <button onClick={() => window.print()} className="no-print btn btn-ghost !py-2">🖨 Stampa lista</button>;
}
