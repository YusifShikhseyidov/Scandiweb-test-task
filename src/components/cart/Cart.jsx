/* eslint-disable react/prop-types */
import React, { Component } from "react";
import styles from "./styles/Cart.module.css";
import { setTotalAmountt, clearCart, closeCart } from "../../store/actions";
import { connect } from "react-redux";
import CartItems from "./CartItems";

const mapStateToProps = (state) => ({
    totalCartItems: state.cart.totalQuantity,
    totalPrice: state.cart.PriceInTotal,
    cartItems: state.cart.cartItems || [],
    currency: state.cart.currency
});

const mapDispatchToProps = (dispatch) => ({
    setTotalAmount: () => dispatch(setTotalAmountt()),
    clearCart: () => dispatch(clearCart()),
    closeCart: () => dispatch(closeCart())
});

class Cart extends Component {

    componentDidMount() {
        this.props.setTotalAmount();
        this.props.closeCart();
    }

    render() {
        return(
            <div className={styles.seeCart}>

                <h2 className={styles.cartHeading}>CART</h2>
                
                <hr/>

                <ul className={styles["cart-list"]}>
                    {this.props.cartItems.map((item, key) => (
                        <CartItems index={key} item={item} key={key} />
                    ))}
                </ul>

                <div>
                    <div className={styles.order}>
                        <p className={styles["order-firstChild"]}>
                            Tax 21%: &nbsp;&nbsp;{this.props.cartItems.length === 0 ? (0) : (
                                <span>
                                    {this.props.currency.symbol}
                                    {(0.21 * this.props.totalPrice).toFixed(2)}
                                </span>
                            )}
                        </p>
                        <p className={styles["order-firstChild"]}>Quantity: {this.props.totalCartItems}</p>
                        <div>
                            <p className={styles["order-secondChild"]}>Total: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                            {this.props.cartItems.length === 0 ? (<span className={styles.totalPriceee}>0</span>) : (
                                <span className={styles.totalPriceee}>
                                    {this.props.currency.symbol}
                                    {this.props.totalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                    <button className={styles["order-button"]} onClick={() => this.props.clearCart()}>
                        Order
                    </button>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);