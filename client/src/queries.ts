import { gql } from "@apollo/client";

export const GET_USER_BY_EMAIL = gql`
  query getUserByEmail($email: String!) {
    getUserByEmail(userEmail: $email) {
      email
    }
  }
`

export const GET_USER_BY_ID = gql`
  query getUserById($userID: Float!) {
    getUserById(userId: $userID) {
      id
      email
      re_asset {
        id
        address
        purchase_price
        picture_links
        city
        province
      }
    }
  }
`