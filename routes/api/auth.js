const express = require("express");

const ctrl = require("../../controllers/auth/auth");
const { validateRequest, auth, upload } = require("../../middlewares");
const { joiRegisterSchema, joiLoginSchema, verifyEmailSchema } = require("../../models/user")

const router = express.Router();

router.post("/register", validateRequest(joiRegisterSchema), ctrl.register)
router.get("/verify/:verificationToken", ctrl.verifyEmail)
router.post("/verify", validateRequest(verifyEmailSchema), ctrl.resendVerifyEmail)
// router.post("/signup")
router.post("/login", validateRequest(joiLoginSchema), ctrl.login)
// router.post("/signin")
router.get("/current", auth, ctrl.getCurrent)
router.get("/logout", auth, ctrl.logout)

router.patch("/avatars", auth, upload.single("avatar"),  ctrl.updateAvatar)

module.exports = router;