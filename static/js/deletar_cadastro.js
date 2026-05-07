document.querySelectorAll('.btnDeletarCadastro').forEach(btn => {
    btn.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        const nome = event.target.dataset.nome;
        const sucesso = deletarCadastro(id, nome);
        if (sucesso){
            location.reload();
        }
    });
});


async function deletarCadastro(id, nome) {

    const confirmar = confirm(`Deseja deletar ${nome}?`);

    if (!confirmar) return false;

    const response = await fetch(`/api/deletar_cadastro/${id}`, {
        method: "DELETE"
    });

    return response.ok

}