const lista = document.getElementById("lista-carrinho");
const totalSpan = document.getElementById("total");

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function editarItem(index) {
  const atual = carrinho[index].obs || "";
  const novaObs = prompt(
    "Ex: sem cebola, sem tomate...",
    atual
  );

  if (novaObs !== null) {
    carrinho[index].obs = novaObs.trim();
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderCarrinho();
  }
}

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
      ${item.obs ? `<p class="obs">Obs: ${item.obs}</p>` : ""}
      <p>R$ ${subtotal.toFixed(2)}</p>
    </div>

    <div class="acoes">
      <div class="controle-qtd">
        <button onclick="alterarQtd(${index}, -1)">−</button>
        <span>${item.qtd}</span>
        <button onclick="alterarQtd(${index}, 1)">+</button>
      </div>

      <button class="btn-editar" onclick="editarItem(${index})">
        Editar
      </button>
    </div>
  </div>
`;


  });

  totalSpan.textContent = total.toFixed(2);
}

function alterarQtd(index, valor) {
  carrinho[index].qtd += valor;

  if (carrinho[index].qtd <= 0) {
    carrinho.splice(index, 1);
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderCarrinho();
}


renderCarrinho();

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const formaPagamento = document.getElementById("pagamento").value;

  if (!formaPagamento) {
    alert("Selecione a forma de pagamento.");
    return;
  }

  let mensagem = "*Pedido - Santa Chapa*\n\n";
  let total = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;

    mensagem += `• ${item.qtd}x ${item.nome} - R$ ${subtotal.toFixed(2)}\n`;

    if (item.obs) {
      mensagem += `  _Obs: ${item.obs}_\n`;
    }
  });

  mensagem += `\n*Total:* R$ ${total.toFixed(2)}\n`;
  mensagem += `*Pagamento:* ${formaPagamento}\n`;

  mensagem += `\n📍 Endereço de entrega:\n`;
  mensagem += `Informe seu endereço aqui`;

  const numero = "5511968986681"; // SEU WHATSAPP
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}

function toggleTroco() {
  const pagamento = document.getElementById("pagamento").value;
  const trocoInput = document.getElementById("troco");

  trocoInput.style.display =
    pagamento === "Dinheiro" ? "block" : "none";
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const pagamento = document.getElementById("pagamento").value;
  const cep = document.getElementById("cep").value;
  const endereco = document.getElementById("endereco").value;
  const numero = document.getElementById("numero").value;
  const complemento = document.getElementById("complemento").value;
  const troco = document.getElementById("troco")?.value;

  if (!pagamento) {
    alert("Selecione a forma de pagamento.");
    return;
  }

  if (!cep || !endereco || !numero) {
    alert("Preencha o endereço corretamente.");
    return;
  }

  let mensagem = "*Pedido - Santa Chapa*\n\n";
  let total = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;

    mensagem += `• ${item.qtd}x ${item.nome} - R$ ${subtotal.toFixed(2)}\n`;

    if (item.obs) {
      mensagem += `  _Obs: ${item.obs}_\n`;
    }
  });

  mensagem += `\n*Total:* R$ ${total.toFixed(2)}\n`;
  mensagem += `*Pagamento:* ${pagamento}\n`;

  if (pagamento === "Dinheiro" && troco) {
    mensagem += `*Troco para:* R$ ${troco}\n`;
  }

  mensagem += `\n *Endereço de Entrega*\n`;
  mensagem += `CEP: ${cep}\n`;
  mensagem += `${endereco}, Nº ${numero}\n`;

  if (complemento) {
    mensagem += `Compl.: ${complemento}\n`;
  }

  const numeroWhats = "5511968986681"; // SEU NÚMERO
  const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");

  // limpar carrinho após envio
  localStorage.removeItem("carrinho");
  carrinho = [];
  renderCarrinho();
}


function buscarCEP() {
  const cep = document.getElementById("cep").value.replace(/\D/g, "");

  if (cep.length !== 8) return;

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        alert("CEP não encontrado.");
        return;
      }

      document.getElementById("endereco").value =
        `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
    })
    .catch(() => alert("Erro ao buscar o CEP."));
}