import { expect, test } from "@playwright/test";

test.describe("about page", () => {
  test("has every section and a resume download", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Frontend engineer and UI architect",
    );
    for (const name of ["Career journey", "Areas of expertise"]) {
      await expect(page.getByRole("region", { name })).toBeAttached();
    }
    // Drafted copy was removed: there is no philosophy section without Sagar's own words.
    await expect(page.getByRole("region", { name: "How I work" })).toHaveCount(0);
    const interests = page.getByRole("region", { name: "Outside work" });
    await expect(interests).toBeAttached();
    await expect(interests.getByText("Cats, especially Persian cats")).toBeAttached();
    const resume = page
      .getByRole("region", { name: /resume/i })
      .getByRole("link", { name: /Download resume/ });
    await expect(resume).toHaveAttribute("download", "");
    await expect(page.getByRole("link", { name: "Full experience" })).toHaveAttribute(
      "href",
      "/experience",
    );
  });

  test("shows the portrait with a description, loaded through next/image", async ({ page }) => {
    await page.goto("/about");
    const portrait = page.getByRole("img", { name: /Sagar Dixit outdoors/ });
    await expect(portrait).toBeVisible();
    await expect(portrait).toHaveAttribute("src", /_next\/image/);
    expect(
      await portrait.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
    ).toBe(true);
  });

  test("has page metadata", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveTitle("About — Sagar Dixit");
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", /\/about$/);
    await expect(page.locator("meta[name='description']")).toHaveAttribute(
      "content",
      /UI Architect/,
    );
  });
});

test.describe("experience page", () => {
  test("shows a timeline with dates, role, company and details", async ({ page }) => {
    await page.goto("/experience");
    await expect(page).toHaveTitle("Experience — Sagar Dixit");
    const roles = page.locator("main ol > li");
    expect(await roles.count()).toBeGreaterThan(0);

    // Newest first.
    await expect(roles.first().getByRole("heading", { level: 3 })).toHaveText("Freelance Engineer");
    await expect(roles.last()).toContainText("Ninestack");

    const airfi = roles.filter({ hasText: "AirFi.aero" });
    await expect(airfi.getByRole("heading", { level: 3 })).toHaveText("Senior Frontend Engineer");
    await expect(airfi.locator("time").first()).toHaveAttribute("dateTime", "2024-05");
    for (const label of ["Responsibilities", "Accomplishments", "Technologies"]) {
      await expect(airfi.getByRole("heading", { level: 4, name: label })).toBeVisible();
    }
    // An entry without accomplishments omits the heading, and a current role says "Present".
    const freelance = roles.first();
    await expect(freelance.getByRole("heading", { level: 4, name: "Accomplishments" })).toHaveCount(
      0,
    );
    await expect(freelance).toContainText("Present");

    await expect(page.getByRole("region", { name: "Education and recognition" })).toContainText(
      "Goa Engineering College",
    );
  });

  test("is reachable from the navigation", async ({ page }) => {
    await page.goto("/");
    if ((page.viewportSize()?.width ?? 0) < 1024) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page
        .getByRole("dialog", { name: "Menu" })
        .getByRole("link", { name: "Experience" })
        .click();
    } else {
      await page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "Experience" })
        .click();
    }
    await expect(page).toHaveURL(/\/experience$/);
  });
});
