//#region src/js/common/functions.js
var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
	}
};
function getHash() {
	if (location.hash) return location.hash.replace("#", "");
}
function setHash(hash) {
	hash = hash ? `#${hash}` : window.location.href.split("#")[0];
	history.pushState("", "", hash);
}
var slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore && target.style.removeProperty("height");
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			!showmore && target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideUpDone", { detail: { target } }));
		}, duration);
	}
};
var slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.hidden = target.hidden ? false : null;
		showmore && target.style.removeProperty("height");
		let height = target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + "px";
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		window.setTimeout(() => {
			target.style.removeProperty("height");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideDownDone", { detail: { target } }));
		}, duration);
	}
};
var slideToggle = (target, duration = 500) => {
	if (target.hidden) return slideDown(target, duration);
	else return slideUp(target, duration);
};
var bodyLockStatus = true;
var bodyUnlock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		setTimeout(() => {
			lockPaddingElements.forEach((lockPaddingElement) => {
				lockPaddingElement.style.paddingRight = "";
			});
			document.body.style.paddingRight = "";
			document.documentElement.removeAttribute("data-fls-scrolllock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function() {
			bodyLockStatus = true;
		}, delay);
	}
};
var bodyLock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
		lockPaddingElements.forEach((lockPaddingElement) => {
			lockPaddingElement.style.paddingRight = lockPaddingValue;
		});
		document.body.style.paddingRight = lockPaddingValue;
		document.documentElement.setAttribute("data-fls-scrolllock", "");
		bodyLockStatus = false;
		setTimeout(function() {
			bodyLockStatus = true;
		}, delay);
	}
};
function dataMediaQueries(array, dataSetValue) {
	const media = Array.from(array).filter((item) => item.dataset[dataSetValue]).map((item) => {
		const [value, type = "max"] = item.dataset[dataSetValue].split(",");
		return {
			value,
			type,
			item
		};
	});
	if (media.length === 0) return [];
	const breakpointsArray = media.map(({ value, type }) => `(${type}-width: ${value}px),${value},${type}`);
	return [...new Set(breakpointsArray)].map((query) => {
		const [mediaQuery, mediaBreakpoint, mediaType] = query.split(",");
		const matchMedia = window.matchMedia(mediaQuery);
		return {
			itemsArray: media.filter((item) => item.value === mediaBreakpoint && item.type === mediaType),
			matchMedia
		};
	});
}
var gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
	const targetBlockElement = document.querySelector(targetBlock);
	if (targetBlockElement) {
		let headerItem = "";
		let headerItemHeight = 0;
		if (noHeader) {
			headerItem = "header.header";
			const headerElement = document.querySelector(headerItem);
			if (!headerElement.classList.contains("--header-scroll")) {
				headerElement.style.cssText = `transition-duration: 0s;`;
				headerElement.classList.add("--header-scroll");
				headerItemHeight = headerElement.offsetHeight;
				headerElement.classList.remove("--header-scroll");
				setTimeout(() => {
					headerElement.style.cssText = ``;
				}, 0);
			} else headerItemHeight = headerElement.offsetHeight;
		}
		if (document.documentElement.hasAttribute("data-fls-menu-open")) {
			bodyUnlock();
			document.documentElement.removeAttribute("data-fls-menu-open");
		}
		let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
		targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
		targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
		window.scrollTo({
			top: targetBlockElementPosition,
			behavior: "smooth"
		});
	}
};
//#endregion
//#region src/js/app.js
if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) document.documentElement.classList.add("is-ios");
var topPositionBlocks = document.querySelectorAll("[data-top-position]");
if (topPositionBlocks.length) {
	const header = document.querySelector("header");
	const headerOffsetEl = header?.querySelector("[data-header-offset]");
	let ticking = false;
	function setVar(el, name, value) {
		if (!el._vars) el._vars = {};
		if (el._vars[name] === value) return;
		el.style.setProperty(name, value);
		el._vars[name] = value;
	}
	function updateTopPositions() {
		const headerHeight = header ? header.offsetHeight : 0;
		const headerOffsetHeight = headerOffsetEl ? headerOffsetEl.offsetHeight : 0;
		const measurements = [];
		topPositionBlocks.forEach((block) => {
			const blockRect = block.getBoundingClientRect();
			let navData = null;
			if (block.hasAttribute("data-top-position-nav")) {
				const blockNav = block.querySelector("[data-top-position-navblock]");
				if (blockNav) navData = {
					el: blockNav,
					height: blockNav.getBoundingClientRect().height
				};
			}
			measurements.push({
				block,
				topPosition: Math.max(headerHeight, blockRect.top),
				left: blockRect.left,
				width: blockRect.width,
				nav: navData
			});
		});
		measurements.forEach(({ block, topPosition, left, width, nav }) => {
			setVar(block, "--top-position", `${topPosition}px`);
			setVar(block, "--header-height", `${headerHeight}px`);
			if (headerOffsetHeight) setVar(block, "--header-offset-height", `${headerOffsetHeight}px`);
			if (nav) {
				setVar(nav.el, "--nav-left", `${left}px`);
				setVar(nav.el, "--nav-width", `${width}px`);
				setVar(block, "--nav-height", `${nav.height}px`);
			}
		});
	}
	function onScroll() {
		if (!ticking) {
			requestAnimationFrame(() => {
				updateTopPositions();
				ticking = false;
			});
			ticking = true;
		}
	}
	function runAfterLayout() {
		requestAnimationFrame(() => {
			requestAnimationFrame(updateTopPositions);
		});
	}
	runAfterLayout();
	window.addEventListener("load", runAfterLayout);
	if (document.fonts) document.fonts.ready.then(runAfterLayout);
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", runAfterLayout);
	if ("ResizeObserver" in window) {
		const observer = new ResizeObserver(runAfterLayout);
		if (header) observer.observe(header);
		if (headerOffsetEl) observer.observe(headerOffsetEl);
	}
}
var videoBlockPreview = document.querySelectorAll("[data-video-autoplay]");
if (videoBlockPreview.length) {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const video = entry.target.querySelector("video");
			if (!video) return;
			if (entry.isIntersecting) video.play().catch(() => {});
			else {
				video.pause();
				video.currentTime = 0;
			}
		});
	}, {
		threshold: .2,
		rootMargin: "50px 0px"
	});
	videoBlockPreview.forEach((block) => {
		if (block.querySelector("video")) observer.observe(block);
	});
}
window.initInputEffects = function() {
	document.querySelectorAll("input, textarea").forEach((input) => {
		const parent = input.parentElement;
		const btnReset = parent.querySelector("[type=\"reset\"]");
		let blurTimeout;
		const updateState = () => {
			parent.classList.toggle("is-filled", input.value.trim() !== "");
		};
		input.addEventListener("input", updateState);
		input.addEventListener("focus", () => {
			clearTimeout(blurTimeout);
			parent.classList.add("is-focused");
			parent.classList.add("is-filled");
		});
		input.addEventListener("blur", () => {
			blurTimeout = setTimeout(() => {
				parent.classList.remove("is-focused");
				updateState();
			}, 200);
		});
		if (btnReset) btnReset.addEventListener("click", () => {
			setTimeout(updateState, 0);
		});
		updateState();
	});
};
initInputEffects();
var pseudoOptions = document.querySelectorAll("[data-pseudo-options]");
if (pseudoOptions.length) pseudoOptions.forEach((block) => {
	const options = block.querySelectorAll("button, a");
	const setActive = (current) => {
		options.forEach((item) => {
			item.classList.toggle("is-active", item === current);
		});
	};
	options.forEach((item) => {
		item.addEventListener("click", (e) => {
			setActive(item);
		});
	});
});
var toggleActiveBtns = document.querySelectorAll("[data-toggle-active]");
if (toggleActiveBtns.length) toggleActiveBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		btn.classList.toggle("is-active");
	});
});
window.customMiniSelect = function() {
	const selParents = document.querySelectorAll("[data-sel-block]");
	if (!selParents.length) return;
	selParents.forEach((selBlock) => {
		const isSearch = selBlock.hasAttribute("data-sel-block-search");
		const selDropdownButton = selBlock.querySelector("[data-sel-block-current]");
		const selDropdownValueSpan = selDropdownButton.querySelector("[data-sel-block-value] span");
		const selDropdownInput = selDropdownButton.querySelector("[data-sel-block-input]");
		const selOptions = selBlock.querySelectorAll("[data-sel-block-btn]");
		const selCloseBtns = selBlock.querySelectorAll("[data-sel-block-close]");
		const selDropdown = selBlock.querySelector("[data-sel-block-dropdown]");
		const placeholderText = selBlock.getAttribute("data-sel-block-placeholder");
		let isOpen = false;
		function checkDropdownOverflow() {
			if (!selDropdown) return;
			selBlock.classList.remove("is-out-left", "is-out-right");
			const rect = selDropdown.getBoundingClientRect();
			if (rect.left < 0) selBlock.classList.add("is-out-left");
			if (rect.right > window.innerWidth) selBlock.classList.add("is-out-right");
		}
		function checkAndSetPlaceholder() {
			if (!placeholderText) return;
			if (!Array.from(selOptions).some((o) => o.classList.contains("is-active"))) {
				selBlock.classList.add("is-placeholder");
				if (selDropdownValueSpan) selDropdownValueSpan.innerHTML = placeholderText;
			} else selBlock.classList.remove("is-placeholder");
		}
		function filterOptions(query) {
			const value = query.toLowerCase().trim();
			selOptions.forEach((option) => {
				const text = option.textContent.toLowerCase();
				option.style.display = text.includes(value) ? "" : "none";
			});
		}
		function resetFilter() {
			selOptions.forEach((option) => {
				option.style.display = "";
			});
		}
		checkAndSetPlaceholder();
		function closeDropdown() {
			selBlock.classList.remove("sel-open");
			setTimeout(() => {
				selBlock.classList.remove("is-out-left", "is-out-right");
			}, 300);
			isOpen = false;
			document.removeEventListener("click", handleDocumentClick);
			if (isSearch && selDropdownInput) resetFilter();
		}
		function handleDocumentClick(e) {
			if (!selBlock.contains(e.target)) closeDropdown();
		}
		selCloseBtns.forEach((btn) => {
			btn.addEventListener("click", closeDropdown);
		});
		selDropdownButton.addEventListener("click", (e) => {
			if (isSearch && e.target === selDropdownInput && isOpen) return;
			if (!isOpen) isOpen = true;
			else isOpen = false;
			const parentWithAttr = selBlock.closest("[data-one-sel-block]");
			if (parentWithAttr && isOpen) parentWithAttr.querySelectorAll("[data-sel-block]").forEach((block) => {
				if (block !== selBlock) block.classList.remove("sel-open");
			});
			selBlock.classList.toggle("sel-open", isOpen);
			if (isOpen) {
				document.addEventListener("click", handleDocumentClick);
				requestAnimationFrame(() => {
					checkDropdownOverflow();
				});
			} else closeDropdown();
		});
		if (isSearch && selDropdownInput) {
			selDropdownInput.addEventListener("input", (e) => {
				const value = e.target.value.trim();
				if (isOpen) filterOptions(value);
				if (value === "") {
					selOptions.forEach((o) => o.classList.remove("is-active"));
					checkAndSetPlaceholder();
				}
			});
			selDropdownInput.addEventListener("focus", () => {
				if (isOpen) {
					selDropdownInput.value = "";
					resetFilter();
					selOptions.forEach((o) => o.classList.remove("is-active"));
					checkAndSetPlaceholder();
				}
			});
		}
		selOptions.forEach((item) => {
			item.addEventListener("click", () => {
				const selectedText = item.textContent.replace(/\s+/g, " ").trim();
				if (selDropdownInput) {
					selDropdownInput.value = selectedText;
					if (typeof initInputEffects === "function") initInputEffects();
				} else if (selDropdownValueSpan) selDropdownValueSpan.innerHTML = selectedText;
				selOptions.forEach((o) => o.classList.toggle("is-active", o === item));
				closeDropdown();
				checkAndSetPlaceholder();
			});
		});
	});
};
customMiniSelect();
//#endregion
export { getHash as a, setHash as c, slideUp as d, dataMediaQueries as i, slideDown as l, bodyLockStatus as n, gotoBlock as o, bodyUnlock as r, isMobile as s, bodyLock as t, slideToggle as u };
