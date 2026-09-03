import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  checkAdmin,
  deleteEnquiry,
  deleteProject,
  deleteService,
  listEnquiries,
  saveProject,
  saveService,
} from "@/lib/admin.functions";
import { listProjects, listServices } from "@/lib/content.functions";
import { imageKeys } from "@/lib/images";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Content admin — Nordbygg" },
      { name: "description", content: "Manage Nordbygg projects, services and client enquiries." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const fieldClass =
  "w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent";

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return <div className="mx-auto max-w-md px-5 py-24 text-center text-muted-foreground">Loading…</div>;
  }

  if (!session) return <SignIn />;
  return <Dashboard email={session.user.email ?? ""} />;
}

function SignIn() {
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    setPending(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);
    if (error) toast.error(error.message);
  }

  return (
    <section className="mx-auto max-w-md px-5 py-20">
      <h1 className="text-3xl font-semibold">Client portal</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to manage projects, services and enquiries.
      </p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <input id="password" name="password" type="password" required className={fieldClass} />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </section>
  );
}

const tabs = ["Enquiries", "Projects", "Services"] as const;

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Enquiries");
  const admin = useQuery({ queryKey: ["is-admin"], queryFn: () => checkAdmin() });

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-semibold">Content admin</h1>
          <p className="truncate text-sm text-muted-foreground">{email}</p>
        </div>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="shrink-0 rounded-full border border-border px-5 py-2.5 text-sm hover:bg-secondary"
        >
          Sign out
        </button>
      </header>

      {admin.isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Checking access…</p>
      ) : admin.data?.isAdmin ? (
        <>
          <nav className="mt-8 flex flex-wrap gap-2">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  "rounded-full border border-border px-5 py-2.5 text-sm",
                  tab === item ? "bg-ink text-ink-foreground" : "bg-card hover:bg-secondary",
                )}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="mt-8">
            {tab === "Enquiries" ? <EnquiriesPanel /> : null}
            {tab === "Projects" ? <ProjectsPanel /> : null}
            {tab === "Services" ? <ServicesPanel /> : null}
          </div>
        </>
      ) : (
        <div className="mt-10 rounded-3xl border border-border bg-card p-8">
          <h2 className="text-xl font-semibold">No admin access on this account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This account is signed in but has not been granted the admin role, so content and
            enquiries stay hidden.
          </p>
        </div>
      )}
    </section>
  );
}

function EnquiriesPanel() {
  const queryClient = useQueryClient();
  const fetchEnquiries = useServerFn(listEnquiries);
  const remove = useServerFn(deleteEnquiry);
  const { data, isLoading } = useQuery({ queryKey: ["enquiries"], queryFn: () => fetchEnquiries() });

  const mutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Enquiry deleted");
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
    onError: () => toast.error("Could not delete that enquiry"),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading enquiries…</p>;
  if (!data?.length) return <p className="text-sm text-muted-foreground">No enquiries yet.</p>;

  return (
    <ul className="grid gap-3">
      {data.map((enquiry) => (
        <li key={enquiry.id} className="rounded-3xl border border-border bg-card p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold">{enquiry.name}</h3>
              <p className="truncate text-sm text-muted-foreground">
                {enquiry.email} {enquiry.phone ? `· ${enquiry.phone}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => mutation.mutate(enquiry.id)}
              aria-label="Delete enquiry"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border hover:bg-secondary"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-sm">{enquiry.message}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            {enquiry.project_type} · {enquiry.budget} ·{" "}
            {new Date(enquiry.created_at).toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  );
}

type ProjectRow = Awaited<ReturnType<typeof listProjects>>[number];

function ProjectsPanel() {
  const queryClient = useQueryClient();
  const save = useServerFn(saveProject);
  const remove = useServerFn(deleteProject);
  const { data } = useQuery({ queryKey: ["projects"], queryFn: () => listProjects() });
  const [editing, setEditing] = useState<ProjectRow | null>(null);

  const saveMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) => save({ data: values as never }),
    onSuccess: () => {
      toast.success("Project saved");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    saveMutation.mutate({
      id: editing?.id,
      slug: String(form.get("slug")),
      title: String(form.get("title")),
      category: String(form.get("category")),
      summary: String(form.get("summary")),
      body: String(form.get("body")),
      location: String(form.get("location")),
      client: String(form.get("client")),
      scope: String(form.get("scope")),
      completed_on: String(form.get("completed_on")),
      image_key: String(form.get("image_key")),
      featured: form.get("featured") === "on",
      sort_order: Number(form.get("sort_order") || 0),
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="truncate text-xl font-semibold">Projects</h2>
          <button
            type="button"
            onClick={() => setEditing({ id: "" } as ProjectRow)}
            className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            New project
          </button>
        </div>
        <ul className="mt-4 grid gap-3">
          {data?.map((project) => (
            <li
              key={project.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-border bg-card p-5"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{project.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {project.category} · /{project.slug}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(project)}
                  className="rounded-full border border-border px-4 py-2 text-xs hover:bg-secondary"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(project.id)}
                  aria-label="Delete project"
                  className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-secondary"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editing ? (
        <form onSubmit={onSubmit} className="grid gap-3 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">{editing.id ? "Edit project" : "New project"}</h2>
          <Field name="title" label="Title" defaultValue={editing.title} required />
          <Field name="slug" label="Slug" defaultValue={editing.slug} required />
          <Field name="category" label="Category" defaultValue={editing.category ?? "Commercial"} required />
          <Field name="summary" label="Summary" defaultValue={editing.summary} textarea />
          <Field name="body" label="Description" defaultValue={editing.body} textarea />
          <Field name="location" label="Location" defaultValue={editing.location} />
          <Field name="client" label="Client" defaultValue={editing.client} />
          <Field name="scope" label="Scope" defaultValue={editing.scope} />
          <Field name="completed_on" label="Completed" defaultValue={editing.completed_on} />
          <div>
            <label htmlFor="image_key" className="mb-2 block text-sm font-medium">
              Image
            </label>
            <select
              id="image_key"
              name="image_key"
              defaultValue={editing.image_key ?? "harbor"}
              className={fieldClass}
            >
              {imageKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <Field
            name="sort_order"
            label="Sort order"
            type="number"
            defaultValue={String(editing.sort_order ?? 0)}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={editing.featured ?? false} />
            Featured on the home page
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground disabled:opacity-60"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-full border border-border px-6 py-3 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

type ServiceRow = Awaited<ReturnType<typeof listServices>>[number];

function ServicesPanel() {
  const queryClient = useQueryClient();
  const save = useServerFn(saveService);
  const remove = useServerFn(deleteService);
  const { data } = useQuery({ queryKey: ["services"], queryFn: () => listServices() });
  const [editing, setEditing] = useState<ServiceRow | null>(null);

  const saveMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) => save({ data: values as never }),
    onSuccess: () => {
      toast.success("Service saved");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Service deleted");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    saveMutation.mutate({
      id: editing?.id,
      slug: String(form.get("slug")),
      title: String(form.get("title")),
      blurb: String(form.get("blurb")),
      body: String(form.get("body")),
      icon: String(form.get("icon")),
      sort_order: Number(form.get("sort_order") || 0),
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="truncate text-xl font-semibold">Services</h2>
          <button
            type="button"
            onClick={() => setEditing({ id: "" } as ServiceRow)}
            className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            New service
          </button>
        </div>
        <ul className="mt-4 grid gap-3">
          {data?.map((service) => (
            <li
              key={service.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-border bg-card p-5"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{service.title}</p>
                <p className="truncate text-xs text-muted-foreground">/{service.slug}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(service)}
                  className="rounded-full border border-border px-4 py-2 text-xs hover:bg-secondary"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(service.id)}
                  aria-label="Delete service"
                  className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-secondary"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editing ? (
        <form onSubmit={onSubmit} className="grid gap-3 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">{editing.id ? "Edit service" : "New service"}</h2>
          <Field name="title" label="Title" defaultValue={editing.title} required />
          <Field name="slug" label="Slug" defaultValue={editing.slug} required />
          <Field name="blurb" label="Short blurb" defaultValue={editing.blurb} textarea />
          <Field name="body" label="Description" defaultValue={editing.body} textarea />
          <Field name="icon" label="Icon key" defaultValue={editing.icon ?? "hammer"} />
          <Field
            name="sort_order"
            label="Sort order"
            type="number"
            defaultValue={String(editing.sort_order ?? 0)}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground disabled:opacity-60"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-full border border-border px-6 py-3 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
  textarea,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  textarea?: boolean;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          defaultValue={defaultValue ?? ""}
          className={fieldClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue ?? ""}
          className={fieldClass}
        />
      )}
    </div>
  );
}
