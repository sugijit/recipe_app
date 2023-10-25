import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import List from "./model/List";
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
    renderRecipe(state.recipe);
  }
};
// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);

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

elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  }
});

elements.shoppingList.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  //oldson id-tei ortsiig modeloos ustgana
  state.list.deleteItem(id);

  //Delgetsees iim id-tei ortsiig ustgana
  listView.deleteItem(id);
});
