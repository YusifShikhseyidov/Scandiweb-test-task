import React, { Component } from "react";
import { addToCart, removeCartItem, setTotalAmountt } from "../../store/actions";
import { connect } from "react-redux";
import styles from "./styles/MiniCart.module.css";

const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems || [],
    currency: state.cart.currency
});

const mapDispatchToProps = (dispatch) =>({
    setTotalAmount: ()=> dispatch(setTotalAmountt()),
    addProductToCart: (product) => dispatch(addToCart(product)),
    removeProductFromCart: (index) => dispatch(removeCartItem(index))
});

class MiniCart extends Component{

    addToCartHandler = () =>{
        this.props.addProductToCart(this.props.item)
        this.props.setTotalAmount()
    }

    removeFromCartHandler = () => {
        this.props.removeProductFromCart(this.props.index)
        this.props.setTotalAmount()
    }

    getPriceLabel = (prices) => {
        let realPrice = 0;

        prices.forEach( price => {
            if(price.currency.label === this.props.currency.label) {
                realPrice = price.amount
                return
            }
        })
        return realPrice;
    }

    componentDidMount(){
        const qida = this.props;
        console.log(qida)
    }


    render(){
        return(
            <ul className={styles.list}>
                <li>
                    <div className={styles.layout}>
                        <div className={styles["row-one"]}>
                            <div className={styles.itemModel}>
                                <p>{this.props.item.brand}</p>
                                <p>{this.props.item.name}</p>
                            </div>
                            <p className={styles.boldMoney}>
                                {this.props.currency.symbol}
                                {this.getPriceLabel(this.props.item.prices)}
                            </p>

                            {this.props.item.attributes.map((attribute, atribute) => (
                                <div key={atribute}>
                                    <p className={styles.attrName}>{attribute.name}:</p>
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

                            <img src={this.props.item.gallery[0]} className={styles["product-image"]} alt="product"/>

                        </div>
                    </div>
                </li>
            </ul>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(MiniCart);
