const AWS = require('aws-sdk')
const schema = require('./schema.graphql')

const API_ID = 'qt4nwza2u5g4vmp4qxx52r72ly'
const appsync = new AWS.AppSync({ region: 'us-east-1' })

const createApiKey = async () => {
  const apiKeyResponse = await appsync.createApiKey({
    apiId: API_ID
  }).promise()

  return apiKeyResponse.apiKey.id
}

const update = async () => {
  try {
    await appsync.startSchemaCreation({
      apiId: API_ID,
      definition: Buffer.from(schema)
    }).promise()
  } catch (err) {
    console.error(err)
  }
}

update()
