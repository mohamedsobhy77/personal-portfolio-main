function openWindow(id) {
  const win = document.getElementById(id + "-window");
  if (win) {
    win.style.display = "flex";
    win.style.zIndex = Date.now();
    makeDraggable(win);
    makeSwipeable(win, id);
  }
}

function closeWindow(id) {
  const win = document.getElementById(id + "-window");
  if (win) {
    win.style.display = "none";
  }
}

function makeDraggable(el) {
  const header = el.querySelector(".window-header");
  let offsetX = 0, offsetY = 0, isDown = false;

  header.addEventListener("mousedown", (e) => {
    isDown = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.zIndex = Date.now();
    
    const windowId = el.id.replace('-window', '');
    setActiveWindow(windowId);
  });

  document.addEventListener("mouseup", () => isDown = false);
  document.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    el.style.left = `${e.clientX - offsetX}px`;
    el.style.top = `${e.clientY - offsetY}px`;
  });
}

function makeSwipeable(el, id) {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  el.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, false);

  el.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe(id);
  }, false);

  function handleSwipe(windowId) {
    const swipeThreshold = 100;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffY) > Math.abs(diffX) && diffY > swipeThreshold) {
      closeWindow(windowId);
    }
    else if (Math.abs(diffX) > Math.abs(diffY) && diffX > swipeThreshold) {
      closeWindow(windowId);
    }
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const icon = document.getElementById('theme-icon');
  
  if (document.body.classList.contains('dark-mode')) {
    icon.className = 'fas fa-sun';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    icon.className = 'fas fa-moon';
    localStorage.setItem('darkMode', 'disabled');
  }
}

function initVisitorCounter() {
  let count = localStorage.getItem('visitorCount');
  
  if (!count) {
    count = Math.floor(Math.random() * 1000) + 1000;
  } else {
    count = parseInt(count) + 1;
  }
  
  localStorage.setItem('visitorCount', count);
  
  animateCounter(count);
}

function animateCounter(targetCount) {
  const counterElement = document.getElementById('visitor-count');
  let currentCount = 0;
  const duration = 2000;
  const steps = 50;
  const increment = targetCount / steps;
  const stepDuration = duration / steps;

  const timer = setInterval(() => {
    currentCount += increment;
    if (currentCount >= targetCount) {
      currentCount = targetCount;
      clearInterval(timer);
    }
    counterElement.textContent = String(Math.floor(currentCount)).padStart(6, '0');
  }, stepDuration);
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    document.getElementById('theme-icon').className = 'fas fa-sun';
  }
  
  initVisitorCounter();
});
