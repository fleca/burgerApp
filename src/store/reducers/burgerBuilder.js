import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  ingredients: null,
  totalPrice: null,
  error: false
};

const INGREDIENT_PRICES = {
  bacon: 1.0,
  cheese: 0.8,
  meat: 1.3,
  salad: 0.5
};

const addIngredient = (state, action) => {
  const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 }
  const updatedIngredients = updateObject(state.ingredients, updatedIngredient)
  const updatedState = {
    ingredients: updatedIngredients,
    totalPrice: (+state.totalPrice + INGREDIENT_PRICES[action.ingredientName]).toFixed(2),
    building: true
  }
  return updateObject(state, updatedState);
}

const removeIngredient = (state, action) => {
  const updatedIng = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 }
  const updatedIngs = updateObject(state.ingredients, updatedIng)
  const updatedSt = {
    ingredients: updatedIngs,
    totalPrice: (+state.totalPrice - INGREDIENT_PRICES[action.ingredientName]).toFixed(2),
    building: true
  }
  return updateObject(state, updatedSt);
}

const setIngredients = (state, action) => {
  let initialPrice = Object.keys(action.ingredients).reduce((sum, element) => { 
    return sum += INGREDIENT_PRICES[element] * action.ingredients[element];
  }, 0);

  return updateObject( state, {
    ingredients: action.ingredients,
    error: false,
    totalPrice: action.basePrice + initialPrice,
    building: false
  });
}

const fetchIngredientsFailed = (state) => {
  return updateObject(state, { error: true });
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENTS: return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
    case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
    case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state);
    default: return state;
  }
};

export default reducer;