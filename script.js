/* =====================================================
   GAMING TOURNAMENT PORTAL
   JavaScript
   ===================================================== */


/* ================= DEFAULT DATA ================= */

let users = JSON.parse(
    localStorage.getItem("users")
) || [];

let tournaments = JSON.parse(
    localStorage.getItem("tournaments")
) || [];

let teams = JSON.parse(
    localStorage.getItem("teams")
) || [];

let registrations = JSON.parse(
    localStorage.getItem("registrations")
) || [];

let currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);


/* ================= DEFAULT TOURNAMENTS ================= */

if (tournaments.length === 0) {

    tournaments = [

        {
            id: 1,
            name: "BGMI Andhra Championship",
            game: "BGMI",
            date: "2026-09-25",
            mode: "Online"
        },

        {
            id: 2,
            name: "Valorant India Masters",
            game: "Valorant",
            date: "2026-09-27",
            mode: "Online"
        },

        {
            id: 3,
            name: "Free Fire Telugu Cup",
            game: "Free Fire",
            date: "2026-09-29",
            mode: "Online"
        }

    ];

    localStorage.setItem(
        "tournaments",
        JSON.stringify(tournaments)
    );
}


/* ================= MATCH DATA ================= */

const matches = [

    {
        game: "BGMI",
        team1: "Thunder Warriors",
        team2: "Telugu Titans",
        date: "25-09-2026",
        status: "Upcoming"
    },

    {
        game: "Valorant",
        team1: "Cyber Kings",
        team2: "Phoenix Squad",
        date: "27-09-2026",
        status: "Live"
    },

    {
        game: "Free Fire",
        team1: "Andhra Warriors",
        team2: "Hyderabad Kings",
        date: "29-09-2026",
        status: "Upcoming"
    }

];


/* ================= LEADERBOARD DATA ================= */

const leaderboard = [

    {
        team: "Thunder Warriors",
        captain: "Sai Teja",
        wins: 3,
        points: 90
    },

    {
        team: "Telugu Titans",
        captain: "Kiran Reddy",
        wins: 2,
        points: 75
    },

    {
        team: "Cyber Kings",
        captain: "Harsha Vardhan",
        wins: 1,
        points: 60
    },

    {
        team: "Phoenix Squad",
        captain: "Ananya Reddy",
        wins: 1,
        points: 50
    }

];


/* =====================================================
   PAGE NAVIGATION
   ===================================================== */

function showPage(pageId) {

    /*
       Hide all pages
    */

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {

        page.classList.remove("active");

    });


    /*
       Show selected page
    */

    const selectedPage =
        document.getElementById(pageId);

    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    /*
       Load required data
    */

    if (pageId === "tournaments") {
        loadTournaments();
    }

    if (pageId === "teams") {
        loadTeams();
    }

    if (pageId === "matches") {
        loadMatches();
    }

    if (pageId === "leaderboard") {
        loadLeaderboard();
    }

    if (pageId === "userDashboard") {
        loadUserDashboard();
    }

    if (pageId === "adminDashboard") {
        loadAdminDashboard();
    }

}


/* =====================================================
   MESSAGE FUNCTION
   ===================================================== */

function showMessage(message, type = "success") {

    const messageBox =
        document.getElementById("message");

    messageBox.innerText = message;

    messageBox.className = type;

    messageBox.style.display = "block";


    setTimeout(function() {

        messageBox.style.display = "none";

    }, 3000);

}


/* =====================================================
   SIGNUP
   ===================================================== */

function signup(event) {

    event.preventDefault();


    const name =
        document.getElementById("signupName").value.trim();

    const email =
        document.getElementById("signupEmail").value.trim();

    const mobile =
        document.getElementById("signupMobile").value.trim();

    const username =
        document.getElementById("signupUsername").value.trim();

    const password =
        document.getElementById("signupPassword").value;

    const confirmPassword =
        document.getElementById(
            "signupConfirmPassword"
        ).value;


    /*
       Check password
    */

    if (password !== confirmPassword) {

        showMessage(
            "Passwords do not match!",
            "error"
        );

        return;
    }


    /*
       Check existing username
    */

    const existingUser =
        users.find(function(user) {

            return user.username === username;

        });


    if (existingUser) {

        showMessage(
            "Username already exists!",
            "error"
        );

        return;
    }


    /*
       Create new user
    */

    const newUser = {

        name: name,
        email: email,
        mobile: mobile,
        username: username,
        password: password,
        role: "user"

    };


    users.push(newUser);


    /*
       Save in Local Storage
    */

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    showMessage(
        "Account created successfully!",
        "success"
    );


    /*
       Clear form
    */

    document.querySelector(
        "#signup form"
    ).reset();


    /*
       Go to login
    */

    setTimeout(function() {

        showPage("login");

    }, 1000);

}


/* =====================================================
   LOGIN
   ===================================================== */

function login(event) {

    event.preventDefault();


    const username =
        document.getElementById(
            "loginUsername"
        ).value.trim();

    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    /*
       ADMIN LOGIN
    */

    if (
        username === "admin" &&
        password === "admin123"
    ) {

        currentUser = {

            username: "admin",

            name: "Administrator",

            role: "admin"

        };


        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );


        updateNavbar();

        showMessage(
            "Admin login successful!",
            "success"
        );


        showPage("adminDashboard");

        return;
    }


    /*
       USER LOGIN
    */

    const user =
        users.find(function(user) {

            return (
                user.username === username &&
                user.password === password
            );

        });


    if (!user) {

        showMessage(
            "Invalid username or password!",
            "error"
        );

        return;
    }


    /*
       Store logged-in user
    */

    currentUser = {

        username: user.username,

        name: user.name,

        role: "user"

    };


    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );


    updateNavbar();

    showMessage(
        "Login successful!",
        "success"
    );


    showPage("userDashboard");

}


/* =====================================================
   LOGOUT
   ===================================================== */

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    currentUser = null;

    updateNavbar();

    showMessage(
        "Logged out successfully!",
        "success"
    );

    showPage("home");

}


/* =====================================================
   NAVBAR UPDATE
   ===================================================== */

function updateNavbar() {

    const loginNav =
        document.getElementById("loginNav");

    const signupNav =
        document.getElementById("signupNav");

    const logoutNav =
        document.getElementById("logoutNav");


    if (currentUser) {

        loginNav.style.display = "none";

        signupNav.style.display = "none";

        logoutNav.style.display = "inline";

    }

    else {

        loginNav.style.display = "inline";

        signupNav.style.display = "inline";

        logoutNav.style.display = "none";

    }

}


/* =====================================================
   USER DASHBOARD
   ===================================================== */

function loadUserDashboard() {

    if (!currentUser) {

        showPage("login");

        return;
    }


    document.getElementById(
        "welcomeUser"
    ).innerText =
        "Welcome, " + currentUser.name + "!";


    document.getElementById(
        "tournamentCount"
    ).innerText =
        tournaments.length;


    /*
       Count only current user's teams
    */

    let myTeams = teams.filter(
        function(team) {

            return team.username ===
                currentUser.username;

        }
    );


    document.getElementById(
        "teamCount"
    ).innerText =
        myTeams.length;

}


/* =====================================================
   LOAD TOURNAMENTS
   ===================================================== */

function loadTournaments() {

    const tournamentList =
        document.getElementById(
            "tournamentList"
        );


    tournamentList.innerHTML = "";


    tournaments.forEach(
        function(tournament) {

            const card =
                document.createElement("div");

            card.className = "card";


            card.innerHTML = `

                <h3>🏆 ${tournament.name}</h3>

                <p>
                    <b>Game:</b>
                    ${tournament.game}
                </p>

                <p>
                    <b>Date:</b>
                    ${tournament.date}
                </p>

                <p>
                    <b>Mode:</b>
                    ${tournament.mode}
                </p>

                <button
                    onclick="registerTournament('${tournament.name}')"
                >
                    Register
                </button>

            `;


            tournamentList.appendChild(card);

        }
    );

}


/* =====================================================
   TOURNAMENT REGISTRATION
   ===================================================== */

function registerTournament(tournamentName) {

    if (!currentUser) {

        showMessage(
            "Please login first!",
            "error"
        );

        showPage("login");

        return;
    }


    const alreadyRegistered =
        registrations.find(
            function(registration) {

                return (
                    registration.username ===
                    currentUser.username &&

                    registration.tournament ===
                    tournamentName
                );

            }
        );


    if (alreadyRegistered) {

        showMessage(
            "You are already registered!",
            "error"
        );

        return;
    }


    registrations.push({

        username:
            currentUser.username,

        tournament:
            tournamentName

    });


    localStorage.setItem(
        "registrations",
        JSON.stringify(registrations)
    );


    showMessage(
        "Tournament registration successful!",
        "success"
    );

}


/* =====================================================
   CREATE TEAM
   ===================================================== */

function createTeam(event) {

    event.preventDefault();


    if (!currentUser) {

        showMessage(
            "Please login first!",
            "error"
        );

        showPage("login");

        return;
    }


    const teamName =
        document.getElementById(
            "teamName"
        ).value.trim();

    const game =
        document.getElementById(
            "teamGame"
        ).value;


    /*
       Check duplicate team
    */

    const existingTeam =
        teams.find(function(team) {

            return (
                team.teamName === teamName &&
                team.username ===
                currentUser.username
            );

        });


    if (existingTeam) {

        showMessage(
            "Team already exists!",
            "error"
        );

        return;
    }


    const newTeam = {

        teamName: teamName,

        game: game,

        captain: currentUser.name,

        username: currentUser.username,

        members: [
            currentUser.name
        ]

    };


    teams.push(newTeam);


    localStorage.setItem(
        "teams",
        JSON.stringify(teams)
    );


    showMessage(
        "Team created successfully!",
        "success"
    );


    document.querySelector(
        "#teams form"
    ).reset();


    loadTeams();

}


/* =====================================================
   LOAD TEAMS
   ===================================================== */

function loadTeams() {

    const teamList =
        document.getElementById(
            "teamList"
        );


    teamList.innerHTML = "";


    if (!currentUser) {

        teamList.innerHTML = `
            <div class="card">
                <h3>Please Login</h3>
                <p>
                    Login to create and manage teams.
                </p>
            </div>
        `;

        return;
    }


    const myTeams =
        teams.filter(function(team) {

            return team.username ===
                currentUser.username;

        });


    if (myTeams.length === 0) {

        teamList.innerHTML = `
            <div class="card">
                <h3>No Teams Yet</h3>
                <p>
                    Create your first gaming team.
                </p>
            </div>
        `;

        return;
    }


    myTeams.forEach(
        function(team) {

            const card =
                document.createElement("div");

            card.className = "card";


            card.innerHTML = `

                <h3>👥 ${team.teamName}</h3>

                <p>
                    <b>Game:</b>
                    ${team.game}
                </p>

                <p>
                    <b>Captain:</b>
                    ${team.captain}
                </p>

                <p>
                    <b>Members:</b>
                    ${team.members.join(", ")}
                </p>

            `;


            teamList.appendChild(card);

        }
    );

}


/* =====================================================
   ADD TOURNAMENT - ADMIN
   ===================================================== */

function addTournament(event) {

    event.preventDefault();


    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        showMessage(
            "Admin access required!",
            "error"
        );

        return;
    }


    const name =
        document.getElementById(
            "tournamentName"
        ).value.trim();

    const game =
        document.getElementById(
            "tournamentGame"
        ).value;

    const date =
        document.getElementById(
            "tournamentDate"
        ).value;


    const newTournament = {

        id: Date.now(),

        name: name,

        game: game,

        date: date,

        mode: "Online"

    };


    tournaments.push(
        newTournament
    );


    localStorage.setItem(
        "tournaments",
        JSON.stringify(tournaments)
    );


    showMessage(
        "Tournament added successfully!",
        "success"
    );


    document.querySelector(
        "#adminDashboard form"
    ).reset();


    loadAdminDashboard();

}


/* =====================================================
   ADMIN DASHBOARD
   ===================================================== */

function loadAdminDashboard() {

    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        showPage("login");

        return;
    }


    document.getElementById(
        "adminUserCount"
    ).innerText =
        users.length;


    document.getElementById(
        "adminTournamentCount"
    ).innerText =
        tournaments.length;


    document.getElementById(
        "adminTeamCount"
    ).innerText =
        teams.length;


    loadUsersTable();

}


/* =====================================================
   USERS TABLE
   ===================================================== */

function loadUsersTable() {

    const table =
        document.getElementById(
            "usersTable"
        );


    table.innerHTML = "";


    if (users.length === 0) {

        table.innerHTML = `

            <tr>
                <td colspan="3">
                    No registered users
                </td>
            </tr>

        `;

        return;
    }


    users.forEach(
        function(user) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${user.name}
                </td>

                <td>
                    ${user.email}
                </td>

                <td>
                    ${user.username}
                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =====================================================
   LOAD MATCHES
   ===================================================== */

function loadMatches() {

    const table =
        document.getElementById(
            "matchTable"
        );


    table.innerHTML = "";


    matches.forEach(
        function(match) {

            const row =
                document.createElement("tr");


            let statusClass = "";


            if (match.status === "Live") {

                statusClass =
                    "status-live";

            }

            else {

                statusClass =
                    "status-upcoming";

            }


            row.innerHTML = `

                <td>
                    ${match.game}
                </td>

                <td>
                    ${match.team1}
                </td>

                <td>
                    ${match.team2}
                </td>

                <td>
                    ${match.date}
                </td>

                <td class="${statusClass}">
                    ${match.status}
                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =====================================================
   LOAD LEADERBOARD
   ===================================================== */

function loadLeaderboard() {

    const table =
        document.getElementById(
            "leaderboardTable"
        );


    table.innerHTML = "";


    /*
       Copy and sort leaderboard
    */

    const sortedLeaderboard =
        [...leaderboard].sort(
            function(a, b) {

                return b.points - a.points;

            }
        );


    sortedLeaderboard.forEach(
        function(team, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${team.team}
                </td>

                <td>
                    ${team.captain}
                </td>

                <td>
                    ${team.wins}
                </td>

                <td>
                    ${team.points}
                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =====================================================
   INITIAL PAGE LOAD
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
           Update navigation
        */

        updateNavbar();


        /*
           Load initial data
        */

        loadTournaments();

        loadMatches();

        loadLeaderboard();

    }
);