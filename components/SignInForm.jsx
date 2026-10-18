"use client";

import { useActionState } from "react";
import { signIn } from "../app/actions";
import { LogIn } from "lucide-react";
const initialState = { error: "" };

export default function SignInForm({ next = "/" }) {
  const [state, action, pending] = useActionState(signIn, initialState);

  return (

    <form className="form-card signin-form" action={action}>
      <input type="hidden" name="next" value={next} />
      <label>
        Username
        <input name="username" autoComplete="username" required placeholder="Enter username" />
      </label>
      <label>
        Password
        <input name="password" type="password" autoComplete="current-password" required placeholder="Enter password" />
      </label>
      {state?.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="button button-primary button-full" type="submit" disabled={pending}>
        <LogIn size={18} /> {pending ? "Signing in..." : "Sign in"}
      </button>
      <div className="demo-credentials">
        <p><strong>Demo accounts</strong></p>
        <p>Customer: <code>wey</code> / <code>123456</code></p>
        <p>Admin: <code>admin</code> / <code>123456</code></p>
      </div>
    </form>

  );
}