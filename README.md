# UREM — Productivity Companion

> **UREM** is an AI-powered personal productivity companion built with React and Vite. It helps you manage tasks, visualize goals, analyze productivity habits, and schedule your week — all in a premium, customizable dark-mode interface.

---

## ✨ Features

### 🧠 AI Assistant
- A built-in conversational UREM Assistant widget on the Dashboard.
- Provides **proactive insights** based on your schedule — e.g., suggesting deep-work blocks before high-priority meetings.
- Supports **live chat** for scheduling help and task suggestions.
- Automatically adapts messages based on whether Google Calendar is connected.

### 📅 Google Calendar Integration
- Connect your Google account via **OAuth 2.0** directly from the sidebar.
- Fetches real upcoming events from your **Google Calendar API** (read-only scope).
- Falls back to smart mock events when not connected, keeping the interface fully functional.
- Displays live connection status with a pulsing indicator in the sidebar.

### 📊 Dashboard
- Time-aware greeting (Good Morning / Afternoon / Evening).
- **Priority Queue** of tasks, AI-sorted by importance.
- **Productivity Score** displayed as an animated circular progress ring.
- **"Up Next"** timeline of upcoming scheduled events.
- Reusable `TaskCard` components with priority, category, and status labels.

### 📅 Schedule Page
- Weekly schedule view with calendar integration support.

### 🎯 Goals Page
- Track long-term goals and milestones.

### 📈 Analytics Page
- Visualize productivity trends and habit data.
- AI-generated recommendations based on your logged activity.

### 🎨 Customizable Theme System
- **5 built-in themes**: Dark, Light, Ocean, Forest, Sunset.
- **Custom theme builder** — choose any combination of:
  - Background color
  - Primary text color
  - Primary, secondary, and accent highlight colors
- Theme selector is embedded **directly in the sidebar** as a collapsible widget.
  - Click the 🎨 **Theme Settings** panel header to expand it.
  - Click any **preset color dot** to instantly switch the global theme.
  - Select the **Custom** dot to reveal fine-grained color pickers.
- Themes are **persisted in `localStorage`** — your choice survives page refreshes.
- Smooth **CSS transitions** across all UI elements when switching themes.
- Color system uses **dynamic CSS custom properties** (`var(--accent-primary)`, etc.) injected at the `:root` level.

### 📱 Fully Responsive & Mobile-Friendly
- Desktop: Persistent sidebar with full navigation.
- Mobile (`< 768px`): Off-canvas **hamburger drawer** sidebar.
  - Mobile header with a toggle button appears automatically.
  - Sidebar slides in/out smoothly; tapping a nav link auto-closes it.
- Layouts stack vertically on small screens for comfortable reading.

---

## 🗂️ Project Structure

```
UREM-VIBE2SHIP/
├── index.html                    # App entry point (loads Google API scripts)
├── src/
│   ├── App.jsx                   # Router setup + ThemeProvider wrapper
│   ├── main.jsx                  # React DOM mount point
│   ├── index.css                 # Global CSS variables, design tokens, utilities
│   ├── components/
│   │   ├── Layout.jsx            # App shell — sidebar + main content + mobile header
│   │   ├── Layout.css
│   │   ├── Sidebar.jsx           # Navigation, calendar connect, theme customizer
│   │   ├── Sidebar.css
│   │   ├── ThemeContext.jsx      # Theme state, localStorage persistence, CSS variable injection
│   │   ├── AIAssistantWidget.jsx # Chat interface + proactive insights panel
│   │   ├── AIAssistantWidget.css
│   │   ├── TaskCard.jsx          # Reusable task card component
│   │   └── TaskCard.css
│   ├── pages/
│   │   ├── DashboardPage.jsx     # Main dashboard view
│   │   ├── DashboardPage.css
│   │   ├── SchedulePage.jsx      # Weekly schedule
│   │   ├── GoalsPage.jsx         # Goals tracker
│   │   ├── AnalyticsPage.jsx     # Analytics + AI recommendations
│   │   └── PageStyles.css        # Shared page-level styles
│   └── services/
│       └── aiService.js          # Google Calendar API, OAuth, AI response logic
├── .env                          # 🔒 Secret credentials (NOT committed to git)
├── .env.example                  # Template for environment variables
├── .gitignore                    # Excludes .env and node_modules
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- A Google Cloud account (for Calendar integration — optional)

### 1. Clone the repository

```bash
git clone https://github.com/NireekshaAP07/UREM-VIBE2SHIP.git
cd UREM-VIBE2SHIP
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then open `.env` and fill in your credentials:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

> **Note:** The app works fully without these credentials using mock data. Calendar integration becomes live once valid keys are provided.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Google Calendar Setup (Optional)

To enable live Google Calendar sync:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or use an existing one).
3. Enable the **Google Calendar API**.
4. Under **Credentials**, create:
   - An **OAuth 2.0 Client ID** (Web application type) → set your authorized origin to `http://localhost:5173`.
   - An **API Key** → restrict it to the Calendar API and your domain.
5. Paste the values into your `.env` file.
6. In the app sidebar, click **"Connect Google Calendar"** to authorize.

> ⚠️ **Security:** Never commit your `.env` file. It is excluded from version control via `.gitignore`.

---

## 🎨 Theme Customization

UREM ships with a built-in theme engine accessible from the sidebar:

| Theme | Description |
|-------|-------------|
| 🌑 Dark Mode | Default dark indigo/purple palette |
| ☀️ Light Mode | Clean white and slate palette |
| 🌊 Ocean Theme | Deep teal and cyan blues |
| 🌿 Forest Theme | Dark greens and emerald accents |
| 🌅 Sunset Theme | Warm rose and coral tones |
| 🎨 Custom Theme | Your own color combination |

**How to change the theme:**
1. In the sidebar, click the **🎨 Theme Settings** header to expand the panel.
2. Click any **colored dot** to preview and apply a preset instantly.
3. Click the **Custom** dot to reveal fine-grained color pickers (Background, Text, Primary, Secondary, Accent).
4. Your selected theme is automatically saved and will persist after refreshing the page.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI component framework |
| **Vite 8** | Development server and build tool |
| **React Router DOM 7** | Client-side routing |
| **Vanilla CSS** | Styling with CSS custom properties |
| **Google Calendar API v3** | Calendar event fetching |
| **Google Identity Services** | OAuth 2.0 authentication |

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server at `localhost:5173` |
| `npm run build` | Build the production bundle to `dist/` |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Lint the codebase with OxLint |

---

## 🔒 Security

- All API credentials are stored in `.env` (excluded from Git via `.gitignore`).
- The `.env.example` file acts as a safe template with no real secrets.
- Google API keys should have **HTTP referrer restrictions** set in Google Cloud Console.
- OAuth scopes are limited to **read-only** Calendar access (`calendar.readonly`).

---

## 📄 License

This project is for personal and educational use. Feel free to fork and customize!

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/NireekshaAP07">NireekshaAP07</a>
</div>
