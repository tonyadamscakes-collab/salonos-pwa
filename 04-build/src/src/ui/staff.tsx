import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { formatDateTimeUK, formatGBP } from "../domain/money";
import { formatDuration, londonDayKey, londonWallToUtc } from "../domain/time";
import { SAMPLE_LOGINS } from "../data/seed";
import { salon } from "../data/session";
import type { BookingRecord } from "../data/model";
import { DRAFT } from "./legal";
import { Photo } from "./Photo";
import { FinanceSyncPanel } from "../modules/finance-sync";
import { avatarFor, OPTIONS, productShot } from "./photos";

function useTick(): void {
  const [, set] = useState(0);
  useEffect(() => salon.subscribe(() => set((n) => n + 1)), []);
}

export function StaffApp() {
  useTick();
  const [pin, setPin] = useState("");
  const [username, setUsername] = useState("owner");
  const [userPin, setUserPin] = useState("");
  const [factor, setFactor] = useState("");
  const [message, setMessage] = useState("");
  if (!salon.privateData) {
    return (
      <section className="card">
        <img className="wordmark" src="/media/logo-wordmark-dark.svg" alt="SalonOS" width={534} height={170} />
        <h1>Staff lock</h1>
        <p>This is the staff back office: diary, walk-ins, clients, till, stock, cash-up, catalogue, orders, finance, reports and settings. Use the pink Staff link in the top menu.</p>
        <p>Health records and formulas are encrypted on this device. Enter the device PIN to unlock. The preview PIN is published because every client is fictional.</p>
        <form onSubmit={(event) => { event.preventDefault(); void salon.unlock(pin).then((ok) => setMessage(ok ? "" : "PIN not recognised.")); }}>
          <label>Device PIN<input type="password" autoComplete="current-password" value={pin} onChange={(e) => setPin(e.target.value)} /></label>
          <button className="btn" type="submit">Unlock</button>
        </form>
        <details open>
          <summary>SAMPLE credentials (fictional, published for this preview)</summary>
          <p>Device PIN 2580. Change it in settings before any real client exists.</p>
          <ul>{SAMPLE_LOGINS.map((row) => <li key={row.username}>{row.label}: {row.username} / {row.pin}{row.second ? ` / second factor ${row.second}` : ""}</li>)}</ul>
        </details>
        {message && <p className="error" role="alert">{message}</p>}
      </section>
    );
  }
  if (!salon.actor) {
    return (
      <section className="card">
        <h1>Staff sign in</h1>
        <p>Each person has their own login. Owner and manager also need a second factor.</p>
        <form onSubmit={(event) => { event.preventDefault(); void salon.login(username, userPin, factor).then((error) => setMessage(error ?? "")); }}>
          <label>Username<input value={username} onChange={(e) => setUsername(e.target.value)} /></label>
          <label>PIN<input type="password" value={userPin} onChange={(e) => setUserPin(e.target.value)} /></label>
          <label>Second factor (owner and manager)<input value={factor} onChange={(e) => setFactor(e.target.value)} /></label>
          <button className="btn" type="submit">Sign in</button>
        </form>
        {message && <p className="error" role="alert">{message}</p>}
        <button className="btn-ghost" type="button" onClick={() => salon.lock()}>Lock device</button>
      </section>
    );
  }
  return (
    <div className="staff">
      <nav className="side" aria-label="Staff">
        <strong>{salon.userName}</strong>
        <NavLink to="/team" end>Diary</NavLink>
        <NavLink to="/team/queue">Walk-ins</NavLink>
        <NavLink to="/team/clients">Clients</NavLink>
        <NavLink to="/team/till">Till</NavLink>
        <NavLink to="/team/stock">Stock</NavLink>
        <NavLink to="/team/cash">Cash-up</NavLink>
        <NavLink to="/team/catalogue">Catalogue</NavLink>
        <NavLink to="/team/orders">Orders</NavLink>
        <NavLink to="/team/finance">Finance</NavLink>
        <NavLink to="/team/reports">Reports</NavLink>
        <NavLink to="/team/settings">Settings</NavLink>
        <button className="btn-ghost" type="button" onClick={() => salon.logout()}>Sign out</button>
        <button className="btn-ghost" type="button" onClick={() => salon.setOffline(!salon.offline)}>
          {salon.offline ? "Reconnect and sync" : "Simulate offline"}
        </button>
      </nav>
      <div>
        <Routes>
          <Route path="/" element={<Diary />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/till" element={<Till />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/cash" element={<CashUp />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

function Diary() {
  const [day, setDay] = useState(londonDayKey(new Date()));
  const [clientId, setClientId] = useState(salon.privateData?.clients[0]?.id ?? "");
  const [serviceId, setServiceId] = useState("a1");
  const [staffId, setStaffId] = useState("jordan");
  const [time, setTime] = useState("11:00");
  const [error, setError] = useState("");
  const [drag, setDrag] = useState<string | null>(null);
  const bookings = salon.diary(day);
  const staff = (salon.privateData?.staff ?? []).filter((person) => salon.actor && (salon.actor.role === "owner" || salon.actor.role === "manager" || salon.actor.role === "reception" || person.id === salon.actor.staffId));
  return (
    <section>
      <div className="step-banner"><Photo shot={OPTIONS.about} alt="" sizes="100vw" /></div>
      <h1>Today’s diary</h1>
      <label>Day<input type="date" value={day} onChange={(e) => setDay(e.target.value)} /></label>
      <form className="card" onSubmit={(event) => {
        event.preventDefault();
        const [hour, minute] = time.split(":").map(Number);
        const [year, month, date] = day.split("-").map(Number);
        const ms = londonWallToUtc(year, month, date, hour ?? 0, minute ?? 0).getTime();
        void salon.quickBook({ clientId, serviceId, staffId, startMs: ms }).then((result) => setError(result ?? "Saved"));
      }}>
        <h2>Quick booking</h2>
        <div className="row">
          <label>Client<select value={clientId} onChange={(e) => setClientId(e.target.value)}>{salon.privateData?.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <label>Treatment<select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>{salon.privateData?.services.filter((s) => s.source === "brief" && s.active).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
          <label>Artist<select value={staffId} onChange={(e) => setStaffId(e.target.value)}>{staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
          <label>Time<input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
          <button className="btn" type="submit">Save</button>
        </div>
        {error && <p role="status">{error}</p>}
      </form>
      <h2>Coming up</h2>
      <ul>
        {(salon.privateData?.bookings ?? [])
          .filter((row) => row.status !== "cancelled" && (salon.actor?.role === "owner" || salon.actor?.role === "manager" || salon.actor?.role === "reception" || row.staffId === salon.actor?.staffId))
          .map((row) => (
            <li key={row.id}>{formatDateTimeUK(row.startMs)} · {salon.privateData?.clients.find((client) => client.id === row.clientId)?.name} · {row.lines[0]?.name} · deposit {row.depositStatus}</li>
          ))}
      </ul>
      {(salon.privateData?.attention.filter((row) => !row.resolved).length ?? 0) > 0 && (
        <div className="card">
          <h2>Needs attention</h2>
          <ul>{salon.privateData?.attention.filter((row) => !row.resolved).map((row) => <li key={row.id}>{row.kind}: {row.detail} {row.phone}</li>)}</ul>
        </div>
      )}
      <div className="diary">
        {staff.map((person) => (
          <section key={person.id} className="card column" aria-label={person.name}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => { if (drag) void salon.moveBooking(drag, person.id, bookings.find((row) => row.id === drag)?.startMs ?? Date.now()).then((msg) => setError(msg ?? "Moved")); }}>
            <Photo shot={avatarFor(person.id)} alt="" className="avatar" sizes="72px" />
            <h2 style={{ color: "#fff" }}>{person.name}</h2>
            {bookings.filter((row) => row.staffId === person.id).map((booking) => <Appointment key={booking.id} booking={booking} onDrag={setDrag} />)}
          </section>
        ))}
      </div>
      {salon.lowStock().length > 0 && <p className="error">Low stock: {salon.lowStock().map((row) => row.name).join(", ")}</p>}
    </section>
  );
}

function Appointment({ booking, onDrag }: { booking: BookingRecord; onDrag: (id: string) => void }) {
  const client = salon.privateData?.clients.find((row) => row.id === booking.clientId);
  const processing = booking.segments.find((segment) => segment.kind === "processing");
  return (
    <article className="card appt" draggable onDragStart={() => onDrag(booking.id)}>
      <strong>{formatDateTimeUK(booking.startMs)}</strong>
      <div>{client?.name}</div>
      <div>{booking.lines.map((line) => line.name).join(", ")}</div>
      <div>{formatDuration(booking.segments.reduce((sum, segment) => sum + segment.minutes, 0))}</div>
      {processing && <div className="processing">Processing {processing.minutes} min · stylist can take another client</div>}
      {booking.colourNote && <div>Note: {booking.colourNote}</div>}
      <span className="badge">Deposit {booking.depositStatus}</span>
      <span className="badge">{booking.status}</span>
      {client && salon.privateData?.patches.some((row) => row.clientId === client.id && row.result === "reaction") && <span className="badge">Allergy flag</span>}
      <div className="row">
        <button type="button" className="btn-ghost" onClick={() => void salon.setStatus(booking.id, "arrived")}>Arrived</button>
        <button type="button" className="btn-ghost" onClick={() => void salon.noShow(booking.id)}>No-show</button>
        <button type="button" className="btn-ghost" onClick={() => void salon.setStatus(booking.id, "cancelled", "Late cancel")}>Late cancel</button>
      </div>
    </article>
  );
}

function Queue() {
  const [name, setName] = useState("");
  const [serviceId, setServiceId] = useState("a3");
  const service = salon.privateData?.services.find((row) => row.id === serviceId);
  const estimate = service ? salon.slots(service, null, londonDayKey(new Date()), 1).offers[0] : undefined;
  return (
    <section>
      <h1>Walk-in queue</h1>
      <p>Estimated wait is the earliest time a qualified person is free for the full duration, minus now.</p>
      <form onSubmit={(event) => { event.preventDefault(); salon.addWalkIn(name, serviceId); setName(""); }}>
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>Treatment<select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>{salon.privateData?.services.filter((s) => s.source === "brief").map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        <p>{estimate ? `Estimated start ${formatDateTimeUK(estimate.startMs)} with ${estimate.staffName}` : "No one is free for that duration today."}</p>
        <button className="btn" type="submit">Add walk-in</button>
      </form>
      <ul>{salon.privateData?.walkins.filter((row) => row.status === "waiting").map((row) => <li key={row.id}>{row.clientName}</li>)}</ul>
    </section>
  );
}

function Clients() {
  const [q, setQ] = useState("");
  const [id, setId] = useState<string | null>(null);
  const [grams, setGrams] = useState("40");
  const [waste, setWaste] = useState("2");
  const [reason, setReason] = useState("");
  const [boxes, setBoxes] = useState({ told: false, declined: false, insurance: false, ack: false });
  const [note, setNote] = useState("");
  let results: ReturnType<typeof salon.searchClients> = [];
  try { results = q ? salon.searchClients(q) : (salon.privateData?.clients ?? []); } catch { results = []; }
  const client = salon.privateData?.clients.find((row) => row.id === id);
  const showSpend = salon.actor?.role !== "junior" || salon.actor.juniorCanSeeSpend;
  return (
    <section>
      <h1>Clients</h1>
      <label>Search by name or mobile<input value={q} onChange={(e) => setQ(e.target.value)} /></label>
      <ul>{results.map((row) => <li key={row.id}><button type="button" className="btn-ghost" onClick={() => setId(row.id)}>{row.name} · {row.mobile}</button></li>)}</ul>
      {client && (
        <article className="card">
          <h2>{client.name} <span className="badge">SAMPLE</span></h2>
          <p>{client.mobile} · {client.email}</p>
          <p>Points {salon.pointsOf(client.id)} · Preferred {Object.entries(client.preferredByCategory).map(([cat, staff]) => `${cat}: ${staff}`).join(", ") || "none"}</p>
          <p>Marketing email {client.marketing.email ? "yes" : "no"} · SMS {client.marketing.sms ? "yes" : "no"} · push {client.marketing.push ? "yes" : "no"}</p>
          <h3>Patch tests</h3>
          <ul>{salon.privateData?.patches.filter((row) => row.clientId === client.id).map((row) => <li key={row.id}>{row.at.slice(0, 10)} {row.product} {row.result}</li>)}</ul>
          <h3>Formulas</h3>
          <ul>{salon.privateData?.formulas.filter((row) => row.clientId === client.id).slice(0, 3).map((row) => <li key={row.id}>{row.lines.map((line) => `${line.grams}g + ${line.wasteGrams}g waste`).join(", ")} · {row.developer}</li>)}</ul>
          <h3>History</h3>
          <ul>
            {salon.privateData?.bookings.filter((row) => row.clientId === client.id).map((row) => (
              <li key={row.id}>{formatDateTimeUK(row.startMs)} {row.lines[0]?.name} {row.status} {showSpend ? formatGBP(row.totalPence) : "spend hidden"}</li>
            ))}
          </ul>
          <h3>Declined patch test</h3>
          <p className="error">Some insurers refuse cover when a client declines a patch test. The salon must check its own policy. {DRAFT}</p>
          <label>Reason<textarea value={reason} onChange={(e) => setReason(e.target.value)} /></label>
          <label><span><input type="checkbox" checked={boxes.told} onChange={(e) => setBoxes({ ...boxes, told: e.target.checked })} /> The client was told the risk</span></label>
          <label><span><input type="checkbox" checked={boxes.declined} onChange={(e) => setBoxes({ ...boxes, declined: e.target.checked })} /> The client chose to decline the test</span></label>
          <label><span><input type="checkbox" checked={boxes.insurance} onChange={(e) => setBoxes({ ...boxes, insurance: e.target.checked })} /> The client was told insurance may not cover the service</span></label>
          <label><span><input type="checkbox" checked={boxes.ack} onChange={(e) => setBoxes({ ...boxes, ack: e.target.checked })} /> The client acknowledged this</span></label>
          <button className="btn" type="button" onClick={() => void salon.saveWaiver(client.id, reason, boxes).then((msg) => setNote(msg ?? "Recorded"))}>Save manager record</button>
          <h3>Formula on the open visit</h3>
          <div className="row">
            <label>Grams<input value={grams} onChange={(e) => setGrams(e.target.value)} /></label>
            <label>Waste grams<input value={waste} onChange={(e) => setWaste(e.target.value)} /></label>
            <button className="btn" type="button" onClick={() => {
              const booking = salon.privateData?.bookings.find((row) => row.clientId === client.id);
              if (booking) void salon.saveFormula(booking.id, Number(grams), Number(waste)).then((msg) => setNote(msg ?? "Formula saved"));
            }}>Save formula</button>
          </div>
          {note && <p role="status">{note}</p>}
        </article>
      )}
    </section>
  );
}

function Till() {
  const [bookingId, setBookingId] = useState(salon.privateData?.bookings[0]?.id ?? "");
  const [cash, setCash] = useState("0");
  const [card, setCard] = useState("0");
  const [external, setExternal] = useState("0");
  const [ref, setRef] = useState("");
  const [tip, setTip] = useState("0");
  const [message, setMessage] = useState("");
  const booking = salon.privateData?.bookings.find((row) => row.id === bookingId);
  const due = booking ? salon.balanceDue(booking) : 0;
  return (
    <section>
      <h1>Till</h1>
      <p className="banner"><strong>TEST MODE – no real payments</strong>. Card means a simulated Stripe test tender. External card is SumUp, Dojo or another terminal. No card numbers are stored. Stripe is unavailable while offline.</p>
      <label>Booking<select value={bookingId} onChange={(e) => setBookingId(e.target.value)}>{salon.privateData?.bookings.map((row) => <option key={row.id} value={row.id}>{row.lines[0]?.name} · due {formatGBP(salon.balanceDue(row))}</option>)}</select></label>
      {booking && <p>Balance {formatGBP(due)}. Deposit {booking.depositStatus}.</p>}
      <div className="row">
        <label>Cash £<input value={cash} onChange={(e) => setCash(e.target.value)} /></label>
        <label>Simulated card £<input value={card} onChange={(e) => setCard(e.target.value)} disabled={salon.offline} /></label>
        <label>External card £<input value={external} onChange={(e) => setExternal(e.target.value)} /></label>
        <label>Terminal reference<input value={ref} onChange={(e) => setRef(e.target.value)} /></label>
        <label>Tip £<input value={tip} onChange={(e) => setTip(e.target.value)} /></label>
      </div>
      <button className="btn" type="button" onClick={() => {
        const pounds = (value: string) => Math.round(Number(value) * 100);
        const tenders = [
          pounds(cash) ? { method: "cash" as const, amountPence: pounds(cash) } : null,
          pounds(card) ? { method: "card" as const, amountPence: pounds(card) } : null,
          pounds(external) ? { method: "external-card" as const, amountPence: pounds(external) } : null,
        ].filter((row): row is NonNullable<typeof row> => !!row);
        void salon.takePayment(bookingId, tenders, pounds(tip), { terminal: "SumUp SAMPLE", ref }).then((msg) => setMessage(msg ?? "Paid. Receipt is on screen. Email was not sent."));
      }}>Take payment</button>
      {message && <p role="status">{message}</p>}
      {booking && (
        <pre className="card">{salon.confirmationBody(booking, salon.privateData?.clients.find((c) => c.id === booking.clientId)?.name ?? "")}{"\n"}Tip is not salon revenue. VAT: {salon.privateData?.settings.vatRegistered ? "[VAT NUMBER]" : "not registered · [OPERATOR VAT POSITION]"}</pre>
      )}
      <Photo shot={OPTIONS.vouchers} alt="" sizes="(max-width: 720px) 100vw, 420px" />
      <h2>Gift voucher (in shop only)</h2>
      <p>Online purchase is blocked. VAT treatment: {salon.privateData?.settings.voucherVatTreatment}. {DRAFT}</p>
      <button className="btn" type="button" onClick={() => void salon.sellVoucher(5000, "SAMPLE till").then((code) => setMessage(`Voucher ${code} for £50.00. SAMPLE amount chosen at the till, not a price list.`))}>Sell a £50 voucher</button>
      <button className="btn-ghost" type="button" onClick={() => window.print()}>Print receipt</button>
    </section>
  );
}

function Stock() {
  const [productId, setProductId] = useState("r1");
  const [qty, setQty] = useState("12");
  const [counted, setCounted] = useState("6");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const products = salon.privateData?.products ?? [];
  return (
    <section>
      <h1>Stock</h1>
      <table>
        <thead><tr><th></th><th>Product</th><th>Channel</th><th>On hand</th><th>Reorder</th></tr></thead>
        <tbody>
          {products.map((product) => {
            const stock = salon.stockOf(product.id, product.useType === "backbar" ? "backbar" : "retail");
            return <tr key={product.id}><td><Photo shot={productShot(product.name)} alt="" className="thumb" sizes="64px" /></td><td>{product.name}</td><td>{product.channel}</td><td>{stock.onHand} {product.useType === "backbar" ? "g" : ""}</td><td>{product.reorderLevel}</td></tr>;
          })}
        </tbody>
      </table>
      <h2>Goods in</h2>
      <div className="row">
        <label>Product<select value={productId} onChange={(e) => setProductId(e.target.value)}>{products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label>Quantity<input value={qty} onChange={(e) => setQty(e.target.value)} /></label>
        <label>Supplier (typed)<input value={note} onChange={(e) => setNote(e.target.value)} /></label>
        <button className="btn" type="button" onClick={() => void salon.goodsIn(productId, Number(qty), null, "delivery", note).then((msg) => setMessage(msg ?? "Goods in saved. Cost price was not invented."))}>Save goods in</button>
      </div>
      <h2>Stock take</h2>
      <label>Counted<input value={counted} onChange={(e) => setCounted(e.target.value)} /></label>
      <button className="btn" type="button" onClick={() => void salon.stockTake(productId, Number(counted), "SAMPLE count").then((msg) => setMessage(msg ?? "Adjustment posted"))}>Post count</button>
      {message && <p role="status">{message}</p>}
    </section>
  );
}

function CashUp() {
  const day = londonDayKey(new Date());
  const expected = salon.expectedCashToday(day);
  const [actual, setActual] = useState((expected / 100).toFixed(2));
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const open = salon.privateData?.bookings.filter((row) => row.status !== "completed" && row.status !== "cancelled" && row.status !== "no-show") ?? [];
  return (
    <section>
      <h1>Cash-up</h1>
      <p>Expected cash {formatGBP(expected)}. Variance is actual minus expected. Card totals stay on their own lines.</p>
      <ul>{open.map((row) => <li key={row.id}>Still open: {row.lines[0]?.name} · {row.status}</li>)}</ul>
      <label>Actual cash £<input value={actual} onChange={(e) => setActual(e.target.value)} /></label>
      <label>Variance reason<input value={reason} onChange={(e) => setReason(e.target.value)} /></label>
      <button className="btn" type="button" onClick={() => void salon.closeDay(day, Math.round(Number(actual) * 100), reason).then((msg) => setMessage(msg ?? "Day closed. A correction is a new event."))}>Close day</button>
      {message && <p role="status">{message}</p>}
    </section>
  );
}

function Catalogue() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const seed = (salon.privateData?.services ?? []).filter((row) => row.source === "seed");
  const categories = [...new Set(seed.map((row) => row.category))].sort((a, b) => a.localeCompare(b, "en-GB"));
  const rows = seed.filter((row) => (!cat || row.category === cat) && row.name.toLowerCase().includes(q.toLowerCase()));
  const slice = rows.slice((page - 1) * 25, page * 25);
  return (
    <section>
      <h1>Catalogue</h1>
      <p>{seed.length} seed treatments are inactive until accepted. They can be edited or deleted. Deleting them does not remove the locked brief services. No seed price is filled in. Prices stay “Prices on request”.</p>
      <label>Category
        <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }}>
          <option value="">All categories ({seed.length})</option>
          {categories.map((item) => <option key={item} value={item}>{item} ({seed.filter((row) => row.category === item).length})</option>)}
        </select>
      </label>
      <label>Search seed<input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></label>
      <table>
        <thead><tr><th>Name</th><th>Category</th><th>Duration</th><th>Price</th><th></th></tr></thead>
        <tbody>
          {slice.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.category}</td>
              <td>{row.durationText || "not set"}</td>
              <td>Prices on request</td>
              <td>
                <button type="button" onClick={() => void salon.acceptSeed([row.id])}>Accept</button>
                <button type="button" onClick={() => { if (confirm("Delete this seed row?")) void salon.deleteSeed([row.id]).then((msg) => setMessage(msg ?? "Deleted")); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="row">
        <button type="button" className="btn-ghost" onClick={() => setPage((n) => Math.max(1, n - 1))}>Previous</button>
        <span>Page {page} of {Math.max(1, Math.ceil(rows.length / 25))}</span>
        <button type="button" className="btn-ghost" onClick={() => setPage((n) => n + 1)}>Next</button>
        <button type="button" className="btn" onClick={() => { if (confirm("Delete the filtered seed rows?")) void salon.deleteSeed(rows.map((row) => row.id)).then((msg) => setMessage(msg ?? "Deleted")); }}>Delete filtered seed rows</button>
      </div>
      {message && <p role="status">{message}</p>}
      <h2>Brief services</h2>
      <ul>{salon.privateData?.services.filter((row) => row.source === "brief").map((row) => <li key={row.id}>{row.name} · {row.basePence == null ? "Prices on request" : formatGBP(row.basePence)} · {row.durationMin ?? "—"} min</li>)}</ul>
    </section>
  );
}

function Orders() {
  return (
    <section>
      <h1>Online orders</h1>
      {(salon.privateData?.orders.length ?? 0) === 0 && <p>No online order yet.</p>}
      {salon.privateData?.orders.map((order) => (
        <article key={order.id} className="card">
          <h2>{order.id}</h2>
          <p>{order.status} · {order.fulfilment} · {formatGBP(order.totalPence)}</p>
          <label>Courier<input id={`c-${order.id}`} /></label>
          <label>Tracking<input id={`t-${order.id}`} /></label>
          <button type="button" className="btn" onClick={() => {
            const courier = (document.getElementById(`c-${order.id}`) as HTMLInputElement).value;
            const tracking = (document.getElementById(`t-${order.id}`) as HTMLInputElement).value;
            void salon.advanceOrder(order.id, order.fulfilment === "collect" ? "ready" : "dispatched", { courier, tracking });
          }}>Update fulfilment</button>
        </article>
      ))}
    </section>
  );
}

function Finance() {
  const rows = salon.privateData?.finance ?? [];
  return (
    <section>
      <h1>Finance sync log</h1>
      <FinanceSyncPanel />
      <p>Stub adapter. Nothing is posted to [ACCOUNTING PACKAGE – Tony to choose later].</p>
      {rows.length === 0 && <p>No posting yet. A deposit or till payment writes one.</p>}
      {rows.map((row) => (
        <article key={row.id} className="card">
          <p>{row.status} · {row.source} · {row.idempotencyKey}</p>
          <pre>{JSON.stringify(row.lines, null, 2)}</pre>
        </article>
      ))}
    </section>
  );
}

function Reports() {
  const ledger = salon.privateData?.ledger ?? [];
  const byMethod = new Map<string, number>();
  for (const row of ledger) {
    if (row.kind === "tip") continue;
    byMethod.set(row.method, (byMethod.get(row.method) ?? 0) + row.amountPence);
  }
  const tips = (salon.privateData?.tips ?? []).filter((row) => row.qualifying).reduce((sum, row) => sum + row.amountPence, 0);
  const vouchers = (salon.privateData?.vouchers ?? []).reduce((sum, row) => sum + row.amountPence, 0);
  return (
    <section>
      <h1>Reports</h1>
      <h2>Takings by tender</h2>
      <ul>{[...byMethod.entries()].map(([method, pence]) => <li key={method}>{method}: {formatGBP(pence)}</li>)}</ul>
      <h2>Liabilities</h2>
      <ul>
        <li>Tips payable (full pass-through, no deductions): {formatGBP(tips)}</li>
        <li>Voucher liability: {formatGBP(vouchers)} · VAT {salon.privateData?.settings.voucherVatTreatment}</li>
        <li>Owed to renters: {formatGBP((salon.privateData?.commission ?? []).reduce((sum, row) => sum + row.renterPence, 0))}</li>
      </ul>
      <p className="muted">Commission is calculated on the discounted price, and net of VAT only when the salon is registered. Rent-a-chair payouts are recorded, not paid by SalonOS. Employment status is the salon’s responsibility.</p>
      <p>Mobile artist marketplace: later phase [MARKETPLACE – later phase]</p>
    </section>
  );
}

function Settings() {
  const settings = salon.privateData?.settings;
  const [percent, setPercent] = useState(String(settings?.depositPercent ?? 20));
  const [minimum, setMinimum] = useState(String((settings?.depositMinimumPence ?? 1500) / 100));
  const [fee, setFee] = useState(settings?.noShowFeePence == null ? "" : String(settings.noShowFeePence / 100));
  const [message, setMessage] = useState("");
  if (!settings) return null;
  return (
    <section>
      <h1>Settings</h1>
      <p>{DRAFT}</p>
      <form onSubmit={(event) => { event.preventDefault(); void salon.updateSettings({ depositPercent: Number(percent), depositMinimumPence: Math.round(Number(minimum) * 100), noShowFeePence: fee === "" ? null : Math.round(Number(fee) * 100) }).then((msg) => setMessage(msg ?? "Saved for new bookings only.")); }}>
        <label>Salon deposit %<input value={percent} onChange={(e) => setPercent(e.target.value)} /></label>
        <label>Salon deposit minimum £<input value={minimum} onChange={(e) => setMinimum(e.target.value)} /></label>
        <label>No-show fee £ (blank uses the deposit cap)<input value={fee} onChange={(e) => setFee(e.target.value)} /></label>
        <button className="btn" type="submit">Save deposit rules</button>
      </form>
      <ul>
        <li>Hold minutes: {settings.holdMinutes ?? "[HOLD MINUTES]"} (SAMPLE salon value when set)</li>
        <li>Patch-test validity: {settings.patchValidityDays ?? "[PATCH TEST VALIDITY – salon sets]"}</li>
        <li>Cancellation window: {settings.cancellationNoticeHours ?? "[CANCELLATION WINDOW]"}</li>
        <li>Travel fee: {settings.travelFeePence == null ? "[TRAVEL FEE – Tony to set]" : formatGBP(settings.travelFeePence)}</li>
        <li>Shipping: {settings.shippingRatePence == null ? "[SHIPPING RATE – Tony to set]" : formatGBP(settings.shippingRatePence)}</li>
        <li>Email provider: {settings.providerEmail}</li>
        <li>SMS: {settings.smsEnabled ? "on" : "off"} · {settings.providerSms}</li>
        <li>Tips policy: {settings.tipsPolicy}</li>
        <li>Soft opt-in: {settings.softOptIn ? "on" : "off"}</li>
        <li>Membership: {settings.membershipBenefits} · {settings.membershipPricePence == null ? "[PRICE]" : formatGBP(settings.membershipPricePence)}</li>
        <li>Offline device security: staff mode is PIN-gated. Client health data is AES-GCM encrypted with a key derived from the device PIN. See the README.</li>
        <li>Marketplace: disabled. Mobile artist marketplace: later phase [MARKETPLACE – later phase]</li>
      </ul>
      <button className="btn-ghost" type="button" onClick={() => { const files = salon.exportCsv(); const blob = new Blob([files.clients ?? ""], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "clients.csv"; a.click(); }}>Export clients CSV</button>
      {message && <p role="status">{message}</p>}
    </section>
  );
}
