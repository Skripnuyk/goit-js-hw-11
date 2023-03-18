import axios from 'axios';

export default async function fetchImages(value, page) {
    const URL = 'https://pixabay.com/api/';
    const key = '34495006-71ec78aa9b10719ae520ad987';
    const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

    return await axios.get(`${URL}${filter}`).then(response => response.data);
}