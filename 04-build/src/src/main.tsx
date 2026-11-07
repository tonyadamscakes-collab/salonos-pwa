import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { salon } from "./data/session";
import { Basket, Book, Club, Enquiry, Home, MyBookings, ProductPage, ServicePage, Shop, ShopCheckout, Vouchers } from "./ui/public";
import { LegalIndex, LegalPage } from "./ui/legal-page";
import { BackToTop, Breadcrumbs, FooterSitemap, TopNav } from "./ui/nav";
import { StaffApp } from "./ui/staff";
import { Photo } from "./ui/Photo";
import { OPTIONS } from "./ui/photos";
import "./ui/app.css";

function BookIndex() {
  const location = useLocation();
  return <Navigate to={`/book/treatment${location.search}`} replace />;
}

function Shell() {
  const [ready, setReady] = useState(false);
  const [, bump] = useState(0);
  useEffect(() => {
    const stop = salon.subscribe(() => bump((n) => n + 1));
    void salon.init().then(() => setReady(true));
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js");
    }
    const onOff = () => bump((n) => n + 1);
    window.addEventListener("online", onOff);
    window.addEventListener("offline", onOff);
    return () => {
      stop();
      window.removeEventListener("online", onOff);
      window.removeEventListener("offline", onOff);
    };
  }, []);
  const offline = salon.offline || !navigator.onLine;
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="banner" role="status">
        <strong>TEST MODE – no real payments</strong>
      </div>
      <div className="banner sample">SAMPLE DATA. Fictional clients and staff. Prices on request stay as [PRICE].</div>
      {offline && (
        <div className="banner offline" role="status">
          OFFLINE, {salon.pending.length} changes waiting
        </div>
      )}
      <TopNav />
      <main id="main" className="wrap">
        {ready ? (
          <>
            <Breadcrumbs />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/treatments/:id" element={<ServicePage />} />
              <Route path="/book" element={<BookIndex />} />
              <Route path="/book/:step" element={<Book />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/product/:id" element={<ProductPage />} />
              <Route path="/shop/basket" element={<Basket />} />
              <Route path="/shop/checkout" element={<ShopCheckout />} />
              <Route path="/club" element={<Club />} />
              <Route path="/my" element={<MyBookings />} />
              <Route path="/enquiry" element={<Enquiry />} />
              <Route path="/vouchers" element={<Vouchers />} />
              <Route path="/legal" element={<LegalIndex />} />
              <Route path="/legal/:id" element={<LegalPage />} />
              <Route path="/team/*" element={<StaffApp />} />
            </Routes>
          </>
        ) : (
          <p>Loading the salon…</p>
        )}
      </main>
      <footer className="wrap footer">
        <Photo shot={OPTIONS.careers} alt="" sizes="100vw" />
        <FooterSitemap />
        <p>SalonOS · [SALON NAME]. The salon is the seller. SalonOS does not hold client money.</p>
        <p>[OPERATOR LEGAL NAME], [OPERATOR ADDRESS], [OPERATOR EMAIL], [VAT NUMBER], [ICO REGISTRATION]</p>
        <p>Preview build. <a href="/legal/LEG-23">Operator privacy notice</a>. No analytics. Database host: [DATABASE HOST].</p>
      </footer>
      <BackToTop />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  </StrictMode>,
);
