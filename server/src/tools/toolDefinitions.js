const toolDefinitions = [
  {
    name: 'search_knowledge',
    description:
      'Search the cybersecurity knowledge base for articles about security topics like phishing, malware, passwords, social engineering, etc. Use this when users ask about cybersecurity concepts or need security advice.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query or topic to look up in the knowledge base',
        },
        category: {
          type: 'string',
          description: 'Optional category filter',
          enum: [
            'Phishing',
            'Malware',
            'Password Security',
            'Social Engineering',
            'Account Security',
            'Safe Browsing',
            'Privacy',
          ],
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'url_risk_analyzer',
    description:
      'Analyze a URL for potential security risks. Checks for HTTPS usage, suspicious keywords, excessive subdomains, IP addresses instead of domains, and other risk indicators. Use this when a user shares a URL or asks if a URL is safe.',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to analyze for security risks',
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'create_incident',
    description:
      'Create a new security incident report for the user. Use this when a user wants to report a security incident. Always confirm the details with the user before creating the incident.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'A brief title for the incident',
        },
        description: {
          type: 'string',
          description: 'Detailed description of the security incident',
        },
        category: {
          type: 'string',
          description: 'The category of the incident',
          enum: [
            'Phishing',
            'Suspicious URL',
            'Malware',
            'Account Security',
            'Social Engineering',
            'Data Privacy',
            'Other',
          ],
        },
        severity: {
          type: 'string',
          description:
            'The severity level of the incident based on potential impact',
          enum: ['Low', 'Medium', 'High', 'Critical'],
        },
      },
      required: ['title', 'description', 'category', 'severity'],
    },
  },
  {
    name: 'get_my_incidents',
    description:
      "Retrieve the user's security incidents. Use this when a user asks to see their incidents, check incident status, or view their incident history.",
    parameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Optional filter by incident status',
          enum: ['Open', 'Under Review', 'Resolved', 'Closed'],
        },
      },
      required: [],
    },
  },
];

module.exports = toolDefinitions;
