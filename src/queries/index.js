import { gql } from "graphql-request";


export const productDetailsQuery = (productId) => gql`
    {
        product(id: "${productId}"){
            id
            category
            name
            brand
            gallery
            inStock
            description
            attributes{
                id
                name
                type
                items{
                    displayValue
                    value
                    id
                }
            }
            prices{
                currency{
                    label
                    symbol
                }
                amount
            }
        }
    }
`

export const perCategoryQuery = (category) => gql`
    {
        category(input: { title: "${category}" }){
            name
            products{
                id
                name
                inStock
                gallery
                description
                category
                attributes{
                    id
                    name
                    type
                    items{
                        id
                        value
                        displayValue
                    }
                }
                prices{
                    currency{
                        label
                        symbol
                    }
                    amount
                }
                brand
            }
        }
    }
`

export const categoriesQuery = gql`
    {
        categories{
            name
        }
    }
`

export const currencyQuery = gql`
    {
        currencies{
            label
            symbol
        }
    }
`
