document.addEventListener('DOMContentLoaded', function() {
  // Target date: 2025-08-01T15:20:00 GMT
  const targetDate = new Date('2025-08-01T15:20:00Z');

  // Elements
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const countdownEl = document.getElementById('countdown');
  const imageEl = document.querySelector('.image-container img'); // Get the image element

  // Previous values to check for changes
  let prevDays = -1;
  let prevHours = -1;
  let prevMinutes = -1;
  let prevSeconds = -1;

  // Image cycling functionality
  let currentImageIndex = 1; // Start with image 1 (img_01.jpg)

  // Add click event listener to the entire document
  document.addEventListener('click', function() {
    // Increment the image index, cycling back to 1 after reaching 3
    currentImageIndex = currentImageIndex % 3 + 1;

    // Update the image source with the new index
    imageEl.src = `assets/images/img_0\${currentImageIndex}.jpg`;
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