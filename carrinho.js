const lista = document.getElementById("lista-carrinho");
const totalSpan = document.getElementById("total");

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function renderCarrinho() {
  lista.innerHTML = "";
  let total = 0;

  if (carrinho.length === 0) {
    lista.innerHTML = "<p>Seu carrinho está vazio.</p>";
    totalSpan.textContent = "0.00";
    return;
  }

  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;

    lista.innerHTML += `
      <div class="item-carrinho">
        <img src="img/lanche.png" alt="${item.nome}">
        <div class="info">
          <h4>${item.nome}</h4>
          <p>Qtd: ${item.qtd}</p>
          <p>R$ ${subtotal.toFixed(2)}</p>
        </div>
        <button onclick="removerItem(${index})">Remover</button>
      </div>
    `;
  });

  totalSpan.textContent = total.toFixed(2);
}

function removerItem(index) {
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderCarrinho();
}

renderCarrinho();
