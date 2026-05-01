import { t as require_inputmask_min } from "./inputmask.min.js";
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/components/forms/quantity/quantity.js
function formQuantity() {
	document.addEventListener("click", quantityActions);
	document.addEventListener("input", quantityActions);
	function updateButtons(container) {
		const valueElement = container.querySelector("[data-fls-quantity-value]");
		const plusBtn = container.querySelector("[data-fls-quantity-plus]");
		const minusBtn = container.querySelector("[data-fls-quantity-minus]");
		const min = +valueElement.dataset.flsQuantityMin || 1;
		const max = +valueElement.dataset.flsQuantityMax || Infinity;
		const value = +valueElement.value;
		if (minusBtn) if (value <= min) minusBtn.classList.add("disabled");
		else minusBtn.classList.remove("disabled");
		if (plusBtn) if (value >= max) plusBtn.classList.add("disabled");
		else plusBtn.classList.remove("disabled");
	}
	function quantityActions(e) {
		const type = e.type;
		const targetElement = e.target;
		if (type === "click") {
			if (targetElement.closest("[data-fls-quantity-plus]") || targetElement.closest("[data-fls-quantity-minus]")) {
				const container = targetElement.closest("[data-fls-quantity]");
				const valueElement = container.querySelector("[data-fls-quantity-value]");
				let value = parseInt(valueElement.value);
				const min = +valueElement.dataset.flsQuantityMin || 1;
				const max = +valueElement.dataset.flsQuantityMax || Infinity;
				if (targetElement.hasAttribute("data-fls-quantity-plus")) {
					value++;
					if (value > max) value = max;
				} else {
					value--;
					if (value < min) value = min;
				}
				valueElement.value = value;
				updateButtons(container);
			}
		} else if (type === "input") {
			if (targetElement.closest("[data-fls-quantity-value]")) {
				const valueElement = targetElement.closest("[data-fls-quantity-value]");
				const min = +valueElement.dataset.flsQuantityMin || 1;
				if (valueElement.value == 0 || /[^0-9]/gi.test(valueElement.value)) valueElement.value = min;
				updateButtons(valueElement.closest("[data-fls-quantity]"));
			}
		}
	}
	document.querySelectorAll("[data-fls-quantity]").forEach((container) => {
		updateButtons(container);
	});
}
document.querySelector("[data-fls-quantity]") && window.addEventListener("load", formQuantity);
require_inputmask_min();
window.inputMask = function() {
	document.querySelectorAll("input[data-fls-input-mask]").forEach((inputMask) => {
		Inputmask({ mask: `${inputMask.dataset.flsInputMask}` }).mask(inputMask);
	});
};
document.querySelector("input[data-fls-input-mask]") && window.addEventListener("load", window.inputMask);
//#endregion
