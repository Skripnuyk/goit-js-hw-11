import fetchImages from "./fetch-images";
import { Notify } from "notiflix";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

const { searchForm, gallery, loadMoreBtn, endCollectionText } = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
    endCollectionText: document.querySelector('.end-collection-text'),
};

function renderCardImg(images) {
    const markup = images
    .map(image => {
      return `<div class="photo-card">
       <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
        <div class="info">
           <p class="info-item">
    <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-api">${image.views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-api">${image.comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-api">${image.downloads}</span> 
            </p>
        </div>
    </div>`;
    })
    .join('');
    gallery.innerHTML += markup;
};

let lightbox = new SimpleLightbox('.photo-card a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

searchForm.addEventListener('submit', onSubmitSearchForm);

async function onSubmitSearchForm(event) {
    event.preventDefault();
    searchQuery = event.currentTarget.searchQuery.value;
    currentPage = 1;

    if (searchQuery === '') {
        return;
    }

    const response = await fetchImages(searchQuery, currentPage);
    currentHits = response.hits.length;

    if (response.totalHits > 40) {
        loadMoreBtn.classList.remove('is-hidden');
    } else {
        loadMoreBtn.classList.add('is-hidden');
    }

    try {
        if (response.totalHits > 0) {
            Notify.success(`Hooray! We found ${response.totalHits} images.`);
            gallery.innerHTML = '';
            renderCardImg(response.hits);
            lightbox.refresh();
            endCollectionText.classList.add('is-hidden');

            const { heigth: cardHeight } = document
                .querySelector('.gallery')
                .firstElementChild.getBoundingClientRect();
            
            window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
});
        }

        if (response.totalHits === 0) {
            gallery.innerHTML = '';
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            loadMoreBtn.classList.add('is-hidden');
            endCollectionText.classList.add('is-hidden');
        }
    } catch (error) {
        console.log(error);
    }
}

loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

async function onClickLoadMoreBtn() {
    currentPage += 1;
    const response = await fetchImages(searchQuery, currentPage);
    renderCardImg(response.hits);
    lightbox.refresh();
    currentHits += response.hits.length;

    if (currentHits === response.totalHits) {
        loadMoreBtn.classList.add('is-hidden');
        endCollectionText.classList.remove('is-hidden');
    }
}