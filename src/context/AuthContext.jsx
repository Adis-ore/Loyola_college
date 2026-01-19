import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// ============ TESTING MODE ============
// Set to true to bypass authentication for testing
const TESTING_MODE = true;
// ======================================

// Generic password for all users
const GENERIC_PASSWORD = 'loyola03';

// Test users for development (will work when TESTING_MODE is true)
const TEST_USERS = [
  { email: 'test@loyola.com', name: 'Test User', phone: '+234 800 000 0000', work: 'Developer', birthday: 'January 1', class: 'Science' },
  { email: 'admin@loyola.com', name: 'Admin User', phone: '+234 800 000 0001', work: 'Administrator', birthday: 'February 15', class: 'Science' },
];

// Google Sheets configuration - Replace with your actual sheet ID and API key
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
const API_KEY = 'YOUR_GOOGLE_API_KEY';
const MEMBERS_RANGE = 'Members!A:F'; // Assuming columns: Name, Email, Phone, Work, Birthday, Class

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('loyola_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Fetch members from Google Sheets
  const fetchMembers = async () => {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${MEMBERS_RANGE}?key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.values) {
        const [headers, ...rows] = data.values;
        const membersData = rows.map((row, index) => ({
          id: index + 1,
          name: row[0] || '',
          email: row[1] || '',
          phone: row[2] || '',
          work: row[3] || '',
          birthday: row[4] || '',
          class: row[5] || '',
        }));
        setMembers(membersData);
        return membersData;
      }
      return [];
    } catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  };

  const login = async (email, password) => {
    if (password !== GENERIC_PASSWORD) {
      return { success: false, message: 'Invalid password' };
    }

    // In testing mode, check against test users
    if (TESTING_MODE) {
      const testUser = TEST_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (testUser) {
        const userData = {
          email: testUser.email,
          name: testUser.name,
          isLoggedIn: true,
        };
        setUser(userData);
        localStorage.setItem('loyola_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: 'Email not found. Try test@loyola.com' };
    }

    // Production mode: Fetch members and check if email exists
    const membersList = await fetchMembers();
    const member = membersList.find(
      (m) => m.email.toLowerCase() === email.toLowerCase()
    );

    if (!member) {
      return { success: false, message: 'Email not found in database' };
    }

    const userData = {
      email: member.email,
      name: member.name,
      isLoggedIn: true,
    };

    setUser(userData);
    localStorage.setItem('loyola_user', JSON.stringify(userData));
    return { success: true, user: userData };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loyola_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        members,
        login,
        logout,
        fetchMembers,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
