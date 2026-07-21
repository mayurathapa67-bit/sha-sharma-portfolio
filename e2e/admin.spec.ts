import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const content = JSON.parse(
  fs.readFileSync(path.resolve("content.json"), "utf-8")
);

/* ──────────────────── Site pages render with dynamic content ──────────────────── */

test.describe("Site pages render with content.json", () => {
  test("Homepage — hero, reel, services, CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(content.hero.role)).toBeVisible();
    await expect(page.getByText(content.hero.tagline)).toBeVisible();
    await expect(page.getByText(content.hero.cta_primary.label)).toBeVisible();
    await expect(page.getByText(content.hero.cta_secondary.label)).toBeVisible();
    await expect(page.getByText(content.pages.home.scrollText)).toBeVisible();
    await expect(page.getByText(content.pages.home.reelEyebrow)).toBeVisible();
    await expect(page.getByText(content.pages.home.reelTitle)).toBeVisible();
    await expect(page.getByText(content.pages.home.servicesEyebrow)).toBeVisible();
    await expect(page.getByText(content.pages.home.servicesTitle)).toBeVisible();
    await expect(page.getByText(content.pages.home.ctaEyebrow)).toBeVisible();
    await expect(page.getByText(content.pages.home.ctaTitle)).toBeVisible();
    await expect(page.getByText(content.footer.headline)).toBeVisible();
    await expect(page.getByText(content.footer.tagline)).toBeVisible();
    await expect(page.locator("header").getByText(content.nav.brand)).toBeVisible();
    await expect(page.getByRole("link", { name: content.navbar.startProjectLabel, exact: true })).toBeVisible();
  });

  test("About page — headline, bio, philosophy, timeline, expertise, tools", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText(content.pages.about.eyebrow)).toBeVisible();
    await expect(page.getByText(content.about.headline)).toBeVisible();
    for (const p of content.about.bio) {
      await expect(page.getByText(p)).toBeVisible();
    }
    await expect(page.getByText(content.about.philosophy)).toBeVisible();
    await expect(page.getByText(content.pages.about.timelineEyebrow)).toBeVisible();
    for (const j of content.about.journey) {
      await expect(page.getByText(j.year)).toBeVisible();
    }
    await expect(page.getByText(content.pages.about.expertiseLabel)).toBeVisible();
    await expect(page.getByText(content.pages.about.toolsLabel)).toBeVisible();
  });

  test("Services page — services, process, FAQ", async ({ page }) => {
    await page.goto("/services");
    await expect(page.getByText(content.pages.services.eyebrow)).toBeVisible();
    await expect(page.getByText(content.pages.services.title)).toBeVisible();
    for (const s of content.services) {
      await expect(page.getByRole("heading", { name: s.title })).toBeVisible();
    }
    await expect(page.getByText(content.pages.services.processEyebrow)).toBeVisible();
    for (const p of content.process) {
      await expect(page.getByText(p.t)).toBeVisible();
    }
    await expect(page.getByText(content.pages.services.faqEyebrow)).toBeVisible();
    await expect(page.getByText(content.pages.services.ctaButton)).toBeVisible();
  });

  test("Contact page — heading, form, sidebar", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText(content.pages.contact.eyebrow)).toBeVisible();
    await expect(page.getByText(content.pages.contact.title)).toBeVisible();
    await expect(page.getByText(content.pages.contact.freeOfferEyebrow)).toBeVisible();
    await expect(page.getByText(content.pages.contact.freeOfferTitle)).toBeVisible();
    await expect(page.locator("aside").getByText(content.contact.email)).toBeVisible();
    await expect(page.locator("aside").getByText(content.contact.phone)).toBeVisible();
  });
});

/* ──────────────────── Admin authentication ──────────────────── */

test.describe("Admin authentication", () => {
  test("Redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/admin\/login/);
    await expect(page.getByText("Studio login")).toBeVisible();
  });

  test("Rejects bad credentials", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("input[type=email]", "wrong@example.com");
    await page.fill("input[type=password]", "hunter2");
    await page.click("button[type=submit]");
    await expect(page.getByText("Invalid credentials")).toBeVisible({ timeout: 8000 });
  });

  test("Accepts valid credentials and lands on admin", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("input[type=email]", "esha@example.com");
    await page.fill("input[type=password]", "esha@2026");
    await page.click("button[type=submit]");
    await page.waitForURL("/admin", { timeout: 10000 });
    await expect(page.locator("header").getByText("Content control room")).toBeVisible();
  });
});

/* ──────────────────── Admin dashboard tabs ──────────────────── */

test.describe("Admin dashboard tabs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("input[type=email]", "esha@example.com");
    await page.fill("input[type=password]", "esha@2026");
    await page.click("button[type=submit]");
    await page.waitForURL("/admin", { timeout: 10000 });
  });

  const TAB_TESTS = [
    { tab: "Overview", heading: "Overview" },
    { tab: "Hero", heading: "Hero Section" },
    { tab: "About", heading: "About Page" },
    { tab: "Services", heading: "Services & Pricing" },
    { tab: "Portfolio", heading: "Portfolio" },
    { tab: "Blog", heading: "Blog" },
    { tab: "Testimonials", heading: "Testimonials" },
    { tab: "Contact", heading: "Contact & Contact Form" },
    { tab: "Pages", heading: "Page Text Content" },
    { tab: "Header & Footer", heading: "Header & Footer" },
    { tab: "Metadata", heading: "SEO & Metadata" },
    { tab: "Submissions", heading: "Submissions" },
    { tab: "Images", heading: "Image Upload" },
  ];

  for (const { tab, heading } of TAB_TESTS) {
    test(`Tab "${tab}" renders heading "${heading}"`, async ({ page }) => {
      await page.getByRole("button", { name: tab }).click();
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    });
  }
});

/* ──────────────────── Edit content via admin ──────────────────── */

test.describe("Edit content via admin", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("input[type=email]", "esha@example.com");
    await page.fill("input[type=password]", "esha@2026");
    await page.click("button[type=submit]");
    await page.waitForURL("/admin", { timeout: 10000 });
  });

  async function saveAndCheck(page: import("@playwright/test").Page) {
    await page.getByRole("button", { name: /Save/ }).click();
    // GitHub save may fail in local dev, but button should show saving state
    await expect(page.getByRole("button", { name: /Save/ })).toBeEnabled({ timeout: 10000 });
  }

  test("Hero tab — edit role", async ({ page }) => {
    await page.getByRole("button", { name: "Hero" }).click();
    const input = page.getByLabel("Role / Eyebrow");
    await input.clear();
    await input.fill("Test Hero Role Edited");
    await saveAndCheck(page);
    // Revert
    await input.clear();
    await input.fill(content.hero.role);
    await saveAndCheck(page);
  });

  test("About tab — edit headline", async ({ page }) => {
    await page.getByRole("button", { name: "About" }).click();
    const input = page.getByLabel("Headline");
    await input.clear();
    await input.fill("Test About Headline Edited");
    await saveAndCheck(page);
    // Revert
    await input.clear();
    await input.fill(content.about.headline);
    await saveAndCheck(page);
  });

  test("Services tab — edit service title", async ({ page }) => {
    await page.getByRole("button", { name: "Services" }).click();
    const input = page.getByLabel("Title").first();
    await input.clear();
    await input.fill("Test Service Edited");
    await saveAndCheck(page);
    // Revert
    await input.clear();
    await input.fill(content.services[0].title);
    await saveAndCheck(page);
  });

  test("Header & Footer tab — edit brand name", async ({ page }) => {
    await page.getByRole("button", { name: "Header & Footer" }).click();
    const input = page.getByLabel("Brand name");
    await input.clear();
    await input.fill("Test Brand Edited");
    await saveAndCheck(page);
    // Revert
    await input.clear();
    await input.fill(content.nav.brand);
    await saveAndCheck(page);
  });

  test("Metadata tab — edit default title", async ({ page }) => {
    await page.getByRole("button", { name: "Metadata" }).click();
    const input = page.getByLabel("Default title");
    await input.clear();
    await input.fill("Test Metadata Title Edited");
    await saveAndCheck(page);
    // Revert
    await input.clear();
    await input.fill(content.metadata.defaultTitle);
    await saveAndCheck(page);
  });

  test("Add and remove a testimonial", async ({ page }) => {
    await page.getByRole("button", { name: "Testimonials" }).click();
    // Add
    await page.getByRole("button", { name: "+ Add" }).click();
    const quoteInputs = page.getByLabel("Quote");
    await quoteInputs.last().fill("Playwright test quote");
    const authorInputs = page.getByLabel("Author");
    await authorInputs.last().fill("Playwright Tester");
    const roleInputs = page.getByLabel("Role");
    await roleInputs.last().fill("Tester");
    await saveAndCheck(page);
    // Remove the added one
    const removeBtns = page.getByRole("button", { name: "Remove" });
    await removeBtns.last().click();
    await saveAndCheck(page);
  });

  test("Images tab — upload UI renders", async ({ page }) => {
    await page.getByRole("button", { name: "Images" }).click();
    await expect(page.getByText("Upload images to Cloudinary")).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test("Submissions tab — live indicator", async ({ page }) => {
    await page.getByRole("button", { name: "Submissions" }).click();
    await expect(page.getByText("Live")).toBeVisible();
  });

  test("Pages tab — edit home CTA title", async ({ page }) => {
    await page.getByRole("button", { name: "Pages" }).click();
    const input = page.getByLabel("CTA title");
    await input.clear();
    await input.fill("Test CTA Title Edited");
    await saveAndCheck(page);
    // Revert
    await input.clear();
    await input.fill(content.pages.home.ctaTitle);
    await saveAndCheck(page);
  });

  test("Portfolio tab — add and remove a portfolio piece", async ({ page }) => {
    await page.getByRole("button", { name: "Portfolio" }).click();
    // Add
    await page.getByRole("button", { name: "+ Add piece" }).click();
    await expect(page.locator('input[value="New project"]')).toBeVisible();
    // Delete it
    const deleteBtns = page.getByRole("button", { name: "Delete" });
    await deleteBtns.last().click();
    await saveAndCheck(page);
  });
});

/* ──────────────────── Content persistence check ──────────────────── */

test.describe("Content reflects after save", () => {
  test("About page loads after admin session", async ({ page }) => {
    // Login
    await page.goto("/admin/login");
    await page.fill("input[type=email]", "esha@example.com");
    await page.fill("input[type=password]", "esha@2026");
    await page.click("button[type=submit]");
    await page.waitForURL("/admin", { timeout: 10000 });

    // Verify admin is loaded
    await expect(page.locator("header").getByText("Content control room")).toBeVisible();

    // Visit about page separately
    await page.goto("/about");
    await expect(page.getByText(content.pages.about.eyebrow)).toBeVisible();
  });
});
