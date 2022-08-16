import React, { Component } from "react";
import styles from "./styles/Products.module.css";
import { sendToCart } from "./imports";
import { connect } from "react-redux";
import { addToCart, setTotalAmountt } from "../store/actions";
import styled from "styled-components";
import { Link } from "react-router-dom";


const ProductCard = styled.div.attrs({
  className: "productCardContainer"
})`
  padding: 16px;
  width: fit-content;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;

  &:hover {
    box-shadow: 0px 4px 35px rgba(168, 172, 176, 0.19);
  }
`
const AttributeSelector = styled.div.attrs({
  className: "attributeSelectingIcon"
})`
  position: absolute;
  left: 16%;
  bottom: 20%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #fff;
  border-radius: 11px;
  transform: translate(-3%, -13%);
  padding: 10px;
  z-index: 111;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
`

const mapStateToProps = (state) => ({
  currency: state.cart.currency,
});

const mapDispatchToProps = (dispatch) => ({
  addProductToCart: (product) => dispatch(addToCart(product)),
  setTotalAmount: () => dispatch(setTotalAmountt()),
});

class Products extends Component {
  state = {
    isShown: false,
    product: this.props.product,
    disabled: true,
  }

  getPriceLabel = (prices) => {
    let realPrice = 0
    prices.forEach((price) => {
      if (price.currency.label === this.props.currency.label) {
        realPrice = price.amount
        return
      }
    })
    return realPrice;
  }

  componentDidMount(){
    console.log("products")
    console.log(this.props)
    console.log(this.state)
  }

  setSelectedValue = (attribute, attribute_item) => {
    const items = JSON.parse(JSON.stringify(this.state.product))
    items.attributes[attribute].selected = attribute_item.value

    this.setState({
      ...this.state,
      product: items,
    })
  }

  componentDidUpdate(previousProps, previousState) {
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
    this.props.addProductToCart(this.state.product)
    this.props.setTotalAmount()
    this.setState({
      ...this.state,
      isShown: false,
      product: this.props.product,
      disabled: true,
    })
    
  }


  render() {
    return (
      <div className={styles.productSkeleton}>
        <>
          <>
            {this.props.product.attributes.length !== 0 ? (
              <>
                {this.props.product.inStock ? (
                  <button className={styles["cartIcon-button"]} onClick={() => this.setState({ isShown: !this.state.isShown })}>
                    <img src={sendToCart} alt="cartIconnn" />
                  </button>
                ) : (
                  <button className={styles["cartIcon-button"]} disabled={true}><img src={sendToCart} alt="cartIconnn" /></button>
                )}
              </>
            ) : (
              <>
                {this.props.product.inStock ? (
                  <button
                    className={styles["cartIcon-button"]}
                    onClick={() =>
                      this.props.addProductToCart({
                        ...this.props.product,
                        singlePrice: this.state.price,
                      })
                    }
                  >
                    <img src={sendToCart} alt="cartIconnn" />
                  </button>
                ) : (
                  <button className={styles["cartIcon-button"]} disabled={true}><img src={sendToCart} alt="cartIconnn" /></button>
                )}
              </>
            )}
          </>

          {this.state.isShown && (
            <AttributeSelector>
              {this.state.product.attributes.map((attribute, index) => (
                <div key={index}>
                  <p>{attribute.name}:</p>
                  <div className={styles.attributes}>
                    {attribute.items?.map((item, i) => {
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
          <ProductCard className={!this.props.product.inStock && styles.opacity}>
            
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

          </ProductCard>
        </Link>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)


