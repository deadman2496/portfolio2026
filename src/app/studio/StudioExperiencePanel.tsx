"use client";

import { FormEvent, useMemo, useState } from "react";
import type {
  StudioExperienceInput,
  StudioExperienceItem,
  StudioExperienceType,
  StudioExperienceVisibility,
} from "@/types/studioExperience";

type StudioExperiencePanelProps = {
  token: string;
  hasToken: boolean;
};

type StudioExperienceFormState = {
  id: string;
  type: StudioExperienceType;
  organization: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  summary: string;
  bullets: string;
  skills: string;
  visibility: StudioExperienceVisibility;
  sortOrder: string;
  focusTags: string;
};

const emptyExperienceForm: StudioExperienceFormState = {
  id: "",
  type: "work",
  organization: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  summary: "",
  bullets: "",
  skills: "",
  visibility: "draft",
  sortOrder: "0",
  focusTags: "general",
};

const experienceTypeOptions: Array<{
  value: StudioExperienceType;
  label: string;
}> = [
  { value: "work", label: "Work" },
  { value: "project", label: "Project" },
  { value: "education", label: "Education" },
  { value: "certification", label: "Certification" },
  { value: "volunteer", label: "Volunteer" },
];

function getAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

function itemToForm(item: StudioExperienceItem): StudioExperienceFormState {
  return {
    id: item.id,
    type: item.type,
    organization: item.organization,
    role: item.role,
    location: item.location ?? "",
    startDate: item.startDate,
    endDate: item.endDate ?? "",
    isCurrent: item.isCurrent,
    summary: item.summary ?? "",
    bullets: item.bullets.join("\n"),
    skills: item.skills.join(", "),
    visibility: item.visibility,
    sortOrder: String(item.sortOrder),
    focusTags: item.focusTags.join(", "),
  };
}

function formToInput(form: StudioExperienceFormState): StudioExperienceInput {
  return {
    id: form.id || undefined,
    type: form.type,
    organization: form.organization,
    role: form.role,
    location: form.location,
    startDate: form.startDate,
    endDate: form.endDate,
    isCurrent: form.isCurrent,
    summary: form.summary,
    bullets: form.bullets,
    skills: form.skills,
    visibility: form.visibility,
    sortOrder: Number(form.sortOrder) || 0,
    focusTags: form.focusTags,
  };
}

function getExperienceDateLabel(item: StudioExperienceItem) {
  const endLabel = item.isCurrent ? "Present" : item.endDate ?? "Unknown";

  return `${item.startDate} — ${endLabel}`;
}

export default function StudioExperiencePanel({
  token,
  hasToken,
}: StudioExperiencePanelProps) {
  const [items, setItems] = useState<StudioExperienceItem[]>([]);
  const [form, setForm] =
    useState<StudioExperienceFormState>(emptyExperienceForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const publicItems = useMemo(
    () => items.filter((item) => item.visibility === "public"),
    [items],
  );

  const labItems = useMemo(
    () => items.filter((item) => item.visibility === "lab"),
    [items],
  );

  const draftItems = useMemo(
    () => items.filter((item) => item.visibility === "draft"),
    [items],
  );

  async function loadExperience() {
    if (!hasToken) {
      setMessage("Add your Studio token first.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/studio/experience", {
        headers: getAuthHeaders(token),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Experience request failed: ${response.status}`);
      }

      const data = await response.json();

      setItems(data.items ?? []);
      setMessage("Experience loaded.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load experience.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasToken) {
      setMessage("Add your Studio token first.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/studio/experience", {
        method: "POST",
        headers: {
          ...getAuthHeaders(token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formToInput(form)),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ?? `Experience save failed: ${response.status}`,
        );
      }

      const data = await response.json();
      const nextItem = data.item as StudioExperienceItem;

      setItems((currentItems) => {
        const existingIndex = currentItems.findIndex(
          (item) => item.id === nextItem.id,
        );

        if (existingIndex < 0) {
          return [nextItem, ...currentItems];
        }

        return currentItems.map((item) =>
          item.id === nextItem.id ? nextItem : item,
        );
      });

      setForm(emptyExperienceForm);
      setMessage("Experience saved.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save experience.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!hasToken) {
      setMessage("Add your Studio token first.");
      return;
    }

    const confirmed = window.confirm("Delete this experience item?");

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/studio/experience?id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`Experience delete failed: ${response.status}`);
      }

      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      setMessage("Experience deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to delete experience.",
      );
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-blue-300">
              Resume / Experience
            </p>

            <h2 className="text-2xl font-black">Experience item</h2>

            <p className="mt-2 text-sm leading-6 text-white/50">
              Save work, education, certifications, project history, and
              volunteer experience separately from portfolio posts.
            </p>
          </div>

          {form.id && (
            <button
              type="button"
              onClick={() => setForm(emptyExperienceForm)}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/60 transition hover:bg-white hover:text-slate-950"
            >
              New Experience
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                Type
              </label>

              <select
                value={form.type}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    type: event.target.value as StudioExperienceType,
                  }))
                }
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
              >
                {experienceTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                Visibility
              </label>

              <select
                value={form.visibility}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    visibility: event.target.value as StudioExperienceVisibility,
                  }))
                }
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
              >
                <option value="draft">Private Draft</option>
                <option value="public">Public</option>
                <option value="lab">Lab / Konami</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                Sort Order
              </label>

              <input
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    sortOrder: event.target.value,
                  }))
                }
                placeholder="100"
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                Organization
              </label>

              <input
                value={form.organization}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    organization: event.target.value,
                  }))
                }
                required
                placeholder="Kilo Bite LLC"
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                Role / Title
              </label>

              <input
                value={form.role}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    role: event.target.value,
                  }))
                }
                required
                placeholder="Computer Technician"
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                Location
              </label>

              <input
                value={form.location}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    location: event.target.value,
                  }))
                }
                placeholder="Queens, NY"
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                Start Date
              </label>

              <input
                value={form.startDate}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    startDate: event.target.value,
                  }))
                }
                required
                placeholder="2021-12"
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                End Date
              </label>

              <input
                value={form.endDate}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    endDate: event.target.value,
                  }))
                }
                disabled={form.isCurrent}
                placeholder="2023-10"
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition focus:border-blue-300/60 disabled:opacity-40"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/70">
            <input
              type="checkbox"
              checked={form.isCurrent}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  isCurrent: event.target.checked,
                  endDate: event.target.checked ? "" : currentForm.endDate,
                }))
              }
            />
            This is a current role / experience
          </label>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
              Summary
            </label>

            <textarea
              value={form.summary}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  summary: event.target.value,
                }))
              }
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-blue-300/60"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
              Bullets
            </label>

            <textarea
              value={form.bullets}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  bullets: event.target.value,
                }))
              }
              rows={6}
              placeholder={"One bullet per line\nNo need to add bullet symbols"}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-blue-300/60"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
              Skills
            </label>

            <input
              value={form.skills}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  skills: event.target.value,
                }))
              }
              placeholder="Repair, Networking, Web Development"
              className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
              Related Focus
            </label>

            <input
              value={form.focusTags}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  focusTags: event.target.value,
                }))
              }
              placeholder="developer, it-technician, repair, networking"
              className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
            />

            <p className="mt-2 text-xs leading-5 text-white/35">
              Use: developer, it-technician, supervisor, operations, customer-support,
              field-operations, repair, networking, leadership.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-2xl bg-blue-300 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition hover:scale-[1.01] disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : form.id
                ? "Update Experience"
                : "Save Experience"}
          </button>
        </form>
      </section>

      <aside className="space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-blue-300">
                Experience Library
              </p>

              <h2 className="text-2xl font-black">{items.length} total</h2>
            </div>

            <button
              type="button"
              onClick={loadExperience}
              disabled={isLoading}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/60 transition hover:bg-white hover:text-slate-950 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Load"}
            </button>
          </div>

          {message && (
            <p className="mb-4 text-sm font-bold text-blue-100/80">{message}</p>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-3xl font-black">{publicItems.length}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-white/35">
                Public
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-3xl font-black">{labItems.length}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-white/35">
                Lab
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-3xl font-black">{draftItems.length}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-white/35">
                Draft
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
          <div className="mb-5">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-blue-300">
              Saved Experience
            </p>

            <h2 className="text-2xl font-black">Resume data</h2>
          </div>

          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-white/10 bg-black/25 p-5"
                >
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/45">
                      {item.type}
                    </span>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/45">
                      {item.visibility}
                    </span>
                  </div>

                  <h3 className="text-xl font-black">{item.role}</h3>

                  <p className="mt-1 text-sm font-bold text-blue-100/80">
                    {item.organization}
                  </p>

                  <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-white/35">
                    {getExperienceDateLabel(item)}
                  </p>

                  {item.summary && (
                    <p className="mt-3 text-sm leading-6 text-white/55">
                      {item.summary}
                    </p>
                  )}

                  {item.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white/45"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setForm(itemToForm(item));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-950"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-full border border-red-300/20 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-100/70 transition hover:bg-red-300 hover:text-slate-950"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
              <p className="text-lg font-black">No experience items yet.</p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/50">
                Load existing items or save your first resume / experience
                entry.
              </p>
            </div>
          )}
        </section>
      </aside>
    </div>
  );
}