
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