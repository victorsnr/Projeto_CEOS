document.addEventListener('DOMContentLoaded', () => {
  
  const form = document.getElementById('novoApostador');
  const message = document.getElementById('message');
  const cpfInput = document.getElementById('cpf');
  const telefoneInput = document.getElementById("telefone");
  const nomeInput = document.getElementById("nome");

  const modal = document.getElementById('modal');
  const openBtn = document.getElementById('openModal');
  const closeBtn = document.getElementById('closeModal');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });
  }
    
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  if (nomeInput) {
    nomeInput.addEventListener('input', function(e) {
      e.target.value = e.target.value.toUpperCase();
    });
  }
  
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 11) {
        value = value.substring(0, 11);
      }
      
      if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (value.length > 6) {
        value = value.replace(/^(\d{2})(\d{4,5})(\d{0,4})$/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else {
        value = value.replace(/^(\d*)$/, '($1');
      }

      e.target.value = value;
    });
  }
  
  if (cpfInput) {
    cpfInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 11) {
        value = value.substring(0, 11);
      }
      
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');;
      e.target.value = value;
    });
  }
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(form);
    
    const cpf = formData.get('cpf').replace(/\D/g, '');
    const data = formData.get('dt_nasc');
    const telefone = formData.get('telefone').replace(/\D/g, '');

    document.querySelectorAll('input').forEach(el => el.classList.remove('input-error'));

    //Validação CPF
    if (cpf.length !== 11) {
      message.textContent = 'CPF inválido.';
      cpfInput.classList.add('input-error');
      return;
    }


    //Validação idade
    const hoje = new Date();
    const nascimento = new Date(data);
    
    if (nascimento > hoje) {
      message.textContent = 'Data de nascimento inválida.';
      document.querySelector('input[name="dt_nasc"]').classList.add('input-error');
      return;
    }
    
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const difMes = hoje.getMonth() - nascimento.getMonth();
    const difDia = hoje.getDate() - nascimento.getDate();
    
    if (difMes < 0 || (difMes === 0 && difDia < 0)) {idade--;}

    if (idade < 18) {
      message.textContent = 'Apostador deve ser maior de 18 anos.';
      document.querySelector('input[name="dt_nasc"]').classList.add('input-error');
      return;
    }

    //Validação telefone
    if (telefone.length < 10 || telefone.length > 11) {
      message.textContent = 'Telefone inválido.';
      document.querySelector('input[name="telefone"]').classList.add('input-error');
      return;
    }

    const payload = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      telefone: formData.get('telefone'),
      cpf: cpf,
      dt_nasc: formData.get('dt_nasc')
    };

    const response = await fetch('/api/cadastrar_apostador', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      message.textContent = 'Apostador cadastrado com sucesso!';
      form.reset();
    } else {
      const error = await response.json();
      message.textContent = error.message || 'Erro ao salvar apostador.';
    }
  });
});