# WindView — UK Wind Generation Procurement Dashboard

> Built with Claude AI assistance (noted per requirements).

## Overview
WindView helps UK electricity traders understand wind generation forecasts
and evaluate forecast accuracy — enabling better day-ahead market purchase decisions.

**Data source:** Elexon BMRS live stream (FUELHH actuals + WINDFOR forecasts)

**Note:** The Elexon BMRS streaming endpoints return current settlement day data
only. Date range selection is not supported by the upstream API.

---

## Tech Stack
| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, TypeScript, Tailwind CSS  |
| Build     | Bun + Vite                          |
| Backend   | Python 3.12, FastAPI, httpx         |
| Container | Docker + nginx                      |
| Deploy    | Vercel (frontend), Render (backend) |

---

## Quick Start (Docker — recommended)

```bash
git clone https://github.com/YOUR_USERNAME/REPO_NAME
cd WindScope

docker compose up --build
```

Open http://localhost

---

## Local Development

### Backend
```bash
cd backend
python3.12 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
bun install
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
bun run dev
```

---

## API Endpoints

| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | /api/v1/health         | Health check                         |
| GET    | /api/v1/actuals        | FUELHH wind actuals (live)           |
| GET    | /api/v1/forecasts/latest | WINDFOR latest forecasts (live)    |
| GET    | /api/v1/accuracy       | MAE, RMSE, MAPE, Bias metrics        |

Swagger UI: http://localhost:8000/docs

---

## Live App
- **Frontend:** https://YOUR_APP.vercel.app
- **Backend API:** https://YOUR_APP.onrender.com

---

## AI Tools Used
Claude (Anthropic) was used to assist with:
- FastAPI service architecture
- React component structure
- Elexon API integration debugging
- Docker configuration