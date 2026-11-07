import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { salon } from "../data/session";
import { legalDocs } from "./legal";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/book/treatment", label: "Book", match: "/book" },
  { to: "/shop", label: "Shop", match: "/shop" },
  { to: "/club", label: "Club", end: true },
  { to: "/vouchers", label: "Vouchers", end: true },
  { to: "/enquiry", label: "Enquiry", end: true },
  { to: "/my", label: "My account", end: true },
  { to: "/team", label: "Staff", match: "/team" },
];

export function TopNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  return (
    <header className="site-header">
      <div className="top">
        <NavLink to="/" aria-label="SalonOS home" onClick={() => setOpen(false)}>
          <img className="wordmark" src="/media/logo-wordmark-dark.svg" alt="SalonOS" width={534} height={170} />
        </NavLink>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav id="site-menu" className={open ? "nav open" : "nav"} aria-label="Public">
          {LINKS.map((item) => {
            const active = item.match ? location.pathname.startsWith(item.match) : location.pathname === item.to;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function categoryCrumb(category: string): string {
  if (category.includes("Cutting")) return "Cuts";
  if (category.includes("Colour")) return "Colour";
  if (category.includes("Treatment")) return "Treatments";
  if (category.includes("Brow")) return "Brows and lashes";
  if (category.includes("Nail")) return "Nails";
  if (category.includes("Wax")) return "Waxing";
  if (category.includes("Facial")) return "Facials";
  if (category === "Packages") return "Packages";
  return category;
}

const STEP_LABEL: Record<string, string> = {
  treatment: "Treatment",
  product: "Product",
  artist: "Artist",
  time: "Time",
  extras: "Extras",
  checkout: "Checkout",
};

export function Breadcrumbs() {
  const location = useLocation();
  if (location.pathname === "/") return null;
  const serviceId = new URLSearchParams(location.search).get("service");
  const service = salon.publicData?.services.find((row) => row.id === serviceId);
  const productId = location.pathname.startsWith("/shop/product/") ? location.pathname.split("/").pop() : "";
  const product = salon.publicData?.products.find((row) => row.id === productId);
  const items: { to: string; label: string }[] = [{ to: "/", label: "Home" }];
  if (location.pathname.startsWith("/book")) {
    items.push({ to: "/book/treatment", label: "Book" });
    if (service) {
      items.push({ to: `/book/treatment?category=${encodeURIComponent(service.category)}`, label: categoryCrumb(service.category) });
      items.push({ to: `/book/treatment?service=${service.id}`, label: service.name });
    }
    const step = location.pathname.split("/")[2] ?? "treatment";
    if (step !== "treatment" && STEP_LABEL[step]) items.push({ to: location.pathname + location.search, label: STEP_LABEL[step] });
  } else if (location.pathname.startsWith("/shop")) {
    items.push({ to: "/shop", label: "Shop" });
    if (product) items.push({ to: location.pathname, label: product.name });
    else if (location.pathname.includes("/basket")) items.push({ to: "/shop/basket", label: "Basket" });
    else if (location.pathname.includes("/checkout")) items.push({ to: "/shop/checkout", label: "Checkout" });
  } else if (location.pathname.startsWith("/legal")) {
    items.push({ to: "/legal", label: "Legal" });
    const id = location.pathname.split("/")[2];
    if (id) items.push({ to: location.pathname, label: id });
  } else if (location.pathname.startsWith("/club")) items.push({ to: "/club", label: "Club" });
  else if (location.pathname.startsWith("/vouchers")) items.push({ to: "/vouchers", label: "Vouchers" });
  else if (location.pathname.startsWith("/enquiry")) items.push({ to: "/enquiry", label: "Enquiry" });
  else if (location.pathname.startsWith("/my")) items.push({ to: "/my", label: "My account" });
  else if (location.pathname.startsWith("/team")) items.push({ to: "/team", label: "Staff" });
  else if (location.pathname.startsWith("/treatments/")) {
    const id = location.pathname.split("/")[2] ?? "";
    const treatment = salon.publicData?.services.find((row) => row.id === id);
    if (treatment) {
      items.push({ to: `/book/treatment?category=${encodeURIComponent(treatment.category)}`, label: categoryCrumb(treatment.category) });
      items.push({ to: location.pathname, label: treatment.name });
    } else items.push({ to: location.pathname, label: "Treatment" });
  }
  return (
    <nav className="crumbs wrap" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.to}-${item.label}`}>
            {index === items.length - 1 ? <span aria-current="page">{item.label}</span> : <Link to={item.to}>{item.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      className="to-top"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      Back to top
    </button>
  );
}

export function FooterSitemap() {
  const docs = legalDocs();
  return (
    <nav className="sitemap" aria-label="Sitemap">
      <div>
        <h2>Visit</h2>
        <Link to="/">Home</Link>
        <Link to="/enquiry">Enquiry</Link>
        <Link to="/my">My account</Link>
        <Link to="/team">Staff</Link>
      </div>
      <div>
        <h2>Book</h2>
        <Link to="/book/treatment">Treatment</Link>
        <Link to="/book/product">Product</Link>
        <Link to="/book/artist">Artist</Link>
        <Link to="/book/time">Time</Link>
        <Link to="/book/extras">Extras</Link>
        <Link to="/book/checkout">Checkout</Link>
      </div>
      <div>
        <h2>Shop</h2>
        <Link to="/shop">Shop</Link>
        <Link to="/shop/basket">Basket</Link>
        <Link to="/club">Club</Link>
        <Link to="/vouchers">Vouchers</Link>
      </div>
      <div>
        <h2>Legal</h2>
        <Link to="/legal">All drafts</Link>
        {docs.map((doc) => (
          <Link key={doc.id} to={`/legal/${doc.id}`}>{doc.id}</Link>
        ))}
      </div>
    </nav>
  );
}

export function ShopTrail() {
  const navigate = useNavigate();
  return (
    <p className="shop-trail">
      <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Back</button>
      <Link className="btn" to="/shop">Continue shopping</Link>
    </p>
  );
}
