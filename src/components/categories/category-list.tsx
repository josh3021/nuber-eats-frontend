import React from 'react';
import { RestaurantsPageQuery_categories_categories } from '../../__generated__/RestaurantsPageQuery';

interface ICategoryListProps {
  categories: RestaurantsPageQuery_categories_categories[];
}

function CategoryList({ categories }: ICategoryListProps) {
  return (
    <div className="flex justify-around max-w-xs mx-auto mb-10">
      {categories?.map((category) => (
        <div
          key={category.id}
          className="flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-gray-200">
          <div
            className="w-28 h-28 rounded-full bg-cover"
            style={{
              backgroundImage: `url(${category.coverImage})`,
            }}></div>
          <span className="mt-2 text-base text-center font-medium">
            {category.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export default CategoryList;
