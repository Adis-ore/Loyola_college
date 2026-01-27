# Google Sheets Setup Guide for Loyola Alumni Portal

This guide explains how to set up 7 separate Google Sheets for the Loyola Alumni Portal.

---

## Quick Setup Steps

### 1. Google Cloud Console Setup (One Time)

1. Go to: https://console.cloud.google.com/
2. Create a new project: "Loyola Alumni Portal"
3. Enable the **Google Sheets API**:
   - Go to APIs & Services > Library
   - Search for "Google Sheets API"
   - Click Enable
4. Create API Key:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "API Key"
   - Copy the API Key (you'll use the same key for all sheets)
   - (Optional) Restrict the key to Google Sheets API only

### 2. Create 7 Google Sheets

Create each sheet individually and share it publicly:

---

## Sheet Structures

### SHEET 1: Loyola_AuthorizedUsers

**Purpose:** Login authentication - stores authorized users

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Email | Name | Status | Class |
| john@example.com | John Adeyemi | Active | Science |
| mary@example.com | Mary Okonkwo | Active | Arts |
| david@example.com | David Nnamdi | Inactive | Commercial |

**Notes:**
- First row is headers
- Status: "Active" or "Inactive" (only Active users can login)
- Class: "Science", "Arts", or "Commercial"

---

### SHEET 2:  

**Purpose:** Member directory data

| Column A | Column B | Column C | Column D | Column E | Column F | Column G |
|----------|----------|----------|----------|----------|----------|----------|
| Name | Email | Phone | Work | Birthday | Class | City |
| John Adeyemi | john@example.com | +234 801 234 5678 | Software Engineer | March 15 | Science | Lagos |
| Mary Okonkwo | mary@example.com | +234 802 345 6789 | Doctor | July 22 | Science | Abuja |
| David Nnamdi | david@example.com | +234 803 456 7890 | Lawyer | January 8 | Arts | Port Harcourt |

**Notes:**
- First row is headers
- Birthday: Month and day only (e.g., "March 15")
- Class: "Science", "Arts", or "Commercial"

---

### SHEET 3: Loyola_Executives

**Purpose:** Executive council members

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I | Column J | Column K |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| Name | Position | Bio | ImageURL | Email | Phone | | Twitter | IsPresident | Order | Status |
| Chief Emeka Okonkwo | President | A seasoned business leader... | https://... | president@loyola.com | +234 801 000 0001 | https://linkedin.com/in/... | https://twitter.com/... | TRUE | 1 | Active |
| Mrs. Funke Adeyemi | Vice President | An accomplished doctor... | https://... | vp@loyola.com | +234 801 000 0002 | https://linkedin.com/in/... | https://twitter.com/... | FALSE | 2 | Active |

**Notes:**
- First row is headers
- IsPresident: "TRUE" for president, "FALSE" for others (only one should be TRUE)
- Order: Number for display order (1, 2, 3...)
- Status: "Active" or "Inactive"
- ImageURL: Direct link to image (use Google Drive or Imgur)
- LinkedIn/Twitter: Use "#" if not available

---

### SHEET 4: Loyola_News

**Purpose:** News and announcements

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| ID | Title | Excerpt | Content | Category | Author | Date | ImageURL | IsFeatured |
| 1 | Annual Reunion 2024 | Mark your calendars... | We are excited to announce... | Events | Executive Committee | 2024-01-15 | https://... | TRUE |
| 2 | New Council Elected | Congratulations... | The election results are in... | Announcement | Electoral Committee | 2024-01-12 | | FALSE |

**Notes:**
- First row is headers
- ID: Unique identifier (1, 2, 3...)
- Category: "Events", "Announcement", "Achievement", or "Spotlight"
- Date: YYYY-MM-DD format
- IsFeatured: "TRUE" or "FALSE"
- ImageURL: Optional, leave empty if no image

---

### SHEET 5: Loyola_Jobs

**Purpose:** Job board listings

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I | Column J | Column K | Column L |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| ID | Title | Company | Description | Requirements | Type | Location | Salary | PostedBy | PostedDate | ApplyURL | Status |
| 1 | Senior Software Engineer | Tech Solutions Ltd | We are looking for... | 5+ years experience, React/Node.js, Cloud platforms | Full-time | Lagos, Nigeria | ₦800,000 - ₦1,200,000/month | John A. | 2024-01-15 | https://apply.example.com | Active |
| 2 | Marketing Manager | Global Brands Inc | Lead our marketing team... | MBA preferred, 7+ years marketing | Full-time | Abuja, Nigeria | ₦500,000 - ₦700,000/month | Mary O. | 2024-01-14 | https://careers.example.com | Active |

**Notes:**
- First row is headers
- ID: Unique identifier
- Requirements: Comma-separated list (e.g., "5+ years, React, Node.js")
- Type: "Full-time", "Contract", "Remote", or "Part-time"
- PostedDate: YYYY-MM-DD format
- Status: "Active" or "Inactive"

---

### SHEET 6: Loyola_SupportRequests

**Purpose:** Support requests from members

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| ID | Title | Description | Category | Amount | RequestedBy | RequestedByEmail | Date | Status |
| 1 | Medical Support | A member needs financial assistance... | Medical | ₦500,000 | John A. | john@example.com | 2024-01-10 | approved |
| 2 | Education Fund | Support a child's education... | Education | ₦250,000 | Mary O. | mary@example.com | 2024-01-08 | approved |
| 3 | Business Support | Help kickstart a business... | Business | ₦150,000 | David N. | david@example.com | 2024-01-05 | pending |

**Notes:**
- First row is headers
- ID: Unique identifier (string or number)
- Category: "Medical", "Education", "Business", "Emergency", or "Other"
- Amount: Include currency symbol (e.g., "₦500,000")
- Date: YYYY-MM-DD format
- Status: "approved", "pending", or "rejected" (only "approved" requests are shown)

---

### SHEET 7: Loyola_Votes

**Purpose:** Tracks votes for support requests

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| SupportRequestID | UserEmail | VoteTimestamp | VoteType |
| 1 | user1@example.com | 2024-01-10T10:30:00Z | upvote |
| 1 | user2@example.com | 2024-01-10T11:45:00Z | upvote |
| 2 | user1@example.com | 2024-01-10T12:00:00Z | upvote |

**Notes:**
- First row is headers
- SupportRequestID: Must match an ID from SupportRequests sheet
- VoteTimestamp: ISO format (auto-filled by the app)
- VoteType: Currently only "upvote" is used
- This sheet is written to by the app (requires special permissions - see below)

---

## How to Share Sheets

For each sheet:

1. Open the Google Sheet
2. Click "Share" button (top right)
3. Click "Change to anyone with the link"
4. Set permission to:
   - **"Viewer"** for read-only sheets (Auth, Members, Executives, News, Jobs, SupportRequests)
   - **"Editor"** for Votes sheet (to allow writing)
5. Click "Done"

**Important:** The Votes sheet needs "Editor" access to allow the app to write votes.

---

## Getting Spreadsheet IDs

The Spreadsheet ID is in the URL:

```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```

Example:
```
https://docs.google.com/spreadsheets/d/1abc123xyz/edit
                                       ↑↑↑↑↑↑↑↑↑↑
                                       This is the ID
```

---

## Configuration File

After creating all sheets, update `src/config/googleSheets.js`:

```javascript
export const GOOGLE_SHEETS_CONFIG = {
  API_KEY: 'YOUR_API_KEY_HERE',  // From Google Cloud Console
  SHARED_PASSWORD: 'loyola2003',  // Password for all users

  SHEETS: {
    AUTH: {
      SPREADSHEET_ID: 'YOUR_AUTH_SHEET_ID',
      SHEET_NAME: 'Sheet1',
      RANGE: 'Sheet1!A:D',
    },
    MEMBERS: {
      SPREADSHEET_ID: 'YOUR_MEMBERS_SHEET_ID',
      SHEET_NAME: 'Sheet1',
      RANGE: 'Sheet1!A:G',
    },
    EXECUTIVES: {
      SPREADSHEET_ID: 'YOUR_EXECUTIVES_SHEET_ID',
      SHEET_NAME: 'Sheet1',
      RANGE: 'Sheet1!A:K',
    },
    NEWS: {
      SPREADSHEET_ID: 'YOUR_NEWS_SHEET_ID',
      SHEET_NAME: 'Sheet1',
      RANGE: 'Sheet1!A:I',
    },
    JOBS: {
      SPREADSHEET_ID: 'YOUR_JOBS_SHEET_ID',
      SHEET_NAME: 'Sheet1',
      RANGE: 'Sheet1!A:L',
    },
    SUPPORT_REQUESTS: {
      SPREADSHEET_ID: 'YOUR_SUPPORT_SHEET_ID',
      SHEET_NAME: 'Sheet1',
      RANGE: 'Sheet1!A:I',
    },
    VOTES: {
      SPREADSHEET_ID: 'YOUR_VOTES_SHEET_ID',
      SHEET_NAME: 'Sheet1',
      RANGE: 'Sheet1!A:D',
    },
  },

  FORMS: {
    SUPPORT_REQUEST: 'YOUR_SUPPORT_FORM_URL',  // Optional
    POST_JOB: 'YOUR_JOB_FORM_URL',  // Optional
  },
};
```

---

## Google Forms Setup (Optional)

### Support Request Form

1. Create a Google Form with fields:
   - Title (Short answer)
   - Description (Paragraph)
   - Category (Dropdown: Medical, Education, Business, Emergency, Other)
   - Amount Needed (Short answer)
   - Your Name (Short answer)
   - Your Email (Short answer)

2. Link to SupportRequests sheet:
   - In Form, click "Responses" tab
   - Click green Sheets icon
   - Select "Create a new spreadsheet" or link to existing

3. Add a "Status" column manually and set to "pending" for new entries

### Job Posting Form

1. Create a Google Form with fields:
   - Job Title (Short answer)
   - Company Name (Short answer)
   - Description (Paragraph)
   - Requirements (Paragraph - comma separated)
   - Job Type (Dropdown: Full-time, Contract, Remote, Part-time)
   - Location (Short answer)
   - Salary Range (Short answer)
   - Apply URL (Short answer)
   - Your Name (Short answer)

2. Link to Jobs sheet similarly

---

## Testing

1. Fill in the config file with your IDs and API key
2. Add at least one row of data to each sheet (below headers)
3. Run the app: `npm run dev`
4. Check console for any errors
5. Test each page loads data correctly

### Test Login
- Use an email from your AuthorizedUsers sheet
- Password: `loyola2003` (or whatever you set in config)

---

## Troubleshooting

### "API key not valid" Error
- Check the API key is correct
- Make sure Google Sheets API is enabled in your project

### "Sheet not found" Error
- Verify the Spreadsheet ID is correct
- Make sure the sheet is shared publicly

### "Permission denied" Error
- Make sure the sheet is shared with "Anyone with the link"
- For Votes sheet, ensure it's set to "Editor" access

### Data not appearing
- Check the Range in config matches your data columns
- Verify headers are in row 1
- Check Status columns (Active/Inactive, approved/pending)

---

## Security Notes

1. **API Key Exposure**: The API key is exposed in frontend code. Use API key restrictions in Google Cloud Console to limit it to:
   - Google Sheets API only
   - Your domain(s) only

2. **Votes Sheet**: Since it needs write access, anyone could potentially write to it. For production, consider using Google Apps Script as a proxy.

3. **Shared Password**: All users share the same password. For better security, consider individual passwords or OAuth.

---

## File Structure After Setup

```
Frontend/
├── src/
│   ├── config/
│   │   └── googleSheets.js      # Configuration (fill in your IDs)
│   ├── services/
│   │   └── googleSheetsService.js  # API functions
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication
│   └── pages/
│       ├── Login.jsx            # Uses AUTH sheet
│       ├── Directory.jsx        # Uses MEMBERS sheet
│       ├── Executives.jsx       # Uses EXECUTIVES sheet
│       ├── News.jsx             # Uses NEWS sheet
│       ├── Jobs.jsx             # Uses JOBS sheet
│       └── Support.jsx          # Uses SUPPORT_REQUESTS & VOTES sheets
└── GOOGLE_SHEETS_SETUP.md       # This file
```
