import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { submitEnquiry } from "@/lib/content.functions";
import { Reveal } from "@/components/site/reveal";

const title = "Contact Nordbygg — Start a Construction Project";
const description =
  "Tell us about your site and get an honest read on buildability, programme and cost range within five working days. Nordbygg, Dronning Eufemias gate 16, Oslo.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ContactPage,
});

const projectTypes = [
  "Commercial new-build",
  "Residential new-build",
  "Renovation / refurbishment",
  "Design & build",
  "Project development",
  "Something else",
];

const budgets = ["Under 5 MNOK", "5–20 MNOK", "20–75 MNOK", "75 MNOK+", "Not sure yet"];

const fieldClass =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-accent";

function ContactPage() {
  const send = useServerFn(submitEnquiry);
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: (values: Record<string, string>) => send({ data: values as never }),
    onSuccess: () => {
      setDone(true);
      toast.success("Thanks — we'll be in touch within two working days.");
    },
    onError: (error: Error) => {
      toast.error(
        error.message.includes("email") || error.message.includes("String")
          ? "Please check your details — a valid email and a message of at least 10 characters are required."
          : "Something went wrong sending your enquiry. Please try again.",
      );
    },
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    mutation.mutate({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      project_type: String(form.get("project_type") ?? ""),
      budget: String(form.get("budget") ?? ""),
      message: String(form.get("message") ?? ""),
    });
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pt-14 pb-4 sm:px-8 sm:pt-20">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-3 max-w-3xl text-[clamp(2.25rem,6vw,4rem)] leading-[1] font-semibold">
        Tell us about the site
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Drawings, a sketch or just an address — whatever you have. We'll come back with an honest
        read on buildability, programme and a cost range.
      </p>

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal className="rounded-4xl border border-border bg-card p-7 sm:p-9">
          {done ? (
            <div className="py-16 text-center">
              <h2 className="text-2xl font-semibold">Enquiry received</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Thanks for getting in touch. A project manager will read this personally and reply
                within two working days.
              </p>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="mt-8 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-secondary"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Name
                </label>
                <input id="name" name="name" required minLength={2} className={fieldClass} />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email
                </label>
                <input id="email" name="email" type="email" required className={fieldClass} />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                  Phone
                </label>
                <input id="phone" name="phone" className={fieldClass} />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="project_type" className="mb-2 block text-sm font-medium">
                  Project type
                </label>
                <select id="project_type" name="project_type" className={fieldClass}>
                  {projectTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="budget" className="mb-2 block text-sm font-medium">
                  Indicative budget
                </label>
                <select id="budget" name="budget" className={fieldClass}>
                  {budgets.map((budget) => (
                    <option key={budget}>{budget}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="mb-2 block text-sm font-medium">
                  About the project
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  rows={6}
                  className={fieldClass}
                  placeholder="Location, size, timing and anything already drawn up."
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {mutation.isPending ? "Sending…" : "Send enquiry"} <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </Reveal>

        <Reveal delay={100} className="grid gap-4">
          <div className="rounded-4xl border border-border bg-secondary/50 p-8">
            <h2 className="text-xl font-semibold">Nordbygg AS</h2>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Dronning Eufemias gate 16, 0191 Oslo, Norway</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <a href="mailto:post@nordbygg.no" className="hover:underline">
                  post@nordbygg.no
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <a href="tel:+4722334455" className="hover:underline">
                  +47 22 33 44 55
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Monday–Friday, 07:00–16:00</span>
              </li>
            </ul>
          </div>

          <div className="rounded-4xl border border-border bg-ink p-8 text-ink-foreground">
            <h2 className="text-xl font-semibold">Already have tender documents?</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-foreground/70">
              Send them to{" "}
              <a href="mailto:tender@nordbygg.no" className="underline">
                tender@nordbygg.no
              </a>{" "}
              and we'll confirm whether we're bidding within three working days.
            </p>
          </div>

          <div className="rounded-4xl border border-border bg-card p-8">
            <h2 className="text-xl font-semibold">What happens next</h2>
            <ol className="mt-6 space-y-5">
              {[
                {
                  step: "1",
                  title: "We read everything you send",
                  text: "A project manager — not a bot — goes through your drawings, sketch or address within two working days.",
                },
                {
                  step: "2",
                  title: "Site walk-through",
                  text: "We visit the site with you to check access, ground conditions and anything the drawings don't show.",
                },
                {
                  step: "3",
                  title: "Honest read, in writing",
                  text: "Within five working days you get buildability, a realistic programme and a cost range. Free, no strings.",
                },
              ].map((item) => (
                <li key={item.step} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent font-display text-sm font-semibold text-accent-foreground">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
