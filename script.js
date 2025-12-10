let map;
let service;
let userLocation;
let activeMarkers = [];

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map = new google.maps.Map(document.getElementById("map"), {
          center: userLocation,
          zoom: 14,
        });

        new google.maps.Marker({
          map: map,
          position: userLocation,
          title: "You are here",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          },
        });

        service = new google.maps.places.PlacesService(map);
      },
      () => alert("Unable to get your location. Please enable GPS.")
    );
  } else {
    alert("Geolocation not supported by your browser.");
  }
}

function clearMarkers() {
  activeMarkers.forEach((m) => m.setMap(null));
  activeMarkers = [];
}

function searchHospital() {
  const disease = document.getElementById("searchInput").value.trim();
  if (!disease) return alert("Please enter a disease or problem.");

  if (!userLocation) return alert("Please allow location access first.");

  let keyword = disease.toLowerCase();
  if (keyword.includes("heart")) keyword = "cardiac hospital";
  else if (keyword.includes("eye")) keyword = "eye hospital";
  else if (keyword.includes("bone")) keyword = "orthopedic hospital";
  else if (keyword.includes("brain")) keyword = "neurology hospital";
  else if (keyword.includes("child")) keyword = "children hospital";
  else if (keyword.includes("skin")) keyword = "skin hospital";
  else if (keyword.includes("cancer")) keyword = "cancer hospital";
  else if (keyword.includes("dental")) keyword = "dental hospital";
  else keyword += " hospital";

  const request = {
    location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
    radius: 5000,
    keyword,
  };

  service.nearbySearch(request, (results, status) => {
    if (
      status === google.maps.places.PlacesServiceStatus.OK &&
      results.length
    ) {
      clearMarkers();

      results.slice(0, 3).forEach((hospital) => {
        const marker = new google.maps.Marker({
          map,
          position: hospital.geometry.location,
          title: hospital.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="color: #000; font-size:15px;">
              <strong>${hospital.name}</strong><br>
              ${hospital.vicinity || "Address not available"}<br>
              <a href="https://www.google.com/maps/dir/?api=1&origin=${
                userLocation.lat
              },${
            userLocation.lng
          }&destination=${hospital.geometry.location.lat()},${hospital.geometry.location.lng()}" target="_blank">Get Directions</a>
            </div>
          `,
        });

        marker.addListener("click", () => infoWindow.open(map, marker));
        activeMarkers.push(marker);
      });
    } else {
      alert("No hospitals found nearby.");
    }
  });
}

/* Reveal animation */
function setupReveal() {
  const reveals = document.querySelectorAll(".reveal, .feature-card");
  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => io.observe(el));
}

/* Smooth parallax */
function setupParallax() {
  const bg = document.querySelector(".hero-bg");
  if (!bg) return;
  window.addEventListener("scroll", () => {
    const y = window.scrollY * 0.3;
    bg.style.transform = `translateY(${y}px) scale(1.05)`;
  });
}

/* Loader hide */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";
  setTimeout(() => loader.remove(), 600);
});

/* DOM Ready */
document.addEventListener("DOMContentLoaded", () => {
  setupReveal();
  setupParallax();

  document
    .getElementById("searchBtn")
    .addEventListener("click", searchHospital);

  document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchHospital();
    }
  });
});
