import React from 'react';
import { Link } from 'react-router-dom';
import { RestaurantsPageQuery_categories_categories } from '../../__generated__/RestaurantsPageQuery';

interface ICategoryListProps {
  categories: RestaurantsPageQuery_categories_categories[];
}

function CategoryList({ categories }: ICategoryListProps) {
  return (
    // <div className="flex max-w-screen-xl lg:max-w-screen-2xlitems-center">
    <div className="max-w-screen-xl lg:max-w-screen-2xl  mb-10 overflow-x-scroll mx-auto">
      <div className="flex justify-around w-max mx-auto">
        {categories?.map((category) => (
          <Link to={`/category/${category.slug}`} key={category.slug}>
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
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
