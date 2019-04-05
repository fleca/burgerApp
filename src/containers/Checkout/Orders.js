import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';
import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions/index';

class Orders extends Component {
  componentDidMount() {
    this.props.onFetchOrders();
  }

  render () {
    let orders = <Spinner />
    if (!this.props.loading) {
      orders = this.props.orders.map(order => (
        <Order 
          key={order.id}
          ingredients={order.ingredients}
          price={order.price}
          time={order.time}/>
      ))
    }
    return (
      <div>
        {orders}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: () => dispatch(actionTypes.fetchOrders())  
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));