import React, { Component } from "react";
import Products from "../components/Products";
import {connect} from "react-redux";
import {closeCart} from "../store/actions";
import request from "graphql-request";
import {techQuery} from "../queries";
import styled from "styled-components";

const Grid = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: space-between;
    align-items: center;
    grid-gap: 50px;
`;

const mapDispatchToProps = (dispatch) => ({
    closeCart: () => dispatch(closeCart())
});

class TechPage extends Component {
    state = {
        products: null
    }

    componentDidMount() {
        this.props.closeCart();
        this.getTechProducts();
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

    render() {
        return(
            <div>
                <h2 className="category">{ this.state.products?.name}</h2>
                {this.state.products === null ? ( <div>A Second please...</div> ) : (
                    <Grid>
                        {this.state.products.products.map( (product) => (
                            <div key={product.id} >
                                <Products product={product} id={product.id} />
                            </div>
                        ))}
                    </Grid>
                )}
            </div>
        );
    }
}

export default connect( (state) => state, mapDispatchToProps)(TechPage);