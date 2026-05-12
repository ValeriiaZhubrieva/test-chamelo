//#region src/components/forms/rating/rating.js
function formRating() {
	const ratings = document.querySelectorAll("[data-fls-rating]");
	if (ratings) ratings.forEach((rating) => {
		const ratingValue = +rating.dataset.flsRatingValue;
		ratingValue && formRatingSet(rating, ratingValue);
		document.addEventListener("click", formRatingAction);
	});
	function formRatingAction(e) {
		const targetElement = e.target;
		if (targetElement.closest(".rating__input")) {
			const currentElement = targetElement.closest(".rating__input");
			const ratingValue = +currentElement.value;
			const rating = currentElement.closest(".rating");
			rating.dataset.flsRating === "set" && formRatingGet(rating, ratingValue);
		}
	}
	function formRatingGet(rating, ratingValue) {
		formRatingSet(rating, ratingValue);
	}
	function formRatingSet(rating, value) {
		const ratingItems = rating.querySelectorAll(".rating__item");
		const resultFullItems = parseInt(value);
		const resultPartItem = value - resultFullItems;
		rating.hasAttribute("data-rating-title") && (rating.title = value);
		ratingItems.forEach((ratingItem, index) => {
			ratingItem.classList.remove("rating__item--active");
			ratingItem.querySelector("span") && ratingItems[index].querySelector("span").remove();
			if (index <= resultFullItems - 1) ratingItem.classList.add("rating__item--active");
			if (index === resultFullItems && resultPartItem) ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`);
		});
	}
}
document.querySelector("[data-fls-rating]") && window.addEventListener("load", formRating);
//#endregion
