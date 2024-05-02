// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y,Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import '../css/main/banner.css'

import costImage from '../../src/image/cost.PNG';
import publicImage from '../../src/image/public.PNG';

export default () => {
  return (
    <Swiper
      // install Swiper modules
      className='banner'
      modules={[Navigation, Pagination, Scrollbar, A11y,Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      autoplay={{delay:2000}}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
     
    >
      <SwiperSlide>
     
      <img src={costImage} alt="Cost Image" />
      
      </SwiperSlide>
      <SwiperSlide> 
    <img src={publicImage} alt="Public Image" />
    </SwiperSlide>
     
     
     
    </Swiper>
  );
};
