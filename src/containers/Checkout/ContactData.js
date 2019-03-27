import React, { Component } from 'react';

import axios from '../../axios-orders';
import Button from '../../components/UI/Button';
import classes from './ContactData.module.css';
import Spinner from '../../components/UI/Spinner';

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: ''
    },
    loading: false
  }

  orderHandler = (event) => {
    event.preventDefault();
    //Firebase approach
    this.setState({loading: true});
    
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      customer: {
        name: 'Felipe Nascimento',
        address: {
          street: 'Av Paulista 334',
          zipCode: '04853-410',
          country: 'Brazil'
        },
        email: 'felipe.test@google.com'
      },
      deliveryMethod: 'fast',
      time: new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})
    };
    
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({loading: false});
        this.props.history.push('/');
      })
      .catch(error => {
        this.setState({loading: false});
      });
  }

  render () {
    let form = (
      <form>
        <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
        <input className={classes.Input} type="text" name="email" placeholder="Your Email" />
        <input className={classes.Input} type="text" name="street" placeholder="Street" />
        <input className={classes.Input} type="text" name="postal" placeholder="Postal Code" />
        <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData