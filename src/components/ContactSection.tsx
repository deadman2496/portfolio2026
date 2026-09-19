"use client";

import type { FormEvent } from "react";
import Reveal from "@/components/Reveal";

const CONTACT_EMAIL = "iam@alexismarroquin.nyc";

export default function ContactSection() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const subject = String(form.get("subject") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const mailSubject =
      subject || `Portfolio message from ${name || "a visitor"}`;

    const mailBody = [
      `Name: ${name}`,
      `Reply email: ${email}`,
      "",
      message,
    ].join("\n");

    const params = new URLSearchParams({
      subject: mailSubject,
      body: mailBody,
    });

    window.location.href = `mailto:${CONTACT_EMAIL}?${params.toString()}`;
  }

  return (
    <section
      id="contact"
      className="relative bg-slate-950 px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal direction="up">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
              Contact
            </p>

            <h2 className="text-4xl font-black tracking-tight md:text-6xl">
              Have something you want to build, fix, or talk about?
            </h2>

            <p className="mt-6 text-lg leading-8 text-white/65">
              Send me a message and I&apos;ll get back to you as soon as I can.
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delayMs={150}>
          <div className="grid gap-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl md:p-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
                Email
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-3 inline-block text-xl font-bold text-white transition hover:text-blue-200"
              >
                {CONTACT_EMAIL}
              </a>

              <p className="mt-5 max-w-md leading-7 text-white/55">
                Development, technical projects, repairs, collaboration, or
                anything else that makes sense for the portfolio.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-white/70">Name</span>

                  <input
                    required
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-blue-300/60"
                    placeholder="Your name"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold text-white/70">Email</span>

                  <input
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-blue-300/60"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-white/70">
                  Subject
                </span>

                <input
                  name="subject"
                  type="text"
                  className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-blue-300/60"
                  placeholder="What would you like to talk about?"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-white/70">
                  Message
                </span>

                <textarea
                  required
                  name="message"
                  rows={6}
                  className="resize-y rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-blue-300/60"
                  placeholder="Tell me a little about what you have in mind..."
                />
              </label>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="rounded-full bg-white px-6 py-4 font-black text-slate-950 shadow-xl transition hover:scale-[1.02]"
                >
                  Send Message
                </button>

                <span className="text-sm text-white/40">
                  Opens your email app.
                </span>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}