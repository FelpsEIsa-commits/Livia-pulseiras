const words = ["delicado", "personalizado", "preto", "autoral"];
const switchWord = document.querySelector("#switch-word");
const logoBubble = document.querySelector(".logo-bubble");
const filterButtons = Array.from(document.querySelectorAll(".filter"));
const productCards = Array.from(document.querySelectorAll(".product-card"));
const photoSlots = Array.from(document.querySelectorAll(".photo-slot"));
const activePhotoName = document.querySelector("#active-photo-name");
const activePhotoBar = document.querySelector("#active-photo-bar");
const showMain = document.querySelector("#show-main");
const heroVisual = document.querySelector(".hero-visual");
const orbit = document.querySelector(".orbit");
const heroCards = Array.from(document.querySelectorAll(".visual-card"));
const lookbookCards = Array.from(document.querySelectorAll(".look-mini"));
const themeToggle = document.querySelector("#theme-toggle");
const scrollProgressBar = document.querySelector("#scroll-progress-bar");

if (scrollProgressBar) {
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max((scrollTop / maxScroll) * 100, 0), 100);
    scrollProgressBar.style.width = `${progress}%`;
  };

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();
}

if (switchWord) {
  let wordIndex = 0;
  setInterval(() => {
    wordIndex = (wordIndex + 1) % words.length;
    switchWord.style.opacity = "0";
    switchWord.style.transform = "translateY(6px)";

    setTimeout(() => {
      switchWord.textContent = words[wordIndex];
      switchWord.style.opacity = "1";
      switchWord.style.transform = "translateY(0)";
    }, 170);
  }, 2200);

  switchWord.style.transition = "opacity 0.2s ease, transform 0.2s ease";
}

if (logoBubble && logoBubble.animate) {
  setInterval(() => {
    logoBubble.animate(
      [
        { transform: "scale(1) rotate(0deg)" },
        { transform: "scale(1.15) rotate(-8deg)" },
        { transform: "scale(1) rotate(0deg)" },
      ],
      { duration: 600, easing: "ease-out" }
    );
  }, 2600);
}

function readStoredTheme() {
  try {
    return window.localStorage.getItem("lili-theme");
  } catch (error) {
    return null;
  }
}

function writeStoredTheme(theme) {
  try {
    window.localStorage.setItem("lili-theme", theme);
  } catch (error) {
    // Ignore storage errors (private mode / blocked storage).
  }
}

const savedTheme = readStoredTheme();

function setTheme(theme) {
  if (theme === "dark") {
    document.body.dataset.theme = "dark";
    if (themeToggle) {
      themeToggle.textContent = "Modo Claro";
      themeToggle.setAttribute("aria-pressed", "true");
    }
  } else {
    document.body.dataset.theme = "light";
    if (themeToggle) {
      themeToggle.textContent = "Modo Noturno";
      themeToggle.setAttribute("aria-pressed", "false");
    }
  }

  writeStoredTheme(theme);
}

if (savedTheme === "dark") {
  setTheme("dark");
} else {
  setTheme("light");
}

if (themeToggle) {
  themeToggle.addEventListener("click", (event) => {
    const isDark = document.body.dataset.theme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    const rect = themeToggle.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    document.body.style.setProperty("--theme-x", `${x}px`);
    document.body.style.setProperty("--theme-y", `${y}px`);
    document.body.classList.remove("is-theme-switching");
    void document.body.offsetWidth;
    document.body.classList.add("is-theme-switching");

    setTheme(nextTheme);
    setTimeout(() => document.body.classList.remove("is-theme-switching"), 900);
  });
}

const popTargets = Array.from(
  document.querySelectorAll(".btn, .filter, .mini-tags span, .studio-chips span, .header-cta")
);

popTargets.forEach((target) => {
  const playPop = () => {
    target.classList.remove("is-popping");
    void target.offsetWidth;
    target.classList.add("is-popping");
  };

  target.addEventListener("pointerenter", playPop);
  target.addEventListener("pointerdown", playPop);
});

if (heroVisual && orbit && window.matchMedia("(hover: hover)").matches) {
  heroVisual.addEventListener("pointermove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    orbit.style.transform = `translate3d(${offsetX * 14}px, ${offsetY * 14}px, 0)`;
  });

  heroVisual.addEventListener("pointerleave", () => {
    orbit.style.transform = "translate3d(0, 0, 0)";
  });
}

function getPhotoProgress(photoId) {
  const total = Math.max(photoSlots.length, 1);
  const normalized = photoId / total;
  return Math.min(Math.max(normalized * 100, 0), 100);
}

function parseImageList(value) {
  if (!value) {
    return [];
  }

  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function setMediaImage(element, imagePath, overlayAlpha = 0.12) {
  if (!element || !imagePath) {
    return;
  }

  element.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, ${overlayAlpha}), rgba(255, 255, 255, ${overlayAlpha})), url("${imagePath}")`;
}

function setShowMain(title, imagePath) {
  if (!showMain) {
    return;
  }

  showMain.classList.remove("is-updating");
  void showMain.offsetWidth;
  showMain.classList.add("is-updating");

  if (imagePath) {
    showMain.classList.add("has-photo");
    showMain.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)), url("${imagePath}")`;
  } else {
    showMain.classList.remove("has-photo");
    showMain.style.backgroundImage = "";
  }

  showMain.textContent = title;
}

function setActiveCard(card) {
  if (!card) {
    return;
  }

  productCards.forEach((item) => item.classList.remove("is-active"));
  card.classList.add("is-active");

  const slot = card.querySelector(".photo-slot");
  const title = card.querySelector("h3")?.textContent?.trim() || "Pulseira";
  const photoId = Number(slot?.dataset.photoId || "1");
  const imagePath = slot?.dataset.currentImage?.trim() || slot?.dataset.image?.trim() || "";

  if (activePhotoName) {
    activePhotoName.textContent = title;
  }

  if (activePhotoBar) {
    activePhotoBar.style.width = `${getPhotoProgress(photoId)}%`;
  }

  setShowMain(title, imagePath);
}

function getCurrentImageIndex(element, imageList) {
  const datasetIndex = Number(element.dataset.mediaIndex);
  if (Number.isInteger(datasetIndex) && datasetIndex >= 0 && datasetIndex < imageList.length) {
    return datasetIndex;
  }

  const currentImage = element.dataset.currentImage?.trim() || "";
  const foundIndex = imageList.indexOf(currentImage);
  return foundIndex >= 0 ? foundIndex : 0;
}

function chooseNextUniqueImage(element, imageList, groupElements, pendingImages) {
  const currentIndex = getCurrentImageIndex(element, imageList);
  const currentImage = imageList[currentIndex] || "";
  const blocked = new Set(pendingImages);

  groupElements.forEach((peer) => {
    if (peer === element) {
      return;
    }

    const peerImage = peer.dataset.currentImage?.trim() || "";
    if (peerImage) {
      blocked.add(peerImage);
    }
  });

  for (let step = 1; step <= imageList.length; step += 1) {
    const nextIndex = (currentIndex + step) % imageList.length;
    const nextImage = imageList[nextIndex];
    if (!nextImage) {
      continue;
    }

    if (imageList.length > 1 && nextImage === currentImage) {
      continue;
    }

    if (!blocked.has(nextImage)) {
      return { nextIndex, nextImage };
    }
  }

  const fallbackIndex = imageList.length > 1 ? (currentIndex + 1) % imageList.length : currentIndex;
  return {
    nextIndex: fallbackIndex,
    nextImage: imageList[fallbackIndex] || currentImage,
  };
}

function reservePendingImage(pendingCounts, imagePath) {
  if (!imagePath) {
    return;
  }

  pendingCounts.set(imagePath, (pendingCounts.get(imagePath) || 0) + 1);
}

function releasePendingImage(pendingCounts, imagePath) {
  if (!imagePath) {
    return;
  }

  const currentCount = pendingCounts.get(imagePath) || 0;
  if (currentCount <= 1) {
    pendingCounts.delete(imagePath);
    return;
  }

  pendingCounts.set(imagePath, currentCount - 1);
}

function initMediaSlots(slots, overlayAlpha = 0.12) {
  const usedImages = new Set();

  slots.forEach((slot) => {
    const imageList = parseImageList(slot.dataset.images || slot.dataset.image || "");
    if (imageList.length === 0) {
      return;
    }

    const uniqueIndex = imageList.findIndex((image) => !usedImages.has(image));
    const selectedIndex = uniqueIndex >= 0 ? uniqueIndex : 0;
    const selectedImage = imageList[selectedIndex];

    slot.dataset.mediaIndex = String(selectedIndex);
    slot.dataset.currentImage = selectedImage;
    usedImages.add(selectedImage);
    setMediaImage(slot, selectedImage, overlayAlpha);
  });
}

function startMediaRotation(elements, options = {}) {
  const {
    overlayAlpha = 0.12,
    intervalMs = 3800,
    fadeMs = 200,
    staggerMs = 420,
    updateShowcase = false,
  } = options;
  const pendingCounts = new Map();

  elements.forEach((element, elementIndex) => {
    const imageList = parseImageList(element.dataset.images || element.dataset.image || "");
    if (imageList.length <= 1) {
      return;
    }

    setInterval(() => {
      const pendingImages = new Set(pendingCounts.keys());
      const { nextIndex, nextImage } = chooseNextUniqueImage(element, imageList, elements, pendingImages);
      reservePendingImage(pendingCounts, nextImage);
      element.classList.add("is-switching");

      setTimeout(() => {
        releasePendingImage(pendingCounts, nextImage);
        element.dataset.mediaIndex = String(nextIndex);
        element.dataset.currentImage = nextImage;
        setMediaImage(element, nextImage, overlayAlpha);
        element.classList.remove("is-switching");

        if (updateShowcase) {
          const activeCard = element.closest(".product-card");
          if (activeCard?.classList.contains("is-active")) {
            const title = activeCard.querySelector("h3")?.textContent?.trim() || "Pulseira";
            setShowMain(title, nextImage);
          }
        }
      }, fadeMs);
    }, intervalMs + elementIndex * staggerMs);
  });
}

initMediaSlots(heroCards, 0.14);
initMediaSlots(photoSlots, 0.08);
initMediaSlots(lookbookCards, 0.08);

photoSlots.forEach((slot) => {
  const imagePath = slot.dataset.currentImage?.trim() || slot.dataset.image?.trim() || "";
  if (imagePath) {
    slot.classList.add("has-image");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    productCards.forEach((card) => {
      const category = card.dataset.category;
      const isVisible = filter === "all" || category === filter;
      card.hidden = !isVisible;
    });

    const firstVisible = productCards.find((card) => !card.hidden);
    const firstVisibleSlot = firstVisible?.querySelector(".photo-slot");
    if (firstVisibleSlot) {
      firstVisibleSlot.classList.add("is-visible");
    }
    setActiveCard(firstVisible);
  });
});

const revealItems = document.querySelectorAll(".reveal");
const canObserve = "IntersectionObserver" in window;

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 320)}ms`);
});

if (canObserve) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const revealSlot = (slot) => {
  slot.classList.add("is-visible");

  const card = slot.closest(".product-card");
  if (card && !card.hidden) {
    setActiveCard(card);
  }
};

if (canObserve) {
  const slotObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        revealSlot(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  photoSlots.forEach((slot) => slotObserver.observe(slot));
} else {
  photoSlots.forEach((slot) => revealSlot(slot));
}

if (window.matchMedia("(hover: hover)").matches) {
  productCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (card.hidden) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--ry", `${x * 8}deg`);
      card.style.setProperty("--rx", `${-y * 8}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

startMediaRotation(heroCards, {
  overlayAlpha: 0.14,
  intervalMs: 3600,
  fadeMs: 180,
});

startMediaRotation(photoSlots, {
  overlayAlpha: 0.08,
  intervalMs: 4300,
  fadeMs: 190,
  updateShowcase: true,
});

startMediaRotation(lookbookCards, {
  overlayAlpha: 0.08,
  intervalMs: 3900,
  fadeMs: 180,
});

const firstCard = productCards.find((card) => !card.hidden);
setActiveCard(firstCard);
