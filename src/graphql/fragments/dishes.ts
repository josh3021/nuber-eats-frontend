import { gql } from '@apollo/client';

export const DISH_CHOICE_FRAGMENT = gql`
  fragment DishChoiceParts on DishChoice {
    name
    extra
  }
`;

export const DISH_OPTION_FRAGMENT = gql`
  fragment DishOptionParts on DishOption {
    name
    extra
    choices {
      ...DishChoiceParts
    }
  }
  ${DISH_CHOICE_FRAGMENT}
`;

export const DISH_FRAGMENT = gql`
  fragment DishParts on Dish {
    id
    name
    price
    photo
    description
    options {
      ...DishOptionParts
    }
  }
  ${DISH_OPTION_FRAGMENT}
`;
