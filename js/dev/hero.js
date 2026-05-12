//#region src/components/custom/hero/hero.js
window.initSlideImg = function() {
	document.querySelectorAll("[data-img-slide]").forEach((block) => {
		block.querySelectorAll("[data-img-slide-src]").forEach((button) => {
			button.addEventListener("click", function() {
				block.querySelectorAll("[data-img-slide-src]").forEach((btn) => {
					btn.classList.remove("is-active");
				});
				this.classList.add("is-active");
				const imgSrc = `${this.dataset.imgSlideSrc}`;
				block.querySelector("[data-img-slide-img]").src = imgSrc;
			});
		});
	});
};
window.addEventListener("load", window.initSlideImg);
//#endregion
