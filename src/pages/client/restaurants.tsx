import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import CategoryList from '../../components/categories/category-list';
import ApolloError from '../../components/common/errors/apollo-error';
import ReactHelmet from '../../components/common/helmets/react-helmet';
import Pagination from '../../components/common/paginations/pagination';
import Restaurant from '../../components/restaurants/restaurant';
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from '../../__generated__/RestaurantsPageQuery';

const RESTAURANTS_PAGE_QUERY = gql`
  query RestaurantsPageQuery($restaurantsInput: RestaurantsInput!) {
    categories {
      result
      error
      categories {
        id
        name
        coverImage
        slug
        restaurantCount
      }
    }
    restaurants(input: $restaurantsInput) {
      result
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImage
        address
        category {
          name
        }
        isPromoted
      }
    }
  }
`;

function Restaurants() {
  const [page, setPage] = useState<number>(1);
  const { loading, error, data: restaurantsPageData } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANTS_PAGE_QUERY, {
    variables: {
      restaurantsInput: {
        page,
        take: 3,
      },
    },
  });

  if (error) {
    return <ApolloError errorMessage={error.message} />;
  }

  const handlePrevPage = (): void => {
    setPage(page - 1);
  };
  const handleNextPage = (): void => {
    setPage(page + 1);
  };

  return (
    <>
      <ReactHelmet title="Restaurants" />
      <div>
        <form className="w-full py-40 bg-gray-800 flex items-center justify-center">
          <input
            type="search"
            className="input w-10/12 sm:w-9/12 md:w-5/12 border-none rounded-md"
            placeholder="Search Restaurants"
          />
        </form>
        <div className="max-w-screen-xl mx-auto items-center">
          {!loading && (
            <div className="max-w-screen-xl lg:max-w-screen-2xl mx-auto mt-8">
              {restaurantsPageData?.categories.categories && (
                <CategoryList
                  categories={restaurantsPageData.categories.categories}
                />
              )}
              {restaurantsPageData?.restaurants.results && (
                <div className="flex flex-col">
                  <div className="max-w-screen-xl ml-5 mb-7 flex flex-col md:flex-row justify-between">
                    <h1 className="font-semibold text-4xl">
                      Food Delivery in Seoul
                    </h1>
                    <div className="flex flex-col items-start md:items-end">
                      <h3 className="font-medium text-base">
                        # Stay at Home for a While 🏠
                      </h3>
                      <h6 className="font-light">
                        Thanks for using Our Service 🙏
                      </h6>
                    </div>
                  </div>
                  <div className="max-w-screen-sm md:max-w-screen-2xl flex flex-col md:grid md:grid-cols-3 md:gap-7 pb-10">
                    {restaurantsPageData.restaurants.results.map(
                      ({ id, coverImage, name, category }) => (
                        <Restaurant
                          id={id}
                          coverImage={coverImage}
                          name={name}
                          categoryName={category?.name}
                          key={id}
                        />
                      ),
                    )}
                  </div>
                  {restaurantsPageData.restaurants.totalPages && (
                    <Pagination
                      totalPages={restaurantsPageData.restaurants.totalPages}
                      currentPage={page}
                      onPrevPage={handlePrevPage}
                      onNextPage={handleNextPage}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default Restaurants;
