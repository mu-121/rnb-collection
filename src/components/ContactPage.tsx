"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback } from "react";
import {
  contactFormFields,
  contactHero,
  contactInfo,
  contactMedia,
  type ContactInfoItem,
} from "@/data/contact";
import HoverText from "./HoverText";

function ContactHero() {
  return (
    <section className="contact-hero" aria-labelledby="contact-hero-heading">
      <div className="contact-hero__media">
        <Image
          src={contactHero.image}
          alt={contactHero.imageAlt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="contact-hero__image"
          unoptimized
        />
      </div>
      <div className="contact-hero__overlay" aria-hidden="true" />

      <div className="contact-hero__content">
        <div className="contact-hero__copy">
          <div className="contact-hero__chip">
            <span className="contact-hero__chip-pill">
              {contactHero.eyebrowPill}
            </span>
            <span className="contact-hero__chip-label">
              {contactHero.eyebrowLabel}
            </span>
          </div>

          <h1 id="contact-hero-heading" className="contact-hero__heading">
            {contactHero.heading}
          </h1>

          <p className="contact-hero__text">{contactHero.body}</p>

          <div className="contact-hero__actions">
            <Link
              href={contactHero.primaryCta.href}
              className="contact-hero__btn contact-hero__btn--solid"
            >
              <HoverText>{contactHero.primaryCta.label}</HoverText>
            </Link>
            <Link
              href={contactHero.secondaryCta.href}
              className="contact-hero__btn contact-hero__btn--glass"
            >
              <HoverText>{contactHero.secondaryCta.label}</HoverText>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ item }: { item: ContactInfoItem }) {
  const external = item.href.startsWith("http");

  return (
    <a
      href={item.href}
      className="contact-card"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="contact-card__icon" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.icon}
          alt=""
          width={28}
          height={28}
          className="contact-card__icon-img"
        />
      </span>
      <span className="contact-card__value">{item.value}</span>
      <span className="contact-card__label">{item.label}</span>
    </a>
  );
}

function ContactForm() {
  const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // LIVE posts with no action / no success UI — native required validation only.
  }, []);

  const f = contactFormFields;

  return (
    <form className="contact-form" method="post" onSubmit={onSubmit} noValidate={false}>
      <div className="contact-form__row">
        <div className="contact-field">
          <label htmlFor={f.firstName.id} className="contact-field__label">
            {f.firstName.label}
          </label>
          <div className="contact-field__control">
            <input
              id={f.firstName.id}
              name={f.firstName.name}
              type={f.firstName.type}
              placeholder={f.firstName.placeholder}
              required={f.firstName.required}
              autoComplete={f.firstName.autoComplete}
              className="contact-field__input"
            />
          </div>
        </div>

        <div className="contact-field">
          <label htmlFor={f.lastName.id} className="contact-field__label">
            {f.lastName.label}
          </label>
          <div className="contact-field__control">
            <input
              id={f.lastName.id}
              name={f.lastName.name}
              type={f.lastName.type}
              placeholder={f.lastName.placeholder}
              required={f.lastName.required}
              autoComplete={f.lastName.autoComplete}
              className="contact-field__input"
            />
          </div>
        </div>
      </div>

      <div className="contact-form__row">
        <div className="contact-field">
          <label htmlFor={f.email.id} className="contact-field__label">
            {f.email.label}
          </label>
          <div className="contact-field__control">
            <input
              id={f.email.id}
              name={f.email.name}
              type={f.email.type}
              placeholder={f.email.placeholder}
              required={f.email.required}
              autoComplete={f.email.autoComplete}
              className="contact-field__input"
            />
          </div>
        </div>

        <div className="contact-field">
          <label htmlFor={f.phone.id} className="contact-field__label">
            {f.phone.label}
          </label>
          <div className="contact-field__control">
            <input
              id={f.phone.id}
              name={f.phone.name}
              type={f.phone.type}
              placeholder={f.phone.placeholder}
              required={f.phone.required}
              autoComplete={f.phone.autoComplete}
              className="contact-field__input"
            />
          </div>
        </div>
      </div>

      <div className="contact-field contact-field--full">
        <label htmlFor={f.subject.id} className="contact-field__label">
          {f.subject.label}
        </label>
        <div className="contact-field__control">
          <input
            id={f.subject.id}
            name={f.subject.name}
            type={f.subject.type}
            placeholder={f.subject.placeholder}
            required={f.subject.required}
            autoComplete={f.subject.autoComplete}
            className="contact-field__input"
          />
        </div>
      </div>

      <div className="contact-field contact-field--full">
        <label htmlFor={f.message.id} className="contact-field__label">
          {f.message.label}
        </label>
        <div className="contact-field__control contact-field__control--textarea">
          <textarea
            id={f.message.id}
            name={f.message.name}
            placeholder={f.message.placeholder}
            required={f.message.required}
            rows={6}
            className="contact-field__textarea"
          />
        </div>
      </div>

      <button type="submit" className="contact-submit">
        <HoverText>{f.submitLabel}</HoverText>
      </button>
    </form>
  );
}

function ContactBody() {
  return (
    <section className="contact-page" aria-labelledby="contact-page-heading">
      <h2 id="contact-page-heading" className="contact-page__sr-only">
        Contact details and form
      </h2>

      <div className="contact-page__inner">
        <div className="contact-info" role="list">
          {contactInfo.map((item) => (
            <div key={item.id} role="listitem">
              <InfoCard item={item} />
            </div>
          ))}
        </div>

        <div className="contact-main">
          <div className="contact-media">
            <Image
              src={contactMedia.image}
              alt={contactMedia.imageAlt}
              fill
              sizes="(max-width: 809px) 100vw, (max-width: 1199px) 100vw, 567px"
              className="contact-media__image"
              unoptimized
            />
          </div>

          <div className="contact-form-shell">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactHeroSection() {
  return <ContactHero />;
}

export function ContactBodySection() {
  return <ContactBody />;
}
