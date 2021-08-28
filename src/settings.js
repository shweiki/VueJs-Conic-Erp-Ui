const start = new Date();

module.exports = {
    theme: '#74b9ff',
    title: 'High  Fit',
    language: 'ar',
    size: "mini",
    customtheme: false,
    showSettings: true,
    BusinessType: "SuperMarkit",
    tagsView: true,
    CashDrawerCOM: { COM: "COM7", OpenKeyBoard: 'F4' },
    fixedHeader: false,
    SidebarImage: '', // require("@/assets/Sidebar_images/sidebar-1.jpg"),
    loginBackground: '', // require("@/assets/Login_images/Login-1.jpg"),  
    showSidebar: true,
    sidebarLogo: true,
    sidebarOpen: true,
    showNavbar: true,
    showBarcode: false,
    showRestOfBill: false,
    BarcodeIsId: false,
    WithOutCheckItemIsExist: true,
    ToFixed: 2,
    LimitQurey: 20,
    LimitGetInvoice: 200,
    Sms: {
        baseURLSendSingleMessage: "",
        baseURLSendBulkMessages: "",
        senderid: "", //'High Fit'
        AccName: "", //'highfit',
        AccPass: "", //'D7!cT5!SgU0'
    },
    OutgoingMailServer: {
        SecureToken:"",//b713dae2-4536-43e1-99d7-fb7bfc9bff7a
        Host: "", //mail.privateemail.com
        Username: "", // hello@conic-isv.com
        Password: "", // *****
        From: "", // hello@conic-isv.com
    },
    errorLog: 'production',
    DateFormat: 'yyyy-MM-dd',
    DateTimeFormat: 'yyyy-MM-dd HH:mm',
    StatusQuery: 0,
    PointOfSale: {
        Layout: 'Public',
        WithImage: false
    },
    CashPoolLayout: 'Restaurant',
    PurchaseLayout: 'SuperMarket',
    WorkShopLayout: 'Pubilc',
    datepickerQuery: [Date(), Date()], // start , End
    timeQuery: ['00:00:00', '23:59:59'],
    printers: ['Casher', 'WorkTable1', 'WorkTable2'],
    triger: {
        "CheckMembers": {
            lock: false,
            LastRun: "July 21, 1983 01:15:00",
            OnClock: 7 /// 24 base
        }

    },
    windowStyle: 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1100,height=550,top=55,left=500',
    pickerOptions: {
        shortcuts: [{
            text: "اليوم",
            days: 0,
        },
        {
            text: "البارحة",
            days: 1,
        },
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
    },
    ItemMoveDec: [{
        value: "value",
        label: "label"
    },]
}