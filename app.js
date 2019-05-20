const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/", (req, res) => {
  console.log(req.query);
  res.json({
    message: "Hello there."
  });
});

app.get("/user/login", (req, res) => {
    /**Creates a token using the payload and the secret key. */
  jwt.sign(req.query, "thesecretkey", (err, token) => {
    if (err) {
      res.json({
        errors: [
          {
            id: 400,
            message: `Couldn't generate token.`
          }
        ]
      });
      throw err;
    }

    res.json({
      token
    });
  });
});

app.post("/user/settings", ascertainToken, (req, res) => {
    /** Verify the  token is valid against the secret key. This will decrypt the playload within the token.*/
  jwt.verify(req.token, "thesecretkey", (err, data) => {
    if (err) {
      res.status(403).json({
        message: err.message
      });
    } else {
        res.json({
            user: {
                username: data.username,
                password: data.password
            }
        });
    }
  });
});

/** Draws the token from the Authorization header, as the Authorization header value is formatted as `<type> <token>`, we only require <token> for vertification. */
function ascertainToken(req, res, next) {
  let authHeader = req.headers["authorization"];

  if (typeof authHeader === 'undefined') {
    res.status(403).json({
      message: "Auth header was undefined."
    });
  } else {
    let token = authHeader.split(" ")[1];
    req.token = token;
  }
  next();
}

app.listen(5000, () => {
  console.log("Express app is listening on port 5000.");
});
