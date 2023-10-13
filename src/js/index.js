import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";

const state = {};
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

const r = new Recipe(47746);
r.getRecipe();
