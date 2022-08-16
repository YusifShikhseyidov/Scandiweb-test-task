import React, { Component } from "react";
import Products from "../components/Products";
import {connect} from "react-redux";
import {closeCart, getProducts} from "../store/actions";
import { request } from "graphql-request";
import {techQuery} from "../queries";
import styled from "styled-components";

const Grid = styled.div.attrs({
    className: "techProductsRow"
})`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-content: space-between;
    align-items: center;
    column-gap: 50px;
`;

const mapStateToProps = (state) => ({
    allProducts: state.productList.products.products || [],
    category: state.productList.products.name,
    isError: state.productList.isError,
    errorMessage: state.productList.errorMessage
});

const mapDispatchToProps = (dispatch) => ({
    getProducts: (product) => dispatch(getProducts(product)),
    closeCart: () => dispatch(closeCart())
});

class TechPage extends Component {
    state = {
        isLoading: false,
        // products: null
    }


    getTechProducts = async () =>{
        try{
            const repsonse = await request("http://localhost:4000/", techQuery);
            const data = await repsonse.category;
            this.setState({...this.state, products: data});
        } catch (error){
            console.log(error);
        }
    }

    componentDidMount() {

        const getTechProducts = async () => {
            this.setState({isLoading: true})
            try{
                await request("http://localhost:4000/", techQuery).then( data => this.props.getProducts(data.category))
                this.setState({isLoading: false})
            } catch(error) {
                this.props.setErrorMessage(error.message)
            }
        }

        getTechProducts();
        this.props.closeCart();
        console.log(this.props)
    }

    render() {
        return(
            <div>
                <h2 className="category">{ this.state.products?.name}</h2>
                {this.state.products === null ? ( <div>A Second please...</div> ) : (
                    <Grid>
                        {this.props.allProducts.map( (product) => (
                            <div key={product.id} className="techProductsRow-div-content" >
                                <Products product={product} id={product.id} />
                            </div>
                        ))}
                    </Grid>
                )}
            </div>
        );
    }
}

export default connect( mapStateToProps, mapDispatchToProps)(TechPage);