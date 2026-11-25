"use client";
import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="card mx-auto mt-6 grid max-w-sm gap-4 p-6">
      <label className="grid gap-1 text-sm">Password staff
        <input name="password" type="password" required autoComplete="current-password" className="field" />
      </label>
      {error && <p role="alert" className="text-sm text-ember-2">{error}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? "…" : "Entra"}</button>
    </form>
  );
}
