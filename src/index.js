import './style/style.css';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css'



const breedSelect = document.querySelector('.breed-select');
const loaderMassage = document.querySelector('.loader')
const errorMassage = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

breedSelect.setAttribute('id', 'single')
loaderMassage.textContent = '';
errorMassage.classList.add('is-inactive');
breedSelect.classList.add('is-inactive');


Notiflix.Notify.init({
    position: 'center-top',
    distance: '45px',
    timeout: 2500,
    cssAnimationStyle: 'zoom',
    fontFamily: 'Arial, sans-serif',
});


    fetchBreeds()
        .then(breeds => markupSelectBreeds(breeds))
        .catch(() => {
            loaderMassage.classList.add('is-inactive');
            Notiflix.Notify.failure(errorMassage.textContent);
        }); 
    

function markupSelectBreeds(breeds) {
    breedSelect.classList.remove('is-inactive');
    loaderMassage.classList.add('is-inactive');
    const markup = breeds.map((breed, idx) => {
        return `<option value="${breed.id}">${breed.name}</option>`
    }).join('');
    breedSelect.innerHTML = markup;
    new SlimSelect({
                select: '#single'
            });
}

function markupCatInfo(arrCats) {
    console.log(arrCats);
    const catInfoShow = arrCats.map(({ url, breeds }) => {
        const { name, description, temperament } = breeds[0];
        return `
        <img src="${url}" alt="${name}" class=""/>
      <div class="desc-wrapper">
        <h2>${name}</h2>
        <p class="description">${description}</p>
        <p class="temperament"><b>Temperament: </b>${temperament}</p>
      </div>`
    }).join('');
    catInfo.innerHTML = catInfoShow;
}

function onSelectCat(e) {
    const idCat = e.currentTarget.value;
    loaderMassage.classList.remove('is-inactive');
    catInfo.classList.add('is-inactive');
    
    fetchCatByBreed(idCat)
        .then(data => {
            catInfo.classList.remove('is-inactive');
            setTimeout(() => {
                loaderMassage.classList.add('is-inactive');
                markupCatInfo(data)
            }, 0);
        })
        .catch(() => {
            loaderMassage.classList.add('is-inactive');
            Notiflix.Notify.failure(errorMassage.textContent);

    });
    
}

breedSelect.addEventListener('change', onSelectCat);

