import { test, expect } from '@playwright/test';

test('filter, sort, pagination and empty results', async ({ page }) => {
  await page.goto('http://localhost:4173/');
  const grid = page.getByRole('grid', { name: 'Danh sách nhân viên' });
  const rows = grid.locator('tbody tr');
  await expect(rows).toHaveCount(5);
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(rows).toHaveCount(5);
  await expect(grid.getByRole('gridcell').first()).toBeFocused();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(rows).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
  await page.getByLabel('Lọc dữ liệu').fill('Finance');
  await expect(rows).toHaveCount(4);
  await expect(page.getByRole('status')).toContainText('4 kết quả');
  await page.getByRole('button', { name: /Sắp xếp cột Name/ }).click();
  await expect(grid.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending');
  await page.getByRole('button', { name: /Sắp xếp cột Name/ }).click();
  await expect(grid.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'descending');
  await page.getByLabel('Lọc dữ liệu').fill('zzzz-no-match');
  await expect(page.getByText('Không tìm thấy dữ liệu phù hợp.')).toBeVisible();
  await expect(rows).toHaveCount(0);
});
