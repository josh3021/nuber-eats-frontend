import React from 'react';
import Restaurant from '../../restaurants/restaurant';

interface Restaurant {
  id: string;
  name: string;
  coverImage: string;
  category: {
    name: string;
  } | null;
  address: string;
  isPromoted: boolean;
}

interface IGridLayoutProps {
  restaurants: Restaurant[];
}

function GridLayout({ restaurants }: IGridLayoutProps) {
  return (
    <div className="max-w-screen-sm md:max-w-screen-2xl flex flex-col md:grid md:grid-cols-3 md:gap-7 pb-10 pt-5">
      {restaurants.map(({ id, coverImage, name, category }) => (
        <Restaurant
          id={id}
          coverImage={coverImage}
          name={name}
          categoryName={category?.name}
          key={id}
        />
      ))}
    </div>
  );
}

export default GridLayout;
