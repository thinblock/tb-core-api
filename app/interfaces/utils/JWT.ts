import * as Restify from 'restify';

export interface IJWTToken {
  id: string;
}

export interface IOAuthToken {
  token_id: string;
  client_id: string;
}