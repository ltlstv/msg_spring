# Messenger — веб-мессенджер (backend + frontend)

Учебный/pet-проект мессенджера в реальном времени. Состоит из двух независимых
приложений, которые лежат в соседних папках:

| Модуль | Папка | Технологии |
|--------|-------|------------|
| **Backend** | `messenger-backend` | Java 17, Spring Boot 4, Spring Security, Spring Data JPA, WebSocket/STOMP, PostgreSQL, JWT |
| **Frontend** | `messenger-frontend` | React 19, Rsbuild, STOMP.js + SockJS, Biome |

Обмен сообщениями происходит в реальном времени по WebSocket (STOMP поверх SockJS),
аутентификация — через JWT, история переписки и профиль (в т.ч. загрузка аватара) —
через REST.

---

## Содержание

- [Архитектура](#архитектура)
- [Backend](#backend)
  - [Технологический стек](#технологический-стек-backend)
  - [Структура проекта](#структура-проекта-backend)
  - [REST API](#rest-api)
  - [WebSocket / STOMP](#websocket--stomp)
  - [Безопасность и JWT](#безопасность-и-jwt)
  - [Аватары](#аватары)
  - [База данных](#база-данных)
  - [Конфигурация](#конфигурация)
  - [Запуск backend](#запуск-backend)
- [Frontend](#frontend)
  - [Технологический стек](#технологический-стек-frontend)
  - [Структура проекта](#структура-проекта-frontend)
  - [Запуск frontend](#запуск-frontend)
- [Полный сценарий работы](#полный-сценарий-работы)
- [Текущие ограничения и TODO](#текущие-ограничения-и-todo)

---

## Архитектура

```
┌────────────────────────┐         REST (JSON, JWT в заголовке)         ┌──────────────────────────┐
│   Frontend (React)     │  ──────────────────────────────────────────▶ │   Backend (Spring Boot)  │
│   http://localhost:5500│                                               │   http://localhost:8080  │
│                        │  ◀── WebSocket / STOMP поверх SockJS ───────▶ │                          │
│  - localStorage: jwt   │        (CONNECT с Bearer-токеном)             │   ┌──────────────────┐   │
│  - STOMP.js + SockJS   │                                               │   │   PostgreSQL     │   │
└────────────────────────┘                                               │   │   :5433/database │   │
                                                                         │   └──────────────────┘   │
                                                                         └──────────────────────────┘
```

- **REST** используется для регистрации/входа, получения истории сообщений и работы
  с профилем (получение данных, загрузка/удаление аватара).
- **WebSocket (STOMP)** используется для доставки сообщений в реальном времени.
- **Статические файлы** (аватары) отдаются backend'ом напрямую по пути `/avatars/**`.

---

## Backend

### Технологический стек (backend)

- **Java 17**, **Spring Boot 4.0.1**
- **Spring Web MVC** — REST-контроллеры
- **Spring WebSocket** — STOMP-брокер поверх SockJS
- **Spring Security** — фильтрация запросов, JWT-аутентификация
- **Spring Data JPA (Hibernate)** — доступ к данным
- **PostgreSQL** — СУБД
- **JJWT (io.jsonwebtoken 0.12.5)** — генерация и проверка JWT
- **Lombok** — сокращение boilerplate-кода
- **Spring Boot DevTools / Docker Compose support** — удобство разработки

### Структура проекта (backend)

```
src/main/java/org/example
├── MessengerBackendApplication.java     // точка входа Spring Boot
├── config
│   ├── CorsConfiguration.java           // CORS (разрешён origin localhost:5500)
│   ├── SecurityConfiguration.java       // цепочка фильтров Spring Security
│   ├── WebConfig.java                   // отдача аватаров как статики (/avatars/**)
│   └── WebSocketConfiguration.java      // STOMP-эндпоинт, брокер, интерсептор
├── dataBase
│   ├── Users.java                       // сущность пользователя (реализует Principal)
│   ├── UserRepository.java
│   ├── Messages.java                    // сущность сообщения (+ sent_at)
│   └── MessagesRepository.java
├── dto
│   ├── authDto
│   │   ├── AuthRequest.java             // { username, password }
│   │   └── AuthResponse.java            // sealed: Token | ErrorMessage
│   ├── messageDto
│   │   ├── MessageRequest.java          // { recipientUser, message }
│   │   ├── MessageItem.java             // { id, message, sender, sentAt }
│   │   └── MessageResponse.java         // sealed: Text | SingleMessage | MessageList
│   └── userDto
│       └── UserResponse.java            // { username, avatarUrl }
├── restControllers
│   ├── AuthController.java              // /api/user/auth/**
│   ├── MessageController.java           // /api/user/messages/**
│   ├── UserProfileController.java       // /api/user/profile/**
│   └── P2PController.java               // /handshake (заглушка)
├── security
│   ├── JwtAuthenticationFilter.java     // разбор Bearer-токена для REST
│   └── JwtUtill.java                    // генерация/валидация JWT
├── services
│   ├── AuthService.java                 // регистрация/логин
│   ├── MessageService.java             // сохранение и выборка сообщений
│   └── ProfileService.java             // профиль + загрузка/удаление аватара
└── webSocket
    ├── ChatController.java              // @MessageMapping("/chat.send")
    └── StompAuthChannelInterceptor.java // JWT-аутентификация STOMP CONNECT
```

### REST API

Базовый адрес: `http://localhost:8080`

| Метод | Путь | Аутентификация | Описание | Тело запроса | Ответ |
|-------|------|----------------|----------|--------------|-------|
| POST | `/api/user/auth/register` | нет | Регистрация | `{ "username", "password" }` | `Token { token }` или `ErrorMessage { message }` |
| POST | `/api/user/auth/login` | нет | Вход | `{ "username", "password" }` | `Token { token }` или `ErrorMessage { message }` |
| GET | `/api/user/messages/get-message-history` | JWT | История переписки текущего пользователя (входящие + исходящие, по возрастанию даты) | — | `MessageList { messages[] }` или `Text { value }` |
| GET | `/api/user/profile` | JWT | Данные профиля | — | `{ username, avatarUrl }` |
| POST | `/api/user/profile/avatar` | JWT | Загрузка аватара | `multipart/form-data`, поле `file` | `Text { value }` — полный URL аватара |
| DELETE | `/api/user/profile/avatar` | JWT | Удаление аватара | — | `Text { value }` |
| GET | `/avatars/{fileName}` | нет (публично) | Отдача файла аватара | — | бинарные данные изображения |
| GET | `/handshake?id=...` | JWT | Заглушка (пока не реализована) | — | пустая строка |

> **JWT** передаётся в заголовке `Authorization: Bearer <token>`.

**Формат ответов** реализован через sealed-интерфейсы и Java records, поэтому JSON
приходит в виде «тегированного» объекта. Например, ответ авторизации:

```json
{ "token": "eyJhbGciOiJI..." }     // успех
{ "message": "Wrong Password" }    // ошибка
```

Ответ истории сообщений:

```json
{
  "messages": [
    { "id": 1, "message": "привет", "sender": "alice", "sentAt": "2026-07-30T10:00:00Z" }
  ]
}
```

### WebSocket / STOMP

- **Endpoint подключения (SockJS):** `http://localhost:8080/websocket`
- **Префикс приложения (куда шлёт клиент):** `/app`
- **Брокер (simple broker):** `/topic`, `/queue`
- **Префикс пользовательских адресов:** `/user`

Поток сообщений:

1. Клиент открывает SockJS-соединение и отправляет STOMP-фрейм **CONNECT** с заголовком
   `Authorization: Bearer <token>`.
2. `StompAuthChannelInterceptor` перехватывает CONNECT, валидирует токен и привязывает
   к сессии `Principal` (объект `Users`). Если токена нет или он невалиден — соединение
   отклоняется.
3. Клиент **подписывается** на `/user/queue/messages`.
4. Клиент **отправляет** сообщение на `/app/chat.send` с телом
   `{ "recipientUser": "...", "message": "..." }`.
5. `ChatController` берёт отправителя из `Principal`, сохраняет сообщение через
   `MessageService` и адресно доставляет его получателю через
   `convertAndSendToUser(recipient, "/queue/messages", ...)`.

> Адресная доставка работает благодаря тому, что сущность `Users` реализует
> `java.security.Principal` и её `getName()` возвращает `username`. Именно по этому
> имени Spring находит нужную пользовательскую очередь.

### Безопасность и JWT

`SecurityConfiguration`:

- CORS включён (см. `CorsConfiguration`, разрешён origin `http://localhost:5500`);
- CSRF отключён (stateless REST + JWT);
- публичные пути: `/api/auth/**`, `/websocket/**`, `/avatars/**`;
- все остальные запросы требуют аутентификации;
- перед стандартным фильтром аутентификации встроен `JwtAuthenticationFilter`.

`JwtAuthenticationFilter` (для REST): читает заголовок `Authorization`, валидирует
Bearer-токен, по `userId` из токена загружает `Users` и помещает
`UsernamePasswordAuthenticationToken` в `SecurityContextHolder`.

`JwtUtill`: генерирует токен с полями `subject = username` и claim `userId`.
Время жизни токена — **5 минут** (`EXPIRATION_TIME = 1000 * 60 * 5`).

### Аватары

Логика в `ProfileService` + отдача статики в `WebConfig`:

- Каталог хранения задаётся свойством `app.avatar-dir` (по умолчанию
  `${user.home}/messenger-uploads/avatars`) и приводится к абсолютному нормализованному
  пути. Каталог создаётся автоматически при первой загрузке.
- Проверки при загрузке: файл не пустой, размер ≤ 8 МБ, тип — только `image/jpeg`
  или `image/png`.
- Имя файла генерируется как `UUID + расширение`, что исключает path traversal
  (дополнительно проверяется, что итоговый путь остаётся внутри каталога).
- При успешной загрузке в сущности `Users` сохраняется имя файла (`avatarUrlId`),
  а старый файл удаляется.
- Наружу отдаётся **полный URL** (строится через `ServletUriComponentsBuilder`),
  например `http://localhost:8080/avatars/9f3c...c1.jpg`.
- Файлы доступны публично по `/avatars/**` — это необходимо, потому что тег `<img>`
  в браузере не может отправлять заголовок `Authorization`.

### База данных

PostgreSQL, схема генерируется Hibernate (`spring.jpa.hibernate.ddl-auto=update`).

**`users`** (`Users`)

| Поле | Тип | Примечание |
|------|-----|------------|
| `id` | int, PK, auto | |
| `username` | string, unique, not null | |
| `hashPassword` | string, not null | пароль пользователя |
| `avatarUrlId` | string, nullable | имя файла аватара |
| `sentMessages` / `receivedMessages` | one-to-many | связи с `messages` |

**`messages`** (`Messages`)

| Поле | Тип | Примечание |
|------|-----|------------|
| `id` | int, PK, auto | |
| `sender_id` | FK → users, not null | many-to-one (lazy) |
| `recipient_id` | FK → users, not null | many-to-one (lazy) |
| `message` | string | текст сообщения |
| `sent_at` | Instant | проставляется `@CreationTimestamp`, не обновляется |

### Конфигурация

`src/main/resources/application.properties`:

```properties
spring.application.name=messenger-backend

spring.datasource.url=jdbc:postgresql://localhost:5433/database
spring.datasource.username=admin
spring.datasource.password=1234
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

spring.servlet.multipart.max-file-size=8MB
spring.servlet.multipart.max-request-size=8MB

app.avatar-dir=${user.home}/messenger-uploads/avatars
```

### Запуск backend

**Требования:** JDK 17, запущенный PostgreSQL на `localhost:5433` с БД `database`,
пользователем `admin` и паролем `1234` (или скорректируйте `application.properties`).

Быстро поднять БД можно, например, так:

```bash
docker run --name messenger-db -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=database -p 5433:5432 -d postgres
```

Запуск приложения (из папки `messenger-backend`):

```bash
# Windows
./mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

Сборка исполняемого jar:

```bash
./mvnw.cmd clean package
java -jar target/messenger-backend-0.0.1-SNAPSHOT.jar
```

По умолчанию сервер поднимается на `http://localhost:8080`.

---

## Frontend

### Технологический стек (frontend)

- **React 19** (с React Compiler)
- **Rsbuild** (`@rsbuild/core`, `@rsbuild/plugin-react`) — сборщик и dev-сервер
- **@stomp/stompjs** + **sockjs-client** — WebSocket-обмен
- **Biome** — линтер и форматтер

Dev-сервер настроен на порт **5500** (`rsbuild.config.js`), что совпадает с разрешённым
CORS-origin на backend.

### Структура проекта (frontend)

```
src
├── index.jsx                         // точка входа React
├── Messenger.jsx                     // корневой компонент интерфейса
├── assets
│   ├── style.css
│   └── img/                          // фон, placeholder аватара и т.п.
├── services
│   ├── ws-connection.js              // подключение STOMP/SockJS, хранение клиента
│   └── utils.js                      // работа с localStorage (jwt, uname), URL аватара
└── features
    ├── auth
    │   └── services
    │       ├── auth-api.js           // fetch: register / login / logout / avatar
    │       └── auth-board.js         // UI-логика панели авторизации
    ├── chat
    │   ├── components
    │   │   └── Message.jsx           // компонент отрисовки сообщений
    │   └── services
    │       ├── send-message.js       // публикация в /app/chat.send
    │       ├── subscriptions.js      // подписка на /user/queue/messages
    │       ├── get-messages.js       // REST-загрузка истории
    │       ├── render-message.js
    │       └── message-board.js
    └── navi
        └── services
            └── tabs-board.js         // переключение вкладок интерфейса
```

Ключевые детали:

- **Токен и имя пользователя** хранятся в `localStorage` (`jwt`, `uname`).
- **Подключение** (`ws-connection.js`): SockJS на `http://localhost:8080/websocket`,
  токен передаётся в `connectHeaders` STOMP-фрейма CONNECT.
- **Отправка** (`send-message.js`): публикация в `/app/chat.send`; своё сообщение
  добавляется в список оптимистично (сразу, не дожидаясь ответа сервера).
- **Приём** (`subscriptions.js`): подписка на `/user/queue/messages`, разбор
  входящего `SingleMessage`.
- **История** (`get-messages.js`): GET на `/api/user/messages/get-message-history`
  с Bearer-токеном.

### Запуск frontend

**Требования:** Node.js (LTS).

Из папки `messenger-frontend`:

```bash
npm install       # установка зависимостей
npm run dev       # dev-сервер на http://localhost:5500 (с автооткрытием)
npm run build     # production-сборка в dist/
npm run preview   # локальный предпросмотр production-сборки
npm run check     # Biome: проверка и автоисправление
npm run format    # Biome: форматирование
```

---

## Полный сценарий работы

1. Запускается PostgreSQL, затем backend (`:8080`) и frontend (`:5500`).
2. Пользователь регистрируется или входит → backend возвращает JWT →
   фронт сохраняет его в `localStorage`.
3. Фронт открывает WebSocket-соединение и передаёт JWT в STOMP CONNECT.
4. Интерсептор на backend аутентифицирует соединение и привязывает `Principal`.
5. Пользователь отправляет сообщение → оно сохраняется в БД и адресно доставляется
   получателю в реальном времени.
6. История переписки подгружается по REST; профиль и аватар управляются через
   `/api/user/profile/**`, аватар отображается по публичному URL `/avatars/**`.

---

## Текущие ограничения и TODO

Проект учебный, поэтому ряд вещей намеренно упрощён — стоит учитывать перед
использованием в проде:

- **Пароли хранятся в открытом виде** (`hashPassword` фактически равен исходному
  паролю, сравнение строкой). Нужно хеширование (например, BCrypt).
- **Секрет JWT захардкожен** в `JwtUtill` (есть комментарий «убрать от сюда») —
  вынести в конфигурацию/переменные окружения.
- **Короткое время жизни токена** — 5 минут, без механизма refresh.
- **Несоответствие путей аутентификации:** в `SecurityConfiguration` как публичный
  открыт `/api/auth/**`, тогда как контроллер авторизации находится на
  `/api/user/auth/**`. Это стоит согласовать.
- **Учётные данные БД** и адреса (`localhost:5500`, `localhost:8080`) захардкожены —
  для разных окружений лучше вынести в конфигурацию.
- **Абсолютные URL аватаров** строятся из текущего запроса, что может быть неверно
  за reverse-proxy (нужны `X-Forwarded-*` / `server.forward-headers-strategy`).
- `P2PController` (`/handshake`) — заглушка без реализации.
- Часть фронтенд-хелперов (`utils.getUserPfpUrl`, `auth-api.postUserPfpId`)
  ссылается на устаревшую схему URL аватара и не согласована с текущим контрактом
  backend (`avatarUrl` + `/avatars/**`).
