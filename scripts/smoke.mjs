import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173';
const server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '4173'], { stdio: 'inherit' });
const errors = [];

async function waitForReady() {
  for (let i = 0; i < 50; i++) {
    try {
      const response = await fetch(base);
      if (response.ok) return;
    } catch { /* dev server is starting */ }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error('Vite preview did not start');
}
async function loadImages(page) {
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    images.forEach(image => { image.loading = 'eager'; });
    await Promise.all(images.map(image => image.decode().catch(() => undefined)));
  });
}
async function noHorizontalOverflow(page, name) {
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth
  }));
  assert.ok(dimensions.documentWidth <= dimensions.viewport + 2, name + ' overflow: ' + JSON.stringify(dimensions));
}
let browser;
try {
  await waitForReady();
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  mkdirSync('artifacts', { recursive: true });

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  desktop.on('pageerror', error => errors.push('desktop: ' + error.message));
  await desktop.goto(base, { waitUntil: 'networkidle' });
  assert.match(await desktop.locator('h1').innerText(), /Better things/);
  assert.equal(await desktop.locator('.product-card').count(), 3);
  await noHorizontalOverflow(desktop, 'desktop');
  await loadImages(desktop);
  await desktop.screenshot({ path: 'artifacts/desktop.png', fullPage: true });

  await desktop.getByRole('button', { name: 'Explore the concept: The Everyday Scrub' }).click();
  assert.equal(await desktop.getByRole('dialog').count(), 1);
  assert.match(await desktop.getByRole('dialog').innerText(), /in development/i);
  await desktop.keyboard.press('Escape');
  assert.equal(await desktop.getByRole('dialog').count(), 0);
  await desktop.getByLabel('Your email address').fill('sample@example.org');
  await desktop.getByRole('button', { name: 'Preview early access signup' }).click();
  assert.match(await desktop.getByRole('status').innerText(), /no email was collected or saved/i);

  const tablet = await browser.newPage({ viewport: { width: 820, height: 1180 }, deviceScaleFactor: 1 });
  tablet.on('pageerror', error => errors.push('tablet: ' + error.message));
  await tablet.goto(base, { waitUntil: 'networkidle' });
  await noHorizontalOverflow(tablet, 'tablet');
  await loadImages(tablet);
  await tablet.screenshot({ path: 'artifacts/tablet.png', fullPage: true });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  mobile.on('pageerror', error => errors.push('mobile: ' + error.message));
  await mobile.goto(base, { waitUntil: 'networkidle' });
  await noHorizontalOverflow(mobile, 'mobile');
  await mobile.getByRole('button', { name: 'Open menu' }).click();
  assert.equal(await mobile.getByRole('navigation', { name: 'Mobile navigation' }).isVisible(), true);
  await mobile.getByRole('navigation', { name: 'Mobile navigation' }).getByText('Materials').click();
  assert.equal(await mobile.getByRole('navigation', { name: 'Mobile navigation' }).isVisible(), false);
  await mobile.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await loadImages(mobile);
  await mobile.screenshot({ path: 'artifacts/mobile.png', fullPage: true });
  const narrow = await browser.newPage({ viewport: { width: 320, height: 760 }, deviceScaleFactor: 1 });
  await narrow.goto(base, { waitUntil: 'networkidle' });
  await noHorizontalOverflow(narrow, '320px phone');
  assert.deepEqual(errors, []);
  console.log('✓ Desktop, tablet and mobile smoke checks passed; screenshots saved.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
