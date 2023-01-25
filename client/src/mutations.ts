
import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createUser($userData: CreateUserDto!) {
    createUser(userData: $userData) {
      email
    }
  }

`

export const LOGIN_USER = gql`mutation userLogin($userData: UserLoginDto!) {
  login(userData: $userData) {
    id
    email
  }
}`

export const LOGOUT_USER = gql`
mutation userLogout {
  logout {
    id
  }
}
`

export const CREATE_REASSET = gql`
mutation createREAsset($reAssetData: CreateREAssetDto!) {
  createREAsset(REAssetData: $reAssetData) {
    id
  }
}
`
export const CREATE_REASSUMPTION = gql`
mutation createREAssumptions($reAssumptionsData: CreateREAssumptionsDto!) {
  createREAssumptions(REAssumptionsData: $reAssumptionsData) {
    id
    closing_cost
  }
} 
`

export const UPDATE_REASSUMPTION = gql`
mutation updateREAssumptions($updateReAssumptionsData: CreateREAssumptionsDto!, $assumptionId: Float!) {
  updateREAssumptions(REAssumptionsData: $updateReAssumptionsData, assumptionId: $assumptionId) {
    id
    closing_cost
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
    down_percent
    interest_rate
    hold_length
    mortgage_length
  }
}
`

export const DELETE_REASSET = gql`
mutation deleteREAsset($reAssetId: Float!) {
    deleteREAsset(reAssetId: $reAssetId) {
      id
    }
  }
`

export const PLAID_EXCHANGE_TOKEN = gql`
mutation exchangePublicToken($publicToken: String!, $products: [String!]!) {
  exchangePublicToken(publicToken: $publicToken, products: $products)
}
`

export const PLAID_UNLINK_BANK = gql`
mutation unlinkBank($bankNames: [String!]!) {
  unlinkBank(bankNames: $bankNames)
}
`