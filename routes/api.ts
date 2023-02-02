import Route from '@core/Routes'
const ExtendMiddleware = require("@app/Middlewares/ExtendMiddleware");
const AuthApiMiddleware = require('@app/Middlewares/AuthApiMiddleware');
const multer = require('multer')
import  PermissionMiddleware  from "@app/Middlewares/PermissionMiddleware"
import { v4 as uuidv4 } from "uuid";
const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const { permission, permissionResource, permissionMethod } = PermissionMiddleware

const DIR = './public/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now()+ '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
 Route.router.post('/upload', upload.single('profileImg'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  const url = req.protocol + '://' + req.get('host');
  //url + '/public/' + req.file.filename
  res.status(201).json({
    message: "User profile image upload successfully!",
    profileImg: url + '/public/' + req.file.filename
  })
})

Route.group(() => {
  // ---------------------------------- Auth Routes ---------------------------------------//
  Route.post("/login", "AuthController.login").name('auth.login')
  Route.post("/forgotPassword", "AuthController.forgotPassword").name('auth.forgotPassword')
  Route.get("/checkToken/:token", "AuthController.checkToken").name('auth.checkToken')
  Route.post("/resetPassword", "AuthController.resetPassword").name('auth.resetPassword')

  // ---------------------------------- End Auth Routes -----------------------------------//

  // ---------------------------------- Route Routes ---------------------------------------//
  Route.get("/routes", "RouteController.index").name('routes.index')
  // ---------------------------------- End Route Routes -----------------------------------//

  // ---------------------------------- Route Document Routes ---------------------------------------//
  Route.resource("/documents", "DocumentController").name('documents')
  // ---------------------------------- End Route Document Routes -----------------------------------//

  // ---------------------------------- Route DocumentTemplate Routes ---------------------------------------//
  Route.resource("/document_templates", "DocumentTemplateController").name('document_templates')
  // Route.group(() => {

  // })
  // ---------------------------------- End Route Document Routes -----------------------------------//

  Route.group(() => {
    Route.post("/changePassword", "AuthController.changePassword").name("auth.changePassword")
    Route.post("/logout", "AuthController.logout").name('auth.logout')
    Route.post("/auth/getPermissionBot", "AuthController.getPermissionBot").name('auth.getPermissionBot')
    Route.post("/refreshToken", "AuthController.refreshToken").name('auth.refreshToken')
    Route.post("/auth/getRoleBotUser", "AuthController.getRoleBotUser").name('auth.getRoleBotUser')
    Route.post("/AuthTwofa", "AuthController.AuthTwofa").name('auth.AuthTwofa')
    
    // ---------------------------------- User Routes ---------------------------------------//
    Route.resource("/users", "UserController").name('users').middleware([
      permissionResource(['users'])
    ]) // CRUD
    Route.get("/users/generateOTP", "UserController.generateOTP").name('users.generateOTP').middleware([
      permission({ 'users': 'R' })
    ])
    Route.post("/users/submitOTP", "UserController.submitOTP").name('users.submitOTP')
    Route.get("/users/getInfo", "UserController.getInfo").name('users.getInfo').middleware([
      permission({ 'users': 'R' })
    ])
    // ---------------------------------- End User Routes -----------------------------------//

    // ---------------------------------- Role Permission Routes ---------------------------------------//
    Route.get("/rolePermissions/getPermissionByGroupId", "RolePermissionController.getPermissionByGroupId")
    .name('rolePermissions.getPermissionByGroupId').middleware([
      permission({ 'roles': 'R' })
    ])
    // ---------------------------------- End Role Permission Routes -----------------------------------//

    // ---------------------------------- Role Group Permission Routes ---------------------------------//
    Route.put("/rolePermissions/update", "RolePermissionController.update").name('rolePermissions.update').middleware([
      permission({ 'adminDecentralization': 'U' })
    ])
    // ---------------------------------- End Role Group Permission Routes -----------------------------//

    // ---------------------------------- Role Group Routes ---------------------------------------//
    Route.resource("/roles", "RoleController").name('roles').middleware([
      permissionResource(['roles'])
    ])
    Route.get("/roles/select2", "RoleController.select2").name('roles.select2').middleware([
      permission({ 'roles': 'R' })
    ])
    // Route.get("/roles/selectParent", "RoleController.selectParent").name('roles.selectParent')
    // ---------------------------------- End Role Group Routes -----------------------------------//

    // ---------------------------------- Setting Routes ---------------------------------------//

    Route.resource("/settings", "SettingController").name('settings')

    // ---------------------------------- tenants Routes ---------------------------------------//

    Route.post("/tenants/active", "TenantController.activeTenants").name('tenants.activeTenants').middleware([
      permission({ 'tenants': 'A' })
    ])
    Route.resource("/tenants", "TenantController").name('tenants').middleware([
      permissionResource(['tenants'])
    ])

    // ---------------------------------- End tenants Routes -----------------------------------//

    // ---------------------------------- End Routes -----------------------------------//
  }).middleware([AuthApiMiddleware])
}).middleware([ExtendMiddleware]).name('api').prefix("/api/v1")

