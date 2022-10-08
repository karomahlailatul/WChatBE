const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
// const skillRouter = require("./skill")
// const workExperienceRouter = require("./workExperience")
// const portfolioRouter = require("./portfolio")
// const skillUsersRouter = require("./skillUsers")
// const recruiterRouter = require("./recruiter")
// const jobRouter = require("./job")
// const skillJobRouter = require("./skillJob")
// const jobApplyRouter = require("./jobApply")

router

    .use("/users", usersRouter)
    // .use("/skill", skillRouter)
    // .use("/work-experience", workExperienceRouter)
    // .use("/portfolio", portfolioRouter)
    // .use("/skill-users", skillUsersRouter)
    // .use("/recruiter", recruiterRouter)
    // .use("/job", jobRouter)
    // .use("/skill-job", skillJobRouter)
    // .use("/job-apply", jobApplyRouter)

module.exports = router;
 