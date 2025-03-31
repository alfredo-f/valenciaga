document.addEventListener('DOMContentLoaded', function() {
  // Target date: 2025-08-01T15:20:00 GMT
  const targetDate = new Date('2025-08-01T15:20:00Z');

  // Update the countdown every second
  setInterval(updateCountdown, 1000);

  function updateCountdown() {
  const currentDate = new Date();
  const difference = targetDate - currentDate;

  // If the target date has passed
  if (difference <= 0) {
  document.getElementById('countdown').innerHTML = 'The date has passed!';
  return;
}

  // Calculate days, hours, minutes, seconds
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  // Display the countdown
  document.getElementById('countdown').innerHTML =
  days + ' days, ' +
  hours + ' hours, ' +
  minutes + ' minutes, ' +
  seconds + ' seconds';
}

  // Initial call to display the countdown immediately
  updateCountdown();
});
