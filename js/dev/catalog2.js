//#region src/components/custom/catalog/catalog.js
var catalogBtnGrid = document.querySelector(".catalog__grids-big");
var catalogBtnRow = document.querySelector(".catalog__grids-small");
var catalogItems = document.querySelector(".catalog__items");
if (catalogBtnGrid && catalogBtnRow && catalogItems) {
	catalogBtnRow.addEventListener("click", () => {
		catalogItems.classList.remove("items-grid-big");
		catalogBtnRow.classList.add("is-active");
		catalogBtnGrid.classList.remove("is-active");
	});
	catalogBtnGrid.addEventListener("click", () => {
		catalogItems.classList.add("items-grid-big");
		catalogBtnRow.classList.remove("is-active");
		catalogBtnGrid.classList.add("is-active");
	});
}
//#endregion
