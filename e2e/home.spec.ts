import { test, expect } from "@playwright/test";

test.describe("Systems Index homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("presents Matt and Kyber with the approved hierarchy", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", {
        name: "Leading teams and building production software.",
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Matt Voget / Engineering leader + builder"),
    ).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Matt Voget" }).first(),
    ).toHaveAttribute("src", "/profile.jpeg");
    await expect(
      page.getByRole("heading", {
        name: "Kubernetes-native infrastructure for persistent AI agents.",
      }),
    ).toBeVisible();
    await expect(page.getByLabel(/Kyber architecture/)).toBeVisible();
  });

  test("links to live work and shows the career journey", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /Kyber Explore the live platform site/i }),
    ).toHaveAttribute("href", "https://kyber.voget.io");
    await expect(
      page.getByRole("link", { name: /Snapdex A product shipped/i }),
    ).toHaveAttribute("href", "https://snapdex.ai");
    await expect(
      page.getByText("Writing").locator("xpath=ancestor::a"),
    ).toHaveCount(0);
    await expect(
      page.getByText("Lockheed Martin", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Director of Engineering", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Current", { exact: true })).toBeVisible();
    await expect(page.getByText("→ Ivanti", { exact: true })).toBeVisible();
    await expect(page.getByText("→ SmartBear", { exact: true })).toBeVisible();
    await expect(page.getByText("→ Gravitee", { exact: true })).toBeVisible();
  });

  test("has correct social and contact links", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "GitHub" }).last(),
    ).toHaveAttribute("href", "https://github.com/matty-v");
    await expect(
      page.getByRole("link", { name: "LinkedIn" }).last(),
    ).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/matthew-voget-47a225a1/",
    );
    await expect(
      page.getByRole("link", { name: "Email" }).last(),
    ).toHaveAttribute("href", "mailto:matt.voget@gmail.com");
  });

  test("uses the compact navigation on mobile without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(
      page.getByRole("navigation").filter({ hasText: "Dispatches" }).last(),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});

test.describe("Legal pages", () => {
  for (const [link, heading, path] of [
    ["Privacy", "Privacy Policy", "/privacy"],
    ["Terms", "Terms and Conditions", "/terms"],
  ] as const) {
    test(`${heading} navigates and returns home`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("link", { name: link }).click();
      await expect(page).toHaveURL(path);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
      await page.getByRole("link", { name: "Back to Home" }).click();
      await expect(page).toHaveURL("/");
    });
  }
});
