import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

const html = read('index.html');
const css = read('styles.css');
const appPath = path.join(root, 'app.js');
const { validateFixture, serializeFixture } = await import(pathToFileURL(appPath));

const validFixture = {
  id: 'de-catalog-detail',
  target: 'https://shop.example.test/de/product/field-jacket',
  expectedMarket: 'DE',
  locale: 'de-DE',
  timezone: 'Europe/Berlin',
  sessionMode: 'sticky',
  assertions: ['currency=EUR', 'product-detail=visible'],
};

assert.deepEqual(validateFixture(validFixture), []);
assert.deepEqual(validateFixture({ ...validFixture, expectedMarket: 'Germany' }), [
  'Expected market must be a two-letter country code.',
]);
assert.deepEqual(validateFixture({ ...validFixture, target: 'https://example.com/live-account' }), [
  'Use an approved test target under example.test.',
]);

const serialized = serializeFixture(validFixture);
assert.equal(serialized, `${JSON.stringify(validFixture, null, 2)}\n`);
assert.doesNotMatch(serialized, /password|authorization|proxyUrl|token/i);

for (const heading of [
  'Fixture anatomy',
  'Choose a session boundary',
  'Build a synthetic fixture',
  'From observation to assertion',
  'Safe evidence contract',
  'Limits and responsible use',
]) assert.match(html, new RegExp(heading));

const targetLinks = [...html.matchAll(/href="(https:\/\/xtremeproxy\.com\/[^"]*)"/g)].map(match => match[1]);
assert.deepEqual(targetLinks, [
  'https://xtremeproxy.com/tools/proxy-checker',
  'https://xtremeproxy.com/',
]);

assert.match(html, /href="styles\.css"/);
assert.match(html, /src="app\.js"/);
assert.ok(css.length > 2500, 'stylesheet should provide a complete responsive layout');
assert.doesNotMatch(html + css + read('app.js'), /(?:sk|api|token|password)[_-]?[a-z0-9]{12,}/i);

console.log('github-regional-test-fixtures: ok');
