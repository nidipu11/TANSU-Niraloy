/**
 * ==========================================================================
 * TANSU NIRALOY - AUTHENTICATION & ROLE MANAGEMENT
 * Pure Vanilla JavaScript
 * Strictly enforces:
 * - NO fake hardcoded logged-in user (starts unauthenticated by default)
 * - Structured user entity: userId, name, email, phone, role, token
 * - Role guarding: GUEST, TENANT, OWNER, ADMIN
 * - Safe session handling ready for Java JWT / Spring Security
 * ==========================================================================
 */

const Auth = {
  TOKEN_KEY: "tansu_token",
  USER_KEY: "tansu_current_user",
  USERS_REPO_KEY: "tansu_registered_users",
  SESSION_FLAG: "tansu_session_active",

  /**
   * Initialize Session
   * Guarantees that upon first opening the site, no user is logged in
   * and the visitor is strictly in Guest Mode.
   */
  initSession() {
    try {
      if (!sessionStorage.getItem(this.SESSION_FLAG)) {
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.setItem(this.SESSION_FLAG, "guest");
      }
    } catch (e) {
      console.warn("[Auth] Session initialization:", e);
    }
  },

  /**
   * Get Current Authenticated User or null
   * @returns {object|null}
   */
  getCurrentUser() {
    this.initSession();
    const data = localStorage.getItem(this.USER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("[Auth] Error parsing user session:", e);
      return null;
    }
  },

  /**
   * Check if User is Authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Get User Role (Default: GUEST)
   * @returns {string} GUEST | TENANT | OWNER | ADMIN
   */
  getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : "GUEST";
  },

  /**
   * Set Current Session
   * @param {object} user
   * @param {string} token
   */
  setSession(user, token = "dummy-java-jwt-token") {
    try {
      sessionStorage.setItem(this.SESSION_FLAG, "authenticated");
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (e) {
      console.error("[Auth] Set session error:", e);
    }
  },

  /**
   * Sign In Action
   * @param {string} email
   * @param {string} password
   */
  async signIn(email, password) {
    const cleanEmail = (email || "").trim().toLowerCase();

    // If backend URL is set, call Java Spring Boot auth endpoint
    if (typeof API_BASE_URL !== "undefined" && API_BASE_URL) {
      const res = await apiPost("/api/auth/signin", { email: cleanEmail, password });
      if (res && res.success) {
        const userObj = res.data || res.user;
        this.setSession(userObj, userObj.token || `tansu-token-${Date.now()}`);
        return { success: true, user: userObj };
      }
      return {
        success: false,
        status: res ? res.status : 400,
        message: (res && res.message) ? res.message : "Invalid credentials."
      };
    }

    // Client prototype verification against registered users
    const users = this._getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return {
        success: false,
        status: 404,
        message: "No account found with this email. Please sign up first."
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        status: 401,
        message: "Invalid credentials."
      };
    }

    const sessionUser = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };
    this.setSession(sessionUser, `tansu-token-${Date.now()}`);
    return { success: true, user: sessionUser };
  },

  /**
   * Sign Up Action
   * @param {object} userData
   */
  async signUp(userData) {
    const cleanEmail = (userData.email || "").trim().toLowerCase();

    if (typeof API_BASE_URL !== "undefined" && API_BASE_URL) {
      const res = await apiPost("/api/auth/register", {
        fullName: userData.fullName.trim(),
        email: cleanEmail,
        phone: userData.phone.trim(),
        password: userData.password,
        role: userData.role
      });
      if (res && res.success) {
        const userObj = res.data || res.user;
        this.setSession(userObj, userObj.token || `tansu-token-${Date.now()}`);
        return { success: true, user: userObj };
      }
      return {
        success: false,
        status: res ? res.status : 400,
        message: (res && res.message) ? res.message : "Registration failed."
      };
    }

    const users = this._getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, status: 400, message: "Email already registered." };
    }

    // Enforce role safety: never allow self-registering as ADMIN
    const role = (userData.role === "OWNER" || userData.role === "TENANT") ? userData.role : "TENANT";

    const newUser = {
      userId: `${role === "OWNER" ? "OWN" : "TNT"}-${Date.now().toString().slice(-5)}`,
      name: userData.fullName.trim(),
      email: cleanEmail,
      phone: userData.phone.trim(),
      password: userData.password,
      role: role,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_REPO_KEY, JSON.stringify(users));

    // Auto sign-in new user
    const sessionUser = {
      userId: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role
    };
    this.setSession(sessionUser, `tansu-token-${Date.now()}`);
    return { success: true, user: sessionUser };
  },

  /**
   * Logout Action
   */
  logout() {
    try {
      sessionStorage.setItem(this.SESSION_FLAG, "guest");
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (e) {}
    window.location.href = "signin.html";
  },

  /**
   * Route Guard
   * Redirects unauthorized users to login or correct dashboard
   * @param {string[]} allowedRoles
   */
  requireAuth(allowedRoles = []) {
    const user = this.getCurrentUser();
    if (!user) {
      const currentPath = encodeURIComponent(window.location.pathname.split("/").pop());
      window.location.href = `signin.html?redirect=${currentPath}`;
      return false;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      alert(`Access Restricted: This page requires ${allowedRoles.join(" or ")} privileges.`);
      if (user.role === "TENANT") window.location.href = "tenant-dashboard.html";
      else if (user.role === "OWNER") window.location.href = "owner-dashboard.html";
      else if (user.role === "ADMIN") window.location.href = "admin-dashboard.html";
      else window.location.href = "index.html";
      return false;
    }

    return true;
  },

  _getRegisteredUsers() {
    let users = JSON.parse(localStorage.getItem(this.USERS_REPO_KEY) || "[]");
    if (users.length === 0) {
      users = [
        {
          userId: "ADM-001",
          name: "TANSU System Administrator",
          email: "admin@tansu.gov.bd",
          password: "Admin123",
          phone: "01700000000",
          role: "ADMIN"
        },
        {
          userId: "OWN-501",
          name: "Haji Mohammad Rafiq",
          email: "property.owner@gmail.com",
          password: "Owner123",
          phone: "01711223344",
          role: "OWNER"
        },
        {
          userId: "TNT-101",
          name: "Shakil Ahmed",
          email: "student.tenant@gmail.com",
          password: "Tenant123",
          phone: "01811223344",
          role: "TENANT"
        }
      ];
      localStorage.setItem(this.USERS_REPO_KEY, JSON.stringify(users));
    }
    return users;
  }
};
