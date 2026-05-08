const procurar = document.getElementById("procurarApostador");

procurar.addEventListener("input", () => {
  const termo = procurar.value.toLowerCase();

  const apostadores = document.querySelectorAll(".card-apostador");

  apostadores.forEach((apostador) => {
    const id = apostador.dataset.id;
    const nome = apostador.dataset.nome.toLowerCase();
    const cpf = apostador.dataset.cpf;
    const email = apostador.dataset.email.toLowerCase();

    const corresponde =
      id.includes(termo) ||
      nome.includes(termo) ||
      cpf.includes(termo) ||
      email.includes(termo);

    apostador.style.display = corresponde ? "block" : "none";
  });
});
