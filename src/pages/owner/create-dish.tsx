import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Button from '../../components/common/buttons/button';
import FormError from '../../components/common/errors/form-error';
import ReactHelmet from '../../components/common/helmets/react-helmet';
import {
  CreateDish,
  CreateDishVariables,
} from '../../__generated__/CreateDish';
import { MY_RESTAURANT_QUERY } from './my-restaurant';

interface IParams {
  id: string;
}

interface IFormProps {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

const CREATE_DISH_MUTATION = gql`
  mutation CreateDish($createDishInput: CreateDishInput!) {
    createDish(input: $createDishInput) {
      result
      error
    }
  }
`;

function CreateDishPage() {
  const { id: restaurantId } = useParams<IParams>();
  const history = useHistory();
  const [optionsId, setOptionsId] = useState<number[]>([]);
  const [choicesId, setChoicesId] = useState<number[]>([]);
  const onCompleted = () => {
    history.goBack();
  };
  const [createDishMutation, { loading, error, data }] = useMutation<
    CreateDish,
    CreateDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          myRestaurantInput: {
            restaurantId: +restaurantId,
          },
        },
      },
    ],
    onCompleted,
  });
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
    errors,
  } = useForm<IFormProps>({
    mode: 'onChange',
  });
  const onSubmit = () => {
    const { description, name, price, ...rest } = getValues();
    const options = optionsId.map((optionId) => ({
      name: rest[`optionName-${optionId}`],
      extra: +rest[`optionExtra-${optionId}`],
      choices: choicesId.map((choiceId) => ({
        name: rest[`option-${optionId}-choiceName-${choiceId}`],
        extra: +rest[`option-${optionId}-choiceExtra-${choiceId}`],
      })),
    }));
    createDishMutation({
      variables: {
        createDishInput: {
          name,
          price: +price,
          description,
          restaurantId,
          options,
        },
      },
    });
  };
  const onAddDishOptionClick = () => {
    setOptionsId((current) => [Date.now(), ...current]);
  };

  const onDeleteDishOptionClick = (idToDelete: number) => {
    setOptionsId((current) => current.filter((id) => id !== idToDelete));
    setValue(`optionName-${idToDelete}`, '');
    setValue(`optionExtra-${idToDelete}`, '');
  };

  const onAddChoiceClick = () => {
    setChoicesId((current) => [Date.now(), ...current]);
  };

  const onDeleteChoiceClick = (idToDelete: number) => {
    setChoicesId((current) => current.filter((id) => id !== idToDelete));
    setValue(`choiceName-${idToDelete}`, '');
    setValue(`choiceExtra-${idToDelete}`, '');
  };

  return (
    <>
      <ReactHelmet title="Create Dish" />
      <div className="container">
        <div className="xl:w-5/12 flex flex-col mx-auto mt-40">
          <h1 className="font-bold text-2xl">Create Dish</h1>
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <input
              ref={register({ required: 'name is required!' })}
              className="input"
              name="name"
              placeholder="Name"
            />
            <input
              type="number"
              ref={register({ required: 'price is required!' })}
              className="input"
              name="price"
              placeholder="Price"
              min={0}
            />
            <input
              ref={register({
                required: 'description is required!',
                minLength: 6,
              })}
              className="input"
              name="description"
              placeholder="Description"
              minLength={6}
            />
            <div className="my-2">
              <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
              <span
                onClick={onAddDishOptionClick}
                className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-2">
                Add Dish Option
              </span>
              {optionsId.length !== 0 &&
                optionsId.map((optionId, index) => (
                  <div
                    className="mt-5 flex flex-col border-gray-300 border-t-2"
                    key={optionId}>
                    <div>Dish Option #{index + 1}</div>
                    <div>
                      <input
                        ref={register}
                        name={`optionName-${optionId}`}
                        className="px-6 py-2 focus:outline-none focus:border-gray-600 border-2 mr-2"
                        placeholder="Option Name"
                      />
                      <input
                        ref={register}
                        name={`optionExtra-${optionId}`}
                        className="px-2 py-2 focus:outline-none focus:border-gray-600 border-2 mr-2"
                        type="number"
                        placeholder="Option Extra Price"
                        defaultValue={0}
                      />
                      <span
                        onClick={() => onDeleteDishOptionClick(optionId)}
                        className="px-4 py-2 cursor-pointer text-white bg-red-500">
                        Delete
                      </span>
                    </div>
                    <div className="my-2">
                      <h4 className="font-light mb-3 text-sm">Choices</h4>
                      <span
                        onClick={onAddChoiceClick}
                        className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-2">
                        Add Choices
                      </span>
                      {choicesId.length !== 0 &&
                        choicesId.map((choiceId, index) => (
                          <div className="mt-5 flex flex-col" key={choiceId}>
                            <div>Choice #{index + 1}</div>
                            <div>
                              <input
                                ref={register}
                                name={`option-${optionId}-choiceName-${choiceId}`}
                                className="px-6 py-2 focus:outline-none focus:border-gray-600 border-2 mr-2"
                                placeholder="Choice Name"
                              />
                              <input
                                ref={register}
                                name={`option-${optionId}-choiceExtra-${choiceId}`}
                                className="px-2 py-2 focus:outline-none focus:border-gray-600 border-2 mr-2"
                                type="number"
                                placeholder="Choice Extra Price"
                                defaultValue={0}
                              />
                              <span
                                onClick={() => onDeleteChoiceClick(choiceId)}
                                className="px-4 py-2 cursor-pointer text-white bg-red-500">
                                Delete
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
            {errors.description?.message && (
              <FormError
                title="description-length-error"
                errorMessage={errors.description?.message}
              />
            )}
            <Button
              actionText="Create Dish"
              canClick={formState.isValid}
              loading={loading}
              name="create-dish"
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateDishPage;
