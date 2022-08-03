import React, { Component } from "react";
import Products from "../components/Products";
import { closeCart, getProducts, setError } from "../store/actions";
import { request } from "graphql-request";
import { query } from "../queries";
import { connect } from "react-redux";
import styled from "styled-components";

const Row=styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: space-between;
    align-items: center;
    row-gap: 50px;
`

const mapStateToProps = (state) => ({
    allProducts: state.productList.products.products || [],
    category: state.productList.products.name,
    isError: state.productList.isError,
    errorMessage: state.productList.errorMessage
});

const mapDispatchToProps = (dispatch) =>({
    getProducts: (product) => dispatch(getProducts(product)),
    closeCart: () => dispatch(closeCart()),
    setErrorMessage: (message) => dispatch(setError(message))
})

class ProductListingPage extends Component {
    state={
        isLoading: false
    }

    componentDidMount() {
        const getProducts = async () => {
            this.setState({isLoading: true})
            try{
                request("http://localhost:4000/", query).then( data => this.props.getProducts(data.category))
                this.setState({isLoading: false})
            } catch(error) {
                this.props.setErrorMessage(error.message)
            }
        }

        getProducts()
        this.props.closeCart()
    }

    render() {
        return (
            <>
                {!this.state.isLoading && (
                    <div>
                        <h1 className="category"> {this.props.category} </h1>
                        <Row>
                            {this.props.allProducts.map(product => (
                                <div key={product.id}>
                                    <Products product={product} id={product.id} />
                                </div>
                            ))}
                        </Row>
                    </div>
                )}

                {this.state.isLoading && (<div>Loading....</div>)}

                {!this.state.isLoading && this.props.isError && (<div>{this.props.errorMessage}</div>)}
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListingPage);