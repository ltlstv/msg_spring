export async function getUserPfpUrl(username) {
  const data = await postUserPfpId(username);

  return 'http://localhost:8080/src/assets/pfp/' + data.imgId + '.jpg';
}

export function getCurrentUname() {
  return localStorage.getItem('uname');
}

export function saveToken(token) {
  localStorage.setItem('jwt', token);
}

export function getToken() {
  return localStorage.getItem('jwt');
}
