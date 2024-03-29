import { Router } from "express";

import { signUp, login, getAllPerson, resetPassword, updatePassword, getSinglePerson } from "../controller/personController.js"
import { verifyToken } from "../config/isAuth.js";

const router = Router();

router.route('/allPerson').get(verifyToken, getAllPerson);
router.route('/allPerson/:id').get(verifyToken, getSinglePerson);
// router.route('/allperson').get( getAllPerson);
router.route('/signup').post(signUp);
router.route('/login').post(login);
router.route('/resetPassword').post(resetPassword);
// router.route('/updatePassword/:personId/:resetToken').post(updatePassword);
router.route('/updatePassword').post(updatePassword);

export default router;