import { gql } from "graphql-request";

export default gql`
    query getProductsBySlug($slug: String!) {
        products(where: { slug: $slug }) {
            id
            name
            price
            slug
            description
            images(first: 1) {
                id
                url
            }
        }
    }
`;
