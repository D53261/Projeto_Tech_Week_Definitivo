function toggleSerie() {

  const curso =
    document.getElementById('curso').value.trim();

  const serie =
    document.getElementById('serie');

  if (curso) {

    serie.disabled = false;

    if (serie.options[0].text.includes('curso')) {
      serie.options[0].text = 'Selecione...';
    }

  } else {

    serie.disabled = true;

    serie.value = '';

    serie.options[0].text =
      'Selecione um curso primeiro';
  }
}

async function enviarInscricao() {

  const msg =
    document.getElementById('form-msg');

  const nome =
    document.getElementById('nome').value.trim();

  const email =
    document.getElementById('email').value.trim();

  const ra =
    document.getElementById('ra').value.trim();

  const curso =
    document.getElementById('curso').value.trim();

  const serie =
    document.getElementById('serie').value;

  if (!nome || !email) {

    msg.className = 'form-msg error';

    msg.innerText =
      'Preencha os campos obrigatórios!';

    return;
  }

  if (!emailValido(email)) {

    msg.className = 'form-msg error';

    msg.innerText =
      'Email inválido!';

    return;
  }

  const dados = {

    nome,
    email,
    ra,

    curso: curso || 'Não informado',

    serie:
      curso
        ? (serie || 'Não informado')
        : 'Não informado',

    coffe:
      document.getElementById('coffe').checked
  };

  try {

    await API.cadastrarParticipante(dados);

    msg.className = 'form-msg success';

    msg.innerText =
      'Inscrição realizada com sucesso!';

    setTimeout(() => {

      window.location.href = 'index.html';

    }, 1200);

  } catch (e) {

    console.error(e);

    msg.className = 'form-msg error';

    if (e.message && e.message.includes('409')) {

      msg.innerText =
        'Este RA já está cadastrado.';

    } else {

      msg.innerText =
        'Erro ao cadastrar participante.';
    }
  }
}

function emailValido(email) {

  return /\S+@\S+\.\S+/.test(email);
}