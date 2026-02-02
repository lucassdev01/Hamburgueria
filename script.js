
function abrirModal() {
  document.getElementById('modal').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

function adicionarCarrinho(nome, preco) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const produtoNovo = {
    nome,
    preco,
    qtd: 1,
    obs: ""
  };

  const item = carrinho.find(p =>
    p.nome === produtoNovo.nome &&
    p.preco === produtoNovo.preco &&
    (p.obs || "").trim() === ""
  );

  if (item) {
    item.qtd++;
  } else {
    carrinho.push(produtoNovo);
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
