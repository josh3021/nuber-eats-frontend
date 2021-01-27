import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import ReactHelmet from '../../components/common/helmets/react-helmet';
import { RESTAURANT_FRAGMENT } from '../../graphql/fragments/restaurants';
import {
  RestaurantQuery,
  RestaurantQueryVariables,
} from '../../__generated__/RestaurantQuery';

interface IRestaurantDetailParams {
  id: string;
}

const RESTAURANT_QUERY = gql`
  query RestaurantQuery($restaurantInput: RestaurantInput!) {
    restaurant(input: $restaurantInput) {
      result
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

function RestaurantDetail() {
  const params = useParams<IRestaurantDetailParams>();
  const { loading, error, data: restaurantData } = useQuery<
    RestaurantQuery,
    RestaurantQueryVariables
  >(RESTAURANT_QUERY, {
    variables: {
      restaurantInput: {
        restaurantId: params['id'],
      },
    },
  });
  return (
    <>
      <ReactHelmet title="Restaurant Detail" />
      <div
        className="bg-gray-800 bg-center bg-cover py-48"
        style={{
          backgroundImage: `url(${restaurantData?.restaurant.restaurant?.coverImage})`,
        }}>
        <div className="bg-white w-3/12 py-8 pl-48">
          <h4 className="text-4xl mb-3">
            {restaurantData?.restaurant.restaurant?.name}
          </h4>
          <h5 className="text-sm font-light mb-2">
            {restaurantData?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {restaurantData?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
    </>
  );
}

export default RestaurantDetail;
