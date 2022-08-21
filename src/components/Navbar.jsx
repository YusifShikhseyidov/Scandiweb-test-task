/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { toggleCurrencyMenu, setTotalAmountt, setCurrency, toggleCart, closeCart} from "../store/actions";
import MiniCart from "./cart/MiniCart";
import request from "graphql-request";
import {currencyQuery} from "../queries";
import styled from "styled-components";
import styles from "./styles/Navbar.module.css";
import { logo, arrowDown, arrowUp, cart } from "./imports";


const Ul = styled.ul`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    list-style: none;
    background-color: #fff;
    z-index: 10;
    padding: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-35%, 10%);
    animation: all 0.5s ease-out;
    opacity: 1;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    pointer-events: all;

    li{
        width: 57px;
        padding: 8px 24px;
        cursor: pointer;
    }

    li:hover{
        background-color: #EEEEEE;
    }
`

const Overlay = styled.span`
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 11.2%;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(57, 55, 72, 0.22);
    overflow: hidden;
    z-index: 2;
`

const mapStateToProps = (state) =>({
    cartItems: state.cart.cartItems || [],
    totalCartItems: state.cart.totalQuantity,
    totalPrice: state.cart.PriceInTotal,
    isOpen: state.currency.isOpen,
    openCart: state.cart.isOpen,
    currency: state.cart.currency
});

const mapDispatchToProps = (dispatch) =>({
    toggleCartHandler: () => dispatch(toggleCart()),
    toggleCurrencyMenuHandler: () => dispatch(toggleCurrencyMenu()),
    setCurrency: (currency) => dispatch(setCurrency(currency)),
    setTotalAmount: () => dispatch(setTotalAmountt()),
    closeCart: () => dispatch(closeCart())
});

class Navbar extends Component{

    state={
        currencies:[]
    }

    componentDidMount(){
        this.getCurrencies();
    }

    componentDidUpdate(previousProps){
        if(previousProps.currency !== this.props.currency){
            this.props.setTotalAmount();
        }
    }

    getCurrencies = async () => {
        try{
            const response = await request("http://localhost:4000/", currencyQuery);
            const data = await response.currencies;
            this.setState({ ...this.state, currencies: data });
        }
        catch(error) {
            console.log(error);
        }
    }

    toggleCurrencyMenuHandler = () =>{
        this.props.toggleCurrencyMenuHandler();
        this.props.closeCart();
    }

    render(){
        return (
            <nav className={styles.stickyNavbar}>

                {/* Navigation links part */}
                <div className={styles.navbar}>
                    <ul className={styles.navlinks}>
                        { this.props.categories.map((category) =>(
                            <li key={category.name}>
                                <NavLink exact activeClassName={styles.activeLink} to={`/${category.name}`} >
                                    {category.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    
                    {/* Site logo */}
                    <div className={styles.siteLogoContainer}>
                        <img src={logo} alt="logo" />
                    </div>

                    {/* Currency menu part */}
                    <div className={styles.currencyMenuAndCart}>
                        <div className={styles.currencyMenu}>
                            {!this.props.isOpen && (
                                <div>
                                    <button onClick={ this.toggleCurrencyMenuHandler}>
                                        <span className={styles.currencySign} >
                                            { this.props.currency.symbol }
                                        </span>

                                        <img src={arrowDown} alt="arrowDown" />
                                    </button>
                                </div>
                            )}
                            {this.props.isOpen && (
                                <>
                                    <button onClick={ this.toggleCurrencyMenuHandler}>
                                        <span className={styles.currencySign} >
                                            { this.props.currency.symbol }
                                        </span>
                                        
                                        <img src={arrowUp} alt="arrowUp" />
                                    </button>
                                
                            
                                    {/* Currencies */}
                                    <Ul>
                                        {this.state.currencies.map((currency, i) => (
                                            <li key={i} onClick={() => this.props.setCurrency(currency)}>
                                                {currency.symbol} {currency.label}
                                            </li>
                                        ))}
                                    </Ul>
                                </>
                            )}
                        </div>

                        {this.props.openCart && ( <Overlay onClick={() => this.props.closeCart()} ></Overlay>)}
                        
                        {/* Cart Section */}
                        <div className={styles.cart} >
                            <button onClick={() => this.props.toggleCartHandler()}>
                                <img src={cart} alt="cart" />
                                {this.props.cartItems.length > 0 && (
                                    <span className={styles.cartItemsNumber}>
                                        {this.props.totalCartItems}
                                    </span>
                                )}
                            </button>
                            

                            {this.props.openCart && (
                                <div className={styles.miniCart}>
                                    {this.props.cartItems.length === 0 ? (
                                        <p className={styles.emptyCart}> Nothing is selected</p>
                                    ) : (
                                        <>
                                            <div>
                                                <p className={styles.bag}>
                                                    <span className={styles.bold}>My Bag, </span>
                                                    {this.props.totalCartItems} items
                                                </p>
                                            </div>
                                            {this.props.cartItems.map((item, key) => (
                                                <MiniCart index={key} item={item} key={key} />
                                            ))}
                                            <div className={styles.total}>
                                                <p>Total</p>
                                                <p>
                                                    {this.props.currency.symbol}
                                                    {this.props.totalPrice.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className={styles.buttonActions}>
                                                <Link to={"/cart"}>
                                                    <button>View Bag</button>
                                                </Link>
                                                <button>Check out</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </nav>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);


