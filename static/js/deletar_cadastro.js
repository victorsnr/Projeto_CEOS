document.querySelectorAll('.btnDeletarCadastro').forEach(btn => {
    btn.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        const nome = event.target.dataset.nome;
        deletarCadastro(id, nome);
        location.reload();
    });
});


function deletarCadastro(id, nome) {

    const confirmar = confirm(`Deseja deletar ${nome}?`);

    if (!confirmar) return;

    fetch(`/api/deletar_cadastro/${id}`, {
        method: "DELETE"
    });

}