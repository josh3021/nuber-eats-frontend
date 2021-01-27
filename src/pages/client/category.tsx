import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainBanner from '../../components/common/banners/main-banner';
import ReactHelmet from '../../components/common/helmets/react-helmet';
import Pagination from '../../components/common/paginations/pagination';
import GridLayout from '../../components/common/restaurants/grid-layout';
import Title from '../../components/common/titles/title';
import { CATEGORY_FRAGMENT } from '../../graphql/fragments/categories';
import { RESTAURANT_FRAGMENT } from '../../graphql/fragments/restaurants';
import {
  CategoryQuery,
  CategoryQueryVariables,
} from '../../__generated__/CategoryQuery';

interface ICategoryParams {
  slug: string;
}
const CATEGORY_QUERY = gql`
  query CategoryQuery($categoryInput: CategoryInput!) {
    category(input: $categoryInput) {
      result
      error
      totalPages
      totalResults
      category {
        ...CategoryParts
      }
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

function Category() {
  const [page, setPage] = useState<number>(1);
  const { slug } = useParams<ICategoryParams>();
  const { loading, error, data: categoryData, called } = useQuery<
    CategoryQuery,
    CategoryQueryVariables
  >(CATEGORY_QUERY, {
    variables: {
      categoryInput: {
        slug,
      },
    },
  });
  const handlePrevPage = (): void => {
    setPage(page - 1);
  };
  const handleNextPage = (): void => {
    setPage(page + 1);
  };
  return (
    <>
      <ReactHelmet title="Category" />
      <div className="w-full">
        <div>{categoryData?.category.result && <MainBanner />}</div>
        <div className="max-w-screen-xl items-center mt-5 mx-10">
          <div className="flex flex-col divide-y divide-gray-90">
            <Title
              text={`Category of ${categoryData?.category.category?.name}`}
            />
            {categoryData?.category.restaurants && (
              <GridLayout restaurants={categoryData?.category.restaurants} />
            )}
            {categoryData?.category.totalPages && (
              <Pagination
                totalPages={categoryData.category.totalPages}
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

export default Category;
