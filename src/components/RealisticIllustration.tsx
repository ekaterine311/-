import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

export const HERO_DESK_IMAGE = '/src/assets/images/hero_desk_adventure_1794861478557.jpg';

const GENERATED_IMAGES: Record<string, { src: string; imgClassName?: string }> = {
  watermelon: { src: '/src/assets/images/pic_watermelon_1794861478900.jpg' },
  bear: { src: '/src/assets/images/pic_bear_1794861479108.jpg' },
  cat: { src: '/src/assets/images/pic_cat_1794861479392.jpg' },
  apple: { src: '/src/assets/images/pic_apple_1794861480280.jpg' },
  fox: { src: '/src/assets/images/pic_fox_1794861480462.jpg' },
  train: { src: '/src/assets/images/pic_train_1794861480486.jpg' },
  owl: {
    src: '/src/assets/images/pic_owl_1794861480366.jpg',
    imgClassName: 'object-cover object-[50%_26%] scale-[1.15]',
  },
  rocket: { src: '/src/assets/images/pic_rocket_1794861481021.jpg' },
  house: { src: '/src/assets/images/pic_house_1794861481519.jpg' },
  butterfly: { src: '/src/assets/images/pic_butterfly_1794866176417.jpg' },
  wolf: { src: '/src/assets/images/pic_wolf_1794866176558.jpg' },
  mushroom: { src: '/src/assets/images/pic_mushroom_1794866177061.jpg' },
  pine: { src: '/src/assets/images/pic_pine_1794866177765.jpg' },
  hedgehog: { src: '/src/assets/images/pic_hedgehog_1794866178048.jpg' },
  beetle: { src: '/src/assets/images/pic_beetle_1794866178194.jpg' },
  star: { src: '/src/assets/images/pic_star_1794866178527.jpg' },
  toys: { src: '/src/assets/images/pic_toys_1794866179767.jpg' },
  yogurt: { src: '/src/assets/images/pic_yogurt_1794866179948.jpg' },
  rhino: { src: '/src/assets/images/pic_rhino_1794866181477.jpg' },
  cloud: { src: '/src/assets/images/pic_cloud_1794866180652.jpg' },
  tiger: { src: '/src/assets/images/pic_tiger_1794866182734.jpg' },
  duck: { src: '/src/assets/images/pic_duck_1794866181740.jpg' },
  soccer: { src: '/src/assets/images/pic_soccer_1794866182237.jpg' },
  bread: { src: '/src/assets/images/pic_bread_1794866183498.jpg' },
  flower: { src: '/src/assets/images/pic_flower_1794866183492.jpg' },
  clock: { src: '/src/assets/images/pic_clock_1794866183618.jpg' },
  balloon: { src: '/src/assets/images/pic_balloon_1794866183286.jpg' },
  puppy: { src: '/src/assets/images/pic_puppy_1794866184333.jpg' },
  entrance: { src: '/src/assets/images/pic_entrance_1794866184468.jpg' },
  cheese: { src: '/src/assets/images/pic_cheese_1794866184483.jpg' },
  notebook: { src: '/src/assets/images/pic_notebook_1794866185224.jpg' },
  icecream: { src: '/src/assets/images/pic_icecream_1794866185320.jpg' },
  spintop: { src: '/src/assets/images/pic_spintop_1794866186172.jpg' },
  dog: { src: '/src/assets/images/pic_dog_1794866186534.jpg' },
  sun: { src: '/src/assets/images/pic_sun_1794866186429.jpg' },
  fish: { src: '/src/assets/images/pic_fish_1794866186646.jpg' },
  elephant: { src: '/src/assets/images/pic_elephant_1794866188470.jpg' },
  book: { src: '/src/assets/images/pic_book_1794866188009.jpg' },
  school: { src: '/src/assets/images/pic_school_1794866188485.jpg' },
  milk: { src: '/src/assets/images/pic_milk_1794866188201.jpg' },
  rainbow: { src: '/src/assets/images/pic_rainbow_1794866188693.jpg' },
  car: { src: '/src/assets/images/pic_car_1794866189889.jpg' },
  airplane: { src: '/src/assets/images/pic_airplane_1794866189539.jpg' },
  horse: { src: '/src/assets/images/pic_horse_1794866190306.jpg' },
  banana: { src: '/src/assets/images/pic_banana_1794866190440.jpg' },
  grapes: { src: '/src/assets/images/pic_grapes_1794866190672.jpg' },
  ship: { src: '/src/assets/images/pic_ship_1794866191505.jpg' },
  mountain: { src: '/src/assets/images/pic_mountain_1794866191500.jpg' },
  lion: { src: '/src/assets/images/pic_lion_1794866688632.jpg' },
  whale: { src: '/src/assets/images/pic_whale_1794866690751.jpg' },
  moon: { src: '/src/assets/images/pic_moon_1794866690189.jpg' },
  sea: { src: '/src/assets/images/pic_sea_1794866689595.jpg' },
  forest: { src: '/src/assets/images/pic_forest_1794866691260.jpg' },
  river: { src: '/src/assets/images/pic_river_1794866690637.jpg' },
  snow: { src: '/src/assets/images/pic_snow_1794866690933.jpg' },
  umbrella: { src: '/src/assets/images/pic_umbrella_1794866691833.jpg' },
  table: { src: '/src/assets/images/pic_table_1794866692034.jpg' },
  chair: { src: '/src/assets/images/pic_chair_1794866691672.jpg' },
  window: { src: '/src/assets/images/pic_window_1794866692475.jpg' },
  key: { src: '/src/assets/images/pic_key_1794866692528.jpg' },
  cake: { src: '/src/assets/images/pic_cake_1794866692558.jpg' },
  honey: { src: '/src/assets/images/pic_honey_1794866693613.jpg' },
  rabbit: { src: '/src/assets/images/pic_rabbit_1794866692921.jpg' },
  squirrel: { src: '/src/assets/images/pic_squirrel_1794866693700.jpg' },
  eagle: { src: '/src/assets/images/pic_eagle_1794866694132.jpg' },
  bee: { src: '/src/assets/images/pic_bee_1794866694202.jpg' },
  pear: { src: '/src/assets/images/pic_pear_1794866694325.jpg' },
  lemon: { src: '/src/assets/images/pic_lemon_1794866695109.jpg' },
  cherry: { src: '/src/assets/images/pic_cherry_1794866694575.jpg' },
  pizza: { src: '/src/assets/images/pic_pizza_1794866695363.jpg' },
  pen: { src: '/src/assets/images/pic_pen_1794866695475.jpg' },
  backpack: { src: '/src/assets/images/pic_backpack_1794866696696.jpg' },
  map: { src: '/src/assets/images/pic_map_1794866696918.jpg' },
  guitar: { src: '/src/assets/images/pic_guitar_1794866697285.jpg' },
  bridge: { src: '/src/assets/images/pic_bridge_1794866696963.jpg' },
  rain: { src: '/src/assets/images/pic_rain_1794866697637.jpg' },
  cow: { src: '/src/assets/images/pic_cow_1794866698085.jpg' },
  deer: { src: '/src/assets/images/pic_deer_1794866698051.jpg' },
  swan: { src: '/src/assets/images/pic_swan_1794866699062.jpg' },
  penguin: { src: '/src/assets/images/pic_penguin_1794866698455.jpg' },
  dolphin: { src: '/src/assets/images/pic_dolphin_1794866698564.jpg' },
  giraffe: { src: '/src/assets/images/pic_giraffe_1794866698727.jpg' },
  monkey: { src: '/src/assets/images/pic_monkey_1794866699503.jpg' },
  strawberry: { src: '/src/assets/images/pic_strawberry_1794866699211.jpg' },
  orange: { src: '/src/assets/images/pic_orange_1794866699844.jpg' },
  tomato: { src: '/src/assets/images/pic_tomato_1794866700430.jpg' },
  carrot: { src: '/src/assets/images/pic_carrot_1794866700815.jpg' },
  bicycle: { src: '/src/assets/images/pic_bicycle_1794866700893.jpg' },
  bus: { src: '/src/assets/images/pic_bus_1794866701760.jpg' },
  phone: { src: '/src/assets/images/pic_phone_1794866701799.jpg' },
};

interface RealisticIllustrationProps {
  imageKey: string;
  alt: string;
  className?: string;
}

export const RealisticIllustration: React.FC<RealisticIllustrationProps> = ({
  imageKey,
  alt,
  className = '',
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const generated = GENERATED_IMAGES[imageKey];

  if (generated && !imgFailed) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
        <img
          src={generated.src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgFailed(true)}
          className={`w-full h-full object-cover ${generated.imgClassName ?? ''}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center gap-2 p-4 text-center bg-gradient-to-br from-slate-100 via-white to-blue-50 ${className}`}
      role="img"
      aria-label={alt}
    >
      <ImageIcon className="w-8 h-8 text-slate-400" />
      <span className="text-xs font-semibold text-slate-600">{alt}</span>
    </div>
  );
};
