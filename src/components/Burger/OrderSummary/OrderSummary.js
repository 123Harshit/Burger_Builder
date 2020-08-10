import React from 'react'
import Aux from '../../../hoc/Auxi/Aux'
import Button from '../../UI/Button/Button'
const orderSummary=(props)=>{
    const ingredientSummary = Object.keys(props.ingredients)
    .map(igKey=>{
        return(
            <li key={igKey}>
                <span style={{transform: 'capitalize'}}>{igKey}</span>:{props.ingredients[igKey]}
            </li>
        )
    })
    return(
        <Aux>
            <h3>Your order</h3>
            <p>A delicious burger with the following ingredients</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Your total Price is : Rs {props.price.toFixed(2)}</strong></p>
            <p>Continue to Checkout</p>
            <Button btnType="Danger" clicked={props.purchaseCancelled}>CANCEL</Button>
            <Button btnType="Success" clicked={props.purchaseContinued}>CHECKOUT</Button>
        </Aux>
    )
}
export default orderSummary;