import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import classes from './Auth.module.css'
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Spinner from '../../components/UI/Spinner';
import * as actionTypes from '../../store/actions/index';

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Mail Address'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    },
    formIsValid: false,
    isSignUp: true,
  }

  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath();
    }
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

    if (rules.isEmail && isValid) {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = pattern.test(value);
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value);
    }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedControls = {
      ...this.state.controls
    };
    const updatedFormElement = {
      ...updatedControls[inputIdentifier] 
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = updatedFormElement.validation ? this.checkValidity(updatedFormElement.value, updatedFormElement.validation) : true;
    updatedFormElement.touched = true;
    updatedControls[inputIdentifier] = updatedFormElement;
    this.setState({controls: updatedControls, formIsValid: true});
  }

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {isSignUp: !prevState.isSignUp}
    })
  }

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    let form = formElementsArray.map(formElement => {
      return <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        valid={formElement.config.valid || !formElement.config.validation}
        touched={formElement.config.touched}
        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
    })

    if (this.props.loading) {
      form = <Spinner />;
    }

    let errorMessage = null;

    if (this.props.error) {
      errorMessage = (
        <p style={{color: 'danger'}}>{this.props.error.message}</p>
      );
    }

    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button type='submit' btnType='Success'>SUBMIT</Button>
        </form>
        <Button 
          clicked={this.switchAuthModeHandler}
          btnType='Danger'>SWITCH TO {this.state.isSignUp ? 'SIGN IN' : 'SIGN UP'}</Button>
      </div>
    )
  };
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignUp) => dispatch(actionTypes.auth(email, password, isSignUp)),
    onSetAuthRedirectPath: () => dispatch(actionTypes.setAuthRedirectPath('/'))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);