const STORAGE_KEY = "electronicsReviews";

const form = document.querySelector("#review-form");
const list = document.querySelector("#review-list");
const template = document.querySelector("#review-template");
const clearButton = document.querySelector("#clear-reviews");
const emptyMessage = document.querySelector("#empty-message");

function getStoredReviews() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveReviews(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

function starsFor(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function renderReviews(reviews) {
  list.innerHTML = "";

  if (!reviews.length) {
    emptyMessage.hidden = false;
    return;
  }

  emptyMessage.hidden = true;

  reviews.forEach((review) => {
    const fragment = template.content.cloneNode(true);
    fragment.querySelector(".review-product").textContent = review.productName;
    fragment.querySelector(".review-rating").textContent = starsFor(review.rating);
    fragment.querySelector(".review-meta").textContent = `${review.category} • ${formatDate(review.createdAt)}`;
    fragment.querySelector(".review-body").textContent = review.reviewText;
    list.appendChild(fragment);
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const review = {
    productName: String(formData.get("productName") || "").trim(),
    category: String(formData.get("category") || ""),
    rating: Number(formData.get("rating")),
    reviewText: String(formData.get("reviewText") || "").trim(),
    createdAt: new Date().toISOString(),
  };

  if (!review.productName || !review.category || !review.rating || !review.reviewText) {
    return;
  }

  const reviews = getStoredReviews();
  reviews.unshift(review);
  saveReviews(reviews);
  renderReviews(reviews);
  form.reset();
}

function handleClear() {
  localStorage.removeItem(STORAGE_KEY);
  renderReviews([]);
}

form.addEventListener("submit", handleSubmit);
clearButton.addEventListener("click", handleClear);

renderReviews(getStoredReviews());
