const lista = document.getElementById("lista-carrinho");
const totalSpan = document.getElementById("total");
const freteSpan = document.getElementById("frete");

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
let taxaEntrega = 0;

// =====================
// TABELA DE FRETE POR BAIRRO
// =====================

const FRETE_POR_BAIRRO = {
  "CENTRO": 10,
  "VILA HELENA": 4,
  "CIDADE EDSON": 8,
  "JARDIM CASA BRANCA": 10
};

// valor padrão para bairros não listados
const FRETE_PADRAO = 15;

// =====================
// UTIL
// =====================

function normalizarBairro(nome) {
  if (!nome) return "";

  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/\./g, "")              // remove ponto
    .replace(/\bVL\b/g, "VILA")      // VL -> VILA
    .replace(/\bJD\b/g, "JARDIM")    // JD -> JARDIM
    .replace(/\s+/g, " ")
    .trim();
}


// =====================
// SEU CÓDIGO ORIGINAL
// =====================

function editarItem(index) {
  const atual = carrinho[index].obs || "";
  const novaObs = prompt(
    "Ex: sem cebola, sem tomate...",
    atual
  );

  if (novaObs === null) return;

  const item = carrinho[index];
  const obsNova = novaObs.trim();

  // se só existe 1 unidade, pode editar direto
  if (item.qtd === 1) {
    item.obs = obsNova;
  } else {
    // se tem mais de uma unidade, separa 1 unidade
    item.qtd -= 1;

    const novoItem = {
      ...item,
      qtd: 1,
      obs: obsNova
    };

    carrinho.splice(index + 1, 0, novoItem);
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderCarrinho();
}


function renderCarrinho() {
  lista.innerHTML = "";
  let total = 0;

  if (carrinho.length === 0) {
    lista.innerHTML = "<p>Seu carrinho está vazio.</p>";
    totalSpan.textContent = "0.00";
    if (freteSpan) freteSpan.textContent = "0.00";
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

  if (freteSpan) {
    freteSpan.textContent = taxaEntrega.toFixed(2);
  }

  const totalComEntrega = total + taxaEntrega;
  totalSpan.textContent = totalComEntrega.toFixed(2);
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

function toggleTroco() {
  const pagamento = document.getElementById("pagamento").value;
  const trocoInput = document.getElementById("troco");

  trocoInput.style.display =
    pagamento === "Dinheiro" ? "block" : "none";
}

// =====================
// FINALIZAR
// =====================

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

  if (taxaEntrega <= 0) {
    alert("Informe o CEP para calcular a taxa de entrega.");
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

  mensagem += `\n*Taxa de entrega:* R$ ${taxaEntrega.toFixed(2)}\n`;
  mensagem += `\n*Total:* R$ ${(total + taxaEntrega).toFixed(2)}\n`;
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

  const numeroWhats = "5511968986681";
  const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");

  localStorage.removeItem("carrinho");
  carrinho = [];
  taxaEntrega = 0;
  renderCarrinho();
}

// =====================
// BUSCAR CEP → SOMENTE BAIRRO
// =====================

async function buscarCEP() {
  const cep = document.getElementById("cep").value.replace(/\D/g, "");

  if (cep.length !== 8) return;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();

    if (data.erro) {
      alert("CEP não encontrado.");
      return;
    }

    if (
      !data.localidade ||
      data.localidade.toUpperCase() !== "SUZANO" ||
      data.uf !== "SP"
    ) {
      alert("Entrega disponível somente para Suzano - SP.");
      taxaEntrega = 0;
      renderCarrinho();
      return;
    }

    const enderecoFormatado =
      `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;

    document.getElementById("endereco").value = enderecoFormatado;

    const bairroNormalizado = normalizarBairro(data.bairro);

    if (FRETE_POR_BAIRRO[bairroNormalizado] !== undefined) {
      taxaEntrega = FRETE_POR_BAIRRO[bairroNormalizado];
    } else {
      taxaEntrega = FRETE_PADRAO;
    }

    renderCarrinho();

  } catch (err) {
    console.error(err);
    alert("Erro ao buscar o CEP.");
  }
}

document.getElementById("cep").addEventListener("blur", buscarCEP);
