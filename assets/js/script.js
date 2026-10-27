'use strict';

// element toggle function
const elementToggleFunc = function (elem) {
  if (elem) elem.classList.toggle("active");
};

// sidebar variables & toggle functionality for mobile
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}

// custom select variables for mobile portfolio filter
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.trim().toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    const itemCategory = (filterItems[i].dataset.category || "").trim().toLowerCase();
    if (selectedValue === "all" || selectedValue === itemCategory) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn && filterBtn.length > 0 ? filterBtn[0] : null;

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.trim().toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// Copy contact details to clipboard with interactive feedback
window.copyContact = function (text, btnElement) {
  const showSuccess = () => {
    const originalHtml = btnElement.innerHTML;
    btnElement.classList.add("copied");
    btnElement.innerHTML = `<span>Copied!</span> <ion-icon name="checkmark-circle-outline"></ion-icon>`;

    const toast = document.getElementById("toastNotice");
    if (toast) {
      const toastText = toast.querySelector(".toast-text");
      if (toastText) toastText.innerText = `Copied: ${text}`;
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 2500);
    }

    setTimeout(() => {
      btnElement.classList.remove("copied");
      btnElement.innerHTML = originalHtml;
    }, 2500);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(showSuccess).catch(() => {
      fallbackCopy(text, showSuccess);
    });
  } else {
    fallbackCopy(text, showSuccess);
  }
};

function fallbackCopy(text, callback) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  tempInput.style.position = "fixed";
  tempInput.style.opacity = "0";
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand("copy");
    callback();
  } catch (e) {
    prompt("Copy to clipboard:", text);
  }
  document.body.removeChild(tempInput);
}

// Robust smooth scrolling function
window.scrollToSection = function (sectionId) {
  if (!sectionId) return;
  const target = document.getElementById(sectionId) || document.querySelector(`article[data-page="${sectionId}"]`);
  if (!target) return;

  const yCoordinate = target.getBoundingClientRect().top + window.pageYOffset - 15;
  window.scrollTo({
    top: yCoordinate,
    behavior: "smooth"
  });

  // Update active state in navbar
  document.querySelectorAll("[data-nav-link]").forEach((btn) => {
    const key = (btn.getAttribute("data-nav-link") || btn.innerText).trim().toLowerCase();
    if (key === sectionId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
};

// Attach click listeners to all nav buttons
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("article[data-page]");

navigationLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetKey = (this.getAttribute("data-nav-link") || this.innerText).trim().toLowerCase();
    window.scrollToSection(targetKey);
  });
});

// Update active navigation link on scroll
const updateActiveNav = function () {
  const scrollPosition = (window.pageYOffset || document.documentElement.scrollTop) + 120;

  pages.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionKey = (section.getAttribute("data-page") || section.id).trim().toLowerCase();

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navigationLinks.forEach((link) => {
        const linkKey = (link.getAttribute("data-nav-link") || link.innerText).trim().toLowerCase();
        if (linkKey === sectionKey) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  });
};

window.addEventListener("scroll", updateActiveNav, { passive: true });

// Initialize Apple Maps-style dark Leaflet map for Ahmedabad
document.addEventListener("DOMContentLoaded", function () {
  const mapElement = document.getElementById("appleMap");
  const mapCard = document.getElementById("appleMapCard");

  if (mapElement && typeof L !== "undefined") {
    // Ahmedabad, Gujarat coordinates
    const ahmedabadCoords = [23.0225, 72.5714];

    const map = L.map("appleMap", {
      center: ahmedabadCoords,
      zoom: 12,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: false,
      touchZoom: false,
      attributionControl: false
    });

    // 100% Free Esri World Dark Gray Canvas (Apple Maps dark mode aesthetic, zero API key)
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 16
    }).addTo(map);

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 16
    }).addTo(map);

    // Custom glowing amber-gold marker
    const customIcon = L.divIcon({
      className: "custom-map-marker",
      html: '<div class="marker-pulse"></div><div class="marker-pin"><ion-icon name="location"></ion-icon></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    L.marker(ahmedabadCoords, { icon: customIcon }).addTo(map);
  }

  // Click on map redirects directly to Google Maps location for Ahmedabad
  if (mapCard) {
    mapCard.addEventListener("click", function () {
      window.open("https://www.google.com/maps/search/?api=1&query=Ahmedabad,+Gujarat,+India", "_blank");
    });
  }
});

