import Link from "next/link";

export type ProgrammeFormData = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image_url: string | null;
  image_alt: string | null;
  programme_url: string;
  price_minor: number | null;
  original_price_minor: number | null;
  currency: string;
  duration: string | null;
  learning_format: string | null;
  skill_level: string | null;
  features: unknown;
  learning_outcomes: unknown;
  cta_label: string;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

type Props = {
  programme?: ProgrammeFormData;
  action: (formData: FormData) => Promise<void>;
};

const input =
  "mt-2 w-full rounded-lg border border-white/15 bg-[#1c2022] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#D5FF66] focus:ring-1 focus:ring-[#D5FF66]/30";

const section = "space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6";

function listToText(value: unknown): string {
  if (!Array.isArray(value)) return "";

  return value
    .filter((item): item is string => typeof item === "string")
    .join("\n");
}

function priceToInput(
  amount: number | null | undefined,
  currency: string,
): string {
  if (amount === null || amount === undefined) {
    return "";
  }

  try {
    const digits =
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).resolvedOptions().maximumFractionDigits ?? 2;

    return (amount / 10 ** digits).toFixed(digits);
  } catch {
    return "";
  }
}

function FormField({
  name,
  label,
  value = "",
  maxLength,
  placeholder,
  required = false,
  rows,
  help,
}: {
  name: string;
  label: string;
  value?: string;
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
  rows?: number;
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
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={input}
        />
      ) : (
        <input
          type="text"
          name={name}
          defaultValue={value}
          maxLength={maxLength}
          placeholder={placeholder}
          required={required}
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

export default function ProgrammeForm({ programme, action }: Props) {
  const isEditing = Boolean(programme);
  const currency = programme?.currency ?? "USD";

  return (
    <form action={action} className="space-y-6 text-white">
      {programme && (
        <>
          <input type="hidden" name="id" value={programme.id} />

          <input type="hidden" name="updated_at" value={programme.updated_at} />
        </>
      )}

      {/* 1. BASIC INFORMATION */}

      <section className={section}>
        <h2 className="text-xl font-semibold">1. Programme Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            name="name"
            label="Programme name"
            value={programme?.name}
            maxLength={180}
            required
            placeholder="AI & Technology"
          />

          <FormField
            name="slug"
            label="Programme slug"
            value={programme?.slug}
            maxLength={100}
            placeholder="technology-ai"
            help="Automatically generated from the name if left empty."
          />
        </div>

        <FormField
          name="short_description"
          label="Short description"
          value={programme?.short_description}
          maxLength={1000}
          rows={4}
          help="Used on geographic programme cards. Active programmes require at least 30 characters."
        />

        <FormField
          name="description"
          label="Full programme description"
          value={programme?.description}
          maxLength={15000}
          rows={8}
          help="Extended programme information stored in the shared catalog."
        />

        <FormField
          name="programme_url"
          label="Programme page URL"
          value={programme?.programme_url}
          required
          maxLength={112}
          placeholder="/programmes/technology-ai"
          help="Use an existing internal programme page URL."
        />
      </section>

      {/* 2. PROGRAMME IMAGE */}

      <section className={section}>
        <h2 className="text-xl font-semibold">2. Programme Image</h2>

        <FormField
          name="image_url"
          label="Image URL"
          value={programme?.image_url ?? ""}
          maxLength={2000}
          placeholder="https://..."
          help="Supports HTTPS image URLs and local website image paths."
        />

        <FormField
          name="image_alt"
          label="Image alternative text"
          value={programme?.image_alt ?? ""}
          maxLength={180}
          placeholder="Students learning artificial intelligence"
          help="Required when an image URL is provided."
        />
      </section>

      {/* 3. PRICING */}

      <section className={section}>
        <h2 className="text-xl font-semibold">3. Programme Pricing</h2>

        <div className="rounded-lg border border-yellow-500/25 bg-yellow-500/5 p-4 text-sm leading-7 text-yellow-100">
          These prices are for website display only. Updating them does not
          change Stripe or payment system pricing. Verify the actual programme
          prices before publishing.
        </div>

        <label className="block text-sm font-medium">
          Currency
          <select name="currency" defaultValue={currency} className={input}>
            <option value="USD">USD — US Dollar</option>
            <option value="AED">AED — UAE Dirham</option>
            <option value="SAR">SAR — Saudi Riyal</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — British Pound</option>
          </select>
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Current price
            <input
              type="number"
              name="price"
              min="0"
              max="21474836.47"
              step="0.01"
              defaultValue={priceToInput(programme?.price_minor, currency)}
              placeholder="799.00"
              className={input}
            />
            <span className="mt-2 block text-xs text-white/45">
              Leave empty to hide the price.
            </span>
          </label>

          <label className="block text-sm font-medium">
            Original price
            <input
              type="number"
              name="original_price"
              min="0"
              max="21474836.47"
              step="0.01"
              defaultValue={priceToInput(
                programme?.original_price_minor,
                currency,
              )}
              placeholder="999.00"
              className={input}
            />
            <span className="mt-2 block text-xs text-white/45">
              Optional. Only enter a genuine original price.
            </span>
          </label>
        </div>
      </section>

      {/* 4. COURSE DETAILS */}

      <section className={section}>
        <h2 className="text-xl font-semibold">4. Course Details</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            name="duration"
            label="Programme duration"
            value={programme?.duration ?? ""}
            maxLength={120}
            placeholder="12 weeks"
          />

          <FormField
            name="learning_format"
            label="Learning format"
            value={programme?.learning_format ?? "Online Mentor-Led Training"}
            maxLength={180}
            placeholder="Online Mentor-Led Training"
          />

          <FormField
            name="skill_level"
            label="Skill level"
            value={programme?.skill_level ?? ""}
            maxLength={120}
            placeholder="Beginner"
          />
        </div>
      </section>

      {/* 5. FEATURES AND OUTCOMES */}

      <section className={section}>
        <h2 className="text-xl font-semibold">
          5. Features and Learning Outcomes
        </h2>

        <FormField
          name="features"
          label="Programme features"
          value={listToText(programme?.features)}
          rows={8}
          placeholder={
            "Live mentor-led sessions\nPractical assignments\nHands-on projects"
          }
          help="Enter one feature per line. Maximum 30 features and 500 characters per feature."
        />

        <FormField
          name="learning_outcomes"
          label="Learning outcomes"
          value={listToText(programme?.learning_outcomes)}
          rows={8}
          placeholder={
            "Understand AI fundamentals\nBuild practical AI projects\nDevelop automation skills"
          }
          help="Enter one learning outcome per line. Maximum 30 outcomes and 500 characters per outcome."
        />
      </section>

      {/* 6. DISPLAY SETTINGS */}

      <section className={section}>
        <h2 className="text-xl font-semibold">6. Display Settings</h2>

        <FormField
          name="cta_label"
          label="CTA button text"
          value={programme?.cta_label ?? "Explore Programme"}
          maxLength={60}
        />

        <label className="block text-sm font-medium">
          Display order
          <input
            type="number"
            name="sort_order"
            min={0}
            max={9999}
            step={1}
            defaultValue={programme?.sort_order ?? 0}
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
            defaultChecked={programme?.is_active ?? false}
            className="mt-1 h-5 w-5 shrink-0 accent-[#D5FF66]"
          />

          <div>
            <p className="text-sm font-semibold">Active programme</p>

            <p className="mt-2 text-xs leading-6 text-white/50">
              Make this programme available to V3 country and city pages. Keep
              inactive until all information has been verified.
            </p>
          </div>
        </label>
      </section>

      {/* FORM ACTIONS */}

      <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/15 bg-[#101214] p-4 shadow-xl">
        <Link
          href="/blog-admin/programmes"
          className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white/70 hover:text-white"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-lg bg-[#D5FF66] px-7 py-3 text-sm font-semibold !text-[#101214] transition-colors hover:bg-[#C5EF53]"
        >
          {isEditing ? "Save Programme" : "Create Programme"}
        </button>
      </div>
    </form>
  );
}
