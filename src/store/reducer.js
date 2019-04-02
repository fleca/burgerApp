import * as actionTypes from './actions';

const initialState = {
  ingredients: {
    salad: 0,
    bacon: 0,
    cheese: 0,
    meat: 1
  },
  totalPrice: 4
};

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 1.0,
  cheese: 0.8,
  meat: 1.3
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] + 1
        },
        totalPrice: (+state.totalPrice + INGREDIENT_PRICES[action.ingredientName]).toFixed(2)
      };

    case actionTypes.REMOVE_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] - 1
        },
        totalPrice: (+state.totalPrice - INGREDIENT_PRICES[action.ingredientName]).toFixed(2)
      };

    default:
      return state;
  }
};

export default reducer;