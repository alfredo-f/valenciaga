document.addEventListener('DOMContentLoaded', function() {
  // Target date: 2025-08-01T15:20:00 GMT
  const targetDate = new Date('2025-08-01T15:20:00Z');

  // Elements
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const countdownEl = document.getElementById('countdown');
  const imageEl = document.querySelector('.image-container img');
  const scrollContainer = document.querySelector('.scroll-container');
  const contentContainer = document.querySelector('.content-container');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  // Previous values to check for changes
  let prevDays = -1;
  let prevHours = -1;
  let prevMinutes = -1;
  let prevSeconds = -1;

  // Image cycling functionality
  let currentImageIndex = 1;

  // Preload all images for smoother transitions
  function preloadImages() {
    for (let i = 1; i <= 3; i++) {
      const img = new Image();
      img.src = `assets/images/img_0${i}.jpg`;
    }
  }
  preloadImages();

  // Add CSS transition to the image
  imageEl.style.transition = 'opacity 0.5s ease-in-out';
  imageEl.style.opacity = '1';

  // Cycle images every 2 seconds
  setInterval(function() {
    // Fade out
    imageEl.style.opacity = '0';

    setTimeout(function() {
      // Increment the image index, cycling back to 1 after reaching 3
      currentImageIndex = currentImageIndex % 3 + 1;

      // Update the image source
      const srcNew = `assets/images/img_0${currentImageIndex}.jpg`
      imageEl.src = srcNew;

      // Fade in after a small delay to ensure the new image is loaded
      setTimeout(function() {
        imageEl.style.opacity = '1';
      }, 50);
    }, 500); // This matches the fade-out transition duration
  }, 2000); // Cycle every 2 seconds

  // Scroll effects
  scrollContainer.addEventListener('scroll', function() {
    const scrollPosition = scrollContainer.scrollTop;
    const windowHeight = window.innerHeight;

    // Activate second page content when scrolled to it
    if (scrollPosition > windowHeight / 2) {
      contentContainer.classList.add('active');
    } else {
      contentContainer.classList.remove('active');
    }
  });

  // Handle scroll indicator click - smooth scroll to second page
  scrollIndicator.addEventListener('click', function() {
    scrollContainer.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  });

  // Update the countdown every second
  setInterval(updateCountdown, 1000);

  function updateCountdown() {
    const currentDate = new Date();
    const difference = targetDate - currentDate;

    // If the target date has passed
    if (difference <= 0) {
      countdownEl.innerHTML = '<div class="expired-message">The date has passed!</div>';
      return;
    }

    // Calculate days, hours, minutes, seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Update the DOM with new values
    updateElement(daysEl, days, prevDays);
    updateElement(hoursEl, hours, prevHours);
    updateElement(minutesEl, minutes, prevMinutes);
    updateElement(secondsEl, seconds, prevSeconds);

    // Update previous values
    prevDays = days;
    prevHours = hours;
    prevMinutes = minutes;
    prevSeconds = seconds;
  }

  function updateElement(element, value, prevValue) {
    // Add leading zero if needed
    const displayValue = value < 10 ? '0' + value : value;

    // Update the element
    element.textContent = displayValue;

    // Add animation if the value changed
    if (prevValue !== -1 && prevValue !== value) {
      element.style.animation = 'none';
      void element.offsetWidth; // Trigger reflow
      element.style.animation = 'pulse 0.5s ease';
    }
  }

  // Initial call to display the countdown immediately
  updateCountdown();
});