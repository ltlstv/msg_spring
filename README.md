# Basic Messaging Application (DataChan)
## preA (centralized messages storage)
- Frontend: *NodeJS v22.23.3 React (built with Rsbuild v2.1.6)*
- Backend: *Spring-boot v4.0.1 (built with Apache Maven v4.0.0)*

---

## How to compose?
### Step 1: obtain SSL certificates

App will read from *./ssl/fullchain.pem* and *./ssl/privkey.pem.* There are **two** ways to generate the keys:

1. **use [mkcert](github.com/FiloSottile/mkcert)** like in example where *example.com* is your prefered domain:

`mkcert -key-file ./ssl/privkey.pem -cert-file ssl/fullchain.pem example.com *.example.com`

don't forget to change your **hosts** file to use domain on local machine (usually *127.0.0.1 example.com*)

2. **use certbot**

it's preconfigured in docker-compose.yaml. Startup the container with that command (change credentials and domain):

`docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d example.com --email your@email.com --agree-tos --no-eff-email`

move keys from *./certbot/conf/live/example.com* to *./ssl/*

### Step 2: docker compose

`docker compose up`

Five containers created, four running:

- **postgres**: postgres:18
- **msg-relay**: eclipse-temurin:21-jre 
- **msg-front**: node:22-alpine3.23
- **nginx**: nginx:alpine
- *certbot*: certbot/certbot