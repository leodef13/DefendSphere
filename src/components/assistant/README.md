# Security Assistant Components

This directory contains the AI-powered Security Assistant components for the DefendSphere dashboard.

## Components Overview

### 1. SecurityAssistant
Main component that combines the assistant button and chat interface.

**Features:**
- Manages chat open/close state
- Renders both AssistantButton and AssistantChat components

### 2. AssistantButton
Floating action button for the security assistant.

**Features:**
- Fixed position at bottom-right corner
- Gradient background with hover effects
- Toggles between Bot and X icons
- Smooth animations and transitions

**Props:**
- `isOpen: boolean` - Current chat state
- `onToggle: () => void` - Toggle function

### 3. AssistantChat
Main chat interface for the security assistant.

**Features:**
- Personalized greeting with user's username
- Real-time chat with AI assistant
- Support for different message types (text, links, search results)
- Fallback responses when API is unavailable
- Quick action buttons for common topics

**Props:**
- `isOpen: boolean` - Chat visibility state
- `onClose: () => void` - Close chat function

## API Integration

### Endpoints

#### POST `/api/assistant`
Main endpoint for processing user messages.

**Request Body:**
```json
{
  "message": "string",
  "userId": "string",
  "userRole": "string"
}
```

**Response:**
```json
{
  "response": "string",
  "type": "text|link|search_result",
  "data": {
    "url": "string",
    "title": "string"
  }
}
```

#### GET `/api/assistant/logs`
Retrieves user's chat history.

#### GET `/api/assistant/standards`
Provides information about security standards.

### Features

#### 1. Security Standards Knowledge
- **ISO 27001**: Information Security Management Systems
- **GDPR**: General Data Protection Regulation
- **DORA**: Digital Operational Resilience Act
- **NIS2**: Network and Information Security Directive

#### 2. Dashboard Navigation
- Search through dashboard sections
- Provide guidance on features
- Quick navigation links

#### 3. User Data Search
- Search through user profile
- Search through user assets
- Search through user reports

#### 4. Fallback Responses
- Offline functionality
- Pre-defined responses for common queries
- Graceful degradation when API is unavailable

## Usage Examples

### Basic Implementation
```tsx
import SecurityAssistant from '../components/assistant/SecurityAssistant';

function App() {
  return (
    <div>
      {/* Your app content */}
      <SecurityAssistant />
    </div>
  );
}
```

### Custom Styling
```tsx
// The components use Tailwind CSS classes
// You can customize by modifying the className props
<AssistantButton 
  isOpen={isOpen} 
  onToggle={toggleChat}
  className="custom-button-classes"
/>
```

## Styling

### Color Scheme
- **Primary**: `#56a3d9` (blue)
- **Secondary**: `#134876` (dark blue)
- **Background**: `#f8f9fa` (light gray)
- **Text**: `#2c2c2c` (dark gray)

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

### Animations
- Smooth transitions for state changes
- Hover effects on interactive elements
- Loading animations for API calls

## Security Features

### Authentication
- JWT token validation
- User role-based access control
- Secure API communication

### Data Privacy
- User data isolation
- Secure message handling
- Audit logging for compliance

## Error Handling

### API Failures
- Graceful fallback to offline responses
- User-friendly error messages
- Retry mechanisms for failed requests

### Network Issues
- Offline mode support
- Cached responses when possible
- Connection status indicators

## Accessibility

### ARIA Support
- Proper labels and descriptions
- Keyboard navigation support
- Screen reader compatibility

### Internationalization
- Multi-language support
- RTL language support
- Cultural considerations

## Performance

### Optimization
- Lazy loading of chat components
- Efficient state management
- Minimal re-renders

### Caching
- User preference storage
- Chat history caching
- Standard information caching

## Testing

### Component Testing
- Unit tests for individual components
- Integration tests for chat flow
- Accessibility testing

### API Testing
- Endpoint validation
- Error scenario testing
- Performance testing

## Deployment

### Environment Variables
```bash
VITE_API_URL=http://localhost:5000/api
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
```

### Build Process
```bash
npm run build
npm run preview
```

## Troubleshooting

### Common Issues

1. **Chat not opening**
   - Check if user is authenticated
   - Verify component mounting
   - Check console for errors

2. **API calls failing**
   - Verify backend server is running
   - Check authentication token
   - Verify API endpoint configuration

3. **Styling issues**
   - Ensure Tailwind CSS is loaded
   - Check for CSS conflicts
   - Verify responsive breakpoints

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=assistant:*
```

## Contributing

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent naming conventions

### Testing
- Write tests for new features
- Ensure accessibility compliance
- Test on multiple devices

### Documentation
- Update README for new features
- Include usage examples
- Document API changes