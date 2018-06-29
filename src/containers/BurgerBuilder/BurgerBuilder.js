import React, {Component} from 'react';
import Aux from '../../hoc/Aux'
import Burger from '../../componetns/Burger/Burger';
import  BuildControls from '../../componetns/Burger/BuildControls/BuildControls'
import Modal from '../../componetns/UI/Modal/Modal';
import OrderSummary from '../../componetns/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}
class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat:0,
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
    };
    addIngredientHandler = (type) =>{
        const oldCount = this.state.ingredients[type];
        const updatedCounted = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCounted;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);
    };
    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients)
            .map(igKey =>{
               return ingredients[igKey];
            }).reduce((sum,el)=>{
                return sum+el;
            },0);
        this.setState({purchasable: sum > 0});
    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount<=0){
            return;
        }
        const updatedCounted = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCounted;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);
    };
    purchaseHandler = ()=>{
        this.setState({purchasing: true});
    };
    purchaseCancelHandler = () =>{
        this.setState({purchasing: false});
    };
    purchaseContinueHandler = ()=> {
        const order ={
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer:{
                name: "Nurun Nobi Shamim",
                address:{
                    street:'Dhaka',
                    zipCode: '41351',
                    country: 'Bangladesh'
                },
                email: 'test@test.com'
            },
            deliveryMethod:'Koriar service',
        }
        axios.post('/orders.json',order)
            .then(response=>{
                console.log(response)
            }).catch(err=>console.log(err));
    };



    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary  purchaseCancelled={this.purchaseCancelHandler}
                                   purchaseContinued={this.purchaseContinueHandler}
                                   ingredients={this.state.ingredients}
                                   price={this.state.totalPrice}
                    />
                </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                    ingredientAdded={this.addIngredientHandler.bind(this)}
                    ingredientRemoved={this.removeIngredientHandler.bind(this)}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice}
                />
            </Aux>
        );
    }
}

export default BurgerBuilder;
