import { expect, test } from "@playwright/test";

test("books a treatment through simulated checkout onto the diary", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  await expect(page.getByRole("status").first()).toContainText("TEST MODE – no real payments");
  await expect(page.getByRole("img", { name: /SalonOS sign/ })).toBeVisible();
  await page.getByRole("link", { name: /Ladies Cut & Blow Dry Short/ }).click();
  await expect(page).toHaveURL(/\/book\/treatment\?service=a1/);
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/\/book\/product\?service=a1/);
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/\/book\/artist\?service=a1/);
  await page.getByRole("button", { name: /SAMPLE – Jordan Hale/ }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/\/book\/time\?service=a1/);
  const slot = page.getByRole("button", { name: /\d{2}\/\d{2}\/\d{4}/ }).first();
  await expect(slot).toBeVisible();
  await slot.click();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/\/book\/extras\?service=a1/);
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/\/book\/checkout\?service=a1/);
  await page.getByLabel("Name").fill("SAMPLE – E2E Guest");
  await page.getByLabel("Mobile").fill("07000 900099");
  await page.getByLabel("Email").fill("sample.e2e@example.com");
  await page.getByRole("checkbox", { name: /booking terms/ }).check();
  await page.getByRole("button", { name: "Simulate test payment" }).click();
  await expect(page.getByRole("heading", { name: "Booking received" })).toBeVisible();

  await page.getByRole("navigation", { name: "Public" }).getByRole("link", { name: "Staff" }).click();
  await page.getByLabel("Device PIN").fill("2580");
  await page.getByRole("button", { name: "Unlock" }).click();
  await page.getByLabel("Username").fill("owner");
  await page.getByLabel("PIN").fill("258013");
  await page.getByLabel(/Second factor/).fill("482913");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: /diary/i })).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: "SAMPLE – E2E Guest" })).toContainText("deposit paid");
});

test("steps the booking flow forward and back without losing the treatment", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Shop the edit" })).toHaveCSS("text-decoration-line", "none");
  await page.getByRole("link", { name: /Ladies Cut & Blow Dry Short/ }).click();
  await expect(page).toHaveURL(/\/book\/treatment\?service=a1/);
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("Home");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("Book");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("Cuts");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("Ladies Cut & Blow Dry Short");
  const ladies = page.getByRole("button", { name: /Ladies Cut & Blow Dry Short/ });
  await expect(ladies).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/\/book\/product\?service=a1/);
  await expect(page.getByRole("heading", { name: /Product for Ladies Cut/ })).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/\/book\/artist\?service=a1/);
  await page.getByRole("button", { name: /SAMPLE – Jordan Hale/ }).click();
  await expect(page.getByRole("button", { name: /SAMPLE – Jordan Hale/ })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page).toHaveURL(/\/book\/product\?service=a1/);
  await page.goBack();
  await expect(page).toHaveURL(/\/book\/treatment\?service=a1/);
  await expect(ladies).toHaveAttribute("aria-pressed", "true");
  await page.goForward();
  await expect(page).toHaveURL(/\/book\/product\?service=a1/);
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/\/book\/artist\?service=a1/);
  await expect(page.getByRole("button", { name: /SAMPLE – Jordan Hale/ })).toHaveAttribute("aria-pressed", "true");
});

test("treatment cards keep their text inside the card", async ({ page }) => {
  await page.goto("/book/treatment");
  await expect(page.getByRole("link", { name: /Request a quote/ }).first()).toBeVisible();
  const tiles = page.locator("a.tile, button.tile");
  const count = await tiles.count();
  expect(count).toBeGreaterThan(10);
  for (let index = 0; index < count; index += 1) {
    const box = await tiles.nth(index).evaluate((el) => ({ scroll: el.scrollHeight, client: el.clientHeight }));
    expect(box.scroll).toBeLessThanOrEqual(box.client + 2);
  }
});

test("shop, product, basket and checkout keep back and continue shopping", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByRole("link", { name: "Continue shopping" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Add and check out" }).first()).toHaveCSS("text-decoration-line", "none");
  const hero = page.locator(".step-banner.contain img");
  const height = await hero.evaluate((el) => el.getBoundingClientRect().height);
  expect(height).toBeLessThanOrEqual(360);
  await page.getByRole("link", { name: "K18 Leave-In Mask 50ml" }).click();
  await expect(page).toHaveURL(/\/shop\/product\/r5/);
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("K18 Leave-In Mask 50ml");
  await page.getByRole("button", { name: "Add to basket" }).click();
  await expect(page).toHaveURL(/\/shop\/basket/);
  await page.getByRole("link", { name: "Continue shopping" }).click();
  await expect(page).toHaveURL(/\/shop$/);
  await page.goto("/shop/checkout?product=r5");
  await expect(page.getByRole("button", { name: "Back", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue shopping" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Sitemap" }).getByRole("link", { name: "LEG-01" })).toBeAttached();
});
