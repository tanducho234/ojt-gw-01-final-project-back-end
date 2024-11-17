var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({
   users: [
     {
       id: 1,
       name: "John Doe",
       email: "john@example.com",
       role: "user"
     },
     {
       id: 2, 
       name: "Jane Smith",
       email: "jane@example.com",
       role: "admin"
     }
   ]
 });});

module.exports = router;
