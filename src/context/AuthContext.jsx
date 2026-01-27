import { createContext, useContext, useState, useEffect } from 'react';
import { GOOGLE_SHEETS_CONFIG, isConfigured } from '../config/googleSheets';
import { verifyUser, fetchMembers as fetchMembersFromSheet } from '../services/googleSheetsService';

const AuthContext = createContext(null);

// ============ TESTING MODE ============
// Set to false when Google Sheets are configured and ready
const TESTING_MODE = !isConfigured();
// ======================================

// Test users for development (will work when TESTING_MODE is true)
const TEST_USERS = [
  { email: 'test@loyola.com', name: 'Test User', phone: '+234 800 000 0000', work: 'Developer', birthday: 'January 1', class: 'Science' },
  { email: 'admin@loyola.com', name: 'Admin User', phone: '+234 800 000 0001', work: 'Administrator', birthday: 'February 15', class: 'Science' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('loyola_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('loyola_user');
      }
    }
    setLoading(false);
  }, []);

  // Fetch members from Google Sheets
  const fetchMembers = async () => {
    try {
      if (TESTING_MODE) {
        // Return test users in testing mode
        setMembers(TEST_USERS);
        return TEST_USERS;
      }

      const membersData = await fetchMembersFromSheet();
      setMembers(membersData);
      return membersData;
    } catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  };

  const login = async (email, password) => {
    const sharedPassword = GOOGLE_SHEETS_CONFIG.SHARED_PASSWORD;

    // Validate password
    if (password !== sharedPassword) {
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
          class: testUser.class,
          isLoggedIn: true,
        };
        setUser(userData);
        localStorage.setItem('loyola_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: 'Email not found. Try test@loyola.com or admin@loyola.com' };
    }

    // Production mode: Verify user against AuthorizedUsers sheet
    try {
      const authorizedUser = await verifyUser(email);

      if (!authorizedUser) {
        return { success: false, message: 'Email not found in authorized users list' };
      }

      const userData = {
        email: authorizedUser.email,
        name: authorizedUser.name,
        class: authorizedUser.class,
        isLoggedIn: true,
      };

      setUser(userData);
      localStorage.setItem('loyola_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login. Please try again.' };
    }
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
        isTestingMode: TESTING_MODE,
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
