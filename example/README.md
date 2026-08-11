# Polished React Structure Example

This directory is a standalone organization example based on the current app. It does not import or modify the original `src` files.

The main idea is to keep responsibilities separate:

- `app/` composes the application shell.
- `features/*/components/` contains React UI.
- `features/*/api/` contains HTTP calls only.
- `features/*/hooks/` contains feature state and side effects.
- `features/chat/realtime/` contains WebSocket/STOMP setup.
- `shared/` contains small cross-feature helpers.

Example tree:

```text
example/
  app/
    App.jsx
    app.css
  features/
    auth/
      api/authApi.js
      components/AuthPanel.jsx
      hooks/useAuth.js
    chat/
      api/messagesApi.js
      components/ChatPanel.jsx
      components/MessageComposer.jsx
      components/MessageList.jsx
      hooks/useMessages.js
      realtime/chatSocket.js
    navigation/
      components/Tabs.jsx
  shared/
    api/config.js
    storage/authStorage.js
```

To adopt this in the real app, move one feature at a time. Start with tabs and message rendering because those are currently split between React and manual DOM code.
