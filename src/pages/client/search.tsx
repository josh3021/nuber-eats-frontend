import { gql, useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import MainBanner from '../../components/common/banners/main-banner';
import ReactHelmet from '../../components/common/helmets/react-helmet';
import Pagination from '../../components/common/paginations/pagination';
import GridLayout from '../../components/common/restaurants/grid-layout';
import Title from '../../components/common/titles/title';
import { RESTAURANT_FRAGMENT } from '../../graphql/fragments/restaurants';
import {
  SearchRestaurantsQuery,
  SearchRestaurantsQueryVariables,
} from '../../__generated__/SearchRestaurantsQuery';

const SEARCH_RESTAURANTS_QUERY = gql`
  query SearchRestaurantsQuery(
    $searchRestaurantsInput: SearchRestaurantsInput!
  ) {
    searchRestaurants(input: $searchRestaurantsInput) {
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

function Search() {
  const location = useLocation();
  const history = useHistory();
  const [keyword, setKeyword] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [
    callSearchRestaurantsQuery,
    { loading, data: searchRestaurantsData, called },
  ] = useLazyQuery<SearchRestaurantsQuery, SearchRestaurantsQueryVariables>(
    SEARCH_RESTAURANTS_QUERY,
  );
  useEffect(() => {
    const [, query] = location.search.split('?keyword=');
    if (!query) {
      return history.replace('/');
    }
    setKeyword(query);
    callSearchRestaurantsQuery({
      variables: {
        searchRestaurantsInput: {
          query,
        },
      },
    });
  }, [location, history, callSearchRestaurantsQuery]);
  const handlePrevPage = (): void => {
    setPage(page - 1);
  };
  const handleNextPage = (): void => {
    setPage(page + 1);
  };
  return (
    <>
      <ReactHelmet title="Search" />
      <div className="w-full">
        <div>
          {searchRestaurantsData?.searchRestaurants.result && <MainBanner />}
        </div>
        <div className="max-w-screen-xl items-center mt-5 mx-10">
          <div className="flex flex-col divide-y divide-gray-90">
            <Title
              text={`${keyword}으로 검색한 결과: ${searchRestaurantsData?.searchRestaurants.totalResults}`}
            />
            {searchRestaurantsData?.searchRestaurants.results && (
              <GridLayout
                restaurants={searchRestaurantsData.searchRestaurants.results}
              />
            )}
            {searchRestaurantsData?.searchRestaurants.totalPages && (
              <Pagination
                totalPages={searchRestaurantsData?.searchRestaurants.totalPages}
                currentPage={page}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
