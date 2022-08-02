import React, { Component } from "react";
import styles from "./styles/CartImages.module.css";
import { arrowRight, arrowLeft } from "../icons/Icons";

class CartImages extends Component{

    state={
        position: 0,
    }

    rightSlide = () => {
        if(this.state.position >= this.props.images.length - 1) {
            this.setState({position: 0});
            return
        }

        this.setState({position: this.state.position + 1});
    }

    leftSlide = () => {
        if(this.state.position <= 0){
            this.setState({position: this.props.images.length - 1})
            return
        }

        this.setState({position: this.state.position - 1});
    }

    render() {
        return(
            <div className={styles["images-container"]}>
                <img src={this.props.images[this.state.position]} alt="product-image" />
                {this.props.images.length > 1 && (
                    <div className={styles["buttons-container"]}>
                        <button onClick={this.leftSlide}>{arrowLeft}</button>
                        <button onClick={this.rightSlide}>{arrowRight}</button>
                    </div>
                )}
            </div>
        )
    }
}

export default CartImages;