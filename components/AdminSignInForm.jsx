"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { adminSignIn } from "../app/actions";

const initialState = { error: "" };

export default function AdminSignInForm() {
  const [state, action, pending] = useActionState(
    adminSignIn,
    initialState
  );

  return (
    <form className="form-card signin-form" action={action}>
      <div className="form-group">
        <label htmlFor="admin-username">Administrator username</label>
        <input
          id="admin-username"
          name="username"
          autoComplete="username"
          required
          placeholder="Enter admin username"
        />
      </div>

      <div className="form-group">
        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Enter admin password"
        />
      </div>

      {state?.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}

      <button
        className="button button-primary btn-block"
        type="submit"
        disabled={pending}
      >
        <LogIn size={18} />
        {pending ? "Signing in..." : "Admin sign in"}
      </button>

      <p className="muted">
        This page is for restaurant administrators only.
      </p>
    </form>
  );
}