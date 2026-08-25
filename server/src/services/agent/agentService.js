const { GoogleGenerativeAI } = require('@google/generative-ai');
const systemPrompt = require('../ai/systemPrompt');
const toolDefinitions = require('../../tools/toolDefinitions');
const searchKnowledge = require('../../tools/securityKnowledge');
const urlRiskAnalyzer = require('../../tools/urlAnalyzer');
const createIncidentTool = require('../../tools/createIncident');
const getIncidentsTool = require('../../tools/getIncidents');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Map tool names to their functions
const toolHandlers = {
  search_knowledge: searchKnowledge,
  url_risk_analyzer: urlRiskAnalyzer,
  create_incident: createIncidentTool,
  get_my_incidents: getIncidentsTool,
};

// Tools that need userId
const toolsNeedingUserId = ['create_incident', 'get_my_incidents'];

/**
 * Process a user message through the CyberGuard AI agent.
 * Handles tool calling automatically.
 *
 * @param {string} userMessage - The user's message
 * @param {Array} history - Previous messages in the conversation
 * @param {string} userId - The authenticated user's ID
 * @returns {Object} - { content, toolCalls }
 */
const processMessage = async (userMessage, history, userId) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt,
      tools: [{ functionDeclarations: toolDefinitions }],
    });

    // Build conversation history for Gemini
    const chatHistory = history
      .filter((msg) => msg.role !== 'system')
      .slice(-18) // Keep last 18 messages for context
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
    });

    // Send message
    let result = await chat.sendMessage(userMessage);
    let response = result.response;
    let toolCallsLog = [];

    // Handle function calls (tool use loop)
    let maxIterations = 5; // Prevent infinite loops
    while (maxIterations > 0) {
      const candidate = response.candidates?.[0];
      const parts = candidate?.content?.parts || [];

      // Check for function calls
      const functionCalls = parts.filter((p) => p.functionCall);

      if (functionCalls.length === 0) break;

      // Execute each function call
      const functionResponses = [];
      for (const part of functionCalls) {
        const { name, args } = part.functionCall;
        console.log(`[Agent] Calling tool: ${name}`, args);

        let toolResult;
        const handler = toolHandlers[name];

        if (handler) {
          if (toolsNeedingUserId.includes(name)) {
            toolResult = await handler(args, userId);
          } else {
            toolResult = typeof handler === 'function'
              ? (handler.constructor.name === 'AsyncFunction' ? await handler(args) : handler(args))
              : { error: 'Tool handler not callable' };
          }
        } else {
          toolResult = { error: `Unknown tool: ${name}` };
        }

        toolCallsLog.push({ tool: name, args, result: toolResult });

        functionResponses.push({
          functionResponse: {
            name,
            response: toolResult,
          },
        });
      }

      // Send function results back to the model
      result = await chat.sendMessage(functionResponses);
      response = result.response;
      maxIterations--;
    }

    const responseText =
      response.candidates?.[0]?.content?.parts
        ?.filter((p) => p.text)
        ?.map((p) => p.text)
        ?.join('') || 'I apologize, but I was unable to generate a response. Please try again.';

    return {
      content: responseText,
      toolCalls: toolCallsLog.length > 0 ? toolCallsLog : null,
    };
  } catch (error) {
    console.error('[Agent] Error:', error.message);

    // Handle specific API errors
    if (error.message?.includes('API key')) {
      throw new Error('AI service configuration error. Please contact support.');
    }

    if (error.message?.includes('quota') || error.message?.includes('rate')) {
      throw new Error(
        'AI service is temporarily busy. Please try again in a moment.'
      );
    }

    throw new Error(
      'I encountered an issue processing your request. Please try again.'
    );
  }
};

module.exports = { processMessage };
