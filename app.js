const allowedSessionModes = new Set(['sticky', 'rotate-between-cases', 'single-request']);

export function validateFixture(fixture) {
  const errors = [];

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fixture.id ?? '')) {
    errors.push('Fixture ID must use lowercase letters, numbers, and hyphens.');
  }

  try {
    const url = new URL(fixture.target);
    if (url.protocol !== 'https:' || !(url.hostname === 'example.test' || url.hostname.endsWith('.example.test'))) {
      errors.push('Use an approved test target under example.test.');
    }
  } catch {
    errors.push('Target must be a valid HTTPS URL.');
  }

  if (!/^[A-Z]{2}$/.test(fixture.expectedMarket ?? '')) {
    errors.push('Expected market must be a two-letter country code.');
  }

  if (!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(fixture.locale ?? '')) {
    errors.push('Locale must look like de or de-DE.');
  }

  if (!/^[A-Za-z_]+(?:\/[A-Za-z0-9_+\-]+)+$/.test(fixture.timezone ?? '')) {
    errors.push('Time zone must use an IANA name such as Europe/Berlin.');
  }

  if (!allowedSessionModes.has(fixture.sessionMode)) {
    errors.push('Choose a supported session mode.');
  }

  if (!Array.isArray(fixture.assertions) || fixture.assertions.length === 0 || fixture.assertions.some(item => !/^[a-z0-9-]+=[^=\n]+$/.test(item))) {
    errors.push('Add at least one assertion in key=value form.');
  }

  return errors;
}

export function serializeFixture(fixture) {
  return `${JSON.stringify(fixture, null, 2)}\n`;
}

function readForm(form) {
  const data = new FormData(form);
  return {
    id: String(data.get('id') ?? '').trim(),
    target: String(data.get('target') ?? '').trim(),
    expectedMarket: String(data.get('expectedMarket') ?? '').trim().toUpperCase(),
    locale: String(data.get('locale') ?? '').trim(),
    timezone: String(data.get('timezone') ?? '').trim(),
    sessionMode: String(data.get('sessionMode') ?? ''),
    assertions: String(data.get('assertions') ?? '').split('\n').map(value => value.trim()).filter(Boolean),
  };
}

function startWorkbench() {
  const form = document.querySelector('#fixture-form');
  const output = document.querySelector('#fixture-output');
  const message = document.querySelector('#fixture-message');
  const copyButton = document.querySelector('#copy-button');
  if (!form || !output || !message || !copyButton) return;

  let current = serializeFixture(readForm(form));
  output.textContent = current;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const fixture = readForm(form);
    const errors = validateFixture(fixture);
    current = serializeFixture(fixture);
    output.textContent = current;
    message.className = errors.length ? 'message error' : 'message success';
    message.textContent = errors.length ? errors.join(' ') : 'Fixture is structurally valid and ready for review.';
  });

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(current);
      message.className = 'message success';
      message.textContent = 'Fixture copied to the clipboard.';
    } catch {
      message.className = 'message error';
      message.textContent = 'Clipboard access is unavailable. Select the preview and copy it manually.';
    }
  });
}

if (typeof document !== 'undefined') startWorkbench();
