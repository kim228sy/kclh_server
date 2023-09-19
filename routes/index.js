const express = require("express");

const router = express.Router();
const employeeRouter = require("./employee");
const departmentRouter = require("./department");
// const plcRouter = require("./plc");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});
router.use("/employee", employeeRouter);
// router.use('/department', departmentRouter);
// router.use('/', plcRouter);

module.exports = router;
