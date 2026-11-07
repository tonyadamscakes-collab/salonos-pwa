import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { applyTierMultiplier, formatDateTimeUK, formatGBP } from "../domain/money";
import { formatDuration, londonDayKey } from "../domain/time";
import { salon, type GuestIntent, type ShopIntent } from "../data/session";
import type { ServiceRecord } from "../data/model";
import { DRAFT } from "./legal";
import { ShopTrail } from "./nav";
import { HeroPhoto, Photo } from "./Photo";
import { OPTIONS, treatmentShot, treatmentShots, productShot, avatarFor, HERO, shotFile, categoryShot } from "./photos";

function priceLabel(service: ServiceRecord): string {
  if (service.priceType === "quote" || service.priceType === "monthly" || service.basePence == null) {
    return service.priceType === "monthly" ? "[PRICE] a month" : "Prices on request";
  }
  if (service.priceType === "range" && service.rangeMinPence != null && service.rangeMaxPence != null) {
    return `${formatGBP(service.rangeMinPence)}–${formatGBP(service.rangeMaxPence)}`;
  }
  if (service.priceType === "fixed") return formatGBP(service.basePence);
  const junior = applyTierMultiplier(service.basePence, 0.85);
  const director = applyTierMultiplier(service.basePence, 1.4);
  return `from ${formatGBP(junior)} to ${formatGBP(director)}`;
}

const FEATURED = ["a1", "a12", "a28", "a23", "a41", "a7", "a3", "a45"];

const BOOK_CATEGORIES = [
  "Hair – Cutting & Styling",
  "Hair – Colour & Chemical",
  "Hair – Treatments",
  "Beauty – Brows & Lashes",
  "Beauty – Nails",
  "Beauty – Waxing",
  "Beauty – Facials",
  "Packages",
] as const;

function categoryLabel(category: string): string {
  if (category.includes("Cutting")) return "Cuts and styling";
  if (category.includes("Colour")) return "Colour";
  if (category.includes("Treatment")) return "Hair treatments";
  if (category.includes("Brow")) return "Brows and lashes";
  if (category.includes("Nail")) return "Nails";
  if (category.includes("Wax")) return "Waxing";
  if (category.includes("Facial")) return "Facials";
  if (category === "Packages") return "Packages and make-up";
  return category;
}

const GRID_FILLERS = [
  { key: "ask", title: "Can't see it? Ask us", text: "Tell us what you want. Quote-only work starts as an enquiry.", to: "/enquiry", shot: OPTIONS.consult },
  { key: "offers", title: "Current offers", text: "One offer per booking. The discount comes off before the deposit.", to: "/book", shot: OPTIONS.offers },
  { key: "visit", title: "Visit the salon", text: "[SALON ADDRESS]", to: "/", shot: OPTIONS.careers },
];

function padTiles(count: number) {
  const missing = (4 - (count % 4)) % 4;
  return GRID_FILLERS.slice(0, missing);
}

export function Home() {
  const services = salon.publicData?.services ?? [];
  const featured = FEATURED.map((id) => services.find((row) => row.id === id)).filter((row): row is ServiceRecord => !!row);
  const staff = (salon.publicData?.staff ?? []).filter((person) => person.active);
  const stylists = staff.slice(0, 6);
  return (
    <>
      <section className="hero">
        <HeroPhoto />
        <div className="hero-copy">
          <p className="kicker">High-street hair and beauty</p>
          <h1>SalonOS</h1>
          <p>Book the treatment, your regular artist, and the products you want. The same diary the shop uses.</p>
          <div className="hero-actions">
            <Link className="btn" to="/book">Book a treatment</Link>
            <Link className="btn" to="/shop">Shop the edit</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Featured treatments</h2>
        <p className="lede">Eight ways in. Pick one and we only show times long enough for it. Prices follow the stylist’s tier, or stay Prices on request.</p>
        <div className="tiles">
          {featured.map((service, index) => (
            <Link key={service.id} className="shot" to={service.priceType === "quote" ? `/enquiry?service=${service.id}` : `/book/treatment?service=${service.id}`}>
              <Photo shot={treatmentShot(service.name, service.category, index)} alt="" sizes="(max-width: 980px) 50vw, 25vw" />
              <div>
                <h3>{service.name}</h3>
                <p className="muted">{service.durationMin ? `about ${formatDuration(service.durationMin)}` : "Duration not set"}</p>
                <p className="price">{priceLabel(service)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Treatments</h2>
        <p className="lede">The locked menu, one tile per category. Add-ons are chosen later in the booking. Further names, including manicures, pedicures, nail art and make-up, stay in the staff catalogue until the salon accepts them. No price is filled in for those.</p>
        <div className="tiles">
          {BOOK_CATEGORIES.map((category) => {
            const count = services.filter((row) => row.source === "brief" && row.category === category && !["a47", "a48", "a49", "a50"].includes(row.id)).length;
            return (
              <Link key={category} className="shot" to={`/book/treatment?category=${encodeURIComponent(category)}`}>
                <Photo className="tile-photo" shot={categoryShot(category)} alt="" sizes="(max-width: 980px) 50vw, 25vw" />
                <div>
                  <h3>{categoryLabel(category)}</h3>
                  <p className="muted">{count} on the bookable menu</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section">
        <h2>Start wherever you like</h2>
        <p className="lede">Eight doors, two or four across, so nothing sits on its own.</p>
        <div className="tiles">
          <Link className="shot" to="/book"><Photo shot={OPTIONS.stylist} alt="" /><div><h3>Choose your stylist</h3><p className="muted">Your regular, or anyone qualified.</p></div></Link>
          <Link className="shot" to="/book"><Photo shot={OPTIONS.offers} alt="" /><div><h3>Special offers</h3><p className="muted">One offer per booking. Code SAMPLE10.</p></div></Link>
          <Link className="shot" to="/enquiry"><Photo shot={OPTIONS.home} alt="" /><div><h3>Home visits</h3><p className="muted">Travel fee [TRAVEL FEE – Tony to set].</p></div></Link>
          <Link className="shot" to="/enquiry"><Photo shot={OPTIONS.wedding} alt="" /><div><h3>Weddings</h3><p className="muted">An enquiry first. Quote only until we price it.</p></div></Link>
          <Link className="shot" to="/shop"><Photo shot={OPTIONS.shop} alt="" /><div><h3>Online shop</h3><p className="muted">Only what the salon flags for the web.</p></div></Link>
          <Link className="shot" to="/shop"><Photo shot={OPTIONS.delivery} alt="" /><div><h3>Delivery</h3><p className="muted">[SHIPPING RATE – Tony to set], or collect free.</p></div></Link>
          <Link className="shot" to="/club"><Photo shot={OPTIONS.loyalty} alt="" /><div><h3>Loyalty club</h3><p className="muted">Free to join. Marketing stays unticked.</p></div></Link>
          <Link className="shot" to="/vouchers"><Photo shot={OPTIONS.vouchers} alt="" /><div><h3>Gift vouchers</h3><p className="muted">In the shop only. Not sold online.</p></div></Link>
        </div>
      </section>

      <section className="section band">
        <Photo shot={OPTIONS.events} alt="" sizes="(max-width: 980px) 100vw, 50vw" />
        <div className="copy">
          <h2>Offers</h2>
          <ul>
            <li>One offer on a booking. A second code is refused.</li>
            <li>The discount is taken off before the deposit.</li>
            <li>SAMPLE10 is a sample 10% code, not a price list.</li>
          </ul>
          <Link className="btn" to="/book">Use an offer</Link>
        </div>
      </section>

      <section className="section">
        <h2>Choose your stylist</h2>
        <p className="lede">SAMPLE team. Avatars are placeholders, not likenesses. Eight places, four across, so the row stays even.</p>
        <div className="people">
          {stylists.map((person) => (
            <Link key={person.id} className="shot" to="/book">
              <Photo shot={avatarFor(person.id)} alt="" className="avatar" sizes="(max-width: 980px) 40vw, 180px" />
              <div>
                <h3>{person.name}</h3>
                <p className="muted">{person.tier}</p>
              </div>
            </Link>
          ))}
          <Link className="shot" to="/book">
            <Photo shot={OPTIONS.about} alt="" />
            <div><h3>Anyone qualified</h3><p className="muted">We will not swap your regular without asking.</p></div>
          </Link>
          <Link className="shot" to="/book">
            <Photo shot={OPTIONS.consult} alt="" />
            <div><h3>Consultation</h3><p className="muted">Patch tests sit on the same client card.</p></div>
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Weddings and home visits</h2>
        <div className="pair">
          <Link className="shot" to="/enquiry">
            <Photo shot={shotFile("treatment-bridal.webp", "Bridal hair styled from behind")} alt="" sizes="(max-width: 980px) 100vw, 50vw" />
            <div><h3>Wedding party</h3><p>Date, venue, party size, trial. The salon is the contracting party. LEG-22.</p></div>
          </Link>
          <Link className="shot" to="/enquiry">
            <Photo shot={shotFile("home-kit.webp", "Stylist kit bag and a mirror in a living room, no people")} alt="" sizes="(max-width: 980px) 100vw, 50vw" />
            <div><h3>At your address</h3><p>Postcode zone first. Travel fee stays [TRAVEL FEE – Tony to set].</p></div>
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Shop and delivery</h2>
        <div className="pair">
          <Link className="shot" to="/shop">
            <Photo shot={shotFile("product-shampoo-conditioner.webp", "Unbranded shampoo and conditioner")} alt="" sizes="(max-width: 980px) 100vw, 50vw" />
            <div><h3>Mail order</h3><p>Same stock as the till. New products stay in-shop until the salon says otherwise.</p></div>
          </Link>
          <Link className="shot" to="/shop">
            <Photo shot={shotFile("product-styling.webp", "Unbranded styling products")} alt="" sizes="(max-width: 980px) 100vw, 50vw" />
            <div><h3>Click and collect</h3><p>Free to collect. Delivery rate [SHIPPING RATE – Tony to set].</p></div>
          </Link>
        </div>
      </section>

      <section className="section band">
        <Photo shot={shotFile("membership-card.webp", "Blank pink membership card")} alt="" sizes="(max-width: 980px) 100vw, 40vw" />
        <div className="copy">
          <h2>Loyalty club</h2>
          <ul>
            <li>Free to join. The club is not the paid Monthly Membership.</li>
            <li>One point per £1 after the visit is paid in full.</li>
            <li>Marketing boxes stay unticked until you choose them.</li>
          </ul>
          <Link className="btn" to="/club">Join free</Link>
        </div>
      </section>

      <section className="section band">
        <Photo shot={shotFile("product-gift-sets.webp", "Unbranded beauty gift set")} alt="" sizes="(max-width: 980px) 100vw, 40vw" />
        <div className="copy">
          <h2>Gift vouchers, in the shop</h2>
          <ul>
            <li>Sold at the till. Not available to buy online.</li>
            <li>VAT stays [VOUCHER VAT TREATMENT – adviser to confirm].</li>
            <li>No expiry is hard-coded.</li>
          </ul>
          <Link className="btn" to="/vouchers">How vouchers work</Link>
        </div>
      </section>

      <section className="section quote-box">
        <h2>What clients say</h2>
        <p className="ph">[TESTIMONIAL]</p>
        <p className="muted">No review is shown until the salon adds one. Nothing here is invented.</p>
      </section>

      <section className="section band">
        <Photo shot={HERO.interior} alt="" sizes="(max-width: 980px) 100vw, 50vw" />
        <div className="copy">
          <h2>Visit us</h2>
          <ul>
            <li>[SALON NAME]</li>
            <li>[SALON ADDRESS]</li>
            <li>Map placeholder. No address is set, so no map is drawn.</li>
          </ul>
          <Link className="btn" to="/book">Book before you come in</Link>
        </div>
      </section>
    </>
  );
}

export function ServicePage() {
  const { id } = useParams();
  const service = salon.publicData?.services.find((row) => row.id === id);
  if (!service) return <p>That treatment is not on the list.</p>;
  const tiers = (["junior", "stylist", "senior", "director"] as const).map((tier) => ({
    tier,
    pence: service.basePence == null || service.priceType === "quote" ? null : service.priceType === "fixed" ? service.basePence : applyTierMultiplier(service.basePence, { junior: 0.85, stylist: 1, senior: 1.2, director: 1.4 }[tier]),
  }));
  return (
    <article className="card">
      <Photo shot={treatmentShot(service.name, service.category)} sizes="(max-width: 720px) 100vw, 720px" />
      <p className="muted">{service.category}</p>
      <h1>{service.name}</h1>
      <p>{service.durationMin ? formatDuration(service.durationMin) : "Duration not set"}</p>
      <p className="price">{priceLabel(service)}</p>
      <p className="muted">{service.photoNote || "No photo yet."}</p>
      {service.priceType === "tier" && (
        <ul>
          {tiers.map((tier) => (
            <li key={tier.tier}>{tier.tier}: {tier.pence == null ? "Prices on request" : formatGBP(tier.pence)}</li>
          ))}
        </ul>
      )}
      {service.priceType === "quote" ? (
        <Link className="btn" to={`/enquiry?service=${service.id}`}>Request a quote</Link>
      ) : (
        <Link className="btn" to={`/book/treatment?service=${service.id}`}>Book this treatment</Link>
      )}
    </article>
  );
}

const BOOK_STEPS = [
  { slug: "treatment", label: "Treatment" },
  { slug: "product", label: "Product" },
  { slug: "artist", label: "Artist" },
  { slug: "time", label: "Time" },
  { slug: "extras", label: "Extras" },
  { slug: "checkout", label: "Checkout" },
] as const;

export function Book() {
  const [params] = useSearchParams();
  const { step: stepSlug } = useParams();
  const navigate = useNavigate();
  const services = salon.publicData?.services ?? [];
  const bookable = services.filter((row) => row.active && row.accepted && row.source === "brief" && !["a47", "a48", "a49", "a50"].includes(row.id));
  const category = params.get("category") ?? "";
  const stepIndex = Math.max(0, BOOK_STEPS.findIndex((item) => item.slug === stepSlug));
  const slug = BOOK_STEPS[stepIndex]?.slug ?? "treatment";
  const [serviceId, setServiceId] = useState(params.get("service") ?? "");
  useEffect(() => {
    if (stepSlug && BOOK_STEPS.some((item) => item.slug === stepSlug)) return;
    const service = params.get("service");
    navigate(`/book/treatment${service ? `?service=${service}` : ""}`, { replace: true });
  }, [stepSlug, navigate, params]);
  useEffect(() => {
    const fromUrl = params.get("service");
    if (fromUrl) setServiceId(fromUrl);
  }, [params]);
  function go(index: number) {
    const next = BOOK_STEPS[index];
    if (!next) return;
    const query = serviceId ? `?service=${serviceId}` : "";
    navigate(`/book/${next.slug}${query}`);
  }
  const [addons, setAddons] = useState<string[]>([]);
  const [rangePence, setRangePence] = useState("1000");
  const [branded, setBranded] = useState<string[]>([]);
  const [nail, setNail] = useState("");
  const [code, setCode] = useState("");
  const [staffId, setStaffId] = useState("");
  const [anyone, setAnyone] = useState(false);
  const [startMs, setStartMs] = useState<number | null>(null);
  const [retail, setRetail] = useState<{ productId: string; collect: boolean }[]>([]);
  const [pay, setPay] = useState<GuestIntent["paymentChoice"]>("deposit");
  const [terms, setTerms] = useState(false);
  const [card, setCard] = useState(false);
  const [homeOk, setHomeOk] = useState(false);
  const [location, setLocation] = useState<GuestIntent["location"]>("salon");
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [maker, setMaker] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState("");

  const service = services.find((row) => row.id === serviceId);
  const addOnList = services.filter((row) => row.category === "Add-ons");
  const brandOptions = (salon.publicData?.branded ?? []).filter((row) => service && row.serviceIds.includes(service.id));
  const nails = (salon.publicData?.nailTiers ?? []).filter((row) => row.serviceId === serviceId);
  const offers = (salon.publicData?.offers ?? []).filter((offer) => offer.active && (offer.serviceIds.length === 0 || offer.serviceIds.includes(serviceId)));
  const people = useMemo(() => {
    if (!service) return [];
    return (salon.publicData?.staff ?? []).filter((person) => person.active && salon.qualified(person.id, service));
  }, [service]);
  const slotStaff = anyone ? null : staffId || null;
  const slotResult = service && service.durationMin ? salon.slots(service, anyone ? null : staffId || null, londonDayKey(new Date()), 7) : null;
  const visibleSlots = (slotResult?.offers ?? []).filter((slot) => (anyone ? true : slot.staffId === staffId)).slice(0, 24);
  const products = salon.shopProducts();

  function toggle(list: string[], id: string, set: (next: string[]) => void) {
    set(list.includes(id) ? list.filter((row) => row !== id) : [...list, id]);
  }

  function chooseCategory(next: string) {
    const query = new URLSearchParams();
    if (next) query.set("category", next);
    if (service && (!next || service.category === next)) query.set("service", service.id);
    else setServiceId("");
    const text = query.toString();
    navigate(`/book/treatment${text ? `?${text}` : ""}`, { replace: true });
  }

  async function confirm() {
    if (!service || startMs == null || !staffId) {
      setMessage("Choose a treatment, an artist and a time.");
      return;
    }
    const intent: GuestIntent = {
      kind: "booking",
      bookingId: crypto.randomUUID(),
      client: { name, mobile, email, dob: null },
      serviceId: service.id,
      staffId,
      startMs,
      addonIds: addons,
      rangePence: Number(rangePence) || null,
      brandedIds: branded,
      nailTierId: nail || null,
      retail: retail.map((item) => ({ productId: item.productId, qty: 1, collect: item.collect, chosenPence: null })),
      promoCode: code || null,
      paymentChoice: pay,
      cardOnFileAgreed: card,
      termsAccepted: terms,
      homeAccepted: homeOk,
      address,
      postcode,
      location,
      manufacturerChecked: maker,
      manufacturerNote: maker ? "Manufacturer instructions checked for an under-16 chemical service." : "",
      simulatedPayment: true,
    };
    const result = await salon.submitGuest(intent);
    setMessage(result.message);
    if (result.ok) setDone(result.message);
  }

  if (done) {
    return (
      <article className="card">
        <h1>Booking received</h1>
        <p className="ok">{done}</p>
        <p>The confirmation is held on this device and in the salon message log. Nothing was emailed.</p>
        <Link to="/my">My bookings</Link>
      </article>
    );
  }

  const stepShots = [service ? treatmentShot(service.name, service.category) : shotFile("treatment-hair-cut-1.webp"), OPTIONS.consult, OPTIONS.stylist, HERO.interior, OPTIONS.offers, HERO.interior];
  const query = serviceId ? `?service=${serviceId}` : "";
  return (
    <section>
      <h1>Book</h1>
      <div className="step-banner">
        <Photo shot={stepShots[stepIndex] ?? stepShots[0]} alt="" sizes="100vw" />
      </div>
      <nav className="steps" aria-label="Booking steps">
        {BOOK_STEPS.map((item, index) => (
          <Link key={item.slug} to={`/book/${item.slug}${query}`} aria-current={slug === item.slug ? "step" : undefined}>
            {index + 1}. {item.label}
          </Link>
        ))}
      </nav>
      {slug === "treatment" && (
        <div>
          <h2>1. Pick a treatment</h2>
          <p className="lede">Choose a category. Each card is a locked-brief service with its photo. Extra 15 min, long or thick hair, toner and deep conditioning are on the Extras step.</p>
          <nav className="filters" aria-label="Treatment categories">
            <button type="button" aria-pressed={category === ""} onClick={() => chooseCategory("")}>All treatments</button>
            {BOOK_CATEGORIES.map((item) => (
              <button key={item} type="button" aria-pressed={category === item} onClick={() => chooseCategory(item)}>{categoryLabel(item)}</button>
            ))}
          </nav>
          <div className="grid">
            {(() => {
              const shown = bookable.filter((row) => !category || row.category === category);
              const shots = treatmentShots(shown);
              return shown.map((row, index) => {
                const shot = shots[index] ?? treatmentShot(row.name, row.category, index);
                const copy = (
                  <span className="tile-copy">
                    <strong>{row.name}</strong>
                    <span className="muted">{categoryLabel(row.category)}</span>
                    <span className="muted">{row.durationMin ? `about ${formatDuration(row.durationMin)}` : "Duration not set"}</span>
                    <span className="price">{priceLabel(row)}</span>
                    {row.priceType === "quote" && <span className="btn">Request a quote</span>}
                  </span>
                );
                if (row.priceType === "quote") {
                  return (
                    <Link key={row.id} className="tile" to={`/enquiry?service=${row.id}`}>
                      <Photo className="tile-photo" shot={shot} alt="" sizes="(max-width: 980px) 50vw, 25vw" />
                      {copy}
                    </Link>
                  );
                }
                return (
              <button key={row.id} className={serviceId === row.id ? "tile selected" : "tile"} type="button" aria-pressed={serviceId === row.id} onClick={() => { setServiceId(row.id); const query = new URLSearchParams(); query.set("service", row.id); if (category) query.set("category", category); navigate(`/book/treatment?${query.toString()}`, { replace: true }); }}>
                <Photo className="tile-photo" shot={shot} alt="" sizes="(max-width: 980px) 50vw, 25vw" />
                {copy}
              </button>
                );
              });
            })()}
            {padTiles(bookable.filter((row) => !category || row.category === category).length).map((filler) => (
              <Link key={filler.key} className="shot" to={filler.to}>
                <Photo shot={filler.shot} alt="" sizes="(max-width: 980px) 50vw, 25vw" />
                <div>
                  <h3>{filler.title}</h3>
                  <p className="muted">{filler.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {slug === "product" && (
        <div>
          <h2>2. Product{service ? ` for ${service.name}` : ""}</h2>
          {!service && <p>Choose a treatment first. Moving between steps keeps what you already picked.</p>}
          {service && <p>{formatDuration(service.durationMin)} · {priceLabel(service)}</p>}
          {service?.patchTest && <p className="error">This treatment needs a patch test at least 48 hours before. If you do not have one, the checkout will stop and ask you to book a test first.</p>}
          {brandOptions.length > 0 && (
            <fieldset>
              <legend>Branded product used</legend>
              {brandOptions.map((option) => (
                <label key={option.id}>
                  <span><input type="checkbox" checked={branded.includes(option.id)} onChange={() => toggle(branded, option.id, setBranded)} /> {option.name} · [PRICE DIFFERENCE – Tony to set]</span>
                </label>
              ))}
            </fieldset>
          )}
          {nails.length > 0 && (
            <fieldset>
              <legend>Nail art tier</legend>
              {nails.map((tier) => (
                <label key={tier.id}>
                  <span><input type="radio" name="nail" checked={nail === tier.id} onChange={() => setNail(tier.id)} /> {tier.name} · Prices on request · [PRICE – Tony to set]</span>
                </label>
              ))}
            </fieldset>
          )}
          {service && brandOptions.length === 0 && nails.length === 0 && <p>This treatment has no branded product option. You can add extras later.</p>}
        </div>
      )}
      {slug === "extras" && (
        <div>
          <h2>5. Extras and offers</h2>
          {service && (service.location === "both" || service.location === "home" || service.location === "event") && (
            <fieldset>
              <legend>Where</legend>
              <label><span><input type="radio" name="where" checked={location === "salon"} onChange={() => setLocation("salon")} /> In the salon</span></label>
              {service.location !== "event" && <label><span><input type="radio" name="where" checked={location === "home"} onChange={() => setLocation("home")} /> At home</span></label>}
              <label><span><input type="radio" name="where" checked={location === "event"} onChange={() => setLocation("event")} /> Wedding or event</span></label>
            </fieldset>
          )}
          <fieldset>
            <legend>Add-ons</legend>
            {addOnList.map((addon) => (
              <label key={addon.id}>
                <span><input type="checkbox" checked={addons.includes(addon.id)} onChange={() => toggle(addons, addon.id, setAddons)} /> {addon.name} · {priceLabel(addon)} · {addon.durationMin ? `+${addon.durationMin} min` : ""}</span>
              </label>
            ))}
            {addons.includes("a48") && (
              <label>£8 to £15
                <input aria-label="Long hair supplement price in pence" value={rangePence} onChange={(event) => setRangePence(event.target.value)} />
              </label>
            )}
          </fieldset>
          <h3>Offers</h3>
          <p>One offer per booking. The discount is taken off before the deposit.</p>
          <ul>
            {offers.map((offer) => (
              <li key={offer.id}>{offer.name} {offer.amount == null ? "· [PRICE]" : offer.type === "percent" ? `· ${offer.amount}%` : ""} {offer.code ? `· code ${offer.code}` : ""}</li>
            ))}
          </ul>
          <label>Offer code
            <input value={code} onChange={(event) => setCode(event.target.value)} aria-describedby="offer-help" />
          </label>
          <p id="offer-help" className="muted">SAMPLE10 takes 10% off. A second code is refused.</p>
          <h3>Products to take home</h3>
          <p>Only products the salon has flagged for online sale are listed. New products stay in-shop until the salon changes them. Collect at your visit, or delivery as a separate order.</p>
          {products.map((product) => (
            <label key={product.id}>
              <Photo shot={productShot(product.name)} alt="" sizes="120px" />
              <span>
                <input type="checkbox" checked={retail.some((item) => item.productId === product.id)} onChange={() => {
                  setRetail((current) => current.some((item) => item.productId === product.id) ? current.filter((item) => item.productId !== product.id) : [...current, { productId: product.id, collect: true }]);
                }} />
                {product.brand} {product.name} · {product.rrpPence == null ? "Prices on request" : formatGBP(product.rrpPence)}
              </span>
            </label>
          ))}
        </div>
      )}
      {slug === "artist" && (
        <div>
          <h2>3. Your artist</h2>
          <button className="btn-ghost" type="button" onClick={() => { setAnyone(true); setStaffId(people[0]?.id ?? ""); }}>Anyone qualified</button>
          <div className="grid">
            {people.map((person) => (
              <button key={person.id} className={staffId === person.id && !anyone ? "tile selected" : "tile"} type="button" aria-pressed={staffId === person.id && !anyone} onClick={() => { setAnyone(false); setStaffId(person.id); }}>
                <Photo shot={avatarFor(person.id)} alt="" className="avatar" sizes="(max-width: 980px) 50vw, 25vw" />
                <span className="tile-copy">
                  <strong>{person.name}</strong>
                  <span className="muted">{person.tier} · {person.bio}</span>
                </span>
              </button>
            ))}
            {padTiles(people.length).map((filler) => (
              <Link key={filler.key} className="shot" to={filler.to}>
                <Photo shot={filler.shot} alt="" sizes="(max-width: 980px) 50vw, 25vw" />
                <div><h3>{filler.title}</h3><p className="muted">{filler.text}</p></div>
              </Link>
            ))}
          </div>
          {people.length === 0 && <p>No qualified artist is active for this treatment.</p>}
        </div>
      )}
      {slug === "time" && (
        <div>
          <h2>4. A time that fits</h2>
          {!anyone && staffId && visibleSlots.length === 0 && (
            <p>No suitable time for {people.find((person) => person.id === staffId)?.name}. The artist is not changed unless you ask.</p>
          )}
          <div className="row">
            <p className="muted">Times below stay with {people.find((person) => person.id === staffId)?.name ?? "the artist you pick"}. Going back does not clear them.</p>
            <button className="btn-ghost" type="button" onClick={() => { setAnyone(true); setStaffId(""); }}>Choose anyone / another artist</button>
          </div>
          <div className="grid">
            {(anyone ? (slotResult?.offers ?? []).slice(0, 24) : visibleSlots).map((slot) => (
              <button key={`${slot.staffId}-${slot.startMs}`} className={startMs === slot.startMs ? "tile selected" : "tile"} type="button" aria-pressed={startMs === slot.startMs} onClick={() => { setStaffId(slot.staffId); setStartMs(slot.startMs); }}>
                <span className="tile-copy">
                  {formatDateTimeUK(slot.startMs)}
                  <span className="muted">{slot.staffName}</span>
                </span>
              </button>
            ))}
            {padTiles((anyone ? (slotResult?.offers ?? []).slice(0, 24) : visibleSlots).length).map((filler) => (
              <Link key={filler.key} className="shot" to={filler.to}>
                <Photo shot={filler.shot} alt="" sizes="(max-width: 980px) 50vw, 25vw" />
                <div><h3>{filler.title}</h3><p className="muted">{filler.text}</p></div>
              </Link>
            ))}
          </div>
          {slotStaff && visibleSlots.length === 0 && <p className="muted">Try another day from the same artist, or choose anyone.</p>}
        </div>
      )}
      {slug === "checkout" && (
        <form onSubmit={(event) => { event.preventDefault(); void confirm(); }}>
          <h2>6. Checkout</h2>
          <p className="banner" role="status"><strong>TEST MODE – no real payments</strong></p>
          <p>{DRAFT}</p>
          <p>Deposit rule: the greater of {salon.publicData?.settings.depositPercent ?? 20}% and {formatGBP(salon.publicData?.settings.depositMinimumPence ?? 1500)}, never more than the price, unless this treatment has its own rule. No-show fee will not exceed the deposit already taken unless you separately agree a card-on-file charge.</p>
          <label>Name<input required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>Mobile<input required autoComplete="tel" inputMode="tel" value={mobile} onChange={(event) => setMobile(event.target.value)} /></label>
          <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          {location !== "salon" && (
            <>
              <label>Address<input required value={address} onChange={(event) => setAddress(event.target.value)} /></label>
              <label>Postcode<input required value={postcode} onChange={(event) => setPostcode(event.target.value)} aria-describedby="travel" /></label>
              <p id="travel">Travel fee: [TRAVEL FEE – Tony to set]. SAMPLE zone outward codes: {(salon.publicData?.settings.travelOutward ?? []).join(", ") || "none"}.</p>
              <label><span><input type="checkbox" checked={homeOk} onChange={(event) => setHomeOk(event.target.checked)} /> I accept the home-visit and wedding agreement (LEG-22). The salon is the contracting party, not SalonOS.</span></label>
              <p><Link to="/legal/LEG-22">Read LEG-22</Link></p>
            </>
          )}
          <fieldset>
            <legend>How to pay</legend>
            <label><span><input type="radio" name="pay" checked={pay === "deposit"} onChange={() => setPay("deposit")} /> Pay the deposit now (test mode)</span></label>
            <label><span><input type="radio" name="pay" checked={pay === "full"} onChange={() => setPay("full")} /> Pay in full now (test mode)</span></label>
            <label><span><input type="radio" name="pay" checked={pay === "in-salon"} onChange={() => setPay("in-salon")} /> Pay in the salon</span></label>
          </fieldset>
          {pay === "in-salon" && (
            <label><span><input type="checkbox" checked={card} onChange={(event) => setCard(event.target.checked)} /> I agree a card can be kept on file for a no-show or late cancel, separate from the deposit. No card number is stored. TEST MODE.</span></label>
          )}
          <label><span><input type="checkbox" checked={maker} onChange={(event) => setMaker(event.target.checked)} /> Under 16 and a chemical service: the salon has checked the manufacturer’s instructions.</span></label>
          <label><span><input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} /> I accept the booking terms, the deposit and the cancellation window before I confirm. <Link to="/legal/LEG-01">LEG-01</Link></span></label>
          <button className="btn" type="submit" disabled={!terms}>Simulate test payment</button>
          {message && <p className={message.startsWith("TEST") ? "ok" : "error"} role="alert">{message}</p>}
        </form>
      )}
      <div className="step-move">
        {stepIndex > 0 && (
          <button
            className="btn"
            type="button"
            onClick={() => {
              const previous = BOOK_STEPS[stepIndex - 1];
              if (window.history.length > 1) navigate(-1);
              else if (previous) navigate(`/book/${previous.slug}${query}`);
            }}
          >
            Back
          </button>
        )}
        {stepIndex < BOOK_STEPS.length - 1 && (
          <button className="btn" type="button" onClick={() => go(stepIndex + 1)}>Next</button>
        )}
      </div>
    </section>
  );
}

const BASKET_KEY = "salonos-basket";

function readBasket(): string[] {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(BASKET_KEY) || "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeBasket(ids: string[]) {
  sessionStorage.setItem(BASKET_KEY, JSON.stringify([...new Set(ids)]));
}

export function Shop() {
  const products = salon.shopProducts();
  return (
    <section>
      <ShopTrail />
      <div className="step-banner contain"><Photo shot={OPTIONS.shop} alt="Phone and laptop with beauty products and a pink shopping bag" sizes="100vw" /></div>
      <h1>Shop</h1>
      <p>Mail order and click and collect use the same stock as the till. In-shop-only products are hidden. A new product defaults to in-shop only.</p>
      {products.length === 0 ? <p>The online shop is empty until the salon flags products for online sale.</p> : (
        <div className="tiles">
          {products.map((product) => (
            <article key={product.id} className="shot">
              <Photo shot={productShot(product.name)} alt="" sizes="(max-width: 980px) 50vw, 25vw" />
              <div>
                <h2><Link to={`/shop/product/${product.id}`}>{product.name}</Link></h2>
                <p>{product.brand} · {product.size}</p>
                <p className="price">{product.rrpPence == null ? "Prices on request" : formatGBP(product.rrpPence)}</p>
                {product.sealedHygiene && <p className="muted">Sealed hygiene item. The 14-day right may not apply once the seal is broken.</p>}
                <Link className="btn" to={`/shop/checkout?product=${product.id}`}>Add and check out</Link>
              </div>
            </article>
          ))}
          {padTiles(products.length).map((filler) => (
            <Link key={filler.key} className="shot" to={filler.to}>
              <Photo shot={filler.shot} alt="" sizes="(max-width: 980px) 50vw, 25vw" />
              <div><h3>{filler.title}</h3><p className="muted">{filler.text}</p></div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = salon.shopProducts().find((row) => row.id === id);
  if (!product) {
    return (
      <section>
        <ShopTrail />
        <h1>Product</h1>
        <p>That product is not in the online shop.</p>
      </section>
    );
  }
  return (
    <article>
      <ShopTrail />
      <Photo shot={productShot(product.name)} alt="" sizes="(max-width: 720px) 100vw, 480px" />
      <h1>{product.name}</h1>
      <p>{product.brand} · {product.size}</p>
      <p className="price">{product.rrpPence == null ? "Prices on request" : formatGBP(product.rrpPence)}</p>
      {product.sealedHygiene && <p className="muted">Sealed hygiene item. The 14-day right may not apply once the seal is broken.</p>}
      <p className="shop-trail">
        <button
          className="btn"
          type="button"
          onClick={() => {
            writeBasket([...readBasket(), product.id]);
            navigate("/shop/basket");
          }}
        >
          Add to basket
        </button>
        <Link className="btn" to={`/shop/checkout?product=${product.id}`}>Add and check out</Link>
      </p>
    </article>
  );
}

export function Basket() {
  const [ids, setIds] = useState<string[]>(() => readBasket());
  const products = ids
    .map((id) => salon.shopProducts().find((row) => row.id === id))
    .filter((row): row is NonNullable<typeof row> => !!row);
  return (
    <section>
      <ShopTrail />
      <h1>Basket</h1>
      {products.length === 0 ? <p>Your basket is empty.</p> : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} · {product.rrpPence == null ? "Prices on request" : formatGBP(product.rrpPence)}
              {" "}
              <button type="button" onClick={() => {
                const next = readBasket().filter((id) => id !== product.id);
                writeBasket(next);
                setIds(next);
              }}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      {products.length > 0 && <Link className="btn" to="/shop/checkout?from=basket">Check out</Link>}
    </section>
  );
}

export function ShopCheckout() {
  const [params] = useSearchParams();
  const requested = params.get("product");
  const ids = params.get("from") === "basket" ? readBasket() : requested ? [requested] : [];
  const products = ids
    .map((id) => salon.shopProducts().find((row) => row.id === id))
    .filter((row): row is NonNullable<typeof row> => !!row);
  const [fulfilment, setFulfilment] = useState<ShopIntent["fulfilment"]>("collect");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [terms, setTerms] = useState(false);
  const [message, setMessage] = useState("");
  if (products.length === 0) {
    return (
      <section>
        <ShopTrail />
        <h1>Checkout</h1>
        <p>Choose a product from the shop.</p>
      </section>
    );
  }
  const title = products.length === 1 ? products[0]?.name ?? "Checkout" : `${products.length} products`;
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      const intent: ShopIntent = {
        kind: "order",
        client: { name, email, mobile, dob: null },
        lines: products.map((product) => ({ productId: product.id, name: product.name, qty: 1, pence: product.rrpPence ?? 0 })),
        fulfilment,
        address,
        termsAccepted: terms,
      };
      void salon.submitShop(intent).then((result) => setMessage(result.message));
    }}>
      <ShopTrail />
      <Photo shot={productShot(products[0]?.name ?? "")} alt="" sizes="(max-width: 720px) 100vw, 480px" />
      <h1>Checkout · {title}</h1>
      <p className="banner"><strong>TEST MODE – no real payments</strong></p>
      <p>{DRAFT}. Pre-contract information: main characteristics {products.map((product) => `${product.name} ${product.size}`).join(", ")}; trader [OPERATOR LEGAL NAME], [OPERATOR ADDRESS], [OPERATOR EMAIL]; price {products.map((product) => product.rrpPence == null ? "[PRICE]" : formatGBP(product.rrpPence)).join(", ")} including taxes where VAT applies ([OPERATOR VAT POSITION]); delivery [SHIPPING RATE – Tony to set] or click and collect free; complaints in LEG-21; 14-day cancellation in LEG-02. You pay return postage unless the salon says otherwise.</p>
      <label>Name<input required value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Mobile<input required value={mobile} onChange={(e) => setMobile(e.target.value)} /></label>
      <label><span><input type="radio" name="f" checked={fulfilment === "collect"} onChange={() => setFulfilment("collect")} /> Click and collect (free)</span></label>
      <label><span><input type="radio" name="f" checked={fulfilment === "delivery"} onChange={() => setFulfilment("delivery")} /> UK delivery · [SHIPPING RATE – Tony to set]</span></label>
      {fulfilment === "delivery" && <label>Address<input required value={address} onChange={(e) => setAddress(e.target.value)} /></label>}
      <label><span><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} /> I accept the online shop terms. <Link to="/legal/LEG-02">LEG-02</Link></span></label>
      <button className="btn" disabled={!terms} type="submit">Simulate test payment</button>
      {message && <p role="status">{message}</p>}
    </form>
  );
}

export function Club() {
  const [email, setEmail] = useState(false);
  const [sms, setSms] = useState(false);
  const [push, setPush] = useState(false);
  const [joined, setJoined] = useState(false);
  return (
    <article>
      <Photo shot={OPTIONS.loyalty} alt="" sizes="(max-width: 720px) 100vw, 720px" />
      <h1>Loyalty club</h1>
      <p>The club is free. Joining does not opt you in to marketing. Health information is never used for offers.</p>
      <p><Link to="/legal/LEG-04">Club terms</Link> · <Link to="/legal/LEG-08">Consent wording</Link></p>
      {joined ? <p className="ok">You are a member. No marketing was ticked, so no marketing will be sent. Points appear after a visit is paid in full.</p> : (
        <form onSubmit={(event) => { event.preventDefault(); setJoined(true); }}>
          <label>Email<input required type="email" autoComplete="email" /></label>
          <label>Mobile<input required autoComplete="tel" /></label>
          <label><span><input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} /> Email me promotions, treatments and product deals</span></label>
          <label><span><input type="checkbox" checked={push} onChange={(e) => setPush(e.target.checked)} /> Web push</span></label>
          <label><span><input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} disabled={!salon.publicData?.settings.smsEnabled} /> SMS (off until the salon turns it on; cost passes through)</span></label>
          <button className="btn" type="submit">Join the club</button>
        </form>
      )}
    </article>
  );
}

export function MyBookings() {
  const receipts = salon.receipts();
  const [code, setCode] = useState("");
  const [shown, setShown] = useState("");
  return (
    <article>
      <Photo shot={HERO.interior} alt="" sizes="(max-width: 720px) 100vw, 720px" />
      <h1>My bookings</h1>
      <p>Preview sign-in does not send email. A one-time code is shown on this device.</p>
      <form onSubmit={(event) => { event.preventDefault(); setShown("482900"); }}>
        <label>Email for a one-time code<input type="email" required /></label>
        <button className="btn" type="button" onClick={() => setShown("482900")}>Show one-time code on this screen</button>
        <label>Code<input value={code} onChange={(e) => setCode(e.target.value)} /></label>
      </form>
      {shown && <p role="status">Your preview code is {shown}. It was not emailed.</p>}
      {receipts.length === 0 ? <p>No booking is stored on this device yet.</p> : receipts.map((row) => (
        <pre key={row.id} className="card">{row.summary}</pre>
      ))}
    </article>
  );
}

export function Enquiry() {
  const [params] = useSearchParams();
  const [sent, setSent] = useState(false);
  return (
    <article>
      <div className="pair">
        <Photo shot={OPTIONS.wedding} alt="" sizes="50vw" />
        <Photo shot={OPTIONS.events} alt="" sizes="50vw" />
      </div>
      <h1>Wedding, event or quote</h1>
      <p>This creates an enquiry, not a booking. It cannot be paid online until the salon issues a quote. Bridal hair and makeup is quote only.</p>
      {sent ? <p className="ok">Enquiry saved on this device for the salon. Nothing was sent.</p> : (
        <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const detail = JSON.stringify(Object.fromEntries(data.entries())); localStorage.setItem("salonos-enquiry", detail); setSent(true); }}>
          <label>Name<input name="name" required /></label>
          <label>Mobile<input name="mobile" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Date<input name="date" type="date" required /></label>
          <label>Venue<input name="venue" /></label>
          <label>Party size<input name="party" inputMode="numeric" /></label>
          <label>Services<textarea name="services" defaultValue={params.get("service") ?? ""} /></label>
          <label><span><input type="checkbox" name="trial" /> Trial wanted</span></label>
          <label>Notes<textarea name="notes" /></label>
          <button className="btn" type="submit">Send enquiry</button>
        </form>
      )}
    </article>
  );
}

export function Vouchers() {
  return (
    <article>
      <Photo shot={OPTIONS.vouchers} alt="" sizes="(max-width: 720px) 100vw, 720px" />
      <h1>Gift vouchers</h1>
      <p>In the shop only. Online purchase is blocked in this version. VAT stays [VOUCHER VAT TREATMENT – adviser to confirm]. No expiry is hard-coded.</p>
      <p>{DRAFT}</p>
      <p><Link to="/legal/LEG-03">Voucher terms</Link></p>
      <Link className="btn" to="/team">Ask at the till</Link>
    </article>
  );
}
