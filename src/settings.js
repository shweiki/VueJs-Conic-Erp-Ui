const start = new Date();

module.exports = {
  title: 'High  Fit',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,
  CashDrawerCOM : 'COM4',
  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,
  loginBackground:'https://i.ibb.co/dPSp7dp/ezgif-3-fa3e3985da64-min.jpg',
  showSidebar : true,
  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,
  sidebarOpen: true,
  showNavbar:true,
  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
  defaultdatepickerQuery: [new Date(start.getTime() - 3600 * 1000 * 24 * 7), new Date()],// start , End

  defaulttimeQuery : ['00:00:00', '23:59:59'],
  defaultpickerOptions : {
    shortcuts: [
      {
        text: "قبل أسبوع",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit("pick", [start, end]);
        },
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
