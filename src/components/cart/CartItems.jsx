import React, { Component } from "react";
import { setTotalAmountt, addToCart, removeCartItem } from "../../store/actions";
import { connect } from "react-redux";
import CartImages from "./CartImages";
import styles from "./styles/CartItems.module.css";

const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems || [],
    currency: state.cart.currency
});

const mapDispatchToProps = (dispatch) =>({
    setTotalAmount: ()=> dispatch(setTotalAmountt()),
    addProductToCart: (product) => dispatch(addToCart(product)),
    removeProductFromCart: (index) => dispatch(removeCartItem(index))
});

class CartItems extends Component {
    state={
        price: 0
    }

    addToCartHandler = () =>{
        this.props.addProductToCart(this.props.item)
        this.props.setTotalAmount()
    }

    removeFromCartHandler = () => {
        this.props.removeProductFromCart(this.props.index)
        this.props.setTotalAmount()
    }

    getPriceLabel = (prices) => {
        let _price_ = 0;

        prices.forEach( price => {
            if(price.currency.label === this.props.currency.label) {
                _price_ = price.amount
                return
            }
        })
        return _price_;
    }


    render() {
        return(
            <>
                <li>
                    <div className={styles.layout}>
                        <div className={styles["row-one"]}>
                            <span>
                                <p className={styles.bold}>{this.props.item.brand}</p>
                                <p>{this.props.item.name}</p>
                            </span>
                            <p className={styles.bold}>
                                {this.props.currency.symbol}
                                {this.getPriceLabel(this.props.item.prices).toFixed(2)}
                            </p>

                            {this.props.item.attributes.map((attribute, atribute) => (
                                <div key={atribute}>
                                    <p className={styles.bold}>{attribute.name}</p>
                                    <div className={styles.attributes}>
                                        {attribute.items.map((item, index) =>{
                                            if(attribute.type === "swatch"){
                                                return(
                                                    <div key={index} className={styles["color-box"]}>
                                                        <span style={{ backgroundColor: item.value }} className={attribute.selected === item.value ? styles["selected-color"] : ""}></span>
                                                    </div>
                                                )
                                            } else{
                                                return(
                                                    <div key={index} className={styles["size-box"]}>
                                                        <span style={{ backgroundColor: item.value }} className={attribute.selected === item.value ? styles["selected-size"] : ""}>{item.value}</span>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles["row-two"]}>
                            <div className={styles["action-buttons"]}>
                                <button onClick={this.addToCartHandler}>+</button>
                                <span>{this.props.item.quantity}</span>
                                <button onClick={this.removeFromCartHandler}>-</button>
                            </div>

                            <CartImages images={this.props.item.gallery} />

                        </div>
                    </div>
                </li>
                <hr/>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItems);