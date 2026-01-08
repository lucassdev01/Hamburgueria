
function abrirModal() {
  document.getElementById('modal').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

function adicionarCarrinho(nome, preco) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const item = carrinho.find(p => p.nome === nome);

  if (item) {
    item.qtd++;
  } else {
    carrinho.push({ nome, preco, qtd: 1 });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  mostrarMensagem();
}

function mostrarMensagem() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
