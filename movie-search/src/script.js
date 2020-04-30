import {getOMDBInfo} from "./api/omdb";


const   init = async () => {
    let swiper = new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
    let g = await getOMDBInfo('dream');
    console.log('g: ', g)
}

init();
