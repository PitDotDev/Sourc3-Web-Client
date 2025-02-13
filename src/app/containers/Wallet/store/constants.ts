export enum WalletActionTypes {
  SET_TOTALS = '@@WALLET/SET_TOTALS',

  SET_ASSETS = '@@WALLET/SET_ASSETS',

  SET_SBBS = '@@WALLET/SET_SBBS',

  GET_RATE = '@@WALLET/GET_RATE',
  GET_RATE_SUCCESS = '@@WALLET/GET_RATE_SUCCESS',
  GET_RATE_FAILURE = '@@WALLET/GET_RATE_FAILURE',

  SET_RECEIVE_AMOUNT = '@@WALLET/SET_RECEIVE_AMOUNT',

  GENERATE_ADDRESS = '@@WALLET/GENERATE_ADDRESS',
  GENERATE_ADDRESS_SUCCESS = '@@WALLET/GENERATE_ADDRESS_SUCCESS',
  GENERATE_ADDRESS_FAILURE = '@@WALLET/GENERATE_ADDRESS_FAILURE',

  RESET_RECEIVE = '@@WALLET/RESET_RECEIVE',

  VALIDATE_SEND_ADDRESS = '@@WALLET/VALIDATE_SEND_ADDRESS',
  VALIDATE_SEND_ADDRESS_SUCCESS = '@@WALLET/VALIDATE_SEND_ADDRESS_SUCCESS',
  VALIDATE_SEND_ADDRESS_FAILURE = '@@WALLET/VALIDATE_SEND_ADDRESS_FAILURE',

  VALIDATE_AMOUNT = '@@WALLET/VALIDATE_AMOUNT',
  VALIDATE_AMOUNT_SUCCESS = '@@WALLET/VALIDATE_AMOUNT_SUCCESS',
  VALIDATE_AMOUNT_FAILURE = '@@WALLET/VALIDATE_AMOUNT_FAILURE',

  SEND_TRANSACTION = '@@WALLET/SEND_TRANSACTION',
  SEND_TRANSACTION_SUCCESS = '@@WALLET/SEND_TRANSACTION_SUCCESS',
  SEND_TRANSACTION_FAILURE = '@@WALLET/SEND_TRANSACTION_FAILURE',

  RESET_SEND_DATA = '@@WALLET/RESET_SEND_DATA',

  SET_SEND_TRANSACTION_STATE = '@@WALLET/SET_SEND_TRANSACTION_STATE',

  SET_SELECTED_ASSET_ID = '@@WALLET/SET_SELECTED_ASSET_ID',
}
