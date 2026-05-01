//#region src/components/layout/footer/footer.js
function initFooterForm() {
	const form = document.querySelector(".footer__form");
	if (!form) return;
	const input = form.querySelector(".footer__form-input");
	const button = form.querySelector(".footer__form-send");
	const isValidEmail = (value) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	};
	const updateButtonState = () => {
		if (input.value.trim().length === 0) button.disabled = true;
		else button.disabled = false;
		input.classList.remove("is-error");
	};
	input.addEventListener("input", updateButtonState);
	button.addEventListener("click", () => {
		if (!isValidEmail(input.value.trim())) {
			input.classList.add("is-error");
			return;
		}
		input.classList.remove("is-error");
		form.classList.add("is-success");
		input.value = "";
		button.disabled = true;
		setTimeout(() => {
			form.classList.remove("is-success");
		}, 3e3);
	});
}
document.addEventListener("DOMContentLoaded", initFooterForm);
//#endregion
