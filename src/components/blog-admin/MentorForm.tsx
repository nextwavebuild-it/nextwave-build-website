import Link from "next/link";

export type MentorFormData = {
  id: string;
  name: string;
  slug: string;
  professional_title: string;
  biography: string;
  image_url: string | null;
  image_alt: string | null;
  programme_id: string | null;
  expertise: unknown;
  years_of_experience: number | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

export type MentorProgrammeOption = {
  id: string;
  name: string;
  is_active: boolean;
};

type Props = {
  mentor?: MentorFormData;
  programmes: MentorProgrammeOption[];
  action: (formData: FormData) => Promise<void>;
};

const input =
  "mt-2 w-full rounded-lg border border-white/15 bg-[#1c2022] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#D5FF66] focus:ring-1 focus:ring-[#D5FF66]/30";

const section = "space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6";

function Field({
  name,
  label,
  value = "",
  maxLength,
  required = false,
  rows,
  placeholder,
  help,
}: {
  name: string;
  label: string;
  value?: string;
  maxLength?: number;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  help?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}

      {required && <span className="ml-1 text-[#D5FF66]">*</span>}

      {rows ? (
        <textarea
          name={name}
          defaultValue={value}
          maxLength={maxLength}
          required={required}
          rows={rows}
          placeholder={placeholder}
          className={input}
        />
      ) : (
        <input
          type="text"
          name={name}
          defaultValue={value}
          maxLength={maxLength}
          required={required}
          placeholder={placeholder}
          className={input}
        />
      )}

      {help && (
        <span className="mt-2 block text-xs font-normal leading-6 text-white/45">
          {help}
        </span>
      )}
    </label>
  );
}

function expertiseToText(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .filter((item): item is string => typeof item === "string")
    .join("\n");
}

export default function MentorForm({ mentor, programmes, action }: Props) {
  return (
    <form action={action} className="space-y-6 text-white">
      {mentor && (
        <>
          <input type="hidden" name="id" value={mentor.id} />

          <input type="hidden" name="updated_at" value={mentor.updated_at} />
        </>
      )}

      {/* 1. PROFILE INFORMATION */}

      <section className={section}>
        <h2 className="text-xl font-semibold">1. Profile Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            name="name"
            label="Mentor name"
            value={mentor?.name}
            maxLength={120}
            required
            placeholder="Full name"
          />

          <Field
            name="slug"
            label="Mentor slug"
            value={mentor?.slug}
            maxLength={100}
            help="Automatically generated from the mentor name if left empty."
          />
        </div>

        <Field
          name="professional_title"
          label="Professional title"
          value={mentor?.professional_title}
          maxLength={180}
          placeholder="AI & Technology Mentor"
          help="Required before activating the profile."
        />

        <Field
          name="biography"
          label="Mentor biography"
          value={mentor?.biography}
          maxLength={5000}
          rows={7}
          help="Use verified professional information. Active profiles require at least 50 characters."
        />
      </section>

      {/* 2. PROFILE IMAGE */}

      <section className={section}>
        <h2 className="text-xl font-semibold">2. Profile Image</h2>

        {mentor?.image_url && (
          <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#202526]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mentor.image_url}
              alt={mentor.image_alt || mentor.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain"
            />
          </div>
        )}

        <Field
          name="image_url"
          label="Profile image URL"
          value={mentor?.image_url ?? ""}
          maxLength={2000}
          placeholder="https://..."
          help="Use an approved HTTPS image URL or a local website image path."
        />

        <Field
          name="image_alt"
          label="Image alternative text"
          value={mentor?.image_alt ?? ""}
          maxLength={180}
          placeholder="Portrait of the mentor"
          help="Required when a profile image is provided."
        />
      </section>

      {/* 3. PROGRAMME ASSIGNMENT */}

      <section className={section}>
        <h2 className="text-xl font-semibold">3. Programme Assignment</h2>

        <label className="block text-sm font-medium">
          Assigned programme
          <select
            name="programme_id"
            defaultValue={mentor?.programme_id ?? ""}
            className={input}
          >
            <option value="">General Mentor / No specific programme</option>

            {programmes.map((programme) => (
              <option key={programme.id} value={programme.id}>
                {programme.name}
                {!programme.is_active ? " (Inactive)" : ""}
              </option>
            ))}
          </select>
          <span className="mt-2 block text-xs leading-6 text-white/45">
            An active mentor assigned to a programme is publicly visible only
            while that programme is also active.
          </span>
        </label>
      </section>

      {/* 4. EXPERTISE AND EXPERIENCE */}

      <section className={section}>
        <h2 className="text-xl font-semibold">4. Expertise and Experience</h2>

        <Field
          name="expertise"
          label="Areas of expertise"
          value={expertiseToText(mentor?.expertise)}
          rows={6}
          placeholder={
            "Artificial Intelligence\nWorkflow Automation\nDigital Tools"
          }
          help="Enter one expertise item per line. Maximum 20 items."
        />

        <label className="block text-sm font-medium">
          Years of experience
          <input
            type="number"
            name="years_of_experience"
            min={0}
            max={80}
            step={1}
            defaultValue={mentor?.years_of_experience ?? ""}
            className={input}
          />
          <span className="mt-2 block text-xs text-white/45">
            Optional. Leave blank if not verified.
          </span>
        </label>
      </section>

      {/* 5. DISPLAY SETTINGS */}

      <section className={section}>
        <h2 className="text-xl font-semibold">5. Display Settings</h2>

        <label className="block text-sm font-medium">
          Display order
          <input
            type="number"
            name="sort_order"
            min={0}
            max={9999}
            step={1}
            required
            defaultValue={mentor?.sort_order ?? 0}
            className={input}
          />
          <span className="mt-2 block text-xs text-white/45">
            Lower numbers appear first.
          </span>
        </label>

        <label className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={mentor?.is_active ?? false}
            className="mt-1 h-5 w-5 shrink-0 accent-[#D5FF66]"
          />

          <div>
            <p className="text-sm font-semibold">Active mentor profile</p>

            <p className="mt-2 text-xs leading-6 text-white/50">
              Enable public visibility only after verifying the mentor
              information and obtaining approval to publish their profile.
            </p>
          </div>
        </label>
      </section>

      {/* FORM ACTIONS */}

      <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/15 bg-[#101214] p-4 shadow-xl">
        <Link
          href="/blog-admin/mentors"
          className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white/70 hover:text-white"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-lg !bg-[#D5FF66] px-7 py-3 text-sm font-semibold !text-[#101214] hover:!bg-[#C5EF53]"
        >
          {mentor ? "Save Mentor" : "Create Mentor"}
        </button>
      </div>
    </form>
  );
}
