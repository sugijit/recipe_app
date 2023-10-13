import { elements } from "./base";

// private function
const renderRecipe = (recipe) => {
  const markup = `
       <li>
            <a class="results__link" href="${recipe.reipe_id}">
                 <figure class="results__fig">
                      <img src="${recipe.image_url}" alt="Test">
                 </figure>
                 <div class="results__data">
                      <h4 class="results__name">${recipe.title}</h4>
                      <p class="results__author">${recipe.title}</p>
                 </div>
            </a>
       </li>
    `;
  //ul ruugee nemne
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};

export const clearSearchQuery = () => {
  elements.searchResultList.innerHTML = "";
  elements.pageButtons.innerHTML = "";
};
export const clearSearch = () => {
  elements.searchInput.value = "";
  // elements.pageButtons.innerHTML = "";
};

export const getInput = () => elements.searchInput.value;
export const renderRecipes = (recipes, currentPage = 1, resPerPage = 5) => {
  const start = (currentPage - 1) * resPerPage;
  const end = currentPage * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);

  const totalPages = Math.ceil(recipes.length / resPerPage);
  renderButtons(currentPage, totalPages);
};

// type ==> 'prev', 'next'
const createButton = (page, type, direction) => `
  <button class="btn-inline results__btn--${type}" data-goto=${page}>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${direction}"></use>
    </svg>
    <span>Хуудас ${page}</span>
  </button>
`;

const renderButtons = (currentPage, totalPages) => {
  let buttonHtml;

  if (currentPage === 1 && totalPages > 1) {
    //1-r huudas deer baina, 2r huudsiig garga
    buttonHtml = createButton(2, "next", "right");
  } else if (currentPage < totalPages) {
    //umnuh bolon daraah huudsuud ruu shiljih button garga
    buttonHtml = createButton(currentPage - 1, "prev", "left");
    buttonHtml += createButton(currentPage + 1, "next", "right");
  } else if (currentPage === totalPages) {
    //hamgiin suuliin huudsiig garga
    buttonHtml = createButton(currentPage - 1, "prev", "left");
  }

  elements.pageButtons.insertAdjacentHTML("afterbegin", buttonHtml);
};
