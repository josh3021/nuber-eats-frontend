import React from 'react';
import { Link } from 'react-router-dom';

interface IRestaurantProps {
  id: string;
  coverImage: string;
  name: string;
  categoryName?: string;
}

function Restaurant({ id, coverImage, name, categoryName }: IRestaurantProps) {
  return (
    <Link to={`/restaurant-detail/${id}`}>
      <div className="mx-5 mb-5 md:mx-0 md:mb-0 flex flex-col" key={id}>
        <div
          style={{
            backgroundImage: `url(${coverImage})`,
          }}
          className="bg-cover rounded-xl md:rounded-none py-24 mb-3"></div>
        <span className="font-medium text-lg">{name}</span>
        <span className="font-medium text-sm border-gray-200 border-t-1">
          # {categoryName}
        </span>
      </div>
    </Link>
  );
}

export default Restaurant;
