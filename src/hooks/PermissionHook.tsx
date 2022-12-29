import { checkPermission } from '@src/helpers/permission'
import auth from '@src/helpers/auth'

const PermissionHook = () => {
  const { user } = auth()
  const botObj = auth().getCookie('botObj') || {}
  const userPermissions = user ? { ...user.permissions, ...botObj } : {}

  const getUserPermission = () => {
    return userPermissions
  }

  const _checkPermission = (permissions: any) => {
    return checkPermission(permissions, userPermissions)
  }
  return {
    getUserPermission,
    checkPermission: _checkPermission
  }
}

export default PermissionHook
