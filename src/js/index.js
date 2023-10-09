import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";

const state = {};
const controlSearch = async () => {
  // 1. Webees hailtiin tulhuur ugiig gargaj avna
  const query = searchView.getInput();
  if (query) {
    // 2. Shineer hailtiin object-iig uusgej ugnu
    state.search = new Search(query);
    // 3. Hailt hiihed zoriulj interface(Delgets)-ee beldene
    searchView.clearSearch();
    searchView.clearSearchQuery();
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
