//#region src/components/effects/mouse/mouse.js
var MousePRLX = class {
	constructor(props, data = null) {
		this.config = Object.assign({ init: true }, props);
		if (this.config.init) {
			const paralaxMouse = document.querySelectorAll("[data-fls-mouse]");
			if (paralaxMouse.length) this.paralaxMouseInit(paralaxMouse);
		}
	}
	paralaxMouseInit(paralaxMouse) {
		paralaxMouse.forEach((el) => {
			const paralaxMouseWrapper = el.closest("[data-fls-mouse-wrapper]");
			const paramСoefficientX = +el.dataset.flsMouseCx || 100;
			const paramСoefficientY = +el.dataset.flsMouseCy || 100;
			const directionX = el.hasAttribute("data-fls-mouse-dxr") ? -1 : 1;
			const directionY = el.hasAttribute("data-fls-mouse-dyr") ? -1 : 1;
			const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 50;
			let positionX = 0, positionY = 0;
			let coordXprocent = 0, coordYprocent = 0;
			setMouseParallaxStyle();
			if (paralaxMouseWrapper) mouseMoveParalax(paralaxMouseWrapper);
			else mouseMoveParalax();
			function setMouseParallaxStyle() {
				const distX = coordXprocent - positionX;
				const distY = coordYprocent - positionY;
				positionX = positionX + distX * paramAnimation / 1e3;
				positionY = positionY + distY * paramAnimation / 1e3;
				el.style.cssText = `transform: translate3D(${directionX * positionX / (paramСoefficientX / 10)}%,${directionY * positionY / (paramСoefficientY / 10)}%,0) rotate(0.02deg);`;
				requestAnimationFrame(setMouseParallaxStyle);
			}
			function mouseMoveParalax(wrapper = window) {
				wrapper.addEventListener("mousemove", function(e) {
					const offsetTop = el.getBoundingClientRect().top + window.scrollY;
					if (offsetTop >= window.scrollY || offsetTop + el.offsetHeight >= window.scrollY) {
						const parallaxWidth = window.innerWidth;
						const parallaxHeight = window.innerHeight;
						const coordX = e.clientX - parallaxWidth / 2;
						const coordY = e.clientY - parallaxHeight / 2;
						coordXprocent = coordX / parallaxWidth * 100;
						coordYprocent = coordY / parallaxHeight * 100;
					}
				});
			}
		});
	}
};
document.querySelector("[data-fls-mouse]") && window.addEventListener("load", new MousePRLX({}));
//#endregion
