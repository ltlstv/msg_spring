import { useState } from 'react';

export function AuthPanel({ auth, className = '' }) {
  const [username, setUsername] = useState(auth.user?.username ?? '');
  const [password, setPassword] = useState('');

  function getCredentials() {
    return {
      username: username.trim(),
      password: password.trim(),
    };
  }

  if (auth.user) {
    return (
      <section className={`app-window ${className}`}>
        <header className="app-window__header">Authorization</header>
        <div className="app-window__body">
          <strong>{auth.user.username}</strong>
          <button type="button" onClick={auth.logout}>
            Logout
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={`app-window ${className}`}>
      <header className="app-window__header">Authorization</header>
      <form
        className="app-window__body"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="field">
          <span>Username</span>
          <input
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            autoComplete="current-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {auth.error ? <p role="alert">{auth.error}</p> : null}

        <div className="button-row">
          <button
            type="button"
            disabled={auth.isPending}
            onClick={() => auth.login(getCredentials())}
          >
            Login
          </button>
          <button
            type="button"
            disabled={auth.isPending}
            onClick={() => auth.register(getCredentials())}
          >
            Register
          </button>
        </div>
      </form>
    </section>
  );
}
