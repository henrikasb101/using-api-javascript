const GUI = {
    inputPanel: {
        instance: document.querySelector('.panel.input'),
        input: document.getElementById('drink'),
        button: document.getElementById('search'),
        wrapper: document.querySelector('.panel .search'),
    },
    loader: document.querySelector('.panel.loader'),
    resultPanel: {
        instance: document.querySelector('.panel.results'),
        list: document.querySelector('.panel.results .list'),
        button: document.getElementById('back'),
    },
};

function validateInput(value = null) {
    return (
        value !== null &&
        value.length >= 4 &&
        value.length <= 32 &&
        /^[a-z A-Z]+$/.test(value)
    );
}

function searchInvalid() {
    if (!GUI.inputPanel.wrapper.classList.contains('invalid')) {
        GUI.inputPanel.wrapper.classList.add('invalid');
    }
}

function searchValid() {
    if (GUI.inputPanel.wrapper.classList.contains('invalid')) {
        GUI.inputPanel.wrapper.classList.remove('invalid');
    }
}

function hidePanel(element) {
    if (!element.classList.contains('hidden')) {
        element.classList.add('hidden');

        setTimeout(() => {
            if (element.classList.contains('start')) {
                element.classList.remove('start');
            }

            element.classList.add('done');
        }, 100);
    }
}

function showPanel(element, panelName) {
    if (element.classList.contains('hidden')) {
        setTimeout(() => {
            element.classList.remove('done');
            setTimeout(() => {
                element.classList.remove('hidden');

                if (panelName === 'loader') {
                    element.classList.add('start');
                }
            }, 100);
        }, 100);
    }
}

function createImgElement(strDrinkThumb) {
    let img = document.createElement('img');
    img.src = strDrinkThumb;
    return img;
}

function createTextElement(strDrink, strInstructions) {
    let textWrapper = document.createElement('div');
    let title = document.createElement('h2');
    let instructions = document.createElement('p');
    
    textWrapper.classList.add('text');
    title.textContent = strDrink;
    instructions.innerHTML = strInstructions;

    textWrapper.appendChild(title);
    textWrapper.appendChild(instructions);

    return textWrapper;
}

function createListDataHeaders() {
    let listHeaders = document.createElement('li');
    let span1 = document.createElement('span');
    let span2 = document.createElement('span');
    
    span1.classList.add('header');
    span1.innerHTML = 'Measurement';
    span2.classList.add('header');
    span2.innerHTML = 'Ingridient';
    
    listHeaders.appendChild(span1);
    listHeaders.appendChild(span2);

    return listHeaders;
}

function createDataList(data) {
    let ingridients = [
        data.strIngredient1, data.strIngredient2, data.strIngredient3,
        data.strIngredient4, data.strIngredient5, data.strIngredient6,
        data.strIngredient7, data.strIngredient8, data.strIngredient9,
        data.strIngredient10, data.strIngredient11, data.strIngredient12,
        data.strIngredient13, data.strIngredient14, data.strIngredient15,
    ];

    let measurements = [
        data.strMeasure1, data.strMeasure2, data.strMeasure3,
        data.strMeasure4, data.strMeasure5, data.strMeasure6,
        data.strMeasure7, data.strMeasure8, data.strMeasure9,
        data.strMeasure10, data.strMeasure11, data.strMeasure12,
        data.strMeasure13, data.strMeasure14, data.strMeasure15,
    ];

    let iList = document.createElement('ul');
    iList.appendChild(createListDataHeaders());

    if (ingridients.length == measurements.length) {
        for (let i in ingridients) {
            if (ingridients[i] != null) {
                let iListItem = document.createElement('li');
                let span1 = document.createElement('span');
                let span2 = document.createElement('span');

                span1.innerHTML = (measurements[i] !== null) ? measurements[i] : '&nbsp;';
                span2.innerHTML = ingridients[i];
                
                iListItem.appendChild(span1);
                iListItem.appendChild(span2);
                iList.appendChild(iListItem);
            }
        }
    }

    return iList;
}

function createItem(data) {
    let item = document.createElement('li');
    item.classList.add('item');

    item.appendChild(createImgElement(data.strDrinkThumb));
    item.appendChild(createTextElement(data.strDrink, data.strInstructions));
    item.appendChild(createDataList(data));

    return item;
}

async function handleResults(json) {
    if (json.drinks !== null) {
        for (let jsonItem of json.drinks) {
            GUI.resultPanel.list.appendChild(createItem(jsonItem));
        }
    } else {
        let error = document.createElement('li');
        error.classList.add('error');
        error.innerHTML = `Oops! Didn't find anything..<br>Try looking for something else!`;
        GUI.resultPanel.list.appendChild(error);
    }
}

async function getJSON(response) {
    if (response.ok) {
        hidePanel(GUI.loader);
        showPanel(GUI.resultPanel.instance);
        handleResults(await response.json());
    } else {
        alert("Error: " + response.status);
    }
}

async function getResults(input) {
    await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input}`)
    .then(getJSON);
}

function search() {
    let input = GUI.inputPanel.input.value;
    GUI.inputPanel.input.value = '';
    let isInputValid = validateInput(input);

    if (isInputValid) {
        hidePanel(GUI.inputPanel.instance);
        showPanel(GUI.loader, 'loader');

        setTimeout(() => {
            getResults(input);
        }, 200);
    } else {
        searchInvalid();
    }
}

function validity() {
    let isInputValid = validateInput(this.value);
    (isInputValid) ? searchValid() : searchInvalid();
}

GUI.inputPanel.button.addEventListener('click', () => search());
GUI.inputPanel.input.addEventListener('input', validity);

GUI.inputPanel.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        search();
    }
});





