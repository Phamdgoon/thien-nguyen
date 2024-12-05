import * as authService from "../services/auth";

const Register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if ((!name, !email || !password)) {
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });
        }
        const response = await authService.RegisterService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Fail at auth controller: " + error,
        });
    }
};
const RegisterOrganization = async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    try {
        if ((!name, !email || !password || !phone || !address)) {
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });
        }
        const response = await authService.RegisterOrganizationService(
            req.body
        );
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Fail at auth controller: " + error,
        });
    }
};

const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });
        }
        const response = await authService.LoginService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Fail at auth controller: " + error,
        });
    }
};
const LoginOrganization = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });
        }
        const response = await authService.LoginOrganizationService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Fail at auth controller: " + error,
        });
    }
};

const ChangeRole = async (req, res) => {
    const userId = req.user.id;
    try {
        const response = await authService.ChangeRoleService(userId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Fail at change role controller: " + error,
        });
    }
};

module.exports = {
    Register,
    LoginOrganization,
    RegisterOrganization,
    Login,
    ChangeRole,
};
