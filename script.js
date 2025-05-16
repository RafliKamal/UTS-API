let allArticles = [];

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
const GNEWS_API_KEY = "eab375807c600c1869105715bbee7d8b"; 

function fetchNews(query = "update") {
  $.ajax({
    url: `${CORS_PROXY}https://gnews.io/api/v4/search?q=${query}&lang=en&country=us&max=10&apikey=${GNEWS_API_KEY}`,
    method: "GET",
    success: function (response) {
      allArticles = response.articles || [];
      displayNews(allArticles);
      populateSourceFilter(allArticles);
    },
    error: function (err) {
      console.error("Error fetching news:", err);
      $("#news-list").html(`
        <div class="col-12 text-center">
          <div class="alert alert-danger">API usage has reached the limit, try again later</div>
        </div>
      `);
    },
  });
}

function displayNews(articles) {
  if (articles.length === 0) {
    $("#news-list").html(`
      <div class="col-12 text-center">
        <div class="alert alert-warning">No news found.</div>
      </div>
    `);
    return;
  }

  let newsHtml = "";
  articles.forEach((article, index) => {
    newsHtml += `
      <div class="col-12 col-sm-6 col-md-4 d-flex">
        <div class="card mb-3 w-100">
          <img src="${
            article.image || "https://via.placeholder.com/300x200?text=No+Image"
          }" class="card-img-top" alt="${article.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${article.title}</h5>
            <p class="card-text flex-grow-1">${
              article.description || "No description available."
            }</p>
            <button class="btn btn-dark mt-2" onclick="showDetails(${index})" data-toggle="modal" data-target="#newsModal">Read More</button>
          </div>
        </div>
      </div>
    `;
  });

  $("#news-list").html(newsHtml);
}

function populateSourceFilter(articles) {
  let sources = [...new Set(articles.map((article) => article.source?.name).filter(Boolean))];
  let selectedSource = $("#source-filter").val();

  let sourceOptions = `<option value="">All Sources</option>`;
  sources.forEach((source) => {
    sourceOptions += `<option value="${source}">${source}</option>`;
  });

  $("#source-filter").html(sourceOptions);
  if (selectedSource) {
    $("#source-filter").val(selectedSource);
  }
}

function showDetails(index) {
  let article = allArticles[index];
  let detailsHtml = `
    <h5>${article.title}</h5>
    <p><strong>Source:</strong> ${article.source?.name || "Unknown"}</p>
    <p><strong>Published At:</strong> ${new Date(article.publishedAt).toLocaleString()}</p>
    <img src="${
      article.image || "https://via.placeholder.com/300x200?text=No+Image"
    }" class="img-fluid my-3" />
    <p>${article.description || "No description available."}</p>
    <a href="${article.url}" target="_blank" class="btn btn-dark">Open Full Article</a>
  `;
  $("#news-details").html(detailsHtml);
}

function searchAndFilterNews() {
  let keyword = $("#input-search").val().trim();
  let selectedSource = $("#source-filter").val();
  if (keyword === "") keyword = "example";

  $("#news-list").html(
    `<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"></div></div>`
  );

  $.ajax({
    url: `${CORS_PROXY}https://gnews.io/api/v4/search?q=${keyword}&lang=en&country=us&max=10&apikey=${GNEWS_API_KEY}`,
    method: "GET",
    success: function (response) {
      let articles = response.articles || [];
      populateSourceFilter(articles);

      if (selectedSource) {
        articles = articles.filter((article) => article.source?.name === selectedSource);
      }

      allArticles = articles;
      displayNews(allArticles);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching news:", textStatus, errorThrown);
      $("#news-list").html(`
        <div class="col-12 text-center">
          <div class="alert alert-danger">Failed to fetch news. Please check your connection or try again.</div>
        </div>
      `);
    },
  });
}


//
// API KURS
// pakai API dari freecurrencyapi.com
function fetchTodayExchangeRates() {
  const API_KEY = "fca_live_rXjix2Yjx3QQmDz5CbXyeN74Vll7PkfAXihrALuI";

  const currencies =
    "IDR,EUR,JPY,GBP,AUD,CAD,CHF,CNY,HKD,SGD,KRW,NZD,THB,MYR,PHP,INR";
  const API_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&currencies=${currencies}`;

  const currencyFlags = {
    IDR: "https://flagcdn.com/id.svg",
    EUR: "https://flagcdn.com/eu.svg",
    JPY: "https://flagcdn.com/jp.svg",
    GBP: "https://flagcdn.com/gb.svg",
    AUD: "https://flagcdn.com/au.svg",
    CAD: "https://flagcdn.com/ca.svg",
    CHF: "https://flagcdn.com/ch.svg",
    CNY: "https://flagcdn.com/cn.svg",
    HKD: "https://flagcdn.com/hk.svg",
    SGD: "https://flagcdn.com/sg.svg",
    KRW: "https://flagcdn.com/kr.svg",
    NZD: "https://flagcdn.com/nz.svg",
    THB: "https://flagcdn.com/th.svg",
    MYR: "https://flagcdn.com/my.svg",
    PHP: "https://flagcdn.com/ph.svg",
    INR: "https://flagcdn.com/in.svg",
  };

  $.ajax({
    url: API_URL,
    method: "GET",
    success: function (response) {
      const rates = response.data;
      const itemsPerSlide = 4;
      const currenciesArr = Object.entries(rates);

      let slidesHtml = "";
      for (let i = 0; i < currenciesArr.length; i += itemsPerSlide) {
        let chunk = currenciesArr.slice(i, i + itemsPerSlide);
        slidesHtml += `<div class="carousel-item ${i === 0 ? "active" : ""}">
                <div class="d-flex justify-content-around flex-wrap">
            `;
        chunk.forEach(([currency, rate]) => {
          const flagUrl =
            currencyFlags[currency] || "https://via.placeholder.com/30";
          slidesHtml += `
                  <div class="d-flex align-items-center border rounded px-3 py-2 m-1 shadow-sm" style="min-width: 180px;">
                      <strong>1 USD =</strong>
                      <img src="${flagUrl}" alt="${currency}" style="width: 25px; height: 18px; object-fit: cover; margin: 0 8px;">
                      <strong>${currency}</strong>
                      <span class="ml-auto">${parseFloat(rate).toFixed(2)}</span>
                  </div>
              `;
        });
        slidesHtml += `</div></div>`;
      }

      const carouselHtml = `
<h5 class="mb-3 text-center">📊 today's exchange rate</h5>
<div id="currencyCarousel" class="carousel slide" data-ride="carousel" data-interval="4000">
    <div class="carousel-inner">
        ${slidesHtml}
    </div>
    <a class="carousel-control-prev" href="#currencyCarousel" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#currencyCarousel" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
    </a>
</div>
`;

      $("#currency-rate").html(carouselHtml);

      $("#currencyCarousel").carousel({
        interval: 5000,
        pause: false,
      });
    },
  });
}

function fetchMultipleCitiesWeather() {
  const WEATHER_API_KEY = "9548221e8b634c39004ee0f0e639d970";
  const cities = [
    "Washington, D.C.",
    "Beijing",
    "Tokyo",
    "Jakarta",
    "Moscow",
    "London",
    "Berlin",
    "Paris",
    "Brasília",
    "Canberra",
    "Ottawa",
    "Seoul",
  ];

  let requests = cities.map((city) =>
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=en`,
      method: "GET",
    })
  );

  Promise.all(requests)
    .then((responses) => {
      let html = "";
      responses.forEach((data) => {
        html += `
          <div class="card mb-2 shadow-sm">
            <div class="card-body p-2 text-center">
              <h6 class="mb-1">${data.name}</h6>
              <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" style="width:50px;">
              <p class="mb-1 small">${data.weather[0].description}</p>
              <p class="mb-1"><strong>${data.main.temp}°C</strong></p>
              <small>Humidity: ${data.main.humidity}%<br>Wind: ${data.wind.speed} m/s</small>
            </div>
          </div>
        `;
      });

      $("#weather-info").html(html);
    })
    .catch(() => {
      $("#weather-info").html(
        `<div class="alert alert-danger text-center">Gagal memuat cuaca.</div>`
      );
    });
}

function fetchWeather(city) {
  const WEATHER_API_KEY = "9548221e8b634c39004ee0f0e639d970";

  $("#weather-info").html(
    `<div class="text-center">Memuat cuaca untuk ${city}...</div>`
  );

  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=id`,
    method: "GET",
    success: function (data) {
      const html = `
        <div class="card shadow-sm">
          <div class="card-body p-2 text-center">
            <h6 class="mb-1">${data.name}</h6>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" style="width:50px;">
            <p class="mb-1 small">${data.weather[0].description}</p>
            <p class="mb-1"><strong>${data.main.temp}°C</strong></p>
            <small>Kelembapan: ${data.main.humidity}%<br>Angin: ${data.wind.speed} m/s</small>
          </div>
        </div>
      `;
      $("#weather-info").html(html);
    },
    error: function () {
      $("#weather-info").html(`
    <div class="alert alert-danger text-center">
       Weather for city "<strong>${city}</strong>" not found. Double check the spelling of the city.
    </div>
  `);
    },
  });
}

// Events

$("#input-search").on("keypress", function (e) {
  if (e.keyCode === 13) searchAndFilterNews();
});
$("#source-filter").change(searchAndFilterNews);

$("#city-input").on("keypress", function (e) {
  if (e.keyCode === 13) {
    const city = $(this).val().trim();
    if (city) {
      fetchWeather(city);
      $("#show-all-cities").show();
    } else {
      $("#weather-info").html(
        `<div class="alert alert-warning text-center">Masukkan nama kota terlebih dahulu.</div>`
      );
    }
  }
});

$("#show-all-cities").hide();


$(document).ready(function () {
  // Inisialisasi data saat halaman load
  fetchNews();
  fetchTodayExchangeRates();
  fetchMultipleCitiesWeather();

  // Event saat tombol search diklik
  $("#button-search").on("click", function () {
    console.log("Button search clicked");
    searchAndFilterNews();
  });

  $("#input-search").on("keypress", function (e) {
    if (e.keyCode === 13) {
      console.log("Enter pressed in search input");
      searchAndFilterNews();
    }
  });

  // Event saat filter sumber berita berubah
  $("#source-filter").on("change", function () {
    searchAndFilterNews();
  });

  // Event saat tombol "Search City" diklik
  $("#search-city-btn").on("click", function () {
    const city = $("#city-input").val().trim();
    if (city) {
      fetchWeather(city);
      $("#show-all-cities").show();
    } else {
      $("#weather-info").html(
        `<div class="alert alert-warning text-center">Masukkan nama kota terlebih dahulu.</div>`
      );
    }
  });

  // Event saat tombol "Show All Cities" diklik
  $("#show-all-cities").on("click", function () {
    fetchMultipleCitiesWeather();
    $("#city-input").val(""); // Kosongkan input kota
    $("#show-all-cities").hide();
  });
});
