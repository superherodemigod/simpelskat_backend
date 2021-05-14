/* eslint-disable */
const functions = require("firebase-functions");
const express = require("express");
const PORT = 3000;
const app = express();
const cors = require('cors');
const distance = require("google-distance-matrix");
/* JSON body parse*/
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())
app.get("/hello", (req, res, next) => {
  console.info("/hello call success ");
  res.send("Welcome to Firebase Cloud Functions");
});
app.get("/distance", (req, res) => {
  console.info("request----", req.query,"response---")
  const origins = [req.query.origins];
  const destinations = [req.query.destinations];

  distance.key("AIzaSyBqe3VqmeQq6VECQVvY3dMSmax8zYol4jc");
  distance.matrix(origins, destinations, function(err, distances) {
    if (err) {
      return console.log(err);
    }
    if (!distances) {
      return console.log("no distances");
    }
    if (distances.status == "OK") {
      const origin = distances.origin_addresses[0];
      const destination = distances.destination_addresses[0];
      if (distances.rows[0].elements[0].status == "OK") {
        let distance = distances.rows[0].elements[0].distance.text;
        distance = distance.split(" ")[0];
        console.log("Distance from " + origin + " to " + destination + " is " + distance);
        res.send(distance);
      } else {
        console.log(destination + " is not reachable by land from " + origin);
        res.send("no distance");
      }
    }
  });
});
app.listen(PORT, () => {
  console.info("Server is running on PORT:", PORT);
});
exports.app = functions.https.onRequest(app);
