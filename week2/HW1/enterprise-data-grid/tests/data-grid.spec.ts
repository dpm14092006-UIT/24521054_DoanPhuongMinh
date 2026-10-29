import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("DataGrid keyboard and ARIA", async ({ page }) => {
  await page.goto("http://localhost:4173/");

  const grid = page.getByRole("grid", {
    name: "Danh sách nhân viên",
  });

  await expect(grid).toBeVisible();

  // Header + five data rows on page 1
  await expect(
    grid.getByRole("row")
  ).toHaveCount(6);

  // Focus the first sortable header
  await grid.getByRole("button", {
    name: /Sắp xếp cột ID/,
  }).focus();

  // Move to the first data cell
  await page.keyboard.press("ArrowDown");

  await expect(
    grid.getByRole("gridcell").first()
  ).toBeFocused();

  // Enter selects row
  await page.keyboard.press("Enter");

  await expect(
    grid.getByRole("row", { selected: true })
  ).toHaveCount(1);

  // Space toggles selection off
  await page.keyboard.press("Space");

  await expect(
    grid.getByRole("row", { selected: true })
  ).toHaveCount(0);
});

test("DataGrid has no detected axe violations", async ({
  page,
}) => {
  await page.goto("http://localhost:4173/");

  const results = await new AxeBuilder({
    page,
  }).analyze();

  expect(results.violations).toEqual([]);
});
