# Deploy to Render

This portfolio is set up for **Docker** deploys on Render (`Dockerfile` + `render.yaml`, Next.js `output: "standalone"`).

## 1. Push your code to GitHub

```bash
git add .
git commit -m "Prepare portfolio for Render deploy"
git push origin main
```

## 2. Create the Render web service

1. Open [https://dashboard.render.com](https://dashboard.render.com)
2. **New +** → **Web Service**
3. Connect the GitHub repo `akshad_vengurlekar_portfolio`
4. Choose **Docker** (Render will detect the Dockerfile)
5. Pick a region close to you (e.g. Singapore)
6. Create the service

Or use Blueprint: **New +** → **Blueprint** → select the repo (uses `render.yaml`).

## 3. Set environment variables

In Render → your service → **Environment**, set:

| Key | Value |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-SERVICE.onrender.com` |
| `AUTH_URL` | Same as `NEXT_PUBLIC_SITE_URL` |
| `AUTH_TRUST_HOST` | `true` |
| `AUTH_SECRET` | Long random string (or use Render Generate) |
| `ADMIN_EMAIL` | Your admin login email |
| `ADMIN_PASSWORD` | Strong admin password |
| `RESEND_API_KEY` | Your Resend API key |
| `CONTACT_TO_EMAIL` | `jagrutivengurlekar@gmail.com` |
| `RESEND_FROM_EMAIL` | Optional verified sender; otherwise Resend default is used |

## 4. MongoDB Atlas

1. Allow Render IPs (or `0.0.0.0/0` for Atlas Network Access if you accept that risk)
2. Use a database user with read/write access
3. Paste the URI into `MONGODB_URI`

After first deploy, seed content if needed (local or one-off job):

```bash
npm run seed
```

(Only against the production URI if you intend to seed production.)

## 5. Deploy

Push to `main` (with auto-deploy on) or click **Manual Deploy**.

Health check path: `/`

## 6. After go-live

1. Open `https://YOUR-SERVICE.onrender.com`
2. Test `/contact` form email delivery
3. Sign in at `/admin/login`
4. Confirm projects/skills load from Mongo

## Notes

- Free Render instances **spin down** after idle time; the first request can be slow.
- Keep `.env` out of git (already gitignored).
- Rotate any API keys that were shared in chat.
