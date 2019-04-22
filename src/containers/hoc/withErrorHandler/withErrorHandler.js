import React, { Component, Fragment } from 'react';

import Modal from '../../../components/UI/Modal';

const withErrorHandler = ( WrappedComponent, axios ) => {
  return class extends Component {
    state = {
      error: null
    }
    
    componentWillMount () {
      this.reqInterceptor = axios.interceptors.request.use(req => {
        this.setState({error: null});
        return req;
      });

      this.resInterceptor = axios.interceptors.response.use(res => res, error => {
        console.log(error.response.data)
        this.setState({error: error});
      });
    }

    // Prevents memory leaks since will destroy the interceptors before the component unmounts
    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    errorConfirmedHandler = () => {
      this.setState({error: null});
    }

    render() {
      return (
        <Fragment>
          <Modal 
            show={this.state.error}
            modalClosed={this.errorConfirmedHandler}>
            <p>{this.state.error ? this.state.error.message : null}</p>
            {(this.state.error && this.state.error.response.data) ? 
              Object.keys(this.state.error.response.data).map(element => {
                return <p key={element}>{this.state.error.response.data[element]}</p>
              })
              : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Fragment>
      );
    }
  }
}

export default withErrorHandler;