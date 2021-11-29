/* eslint-disable import/extensions */
import * as fetcherFuncs from '../storage/fetcher.js';
import * as storageFuncs from '../storage/storage.js';

class RecipeCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set windowRouter(routerElem) {
    this.router = routerElem;
  }

  set populateFunc(func) {
    this.populate = func;
  }

  set data(data) {
    this.json = data;
    console.log(data);

    // Initialize saved/created properties
    const categories = fetcherFuncs.getAllSavedRecipeId();
    this.saved = categories.favorites && categories.favorites.includes(this.json.id);
    this.created = categories.created && categories.created.includes(this.json.id);

    const styleElem = document.createElement('style');
    const styles = `
    @import url("https://use.fontawesome.com/releases/v5.15.4/css/all.css");
      .recipe-card {
        background-repeat: no-repeat;
        background-size: cover;
        border: 1px solid black;
        border-radius: 0.5rem;
        display: inline-block;
        font-family: Lato, sans-serif;
        height: 17rem;
        margin: 0 1.5rem 1.5rem 0;
        overflow-wrap: break-word;
        overflow-y: hidden;
        position: relative;
        white-space: normal;
        width: 15rem;
        background: #ccc;
      }

      .recipe-card:hover {
        cursor: pointer;
      }

      .card-shadow {
        border: none;
        box-shadow: 0 2px 5px rgba(0 0 0 / 60%);
        transition: 0.2s ease-in-out;
      }
      .card-shadow:hover, .card-shadow:focus {
        border: none;
        box-shadow: 0 8px 20px rgba(0 0 0 / 60%);
        transform: scale(1.01);
      }

      .card-header {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      .card-header.card-img {
        overflow: hidden;
      }
      .card-header.card-img > img{
        display: block;
        width: 100%;
        aspect-ratio: 16/9;
        object-fit: cover;
      }

      .card-btn {
        background: white;
        border: none;
        border-radius: 0.25em;
        color: black;
        cursor: pointer;
        padding: 0.5em 0.75em;
        transition: 0.2s ease-in-out;
      }

      .card-btn:hover, .card-btn:focus {
        background: hsl(200deg 50% 60%);
      }

      .card-btn.card-btn-outline {
        background: none;
      }


      .astext {
        background: none;
        border: none;
        color: black;
        cursor: pointer;
        float: left !important;
        font-family: Lato, sans-serif;
        font-size: 1rem;
        font-weight: bold;
        margin: 0;
        padding: 0;
        text-align: left !important;
        text-decoration: underline;
      }

      .rating {
        padding: 0.75em;
      }
      
      .rating .star {
        display: inline-block;
        position: relative;
      }


      .rating .star::before {
        background-color: rgba(0 0 0 5%);
        border-radius: 50%;
        box-shadow: 0 2px 3px rgba(0 0 0 15%);
        content: "";
        height: 12px;
        left: 0;
        margin: 0 auto;
        position: absolute;
        right: 0;
        top: 3px;
        width: 12px;
        z-index: 0;
      }

      .star i {
        color: #ffd300;
        font-size: 1.4rem;
      }

      .star span {
        color: white;
        font-family: Lato, sans-serif;
        font-size: 1.4rem;
        text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
      }

      /* Card Body Style */
      .card-body {
        background-color: white;
        bottom: 0;
        left: 0;
        padding: 1em 2em 2em 1em;
        position: absolute;
        right: 0;
        height: 14%;
      }

      .favorite {
        transition: all 111ms ease-in-out;
      }

      .card-body p {
        color: black;
        float: left;
        font-family: Lato, sans-serif;
        font-size: 1rem;
        font-weight: bold;
        margin: 0;
        padding: 0;
        text-decoration: underline;
      }

      .card-body .favorite {
        position: absolute;
        right: 10px;
        top: 10px;
      }

      .favorite {
        display: grid;
      }

      .card-body .favorite i {
        color: #f00;
        font-size: 1.5rem;
      }
      .card-delete-button {
        padding-top: 0px;
      }
    `;
    styleElem.innerHTML = styles;
    this.shadowRoot.append(styleElem);

    const card = document.createElement('article');
    card.classList.add('recipe-card');
    card.classList.add('card-shadow');
    if (data.image) {
      card.setAttribute('style', `background-image: url('${this.json.image}');`);
    } else {
      console.log('no card image provided');
    }

    const cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'card-body');
    const expandRecipe = document.createElement('button');
    expandRecipe.setAttribute('class', 'astext');
    expandRecipe.innerText = this.json.title;
    cardBody.appendChild(expandRecipe);

    const favDiv = document.createElement('div');
    favDiv.setAttribute('class', 'favorite');
    const favButton = document.createElement('button');
    favButton.setAttribute('class', 'card-btn card-btn-outline card-save-button');

    const flipSaved = () => {
      const currCards = document.querySelectorAll(`.id_${this.json.id}`);
      const currSavedPageSelect = document.querySelector('select.list-dropdown').value;
      console.log(currSavedPageSelect);
      if (this.saved) {
        storageFuncs.removeRecipeFromList('favorites', this.json.id);
        if (currSavedPageSelect === 'List 1') {
          // remove card in saved recipe page
          const grid = document.querySelector('.saved-recipes .results-grid');
          const currentCardsSaved = grid.querySelectorAll(`.id_${this.json.id}`);
          for (let i = 0; i < currentCardsSaved.length; i++) {
            currentCardsSaved[i].remove();
          }
        }
      } else {
        storageFuncs.saveRecipeToList('favorites', this.json.id);
        if (currSavedPageSelect === 'List 1') {
          // add card to saved recipe page
          const grid = document.querySelector('.saved-recipes .results-grid');
          const recipeCardNew = document.createElement('recipe-card');
          recipeCardNew.setAttribute('class', `id_${this.json.id}`);
          recipeCardNew.data = this.json;
          grid.appendChild(recipeCardNew);
        }
      }
      for (let i = 0; i < currCards.length; i++) {
        const { shadowRoot } = currCards[i];
        const element = shadowRoot
          .querySelector('.card-save-button')
          .querySelector('i');
        if (currCards[i].saved) {
          element.classList.add('far');
          element.classList.remove('fas');
        } else {
          element.classList.remove('far');
          element.classList.add('fas');
        }
        currCards[i].saved = !currCards[i].saved;
      }
    };

    favButton.addEventListener('click', flipSaved);

    const saveIcon = document.createElement('i');
    if (this.saved) {
      saveIcon.classList.add('fas');
    } else {
      saveIcon.classList.add('far');
    }
    saveIcon.classList.add('fa-heart');
    favButton.appendChild(saveIcon);
    favDiv.appendChild(favButton);

    if (this.created) {
      const deleteRecipe = document.createElement('button');
      deleteRecipe.classList.add('card-btn');
      deleteRecipe.classList.add('card-btn-outline');
      deleteRecipe.classList.add('card-delete-button');

      const clickDelete = () => {
        storageFuncs.deleteCreatedRecipe(this.json.id);
        const currentCards = document.querySelectorAll(`.id_${this.json.id}`);
        for (let i = 0; i < currentCards.length; i++) {
          currentCards[i].remove();
        }
      };

      deleteRecipe.addEventListener('click', clickDelete);

      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fas');
      deleteIcon.classList.add('fa-trash-alt');
      deleteRecipe.appendChild(deleteIcon);
      favDiv.appendChild(deleteRecipe);
    }

    cardBody.appendChild(favDiv);

    card.appendChild(cardBody);

    card.addEventListener('click', () => {
      this.populate(this.json);
      this.router.navigate('recipe-info', false);
    });

    this.shadowRoot.append(card);
  }

  get data() {
    return this.json;
  }
}

customElements.define('recipe-card', RecipeCard);
