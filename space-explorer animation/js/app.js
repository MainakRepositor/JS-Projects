const sections = document.querySelectorAll("section");
const navList = document.querySelector(".navbar__list");
const navbar = document.querySelector(".navbar");
const hero = document.querySelector(".hero");

//function to populate the navbar
const buildLinks = () => {
  for (let section of sections) {
    //label of the navbar link
    const linkName = section.getAttribute("data-nav");
    //create and add the class to the navbar item node
    const listItem = document.createElement("LI");
    listItem.classList.add("navbar__item");
    const linkItem = document.createElement("A");
    linkItem.classList.add("navbar__link");
    linkItem.textContent = linkName;
    linkItem.setAttribute("href", `#${section.id}`);
    listItem.appendChild(linkItem);
    navList.appendChild(listItem);
  }
};

//highlight active link
const highLightActive = () => {
  //find the boundary of the active link
  let activeLink = document
    .querySelector(".active-link")
    .getBoundingClientRect();
  //set the left position and width of the underline to the left and width of the link
  document.documentElement.style.setProperty(
    "--leftPos",
    `${activeLink.left}px`
  );
  document.documentElement.style.setProperty(
    "--linkWidth",
    `${activeLink.width}px`
  );
};

//add class 'active' section
const spyScrolling = () => {
  const scrollPos = document.scrollingElement.scrollTop + 1;
  //animate the gototop buttonn to hide while scrolling
  if (scrollPos >= document.body.offsetHeight / 2) {
    goTop.style.bottom = "3vw";
  } else {
    goTop.style.bottom = "-5rem";
  }

  for (let section of sections) {
    const id = section.id;

    if (scrollPos >= hero.offsetHeight) {
      //only begin if the user has scrolled passed the header
      if (section.offsetTop <= scrollPos) {
        if (!document.querySelector(".active")) {
          sections[0].classList.add("active");
          document.querySelector(".navbar__item").classList.add("active-link");
        }
        document.querySelector(".active-link").classList.remove("active-link");
        document.querySelector(".active").classList.remove("active");
        document
          .querySelector(`a[href*=${id}]`)
          .parentElement.classList.add("active-link");
        document.querySelector(`#${id}`).classList.add("active");
        highLightActive();
      }
    }
    //remove all active states when the user isn't on any section
    else {
      sections[0].classList.remove("active");
      document.querySelector(".navbar__item").classList.remove("active-link");
      document.documentElement.style.setProperty("--leftPos", "-100vw");
    }
  }
};

let prevScrollpos = document.scrollingElement.scrollTop;
let timeOut;
const goTop = document.querySelector(".goTop");
const animateNavbar = () => {
  //adds and removes a background to the navbar on scroll
  let currentScrollPos = document.scrollingElement.scrollTop;
  if (currentScrollPos == 0) {
    navbar.classList.remove("navbar--dark");
  } else if (prevScrollpos < currentScrollPos) {
    navbar.classList.add("navbar--dark");
    navbar.style.top = `-${navbar.offsetHeight}px`;
  } else {
    navbar.style.top = "0";
  }
  prevScrollpos = currentScrollPos;
  //if the user isn't at the top of the screen and doesn't scroll, hide the navbar after 7 seconds
  if (prevScrollpos > hero.offsetHeight) {
    timeOut = setTimeout(() => {
      navbar.style.top = `-${navbar.offsetHeight}px`;
    }, 7000);
  } else {
    clearTimeout(timeOut);
  }
};

//add smooth scrolling behaviour
const makeNavLinksSmooth = event => {
  event.preventDefault();
  document.querySelector(event.target.hash).scrollIntoView({
    behavior: "smooth"
  });
};
navList.addEventListener("click", makeNavLinksSmooth);

//add gotoTop function
goTop.addEventListener("click", () => {
  document.querySelector("body").scrollIntoView({
    behavior: "smooth"
  });
});

window.addEventListener("DOMContentLoaded", () => {
  buildLinks();
});

//on window resize make sure the link is correctly positioned
window.addEventListener("resize", () => {
  spyScrolling();
});

window.addEventListener("scroll", () => {
  animateNavbar();
  spyScrolling();
});
