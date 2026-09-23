# 🚀 5-Minute Deployment Guide

Follow these simple steps to deploy your application to production.

---

## Local Validation (Ensure it works before deploying)

Run your complete stack locally using Docker Compose to verify everything is working:

```bash
# 1. Start the complete application and database locally
docker-compose up --build -d

# 2. Verify containers are running and healthy
docker compose ps
```
The app will be running at `http://localhost:10000`. Stop it with `docker-compose down`.

---

## Option 1: Direct Blueprint Deploy on Render (Recommended)

Render can parse our `render.yaml` file to deploy your App + MongoDB instantly.

### Step 1: Push code to GitHub
Make sure all generated files are committed and pushed to your repo:
```bash
git add .
git commit -m "chore: setup docker and render configs"
git push origin main
```

### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **Blueprints** in the top navigation.
3. Click **New Blueprint Instance**.
4. Connect your GitHub Repository.
5. Render will detect the `render.yaml` file automatically.
6. Click **Approve** to deploy your App and Managed MongoDB instance instantly.

---

## Option 2: Classic Render Docker Web Service

If you prefer to use your own external MongoDB Atlas instance:

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Choose **Docker** as the Runtime environment (Render will automatically detect your multi-stage `Dockerfile`).
4. Set the following Environment Variables in the service config:
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://...` (your Atlas string)
   - `JWT_SECRET`: `[some-long-random-string]`
   - `CLIENT_URL`: `https://[your-app-name].onrender.com`
5. Click **Deploy Web Service**.

---

## CI/CD Deployment Trigger (Optional)
To enable automatic deployments whenever code is pushed to `main`:
1. Go to your Web Service in Render -> **Settings**.
2. Copy the **Deploy Hook** URL.
3. In GitHub, go to your repository -> **Settings** -> **Secrets and variables** -> **Actions**.
4. Create a new secret named `RENDER_DEPLOY_HOOK_URL` and paste your hook URL.