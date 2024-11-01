const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database.db');

// Set up EJS as the templating engine
app.set('view engine', 'ejs');

// Set up static file directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Initialize the database with tables and sample data
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS devices (id INTEGER PRIMARY KEY, name TEXT, type TEXT, status TEXT DEFAULT 'off')");
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, role TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS schedules (id INTEGER PRIMARY KEY, device_id INTEGER, action TEXT, schedule_time TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS alerts (id INTEGER PRIMARY KEY, message TEXT, status TEXT DEFAULT 'unread')");

    // Check if the users table is empty
    db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
        if (err) return console.error(err.message);
        if (row.count === 0) {
            // Insert sample users
            const users = [
                { username: 'Alice', role: 'Admin' },
                { username: 'Bob', role: 'Homeowner' },
                { username: 'Charlie', role: 'Technician' }
            ];
            const insertUser = db.prepare("INSERT INTO users (username, role) VALUES (?, ?)");
            users.forEach(user => {
                insertUser.run(user.username, user.role);
            });
            insertUser.finalize();
            console.log("Sample users added to the database.");
        }
    });
});

// Home route (Dashboard)
app.get('/', (req, res) => {
    res.render('dashboard');
});

// Devices page
app.get('/devices', (req, res) => {
    db.all("SELECT * FROM devices", (err, rows) => {
        if (err) console.error(err);
        res.render('devices', { devices: rows });
    });
});

// Add device route
app.post('/add_device', (req, res) => {
    const { name, type } = req.body;
    db.run("INSERT INTO devices (name, type) VALUES (?, ?)", [name, type], (err) => {
        if (err) console.error(err);
        res.redirect('/devices');
    });
});

// Toggle device status
app.post('/toggle_device/:id', (req, res) => {
    const deviceId = req.params.id;
    db.get("SELECT status FROM devices WHERE id = ?", [deviceId], (err, row) => {
        if (err) console.error(err);
        const newStatus = row.status === 'on' ? 'off' : 'on';
        db.run("UPDATE devices SET status = ? WHERE id = ?", [newStatus, deviceId], (err) => {
            if (err) console.error(err);
            res.redirect('/devices');
        });
    });
});

// Roles page
app.get('/roles', (req, res) => {
    db.all("SELECT * FROM users", (err, rows) => {
        if (err) console.error(err);
        res.render('roles', { users: rows });
    });
});

// Modify user role
app.post('/modify_role/:id', (req, res) => {
    const userId = req.params.id;
    const newRole = req.body.role;
    db.run("UPDATE users SET role = ? WHERE id = ?", [newRole, userId], (err) => {
        if (err) console.error(err);
        res.redirect('/roles');
    });
});

// Schedule page with detailed schedule display
app.get('/schedules', (req, res) => {
    db.all(`
        SELECT schedules.id, devices.name AS device_name, schedules.action, schedules.schedule_time 
        FROM schedules
        JOIN devices ON schedules.device_id = devices.id
    `, (err, rows) => {
        if (err) console.error(err);
        db.all("SELECT * FROM devices", (err, devices) => {
            if (err) console.error(err);
            res.render('schedules', { schedules: rows, devices: devices });
        });
    });
});

// Add schedule
app.post('/add_schedule', (req, res) => {
    const { device_id, action, schedule_time } = req.body;
    db.run("INSERT INTO schedules (device_id, action, schedule_time) VALUES (?, ?, ?)", [device_id, action, schedule_time], (err) => {
        if (err) console.error(err);
        res.redirect('/schedules');
    });
});

// Diagnostics page
app.get('/diagnostics', (req, res) => {
    db.all("SELECT * FROM devices", (err, rows) => {
        if (err) console.error(err);
        res.render('diagnostics', { devices: rows });
    });
});

// Run diagnostics
app.post('/run_diagnostics/:id', (req, res) => {
    const deviceId = req.params.id;
    const health = Math.random() > 0.5 ? 'healthy' : 'issue';
    db.run("UPDATE devices SET status = ? WHERE id = ?", [health, deviceId], (err) => {
        if (err) console.error(err);
        res.redirect('/diagnostics');
    });
});

// Alerts page
app.get('/alerts', (req, res) => {
    db.all("SELECT * FROM alerts", (err, rows) => {
        if (err) console.error(err);
        res.render('alerts', { alerts: rows });
    });
});

// Acknowledge alert
app.post('/acknowledge_alert/:id', (req, res) => {
    const alertId = req.params.id;
    db.run("UPDATE alerts SET status = 'read' WHERE id = ?", [alertId], (err) => {
        if (err) console.error(err);
        res.redirect('/alerts');
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
