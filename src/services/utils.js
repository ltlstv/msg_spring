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

export function removeToken() {
  localStorage.setItem('jwt', null);
}

export function signRequest(keyPair, payload) {
  return window.crypto.subtle.sign({
    name: 'RSA-PSS',
    saltLength: 32,
  },
  keyPair.privateKey,
  new TextEncoder().encode(payload),
);
}

export function verifyRequest(keyPair, payload, signature) {
  return window.crypto.subtle.verify({
    name: 'RSA-PSS',
    saltLength: 32,
  },
  keyPair.publicKey,
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

export async function protectIdentity(key,password) {
  
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
    privateKey: processBuffer(encryptedKey),
    salt: salt,
    iv: iv,
  };
}