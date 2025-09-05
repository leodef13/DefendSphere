# Changelog

## v1.1.0 - AI Assistant Integrations

### Added
- Backend API for centralized AI provider management: `/api/ai-assistant`
  - Status, configuration save/get, test, enable/disable provider
- AES-256-GCM encryption for stored API secrets
- Assistant now uses active provider if enabled, otherwise falls back
- Admin Panel: AI Assistant section with status card, provider tiles, config modal
- Documentation: `docs/ai_assistant_integration.md`

### Notes
- External provider calls are mocked in this release. SDK wiring can be added next.