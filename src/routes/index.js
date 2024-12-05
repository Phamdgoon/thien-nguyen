import authRouter from "./auth";
import categoryRouter from "./category";
import campaignRouter from "./campaign";
import paymentRouter from "./payment";
import volunteerRouter from "./volunteer";
import userRouter from "./user";
import taskRouter from "./task";
import organizationRouter from "./organization";
import reportRouter from "./report";

const initRoutes = (app) => {
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/category", categoryRouter);
    app.use("/api/v1/campaign", campaignRouter);
    app.use("/api/v1/payment", paymentRouter);
    app.use("/api/v1/volunteer", volunteerRouter);
    app.use("/api/v1/task", taskRouter);
    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/organization", organizationRouter);
    app.use("/api/v1/report", reportRouter);

    return app.use("/", (req, res) => {
        res.send("Server on...");
    });
};

export default initRoutes;
