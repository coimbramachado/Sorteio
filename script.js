function wordBtn() {
    localStorage.setItem("raffleType", "w");
    window.location.assign("palavras.html");
}

const optionsInput = document.getElementById('input');

function separateOptions() {
    const options = optionsInput.value.split(",");
    return options.map(option => option.trim()); // Remove espaços em branco
}

function showMessage(message, color, borderColor) {
    const msgBox = document.getElementById('message');
    msgBox.style.backgroundColor = color;
    msgBox.style.border = `solid 1px ${borderColor}`;
    msgBox.innerHTML = message;

    $("#message").stop(true, true).slideDown(80).delay(3000).fadeOut(400);
}

const quantityInputWords = document.getElementById('quantityInputWords');

function limitQuantityWords() {
    const optionsQuantity = separateOptions().length;

    if (quantityInputWords.value > optionsQuantity) {
        quantityInputWords.value = optionsQuantity;
        showMessage("Não é possível sortear uma quantidade maior de opções do que a quantidade escrita!", "#FFDEDE", "#300000");
    }

    localStorage.setItem("quantityWords", quantityInputWords.value);
}

function pluralWords() {
    const pluralWords = document.getElementById('pluralWords');
    pluralWords.innerHTML = quantityInputWords.value > 1 ? "opções da lista acima" : "opção da lista acima";
}

function raffleWords(options, optionsQuantity) {
    const uniqueOptions = new Set(options);

    if (quantityInputWords.value > uniqueOptions.size) {
        showMessage("Alguma opção foi repetida!", "#FFDEDE", "#300000");
        return [];
    }

    const raffledOptions = new Set();
    while (raffledOptions.size < quantityInputWords.value) {
        const randomIndex = Math.floor(Math.random() * optionsQuantity);
        const raffled = options[randomIndex];
        raffledOptions.add(raffled);
    }

    return [...raffledOptions];
}

function btnClickWords() {
    const options = separateOptions();
    const optionsQuantity = options.length;

    if (optionsInput.value === "") {
        showMessage("Insira alguma opção para ser sorteada!", "#FFDEDE", "#300000");
    } else if (optionsQuantity < 2) {
        showMessage("Insira pelo menos 2 opções para sortear!", "#FFDEDE", "#300000");
    } else {
        const raffledOptions = raffleWords(options, optionsQuantity);

        if (raffledOptions.length !== 0) {
            // Remove as opções já sorteadas do array de opções
            const updatedOptions = options.filter(option => !raffledOptions.includes(option));
            localStorage.setItem("raffledOptions", JSON.stringify(raffledOptions));
            localStorage.setItem("optionsQuantity", updatedOptions.length);
            localStorage.setItem("options", JSON.stringify(updatedOptions));

            // Atualiza o histórico de sorteios
            updateRaffledHistory(raffledOptions);

            // Atualiza o input de opções
            optionsInput.value = updatedOptions.join(", "); // Atualiza o campo de entrada com as opções restantes

            window.location.assign("sorteio.html");
        }
    }
}

function updateRaffledHistory(raffledOptions) {
    debugger
    let raffledHistory = JSON.parse(localStorage.getItem("raffledHistory")) || [];
    raffledHistory.push(...raffledOptions); // Adiciona as novas opções sorteadas
    localStorage.setItem("raffledHistory", JSON.stringify(raffledHistory)); // Salva no localStorage
}

function showRaffledHistory() {
    debugger
    const raffledHistory = JSON.parse(localStorage.getItem("raffledHistory")) || [];
    const historyDiv = document.getElementById('raffledHistory'); // Certifique-se de ter um elemento para mostrar o histórico

    historyDiv.innerHTML = " "; // Limpa o histórico anterior
    if (raffledHistory.length === 0) {
        historyDiv.innerHTML = "Nenhuma opção sorteada ainda.";
    } else {
        const list = document.createElement("ul");
        raffledHistory.forEach(option => {
            const listItem = document.createElement("li");
            listItem.textContent = option;
            list.appendChild(listItem);
        });
        historyDiv.appendChild(list);
    }
}


const quantityInputNumbers = document.getElementById('quantityInputNumbers');

function limitQuantityNumbers() {
    const min = document.getElementById('minNumber');
    const max = document.getElementById('maxNumber');

    if (max.value === min.value) {
        max.value++;
        showMessage("Os limites do número não podem ser iguais!", "#FFDEDE", "#300000");
    }

    const quantityNumbers = Math.abs(max.value - min.value);

    if (quantityInputNumbers.value > quantityNumbers) {
        quantityInputNumbers.value = quantityNumbers;
        showMessage("Não é possível sortear uma quantidade de números maior do que a do limite delimitado!", "#FFDEDE", "#300000");
    }

    localStorage.setItem("quantityNumbers", quantityInputNumbers.value);
}

function countDown() {
    showResult();
}

function showResult() {
    const raffleType = localStorage.getItem("raffleType");
    const resultMessage = document.getElementById('resultMessage');

    if (raffleType === "w") {
        const quantityWords = localStorage.getItem("quantityWords");

        resultMessage.innerHTML = quantityWords > 1 ? `Sorteadas ${quantityWords} opções:` : `Sorteada 1 opção:`;

        const raffledOptions = JSON.parse(localStorage.getItem("raffledOptions"));
        raffledOptions.forEach(option => {
            const results = document.createElement("button");
            results.innerHTML = option;
            results.classList.add("result");
            results.addEventListener("click", copyText);

            const resultDiv = document.querySelector(".result-container");
            resultDiv.appendChild(results);
        });

        $("#resultMessage").delay(100).slideDown(150);
        $(".result").delay(200).fadeIn(100);
    }

    $("#back").delay(250).slideDown(100);
    $("#repeat").delay(250).slideDown(100);
}

async function copyText() {
    const raffleType = localStorage.getItem("raffleType");

    if (raffleType === "w") {
        const text = JSON.parse(localStorage.getItem("raffledOptions"));
        await navigator.clipboard.writeText(text.join(", ")); // Copia como texto separado por vírgula
    }

    showMessage("Sorteio copiado com sucesso!", "#DEFFDE", "#003000");
}

function goBack() {
    window.location.assign("index.html");
}

function repeat() {
    window.location.href = "javascript:history.back()";
}

function clearRaffledHistory() {
    // Remove o histórico do localStorage
    localStorage.removeItem("raffledHistory");

    // Atualiza a interface para mostrar que o histórico foi limpo
    const historyDiv = document.getElementById('raffledHistory');
    historyDiv.innerHTML = "Nenhuma opção sorteada ainda."; // Mensagem padrão

    // Mensagem de confirmação ao usuário (opcional)
    showMessage("Histórico de sorteios limpo com sucesso!", "#DEFFDE", "#003000");
}
