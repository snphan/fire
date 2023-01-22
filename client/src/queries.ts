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
        bedrooms
        bathrooms
        picture_links
        city
        province
        re_assumptions {
          id
          rent_inc
          property_inc
          inflation
          rent
          maintenance_fee
          repairs
          property_tax
          utilities
          insurance
          management_fee
          other_expenses
          closing_cost
          down_percent
          interest_rate
          hold_length
          mortgage_length
        }
      }
    }
  }
`
export const PLAID_CREATE_LINK_TOKEN = gql`
query createLinkToken {
  createLinkToken
}
`
export const PLAID_EXCHANGE_TOKEN = gql`
query exchangePublicToken($publicToken: String!) {
  exchangePublicToken(publicToken: $publicToken)
}
`

export const PLAID_GET_ACCOUNTS = gql`
query getAccounts {
  getAccounts
}
`