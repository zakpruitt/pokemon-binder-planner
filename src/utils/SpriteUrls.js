import data from '../data/sprite_data.json';

const REGULAR_BASE = 'https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/';
const SHINY_BASE = 'https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/shiny/';

export const SPRITE_URLS = Object.values(data).flatMap(pokemon => {
    const engName = pokemon.name.eng.toLowerCase();
    return [
        `${REGULAR_BASE}${engName}.png`,
        `${SHINY_BASE}${engName}.png`
    ];
});
