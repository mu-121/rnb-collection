"use client";

import { FormEvent, useCallback } from "react";

type NewsletterProps = {
  /** When true, render as an inner footer block (no separate section background). */
  embedded?: boolean;
};

export default function Newsletter({ embedded = false }: NewsletterProps) {
  const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // LIVE form has method=POST with no action / no success UI.
    // Reproduce native email validation only; stay on page after valid submit.
  }, []);

  const body = (
    <div className="newsletter__row">
      <h2 id="newsletter-heading" className="newsletter__heading">
        Subscribe to our news later
      </h2>

      <form className="newsletter__form" method="post" onSubmit={onSubmit}>
        <label className="newsletter__sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          className="newsletter__input"
          type="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <input
          className="newsletter__submit"
          type="submit"
          value="Subscribe"
        />
      </form>
    </div>
  );

  if (embedded) {
    return (
      <div className="newsletter newsletter--embedded" aria-labelledby="newsletter-heading">
        {body}
      </div>
    );
  }

  return (
    <section className="newsletter" aria-labelledby="newsletter-heading">
      <div className="newsletter__inner">{body}</div>
    </section>
  );
}
