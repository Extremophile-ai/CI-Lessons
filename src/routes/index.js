import { Router } from "express";
import UserController from "../controller/User/user";

const router = Router();

const { createNewUser, getOneUserById, updateUser, getAllUsers, deleteUser, getUserByMail } = UserController;

router.get("/user/:_id", getOneUserById);
router.get("/users", getAllUsers);
// router.get("/user/email/:email", getUserByMail)
router.post("/user/signup", createNewUser);
router.patch("/user/profile/:_id", updateUser);
router.delete("/user/delete/:_id", deleteUser);

export default router;
