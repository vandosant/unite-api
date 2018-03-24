const AWS = require('aws-sdk')

const API_ID = 'qt4nwza2u5g4vmp4qxx52r72ly'
const appsync = new AWS.AppSync({ region: 'us-east-1' })

const schema = Buffer.from(`
# test update!!
type Comment {
	# The id of the comment's parent event.
	eventId: ID!
	# A unique identifier for the comment.
	commentId: String!
	# The comment's content.
	content: String!
	# The comment timestamp. This field is indexed to enable sorted pagination.
	createdAt: String!
}

type CommentConnection {
	items: [Comment]
	nextToken: String
}

type Event {
	id: ID!
	name: String
	where: String
	when: String
	description: String
	# Paginate through all comments belonging to an individual post.
	comments(limit: Int, nextToken: String): CommentConnection
}

type EventConnection {
	items: [Event]
	nextToken: String
}

type Message {
	id: ID!
	text: String
	createdAt: String!
	userId: Int!
}

type MessageConnection {
	items: [Message]
	nextToken: String
}

type Mutation {
	# Create a single event.
	createEvent(
		name: String!,
		when: String!,
		where: String!,
		description: String!
	): Event
	createMessage(text: String!, createdAt: String!, userId: Int!): Message
	# Delete a single event by id.
	deleteEvent(id: ID!): Event
	# Comment on an event.
	commentOnEvent(eventId: ID!, content: String!, createdAt: String!): Comment
}

type Query {
	# Get a single event by id.
	getEvent(id: ID!): Event
	# Paginate through events.
	getMessage(id: ID!): Message
	listEvents(limit: Int, nextToken: String): EventConnection
	listMessages(limit: Int, nextToken: String): MessageConnection
}

type Subscription {
	newMessage: Message
		@aws_subscribe(mutations: ["createMessage"])
}

type User {
	id: ID!
}

schema {
	query: Query
	mutation: Mutation
	subscription: Subscription
}
`)

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
      definition: schema
    }).promise()
  } catch (err) {
    console.error(err)
  }
}

update()
