const API_BASE = process.env.API_BASE_URL;

export async function getUserPfpUrl(username) {
  const data = await postUserPfpId(username);

  return `${API_BASE_URL}/src/assets/pfp/` + data.imgId + '.jpg';
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

export function removeToken() {
  localStorage.setItem('jwt', null);
}

export async function signRequest(privateKey, payload) {
  return window.crypto.subtle.sign({
    name: 'RSA-PSS',
    saltLength: 32,
  },
  privateKey,
  new TextEncoder().encode(payload),
);
}

export async function verifyRequest(publicKey, payload, signature) {
  return window.crypto.subtle.verify({
    name: 'RSA-PSS',
    saltLength: 32,
  },
  publicKey,
  signature,
  new TextEncoder().encode(payload)
)
}

export async function createIdentity() {
  return window.crypto.subtle.generateKey(
    {
      name: 'RSA-PSS',
      modulusLength: 3072,
      publicExponent: new Uint8Array([1,0,1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  );
}

export async function checkIdentity(keyPair){
  const privateBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  const publicBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  return {
    privateKey: processBuffer(privateBuffer),
    publicKey: processBuffer(publicBuffer),
  }
}

export function processBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (let i=0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return window.btoa(binary);
}

export function bufferFromBase64(base64) {
  const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}

export async function deriveProtectionKey_AES(password, salt){
  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 600_000,
      hash: "SHA-256",
    },
    passwordKey,
    {
      name: "AES-GCM",
      length: 256,      
    },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function toProtectIdentity(key,password) {
  
  const salt = window.crypto.getRandomValues(new Uint8Array(16));

  const aesKey = await deriveProtectionKey_AES(password, salt);

  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const keyBuffer = await crypto.subtle.exportKey("pkcs8", key);

  const encryptedKey = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv
        },
        aesKey,
        keyBuffer
    );

  return {
    privateKey: encryptedKey,
    salt: salt,
    iv: iv,
  };
}

export async function toExposeIdentity(protectedIdentity,password) {

  const encryptedKey = protectedIdentity.privateKey;
  const salt = protectedIdentity.salt;
  const iv = protectedIdentity.iv;
  const aesKey = await deriveProtectionKey_AES(password,salt);

  const keyBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    aesKey,
    encryptedKey
  );

  const privateKey = await importPrivateKey(keyBuffer);

  return privateKey;

}

export async function importPrivateKey(keyBuffer){
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBuffer,
    {
      name: "RSA-PSS",
      hash: "SHA-256"
    },
    false,
    ["sign"]
  );

  return privateKey;
}

export async function importPublicKey(keyBuffer){
  const publicKey = await crypto.subtle.importKey(
    "spki",
    keyBuffer,
    {
      name: "RSA-PSS",
      hash: "SHA-256"
    },
    false,
    ["verify"]
  )
  
  return publicKey;
}

