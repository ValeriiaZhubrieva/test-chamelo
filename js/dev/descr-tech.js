import { DotLottie } from "https://esm.sh/@lottiefiles/dotlottie-web";
//#region src/components/custom/descr-tech/desk-tech.js
document.querySelectorAll(".descr-tech__item-img canvas").forEach((canvas) => {
	const lottieUrl = canvas.closest(".descr-tech__item-img").getAttribute("lottie-url");
	console.log(lottieUrl);
	if (lottieUrl && lottieUrl !== "blank") {
		let dotLottie = new DotLottie({
			canvas,
			src: lottieUrl
		});
		if (window.innerWidth > 768) {
			canvas.addEventListener("mouseenter", () => {
				dotLottie.setMode("forward");
				dotLottie.play();
			});
			canvas.addEventListener("mouseleave", () => {
				dotLottie.setMode("reverse");
				dotLottie.play();
			});
		} else canvas.addEventListener("click", () => {
			if (canvas.hasAttribute("js-expend")) {
				canvas.removeAttribute("js-expend");
				dotLottie.setMode("reverse");
			} else {
				canvas.setAttribute("js-expend", "");
				dotLottie.setMode("forward");
			}
			dotLottie.play();
		});
	}
});
//#endregion
