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
export const IS_BANKACCOUNT_LINKED = gql`
  query bankAccountLinked {
    bankAccountLinked
  }
`

export const PLAID_CREATE_LINK_TOKEN = gql`
query createLinkToken {
  createLinkToken
}
`
export const PLAID_GET_ACCOUNTS = gql`
query getAccounts {
  getAccounts
}
`
export const PLAID_GET_TRANSACTIONS = gql`
query getTransactions {
  getTransactions
}
`

export const PLAID_GET_INVESTMENT_TRANSACTIONS = gql`
  query getInvestmentTransactions {
    getInvestmentTransactions
  }
`
export const PLAID_GET_BALANCE = gql`
  query getBalance {
    getBalance
  }
`

export const PLAID_GET_INSTITUTION_BY_NAME = gql`
  query searchInstitution($query: String!) {
    searchInstitution(query: $query)
  }
`