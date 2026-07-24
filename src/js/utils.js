export async function getUserPfpUrl(username) {
  const data = await postUserPfpId(username);

  return 'http://localhost:8080/src/assets/pfp/' + data.imgId + '.jpg';
}

