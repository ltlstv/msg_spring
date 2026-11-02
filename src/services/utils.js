const API_BASE = process.env.API_BASE_URL;

/// Profile images
export async function uploadUserPfp(selectedFile) {
  if (!selectedFile) {
    throw new Error('Choose an image first');
  }

  const formData = new FormData();
  const token = getToken();
  formData.append('file', selectedFile);

  const response = await fetch(`${API_BASE}/api/user/profile/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await getResponseError(response, 'Avatar upload failed'));
  }

  const result = await response.json();
  return result.avatarUrl ?? result.value ?? null;
}

export async function getUserPfpURL() {
  const response = await fetch(`${API_BASE}/api/user/profile`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error(await getResponseError(response, 'Could not load profile'));
  }

  const profile = await response.json();
  return profile.avatarUrl ?? null;
}

async function getResponseError(response, fallback) {
  try {
    const body = await response.json();
    return body.message ?? body.detail ?? fallback;
  } catch {
    return fallback;
  }
}
/// Profile images

export function getCurrentUname() {
  return localStorage.getItem('uname');
}

/// token
export function saveToken(token) {
  localStorage.setItem('jwt', token);
}

export function getToken() {
  return localStorage.getItem('jwt');
}

export function removeToken() {
  localStorage.setItem('jwt', null);
}
/// token

