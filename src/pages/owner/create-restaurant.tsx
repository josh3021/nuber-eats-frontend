import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Button from '../../components/common/buttons/button';
import FormError from '../../components/common/errors/form-error';
import ReactHelmet from '../../components/common/helmets/react-helmet';
import {
  CreateRestaurant,
  CreateRestaurantVariables,
} from '../../__generated__/CreateRestaurant';
import { MyRestaurants } from '../../__generated__/MyRestaurants';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';

const CREATE_RESTAURANT_MUTATION = gql`
  mutation CreateRestaurant($createRestaurantInput: CreateRestaurantInput!) {
    createRestaurant(input: $createRestaurantInput) {
      result
      error
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

function CreateRestuarnt() {
  const client = useApolloClient();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const onCompleted = (data: CreateRestaurant) => {
    const {
      createRestaurant: { result, restaurantId },
    } = data;
    if (result) {
      const { name, categoryName, address } = getValues();
      setUploading(false);
      const queryResult = client.readQuery<MyRestaurants>({
        query: MY_RESTAURANTS_QUERY,
      });
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult?.myRestaurants,
            results: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: 'Category',
                  __proto__: Object,
                },
                coverImage: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: 'Restaurant',
              },
              ...(queryResult?.myRestaurants.results
                ? queryResult.myRestaurants.results
                : []),
            ],
          },
        },
      });
      history.push('/');
    }
  };
  const [createRestaurantMutation, { loading, error, data }] = useMutation<
    CreateRestaurant,
    CreateRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    // refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
  });
  const {
    register,
    getValues,
    formState,
    errors,
    handleSubmit,
  } = useForm<IFormProps>({
    mode: 'onChange',
  });
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { name, categoryName, address, file } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append('file', actualFile);
      const { url: coverImage }: { url: string } = await (
        await fetch('http://localhost:3001/uploads', {
          method: 'POST',
          body: formBody,
        })
      ).json();
      setImageUrl(coverImage);
      createRestaurantMutation({
        variables: {
          createRestaurantInput: {
            name,
            categoryName,
            address,
            coverImage,
          },
        },
      });
    } catch (error) {}
  };
  return (
    <div className="container">
      <ReactHelmet title="create-restaurant" />
      <h1>Create Restaurant</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-3 mt-5 w-full mb-3">
        <input
          ref={register({ required: 'Name is Required' })}
          className="input"
          name="name"
          placeholder="Name"
        />
        <input
          ref={register({ required: 'Address is Required' })}
          className="input"
          name="address"
          placeholder="Address"
        />
        <input
          ref={register({ required: 'CategoryName is Required' })}
          className="input"
          name="categoryName"
          placeholder="Category Name"
        />
        <div>
          <input
            ref={register({ required: true })}
            className="input"
            type="file"
            name="file"
            accept="image/*"
          />
        </div>
        <Button
          actionText="Create Restaurant"
          canClick={formState.isValid}
          loading={uploading}
          name="create-restaurant"
          key="create-restaurant"
        />
        {data?.createRestaurant.error && (
          <FormError
            errorMessage={data.createRestaurant.error}
            title={'Error While Fetching...'}
          />
        )}
      </form>
    </div>
  );
}

export default CreateRestuarnt;
