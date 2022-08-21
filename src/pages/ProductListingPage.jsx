/* eslint-disable react/prop-types */
import React, { Component } from "react";
import Products from "../components/Products";
import { closeCart, getProducts, setError } from "../store/actions";
import { request } from "graphql-request";
import { perCategoryQuery } from "../queries";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import styled from "styled-components";

const Row=styled.div.attrs({
    className: "plpProductsRow"
})`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-content: space-between;
    align-items: center;
    column-gap: 50px;
`

const mapStateToProps = (state) => ({
    allProducts: state.productList.products.products || [],
    category: state.productList.products.name,
    isError: state.productList.isError,
    errorMessage: state.productList.errorMessage
});

const mapDispatchToProps = (dispatch) =>({
    getAllProducts: (product) => dispatch(getProducts(product)),
    closeCart: () => dispatch(closeCart()),
    setErrorMessage: (message) => dispatch(setError(message))
})

class ProductListingPage extends Component {
  
    state = {
        isLoading: false,
      }
    
    componentDidMount() {
        const getProducts = async () => {
            this.setState({isLoading: true});
            try {
              await request( "http://localhost:4000/", perCategoryQuery(this.props.match.path.slice(1))).then( data => this.props.getAllProducts(data.category))
        
              
              
        
              this.setState({isLoading: false});
            } catch (error) {
              this.props.setErrorMessage(error.message)
            }
    
        };
        
        getProducts();
        this.props.closeCart();
    }
    
    
    
    render() {
        return (
            <>
                <div>
                    <h1 className="category"> {this.props.category}</h1>
                    {this.state.isLoading ? (
                        <div>A Second Please...</div>
                    ) : (
                        <Row>
                            {this.props.allProducts.map((product) => (
                                <div key={product.id} className="plpProductsRow-div-content" >
                                    <Products product={product} id={product.id} />
                                </div>
                            ))}
                        </Row>
                    )}
                </div>
                {!this.state.isLoading && this.props.isError && (<div>{this.props.errorMessage}</div>)}
            </>
        )
    }
}

export default compose( withRouter, connect(mapStateToProps, mapDispatchToProps))(ProductListingPage);