import React, { Component } from "react";
import styles from "./styles/Products.module.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addToCart, setTotalAmount } from "../store/actions";
import { cartIcon } from "./icons/Icons";
import styled from "styled-components";


const mapStateToProps = (state) => ({
    currency: state.cart.currency,
    currency_: state.cart
});

const mapDispatchToProps = (dispatch) => ({
    addProductsToCart: (product) => dispatch(addToCart(product)),
    setTotalProductAmount: () => dispatch(setTotalAmount())
});

class Products extends Component {
    state={
        product: this.props.product,
        disabled: true,
        isShown: false,
    }

    componentDidUpdate(previousState){
        if(previousState.product.attributes !== this.state.product.attributes){
            if( this.props.product.inStock && this.state.product.attributes.every( attribute => attribute.selected) ){
                this.setState({...this.state, disabled: false});
            }
        }
    }

    setSelectedValue = ( attribute, attribute_item ) =>{
        const items = JSON.parse(JSON.stringify(this.state.product));
        items.attributes[attribute].selected = attribute_item.value;
        this.setState({...this.state, product: items})
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

    addToCartHandler = (e) =>{
        e.preventDefault();
        this.props.addProductsToCart(this.state.product);
        this.props.setTotalProductAmount();
        this.setState({ ...this.state, isShown: false, product: this.props.product, disabled: true });
    }

    render() {
        return(
            // container element
            <Wrapper>
                <>
                    <>
                        {this.props.product.attributes.length !== 0 ? (
                            <>
                                {this.props.product.inStock ? (
                                    <CartIcon onClick={() => this.setState({ isShown: !this.state.isShown })}>
                                        {cartIcon}
                                    </CartIcon>
                                ) : (
                                    <CartIcon disabled={true}> {cartIcon} </CartIcon>
                                )}
                            </>
                        ) : (
                            <>
                                {this.props.product.inStock ? (
                                    <CartIcon onClick={() => this.props.addProductsToCart({...this.props.product, singleprice: this.state.price})}>
                                        {cartIcon}
                                    </CartIcon>
                                ) : (
                                    <CartIcon disabled={true}>{cartIcon}</CartIcon>
                                )}
                            </>
                        )}
                    </>


                    {this.state.isShown && (
                        <AtributeSelector>
                            {this.state.product.attributes.map((attribute, atribute) => (
                                <div key={atribute}>
                                    <p className={styles.bold}>{attribute.name}: </p>
                                    <div className={styles.attributes}>
                                        {attribute.items.map((item, index) => {
                                            if(attribute.type === "swatch"){
                                                return (
                                                    <div key={index} className={styles["color-box"]}>
                                                        <button 
                                                            className={attribute.selected === item.value ? styles["selected-color"] : "" } 
                                                            style={{backgroundColor: item.value }} 
                                                            onClick={() => this.setSelectedValue(atribute, item)}
                                                        ></button>
                                                    </div>
                                                )
                                            } else{
                                                return (
                                                    <div key={index} className={styles["size-box"]}>
                                                        <button 
                                                            className={attribute.selected === item.value ? styles["selected-size"] : "" }
                                                            onClick={() => this.setSelectedValue(atribute, item)}
                                                        > {item.value} </button>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                </div>
                            ))}

                            <form onSubmit={this.addToCartHandler}>
                                {this.props.product.inStock ? (
                                    <button 
                                        disabled={this.state.disabled}
                                        className={styles["addToCart-button"]}
                                    >Add To Cart</button>
                                ) : (
                                    <button disabled={true} className={styles["addToCart-button"]}>Out of Stock</button>
                                )}
                            </form>
                        </AtributeSelector>
                    )}
                </>

                <Link to={"/product/" + this.props.product.id}>
                    <ProductsCard className={!this.props.product.inStock && styles.opacity}>
                        {!this.props.product.inStock && (
                            <p className={styles["out-of-stock"]}>Out of Stock</p>
                        )}
                        <div className={styles["image-box"]}>
                            <img src={this.props.product.gallery[0]} alt="image" />
                        </div>
                        <p className={styles["product-name"]}>
                            {this.props.product.brand} {this.props.product.name}
                        </p>
                        <span className={styles.price}>
                            {this.props.currency.symbol}
                            {this.getPriceLabel(this.props.product.prices)}
                        </span>
                    </ProductsCard>
                </Link>
            </Wrapper>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);



const CartIcon = styled.button`
    position: absolute;
    bottom: 19%;
    left: 75%;
    padding: 6px 8px;
    border-radius: 50%;
    backround-color: #5ece7b;
    color: #fff;
    opacity: 0;
    transform: translate(50%, 0%);
    animation: all 0.4s ease-out;
    z-index: 111;
    &:disabled {
        opacity: 0;
    }
`

const Wrapper = styled.div`
    position: relative;
    &:hover ${CartIcon}{
        opacity: 1;
    }
`

const AtributeSelector = styled.div`
    position: absolute;
    bottom: 20%;
    left: 15%;
    transform: translate(-3%, -14%);
    padding: 10px;
    background-color: #fff;
    border-radius: 12px;
    z-index: 111;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
`

const ProductsCard = styled.div`
    max-width: fit-content;
    position: relative;
    padding: 12px;
    &:hover{
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
`