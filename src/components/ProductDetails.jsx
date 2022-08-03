import React, { Component } from "react"
import styles from "./styles/ProductDetails.module.css"
import { connect } from "react-redux"
import { addToCart, setTotalAmountt } from "../store/actions"
import { Markup } from "interweave"

const mapStateToProps = (state) => ({
  currency: state.cart.currency,
})


const mapDispatchToProps = (dispatch) => ({
  addProductsToCart: (product) => dispatch(addToCart(product)),
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
    let _price_ = 0
    prices.forEach((price) => {
      if (price.currency.label === this.props.currency.label) {
        _price_ = price.amount
        return
      }
    })
    return _price_;
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

  addToCartHadler = (e) => {
    e.preventDefault()
    this.props.addProductsToCart(this.state.product)
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
        <div className={styles["image-box"]}>
          <div className={styles["left-side-images"]}>
            {this.props.product.gallery.map((img, key) => (
              <img
                onClick={() => this.setState({ selectedImage: img })}
                key={key}
                src={img}
                alt=""
              />
            ))}
          </div>
          <div className={styles["main-image"]}>
            <img src={this.state.selectedImage} alt="" />
          </div>
        </div>

        <div className={styles["product-info"]}>
          <h1>{this.props.product.brand}</h1>
          <h2>{this.props.product.name}</h2>
          <div>
            {this.state.product.attributes.map((attribute, attrib) => (
              <div key={attrib}>
                <p className={styles.bold}>{attribute.name}:</p>
                <div className={styles.attributes}>
                  {attribute.items.map((item, i) => {
                    if (attribute.type === "swatch"){
                      return (
                        <div key={i} className={styles["color-box"]}>
                          <button
                            className={ attribute.selected === item.value ? styles["selected-color"] : "" }
                            style={{ backgroundColor: item.value, }}
                            onClick={() => this.setSelectedValue(attrib, item)}
                          ></button>
                        </div>
                      )
                    }else{
                      return (
                        <div key={i} className={styles["size-box"]}>
                          <button
                            className={ attribute.selected === item.value ? styles["selected-size"] : "" }
                            onClick={() => this.setSelectedValue(attrib, item)}
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

            <div className={styles.price}>
              <p>Price:</p>
              <span>
                {this.props.currency.symbol}
                {this.getPriceLabel(this.props.product.prices)}
              </span>
            </div>
            <form onSubmit={this.addToCartHadler}>
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
