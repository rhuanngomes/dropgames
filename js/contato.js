const nomeInput = document.getElementById('nome');
const nomeError = document.getElementById('nome-error');
const telefoneInput = document.getElementById('telefone');
const telefoneError = document.getElementById('telefone-error');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const form = document.querySelector('.formulario');

const commonDomains = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'uol.com.br',
  'bol.com.br'
];

function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, () => []);

  for (let i = 0; i <= b.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}

function getSuggestedDomain(domain) {
  let bestMatch = null;
  let bestDistance = Infinity;

  for (const candidate of commonDomains) {
    const distance = levenshteinDistance(domain, candidate);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = candidate;
    }
  }

  return { match: bestMatch, distance: bestDistance };
}

function setError(input, errorElement, message) {
  errorElement.textContent = message;
  input.classList.add('erro');
}

function clearError(input, errorElement) {
  errorElement.textContent = '';
  input.classList.remove('erro');
}

function validateNome() {
  const value = nomeInput.value.trim();

  if (!value) {
    setError(nomeInput, nomeError, 'Digite seu nome completo.');
    return false;
  }

  if (value.length < 3) {
    setError(nomeInput, nomeError, 'O nome deve ter pelo menos 3 caracteres.');
    return false;
  }

  clearError(nomeInput, nomeError);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();

  if (!value) {
    setError(emailInput, emailError, 'Digite um e-mail válido.');
    return false;
  }

  if (!emailInput.validity.valid) {
    setError(emailInput, emailError, 'Digite um e-mail válido.');
    return false;
  }

  const parts = value.split('@');
  const localPart = parts[0];
  const domain = parts[1];

  if (!domain) {
    setError(emailInput, emailError, 'Digite um e-mail com @ e domínio válido.');
    return false;
  }

  const domainLower = domain.toLowerCase();
  const { match, distance } = getSuggestedDomain(domainLower);

  if (distance === 0) {
    clearError(emailInput, emailError);
    return true;
  }

  if (distance <= 3) {
    setError(
      emailInput,
      emailError,
      `Esse domínio parece incorreto. Você quis dizer ${localPart}@${match}?`
    );
    return false;
  }

  setError(
    emailInput,
    emailError,
    `"${domain}" não foi reconhecido. Verifique o e-mail digitado.`
  );
  return false;
}

function validateTelefone() {
  const rawValue = telefoneInput.value.trim();
  const digits = rawValue.replace(/\D/g, '');

  if (!digits) {
    setError(
      telefoneInput,
      telefoneError,
      'Digite um celular válido com DDD. Ex: (31) 99999-9999'
    );
    return false;
  }

  if (!/^[1-9][0-9]{10}$/.test(digits)) {
    setError(
      telefoneInput,
      telefoneError,
      'Digite um celular válido com DDD. Ex: (31) 99999-9999'
    );
    return false;
  }

  clearError(telefoneInput, telefoneError);
  return true;
}

function formatPhoneNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : '';
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

form.addEventListener('submit', (event) => {
  const nomeValido = validateNome();
  const telefoneValido = validateTelefone();
  const emailValido = validateEmail();

  if (!nomeValido || !telefoneValido || !emailValido) {
    event.preventDefault();
  }
});

nomeInput.addEventListener('input', () => {
  if (nomeInput.classList.contains('erro')) {
    clearError(nomeInput, nomeError);
  }
});

telefoneInput.addEventListener('input', (event) => {
  const formattedValue = formatPhoneNumber(event.target.value);
  event.target.value = formattedValue;

  if (telefoneInput.classList.contains('erro')) {
    clearError(telefoneInput, telefoneError);
  }
});

emailInput.addEventListener('input', () => {
  if (emailInput.classList.contains('erro')) {
    clearError(emailInput, emailError);
  }
});
