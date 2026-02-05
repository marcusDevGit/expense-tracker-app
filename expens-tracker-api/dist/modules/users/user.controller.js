import { UserService } from "./user.service.js";
const userService = new UserService();
export class UserController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await userService.create({ name, email, password });
            return res.status(201).json(user);
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
    async getProfile(req, res) { }
    async updateProfile(req, res) { }
    async deleteProfile(req, res) { }
}
