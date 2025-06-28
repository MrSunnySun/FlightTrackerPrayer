# Flight Prayer Times

Calculate prayer times based on flight departure location using AviationStack API.

## Setup

1. Clone this repo
2. Run `npm install`
3. Copy `.env.example` to `.env` and add your AviationStack key
4. Start server: `npm start`
5. POST `{"flightCode":"EK202"}` to `http://localhost:3001/api/prayer-times`

## Deploy to Replit

1. Import this GitHub repo into Replit
2. Add secret `AVIATIONSTACK_API_KEY`
3. Click **Run** and get your project link
