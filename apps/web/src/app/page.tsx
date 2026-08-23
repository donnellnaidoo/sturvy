import { SneakerViewer } from "@/components/sneaker-viewer";
import { ScrollSplitHero } from "@/components/scroll-split-hero";
import { siteConfig, whatsappHref } from "@/lib/site-config";

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Inspection",
    desc: "Every pair is carefully inspected for stains, material type, damage, and the level of cleaning required. We choose the safest treatment for your sneakers.",
  },
  {
    n: "02",
    title: "Deep Clean",
    desc: "We use our professional-grade STURVY cleaning solution with specialist brushes and equipment to remove dirt, grime, and everyday stains from the upper, sole, and outsole.",
  },
  {
    n: "03",
    title: "Midsole Restoration",
    desc: "Stubborn scuffs and dark marks are treated using our professional midsole restoration products to bring back a cleaner, brighter finish.",
  },
  {
    n: "04",
    title: "Whitening Treatment",
    desc: "For white sneakers, we apply our whitening formula to restore brightness and reduce discoloration where appropriate.",
  },
  {
    n: "05",
    title: "Sole Brightening (if required)",
    desc: "Yellowed midsoles and outsoles receive a specialised unyellowing treatment to improve their appearance.",
  },
  {
    n: "06",
    title: "Final Quality Check",
    desc: "Every sneaker is inspected, wiped down, and finished before being returned to you looking its best.",
  },
];

const SERVICES = [
  {
    name: "Deep Clean",
    desc: "Full upper, lining, and insole clean — dirt, dust, and scuffs lifted without damaging materials.",
  },
  {
    name: "Sole Restoration & Whitening",
    desc: "Midsoles and outsoles brought back to bright white, yellowing and scuffs removed.",
  },
  {
    name: "Suede & Nubuck Care",
    desc: "Specialist dry-cleaning for delicate materials that water alone would ruin.",
  },
  {
    name: "Crease Removal",
    desc: "Heat and steam treatment to relax toe-box creases for a smoother finish.",
  },
  {
    name: "Odor Elimination",
    desc: "Antibacterial treatment that kills odor at the source, not just masks it.",
  },
  {
    name: "Protective Coating",
    desc: "Water- and stain-repellent coating applied after every clean, at no extra cost.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Book on WhatsApp",
    desc: "Send us a photo of your kicks and tell us what they need. We'll quote you in minutes.",
  },
  {
    step: "02",
    title: "We Collect or You Drop Off",
    desc: "Free pickup across Benoni and Ekurhuleni, or drop off at our studio.",
  },
  {
    step: "03",
    title: "Clean & Restore",
    desc: "Every pair is hand-cleaned and inspected in-house — no outsourcing.",
  },
  {
    step: "04",
    title: "Fresh Kicks, Delivered",
    desc: "Back on your feet within 48 hours, looking straight out the box.",
  },
];

const PRICING = [
  {
    name: "Basic Clean",
    price: "R150",
    desc: "For kicks that just need a refresh.",
    features: ["Upper & lining clean", "Lace clean or swap", "Deodorizing treatment"],
  },
  {
    name: "Signature Restore",
    price: "R280",
    desc: "Our most popular service.",
    features: [
      "Everything in Basic Clean",
      "Sole restoration & whitening",
      "Crease removal",
      "Protective coating",
    ],
    featured: true,
  },
  {
    name: "Full Detail",
    price: "R420",
    desc: "For suede, nubuck, or heavily worn pairs.",
    features: [
      "Everything in Signature Restore",
      "Suede & nubuck specialist care",
      "Yellowing removal (deep oxidation)",
      "48-hour priority turnaround",
    ],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Dropped off a pair of Air Force 1s I thought were done. Came back looking better than when I bought them.",
    name: "Thabo M.",
    area: "Benoni",
  },
  {
    quote:
      "Free pickup from Kempton Park made this so easy. Turnaround was exactly 48 hours like they said.",
    name: "Aisha K.",
    area: "Kempton Park",
  },
  {
    quote:
      "My suede Timbs needed real care, not just a wipe down. STURVY knew exactly what they were doing.",
    name: "Sipho N.",
    area: "Boksburg",
  },
];

function ProcessStepCard({
  n,
  title,
  desc,
  side,
}: {
  n: string;
  title: string;
  desc: string;
  side: "left" | "right";
}) {
  const isLeft = side === "left";
  return (
    <div
      className={`flex items-center gap-6 ${isLeft ? "" : "flex-row-reverse"}`}
    >
      <div className={isLeft ? "text-right" : "text-left"}>
        <span className="font-display text-2xl text-stone">{n}</span>
        <h3 className="mt-1 text-base font-medium text-ink">{title}</h3>
        <p className="mt-1 max-w-[260px] text-sm leading-6 text-mute">{desc}</p>
      </div>
      <span
        aria-hidden="true"
        className="relative hidden h-px w-20 shrink-0 bg-hairline xl:block"
      >
        <span
          className={`absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-hairline ${
            isLeft ? "right-0" : "left-0"
          }`}
        />
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <ScrollSplitHero />

      {/* Our Process */}
      <section
        id="process"
        className="mx-auto max-w-[1440px] scroll-mt-20 px-6 py-12"
      >
        <div className="text-center">
          <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
            Our Process
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-charcoal">
            Six steps, every pair, no shortcuts — drag the model to see the
            finish we bring back to every sneaker.
          </p>
        </div>

        {/* Desktop: radial layout around the model */}
        <div className="mt-16 hidden grid-cols-[1fr_auto_1fr] grid-rows-3 items-center gap-x-2 gap-y-14 xl:grid">
          <div className="col-start-1 row-start-1">
            <ProcessStepCard {...PROCESS_STEPS[0]} side="left" />
          </div>
          <div className="col-start-1 row-start-2">
            <ProcessStepCard {...PROCESS_STEPS[2]} side="left" />
          </div>
          <div className="col-start-1 row-start-3">
            <ProcessStepCard {...PROCESS_STEPS[4]} side="left" />
          </div>

          <div className="col-start-2 row-span-3 row-start-1 flex items-center justify-center">
            <div className="aspect-square w-[460px] bg-canvas">
              <SneakerViewer className="h-full w-full" />
            </div>
          </div>

          <div className="col-start-3 row-start-1">
            <ProcessStepCard {...PROCESS_STEPS[1]} side="right" />
          </div>
          <div className="col-start-3 row-start-2">
            <ProcessStepCard {...PROCESS_STEPS[3]} side="right" />
          </div>
          <div className="col-start-3 row-start-3">
            <ProcessStepCard {...PROCESS_STEPS[5]} side="right" />
          </div>
        </div>

        {/* Mobile / tablet: model up top, steps stacked below */}
        <div className="mt-12 xl:hidden">
          <div className="mx-auto aspect-square w-full max-w-sm bg-canvas">
            <SneakerViewer className="h-full w-full" />
          </div>
          <p className="mt-3 text-center text-xs text-mute">Drag to rotate.</p>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {PROCESS_STEPS.map((step) => (
              <div key={step.n}>
                <span className="font-display text-2xl text-stone">{step.n}</span>
                <h3 className="mt-1 text-base font-medium text-ink">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-mute">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="mx-auto max-w-[1440px] scroll-mt-20 px-6 py-12"
      >
        <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
          What We Do
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden bg-hairline-soft sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div key={service.name} className="bg-canvas p-8">
              <h3 className="text-lg font-medium text-ink">{service.name}</h3>
              <p className="mt-2 text-sm leading-6 text-mute">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 bg-soft-cloud">
        <div className="mx-auto max-w-[1440px] px-6 py-12">
          <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
            How It Works
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((item) => (
              <div key={item.step}>
                <span className="font-display text-3xl text-stone">{item.step}</span>
                <h3 className="mt-2 text-base font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-mute">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="mx-auto max-w-[1440px] scroll-mt-20 px-6 py-12"
      >
        <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
          Pricing
        </h2>
        <p className="mt-2 text-sm text-mute">
          Per pair. Multi-pair and subscription discounts available on request.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.featured
                  ? "flex flex-col bg-ink p-8 text-on-ink"
                  : "flex flex-col bg-soft-cloud p-8 text-ink"
              }
            >
              <h3 className="text-lg font-medium">{plan.name}</h3>
              <p
                className={
                  plan.featured ? "mt-1 text-sm text-stone" : "mt-1 text-sm text-mute"
                }
              >
                {plan.desc}
              </p>
              <p className="mt-6 font-display text-5xl">{plan.price}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm">
                    <span
                      className={
                        plan.featured ? "mr-2 text-success-bright" : "mr-2 text-success"
                      }
                    >
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappHref(
                  `Hi STURVY! I'd like to book the ${plan.name} service.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  plan.featured
                    ? "mt-8 flex h-12 items-center justify-center rounded-full bg-canvas text-sm font-medium text-ink"
                    : "mt-8 flex h-12 items-center justify-center rounded-full bg-ink text-sm font-medium text-on-ink"
                }
              >
                Book Now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="scroll-mt-20 bg-soft-cloud">
        <div className="mx-auto max-w-[1440px] px-6 py-12">
          <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
            What Benoni Says
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-canvas p-8">
                <p className="text-sm leading-6 text-charcoal">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-medium text-ink">
                  {t.name} <span className="font-normal text-mute">· {t.area}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section id="contact" className="scroll-mt-20 bg-ink">
        <div className="mx-auto max-w-[1440px] px-6 py-16 text-center">
          <h2 className="font-display text-5xl uppercase tracking-wide text-on-ink sm:text-6xl">
            Ready For Fresh Kicks?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-stone">
            Book a free pickup anywhere in {siteConfig.region}, or drop your pair at
            our {siteConfig.city} studio.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={whatsappHref("Hi STURVY! I'd like to book a sneaker clean.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center gap-2 rounded-full bg-whatsapp px-8 text-base font-medium text-on-ink"
            >
              WhatsApp Us
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex h-12 items-center rounded-full bg-canvas px-8 text-base font-medium text-ink"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
