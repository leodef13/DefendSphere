# AI Assistant Integration

## Overview
Centralized management of external AI providers used by the Security Assistant.

## Providers
- ChatGPT (OpenAI) → `openai`
- Claude (Anthropic) → `claude`
- Gemini (Google) → `gemini`
- Azure OpenAI → `azure`
- Mistral → `mistral`
- Groq → `groq`
- Vertex AI → `vertex`
- Ollama → `ollama`

## Redis Keys
- `integration:ai:active` → current active provider key (e.g., `openai`)
- `integration:ai:<provider>` → provider config hash (encrypted secrets)
- `integration:ai:logs` → admin actions log (capped 500)

## Security
- AES-256-GCM encryption for API keys and secrets
- Admin-only endpoints (JWT + role-based)
- Audit logging in Redis

## API Endpoints

Check status
- GET `/api/ai-assistant`
Response:
```json
{ "active": false }
```
Or
```json
{ "active": true, "provider": "openai" }
```

Get config
- GET `/api/ai-assistant/:provider/config`

Save config
- POST `/api/ai-assistant/:provider/config`
Body example (OpenAI):
```json
{ "apiKey": "sk-...", "model": "gpt-4o-mini", "maxTokens": "4096" }
```

Enable provider
- POST `/api/ai-assistant/:provider/enable`

Disable provider
- POST `/api/ai-assistant/:provider/disable`

Test provider
- POST `/api/ai-assistant/:provider/test`
Body:
```json
{ "message": "ping" }
```

## Frontend (Admin Panel)
- Integrations → AI Assistant card shows current status
- Configure button opens modal with provider-specific fields
- Actions: Save to Dashboard, Test connection, Enable/Disable provider

## Assistant Behavior
- If active provider configured → assistant uses external API path
- If not active → fallback rule-based responses
- Switching provider updates behavior automatically

## Troubleshooting
- Verify JWT role = admin
- Ensure Redis is reachable (REDIS_URL)
- Set `AI_SECRET_KEY` or `JWT_SECRET` for crypto
- Check backend logs and `integration:ai:logs`

## Security Best Practices
- Rotate API keys regularly
- Restrict admin access
- Mask secrets in UI and responses
- Use HTTPS everywhere

