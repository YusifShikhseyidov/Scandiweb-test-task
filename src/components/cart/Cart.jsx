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
    // state={
    //     items: []
    // }

    componentDidMount() {
        this.props.setTotalAmount();
        this.props.closeCart();
    }

    render() {
        return(
            <div>
                <ul className={styles["cart-list"]}>
                    {this.props.cartItems.map((item, key) => (
                        <CartItems index={key} item={item} key={key} />
                    ))}
                </ul>

                <div>
                    <div className={styles.order}>
                        <p>
                            Tax 21%: {this.props.cartItems.length === 0 ? (0) : (
                                <span>
                                    {this.props.currency.symbol}
                                    {(0.21 * this.props.totalPrice).toFixed(2)}
                                </span>
                            )}
                        </p>
                        <p>Quantity: <span>{this.props.totalCartItems}</span></p>
                        <p>Total: {this.props.cartItems.length === 0 ? (0) : (
                            <span>
                                {this.props.currency.symbol}
                                {this.props.totalPrice.toFixed(2)}
                            </span>
                        )}</p>
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