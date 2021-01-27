import React from 'react';
import LeftBanner from '../../../images/banners/banner-left.svg';
import RightBanner from '../../../images/banners/banner-right.svg';

function MainBanner() {
  return (
    <div className="h-full lg:h-96 flex w-full bg-yellow-500 justify-between">
      <img src={LeftBanner} alt="Delicious Food!" className="h-full" />
      <img src={RightBanner} alt="Delicious Food!" className="h-full" />
    </div>
  );
}

export default MainBanner;
