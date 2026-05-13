const API_BASE = 'http://localhost:8080';


function mostrarMensagem(texto, tipo) {
  const el = document.getElementById('form-msg');
  el.textContent = texto;
  el.className = `form-msg ${tipo}`;
}

function limparMensagem() {
  const el = document.getElementById('form-msg');
  el.textContent = '';
  el.className = 'form-msg';
}

function setBtnCarregando(carregando) {
  const btn = document.getElementById('btn-confirmar');
  if (carregando) {
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

function mostrarView(id) {
  ['view-form', 'view-success', 'view-not-found'].forEach(v => {
    document.getElementById(v).style.display = v === id ? '' : 'none';
  });
}

function voltarForm() {
  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';
  limparMensagem();
  mostrarView('view-form');
}


function validarCampos(nome, email) {
  if (!nome.trim()) {
    mostrarMensagem('Por favor, informe seu nome completo.', 'error');
    document.getElementById('nome').focus();
    return false;
  }
  if (!email.trim() || !email.includes('@')) {
    mostrarMensagem('Por favor, informe um e-mail válido.', 'error');
    document.getElementById('email').focus();
    return false;
  }
  return true;
}


async function confirmarCoffe() {

  limparMensagem();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!validarCampos(nome, email)) {
    return;
  }

  setBtnCarregando(true);

  try {

    const data = await API.confirmarCoffe({
      nome,
      email
    });

    document.getElementById('success-desc').textContent =
      data?.mensagem ||
      `${nome}, você está confirmado(a) no coffe break da Tech Week!`;

    mostrarView('view-success');

  } catch (err) {

    console.error(err);

    if (err.message.includes('404')) {

      mostrarView('view-not-found');

    } else if (err.message.includes('409')) {

      document.getElementById('success-desc').textContent =
        `${nome}, seu coffe break já estava confirmado anteriormente.`;

      mostrarView('view-success');

    } else {

      mostrarMensagem(
        'Erro ao confirmar presença no coffe break.',
        'error'
      );
    }

  } finally {

    setBtnCarregando(false);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  ['nome', 'email'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') confirmarCoffe();
    });
  });
});

window.confirmarCoffe = confirmarCoffe;
window.voltarForm = voltarForm;