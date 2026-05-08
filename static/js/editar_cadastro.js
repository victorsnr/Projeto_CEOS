document.addEventListener("DOMContentLoaded", () => {
  const nomeInput = document.getElementById("editarNome");
  const telefoneInput = document.getElementById("editarTelefone");
  const form = document.getElementById("formEditarCadastro");
  const message = document.getElementById("messageEditarCadastro");

  const modal = document.getElementById("modalEditarCadastro");
  const closeModal = document.getElementById("closeModalEditarCadastro");

  if (closeModal && modal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  let idAtual = null;

  document.getElementById("cancel").addEventListener("click", (event) => {
    event.preventDefault();
    form.reset();
    message.textContent = "";
    document
      .querySelectorAll("input")
      .forEach((input) => input.classList.remove("input-error"));
    modal.style.display = "none";
  });

  document.querySelectorAll(".btnEditarCadastro").forEach((btn) => {
    btn.addEventListener("click", async () => {
      idAtual = btn.dataset.id;

      message.textContent = "";
      try {
        const response = await fetch(`/api/obter_cadastro/${idAtual}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const apostador = await response.json();

        document.getElementById("editarNome").value = apostador.nome;
        document.getElementById("editarEmail").value = apostador.email;
        document.getElementById("editarTelefone").value = apostador.telefone;

        modal.style.display = "block";
      } catch (error) {
        console.error("Erro ao buscar dados do apostador:", error);
      }
    });
  });

  if (nomeInput) {
    nomeInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.toUpperCase();
    });
  }

  if (telefoneInput) {
    telefoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");

      if (value.length > 11) {
        value = value.substring(0, 11);
      }

      if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
      } else if (value.length > 6) {
        value = value.replace(/^(\d{2})(\d{4,5})(\d{0,4})$/, "($1) $2-$3");
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
      } else {
        value = value.replace(/^(\d*)$/, "($1");
      }

      e.target.value = value;
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("editarNome").value;
    const email = document.getElementById("editarEmail").value;
    const telefone = document
      .getElementById("editarTelefone")
      .value.replace(/\D/g, "");

    form
      .querySelectorAll("input")
      .forEach((input) => input.classList.remove("input-error"));

    if (telefone.length < 10 || telefone.length > 11) {
      message.textContent = "Telefone inválido.";
      document.getElementById("editarTelefone").classList.add("input-error");
      return;
    }

    const payload = {
      nome: nome,
      email: email,
      telefone: telefone,
    };

    try {
      const response = await fetch(`/api/editar_cadastro/${idAtual}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        message.textContent = "Cadastro editado com sucesso!";
        form.reset();
      } else {
        const error = await response.json();
        message.textContent = error.message || "Erro ao editar cadastro.";
      }

      location.reload();
    } catch (error) {
      message.textContent = "Erro ao conectar com o servidor.";
    }
  });
});
