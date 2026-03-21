"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/user.routes.ts
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.get('/', user_controller_1.getAllUsers);
router.post('/', user_controller_1.createUser);
router.patch('/:id/role', user_controller_1.changeUserRole);
router.delete('/:id', user_controller_1.deleteUser);
exports.default = router;
