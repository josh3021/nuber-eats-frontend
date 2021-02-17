import { gql, useQuery } from '@apollo/client';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import CategoryList from '../../components/categories/category-list';
import ApolloError from '../../components/common/errors/apollo-error';
import FormError from '../../components/common/errors/form-error';
import ReactHelmet from '../../components/common/helmets/react-helmet';
import Pagination from '../../components/common/paginations/pagination';
import GridLayout from '../../components/common/restaurants/grid-layout';
import Title from '../../components/common/titles/title';
import { RESTAURANT_FRAGMENT } from '../../graphql/fragments/restaurants';
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from '../../__generated__/RestaurantsPageQuery';

interface ISearchKeywordProps {
  keyword: string;
}

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
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

function Restaurants() {
  const [page, setPage] = useState<number>(1);
  const history = useHistory();
  const {
    register,
    getValues,
    handleSubmit: handleSearchKeywordSubmit,
    errors,
  } = useForm<ISearchKeywordProps>({
    mode: 'onChange',
  });
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
  const onSearchKeywordSubmit = () => {
    history.push({
      pathname: '/search',
      search: `?keyword=${getValues().keyword}`,
    });
  };

  return (
    <>
      <ReactHelmet title="Home" />
      <div>
        <form
          onSubmit={handleSearchKeywordSubmit(onSearchKeywordSubmit)}
          className="w-full py-40 bg-gray-800 flex items-center justify-center">
          <div className="flex flex-col items-center justify-centers w-9/12 sm:w-8/12 md:w-7/12 mx-auto">
            <div className="flex w-full mx-auto">
              <input
                ref={register({
                  required: '키워드를 입력해주세요.',
                })}
                name="keyword"
                type="search"
                className="input w-full border-none rounded-l-md"
                placeholder="Search Restaurants"
              />
              <button className="text-sm font-bold focus:outline-none text-white py-4 transition-colors px-5 rounded-r-md bg-purple-600">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            <div>
              {errors.keyword?.message && (
                <FormError
                  title="keyword-validation-error"
                  errorMessage={errors.keyword?.message}
                />
              )}
            </div>
          </div>
        </form>
        <div className="max-w-container">
          {!loading && (
            <div className="max-w-screen-xl lg:max-w-screen-2xl mx-5 mt-8 w-full">
              {restaurantsPageData?.categories.categories && (
                <CategoryList
                  categories={restaurantsPageData.categories.categories}
                  key="CategoryList"
                />
              )}
              {restaurantsPageData?.restaurants.results && (
                <div className="flex flex-col">
                  <Title text={'Food Delivery in Seoul'} />
                  <GridLayout
                    restaurants={restaurantsPageData.restaurants.results}
                  />
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
