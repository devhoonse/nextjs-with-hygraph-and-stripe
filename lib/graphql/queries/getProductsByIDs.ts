import {gql} from "graphql-request";

export default gql`
    query getProductsByIDs($ids: [ID!]) {
        products(where: { id_in: $ids }) {
            id
            name
            price
            slug
            description
            images {
                id
                url
            }
        }
    }
`;
