# EcoPulse AI - Track Your Carbon. Build a Greener Tomorrow.

EcoPulse AI is a premium, startup-level SaaS product designed to help individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

## 1. Problem Statement
Climate change is a pressing global issue, yet many individuals find it difficult to understand their personal impact or know what actionable steps to take. EcoPulse AI bridges this gap by providing an intuitive, gamified platform for tracking daily emissions and offering AI-driven recommendations to foster sustainable habits.

## 2. Features
- **Carbon Footprint Calculator**: Track emissions from transport, energy, food, waste, and water.
- **Glassmorphism UI**: A highly polished, modern interface with micro-interactions and animations.
- **AI Recommendation Engine**: Powered by Gemini 1.5 Pro to provide highly personalized, dynamic recommendations based on actual user data.
- **Sustainability Score & Eco Levels**: Gamified experience to encourage continued engagement (Seed -> Forest Guardian).
- **Interactive Analytics**: Visual breakdowns of emissions using Chart.js.
- **Single Page Application**: Seamless transitions between views without page reloads using Vanilla JS.

## 3. Tech Stack
- **Frontend**: HTML5, CSS3 (Glassmorphism, CSS Variables), Vanilla JavaScript, Chart.js, Font Awesome.
- **Backend**: Flask, Flask-SQLAlchemy, Flask-Login, Flask-Bcrypt.
- **AI Integration**: Google Generative AI (Gemini).
- **Database**: SQLite (Local Dev) / Supabase PostgreSQL (Production).

## 4. Architecture
The application uses a modular Flask backend providing a RESTful API. The frontend is a Single HTML Page (`index.html`) that uses Vanilla JavaScript (`main.js`, `api.js`) to interact with the API, updating the DOM dynamically to create a seamless Single Page Application (SPA) experience.

## 5. Installation
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ecopulse-ai.git
cd ecopulse-ai

# 2. Create a virtual environment
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Environment Variables
# Copy .env.example to .env and add your Gemini API Key and DB URL
cp .env.example .env

# 5. Run the application
python app.py
```
Open `http://localhost:5000` in your browser.

## 6. Deployment (Render)
1. Push your code to GitHub.
2. Create a new Web Service on Render and connect your repository.
3. Render will automatically detect the `render.yaml` configuration file.
4. Add the required Environment Variables in the Render dashboard (`DATABASE_URL`, `GEMINI_API_KEY`, etc.).

## 7. API Endpoints
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate user.
- `POST /api/auth/logout`: Logout user.
- `GET /api/auth/me`: Get current authenticated user session.
- `POST /api/calculate`: Calculate and save a new carbon footprint record.
- `GET /api/dashboard`: Fetch latest records, score, and goals.
- `GET /api/recommendations`: Get AI generated personalized tips.

## 8. Future Scope
- **Social Leaderboards**: Compete with friends and local community members.
- **Strava/Google Fit Integration**: Automatically track transport (walking, cycling).
- **Smart Home Integration**: Pull data directly from smart meters.
- **PDF Report Export**: Downloadable monthly sustainability reports.

## 9. Assumptions
- For calculation purposes, rough conversion factors were used for CO2 mapping (e.g., 0.2 kg CO2 per km for transport).
- The Gemini API key is required for dynamic recommendations; if missing, fallbacks are provided.

## 10. Screenshots
*(Add screenshots of the Landing Page, Dashboard, and Calculator here)*
