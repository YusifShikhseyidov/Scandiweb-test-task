/* eslint-disable react/prop-types */
import React, { Component } from "react"
import styles from "./styles/ProductDetails.module.css"
import { connect } from "react-redux"
import { addToCart, setTotalAmountt } from "../store/actions"
import { Markup } from "interweave"

const mapStateToProps = (state) => ({
  currency: state.cart.currency,
})


const mapDispatchToProps = (dispatch) => ({
  addProductToCart: (product) => dispatch(addToCart(product)),
  setTotalAmount: () => dispatch(setTotalAmountt()),
})

class ProductDetails extends Component {
  state = {
    selectedImage: this.props.product.gallery[0],
    disabled: true,
    product: this.props.product,
  }


  setSelectedValue = (attr, attr_item) => {
    const items = JSON.parse(JSON.stringify(this.state.product))
    items.attributes[attr].selected = attr_item.value

    this.setState({ ...this.state, product: items })
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
      redirect: true,
      product: this.props.product,
      disabled: true,
    })
  }
 

  render() {
    
    return (
      <div className={styles.layout}>

        {/* Images of the product section of the page (left part) */}
        <div className={styles["image-box"]}>
          <div className={styles["left-side-images"]}>
            {this.props.product.gallery.map((img, key) => (
              
              <div key={key} className={styles["left-side-images-container"]}>
                
                {!this.props.product.inStock && (
                  <p className={styles["out-of-stock-side-images"]}>out of stock</p>
                )}

                {!this.props.product.inStock ? (
                  <div key={key} className={styles.opacity}>
                    <img
                      onClick={() => this.setState({ selectedImage: img })}
                      src={img}
                      alt="/"
                    />
                  </div>
                ) : (
                  <div key={key}>
                    <img
                      onClick={() => this.setState({ selectedImage: img })}
                      src={img}
                      alt="/"
                    />
                  </div>
                )}
                  
              </div>

            ))}
          </div>
          <div className={styles["main-image-wrapper"]}>
            {!this.props.product.inStock && (
              <p className={styles["out-of-stock-main-image"]}>out of stock</p>
            )}
            {!this.props.product.inStock ? (
              <div className={styles.opacity}>
                <img src={this.state.selectedImage} alt="/" />
              </div>
            ) : (
              <div className={styles["main-image"]}>
                <img src={this.state.selectedImage} alt="/" />
              </div>
            )}
          </div>
          
          
        </div>

        {/* Details about the product section (right part) */}
        <div className={styles["product-info"]}>

          <div>
            <p className={styles["item-brand"]}>{this.state.product.brand}</p>
            <p className={styles["item-name"]}>{this.state.product.name}</p>
          </div>
          
          <div>
            {this.state.product.attributes?.map((attribute, index) => (
              <div key={index}>
                <p className={styles.bold}>{attribute.name}:</p>
                <div className={styles.attributes}>
                  {attribute.items?.map((item, i) => {
                    if (attribute.type === "swatch"){
                      return (
                        <div key={i} className={styles["color-box"]}>
                          <button
                            className={ attribute.selected === item.value ? styles["selected-color"] : "" }
                            style={{ backgroundColor: item.value, }}
                            onClick={() => this.setSelectedValue(index, item)}
                          ></button>
                        </div>
                      )
                    }else{
                      return (
                        <div key={i} className={styles["size-box"]}>
                          <button
                            className={ attribute.selected === item.value ? styles["selected-size"] : "" }
                            onClick={() => this.setSelectedValue(index, item)}
                          >
                            {item.value}
                          </button>
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
            ))}

            <div className={styles["item-price"]}>
              <p>Price:</p>
              <span>
                {this.props.currency.symbol}
                {this.getPriceLabel(this.props.product.prices).toFixed(2)}
              </span>
            </div>
            
            <form onSubmit={this.addToCartHandler}>
              {(this.state.product.inStock && this.state.product.attributes.length > 0) ? (
                <button
                  disabled={this.state.disabled}
                  className={styles["addToCart-button"]}
                >
                  ADD TO CART
                </button>
              ) : (this.state.product.inStock && this.state.product.name === "AirTag") ? (
                <button
                  disabled={!this.state.disabled}
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
          </div>

          <div className={styles.description}>
            <Markup content={this.props.product.description} />
          </div>

        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)
