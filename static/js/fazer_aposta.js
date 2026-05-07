document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fazerAposta');
    const cpfInput = document.getElementById('cpfAposta');
    const valorInput = document.getElementById('valor');
    const tipoApostaSelect = document.getElementById('tipo_aposta');
    const message = document.getElementById('messageAposta');

    const modal = document.getElementById('modalFazerAposta');
    const openModal = document.getElementById('openModalFazerAposta');
    const closeModal = document.getElementById('closeModalFazerAposta');
    
    if (openModal && modal) {
        openModal.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }
    
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }

    if (valorInput) {
        valorInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value === '') value = '0';
            
            value = (parseInt(value) / 100).toFixed(2);
                
            value = value
            .replace('.', ',')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            
            e.target.value = 'R$ ' + value;
        });
    }
    
    document.getElementById('cancel').addEventListener('click', async(event) => {
        event.preventDefault();
        form.reset();
        message.textContent = '';
        document.querySelectorAll('input, select').forEach(el => el.classList.remove('input-error'));
        modal.style.display = 'none';
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        
        const cpf = formData.get('cpf').replace(/\D/g, '');
        let valor = formData.get('valor').replace(/\D/g, '');

        if (!valor) valor = '0';

        valor = (parseInt(valor) / 100).toFixed(2);

        document.querySelectorAll('input, select').forEach(el => el.classList.remove('input-error'));

        //Validação CPF
        if (cpf.length !== 11) {
            message.textContent = 'CPF inválido.';
            cpfInput.classList.add('input-error');
            return;
        }

        //Validação valor
        if (parseFloat(valor) <= 0) {
            message.textContent = 'Valor inválido.';
            valorInput.classList.add('input-error');
            return;
        }

        if (!formData.get('tipo_aposta')) {
            message.textContent = 'Selecione o tipo de aposta.';
            tipoApostaSelect.classList.add('input-error');
            return;
        }

        const resultados_possiveis = ['GANHOU', 'PERDEU'];
        const resultado = resultados_possiveis[Math.floor(Math.random() * resultados_possiveis.length)];

        const payload = {
            cpf: cpf,
            tipo_aposta: formData.get('tipo_aposta'),
            valor: parseFloat(valor),
            resultado: resultado
        };

        const response = await fetch('/api/apostar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            message.textContent = 'Aposta realizada!';
            form.reset();
        } else {
            const error = await response.json();
            message.textContent = error.message || 'Erro ao realizar aposta.';
        }
    });
});