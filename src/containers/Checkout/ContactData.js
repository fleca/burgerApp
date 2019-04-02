import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';
import Button from '../../components/UI/Button';
import classes from './ContactData.module.css';
import Spinner from '../../components/UI/Spinner';
import Input from '../../components/UI/Input';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code'
        },
        value: '',
        validation: {
          required: true,
          minLength: 7,
          maxLength: 7
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your E-Mail'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'}
          ]
        },
        value: 'fastest'
      }
    },
    formIsValid: true,
    loading: false
  }

  orderHandler = ( event ) => {
    //Prevents to reload the page
    event.preventDefault();

    for (let formElement in this.state.orderForm) {
      if (!this.state.orderForm[formElement].valid) {
        this.setState({formIsValid: false});
        return;
      }
    }

    //Firebase approach
    this.setState({loading: true});
    const formData = {};
    for (let formElement in this.state.orderForm) {
      formData[formElement] = this.state.orderForm[formElement].value;
    }

    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      clientData: formData,
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

  checkValidity(value, rules) {
    let isValid = false;

    if (rules.required) {
      isValid = value.trim() !== '';
    }

    if (rules.minLength && isValid) {
      isValid = value.length >= rules.minLength;
    }

    if (rules.maxLength && isValid) {
      isValid = value.length <= rules.maxLength;
    }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier] 
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = updatedFormElement.validation ? this.checkValidity(updatedFormElement.value, updatedFormElement.validation) : true;
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    this.setState({orderForm: updatedOrderForm, formIsValid: true});
  }

  render () {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(formElement => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            valid={formElement.config.valid || !formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event, formElement.id)} />
        ))}
        {this.state.formIsValid ? '' : <p className={classes.IncorrectSubmission}>Please enter all fields correctly!</p>}
        <Button btnType="Success" clicked={this.orderHandler} >ORDER</Button>
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

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice
  };
};

export default connect(mapStateToProps)(ContactData);