# 🤖 DefendSphere Security Assistant

AI-powered security assistant for the DefendSphere Security Dashboard.

## 🎯 Overview

The Security Assistant is an intelligent chatbot that helps users navigate the DefendSphere dashboard, understand security compliance standards, and get assistance with various security-related tasks.

## ✨ Features

### 🧠 **Intelligent Responses**
- **Security Standards Knowledge**: ISO 27001, GDPR, DORA, NIS2
- **Dashboard Navigation**: Help with finding and using dashboard features
- **User Data Search**: Search through user profiles, assets, and reports
- **Contextual Assistance**: Personalized responses based on user role and permissions

### 💬 **Chat Interface**
- **Real-time Chat**: Instant responses with typing indicators
- **Message History**: Persistent chat logs for compliance
- **Quick Actions**: Pre-defined buttons for common topics
- **Rich Content**: Support for text, links, and structured data

### 🔐 **Security & Privacy**
- **JWT Authentication**: Secure user identification
- **Role-based Access**: Different responses based on user permissions
- **Audit Logging**: Complete conversation history for compliance
- **Data Isolation**: User data is completely separated

## 🏗️ Architecture

### Frontend Components
```
src/components/assistant/
├── SecurityAssistant.tsx    # Main component
├── AssistantButton.tsx      # Floating action button
├── AssistantChat.tsx        # Chat interface
└── index.ts                 # Exports
```

### Backend API
```
backend/
├── routes/assistant.js      # Assistant endpoints
├── middleware/auth.js       # Authentication middleware
└── index.js                 # Main server with routes
```

### Data Flow
```
User Input → Frontend → API → Redis Search → Response Generation → Frontend Display
```

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend
```bash
npm install
npm run dev
```

### 3. Test the Assistant
```bash
node scripts/test-assistant.js
```

## 📱 UI Components

### AssistantButton
- **Position**: Fixed bottom-right corner
- **State**: Toggles between Bot icon (closed) and X icon (open)
- **Styling**: Gradient background with hover effects
- **Accessibility**: ARIA labels and keyboard support

### AssistantChat
- **Size**: 384px × 500px (w-96 h-[500px])
- **Header**: "Security Assistant" with AI-powered guidance subtitle
- **Messages**: User and assistant messages with avatars
- **Input**: Text field with send button and quick action buttons

## 🔌 API Endpoints

### POST `/api/assistant`
Main endpoint for processing user messages.

**Request:**
```json
{
  "message": "Tell me about ISO 27001",
  "userId": "admin",
  "userRole": "admin"
}
```

**Response:**
```json
{
  "response": "ISO/IEC 27001 is an international standard...",
  "type": "text",
  "data": {
    "url": "/compliance",
    "title": "View ISO 27001 Compliance"
  }
}
```

### GET `/api/assistant/logs`
Retrieves user's chat history.

### GET `/api/assistant/standards`
Provides information about available security standards.

## 🧪 Testing

### Manual Testing
1. **Open Dashboard**: Navigate to any DefendSphere page
2. **Click Assistant**: Click the floating bot button
3. **Send Messages**: Try various security-related questions
4. **Check Responses**: Verify intelligent responses and links

### Automated Testing
```bash
# Test the complete API
node scripts/test-assistant.js

# Test specific endpoints
curl -X POST http://localhost:5000/api/assistant \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"What is GDPR?","userId":"admin","userRole":"admin"}'
```

## 🎨 Customization

### Styling
The assistant uses Tailwind CSS classes. Customize by modifying:

```tsx
// Colors
className="bg-gradient-to-r from-[#56a3d9] to-[#134876]"

// Sizing
className="w-96 h-[500px]"

// Positioning
className="fixed bottom-24 right-6"
```

### Content
Modify responses in `backend/routes/assistant.js`:

```javascript
const securityStandards = {
  'iso27001': {
    title: 'ISO/IEC 27001',
    description: 'Your custom description...',
    keyPoints: ['Point 1', 'Point 2'],
    url: '/compliance',
    category: 'International Standard'
  }
};
```

### Behavior
Adjust the assistant's behavior in the `generateAssistantResponse` function:

```javascript
function generateAssistantResponse(message, userRole, searchResults) {
  // Add your custom logic here
  if (message.includes('custom_keyword')) {
    return {
      response: 'Custom response',
      type: 'text'
    };
  }
  // ... existing logic
}
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend
PORT=5000
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6380

# Frontend
VITE_API_URL=http://localhost:5000/api
```

### Redis Setup
The assistant requires Redis for:
- User data storage
- Chat history
- Security standards cache
- Search functionality

```bash
# Install Redis
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server

# Test connection
redis-cli ping
```

## 📊 Monitoring & Logging

### Chat Logs
All conversations are logged in Redis:
```
assistant:logs:{userId} -> [message1, message2, ...]
```

### Performance Metrics
- Response time tracking
- User interaction patterns
- Popular topics and questions
- Error rate monitoring

### Health Checks
```bash
# Check API health
curl http://localhost:5000/health

# Check Redis connection
redis-cli ping

# Check assistant endpoint
curl http://localhost:5000/api/assistant/standards
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Assistant Not Opening
- Check if user is authenticated
- Verify component mounting
- Check browser console for errors

#### 2. API Calls Failing
- Verify backend server is running
- Check authentication token
- Verify Redis connection
- Check API endpoint configuration

#### 3. No Responses
- Check backend logs
- Verify Redis data
- Check user permissions
- Test with fallback responses

### Debug Mode
Enable detailed logging:

```bash
# Backend
DEBUG=assistant:* npm run dev

# Frontend
# Check browser console for detailed logs
```

### Log Analysis
```bash
# View recent chat logs
redis-cli lrange "assistant:logs:admin" 0 10

# Check user data
redis-cli hgetall "user:admin"

# Monitor Redis operations
redis-cli monitor
```

## 🔒 Security Considerations

### Authentication
- JWT tokens with expiration
- Secure token storage
- Automatic token refresh

### Data Privacy
- User data isolation
- Secure message handling
- Audit trail maintenance

### Rate Limiting
- Request throttling
- Abuse prevention
- Resource protection

## 📈 Future Enhancements

### Planned Features
- **Multi-language Support**: Russian, Spanish, and more
- **Voice Interface**: Speech-to-text and text-to-speech
- **Advanced Search**: Semantic search across documents
- **Integration APIs**: Connect with external security tools
- **Machine Learning**: Improve response quality over time

### Extensibility
The assistant is designed to be easily extensible:
- Add new security standards
- Integrate with external APIs
- Customize response logic
- Add new message types

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Jest for testing

### Testing Guidelines
- Unit tests for components
- Integration tests for API
- E2E tests for user flows
- Accessibility testing

## 📚 Resources

### Documentation
- [DefendSphere Main README](./README.md)
- [API Documentation](./API_README.md)
- [Component Library](./COMPONENTS_README.md)

### External Resources
- [ISO 27001 Standard](https://www.iso.org/isoiec-27001-information-security)
- [GDPR Guidelines](https://gdpr.eu/)
- [DORA Regulation](https://www.eba.europa.eu/dora)
- [NIS2 Directive](https://digital-strategy.ec.europa.eu/en/policies/nis2-directive)

### Support
- **Issues**: [GitHub Issues](https://github.com/leodef13/DefendSphere/issues)
- **Discussions**: [GitHub Discussions](https://github.com/leodef13/DefendSphere/discussions)
- **Wiki**: [Project Wiki](https://github.com/leodef13/DefendSphere/wiki)

---

**Версия**: 1.0.0  
**Последнее обновление**: Сентябрь 2025  
**Автор**: DefendSphere Team "DefendSphere — Secure Smarter, Comply Faster"

*Empowering security professionals with intelligent assistance*