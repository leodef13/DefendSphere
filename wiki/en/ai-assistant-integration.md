# AI Assistant Integrations

Centralized management for external AI providers used by the Security Assistant.

- Configure in Admin Panel → Integrations → AI Assistant
- Backend endpoints: see `docs/ai_assistant_integration.md`
- Providers: OpenAI, Anthropic (Claude), Google Gemini, Azure OpenAI, Mistral, Groq, Vertex, Ollama
- Secrets encrypted (AES-256-GCM), admin-only APIs, audit logs

## Quick Steps
1. Open Admin Panel → Integrations → AI Assistant
2. Select provider → Configure
3. Enter API key/model → Test connection
4. Save → Enable provider

### Admin Controls

- **Save to Dashboard**: stores provider configuration in Redis (secrets encrypted via AES-256-GCM)
- **Test Connection**: performs a provider ping using the saved configuration
- **Enable/Disable**: switches the active AI provider used by the chat assistant

### Notes
- Only one provider can be active at a time
- Integrations are admin-only; non-admin users cannot view or edit the AI Assistant settings

## Fallback
If no provider is active, assistant uses built-in rule-based responses.