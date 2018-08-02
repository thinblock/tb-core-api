
enum ActivityLogEvents {
  ETH_TRANSACTION_CREATED = 'eth_transaction_created',
  ETH_TRANSACTION_VERIFIED = 'eth_transaction_verified',

  ETH_ACCOUNT_CREATED = 'eth_account_created',

  USER_ENCRYPTED_KEY_ADDED = 'user_key_added',

  APP_CREATED = 'app_created',
  APP_DELETED = 'app_deleted',

  OAUTH_TOKEN_CREATED = 'oauth_token_created',

  USER_LOGGED_IN = 'user_logged_in'
}

export {
  ActivityLogEvents
};
