"use client";

import { FormEvent, useCallback } from "react";

export default function Newsletter() {
  const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // LIVE form has method=POST with no action / no success UI.
    // Reproduce native email validation only; stay on page after valid submit.
  }, []);

  return (
    <section className="newsletter" aria-labelledby="newsletter-heading">
      <div className="newsletter__inner">
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
            <input className="newsletter__submit" type="submit" value="Subscribe" />
          </form>
        </div>

        <div className="newsletter__divider" aria-hidden="true" />
      </div>
    </section>
  );
}
