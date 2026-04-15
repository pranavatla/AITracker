const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.TABLE_NAME;

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
  console.log('method:', event.httpMethod);
  console.log('authorizer:', JSON.stringify(event.requestContext?.authorizer));

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: HEADERS, body: '' };
  }

  // userId comes from the API Gateway Cognito authorizer — no manual JWT verification needed
  const userId = event.requestContext?.authorizer?.claims?.sub;
  console.log('userId:', userId);
  if (!userId) return respond(401, { error: 'Unauthorized' });

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
