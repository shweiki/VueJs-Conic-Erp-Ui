const start = new Date();

module.exports = {
  title: 'High  Fit',
  language: 'ar',
  size: "mini",
  showSettings: true,
  BusinessType: "SuperMarkit",
  tagsView: true,
  CashDrawerCOM: 'COM4',
  fixedHeader: false,
  loginBackground: 'https://i.ibb.co/dPSp7dp/ezgif-3-fa3e3985da64-min.jpg',
  showSidebar: true,
  sidebarLogo: true,
  sidebarOpen: true,
  showNavbar: true,
  showBarcode: false,
  errorLog: 'production',
  datepickerQuery: [new Date(start.getTime() - 3600 * 1000 * 24 * 7), new Date()],// start , End
  timeQuery: ['00:00:00', '23:59:59'],
  pickerOptions: {
    shortcuts: [
      {
        text: "قبل أسبوع" ,
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit("pick", [start, end]);
        }
      },
      {
        text: "قبل شهر",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit("pick", [start, end]);
        },
      },
      {
        text: "قبل 3 أشهر",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit("pick", [start, end]);
        },
      },
      {
        text: "قبل 1 سنة",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
          picker.$emit("pick", [start, end]);
        },
      },
    ],
  }
}
