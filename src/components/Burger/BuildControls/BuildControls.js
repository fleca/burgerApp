import React from 'react';

import BuildControl from './BuildControl';
import classes from './BuildControls.module.css';

const controls = [
  { label: 'Bacon', type: 'bacon' },
  { label: 'Cheese', type: 'cheese' },
  { label: 'Meat', type: 'meat' },
  { label: 'Salad', type: 'salad' }
];

const buildControls = (props) => (
  <div className={classes.BuildControls}>
    <p>Current price: <strong>${props.price}</strong></p>
    {controls.map(ctrl => (
      <BuildControl 
        key={ctrl.label} 
        label={ctrl.label} 
        added={() => props.ingredientAdded(ctrl.type)}
        removed={() => props.ingredientRemoved(ctrl.type)}
        disabled={props.disabled[ctrl.type]}/>
    ))}
    <button 
      className={classes.OrderButton}
      disabled={!props.purchasable}
      onClick={props.ordered}>{props.isAuth ? 'ORDER NOW' : 'SIGN IN TO ORDER'}</button>
  </div>
);

export default buildControls;