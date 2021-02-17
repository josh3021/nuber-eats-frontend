import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Link } from 'react-router-dom';
import ReactHelmet from '../../components/common/helmets/react-helmet';
import GridLayout from '../../components/common/restaurants/grid-layout';
import Title from '../../components/common/titles/title';
import { RESTAURANT_FRAGMENT } from '../../graphql/fragments/restaurants';
import { MyRestaurants } from '../../__generated__/MyRestaurants';

export const MY_RESTAURANTS_QUERY = gql`
  query MyRestaurants {
    myRestaurants {
      result
      error
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

function MyRestaurantsPage() {
  const { data } = useQuery<MyRestaurants>(MY_RESTAURANTS_QUERY);
  console.log(data);
  return (
    <div className="container">
      <ReactHelmet title="MyRestaurants" />
      <div>
        {data?.myRestaurants.result &&
        (!data.myRestaurants.results ||
          data.myRestaurants.results.length === 0) ? (
          <div>
            <h4 className="text-xl mb-5">You have no restuarants.</h4>
            <Link className="link" to="/create-restaurant">
              Create One &rarr;
            </Link>
          </div>
        ) : (
          data?.myRestaurants.results && (
            <div className="flex flex-col">
              <Title text={'Food Delivery in Seoul'} />
              <GridLayout restaurants={data?.myRestaurants.results} />
              {/* {data?.myRestaurants.results && (
                <Pagination
                  totalPages={data?.myRestaurants.results}
                  currentPage={page}
                  onPrevPage={handlePrevPage}
                  onNextPage={handleNextPage}
                />
              )} */}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default MyRestaurantsPage;
