const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const nomeError = document.getElementById('nome-error');
const emailError = document.getElementById('email-error');
const senhaError = document.getElementById('senha-error');
const sucessoMessage = document.getElementById('sucesso-message');
const form = document.querySelector('.formulario');

const senhaRequisitos = document.getElementById('senha-requisitos');
const forcaIndicador = document.getElementById('forca-indicador');
const forcaTexto = document.getElementById('forca-texto');
const reqComprimento = document.getElementById('req-comprimento');
const reqMaiuscula = document.getElementById('req-maiuscula');
const reqMinuscula = document.getElementById('req-minuscula');
const reqNumero = document.getElementById('req-numero');
const reqEspecial = document.getElementById('req-especial');

const commonDomains = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'uol.com.br',
  'bol.com.br'
];

const senhasComuns = [
  '123456', '123456789', 'qwerty', 'password', '12345', '12345678', '111111',
  '1234567', 'abc123', 'password1', '123123', 'admin', 'letmein', 'welcome',
  'monkey', '1234567890', 'iloveyou', 'princess', 'rockyou', '12345678910',
  'sunshine', 'qwerty123', 'football', 'baseball', 'superman', 'trustno1',
  'jennifer', 'jordan', 'harley', 'ranger', 'iwantu', 'andrew', 'tigger',
  'shadow', 'buster', 'robert', 'thomas', 'daniel', 'matthew', 'jennifer',
  'hunter', 'michelle', 'william', 'christopher', 'samantha', 'michael',
  'ashley', 'joshua', 'pepper', '11111111', 'jessica', 'nicole', 'anthony',
  'patrick', 'summer', 'jordan23', 'flower', 'taylor', 'bubbles', 'butterfly',
  'computer', 'dragon', 'whatever', 'mercedes', 'corvette', 'diamond',
  'ferrari', 'cheese', 'master', 'jordan', 'slipknot', 'snoopy', 'boomer',
  'whatever', 'smokey', 'guitar', 'nothing', 'batman', 'zaq1zaq1', 'qazwsx',
  'fuckyou', 'fuckoff', 'asshole', 'motherfucker', 'pussy', 'cunt', 'bitch'
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

function verificarRequisito(elemento, condicao) {
  if (condicao) {
    elemento.classList.add('valido');
    elemento.classList.remove('ativo');
    elemento.querySelector('.requisito-icone').textContent = '✓';
  } else {
    elemento.classList.add('ativo');
    elemento.classList.remove('valido');
    elemento.querySelector('.requisito-icone').textContent = '✗';
  }
}

function calcularForcaSenha(senha) {
  let pontos = 0;

  if (senha.length >= 8) pontos += 1;
  if (senha.length >= 12) pontos += 1;

  if (/[a-z]/.test(senha)) pontos += 1;
  if (/[A-Z]/.test(senha)) pontos += 1;
  if (/[0-9]/.test(senha)) pontos += 1;
  if (/[^a-zA-Z0-9]/.test(senha)) pontos += 1;

  if (senha.toLowerCase() === senha) pontos -= 0.5;
  if (senha.toUpperCase() === senha) pontos -= 0.5;
  if (/^(.)\1+$/.test(senha)) pontos -= 1;
  if (/123|abc|qwe/i.test(senha)) pontos -= 0.5;

  return Math.max(0, Math.min(5, pontos));
}

function atualizarChecklistSenha(senha) {
  verificarRequisito(reqComprimento, senha.length >= 8);
  verificarRequisito(reqMaiuscula, /[A-Z]/.test(senha));
  verificarRequisito(reqMinuscula, /[a-z]/.test(senha));
  verificarRequisito(reqNumero, /[0-9]/.test(senha));
  verificarRequisito(reqEspecial, /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha));

  const forca = calcularForcaSenha(senha);
  forcaIndicador.className = '';

  if (forca < 2) {
    forcaIndicador.classList.add('forca-fraca');
    forcaTexto.textContent = 'Muito fraca';
    forcaTexto.className = 'forca-texto fraca';
  } else if (forca < 3.5) {
    forcaIndicador.classList.add('forca-media');
    forcaTexto.textContent = 'Média';
    forcaTexto.className = 'forca-texto media';
  } else {
    forcaIndicador.classList.add('forca-forte');
    forcaTexto.textContent = 'Forte';
    forcaTexto.className = 'forca-texto forte';
  }
}

function mostrarChecklistSenha() {
  senhaRequisitos.style.display = 'block';
}

function esconderChecklistSenha() {
  if (!senhaInput.value) {
    senhaRequisitos.style.display = 'none';
  }
}

function validarSenhaComum(senha) {
  const senhaLower = senha.toLowerCase();

  if (senhasComuns.includes(senhaLower)) {
    return 'Esta senha é muito comum e fácil de adivinhar. Escolha uma senha mais segura.';
  }

  for (const comum of senhasComuns) {
    if (senhaLower.startsWith(comum) && /^\d{1,3}$/.test(senhaLower.slice(comum.length))) {
      return 'Esta senha é uma variação muito simples de uma senha comum. Escolha uma senha mais segura.';
    }
  }

  if (/(.)\1{3,}/.test(senha)) {
    return 'Evite usar caracteres repetidos. Escolha uma senha mais variada.';
  }

  if (/123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(senha)) {
    return 'Evite sequências numéricas ou alfabéticas. Escolha uma senha mais segura.';
  }

  return null;
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

function validateSenha() {
  const value = senhaInput.value.trim();

  if (!value) {
    setError(senhaInput, senhaError, 'Digite uma senha.');
    return false;
  }

  const temComprimento = value.length >= 8;
  const temMaiuscula = /[A-Z]/.test(value);
  const temMinuscula = /[a-z]/.test(value);
  const temNumero = /[0-9]/.test(value);
  const temEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

  if (!temComprimento || !temMaiuscula || !temMinuscula || !temNumero || !temEspecial) {
    setError(senhaInput, senhaError, 'A senha deve atender a todos os requisitos de segurança.');
    return false;
  }

  const erroComum = validarSenhaComum(value);
  if (erroComum) {
    setError(senhaInput, senhaError, erroComum);
    return false;
  }

  clearError(senhaInput, senhaError);
  return true;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const nomeValido = validateNome();
  const emailValido = validateEmail();
  const senhaValida = validateSenha();

  if (nomeValido && emailValido && senhaValida) {
    sucessoMessage.textContent = '✓ Conta criada com sucesso! Bem-vindo ao DropGames!';
    sucessoMessage.style.color = 'green';

    setTimeout(() => {
      const currentPath = window.location.pathname;
      const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
      window.location.href = `${basePath}index.html`;
    }, 2000);
  }
});

nomeInput.addEventListener('input', () => {
  if (nomeInput.classList.contains('erro')) {
    clearError(nomeInput, nomeError);
  }
});

emailInput.addEventListener('input', () => {
  if (emailInput.classList.contains('erro')) {
    clearError(emailInput, emailError);
  }
});

senhaInput.addEventListener('focus', mostrarChecklistSenha);

senhaInput.addEventListener('input', (event) => {
  const senha = event.target.value;
  atualizarChecklistSenha(senha);

  if (senhaInput.classList.contains('erro')) {
    clearError(senhaInput, senhaError);
  }
});

senhaInput.addEventListener('blur', esconderChecklistSenha);
