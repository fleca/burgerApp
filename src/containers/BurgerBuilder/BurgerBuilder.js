import React, { Component, Fragment } from 'react';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal';
import OrderSummary from '../../components/Burger/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 1.0,
  cheese: 0.8,
  meat: 1.3
}

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount () {
    console.log(this.props);
    axios.get('/ingredients.json')
      .then(response => {
        this.setState({ingredients: response.data});
      })
      .catch(error => {
        this.setState({error: true});
      });
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    this.setState( {purchasable: sum > 0} );
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const newPrice = this.state.totalPrice + priceAddition;

    this.setState( {totalPrice: newPrice, ingredients: updatedIngredients} );
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const newPrice = this.state.totalPrice - priceDeduction;

    this.setState( {totalPrice: newPrice.toFixed(2), ingredients: updatedIngredients} );
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState( {purchasing: true} );
  }

  purchaseCancelledHandler = () => {
    this.setState( {purchasing: false});
  }

  purchaseContinueHandler = () => {
    // Firebase approach
    // this.setState({loading: true});
    
    // const order = {
    //   ingredients: this.state.ingredients,
    //   price: this.state.totalPrice,
    //   customer: {
    //     name: 'Felipe Nascimento',
    //     address: {
    //       street: 'Av Paulista 334',
    //       zipCode: '04853-410',
    //       country: 'Brazil'
    //     },
    //     email: 'felipe.test@google.com'
    //   },
    //   deliveryMethod: 'fast'
    // };
    
    // axios.post('/orders.json', order)
    //   .then(response => {
    //     this.setState({loading: false, purchasing: false});
    //   })
    //   .catch(error => {
    //     this.setState({loading: false, purchasing: false});
    //   });
    this.props.history.push('/checkout');
  }

  render () {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null    

    let burger = this.state.error ? <p style={{textAlign: 'center'}}>Ingredients can't be loaded</p> : <Spinner />;    
    if (this.state.ingredients) {
      burger = 
        <Fragment>
          <Burger ingredients={this.state.ingredients} />
            <BuildControls 
              ingredientAdded={this.addIngredientHandler}
              ingredientRemoved={this.removeIngredientHandler}
              disabled={disabledInfo}
              purchasable={this.state.purchasable}
              ordered={this.purchaseHandler}
              price={this.state.totalPrice} />
        </Fragment>;
      orderSummary =
        <OrderSummary 
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
          purchaseCancelled={this.purchaseCancelledHandler}
          purchaseContinued={this.purchaseContinueHandler} />
    }

    if ( this.state.loading ) {
      orderSummary = <Spinner />;
    }
    
    return (
      <Fragment>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelledHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Fragment>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);