//#region src/components/custom/lenses/lenses.js
window.initHbRange = function() {
	document.querySelectorAll("[data-hb-range]").forEach((block) => {
		const input = block.querySelector("[data-hb-input]");
		const images = block.querySelectorAll("[data-hb-lens] img");
		const largeValue = block.querySelector("[data-vrt-large-value]");
		const smallValue = block.querySelector("[data-vrt-small-value]");
		if (!input) return;
		const update = () => {
			const value = parseFloat(input.value);
			const percent = value * 100;
			if (percent > 10 && percent < 100) if (percent > 70) {
				if (largeValue) largeValue.style.display = "none";
				if (smallValue) smallValue.style.display = "block";
			} else {
				if (smallValue) smallValue.style.display = "none";
				if (largeValue) largeValue.style.display = "block";
			}
			images.forEach((img) => {
				img.style.opacity = value;
			});
		};
		input.addEventListener("input", update);
		update();
	});
};
document.addEventListener("DOMContentLoaded", initHbRange);
//#endregion
