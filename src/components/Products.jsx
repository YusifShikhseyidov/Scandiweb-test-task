import React, { Component } from "react";
import styles from "./styles/Products.module.css";
import { sendToCart } from "./imports";
import { connect } from "react-redux";
import { addToCart, setTotalAmountt } from "../store/actions";
import styled from "styled-components";
import { Link } from "react-router-dom";


const CartIcon = styled.button`
  position: absolute;
  bottom: 18%;
  left: 75%;
  padding: 6px 8px;
  background-color: #5ece7b;
  border-radius: 50%;
  color: #fff;
  transform: translate(50%, 0%);
  opacity: 0;
  animation: all 0.3s ease-out;
  z-index: 111;
  &:disabled {
    opacity: 0;
  }
`
const Wrapper = styled.div`
  position: relative;
  &:hover ${CartIcon} {
    opacity: 1;
  }
`

const ProductsCard = styled.div`
  padding: 12px;
  max-width: fit-content;
  max-width: -moz-fit-content;
  position: relative;

  &:hover {
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  }
`
const AttributeSelector = styled.div`
  position: absolute;
  background-color: #fff;
  border-radius: 11px;
  bottom: 20%;
  left: 16%;
  transform: translate(-3%, -13%);
  padding: 10px;
  z-index: 111;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
`

const mapStateToProps = (state) => ({
  currency: state.cart.currency,
  currency_: state.cart,
});

const mapDispatchToProps = (dispatch) => ({
  addItemsToCart: (item) => dispatch(addToCart(item)),

  setTotalAmount: () => dispatch(setTotalAmountt()),
});

class Products extends Component {
  state = {
    isShown: false,
    product: this.props.product,
    disabled: true,
  }

  getPriceLabel = (prices) => {
    let price_ = 0
    prices.forEach((price) => {
      if (price.currency.label === this.props.currency.label) {
        price_ = price.amount
        return
      }
    })
    return price_
  }

  setSelectedValue = (attribute, attribute_item) => {
    const items = JSON.parse(JSON.stringify(this.state.product))
    items.attributes[attribute].selected = attribute_item.value

    this.setState({
      ...this.state,
      product: items,
    })
  }
  componentDidUpdate(previousState) {
    if (previousState.product.attributes !== this.state.product.attributes) {
      if (
        this.props.product.inStock &&
        this.state.product.attributes.every((attribute) => attribute.selected)
      ) {
        this.setState({ ...this.state, disabled: false })
      }
    }
  }
  addToCartHandler = (e) => {
    e.preventDefault()
    this.props.addItemsToCart(this.state.product)
    this.setState({
      ...this.state,
      isShown: false,
      product: this.props.product,
      disabled: true,
    })
    this.props.setTotalAmount()
  }


  render() {
    return (
      <Wrapper>
        <>
          <>
            {this.props.product.attributes.length !== 0 ? (
              <>
                {this.props.product.inStock ? (
                  <CartIcon
                    onClick={() =>
                      this.setState({ isShown: !this.state.isShown })
                    }
                  >
                    <img src={sendToCart} alt="cartIconnn" />
                  </CartIcon>
                ) : (
                  <CartIcon disabled={true}><img src={sendToCart} alt="cartIconnn" /></CartIcon>
                )}
              </>
            ) : (
              <>
                {this.props.product.inStock ? (
                  <CartIcon
                    onClick={() =>
                      this.props.addItemsToCart({
                        ...this.props.product,
                        singlePrice: this.state.price,
                      })
                    }
                  >
                    <img src={sendToCart} alt="cartIconnn" />
                  </CartIcon>
                ) : (
                  <CartIcon disabled={true}><img src={sendToCart} alt="cartIconnn" /></CartIcon>
                )}
              </>
            )}
          </>

          {this.state.isShown && (
            <AttributeSelector>
              {this.state.product.attributes.map((attribute, index) => (
                <div key={index}>
                  <p className={styles.bold}>{attribute.name}:</p>
                  <div className={styles.attributes}>
                    {attribute.items.map((item, i) => {
                      if (attribute.type === "swatch"){
                        return (
                          <div key={i} className={styles["color-box"]}>
                            <button
                              className={ attribute.selected === item.value ? styles["selected-color"] : "" }
                              style={{ backgroundColor: item.value }}
                              onClick={() => this.setSelectedValue(index, item)}
                            ></button>
                          </div>
                        )} else{
                            return (
                                <div key={i} className={styles["size-box"]}>
                                    <button
                                      className={ attribute.selected === item.value ? styles["selected-size"] : "" }
                                      onClick={() => this.setSelectedValue(index, item) }
                                    > {item.value}
                                    </button>
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
                  >
                    ADD TO CART
                  </button>
                ) : (
                  <button disabled={true} className={styles["addToCart-button"]}>
                    OUT OF STOCK
                  </button>
                )}
              </form>
            </AttributeSelector>
          )}
        </>
        <Link to={"/product/" + this.props.product.id}>
          <ProductsCard
            className={!this.props.product.inStock && styles.opacity}
          >
            {!this.props.product.inStock && (
              <p className={styles["out-of-stock"]}>out of stock</p>
            )}
            <div className={styles["image-box"]}>
              <img src={this.props.product.gallery[0]} alt="/" />
            </div>
            <p className={styles["product-name"]}>
              {" "}
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

export default connect(mapStateToProps, mapDispatchToProps)(Products)


