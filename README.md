# vue-client-masterclass

Этот шаблон поможет вам начать разработку с использованием Vue 3 и Vite.

## Установка необходимых инструментов

1. Установите [Node.js](https://nodejs.org/) с официального сайта.
2. Скачайте и установите [Visual Studio Code](https://code.visualstudio.com/) или [WebStorm](https://www.jetbrains.com/webstorm/).

## Рекомендуемая настройка IDE

Если вы выбрали Visual Studio Code:
- Установите расширение [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (и отключите Vetur).

## Поддержка типов для `.vue` импортов в TypeScript

TypeScript по умолчанию не может обрабатывать типы для импортов `.vue`, поэтому мы заменяем `tsc` CLI на `vue-tsc` для проверки типов. В редакторах нам нужен [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar), чтобы TypeScript язык понимал типы `.vue`.

## Настройка конфигурации

Смотрите [Vite Configuration Reference](https://vitejs.dev/config/).

## Настройка проекта

```sh
npm install
```

### Компиляция и горячая перезагрузка для разработки

```sh
npm run dev
```

### Проверка типов, компиляция и минификация для продакшена

```sh
npm run build
```

### Линтинг с помощью [ESLint](https://eslint.org/)

```sh
npm run lint
```
