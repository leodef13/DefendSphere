#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Получаем аргументы командной строки
const args = process.argv.slice(2)
const reportName = args[0]
const author = args[1] || 'DefendSphere Team'

if (!reportName) {
  console.error('❌ Ошибка: Не указано название отчета')
  console.log('Использование: node create-report.js "Название отчета" [автор]')
  console.log('Пример: node create-report.js "Добавление системы уведомлений" "Иван Иванов"')
  process.exit(1)
}

// Создаем дату и время
const now = new Date()
const dateTime = now.toISOString().slice(0, 19).replace(/[-:]/g, '-').replace('T', '_')
const dateTimeReadable = now.toLocaleString('ru-RU', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
})

// Создаем имя файла
const fileName = `${reportName}_${dateTime}.md`
const reportsDir = path.join(__dirname, '..', 'reports')
const filePath = path.join(reportsDir, fileName)

// Создаем содержимое отчета
const reportContent = `# ${reportName}

**Дата создания:** ${dateTimeReadable}  
**Версия:** 1.0.0  
**Автор:** ${author}  

## Описание задачи

[Подробное описание того, что требовалось выполнить]

### Требования:
- [ ] Требование 1
- [ ] Требование 2
- [ ] Требование 3

### Цели:
- Цель 1
- Цель 2
- Цель 3

## Техническое описание

### Архитектурные решения:
[Описание принятых архитектурных решений]

### Используемые технологии:
- Технология 1
- Технология 2
- Технология 3

### Алгоритм реализации:
1. Шаг 1
2. Шаг 2
3. Шаг 3

## Изменения в коде

### Новые файлы:
- \`path/to/new/file.js\` - описание назначения
- \`path/to/another/file.tsx\` - описание назначения

### Измененные файлы:
- \`path/to/modified/file.js\` - описание изменений
- \`path/to/another/modified/file.tsx\` - описание изменений

### Удаленные файлы:
- \`path/to/deleted/file.js\` - причина удаления

## Тестирование

### Unit тесты:
- [ ] Тест 1
- [ ] Тест 2
- [ ] Тест 3

### Integration тесты:
- [ ] Тест интеграции 1
- [ ] Тест интеграции 2

### Manual тестирование:
- [ ] Проверка функциональности 1
- [ ] Проверка функциональности 2
- [ ] Проверка UI/UX

### Performance тестирование:
- [ ] Тест производительности 1
- [ ] Тест производительности 2

## Результаты

### Достигнутые цели:
- [ ] Цель 1 - достигнута
- [ ] Цель 2 - достигнута
- [ ] Цель 3 - достигнута

### Метрики:
- Метрика 1: значение
- Метрика 2: значение
- Метрика 3: значение

### Скриншоты/демонстрации:
[Ссылки на скриншоты или демо]

## Заключение

### Что получилось:
[Описание достигнутых результатов]

### Проблемы и ограничения:
[Описание возникших проблем и ограничений]

### Рекомендации для дальнейшего развития:
[Рекомендации по дальнейшему развитию]

### Связанные задачи:
- [Связанная задача 1](ссылка)
- [Связанная задача 2](ссылка)

---

**Файлы изменений:**
- \`file1.js\` (новый/изменен/удален)
- \`file2.tsx\` (новый/изменен/удален)

**Коммиты:**
- \`commit_hash\` - описание коммита
- \`commit_hash\` - описание коммита
`

// Создаем директорию reports если её нет
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true })
}

// Записываем файл
fs.writeFileSync(filePath, reportContent, 'utf8')

console.log('✅ Отчет создан успешно!')
console.log(`📁 Файл: ${fileName}`)
console.log(`📍 Путь: ${filePath}`)
console.log(`👤 Автор: ${author}`)
console.log(`📅 Дата: ${dateTimeReadable}`)
console.log('')
console.log('📝 Следующие шаги:')
console.log('1. Отредактируйте отчет, заполнив все разделы')
console.log('2. Добавьте отчет в git: git add reports/')
console.log('3. Закоммитьте изменения: git commit -m "docs: Add report for [название]"')
console.log('4. Отправьте в репозиторий: git push origin main')