# Wide City Smart Digital Homes

A modern, human-centered e-commerce starter for **Wide City Smart Digital Homes** selling home & kitchen appliances, computer accessories and electronics. Includes product search/filtering, cart, responsive UI and a Node/Express M-Pesa Daraja STK Push backend.

## 1. Run locally

Requirements: Node.js 18+.

```bash
npm install
cp .env.example .env
npm run dev
```

Open the Vite address shown in the terminal (normally `http://localhost:5173`).

## 2. Configure M-Pesa Daraja

Create an application in the official Safaricom Daraja developer portal. The integration uses OAuth and the M-Pesa Express/STK Push endpoint. See the official portal: https://developer.safaricom.co.ke/apis

Put your values in `.env`:

```env
DARAJA_ENV=sandbox
DARAJA_CONSUMER_KEY=...
DARAJA_CONSUMER_SECRET=...
DARAJA_SHORTCODE=174379
DARAJA_PASSKEY=...
DARAJA_CALLBACK_URL=https://YOUR_PUBLIC_DOMAIN/api/mpesa/callback
PORT=5000
```

**Never put consumer secret/passkey in React code and never commit `.env`.**

STK Push requires a publicly reachable HTTPS callback URL in a deployed environment. A successful request being accepted by Daraja is not itself proof that the customer paid; your callback should be used to record the final `ResultCode` and receipt. The backend here logs the callback and returns an acknowledgement; extend it with a database/order table before production.

## 3. Production build

```bash
npm run build
npm start
```

The Express server serves the built Vite app and API from one service.

## 4. GitHub

```bash
git init
git add .
git commit -m "Initial Wide City Smart Digital Homes store"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wide-city-smart-digital-homes.git
git push -u origin main
```

For deployment, use a Node-compatible host such as Render, Railway, Fly.io or another service that supports Node/Express and HTTPS. Set the environment variables in the host dashboard rather than uploading `.env`.

## HCI decisions used

- Recognition over recall: category chips, product labels and visible cart count.
- Visibility of system status: add-to-cart toast and payment state.
- Error prevention: Kenyan phone validation and disabled loading state.
- Consistency: repeated card/button patterns and predictable navigation.
- User control: cart quantity controls, close buttons and clear checkout flow.
- Accessibility: semantic buttons/labels, readable contrast, responsive layout and alt text.

## Product images

The demo catalog uses realistic image URLs from Unsplash. For a commercial launch, confirm the license/terms for the exact images you choose and replace demo imagery with product photos you own or have permission to use.
