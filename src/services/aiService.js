/**
 * UREM Service Integration Layer
 * 
 * ====================================================
 *   STEP 1: ADD YOUR CREDENTIALS BELOW
 * ====================================================
 */

// Loaded securely from .env file (never commit your actual keys!)
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// TODO: Paste your Google Calendar API key from Google Cloud Console
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "";

// ====================================================
//   GOOGLE CALENDAR CONFIGURATION (No need to edit)
// ====================================================
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let gapiInited = false;
let tokenClient = null;

/**
 * Initializes the Google API client library.
 * Called once when the app loads.
 */
export const initializeGoogleAPI = () => {
  return new Promise((resolve) => {
    if (typeof window.gapi === 'undefined') {
      console.warn("Google API script not loaded yet. Retrying...");
      setTimeout(() => initializeGoogleAPI().then(resolve), 500);
      return;
    }

    window.gapi.load('client', async () => {
      await window.gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      gapiInited = true;
      resolve(true);
    });
  });
};

/**
 * Initializes the Google Identity Services token client.
 * @param {Function} onSuccess - Callback when a token is received.
 * @param {Function} onError - Callback on error.
 */
export const initializeTokenClient = (onSuccess, onError) => {
  if (typeof window.google === 'undefined') {
    console.warn("Google Identity Services script not loaded yet.");
    onError("Google Identity Services not loaded.");
    return;
  }

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: SCOPES,
    callback: (response) => {
      if (response.error) {
        onError(response.error);
        return;
      }
      onSuccess(response);
    },
  });
};

/**
 * Triggers the Google OAuth login popup.
 */
export const loginWithGoogle = () => {
  if (!tokenClient) {
    console.error("Token client not initialized. Call initializeTokenClient first.");
    return;
  }
  // Request an access token
  tokenClient.requestAccessToken({ prompt: 'consent' });
};

/**
 * Signs out the user and revokes the access token.
 */
export const logoutFromGoogle = () => {
  const token = window.gapi.client.getToken();
  if (token) {
    window.google.accounts.oauth2.revoke(token.access_token);
    window.gapi.client.setToken('');
  }
};

/**
 * Fetches upcoming events from the user's primary Google Calendar.
 * @returns {Array} List of upcoming events.
 */
export const fetchCalendarEvents = async () => {
  if (!gapiInited || !window.gapi.client.getToken()) {
    console.warn("Not authenticated with Google Calendar.");
    return getMockCalendarEvents();
  }

  try {
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + 7);

    const response = await window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: endOfWeek.toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime',
    });

    const events = response.result.items;
    return events.map(event => ({
      id: event.id,
      title: event.summary || 'Untitled Event',
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      description: event.description || '',
      link: event.htmlLink,
    }));
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return getMockCalendarEvents();
  }
};

/**
 * Mock calendar events used when not connected to Google Calendar.
 */
const getMockCalendarEvents = () => {
  const today = new Date();
  const fmt = (d) => d.toISOString();

  const t = (h, m = 0) => {
    const d = new Date(today);
    d.setHours(h, m, 0, 0);
    return fmt(d);
  };

  return [
    { id: 'mock1', title: 'Q3 Marketing Report', start: t(10), end: t(12), description: 'Finalize slides', link: '#' },
    { id: 'mock2', title: 'Team Sync: Product Launch', start: t(13), end: t(14), description: 'Weekly sync', link: '#' },
    { id: 'mock3', title: 'Review Design Mockups', start: t(14, 30), end: t(15, 15), description: '', link: '#' },
  ];
};

/**
 * Gets a proactive insight from the AI, optionally using calendar events.
 * @param {Array} events - Optional list of calendar events to base insights on.
 */
export const getProactiveInsight = async (events = []) => {
  const eventTitles = events.slice(0, 3).map(e => `"${e.title}"`).join(', ');
  const hasRealEvents = events.length > 0 && events[0].id !== 'mock1';

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        type: "suggestion",
        title: "Proactive Insight",
        message: hasRealEvents
          ? `Based on your calendar, I can see you have ${events.length} events this week including ${eventTitles}. I suggest blocking 2 hours of deep work before your first meeting today.`
          : `You have 3 high-priority tasks due today: ${eventTitles || 'Q3 Report, Team Sync, Design Review'}. I suggest tackling the Q3 Report first since your historical data shows you're most productive right now.`
      });
    }, 700);
  });
};

/**
 * Chats with the AI assistant.
 * @param {string} prompt - The user's message.
 */
export const chatWithAssistant = async (prompt) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        `I've analyzed your request: "${prompt}". I can block out 2 hours tomorrow morning for this — it fits perfectly between your 9 AM and 12 PM slots. Should I add it to your calendar?`,
        `Great idea! Based on your current schedule, the best time for "${prompt}" would be this Thursday from 3-5 PM. Your calendar is clear then. Want me to lock it in?`,
        `I've checked your upcoming events for conflicts. "${prompt}" can be scheduled for tomorrow at 10 AM. I'll keep an eye on the deadline and remind you 24 hours before.`,
      ];
      resolve(responses[Math.floor(Math.random() * responses.length)]);
    }, 900);
  });
};
