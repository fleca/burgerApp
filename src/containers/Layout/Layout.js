import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer';

class Layout extends Component {
  state = {
    showSideDrawer: false
  }
  
  sideDrawerClosedHandler = () => {
    this.setState( {showSideDrawer: false} )
  }

  sideDrawerToggleHandler = () => {
    this.setState( (prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  }

  render () {
    return (
      <Fragment>
        <Toolbar
          isAuth={this.props.isAuthenticated}
          toggleSideDrawer={this.sideDrawerToggleHandler}/>
        <SideDrawer
          isAuth={this.props.isAuthenticated}
          open={this.state.showSideDrawer}
          closed={this.sideDrawerClosedHandler} />
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

export default connect(mapStateToProps)(Layout);