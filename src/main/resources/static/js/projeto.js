const API_BASE = 'https://techweek-5idz.onrender.com';

function mostrarMensagem(texto, tipo) {
  const el = document.getElementById('form-msg');
  el.innerHTML = texto;
  el.className = `form-msg ${tipo}`;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function limparMensagem() {
  const el = document.getElementById('form-msg');
  el.textContent = '';
  el.className = 'form-msg';
}

function setBtnCarregando(carregando, etapa) {
  const btn = document.getElementById('btn-cadastrar');

  btn.disabled = carregando;

  if (!carregando) {
    btn.textContent = 'Cadastrar Projeto';
    return;
  }

  const etapas = {
    validando: 'Verificando cadastro…',
    enviando: 'Cadastrando projeto…',
  };

  btn.textContent = etapas[etapa] || 'Aguarde…';
}

function setFieldStatus(id, status) {
  const el = document.getElementById(id);

  if (!el) return;

  el.classList.remove('field-ok', 'field-error');

  if (status) {
    el.classList.add(`field-${status}`);
  }
}

function clearFieldStatuses() {
  ['nome', 'ra', 'projeto', 'descricao']
    .forEach(id => setFieldStatus(id, ''));
}

function validar(nomeResponsavel, ra, nomeProjeto, descricao) {

  if (!nomeResponsavel) {
    mostrarMensagem('Informe o nome do responsável.', 'error');
    setFieldStatus('nome', 'error');
    document.getElementById('nome').focus();
    return false;
  }

  if (!ra || !/^[\d-]{5,12}$/.test(ra)) {
    mostrarMensagem(
      'Informe um RA válido (somente números e hífens, entre 5 e 12 dígitos).',
      'error'
    );

    setFieldStatus('ra', 'error');
    document.getElementById('ra').focus();
    return false;
  }

  if (!nomeProjeto) {
    mostrarMensagem('Informe o nome do projeto.', 'error');
    setFieldStatus('projeto', 'error');
    document.getElementById('projeto').focus();
    return false;
  }

  if (!descricao || descricao.length < 20) {
    mostrarMensagem(
      'A descrição precisa ter pelo menos 20 caracteres.',
      'error'
    );

    setFieldStatus('descricao', 'error');
    document.getElementById('descricao').focus();
    return false;
  }

  return true;
}

async function verificarParticipante(nomeResponsavel, ra) {

  const res = await fetch(`${API_BASE}/participantes`, {
    headers: {
      'Content-Type': 'application/json'
    },
  });

  if (!res.ok) {
    throw new Error(`Erro ao consultar participantes (HTTP ${res.status})`);
  }

  const lista = await res.json();

  const normalizar = str => (str || '').trim().toLowerCase();

  const nomeNorm = normalizar(nomeResponsavel);
  const raNorm = normalizar(ra);

  const participante = lista.find(
    p =>
      normalizar(p.nome) === nomeNorm &&
      normalizar(p.ra) === raNorm
  );

  return {
    encontrado: !!participante,
    participante: participante || null
  };
}

async function verificarProjetoExistente(ra) {

  const res = await fetch(`${API_BASE}/projeto`, {
    headers: {
      'Content-Type': 'application/json'
    },
  });

  if (!res.ok) {
    throw new Error(`Erro ao consultar projetos (HTTP ${res.status})`);
  }

  const lista = await res.json();

  const normalizar = str => (str || '').trim().toLowerCase();

  const raNorm = normalizar(ra);

  return lista.some(
    p => normalizar(p.ra) === raNorm
  );
}

async function enviarProjeto() {

  limparMensagem();
  clearFieldStatuses();

  const nomeResponsavel =
    document.getElementById('nome').value.trim();

  const ra =
    document.getElementById('ra').value.trim();

  const nomeProjeto =
    document.getElementById('projeto').value.trim();

  const descricao =
    document.getElementById('descricao').value.trim();

  if (!validar(nomeResponsavel, ra, nomeProjeto, descricao)) {
    return;
  }

  setBtnCarregando(true, 'validando');

  try {

    let participanteVerif;

    try {

      participanteVerif =
        await verificarParticipante(nomeResponsavel, ra);

    } catch (err) {

      console.warn(
        '[projeto.js] Falha ao verificar participante:',
        err
      );

      mostrarMensagem(
        '⚠️ Não foi possível verificar seu cadastro no momento. Tente novamente em instantes.',
        'error'
      );

      setBtnCarregando(false);
      return;
    }

    if (!participanteVerif.encontrado) {

      setFieldStatus('nome', 'error');
      setFieldStatus('ra', 'error');

      mostrarMensagem(
        '❌ <strong>Participante não encontrado.</strong><br>' +
        'O nome e o RA informados não correspondem a nenhuma inscrição confirmada. ' +
        'Verifique os dados ou <a href="inscricao.html">faça sua inscrição primeiro</a>.',
        'error'
      );

      setBtnCarregando(false);
      return;
    }

    setFieldStatus('nome', 'ok');
    setFieldStatus('ra', 'ok');

    let jaTemProjeto;

    try {

      jaTemProjeto =
        await verificarProjetoExistente(ra);

    } catch (err) {

      console.warn(
        '[projeto.js] Falha ao verificar projetos:',
        err
      );

      mostrarMensagem(
        '⚠️ Não foi possível verificar projetos existentes. Tente novamente em instantes.',
        'error'
      );

      setBtnCarregando(false);
      return;
    }

    if (jaTemProjeto) {

      setFieldStatus('ra', 'error');

      mostrarMensagem(
        '❌ <strong>Projeto já cadastrado.</strong><br>' +
        'Este RA já possui um projeto registrado. Cada participante pode cadastrar apenas um projeto.',
        'error'
      );

      setBtnCarregando(false);
      return;
    }

    setBtnCarregando(true, 'enviando');

    const response = await fetch(`${API_BASE}/projeto`, {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        nomeResponsavel,
        ra,
        nomeProjeto,
        descricao,
      }),
    });

    if (response.ok || response.status === 201) {

      setFieldStatus('projeto', 'ok');
      setFieldStatus('descricao', 'ok');

      mostrarMensagem(
        '✅ <strong>Projeto cadastrado com sucesso!</strong><br>' +
        `"${nomeProjeto}" foi registrado. Em breve ele aparecerá na lista de projetos.`,
        'success'
      );

      document.getElementById('nome').value = '';
      document.getElementById('ra').value = '';
      document.getElementById('projeto').value = '';
      document.getElementById('descricao').value = '';

      clearFieldStatuses();

      const contador =
        document.getElementById('desc-contador');

      if (contador) {
        contador.textContent =
          '0 caracteres (mínimo 20)';

        contador.className = 'desc-counter';
      }

      setTimeout(() => {

        window.location.href = 'index.html';

      }, 1200);

    } else if (response.status === 409) {

      mostrarMensagem(
        '❌ Este RA já possui um projeto cadastrado. Cada participante pode cadastrar apenas um projeto.',
        'error'
      );

    } else {

      let msg =
        'Erro ao cadastrar o projeto. Tente novamente.';

      try {

        const data = await response.json();

        if (data && (data.mensagem || data.message)) {
          msg = data.mensagem || data.message;
        }

      } catch (_) {}

      mostrarMensagem('❌ ' + msg, 'error');
    }

  } catch (err) {

    console.error(
      '[projeto.js] Erro inesperado:',
      err
    );

    mostrarMensagem(
      '❌ Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      'error'
    );

  } finally {

    setBtnCarregando(false);
  }
}

function iniciarContador() {

  const textarea =
    document.getElementById('descricao');

  const contador =
    document.getElementById('desc-contador');

  if (!textarea || !contador) return;

  const MIN = 20;

  textarea.addEventListener('input', () => {

    const len =
      textarea.value.trim().length;

    contador.textContent =
      `${len} caractere${len !== 1 ? 's' : ''} (mínimo ${MIN})`;

    contador.className =
      len >= MIN
        ? 'desc-counter ok'
        : 'desc-counter';
  });
}

document.addEventListener('DOMContentLoaded', () => {

  ['nome', 'ra', 'projeto'].forEach(id => {

    document.getElementById(id)
      ?.addEventListener('keydown', e => {

        if (e.key === 'Enter') {
          enviarProjeto();
        }
      });
  });

  iniciarContador();
});
