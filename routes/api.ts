import Route from '@core/Routes'
const ExtendMiddleware = require("@app/Middlewares/ExtendMiddleware");
const AuthApiMiddleware = require('@app/Middlewares/AuthApiMiddleware');
const multer = require('multer')
const upload = multer();
//const { permission, permissionResource, permissionMethod } = require('@app/Middlewares/PermissionMiddleware');

Route.group(() => {
  // ---------------------------------- Auth Routes ---------------------------------------//
  Route.post("/login", "AuthController.login").name('auth.login')
  Route.post("/forgotPassword", "AuthController.forgotPassword").name('auth.forgotPassword')
  Route.get("/checkToken/:token", "AuthController.checkToken").name('auth.checkToken')
  Route.post("/resetPassword", "AuthController.resetPassword").name('auth.resetPassword')
  Route.get("/rasa/test/:type", "RasaController.test").name('rasa.test')

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
    // ---------------------------------- User Routes ---------------------------------------//
    Route.resource("/users", "UserController").name('users') // CRUD
    Route.get("/users/generateOTP", "UserController.generateOTP").name('users.generateOTP')
    Route.post("/users/submitOTP", "UserController.submitOTP").name('users.submitOTP')
    Route.get("/users/getTags", "UserController.getTags").name('users.getTags')
    Route.get("/users/getInfo", "UserController.getInfo").name('users.getInfo')
    // ---------------------------------- End User Routes -----------------------------------//
    
    // ---------------------------------- Role Permission Routes ---------------------------------------//
    Route.get("/rolePermissions/getPermissionByGroupId", "RolePermissionController.getPermissionByGroupId").name('rolePermissions.getPermissionByGroupId')
    // ---------------------------------- End Role Permission Routes -----------------------------------//

    // ---------------------------------- Role Group Permission Routes ---------------------------------//
    Route.put("/rolePermissions/update", "RolePermissionController.update").name('rolePermissions.update')
    // ---------------------------------- End Role Group Permission Routes -----------------------------//

    // ---------------------------------- Role Group Routes ---------------------------------------//
    Route.resource("/roles", "RoleController").name('roles')
    Route.get("/roles/select2", "RoleController.select2").name('roles.select2')
    // Route.get("/roles/selectParent", "RoleController.selectParent").name('roles.selectParent')
    // ---------------------------------- End Role Group Routes -----------------------------------//

    // ---------------------------------- Setting Routes ---------------------------------------//

    Route.resource("/settings", "SettingController").name('settings')

    // ---------------------------------- End Routes -----------------------------------//
  }).middleware([AuthApiMiddleware])
}).middleware([ExtendMiddleware]).name('api').prefix("/api/v1")

