import UserRepository from "../repositories/users.repository.js";
import { createHash } from "../utils/hash.js";

class SessionService {

    async register(data) {

        const {
            first_name,
            last_name,
            email,
            password
        } = data;

        if (
            !first_name ||
            !last_name ||
            !email ||
            !password
        ) {
            throw new Error("Faltan campos obligatorios");
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser =
            await UserRepository.getByEmail(normalizedEmail);

        if (existingUser) {
            throw new Error("El usuario ya existe");
        }

        const hashedPassword = await createHash(password);

        const newUser = await UserRepository.create({
            first_name,
            last_name,
            email: normalizedEmail,
            password: hashedPassword
        });

        return newUser;
    }
}

export default SessionService;