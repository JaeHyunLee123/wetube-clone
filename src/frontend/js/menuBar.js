const menuBar = document.querySelector(".menu__bar");
const menuBtn = document.querySelector(".menu__icon i");

let isApear = false;

/**
 * @todo add animation when menu disappear
 */
const handleOpenMenu = () => {
  menuBar.classList.toggle("hide");
  menuBar.classList.toggle("apear");
};

menuBtn.addEventListener("click", handleOpenMenu);
