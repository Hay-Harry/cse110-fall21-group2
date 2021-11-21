/* eslint-disable no-unused-vars */
// helper functions for Spoonacular API
// all these functions fetch for most popular recipes
// TODO: sort by random?, look for easy recipe(maxReadyTime)?

// eslint-disable-next-line import/no-unresolved
require('dotenv').config();
const fetch = require('node-fetch');// uncomment if using with nodejs
const { API_KEY } = process.env;// prevent exposing api key
const HOST = 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com';

/**
 * Get detailed info from recipe ID's
 * @param {Object} ids - list of ids of recipes
 * @returns {Object} list of detailed info of recipes
 */
async function getDetailedRecipeInfoBulk(ids) {
  return new Promise((resolve, reject) => {
    const idsFormatted = ids.join(',');
    fetch(`https://${HOST}/recipes/informationBulk?&ids=${idsFormatted}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': HOST,
        'x-rapidapi-key': API_KEY,
      },
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => {
        console.log('Error getting detailed recipe info');
        reject(err);
      });
  });
}
/**
 * Helper function to extract recipe ids
 * @param {Object} - list of recipes search results from complex search
 * @returns {Object} - list of recipe ids
 */
function extractIDs(data) {
  const { results } = data;
  if (!results) {
    return [];
  }
  const ids = [];
  results.forEach((result) => {
    // TODO: figure out how to check if current id is already in local storage
    ids.push(result.id);
  });
  return ids;
}

/**
 * Get recipes by keywords(user searching for recipes)
 * @param {String} query - Keywords to search for
 * @param {Number} num - max number of recipes to get
 * @param {Number} [offset=0] - number of recipes to skip
 *  (use random number so we dont get same results everytime)
 * @returns {Object} list of recipes with detailed info
 */
// eslint-disable-next-line no-unused-vars
async function getRecipesByName(query, num, offset = 0) {
  return new Promise((resolve, reject) => {
    const queryFormatted = query.trim().replace(/\s+/g, '-').toLowerCase();
    fetch(`https://${HOST}/recipes/complexSearch?&query=${queryFormatted}&number=${num}&sort=populatrity&offset=${offset}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': HOST,
        'x-rapidapi-key': API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const ids = extractIDs(data);
        if (!ids) {
          resolve([]);
        } else {
          resolve(getDetailedRecipeInfoBulk(ids));
        }
      })
      .catch((err) => {
        console.log('Error in searching for recipes by name.');
        reject(err);
      });
  });
}

/**
 * Get recipes by autocompleting keywords
 * (Use this if searching by query returned not enough results)
 * @param {Number} num - max number of recipes to get
 * @param {String} query - Query to autocomplete
 * @returns {Object} list of recipes with detailed info
 */
// eslint-disable-next-line no-unused-vars
async function getRecipesByAutocomplete(query, num) {
  return new Promise((resolve, reject) => {
    const queryFormatted = query.trim().replace(/\s+/g, '-').toLowerCase();
    fetch(`https://${HOST}/recipes/autocomplete?query=${queryFormatted}&number=${num}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': HOST,
        'x-rapidapi-key': API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          console.log('No search results');
          resolve([]);
        } else {
          // different format from complex search
          const ids = [];
          data.forEach((result) => {
            ids.push(result.id);
          });
          resolve(getDetailedRecipeInfoBulk(ids));
        }
      })
      .catch((err) => {
        console.log('Error in searching for recipes by autocomplete.');
        reject(err);
      });
  });
}

/**
 * Get recipe by cuisine
 * @param {String} cuisine - any cuisine specified here https://spoonacular.com/food-api/docs#Cuisines
 * @param {Number} num - max number of recipes to get
 * @param {Number} [offset=0] - number of recipes to skip
 *  (use random number so we dont get same results everytime)
 * @returns {Object} list of recipes with detailed info
 */
// eslint-disable-next-line no-unused-vars
async function getRecipesByCuisine(cuisine, num, offset=0) {
  return new Promise((resolve, reject) => {
    fetch(`https://${HOST}/recipes/complexSearch?cuisine=${cuisine}&number=${num}&sort=popularity&offset=${offset}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': HOST,
        'x-rapidapi-key': API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const ids = extractIDs(data);
        if (!ids) {
          console.log('No search results');
          resolve([]);
        } else {
          resolve(getDetailedRecipeInfoBulk(ids));
        }
      })
      .catch((err) => {
        console.log('Error in searching for recipes by cuisine.');
        reject(err);
      });
  });
}

/**
 * Get recipe by type(can use this to grab a bunch of recipes when user first enters site)
 * @param {String} type - type of meal
 * @param {Number} num - max number of recipes to get
 * @param {Number} [offset=0] - number of recipes to skip
 *  (use random number so we dont get same results everytime)
 * @returns {Object} list of recipes with detailed info
 */
async function getRecipesByType(type, num, offset=0) {
  return new Promise((resolve, reject) => {
    fetch(`https://${HOST}/recipes/complexSearch?&type=${type}&number=${num}&sort=popularity&offset=${offset}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': HOST,
        'x-rapidapi-key': API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const ids = extractIDs(data);
        if (!ids) {
          console.log('No search results');
          resolve([]);
        } else {
          resolve(getDetailedRecipeInfoBulk(ids));
        }
      })
      .catch((err) => {
        console.log('Error in searching for recipes by type.');
        reject(err);
      });
  });
}

// export functions?


/*
getRecipesByAutocomplete("chi", 3)
  .then((data) => {
    console.log(data)
  });

getRecipesByName('asian', 2, 1)
  .then((data) => {
    console.log(data);
  });
*/