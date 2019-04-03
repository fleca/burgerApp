import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal';
import OrderSummary from '../../components/Burger/OrderSummary';
import Spinner from '../../components/UI/Spinner';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions/index';
import axios from '../../axios-orders';

class BurgerBuilder extends Component {
  state = {
    purchasing: false
  }

  componentDidMount () {
    console.log(this.props);
    this.props.onInitIngredients();
  }

  updatePurchaseState ( ingredients ) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    return sum > 0;
  }

  purchaseHandler = () => {
    this.setState( {purchasing: true} );
  }

  purchaseCancelledHandler = () => {
    this.setState( {purchasing: false});
  }

  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
  }

  render () {
    const disabledInfo = {
      ...this.props.ings
    };
    for (let key in disabledInfo) {
       disabledInfo[key] = disabledInfo[key] <= 0
    }
    
     let orderSummary = null;
     let burger = this.props.error ? <p style={{textAlign: 'center'}}>Ingredients can't be loaded</p> : <Spinner />;    

    if (this.props.ings) {
      burger = 
        <Fragment>
          <Burger ingredients={this.props.ings} />
            <BuildControls 
              ingredientAdded={this.props.onIngredientAdded}
              ingredientRemoved={this.props.onIngredientRemoved}
              disabled={disabledInfo}
              purchasable={this.updatePurchaseState(this.props.ings)}
              ordered={this.purchaseHandler}
              price={this.props.price} />
        </Fragment>;
      orderSummary =
        <OrderSummary 
          ingredients={this.props.ings}
          price={this.props.price}
          purchaseCancelled={this.purchaseCancelledHandler}
          purchaseContinued={this.purchaseContinueHandler} />
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

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actionTypes.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actionTypes.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actionTypes.initIngredients()),
    onInitPurchase: () => dispatch(actionTypes.purchaseInit())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));