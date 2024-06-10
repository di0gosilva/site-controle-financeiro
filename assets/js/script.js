document.addEventListener("DOMContentLoaded", () => {
    const formEntrada = document.getElementById("form-entrada");
    const listaEntrada = document.getElementById("lista-entrada");
    const buttonEntrada = document.getElementById("submit-button-entrada");

    const formDespesa = document.getElementById("form-despesa");
    const listaDespesa = document.getElementById("lista-despesa");
    const buttonDespesa = document.getElementById("submit-button-despesa");

    const saldoEntradaElement = document.querySelector(".saldo-entrada");
    const saldoSaidaElement = document.querySelector(".saldo-saida");
    const saldoMesElement = document.querySelector(".saldo-mes");

    let saldoChart, entradasChart, despesasChart;

    const sair = document.querySelector(".button-sair")
    sair.addEventListener("click", () => {
        setTimeout(() => {
            window.location.href = "index.html"
        }, 500)
    })

    // Função para carregar entradas do localStorage
    function loadEntradas() {
        let entradas = JSON.parse(localStorage.getItem('entradas')) || [];
        entradas.forEach(entrada => addEntradaToDOM(entrada));
        updateSaldoEntrada();
    }

    // Função para carregar despesas do localStorage
    function loadDespesas() {
        let despesas = JSON.parse(localStorage.getItem('despesas')) || [];
        despesas.forEach(despesa => addDespesaToDOM(despesa));
        updateSaldoSaida();
    }

    // Função para salvar entradas no localStorage
    function saveEntradas(entradas) {
        localStorage.setItem('entradas', JSON.stringify(entradas));
    }

    // Função para salvar despesas no localStorage
    function saveDespesas(despesas) {
        localStorage.setItem('despesas', JSON.stringify(despesas));
    }

    // Função para obter entradas do localStorage
    function getEntradas() {
        return JSON.parse(localStorage.getItem('entradas')) || [];
    }

    // Função para obter despesas do localStorage
    function getDespesas() {
        return JSON.parse(localStorage.getItem('despesas')) || [];
    }

    // Função para adicionar uma entrada ao DOM
    function addEntradaToDOM(entrada) {
        let entradaDiv = document.createElement("div");
        entradaDiv.classList.add("entrada");
        entradaDiv.innerHTML = `
            <div class="card-valor-descricao">
                <span class="descricao-entrada">${entrada.descricaoEntrada}</span>
                <span class="valor-entrada">R$ ${entrada.valorEntrada}</span>
                <div class="botoes">
                    <button class="editar-entrada"><i class="ri-edit-line"></i></button>
                    <button class="remover-entrada"><i class="ri-delete-bin-line"></i></button>
                </div>
            </div>
            <span class="data-entrada">${entrada.dataEntrada}</span>
        `;
        listaEntrada.appendChild(entradaDiv);
    }

    // Função para adicionar uma despesa ao DOM
    function addDespesaToDOM(despesa) {
        let despesaDiv = document.createElement("div");
        despesaDiv.classList.add("despesa");
        despesaDiv.innerHTML = `
            <span class="categoria">${despesa.categoria}</span>
            <div class="card-valor-descricao">
                <span class="descricao">${despesa.descricao}</span>
                <span class="valor">R$ ${despesa.valor}</span>
                <div class="botoes">
                    <button class="editar-despesa"><i class="ri-edit-line"></i></button>
                    <button class="remover-despesa"><i class="ri-delete-bin-line"></i></button>
                </div>
            </div>
            <span class="data">${despesa.data}</span>
        `;
        listaDespesa.appendChild(despesaDiv);
    }

    // Função para limpar e converter o valor para número
    function cleanAndConvertToNumber(input) {
        let cleanedInput = input.replace(/[^\d.,-]/g, '').replace(',', '.');
        return parseFloat(cleanedInput) || 0;
    }

    // Função para atualizar o saldo de entradas
    function updateSaldoEntrada() {
        let entradas = getEntradas();
        let totalEntrada = entradas.reduce((total, entrada) => total + cleanAndConvertToNumber(entrada.valorEntrada), 0);
        saldoEntradaElement.innerHTML = `R$ ${totalEntrada.toFixed(2)}`;
        updateSaldoMes();
        createEntradasChart(entradas);
    }

    // Função para atualizar o saldo de saídas
    function updateSaldoSaida() {
        let despesas = getDespesas();
        let totalSaida = despesas.reduce((total, despesa) => total + cleanAndConvertToNumber(despesa.valor), 0);
        saldoSaidaElement.innerHTML = `R$ ${totalSaida.toFixed(2)}`;
        updateSaldoMes();
        createDespesasChart(despesas);
    }

    // Função para atualizar o saldo do mês
    function updateSaldoMes() {
        let totalEntradaElement = parseFloat(saldoEntradaElement.textContent.replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;
        let totalSaidaElement = parseFloat(saldoSaidaElement.textContent.replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;
        let saldoMes = totalEntradaElement - totalSaidaElement;
        saldoMesElement.innerHTML = `R$ ${saldoMes.toFixed(2)}`;
        createSaldoChart(totalEntradaElement, totalSaidaElement, saldoMes);
    }

    function createSaldoChart(totalEntrada, totalSaida, saldoMes) {
        const ctx = document.getElementById('saldo-chart').getContext('2d');
        if (saldoChart) saldoChart.destroy(); // Destroi gráfico anterior se existir
        saldoChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Entradas', 'Saídas', 'Saldo Mês'],
                datasets: [{
                    data: [totalEntrada, totalSaida, saldoMes],
                    backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Resumo do Mês'
                    }
                }
            },
        });
    }

    function createEntradasChart(entradas) {
        const ctx = document.getElementById('entradas-chart').getContext('2d');
        if (entradasChart) entradasChart.destroy(); // Destroi gráfico anterior se existir
        let categorias = entradas.map(entrada => entrada.descricaoEntrada);
        let valores = entradas.map(entrada => cleanAndConvertToNumber(entrada.valorEntrada));
        entradasChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categorias,
                datasets: [{
                    data: valores,
                    backgroundColor: categorias.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`),
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Distribuição das Entradas'
                    }
                }
            },
        });
    }

    function createDespesasChart(despesas) {
        const ctx = document.getElementById('despesas-chart').getContext('2d');
        if (despesasChart) despesasChart.destroy(); // Destroi gráfico anterior se existir
        let categorias = despesas.map(despesa => despesa.categoria);
        let valores = despesas.map(despesa => cleanAndConvertToNumber(despesa.valor));
        despesasChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categorias,
                datasets: [{
                    data: valores,
                    backgroundColor: categorias.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`),
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Distribuição das Despesas'
                    }
                }
            },
        });
    }

    // Função para adicionar ou editar uma entrada
    function handleSubmitEntrada(e) {
        e.preventDefault();

        let dataEntrada = document.getElementById("data-entrada").value;
        let descricaoEntrada = document.getElementById("descricao-entrada").value;
        let valorEntrada = document.getElementById("valor-entrada").value;

        if (!dataEntrada || !descricaoEntrada || !valorEntrada || cleanAndConvertToNumber(valorEntrada) <= 0) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        let editarEntrada = listaEntrada.querySelector(".editarEntrada");
        let entradas = getEntradas();

        if (editarEntrada) {
            let indexEntrada = Array.from(listaEntrada.children).indexOf(editarEntrada);
            entradas[indexEntrada] = { dataEntrada, descricaoEntrada, valorEntrada };
            editarEntrada.innerHTML = `
                <div class="card-valor-descricao">
                    <span class="descricao-entrada">${descricaoEntrada}</span>
                    <span class="valor-entrada">R$ ${valorEntrada}</span>
                    <div class="botoes">
                        <button class="editar-entrada"><i class="ri-edit-line"></i></button>
                        <button class="remover-entrada"><i class="ri-delete-bin-line"></i></button>
                    </div>
                </div>
                <span class="data-entrada">${dataEntrada}</span>
            `;
            editarEntrada.classList.remove("editarEntrada");
            buttonEntrada.innerText = "Adicionar";
        } else {
            let entrada = { dataEntrada, descricaoEntrada, valorEntrada };
            entradas.push(entrada);
            addEntradaToDOM(entrada);
        }

        saveEntradas(entradas);
        formEntrada.reset();
        updateButtonsEntrada();
        updateSaldoEntrada();
    }

    // Função para adicionar ou editar uma despesa
    function handleSubmit(e) {
        e.preventDefault();

        let data = document.getElementById("data").value;
        let descricao = document.getElementById("descricao").value;
        let valor = document.getElementById("valor").value;
        let categoria = document.getElementById("categoria").value;

        if (!data || !descricao || !categoria || !valor || cleanAndConvertToNumber(valor) <= 0) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        let editarDespesa = listaDespesa.querySelector(".editar");
        let despesas = getDespesas();

        if (editarDespesa) {
            let index = Array.from(listaDespesa.children).indexOf(editarDespesa);
            despesas[index] = { data, descricao, valor, categoria };
            editarDespesa.innerHTML = `
                <span class="categoria">${categoria}</span>
                <div class="card-valor-descricao">
                    <span class="descricao">${descricao}</span>
                    <span class="valor">R$ ${valor}</span>
                    <div class="botoes">
                        <button class="editar-despesa"><i class="ri-edit-line"></i></button>
                        <button class="remover-despesa"><i class="ri-delete-bin-line"></i></button>
                    </div>
                </div>
                <span class="data">${data}</span>
            `;
            editarDespesa.classList.remove("editar");
            buttonDespesa.innerText = "Adicionar";
        } else {
            let despesa = { data, descricao, valor, categoria };
            despesas.push(despesa);
            addDespesaToDOM(despesa);
        }

        saveDespesas(despesas);
        formDespesa.reset();
        updateButtons();
        updateSaldoSaida();
    }

    // Função para atualizar botões de editar e remover entradas
    function updateButtonsEntrada() {
        listaEntrada.querySelectorAll(".editar-entrada").forEach((button, index) => {
            button.addEventListener("click", () => {
                let entrada = listaEntrada.children[index];
                document.getElementById("data-entrada").value = entrada.querySelector(".data-entrada").textContent;
                document.getElementById("descricao-entrada").value = entrada.querySelector(".descricao-entrada").textContent;
                document.getElementById("valor-entrada").value = entrada.querySelector(".valor-entrada").textContent.replace(/[^\d.,-]/g, '');

                listaEntrada.querySelectorAll('.entrada').forEach(e => e.classList.remove("editarEntrada"));
                entrada.classList.add("editarEntrada");

                if (buttonEntrada) {
                    buttonEntrada.innerHTML = "Editar";
                }
            });
        });

        listaEntrada.querySelectorAll(".remover-entrada").forEach(button => {
            button.addEventListener("click", () => {
                let entrada = button.closest(".entrada");
                let index = Array.from(listaEntrada.children).indexOf(entrada);
                let entradas = getEntradas();
                entradas.splice(index, 1);
                saveEntradas(entradas);
                listaEntrada.removeChild(entrada);
                updateSaldoEntrada(); // Atualizar saldo de entradas
            });
        });
    }

    // Função para atualizar botões de editar e remover despesas
    function updateButtons() {
        listaDespesa.querySelectorAll(".editar-despesa").forEach((button, index) => {
            button.addEventListener("click", () => {
                let despesa = listaDespesa.children[index];
                document.getElementById("data").value = despesa.querySelector(".data").textContent;
                document.getElementById("categoria").value = despesa.querySelector(".categoria").textContent;
                document.getElementById("valor").value = despesa.querySelector(".valor").textContent.replace(/[^\d.,-]/g, '');
                document.getElementById("descricao").value = despesa.querySelector(".descricao").textContent;

                listaDespesa.querySelectorAll('.despesa').forEach(d => d.classList.remove("editar"));
                despesa.classList.add("editar");

                if (buttonDespesa) {
                    buttonDespesa.innerText = "Editar";
                }
            });
        });

        listaDespesa.querySelectorAll(".remover-despesa").forEach(button => {
            button.addEventListener("click", () => {
                let despesa = button.closest(".despesa");
                let index = Array.from(listaDespesa.children).indexOf(despesa);
                let despesas = getDespesas();
                despesas.splice(index, 1);
                saveDespesas(despesas);
                listaDespesa.removeChild(despesa);
                updateSaldoSaida(); // Atualizar saldo de saídas
            });
        });
    }

    // Carregar entradas e despesas do localStorage ao carregar a página
    loadEntradas();
    updateButtonsEntrada();
    loadDespesas();
    updateButtons();

    formEntrada.addEventListener("submit", handleSubmitEntrada);
    formDespesa.addEventListener("submit", handleSubmit);
});

// function mostrarTextoResponsivo(){
//     const larguraJanela = window.innerWidth;
//     const divBotoes = document.querySelector(".icons-menu");
//     const textos = divBotoes.querySelectorAll("span");
//     const buttonSair = document.querySelector(".button-sair")
//     const textoSair = buttonSair.querySelector("span")

//     if(larguraJanela <= 400){
//         textos.style.display = 'none';
//         textoSair.style.display = 'none';
//     } else{
//         textos.style.display = 'inline';
//         textoSair.style.display = 'inline';
//     }

//     window.addEventListener('resize', mostrarTextoResponsivo);
//     window.addEventListener('load', mostrarTextoResponsivo);
// }