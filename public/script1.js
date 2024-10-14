let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
const carouselTrack = document.querySelector('.carousel-track');

// Toggle the visibility of the profile dropdown
document.getElementById('profile-link').addEventListener('click', function (event) {
    event.preventDefault();
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('visible');
});


function moveSlide(n) {
    currentSlide += n;
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    const slideWidth = slides[0].clientWidth;
    carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
}

function selectSlide(index) {
    currentSlide = index;
    const slideWidth = slides[0].clientWidth;
    carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
}

window.addEventListener('resize', () => {
    const slideWidth = slides[0].clientWidth;
    carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
});

setInterval(() => {
    moveSlide(1);
}, 5000);
  // Toggle the visibility of the profile dropdown
document.getElementById('profile-link').addEventListener('click', function (event) {
    event.preventDefault();
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('visible');
});

// Logout functionality (you can replace this with your real logout logic)
document.getElementById('logout-btn').addEventListener('click', function () {
    alert('You have logged out!');
});
