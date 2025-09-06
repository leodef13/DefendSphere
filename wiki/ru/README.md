# Wiki (RU)

- [Быстрый старт](./quick-start.md)
- [Интеграция AI-ассистента](./ai-assistant-integration.md)
- Разделы панели:
  - Admin Panel — управление пользователями и системой (для администраторов)
  - User Dashboard — профиль пользователя и настройки (для всех пользователей)

## Визуализации (PNG) для Company LLD

Разделы Home/Reports могут ссылаться на статические изображения, размещённые на узле развертывания (в репозитории их нет):

- `/reports/organizations/CompanyLLDL/total_security_health.png`
- `/reports/organizations/CompanyLLDL/high_problems.png`
- `/reports/organizations/CompanyLLDL/critical_problems.png`
- `/reports/organizations/CompanyLLDL/medium_problems.png`
- `/reports/organizations/CompanyLLDL/low_problems.png`
- `/reports/organizations/CompanyLLDL/Vulsecheal.png`

## Обновление профиля

Обновление профиля выполняется через `PUT /api/users/profile` с телом:

```
{
  "email": "new@example.com",
  "currentPassword": "опционально",
  "newPassword": "опционально"
}
```

## Навигация

Пункты Incidents/Alerts удалены из интерфейса и тестов.