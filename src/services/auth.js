import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
require("dotenv").config();

const hashPassword = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(12));

const RegisterService = ({ name, email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const roleData = await db.Role.findOne({
                where: { name: "User" },
            });
            if (!roleData) {
                return resolve({
                    err: 1,
                    msg: "Default role not found",
                });
            }

            const [user, created] = await db.User.findOrCreate({
                where: { email },
                defaults: {
                    name,
                    email,
                    password: hashPassword(password),
                    id: v4(),
                },
            });
            if (!created) {
                return resolve({
                    err: 2,
                    msg: "Email has been already used!",
                    token: null,
                });
            }
            const userRoleExists = await db.UserRole.findOne({
                where: { userId: user.id, roleId: roleData.id },
            });
            if (!userRoleExists) {
                await db.UserRole.create({
                    userId: user.id,
                    roleId: roleData.id,
                });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.SECRET_KEY,
                { expiresIn: "2d" }
            );
            resolve({
                err: 0,
                msg: "Register is successfully",
                token: token,
            });
        } catch (error) {
            reject(error);
        }
    });
const RegisterOrganizationService = ({
    name,
    email,
    password,
    phone,
    address,
}) =>
    new Promise(async (resolve, reject) => {
        try {
            const roleData = await db.Role.findOne({
                where: { name: "Organization" },
            });
            if (!roleData) {
                return resolve({
                    err: 1,
                    msg: "Default role not found",
                });
            }

            const [organization, created] = await db.Organization.findOrCreate({
                where: { email },
                defaults: {
                    name,
                    email,
                    password: hashPassword(password),
                    phone,
                    address,
                    id: v4(),
                },
            });
            if (!created) {
                return resolve({
                    err: 2,
                    msg: "Email has been already used!",
                    token: null,
                });
            }
            const userRoleExists = await db.UserRole.findOne({
                where: { organizationId: organization.id, roleId: roleData.id },
            });
            if (!userRoleExists) {
                await db.UserRole.create({
                    organizationId: organization.id,
                    roleId: roleData.id,
                });
            }

            const token = jwt.sign(
                { id: organization.id, email: organization.email },
                process.env.SECRET_KEY,
                { expiresIn: "2d" }
            );
            resolve({
                err: 0,
                msg: "Register is successfully",
                token: token,
            });
        } catch (error) {
            reject(error);
        }
    });

const LoginService = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOne({
                where: { email },
                raw: true,
            });
            if (!response) {
                return resolve({
                    err: 2,
                    msg: "Email not found!",
                    token: null,
                    userId: null,
                    roleName: null,
                });
            }
            const userRole = await db.UserRole.findOne({
                where: { userId: response.id },
                include: [
                    {
                        model: db.Role,
                        attributes: ["name"],
                        as: "role",
                    },
                ],
                raw: true,
                nest: true,
            });
            const isCorrectPassword =
                response && bcrypt.compareSync(password, response.password);
            const token =
                isCorrectPassword &&
                jwt.sign(
                    { id: response.id, email: response.email },
                    process.env.SECRET_KEY,
                    { expiresIn: "2d" }
                );
            resolve({
                err: token ? 0 : 2,
                msg: token
                    ? "Login is successfully"
                    : response
                    ? "Password is wrong!"
                    : "email not found!",
                token: token || null,
                userId: token ? response.id : null,
                roleName: token ? userRole?.role?.name : null,
            });
        } catch (error) {
            reject(error);
        }
    });

const LoginOrganizationService = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Organization.findOne({
                where: { email },
                raw: true,
            });
            const isCorrectPassword =
                response && bcrypt.compareSync(password, response.password);
            const token =
                isCorrectPassword &&
                jwt.sign(
                    { id: response.id, email: response.email },
                    process.env.SECRET_KEY,
                    { expiresIn: "2d" }
                );
            resolve({
                err: token ? 0 : 2,
                msg: token
                    ? "Login is successfully"
                    : response
                    ? "Password is wrong!"
                    : "email not found!",
                token: token || null,
                organizationId: token ? response.id : null,
            });
        } catch (error) {
            reject(error);
        }
    });

const LoginAdminService = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Tìm người dùng theo email
            const response = await db.User.findOne({
                where: { email },
                raw: true,
            });
            if (!response) {
                return resolve({
                    err: 2,
                    msg: "Email not found!",
                    token: null,
                    userId: null,
                    roleName: null,
                });
            }

            // Kiểm tra roleId và roleName của người dùng
            const userRole = await db.UserRole.findOne({
                where: { userId: response.id },
                include: [
                    {
                        model: db.Role,
                        attributes: ["name", "id"], // Lấy cả name và id của role
                        as: "role",
                    },
                ],
                raw: true,
                nest: true,
            });

            // Kiểm tra xem roleId có phải là 1 và roleName có phải là "Admin"
            if (userRole?.role?.id !== 1 || userRole?.role?.name !== "Admin") {
                return resolve({
                    err: 4,
                    msg: "Tài khoản này không có quyền truy cập!",
                    token: null,
                    userId: null,
                    roleName: null,
                });
            }

            // Kiểm tra mật khẩu đúng không
            const isCorrectPassword =
                response && bcrypt.compareSync(password, response.password);

            const token =
                isCorrectPassword &&
                jwt.sign(
                    {
                        id: response.id,
                        email: response.email,
                        role: userRole?.role?.name,
                    },
                    process.env.SECRET_KEY,
                    { expiresIn: "2d" }
                );

            resolve({
                err: token ? 0 : 2,
                msg: token ? "Login is successful" : "Password is wrong!",
                token: token || null,
                userId: token ? response.id : null,
                roleName: token ? userRole?.role?.name : null,
            });
        } catch (error) {
            reject(error);
        }
    });

const ChangeRoleService = async (userId) =>
    new Promise(async (resolve, reject) => {
        try {
            const roleData = await db.Role.findOne({
                where: { name: "Organization" },
            });
            if (!roleData) {
                return resolve({
                    err: 1,
                    msg: "Role not found",
                });
            }
            const userRole = await db.UserRole.findOne({
                where: { userId: userId },
            });

            if (userRole.roleId === roleData.id) {
                return resolve({
                    err: 2,
                    msg: "User already has this role",
                });
            }

            await db.UserRole.update(
                { roleId: roleData.id },
                { where: { userId: userId } }
            );

            resolve({
                err: 0,
                msg: "Role changed successfully",
            });
        } catch (error) {
            reject(error);
        }
    });

module.exports = {
    RegisterService,
    RegisterOrganizationService,
    LoginService,
    LoginOrganizationService,
    ChangeRoleService,
    LoginAdminService,
};
