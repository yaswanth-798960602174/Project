
import React, { useState, useEffect } from "react";
import "./App.css";

const defaultTournaments = [
  { id: 1, name: "BGMI Andhra Championship", game: "BGMI", date: "2026-12-10" },
  { id: 2, name: "Valorant India Masters", game: "Valorant", date: "2026-12-15" },
  { id: 3, name: "Free Fire Telugu Cup", game: "Free Fire", date: "2026-12-20" }
];

const matches = [
  { game: "BGMI", team1: "Thunder Warriors", team2: "Telugu Titans", date: "10-12-2026", status: "Upcoming" },
  { game: "Valorant", team1: "Cyber Kings", team2: "Phoenix Squad", date: "15-12-2026", status: "Live" },
  { game: "Free Fire", team1: "Andhra Warriors", team2: "Hyderabad Kings", date: "20-12-2026", status: "Upcoming" }
];

const leaderboard = [
  { team: "Thunder Warriors", captain: "Sai Teja", wins: 3, points: 90 },
  { team: "Telugu Titans", captain: "Kiran Reddy", wins: 2, points: 75 },
  { team: "Cyber Kings", captain: "Harsha", wins: 1, points: 60 },
  { team: "Phoenix Squad", captain: "Ananya", wins: 1, points: 50 }
];

function App() {
  const [page, setPage] = useState("home");
  const [users, setUsers] = useState(() =>
    JSON.parse(localStorage.getItem("users") || "[]")
  );
  const [teams, setTeams] = useState(() =>
    JSON.parse(localStorage.getItem("teams") || "[]")
  );
  const [tournaments, setTournaments] = useState(() =>
    JSON.parse(localStorage.getItem("tournaments") || "null") || defaultTournaments
  );
  const [registrations, setRegistrations] = useState(() =>
    JSON.parse(localStorage.getItem("registrations") || "[]")
  );
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("currentUser") || "null")
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem("tournaments", JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem("registrations", JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  function notify(text) {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  }

  function navigate(nextPage) {
    if (["dashboard", "teams", "tournaments"].includes(nextPage) && !currentUser) {
      notify("Please login first.");
      setPage("login");
      return;
    }
    if (nextPage === "admin" && currentUser?.role !== "admin") {
      notify("Admin access only.");
      return;
    }
    setPage(nextPage);
  }

  function signup(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name").trim();
    const email = form.get("email").trim();
    const mobile = form.get("mobile").trim();
    const username = form.get("username").trim();
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (password !== confirmPassword) {
      notify("Passwords do not match.");
      return;
    }

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      notify("Username already exists.");
      return;
    }

    setUsers([...users, { name, email, mobile, username, password }]);
    notify("Account created successfully. Please login.");
    e.currentTarget.reset();
    setPage("login");
  }

  function login(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = form.get("username").trim();
    const password = form.get("password");

    if (username === "admin" && password === "admin123") {
      setCurrentUser({ username: "admin", name: "Administrator", role: "admin" });
      setPage("admin");
      notify("Admin login successful.");
      return;
    }

    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      notify("Invalid username or password.");
      return;
    }

    setCurrentUser({ ...user, role: "user" });
    setPage("dashboard");
    notify("Login successful.");
  }

  function logout() {
    setCurrentUser(null);
    setPage("home");
    notify("Logged out successfully.");
  }

  function registerTournament(id) {
    if (!currentUser || currentUser.role !== "user") {
      notify("Please login as a user first.");
      return;
    }

    const alreadyRegistered = registrations.some(
      r => r.username === currentUser.username && r.tournamentId === id
    );

    if (alreadyRegistered) {
      notify("You have already registered for this tournament.");
      return;
    }

    setRegistrations([
      ...registrations,
      { username: currentUser.username, tournamentId: id }
    ]);
    notify("Tournament registration successful.");
  }

  function createTeam(e) {
    e.preventDefault();

    if (!currentUser || currentUser.role !== "user") {
      notify("Please login as a user.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const teamName = form.get("teamName").trim();
    const game = form.get("game");

    if (teams.some(t => t.teamName.toLowerCase() === teamName.toLowerCase())) {
      notify("Team name already exists.");
      return;
    }

    const newTeam = {
      id: Date.now(),
      teamName,
      game,
      captain: currentUser.username,
      captainName: currentUser.name,
      members: [currentUser.username]
    };

    setTeams([...teams, newTeam]);
    e.currentTarget.reset();
    notify("Team created successfully.");
  }

  function joinTeam(teamId) {
    const team = teams.find(t => t.id === teamId);

    if (!team || !currentUser) return;

    if (team.members.includes(currentUser.username)) {
      notify("You already joined this team.");
      return;
    }

    if (team.members.length >= 5) {
      notify("This team is full.");
      return;
    }

    setTeams(teams.map(t =>
      t.id === teamId
        ? { ...t, members: [...t.members, currentUser.username] }
        : t
    ));

    notify("Successfully joined the team.");
  }

  function addTournament(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const newTournament = {
      id: Date.now(),
      name: form.get("name").trim(),
      game: form.get("game"),
      date: form.get("date")
    };

    setTournaments([...tournaments, newTournament]);
    e.currentTarget.reset();
    notify("Tournament added successfully.");
  }

  const myTeams = teams.filter(
    t => currentUser && t.members.includes(currentUser.username)
  );

  const myRegistrations = registrations.filter(
    r => currentUser && r.username === currentUser.username
  );

  return (
    <div>
      <nav className="navbar">
        <h2>🎮 Gaming Tournament Portal</h2>
        <div className="navlinks">
          <button onClick={() => navigate("home")}>Home</button>
          <button onClick={() => navigate("tournaments")}>Tournaments</button>
          <button onClick={() => navigate("teams")}>Teams</button>
          <button onClick={() => navigate("matches")}>Matches</button>
          <button onClick={() => navigate("leaderboard")}>Leaderboard</button>

          {currentUser ? (
            <>
              <button onClick={() => navigate(currentUser.role === "admin" ? "admin" : "dashboard")}>
                Dashboard
              </button>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("login")}>Login</button>
              <button onClick={() => navigate("signup")}>Signup</button>
            </>
          )}
        </div>
      </nav>

      {message && <div className="message">{message}</div>}

      {page === "home" && (
        <>
          <section className="hero">
            <h1>🎮 Gaming Tournament Portal</h1>
            <p>Join tournaments, create your team, compete with players and become a gaming champion.</p>
            <button onClick={() => navigate("tournaments")}>Explore Tournaments</button>
            <button onClick={() => navigate("signup")}>Join Now</button>
          </section>

          <section className="container">
            <h2>Our Features</h2>
            <div className="cards">
              {[
                ["🏆 Tournaments", "Explore and register for gaming tournaments."],
                ["👥 Create Team", "Create your own team and become its captain."],
                ["🤝 Join Team", "Join existing teams and play with friends."],
                ["🗓️ Matches", "Check upcoming and live matches."],
                ["🥇 Leaderboard", "View team rankings and points."],
                ["⚙️ Management", "Manage tournaments and registered users."]
              ].map(([title, description]) => (
                <div className="card" key={title}>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {page === "signup" && (
        <section className="form-box">
          <h2>Create Account</h2>
          <form onSubmit={signup}>
            <input name="name" placeholder="Full Name" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="mobile" type="tel" placeholder="Mobile Number" pattern="[0-9]{10}" required />
            <input name="username" placeholder="Username" required />
            <input name="password" type="password" placeholder="Password" required />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" required />
            <button type="submit">Create Account</button>
          </form>
        </section>
      )}

      {page === "login" && (
        <section className="form-box">
          <h2>Login</h2>
          <form onSubmit={login}>
            <input name="username" placeholder="Username" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
          <p>Admin login: admin / admin123</p>
        </section>
      )}

      {page === "dashboard" && currentUser && (
        <section className="container">
          <h2>Welcome, {currentUser.name}!</h2>
          <div className="cards">
            <div className="card"><h3>Tournaments</h3><h2>{tournaments.length}</h2></div>
            <div className="card"><h3>My Teams</h3><h2>{myTeams.length}</h2></div>
            <div className="card"><h3>Registrations</h3><h2>{myRegistrations.length}</h2></div>
            <div className="card"><h3>Matches</h3><h2>{matches.length}</h2></div>
          </div>
          <div className="actions">
            <button onClick={() => navigate("tournaments")}>View Tournaments</button>
            <button onClick={() => navigate("teams")}>Manage Teams</button>
            <button onClick={() => navigate("matches")}>View Matches</button>
            <button onClick={() => navigate("leaderboard")}>Leaderboard</button>
          </div>
        </section>
      )}

      {page === "tournaments" && (
        <section className="container">
          <h2>Available Tournaments</h2>
          <div className="cards">
            {tournaments.map(t => (
              <div className="card" key={t.id}>
                <h3>🏆 {t.name}</h3>
                <p>Game: {t.game}</p>
                <p>Date: {t.date}</p>
                <button onClick={() => registerTournament(t.id)}>Register</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {page === "teams" && currentUser && (
        <section className="container">
          <h2>Team Management</h2>

          <div className="form-box">
            <h3>Create New Team</h3>
            <form onSubmit={createTeam}>
              <input name="teamName" placeholder="Team Name" required />
              <select name="game" required defaultValue="">
                <option value="" disabled>Select Game</option>
                <option>BGMI</option>
                <option>Valorant</option>
                <option>Free Fire</option>
              </select>
              <button type="submit">Create Team</button>
            </form>
          </div>

          <h3>Available Teams - Join a Team</h3>
          <div className="cards">
            {teams.filter(t => !t.members.includes(currentUser.username)).map(t => (
              <div className="card" key={t.id}>
                <h3>{t.teamName}</h3>
                <p>Game: {t.game}</p>
                <p>Captain: {t.captainName}</p>
                <p>Members: {t.members.length}/5</p>
                <button disabled={t.members.length >= 5} onClick={() => joinTeam(t.id)}>
                  {t.members.length >= 5 ? "Team Full" : "Join Team"}
                </button>
              </div>
            ))}
          </div>

          <h3>My Teams</h3>
          <div className="cards">
            {myTeams.map(t => (
              <div className="card" key={t.id}>
                <h3>{t.teamName}</h3>
                <p>Game: {t.game}</p>
                <p>Captain: {t.captainName}</p>
                <p>Members: {t.members.length}/5</p>
                <p>Member usernames: {t.members.join(", ")}</p>
              </div>
            ))}
            {myTeams.length === 0 && <p>You have not joined any teams yet.</p>}
          </div>
        </section>
      )}

      {page === "matches" && (
        <section className="container">
          <h2>Match Schedule</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Game</th><th>Team 1</th><th>Team 2</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {matches.map((m, i) => (
                  <tr key={i}>
                    <td>{m.game}</td><td>{m.team1}</td><td>{m.team2}</td>
                    <td>{m.date}</td><td>{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {page === "leaderboard" && (
        <section className="container">
          <h2>🏆 Leaderboard</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Rank</th><th>Team</th><th>Captain</th><th>Wins</th><th>Points</th></tr>
              </thead>
              <tbody>
                {leaderboard.map((l, i) => (
                  <tr key={l.team}>
                    <td>{i + 1}</td><td>{l.team}</td><td>{l.captain}</td>
                    <td>{l.wins}</td><td>{l.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {page === "admin" && currentUser?.role === "admin" && (
        <section className="container">
          <h2>Admin Dashboard</h2>
          <div className="cards">
            <div className="card"><h3>Tournaments</h3><h2>{tournaments.length}</h2></div>
            <div className="card"><h3>Users</h3><h2>{users.length}</h2></div>
            <div className="card"><h3>Teams</h3><h2>{teams.length}</h2></div>
            <div className="card"><h3>Registrations</h3><h2>{registrations.length}</h2></div>
          </div>

          <div className="form-box">
            <h3>Add New Tournament</h3>
            <form onSubmit={addTournament}>
              <input name="name" placeholder="Tournament Name" required />
              <select name="game" required defaultValue="">
                <option value="" disabled>Select Game</option>
                <option>BGMI</option>
                <option>Valorant</option>
                <option>Free Fire</option>
              </select>
              <input name="date" type="date" required />
              <button type="submit">Add Tournament</button>
            </form>
          </div>

          <h3>Registered Users</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Username</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.username}>
                    <td>{u.name}</td><td>{u.email}</td><td>{u.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>Created Teams</h3>
          {teams.map(t => (
            <p key={t.id}>{t.teamName} — {t.game} — {t.members.length}/5 members</p>
          ))}
        </section>
      )}
    </div>
  );
}

export default App;
