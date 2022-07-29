import React, { Component } from "react";
import { addToCart, setTotalAmount } from "../store/actions";
import { connect } from "react-redux";
import {Markup} from "interweave";
import styles from "./styles/ProductDetails.module.css";

const mapStateToProps = (state) =>({
    currency: state.cart.currency
});

const mapDispatchToProps = (dispatch) =>({
    addProductsToCart: (product) => dispatch(addToCart(product)),
    setTotalProductAmount: () => dispatch(setTotalAmount())
});

class ProductDetails extends Component {
    state={
        selectedImage: this.props.product.gallery[0],
        product: this.props.product,
        disabled: true
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

    componentDidUpdate(previousState){
        if(previousState.product.attributes !== this.state.product.attributes){
            if( this.props.product.inStock && this.state.product.attributes.every( attribute => attribute.selected) ){
                this.setState({...this.state, disabled: false});
            }
        }
    }

    addToCartHandler = (e) =>{
        e.preventDefault();
        this.props.addProductsToCart(this.state.product);
        this.props.setTotalProductAmount();
        this.setState({ ...this.state, redirect: true, product: this.props.product, disabled: true });
    }


    render() {
        return (
            <div className={styles.layout}>
                <div className={styles["image-box"]}>
                    <div className={styles["images"]}>
                        {this.props.product.gallery.map((image, key) => (
                            <img 
                                onClick={() => this.setState({selectedImage: image})}
                                key={key}
                                src={image}
                                alt= {`image ${key}`}
                            />
                        ))}
                    </div>
                    <div className={styles["main-image"]}>
                        <img src={this.state.selectedImage} alt="selected-image" />
                    </div>
                </div>


                <div className={styles["product-info"]}>
                    <h1 className={styles["product-brand"]}>{this.props.product.brand}</h1>
                    <h2 className={styles["product-name"]}>{this.props.product.name}</h2>
                    
                    <div>
                        {this.state.product.attributes.map((attribute, atribute) => (
                            <div key={atribute}>
                                <p className={styles.bold}>{attribute.name}:</p>
                                <div className={styles.attributes}>
                                    {attribute.items.map((item, index) => {
                                        if(attribute.type === "swatch") {
                                            return (
                                                <div key={index} className={styles["color-box"]}>
                                                    <button 
                                                        className={attribute.selected === item.value ? styles["selected-color"] : "" } 
                                                        style={{ backgroundColor: item.value }} 
                                                        onClick={() => this.setSelectedValue(atribute, item)}
                                                    ></button>
                                                </div>
                                            )
                                        } else {
                                            return(
                                                <div key={index} className={styles["size-box"]}>
                                                    <button className={attribute.selected === item.value ? styles["selected-size"] : ""} onClick={() => this.setSelectedValue(atribute, item)}>
                                                        {item.value}
                                                    </button>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className={styles.price}>
                            <p>Price:</p>
                            <span>
                                {this.props.currency.symbol}
                                {this.getPriceLabel(this.props.product.prices)}
                            </span>
                        </div>

                        <form onSubmit={this.addToCartHandler}>
                            {this.props.product.inStock ? (<button disabled={this.state.disabled} className={styles["addToCart-button"]}>
                                Add To Cart
                            </button> ) : (
                                <button disabled={true} className={styles["addToCart-button"]}>
                                    Out of Stock
                                </button>
                            )}
                        </form>
                    </div>

                    <div className={styles.description}>
                        <Markup content={this.props.product.description} />
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);