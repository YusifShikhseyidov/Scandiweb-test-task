import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Navbar from "./Navbar";
import TechPage from "../pages/TechPage";
import ClothesPage from "../pages/ClothesPage";
import ProductDescriptionPage from "../pages/ProductDescriptionPage";
import CartPage from "../pages/CartPage";
import ProductListingPage from "../pages/ProductListingPage";
import CategoriesPage from "../pages/CategoriesPage";
import "./styles/Home.css";
import request from "graphql-request";
import { categoriesQuery } from "../queries";

class Home extends Component {
    state={
        categories: []
    }

    
    getCategories = async () => {
        try{
            const response= await request("http://localhost:4000/", categoriesQuery);
            const data= await response.categories;
            this.setState({...this.state, categories: data});
        } catch(error){
            console.log(error);
        }
    }
    
    componentDidMount() {
        this.getCategories()
    }
    
    getNavbar = () =>{
        if(this.props.location.pathname !== "/"){
            return (<Navbar categories={this.state.categories}/>);
        }
        if(this.props.match.path === "/" && this.props.location.pathname === "/") {
            return (<h2>Welcome to our Store</h2>);
        }
    }

    render() {
        return(
            <div className="container">
                {this.getNavbar()}
                <Switch>
                    <Route exact path="/">
                        <CategoriesPage />
                    </Route>
                    <Route exact path="/all">
                        <ProductListingPage />
                    </Route>
                    <Route exact path="/tech">
                        <TechPage />
                    </Route>
                    <Route exact path="/clothes">
                        <ClothesPage />
                    </Route>
                    <Route exact path="/cart">
                        <CartPage />
                    </Route>
                    <Route exact path="/product/:productId">
                        <ProductDescriptionPage />
                    </Route>
                    <Route path="*">
                        <h2>Page Not Found (404)</h2>
                    </Route>
                </Switch>
            </div>
        )
    }
}

export default withRouter(Home);