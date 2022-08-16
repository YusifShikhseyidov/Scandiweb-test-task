import React, { Component } from "react";
import Cart from "../components/cart/Cart";

class CartPage extends Component{
    render(){
        return(
            <div>
                <h2>CART</h2>
                <br />
                <hr/>
                <Cart/>
            </div>
        )
    }
}

export default CartPage;