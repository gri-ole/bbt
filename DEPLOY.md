# Инструкция по созданию репозитория на GitHub и деплою на Vercel

## Шаг 1: Инициализация Git репозитория

Откройте терминал и выполните:

```bash
cd /Users/g.olenkins/Desktop/BusyBuddy.toys/webpage

# Инициализируйте git репозиторий
git init

# Добавьте все файлы
git add .

# Сделайте первый коммит
git commit -m "Initial commit: BusyBuddy.Toys landing page with day/night theme toggle"

# Переименуйте ветку в main (если нужно)
git branch -M main
```

## Шаг 2: Авторизация в GitHub CLI (если нужно)

Если GitHub CLI не авторизован, выполните:

```bash
gh auth login
```

Следуйте инструкциям на экране для авторизации.

## Шаг 3: Создание репозитория на GitHub

### Вариант A: Через GitHub CLI (рекомендуется)

```bash
# Создайте публичный репозиторий
gh repo create busybuddy-toys --public --source=. --remote=origin --push

# Или приватный
gh repo create busybuddy-toys --private --source=. --remote=origin --push
```

### Вариант B: Через веб-интерфейс GitHub

1. Зайдите на [github.com](https://github.com) и войдите в аккаунт
2. Нажмите кнопку "+" в правом верхнем углу → "New repository"
3. Заполните:
   - **Repository name**: `busybuddy-toys` (или другое имя)
   - **Description**: "BusyBuddy.Toys - Under Construction Landing Page"
   - **Visibility**: Public или Private
   - **НЕ** создавайте README, .gitignore или license (они уже есть)
4. Нажмите "Create repository"
5. Затем выполните в терминале:

```bash
# Добавьте remote
git remote add origin https://github.com/ВАШ_USERNAME/busybuddy-toys.git

# Запушьте код
git push -u origin main
```

## Шаг 4: Деплой на Vercel

### Через веб-интерфейс (рекомендуется):

1. Зайдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "Add New Project"
4. Выберите репозиторий `busybuddy-toys`
5. Vercel автоматически определит настройки:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build` (или оставьте пустым)
   - **Output Directory**: `.` (точка)
6. Нажмите "Deploy"

### Через Vercel CLI:

```bash
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Запустите деплой
cd /Users/g.olenkins/Desktop/BusyBuddy.toys/webpage
vercel

# Для продакшн деплоя
vercel --prod
```

## Готово! 🎉

После деплоя вы получите URL вида: `https://busybuddy-toys.vercel.app`

Вы также можете настроить кастомный домен в настройках проекта на Vercel.

