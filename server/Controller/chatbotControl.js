const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

// Create a new Dialogflow session client
const projectId = 'e-waste-tmqr'; // replace with your Dialogflow project ID
const sessionClient = new dialogflow.SessionsClient();

exports.chatWithDialogflow = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  try {
    // Use the last user message for the Dialogflow query
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      return res.status(400).json({ error: 'Last message must be from user' });
    }

    // Create a unique session ID for each chat session
    const sessionId = uuid.v4();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    // Construct Dialogflow request
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: lastMessage.content,
          languageCode: 'en-US',
        },
      },
    };

    // Send request to Dialogflow
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    // Send back the fulfillment text as reply
    res.json({ reply: result.fulfillmentText });

  } catch (error) {
    console.error('Dialogflow API Error:', error);
    res.status(500).json({ error: 'Failed to get response from Dialogflow' });
  }
};
