const API = (() => {
  const BASE_URL = 'https://techweek-5idz.onrender.com';

  const headers = () => ({
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  });

  function getToken() {
    return sessionStorage.getItem('tw_token');
  }
  function setToken(token) {
    sessionStorage.setItem('tw_token', token);
  }
  function clearToken() {
    sessionStorage.removeItem('tw_token');
  }

  async function request(method, path, body = null) {

    const opts = {
      method,
      headers: headers()
    };

    if (body) {
      opts.body = JSON.stringify(body);
    }

    const res = await fetch(`${BASE_URL}${path}`, opts);

    if (!res.ok) {

      const texto = await res.text();

      console.error('Resposta do backend:', texto);

      throw new Error(`Erro ${res.status}`);
    }

    if (res.status === 204) {
      return null;
    }

    const contentType = res.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    
    const texto = await res.text();
    
    console.error('Resposta inesperada:', texto);
    
    throw new Error('Resposta inválida do servidor');
  }

  return {
    async login(usuario, senha) {
      const data = await request('POST', '/auth/login', { usuario, senha });
      if (data.token) setToken(data.token);
      return data;
    },
    logout: clearToken,
    isAdmin: () => !!getToken(),

    getStats() {
      return request('GET', '/stats');
    },

    getProjetos() {
      return request('GET', '/projeto');
    },
    cadastrarProjeto(dados) {
      return request('POST', '/projeto', dados);
    },

    cadastrarParticipante(dados) {
      return request('POST', '/participantes', dados);
    },

    getParticipantes() {
        return request('GET', '/participantes');
    },

    confirmarCoffe(dados) {
      return request('POST', '/participantes/coffe-break', dados);
    },

    getPatrocinadores() {
      return request('GET', '/patrocinadores');
    },
  };
})();
