import React, { Component } from 'react'
import Burger from '../../components/Burger/Burger'
import Aux from '../../hoc/Auxi/Aux'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import Spinner from '../../components/UI/Spinner/Spinner'

const INGREDIENT_PRICE = {
    salad: 10,
    cheese : 15,
    bacon: 12,
    meat : 14
}

class BurgerBuilder extends Component{
    state={
        ingredients :null,
        totalPrice : 20,
        purchasable : false,
        purchasing: false,
        spinner:false,
        error:false
    }

    componentDidMount(){
        axios.get('https://my-burger-builder-5cbf8.firebaseio.com/Ingredients.json')
        .then(response=>{
            this.setState({ingredients: response.data});
        }).catch(error=>{
            this.setState({error:true})
        })
    }

    purchaseEventHandler=()=>{
        this.setState({purchasing:true})
    }

    purchaseCancelHandler=()=>{
        this.setState({purchasing:false});
    }

    purchaseContinueHandler=()=>{
    //   alert('You continue')
        this.setState({spinner:true})
        const order = {
            ingredients : this.state.ingredients,
            price : this.state.totalPrice,
            customer : {
                name : 'Harshit Singhal',
                address : {
                    city : 'Noida',
                    pinCode : '201309',
                    country : 'India'
                },
                email : 'singhalharshit70@gmail.com'
            },
            deliveryMethod : 'fastest'
        } 
        axios.post('/orders.json', order)
        .then(response => {
            this.setState({spinner:false, purchasing:false});
        }).catch(error=>{ 
            this.setState({spinner:false, purchasing:false});
        })
    }

    updatePurchase(ingredients){
        const sum = Object.keys(ingredients).map(igKey=>{
            return ingredients[igKey]
        }).reduce((sum,el)=>{ 
            return sum+el
        },0);
        this.setState({purchasable:sum>0})
    }

    addIngredientHandler=(type)=>{
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount+1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type]=updatedCount;
        const priceAddition = INGREDIENT_PRICE[type];
        const newPrice = this.state.totalPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchase(updatedIngredients);
    }
    removeIngredientHandler=(type)=>{
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount-1;
        if(oldCount===0){
            return;
        }
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type]=updatedCount;
        const priceDeduction = INGREDIENT_PRICE[type];
        const newPrice = this.state.totalPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchase(updatedIngredients);
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key]<=0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>
        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients = {this.state.ingredients}/>
                        <BuildControls
                            ingredientAdded = {this.addIngredientHandler}
                            ingredientRemoved = {this.removeIngredientHandler}
                            disabled = {disabledInfo}
                            price = {this.state.totalPrice}
                            purchasable = {this.state.purchasable}
                            ordered={this.purchaseEventHandler}
                        />
                </Aux>
            )
            orderSummary = 
            <OrderSummary 
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued = {this.purchaseContinueHandler}
            />
        }
        if(this.state.spinner){
            orderSummary = <Spinner/>
        }

        return(
            <Aux>
                <Modal 
                    show={this.state.purchasing}
                    modaled={this.purchaseCancelHandler}
                >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder , axios);