// Google Sheets Configuration
// Each feature uses a SEPARATE Google Sheet (not tabs, actual different spreadsheets)

export const GOOGLE_SHEETS_CONFIG = {
  // Your Google Cloud API Key (same key works for all sheets)
  API_KEY: 'AIzaSyDNRDQtA8ZqEU_FRYvuS7_MSIel28xJHt0', // Fill this with your API key from Google Cloud Console

  // Shared password for all users
  SHARED_PASSWORD: 'loyola2003',

  // Individual Sheet Configurations
  SHEETS: {
    // Sheet 1: Authorized Users (for login authentication)
    AUTH: {
      SPREADSHEET_ID: '1MHo8-VQlZOmRuf4S_HnbpXWE6mqRmGhEshfwVWooiCU', // Fill with your AuthorizedUsers sheet ID
      SHEET_NAME: 'Sheet1',
      RANGE: 'Sheet1!A:D', // Columns: Email, Name, Status, Class
    },

    // Sheet 2: Members Directory
    MEMBERS: {
      SPREADSHEET_ID: '1P19_AFU5mnRaVa_SOuS2PytOToYPJ8OjQfcu2wg9PCA', // Fill with your Members sheet ID
      SHEET_NAME: 'Sheet1',
      RANGE: 'Sheet1!A:G', // Columns: Name, Email, Phone, Work, Birthday, Class, City
    },

    // Sheet 3: Executive Council
    EXECUTIVES: {
      SPREADSHEET_ID: '1gP5MGodKcj6sC--S7DE9j1EeGvmJ4rizFTug-COXFjE', // Fill with your Executives sheet ID
      SHEET_NAME: 'Sheet1',
      RANGE: 'Sheet1!A:K', // Columns: Name, Position, Bio, ImageURL, Email, Phone, LinkedIn, Twitter, IsPresident, Order, Status
    },

    // Sheet 4: News & Announcements
    NEWS: {
      SPREADSHEET_ID: '1hyIkhUqFN1dmyH5Q1jslh_RZDLz8mbrp3A6ck0h2meE', // Fill with your News sheet ID
      SHEET_NAME: 'Sheet1',
      RANGE: 'Sheet1!A:I', // Columns: ID, Title, Excerpt, Content, Category, Author, Date, ImageURL, IsFeatured
    },

    // Sheet 5: Job Board (linked to Google Form)
    JOBS: {
      SPREADSHEET_ID: '1Wcnn11phKI_NfNG8OfwZEjywxLuTHF6QpLhseZoLEos',
      SHEET_NAME: 'Form Responses 1',
      RANGE: 'Form Responses 1!A:L', // Columns: Timestamp, Title, Company, Description, Requirements, Type, Location, Salary, ApplyURL, PostedBy, Email, Status
    },

    // Sheet 6: Support Requests (linked to Google Form)
    SUPPORT_REQUESTS: {
      SPREADSHEET_ID: '1U21zgSv_T6DaTdl8rcOaGEOMIRtonOme5jqVqzX76iA',
      SHEET_NAME: 'Form Responses 1',
      RANGE: 'Form Responses 1!A:H', // Columns: Timestamp, Title, Description, Category, Amount, RequestedBy, RequestedByEmail, Status
    },

    // Sheet 7: Votes (for support request voting with comments & pledges)
    VOTES: {
      SPREADSHEET_ID: '1cKYrNwYGs1xsO1jyRsVPMPaT82sSFBp4zRT4toGy8ys', // Fill with your Votes sheet ID
      SHEET_NAME: 'Sheet1',
      RANGE: 'Sheet1!A:F', // Columns: SupportRequestID, UserEmail, UserName, Comment, PledgeAmount, VoteTimestamp
    },
  },

  // Google Form URLs (optional - for submitting new entries)
  FORMS: {
    SUPPORT_REQUEST: 'https://forms.gle/z6xdhrFkfhytmJz59', // Google Form URL for requesting support
    POST_JOB: 'https://forms.gle/GpPr3zrQE6MDPR8u8', // Google Form URL for posting jobs
  },

  // Google Apps Script URLs (for write operations that require authentication)
  // Deploy your Apps Script as a web app and paste the URL here
  APPS_SCRIPT: {
    VOTES_URL: 'https://script.google.com/macros/s/AKfycbwJcfp30n98UcIedF-RxfkKdVpKEYla2WQCNKJU4R2EIX9G1CP_mN_1T93ULyznBCSs/exec', // Paste your deployed Apps Script URL here (e.g., https://script.google.com/macros/s/AKfycbx.../exec)
  },
};

// Helper to check if configuration is complete
export const isConfigured = () => {
  const { API_KEY, SHEETS } = GOOGLE_SHEETS_CONFIG;
  return (
    API_KEY &&
    SHEETS.AUTH.SPREADSHEET_ID &&
    SHEETS.MEMBERS.SPREADSHEET_ID &&
    SHEETS.EXECUTIVES.SPREADSHEET_ID &&
    SHEETS.NEWS.SPREADSHEET_ID &&
    SHEETS.JOBS.SPREADSHEET_ID &&
    SHEETS.SUPPORT_REQUESTS.SPREADSHEET_ID &&
    SHEETS.VOTES.SPREADSHEET_ID
  );
};

export default GOOGLE_SHEETS_CONFIG;
