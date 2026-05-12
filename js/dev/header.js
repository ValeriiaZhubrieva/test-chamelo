import { s as isMobile } from "./app.min.js";
//#region src/components/layout/header/header.js
window.enableFocusTrap = function(menu, { openClass = "is-open" } = {}) {
	const focusableSelector = "a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex=\"-1\"])";
	const guardStart = document.createElement("span");
	const guardEnd = document.createElement("span");
	guardStart.tabIndex = 0;
	guardEnd.tabIndex = 0;
	guardStart.className = "focus-guard";
	guardEnd.className = "focus-guard";
	guardStart.setAttribute("aria-hidden", "true");
	guardEnd.setAttribute("aria-hidden", "true");
	menu.prepend(guardStart);
	menu.append(guardEnd);
	const getFocusable = () => Array.from(menu.querySelectorAll(focusableSelector)).filter((el) => {
		const style = window.getComputedStyle(el);
		const notHidden = style.visibility !== "hidden" && style.display !== "none";
		const rect = typeof el.getBoundingClientRect === "function" ? el.getBoundingClientRect() : {
			width: 1,
			height: 1
		};
		const hasSize = rect.width > 0 && rect.height > 0;
		return notHidden && hasSize && !el.hasAttribute("disabled");
	});
	function handleGuardFocus(e) {
		const focusable = getFocusable();
		if (!focusable.length) return;
		if (e.target === guardStart) focusable[focusable.length - 1].focus();
		else focusable[0].focus();
	}
	guardStart.addEventListener("focus", handleGuardFocus);
	guardEnd.addEventListener("focus", handleGuardFocus);
	function onKeydown(e) {
		if (e.key !== "Tab") return;
		if (!menu.classList.contains(openClass)) return;
		const isInside = menu.contains(document.activeElement);
		const focusable = getFocusable();
		if (!focusable.length) {
			e.preventDefault();
			return;
		}
		if (!isInside) {
			e.preventDefault();
			(e.shiftKey ? focusable[focusable.length - 1] : focusable[0]).focus();
			return;
		}
	}
	document.addEventListener("keydown", onKeydown, true);
	return function cleanup() {
		document.removeEventListener("keydown", onKeydown, true);
		guardStart.removeEventListener("focus", handleGuardFocus);
		guardEnd.removeEventListener("focus", handleGuardFocus);
		guardStart.remove();
		guardEnd.remove();
	};
};
window.initMenu = function() {
	const activeClass = "is-open";
	const activeBtnClass = "is-active";
	const html = document.documentElement;
	const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
	let removeTrap = null;
	let lastActiveButton = null;
	let focusReturnNeeded = false;
	let overlay = null;
	function createOverlay(menu) {
		removeOverlay();
		overlay = document.createElement("div");
		overlay.className = "menu-overlay";
		overlay.style.zIndex = -1;
		menu.appendChild(overlay);
		overlay.addEventListener("click", closeAllMenus);
	}
	function removeOverlay() {
		if (overlay && overlay.parentElement) {
			overlay.removeEventListener("click", closeAllMenus);
			overlay.remove();
			overlay = null;
		}
	}
	function closeAllMenus() {
		document.querySelectorAll("[data-menu-target]." + activeClass).forEach((menu) => {
			menu.classList.remove(activeClass);
		});
		document.querySelectorAll("[data-menu]." + activeBtnClass).forEach((btn) => {
			btn.classList.remove(activeBtnClass);
		});
		html.classList.remove("menu-open");
		html.classList.forEach((cls) => {
			if (cls.startsWith("menu-open--")) html.classList.remove(cls);
		});
		if (removeTrap) {
			removeTrap();
			removeTrap = null;
		}
		if (focusReturnNeeded && lastActiveButton) lastActiveButton.focus();
		lastActiveButton = null;
		focusReturnNeeded = false;
	}
	function openMenu(menuName, { withFocusReturn = true } = {}) {
		closeAllMenus();
		const menu = document.querySelector(`[data-menu-target="${menuName}"]`);
		const buttons = document.querySelectorAll(`[data-menu="${menuName}"]`);
		if (menu && buttons.length) {
			const menuBlockRect = menu.parentElement.getBoundingClientRect();
			focusReturnNeeded = withFocusReturn;
			buttons.forEach((btn) => {
				btn.classList.add(activeBtnClass);
				lastActiveButton = btn;
			});
			menu.classList.add(activeClass);
			html.classList.add("menu-open");
			html.classList.add(`menu-open--${menuName}`);
			menu.style.setProperty("--menu-height", `${window.innerHeight - menuBlockRect.bottom}px`);
			removeTrap = enableFocusTrap(menu, { openClass: "is-open" });
			createOverlay(menu);
		}
	}
	function toggleMenu(menuName) {
		if (document.querySelector(`[data-menu-target="${menuName}"]`)?.classList.contains(activeClass)) closeAllMenus();
		else openMenu(menuName);
	}
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") closeAllMenus();
	});
	new MutationObserver((mutationsList) => {
		for (const mutation of mutationsList) if (mutation.type === "attributes" && mutation.attributeName === "data-fls-popup-open") {
			if (html.hasAttribute("data-fls-popup-open")) closeAllMenus();
		}
	}).observe(html, { attributes: true });
	document.addEventListener("click", (e) => {
		const btn = e.target.closest("[data-menu]");
		const isInsideMenu = e.target.closest("[data-menu-target]." + activeClass);
		if (btn) {
			if (btn.hasAttribute("data-menu-click") || isTouch && isMobile.any()) e.preventDefault();
			const menuName = btn.dataset.menu;
			toggleMenu(menuName);
		} else if (!isInsideMenu) closeAllMenus();
	});
	document.querySelectorAll("[data-menu-close]").forEach((closeBtn) => {
		closeBtn.addEventListener("click", (e) => {
			e.preventDefault();
			closeAllMenus();
		});
	});
	if (!isTouch && !isMobile.any()) {
		const MOUSE_LOCS_TRACKED = 5;
		const DELAY = 300;
		let mouseLocs = [];
		document.addEventListener("mousemove", (e) => {
			mouseLocs.push({
				x: e.pageX,
				y: e.pageY
			});
			if (mouseLocs.length > MOUSE_LOCS_TRACKED) mouseLocs.shift();
		});
		function getSlope(a, b) {
			return (b.y - a.y) / (b.x - a.x);
		}
		function isMovingToMenu(menu) {
			if (mouseLocs.length < 2) return false;
			const loc = mouseLocs[mouseLocs.length - 1];
			const prevLoc = mouseLocs[0];
			const rect = menu.getBoundingClientRect();
			const upperLeft = {
				x: rect.left,
				y: rect.top
			};
			rect.right, rect.top;
			const lowerLeft = {
				x: rect.left,
				y: rect.bottom
			};
			rect.right, rect.bottom;
			const decreasingSlope = getSlope(loc, upperLeft);
			const increasingSlope = getSlope(loc, lowerLeft);
			const prevDecreasingSlope = getSlope(prevLoc, upperLeft);
			const prevIncreasingSlope = getSlope(prevLoc, lowerLeft);
			return decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope;
		}
		document.querySelectorAll("[data-menu]").forEach((button) => {
			if (button.hasAttribute("data-menu-click")) return;
			const menuName = button.dataset.menu;
			const menu = document.querySelector(`[data-menu-target="${menuName}"]`);
			if (!menu) return;
			let timeoutId = null;
			const possiblyActivate = () => {
				clearTimeout(timeoutId);
				if (isMovingToMenu(menu)) timeoutId = setTimeout(possiblyActivate, DELAY);
				else openMenu(menuName, { withFocusReturn: false });
			};
			button.addEventListener("mouseenter", () => {
				possiblyActivate();
			});
			button.addEventListener("mouseleave", () => {
				timeoutId = setTimeout(() => {
					closeAllMenus();
				}, DELAY);
			});
			menu.addEventListener("mouseenter", () => {
				clearTimeout(timeoutId);
			});
			menu.addEventListener("mouseleave", () => {
				timeoutId = setTimeout(() => {
					closeAllMenus();
				}, DELAY);
			});
		});
	}
	window.menuAPI ??= {};
	Object.assign(window.menuAPI, {
		close: closeAllMenus,
		open: openMenu,
		toggle: toggleMenu
	});
};
document.addEventListener("DOMContentLoaded", window.initMenu);
document.querySelectorAll("[data-drop-block]").forEach((block) => {
	const btn = block.querySelector("[data-drop-current]");
	if (!btn) return;
	btn.addEventListener("click", (e) => {
		e.stopPropagation();
		const isActive = block.classList.toggle("is-active");
		btn.classList.toggle("is-active", isActive);
	});
	document.addEventListener("click", (e) => {
		if (!block.contains(e.target)) {
			block.classList.remove("is-active");
			btn.classList.remove("is-active");
		}
	});
});
//#endregion
