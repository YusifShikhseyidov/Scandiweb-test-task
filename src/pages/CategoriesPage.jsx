import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import { categoriesQuery } from "../queries";
import request from "graphql-request";

class CategoriesPage extends Component{

    state={
        categories: []
    }

    componentDidMount() {
        request("http://localhost:4000/", categoriesQuery)
            .then(({categories}) => this.setState({...this.state, categories}))
            .catch(error => console.log(error))
    }

    render(){
        return(
            <div>
                <h4>The Categories of the Products</h4>
                <ul className="category-list">
                    {this.state.categories.map((category) => (
                        <li key={category.name}>
                            <NavLink exact to={`/${category.name}`}>
                                {category.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default CategoriesPage;