const express = require('express')
const mysql = require('mysql');
const app = express();
app.use(express.json());


// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'api-mysql',
    port: '3306'
})
connection.connect((err) => {
    if (err) {
        console.log('error connecting to MySQL database =', err);
        return

    }
    console.log('joy!');
})


// create router
app.post("/create", async (req, res) => {
    const { email, fullname, password } = req.body;
    try {
        connection.query(
            "insert into users(email,fullname,password) VALUES(?,?,?)",
            [email, fullname, password],
            (err, results, fields) => {

                if (err) {
                    console.log("Error while inserting a user into the database", err);
                    return res.status(400).send();
                }
                return res.status(201).json({ message: "New user successfully created" });
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
})

// read
app.get("/read", async (req, res) => {
    try {
        connection.query("SELECT * From users", (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();

            }
            res.status(200.).json(results)
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send();

    }
})

// read single users from db
app.get("/read/single/:email", async (req, res) => {
    const email = req.params.email;
    try {
        connection.query("SELECT * FROM users WHERE email = ?", [email], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200.).json(results)
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send();

    }
})

//  update data
app.patch("/update/:email", async (req, res) => {
    const email = req.params.email;
    const fullname = req.body.fullname

    try {
        connection.query("UPDATE users SET fullname = ? WHERE email = ?", [fullname, email], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200.).json({ message: "users password update successfully!" });
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send();

    }
})

// delete
app.delete("/delete/:email", async (req, res) => {
    const email = req.params.email;
    try {
        connection.query("delete from users where email = ?", [email], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "NO users with that email" });

            }
            return res.status(200).json({ message: "Users delete successfully!" });
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send();

    }

})
// read two password and email
app.get("/read/two/:password", async (req, res) => {
    const password = req.params.password
    const fullname = req.params.fullname

    function sum(password, fullname) {
        return password + fullname;

    }
    console.log(sum);

// ยังรวมชื่อไม่ได้
    // ฟังชั่น 

    try {
        connection.query("SELECT * FROM users WHERE password = ? AND fullname = ?", [password, fullname], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200.).json({ message: "search successfully!" })
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "error ดีตายมึงแทะ" });

    }
})

app.listen(3000, () => console.log('START'));