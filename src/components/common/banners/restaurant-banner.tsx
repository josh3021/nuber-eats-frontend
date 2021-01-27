import React from 'react';

interface IRestaurantBannerProps {
  coverImage: string;
}

function RestaurantBanner({ coverImage }: IRestaurantBannerProps) {
  return (
    <div className="h-full lg:h-96 flex w-full bg-yellow-500 justify-between">
      <img
        src={coverImage}
        alt="Delicious Food!"
        className="h-96 w-full bg-cover"
      />
    </div>
  );
}

export default RestaurantBanner;
