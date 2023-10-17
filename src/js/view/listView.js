import { elements } from "./base";
export const renderItem = (item) => {
  const html = `
     <li class="shopping__item">
          <p class="shopping__description">${item}</p>
          <button class="shopping__delete btn-tiny">
              <svg>
                  <use href="img/icons.svg#icon-circle-with-cross"></use>
              </svg>
          </button>
     </li>    `;

  elements.shoppingList.insertAdjacentHTML("beforebegin", html);
};
