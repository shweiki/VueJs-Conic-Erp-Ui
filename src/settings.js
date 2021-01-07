const start = new Date();


module.exports = {
  theme:'#74b9ff',
  title: 'High  Fit',
  language: 'ar',
  size: "mini",
  customtheme :false,
  showSettings: true,
  BusinessType: "SuperMarkit",
  tagsView: true,
  CashDrawerCOM: 'COM4',
  fixedHeader: false,
  SidebarImage:'',// require("@/assets/Sidebar_images/sidebar-1.jpg"),
  loginBackground :'',// require("@/assets/Login_images/Login-1.jpg"),  
  showSidebar: true,
  sidebarLogo: true,
  sidebarOpen: true,
  showNavbar: true,
  showBarcode: false,
  BarcodeIsID: false,
  WithOutCheckItemIsExist : true ,
  errorLog: 'production',
  datepickerQuery: [new Date(start.getTime() - 3600 * 1000 * 24 * 7), new Date()],// start , End
  timeQuery: ['00:00:00', '23:59:59'],
  pickerOptions: {
    shortcuts: [
      {
        text: "قبل أسبوع",
        days: 7,
      },
      {
        text: "قبل شهر",
        days: 30,
      },
      {
        text: "قبل 3 أشهر",
        days: 90,
      },
      {
        text: "قبل 1 سنة",
        days: 365,
      },
    ],
  }
}
