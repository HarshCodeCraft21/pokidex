let limit = 20;
let offset = 0;
let pokemonAbility = [];
let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
let pokemonTypeUrl = "https://pokeapi.co/api/v2/type/";

let searchPokemon = document.querySelector(".search-pokemon");
let loadMoreButton = document.getElementById("load-more-btn");
let filterBySelect = document.querySelector(".filter-cards");

async function fetchData(URL) {
    let res = await fetch(URL);
    let data = await res.json();

    return data;
};

window.addEventListener('load', async () => {
    let res = await fetchData(url);
    let promise = res.results.map(result => fetchData(result.url));

    let ability = await Promise.all(promise);
    pokemonAbility = [...ability];

    ShowData(pokemonAbility);
});

let outerCardWrraper = document.querySelector('.left-card');
async function ShowData(ability) {
    // console.log(ability);
    outerCardWrraper.innerHTML = "";
    ability.forEach((result) => {
        let card = `
        <div class="card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="${result.sprites.other.dream_world.front_default}" class="pokemon-image"/>
                    <h3>Name:${result.name}</h3>
                    <p>Types:${result.types[0].type.name}</p>
                </div>
                <div class="flip-card-back">
                    <p>Height: ${result.height} cm</p>
                    <p>Weight: ${result.weight} kg</p>
                    <p>hp: ${result.stats[0].base_stat}</p>
                    <p>attack:</p>
                    <p>defence:</p>
                    <p>special-attack:</p>
                    <p>special-defense:</p>
                    <p>speed:</p>
                 </div>
            </div>
        <div>
    `
        outerCardWrraper.innerHTML += card;
    })
};

loadMoreButton.addEventListener("click", async () => {
    offset = offset + limit;
    let res = await fetchData(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    let promise = res.results.map(result => fetchData(result.url));
    let newPokemon = await Promise.all(promise);
    pokemonAbility = [...pokemonAbility, ...newPokemon];
    ShowData(pokemonAbility);
})

searchPokemon.addEventListener("keyup", () => {
    let searchInput = searchPokemon.value;
    let result = pokemonAbility.filter(obj => obj.name.includes(searchInput));
    ShowData(result)
})

async function pokemonType() {
    let res = await fetchData(pokemonTypeUrl);

    res.results.map(result => {
        let options = document.createElement("option");
        options.innerText = result.name;
        options.value = result.name;
        filterBySelect.appendChild(options);
    });
};

pokemonType();

filterBySelect.addEventListener("change", (e) => {
    let pokeType = e.target.value;
    let result = pokemonAbility.filter(res => res.types[0].type.name.includes(pokeType));

    if (result.length === 0) {
        ShowData(pokemonAbility);
        alert("This type of pokemon not found");
    }

    ShowData(result);
})