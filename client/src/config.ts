// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
// const apiId = 'pqrahixtia';
const apiId = 'e5p3pehr79';
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-h6lok52y.us.auth0.com', // Auth0 domain
  clientId: 'n1C5RazkRjZPB8kpDx03Eet4It4ofpni', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

//   POST - https://e5p3pehr79.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}/attachment