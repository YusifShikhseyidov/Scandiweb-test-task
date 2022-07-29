import React, { Component } from "react";
import Cart from "../components/cart/Cart";

class CartPage extends Component{
    render(){
        return(
            <div>
                <h2>Cart</h2>
                <br/>
                <Cart/>
            </div>
        )
    }
}

export default CartPage;