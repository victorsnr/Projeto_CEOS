const modal = document.getElementById('modalListarApostas');
const closeModal = document.getElementById('closeModalListarApostas');
const lista = document.getElementById('listaApostas');

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


async function listarApostas(apostadorId) {
    if (!modal || !lista) return;
    
    modal.style.display = "block";
    lista.innerHTML = 'Carregando...';

    try {        
        const response = await fetch(`/api/exibir_apostas/${apostadorId}`);
        const apostas = await response.json();

        lista.innerHTML = '';
        
        if (apostas.length === 0) {
            lista.innerHTML = '<p class="messageNoResults"> Nenhuma aposta encontrada.</p>';
        }

        apostas.forEach(aposta => {
            const div = document.createElement('div');

            const valor = parseFloat(aposta.valor)
            .toFixed(2)
            .replace('.', ',');

            div.innerHTML = `
                            <p><strong>Id da Aposta:</strong> ${aposta.id}</p>
                            <p><strong>Valor:</strong> R$ ${valor}</p>
                            <p><strong>Resultado:</strong> ${aposta.resultado}</p>
                            <hr>
                             `;
            
            lista.appendChild(div);
        })

    } catch (error) {
        lista.innerHTML = '<p>Erro ao carregar as apostas.</p>';
    }
}

document.querySelectorAll('.btnListarApostas').forEach(btn => {
    btn.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        listarApostas(id);
    });
});