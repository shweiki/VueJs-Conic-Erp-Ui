import { Settings } from "@/layout/components"

const getters = {

  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  AllItems: state => state.Items.AllItems,
  ActiveItems: state => state.Items.ActiveItems,
  AllMembers: state => state.Members.AllMembers,
  ActiveMembers: state => state.Members.ActiveMembers,
  SettingsApp: state => state.Settings,

  CompanyInfo: state => state.CompanyInfo.GetCompanyInfo,
  Devices: state => state.Devices.AllDevices,
  Editors: state => state.Editors.Editors,

  ZtkDoor: state => state.Devices.ZtkDoor,


}
export default getters
