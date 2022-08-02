import React, { Component } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Home from "./components/Home";
import { connect } from "react-redux";
import { closeCurrencyMenu } from "./store/actions";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "http://localhost:4000/"
})

const mapStateToProps = (state) => ({
  isOpen: state.currency.isOpen
});

const mapDispatchToProps = (dispatch) => ({
  closeCurrencyMenu: () =>{
    dispatch(closeCurrencyMenu());
  }
})

class App extends Component{
  constructor(props){
    super(props);
    this.bodyRef= React.createRef()
  }

  componentDidMount = () => {
    const isClicked = (e) => {
      if(this.props.isOpen && this.bodyRef.current.contains(e.target)){
        this.props.closeCurrencyMenu();
      }
    }
    isClicked();
    document.body.addEventListener("click", isClicked);

    return () => document.body.removeEventListener("click", isClicked);
  }

  render() {
    return(
      <div ref={this.bodyRef}>
        <ApolloProvider client={client} >
          <Home />
        </ApolloProvider>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
