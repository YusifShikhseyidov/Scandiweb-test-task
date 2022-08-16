import React, { Component } from "react";
import Products from "../components/Products";
import {connect} from "react-redux";
import {closeCart, getProducts} from "../store/actions";
import { request } from "graphql-request";
import {clothesQuery} from "../queries";
import styled from "styled-components";

const Grid = styled.div.attrs({
    className: "clothProductsRow"
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

class ClothesPage extends Component {
    state = {
        isLoading: false
        // products: null
    }

    componentDidMount() {
        const getClothesProducts = async () => {
            this.setState({isLoading: true})
            try{
                await request("http://localhost:4000/", clothesQuery).then( data => this.props.getProducts(data.category))
                this.setState({isLoading: false})
            } catch(error) {
                this.props.setErrorMessage(error.message)
            }
        }

        getClothesProducts();
        this.props.closeCart();
        console.log(this.props)
        console.log(this.state)
    }



    // getClothesProducts = async () =>{
    //     try{
    //         const repsonse = await request("http://localhost:4000/", clothesQuery);
    //         const data = await repsonse.category;
    //         console.log(data)
    //         this.setState({...this.state, products: data});
    //     } catch (error){
    //         console.log(error);
    //     }
    // };

    render() {
        return(
            <div>
                <h2 className="category">{ this.state.products?.name}</h2>
                {this.state.products === null ? ( <div>A Second please...</div> ) : (
                    <Grid>
                        {this.props.allProducts.map( (product) => (
                            <div key={product.id} className="clothProductsRow-div-content" >
                                <Products product={product} id={product.id} />
                            </div>
                        ))}
                    </Grid>
                )}
            </div>
        );
    }
}

export default connect( mapStateToProps, mapDispatchToProps)(ClothesPage);