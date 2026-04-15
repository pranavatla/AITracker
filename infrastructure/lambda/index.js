const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.TABLE_NAME;

// Verify Cognito access tokens directly in Lambda — more reliable than API Gateway authorizer
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID,
});

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Content-Type': 'application/json',
};

const respond = (statusCode, body) => ({
  statusCode,
  headers: HEADERS,
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: HEADERS, body: '' };
  }

  // Verify the JWT and extract the user identity
  const authHeader = event.headers?.Authorization || event.headers?.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  if (!token) return respond(401, { error: 'Missing token' });

  let userId;
  try {
    const payload = await verifier.verify(token);
    userId = payload.sub;
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return respond(401, { error: 'Invalid token' });
  }

  if (event.httpMethod === 'GET') {
    const result = await ddb.send(new GetCommand({ TableName: TABLE, Key: { userId } }));
    return respond(200, result.Item?.tasks || {});
  }

  if (event.httpMethod === 'PUT') {
    const tasks = JSON.parse(event.body || '{}');
    await ddb.send(new PutCommand({
      TableName: TABLE,
      Item: { userId, tasks, updatedAt: new Date().toISOString() },
    }));
    return respond(200, { ok: true });
  }

  return respond(405, { error: 'Method not allowed' });
};
