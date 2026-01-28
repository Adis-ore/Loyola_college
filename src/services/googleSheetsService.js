// Google Sheets Service - All API functions for fetching/writing data
import { GOOGLE_SHEETS_CONFIG } from '../config/googleSheets';

const { API_KEY, SHEETS } = GOOGLE_SHEETS_CONFIG;

// Base URL for Google Sheets API v4
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Generic fetch function for reading from Google Sheets
 */
const fetchSheetData = async (spreadsheetId, range) => {
  const url = `${BASE_URL}/${spreadsheetId}/values/${range}?key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch data from Google Sheets');
    }

    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Google Sheets fetch error:', error);
    throw error;
  }
};

/**
 * Generic append function for writing to Google Sheets
 * Note: This requires the sheet to be editable by anyone with the link
 * OR use a service account (more complex setup)
 */
const appendSheetData = async (spreadsheetId, range, values) => {
  const url = `${BASE_URL}/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [values],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to write data to Google Sheets');
    }

    return await response.json();
  } catch (error) {
    console.error('Google Sheets append error:', error);
    throw error;
  }
};

// ============================================================
// AUTHENTICATION - AuthorizedUsers Sheet
// ============================================================

/**
 * Fetch all authorized users from the AuthorizedUsers sheet
 * Sheet columns: Email | Name | Status | Class
 */
export const fetchAuthorizedUsers = async () => {
  try {
    const { SPREADSHEET_ID, RANGE } = SHEETS.AUTH;
    const rows = await fetchSheetData(SPREADSHEET_ID, RANGE);

    if (rows.length <= 1) return []; // No data or only headers

    const [, ...dataRows] = rows; // Skip header row

    return dataRows.map((row, index) => ({
      id: index + 1,
      email: (row[0] || '').trim().toLowerCase(),
      name: (row[1] || '').trim(),
      status: (row[2] || 'Active').trim(),
      class: (row[3] || '').trim(),
    })).filter(user => user.status === 'Active'); // Only return active users
  } catch (error) {
    console.error('Error fetching authorized users:', error);
    throw error;
  }
};

/**
 * Verify if a user is authorized to login
 */
export const verifyUser = async (email) => {
  try {
    const users = await fetchAuthorizedUsers();
    return users.find(user => user.email === email.toLowerCase().trim());
  } catch (error) {
    console.error('Error verifying user:', error);
    return null;
  }
};

// ============================================================
// DIRECTORY - Members Sheet
// ============================================================

/**
 * Fetch all members from the Members sheet
 * Sheet columns: Name | Email | Phone | Work | Birthday | Class | City
 */
export const fetchMembers = async () => {
  try {
    const { SPREADSHEET_ID, RANGE } = SHEETS.MEMBERS;
    const rows = await fetchSheetData(SPREADSHEET_ID, RANGE);

    if (rows.length <= 1) return [];

    const [, ...dataRows] = rows;

    return dataRows.map((row, index) => ({
      id: index + 1,
      name: row[0] || '',
      email: row[1] || '',
      phone: row[2] || '',
      work: row[3] || '',
      birthday: row[4] || '',
      class: row[5] || 'Science',
      city: row[6] || '',
    })).filter(member => member.name && member.email); // Filter out empty rows
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

// ============================================================
// EXECUTIVES - Executives Sheet
// ============================================================

/**
 * Fetch all executives from the Executives sheet
 * Sheet columns: Name | Position | Bio | ImageURL | Email | Phone | LinkedIn | Twitter | IsPresident | Order | Status
 */
export const fetchExecutives = async () => {
  try {
    const { SPREADSHEET_ID, RANGE } = SHEETS.EXECUTIVES;
    const rows = await fetchSheetData(SPREADSHEET_ID, RANGE);

    if (rows.length <= 1) return [];

    const [, ...dataRows] = rows;

    const executives = dataRows.map((row, index) => ({
      id: index + 1,
      name: (row[0] || '').trim(),
      position: (row[1] || '').trim(),
      bio: (row[2] || '').trim(),
      image: (row[3] || '').trim() || null,
      email: (row[4] || '').trim(),
      phone: (row[5] || '').trim(),
      linkedin: (row[6] || '').trim() || '#',
      twitter: (row[7] || '').trim() || '#',
      isPresident: (row[8] || '').trim().toUpperCase() === 'TRUE',
      order: parseInt(row[9]) || 999,
      status: (row[10] || 'Active').trim(),
    }))
    .filter(exec => exec.name && exec.status === 'Active')
    .sort((a, b) => a.order - b.order);

    // Ensure president is first
    const president = executives.find(e => e.isPresident);
    const others = executives.filter(e => !e.isPresident);

    return president ? [president, ...others] : executives;
  } catch (error) {
    console.error('Error fetching executives:', error);
    throw error;
  }
};

// ============================================================
// NEWS - News Sheet
// ============================================================

/**
 * Fetch all news from the News sheet
 * Sheet columns: ID | Title | Excerpt | Content | Category | Author | Date | ImageURL | IsFeatured
 */
export const fetchNews = async () => {
  try {
    const { SPREADSHEET_ID, RANGE } = SHEETS.NEWS;
    const rows = await fetchSheetData(SPREADSHEET_ID, RANGE);

    if (rows.length <= 1) return [];

    const [, ...dataRows] = rows;

    return dataRows.map((row, index) => ({
      id: row[0] || index + 1,
      title: row[1] || '',
      excerpt: row[2] || '',
      content: row[3] || '',
      category: row[4] || 'Announcement',
      author: row[5] || 'Admin',
      date: row[6] || new Date().toISOString().split('T')[0],
      image: row[7] || null,
      featured: (row[8] || '').toUpperCase() === 'TRUE',
    }))
    .filter(news => news.title)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// ============================================================
// JOBS - Jobs Sheet
// ============================================================

/**
 * Fetch all jobs from the Jobs sheet (Google Form linked)
 * Form columns: Timestamp | Title | Company | Description | Requirements | Type | Location | Salary | ApplyURL | PostedBy | Status
 */
export const fetchJobs = async () => {
  try {
    const { SPREADSHEET_ID, RANGE } = SHEETS.JOBS;
    const rows = await fetchSheetData(SPREADSHEET_ID, RANGE);

    if (rows.length <= 1) return [];

    const [, ...dataRows] = rows;

    return dataRows.map((row, index) => {
      // Parse timestamp to get date
      const timestamp = (row[0] || '').trim();
      let postedDate = new Date().toISOString().split('T')[0];
      if (timestamp) {
        try {
          const parsedDate = new Date(timestamp);
          if (!isNaN(parsedDate)) {
            postedDate = parsedDate.toISOString().split('T')[0];
          }
        } catch {
          // Keep default date
        }
      }

      return {
        id: index + 1,
        title: (row[1] || '').trim(),
        company: (row[2] || '').trim(),
        description: (row[3] || '').trim(),
        requirements: (row[4] || '').split(',').map(r => r.trim()).filter(Boolean),
        type: (row[5] || 'Full-time').trim(),
        location: (row[6] || '').trim(),
        salary: (row[7] || '').trim(),
        applyLink: (row[8] || '').trim() || '#',
        postedBy: (row[9] || '').trim(),
        status: (row[10] || 'approved').trim().toLowerCase(),
        postedDate: postedDate,
      };
    })
    .filter(job => job.title && job.status === 'approved')
    .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// ============================================================
// SUPPORT - SupportRequests Sheet
// ============================================================

/**
 * Fetch all support requests from the SupportRequests sheet (Google Form linked)
 * Form columns: Timestamp | Title | Description | Category | Amount | RequestedBy | RequestedByEmail
 * Optional manual columns: Status (Column H)
 */
export const fetchSupportRequests = async () => {
  try {
    const { SPREADSHEET_ID, RANGE } = SHEETS.SUPPORT_REQUESTS;
    const rows = await fetchSheetData(SPREADSHEET_ID, RANGE);

    if (rows.length <= 1) return [];

    const [, ...dataRows] = rows;

    return dataRows.map((row, index) => {
      // Parse timestamp to get date
      const timestamp = (row[0] || '').trim();
      let date = new Date().toISOString().split('T')[0];
      if (timestamp) {
        try {
          const parsedDate = new Date(timestamp);
          if (!isNaN(parsedDate)) {
            date = parsedDate.toISOString().split('T')[0];
          }
        } catch {
          // Keep default date
        }
      }

      return {
        id: String(index + 1), // Auto-generate ID from row index
        title: (row[1] || '').trim(),
        description: (row[2] || '').trim(),
        category: (row[3] || 'Other').trim(),
        amount: (row[4] || '₦0').trim(),
        requestedBy: (row[5] || 'Anonymous').trim(),
        requestedByEmail: (row[6] || '').trim(),
        date: date,
        status: (row[7] || 'approved').trim().toLowerCase(), // Column H for status, default to approved
      };
    })
    .filter(req => req.title && req.status === 'approved');
  } catch (error) {
    console.error('Error fetching support requests:', error);
    throw error;
  }
};

// ============================================================
// VOTES - Votes Sheet (with Comments & Pledges)
// ============================================================

/**
 * Fetch all votes from the Votes sheet
 * Sheet columns: SupportRequestID | UserEmail | UserName | Comment | PledgeAmount | VoteTimestamp
 */
export const fetchVotes = async () => {
  try {
    const { SPREADSHEET_ID, RANGE } = SHEETS.VOTES;
    const rows = await fetchSheetData(SPREADSHEET_ID, RANGE);

    if (rows.length <= 1) return [];

    const [, ...dataRows] = rows;

    return dataRows.map((row, index) => ({
      id: index + 1,
      supportRequestId: (row[0] || '').toString().trim(),
      userEmail: (row[1] || '').toLowerCase().trim(),
      userName: (row[2] || '').trim(),
      comment: (row[3] || '').trim(),
      pledgeAmount: parseFloat(row[4]) || 0,
      voteTimestamp: (row[5] || '').trim(),
    }));
  } catch (error) {
    console.error('Error fetching votes:', error);
    throw error;
  }
};

/**
 * Get vote counts for all support requests
 */
export const getVoteCounts = async () => {
  try {
    const votes = await fetchVotes();
    const voteCounts = {};

    votes.forEach(vote => {
      const id = vote.supportRequestId;
      voteCounts[id] = (voteCounts[id] || 0) + 1;
    });

    return voteCounts;
  } catch (error) {
    console.error('Error getting vote counts:', error);
    return {};
  }
};

/**
 * Check if a user has already voted for a specific support request
 */
export const checkIfUserVoted = async (supportRequestId, userEmail) => {
  try {
    const votes = await fetchVotes();
    return votes.some(
      vote =>
        vote.supportRequestId === String(supportRequestId) &&
        vote.userEmail === userEmail.toLowerCase().trim()
    );
  } catch (error) {
    console.error('Error checking vote:', error);
    return false;
  }
};

/**
 * Get all support request IDs that a user has voted for
 */
export const getUserVotedIds = async (userEmail) => {
  try {
    const votes = await fetchVotes();
    return votes
      .filter(vote => vote.userEmail === userEmail.toLowerCase().trim())
      .map(vote => vote.supportRequestId);
  } catch (error) {
    console.error('Error getting user votes:', error);
    return [];
  }
};

/**
 * Fetch all vote comments for a specific support request
 */
export const fetchVoteComments = async (supportRequestId) => {
  try {
    const votes = await fetchVotes();
    return votes
      .filter(vote => vote.supportRequestId === String(supportRequestId))
      .map(vote => ({
        userName: vote.userName,
        comment: vote.comment,
        pledgeAmount: vote.pledgeAmount,
        timestamp: vote.voteTimestamp,
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Error fetching vote comments:', error);
    return [];
  }
};

/**
 * Calculate total pledge amount for a specific support request
 */
export const calculateTotalPledge = async (supportRequestId) => {
  try {
    const votes = await fetchVotes();
    return votes
      .filter(vote => vote.supportRequestId === String(supportRequestId))
      .reduce((total, vote) => total + (vote.pledgeAmount || 0), 0);
  } catch (error) {
    console.error('Error calculating total pledge:', error);
    return 0;
  }
};

/**
 * Get all pledge totals for all support requests
 */
export const getAllPledgeTotals = async () => {
  try {
    const votes = await fetchVotes();
    const pledgeTotals = {};

    votes.forEach(vote => {
      const id = vote.supportRequestId;
      pledgeTotals[id] = (pledgeTotals[id] || 0) + (vote.pledgeAmount || 0);
    });

    return pledgeTotals;
  } catch (error) {
    console.error('Error getting pledge totals:', error);
    return {};
  }
};

/**
 * Get all comments grouped by support request ID
 */
export const getAllVoteComments = async () => {
  try {
    const votes = await fetchVotes();
    const commentsByRequest = {};

    votes.forEach(vote => {
      const id = vote.supportRequestId;
      if (!commentsByRequest[id]) {
        commentsByRequest[id] = [];
      }
      commentsByRequest[id].push({
        userName: vote.userName,
        comment: vote.comment,
        pledgeAmount: vote.pledgeAmount,
        timestamp: vote.voteTimestamp,
      });
    });

    // Sort comments by timestamp (newest first) for each request
    Object.keys(commentsByRequest).forEach(id => {
      commentsByRequest[id].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });

    return commentsByRequest;
  } catch (error) {
    console.error('Error getting all vote comments:', error);
    return {};
  }
};

/**
 * Submit a vote with comment and pledge for a support request
 * One user can vote for MANY different requests, but only once per request
 * Uses Google Apps Script web app for write operations
 */
export const submitVote = async (supportRequestId, userEmail, userName, comment, pledgeAmount = 0) => {
  try {
    // Check if user already voted for THIS specific request (read check still uses API key)
    const alreadyVoted = await checkIfUserVoted(supportRequestId, userEmail);
    if (alreadyVoted) {
      return { success: false, message: 'You have already supported this request' };
    }

    // Use Google Apps Script web app for writing votes
    // Replace this URL with your deployed Apps Script URL
    const APPS_SCRIPT_URL = GOOGLE_SHEETS_CONFIG.APPS_SCRIPT?.VOTES_URL || '';

    if (!APPS_SCRIPT_URL) {
      console.error('Apps Script URL not configured');
      return { success: false, message: 'Voting service not configured. Please contact admin.' };
    }

    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script requires this
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        supportRequestId: String(supportRequestId),
        userEmail: userEmail.toLowerCase().trim(),
        userName: userName.trim(),
        comment: (comment || '').trim(),
        pledgeAmount: pledgeAmount || 0,
      }),
    });

    // With no-cors mode, we can't read the response directly
    // So we assume success if no error was thrown
    // The duplicate check on the server side will prevent duplicates
    return { success: true, message: 'Your support has been recorded!' };
  } catch (error) {
    console.error('Error submitting vote:', error);
    return { success: false, message: 'Failed to submit. Please try again.' };
  }
};

// ============================================================
// COMBINED DATA FUNCTIONS
// ============================================================

/**
 * Fetch support requests with vote counts, pledge totals, and comments
 */
export const fetchSupportRequestsWithVotes = async () => {
  try {
    const [requests, voteCounts, pledgeTotals, allComments] = await Promise.all([
      fetchSupportRequests(),
      getVoteCounts(),
      getAllPledgeTotals(),
      getAllVoteComments(),
    ]);

    return requests.map(request => ({
      ...request,
      votes: voteCounts[request.id] || 0,
      totalPledged: pledgeTotals[request.id] || 0,
      comments: allComments[request.id] || [],
    }));
  } catch (error) {
    console.error('Error fetching support requests with votes:', error);
    throw error;
  }
};

// ============================================================
// STATS FUNCTIONS (for Home Page)
// ============================================================

/**
 * Get total member count from Members Sheet
 */
export const getMemberCount = async () => {
  try {
    const members = await fetchMembers();
    return members.length;
  } catch (error) {
    console.error('Error getting member count:', error);
    return 0;
  }
};

/**
 * Get total support requests count
 */
export const getSupportRequestCount = async () => {
  try {
    const requests = await fetchSupportRequests();
    return requests.length;
  } catch (error) {
    console.error('Error getting support request count:', error);
    return 0;
  }
};

/**
 * Get total jobs count
 */
export const getJobsCount = async () => {
  try {
    const jobs = await fetchJobs();
    return jobs.length;
  } catch (error) {
    console.error('Error getting jobs count:', error);
    return 0;
  }
};

/**
 * Get total pledges amount from all votes
 */
export const getTotalPledgesAmount = async () => {
  try {
    const votes = await fetchVotes();
    return votes.reduce((total, vote) => total + (vote.pledgeAmount || 0), 0);
  } catch (error) {
    console.error('Error getting total pledges:', error);
    return 0;
  }
};

/**
 * Get all stats for Home page in one call
 */
export const getHomeStats = async () => {
  try {
    const [memberCount, supportCount, jobsCount, totalPledges] = await Promise.all([
      getMemberCount(),
      getSupportRequestCount(),
      getJobsCount(),
      getTotalPledgesAmount(),
    ]);

    return {
      memberCount,
      supportCount,
      jobsCount,
      totalPledges,
    };
  } catch (error) {
    console.error('Error getting home stats:', error);
    return {
      memberCount: 0,
      supportCount: 0,
      jobsCount: 0,
      totalPledges: 0,
    };
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Test if a sheet is accessible
 */
export const testSheetConnection = async (sheetKey) => {
  try {
    const sheetConfig = SHEETS[sheetKey];
    if (!sheetConfig || !sheetConfig.SPREADSHEET_ID) {
      return { success: false, message: 'Sheet not configured' };
    }

    await fetchSheetData(sheetConfig.SPREADSHEET_ID, sheetConfig.RANGE);
    return { success: true, message: 'Connection successful' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Test all sheet connections
 */
export const testAllConnections = async () => {
  const results = {};

  for (const key of Object.keys(SHEETS)) {
    results[key] = await testSheetConnection(key);
  }

  return results;
};

export default {
  // Auth
  fetchAuthorizedUsers,
  verifyUser,

  // Directory
  fetchMembers,

  // Executives
  fetchExecutives,

  // News
  fetchNews,

  // Jobs
  fetchJobs,

  // Support
  fetchSupportRequests,
  fetchSupportRequestsWithVotes,
  fetchVotes,
  getVoteCounts,
  checkIfUserVoted,
  getUserVotedIds,
  submitVote,

  // Vote Comments & Pledges
  fetchVoteComments,
  calculateTotalPledge,
  getAllPledgeTotals,
  getAllVoteComments,

  // Stats (for Home Page)
  getMemberCount,
  getSupportRequestCount,
  getJobsCount,
  getTotalPledgesAmount,
  getHomeStats,

  // Utilities
  testSheetConnection,
  testAllConnections,
};
