import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import List from "./model/List";
import Like from "./model/Like";
import * as likesView from "./view/likesView";
import {
  renderRecipe,
  clearRecipe,
  highlightSelectedRecipe,
} from "./view/recipeView";
import * as listView from "./view/listView";

const state = {};

/**
 * Hailtiin controller
 */
const controlSearch = async () => {
  // 1. Webees hailtiin tulhuur ugiig gargaj avna
  const query = searchView.getInput();
  if (query) {
    // 2. Shineer hailtiin object-iig uusgej ugnu
    state.search = new Search(query);
    // 3. Hailt hiihed zoriulj interface(Delgets)-ee beldene
    searchView.clearSearchQuery();
    searchView.clearSearch();
    renderLoader(elements.searchResultDiv);
    // 4. Hailtiig guitsetgene
    await state.search.doSearch();
    // 5. Hailtiin ur dung delgetsend uzuulne
    clearLoader();
    if (state.search.result === undefined) alert("hailtaar ilertsgui");
    searchView.renderRecipes(state.search.result);
  }
};
elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.pageButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goto = parseInt(btn.dataset.goto, 10);
    searchView.clearSearchQuery();
    searchView.renderRecipes(state.search.result, goto);
  }
});

/**
 * Joriin controller
 */

const controlRecipe = async () => {
  // 1. url-ees id-g salgaj avna
  const id = window.location.hash.replace("#", "");

  // 2. Joriin model-iig uusgej ugno
  if (id) {
    state.recipe = new Recipe(id);
    // 3. UI buyu delgetsiig beldene
    clearRecipe();
    renderLoader(elements.recipeDiv);
    highlightSelectedRecipe(id);
    // 4. Joroo tataj avchirna
    await state.recipe.getRecipe();
    // 5. Joriig guitsetgeh hugatsaa, ortsiig tootsooloh
    clearLoader();
    state.recipe.calcTime();
    state.recipe.calcHuniiToo();
    // 6. Joroo uzuulne
    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
};
// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);

window.addEventListener("load", (e) => {
  if (!state.likes) state.likes = new Like();

  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

/**
 * Nairlagiin controller
 */

const controlList = () => {
  //Nairlaganii modeliig uusgene
  state.list = new List();
  listView.clearItems();

  //ug model ruu odoo haragdaj baigaa jornii buh nairlagiig hadgalna
  state.recipe.ingredients.forEach((n) => {
    const item = state.list.addItem(n);
    listView.renderItem(item);
  });
};

const controlLike = () => {
  // 1. like-n model uusgene
  if (!state.likes) state.likes = new Like();
  // 2. Odoo haragdaj bgaa joriin ID-g olj avah
  const currentRecipeId = state.recipe.id;
  // 3. Ene joriig like-lsan esehiig shalgah
  if (state.likes.isLiked(currentRecipeId)) {
    // 4. Like-lsan bol like-g boliulah
    state.likes.deleteLike(currentRecipeId);
    likesView.deleteLike(currentRecipeId);
    likesView.toggleLikeBtn(false);
  } else {
    // 5. Like-laagui bol likelana

    const newLike = state.likes.addLike(
      currentRecipeId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.image_url
    );
    likesView.renderLike(newLike);
    likesView.toggleLikeBtn(true);
  }
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

elements.shoppingList.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  //oldson id-tei ortsiig modeloos ustgana
  state.list.deleteItem(id);

  //Delgetsees iim id-tei ortsiig ustgana
  listView.deleteItem(id);
});
