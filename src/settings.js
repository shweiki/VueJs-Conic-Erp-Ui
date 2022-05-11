module.exports = {
    theme: "#74b9ff",
    title: "High  Fit",
    language: "ar",
    size: "mini",
    customtheme: false,
    showSettings: true,
    BusinessType: "SuperMarkit",
    tagsView: true,
    CashDrawerCOM: { COM: "COM7", OpenKeyBoard: "F4" },
    fixedHeader: false,
    SidebarImage: "", // require("@/assets/Sidebar_images/sidebar-1.jpg"),
    loginBackground: "", // require("@/assets/Login_images/Login-1.jpg"),  
    showSidebar: true,
    sidebarLogo: true,
    sidebarOpen: true,
    showNavbar: true,
    showBarcode: false,
    showRestOfBill: false,
    BarcodeIsId: false,
    WithOutCheckItemIsExist: true,
    OrderIsAutomatic: false,
    ToFixed: 2,
    LimitQurey: 20,
    LimitGetInvoice: 200,
    Sms: {
        baseURLSendSingleMessage: "",
        baseURLSendBulkMessages: "",
        senderid: "", //"High Fit"
        AccName: "", //"highfit",
        AccPass: "", //"D7!cT5!SgU0"
    },
    OutgoingMailServer: {
        SecureToken: "",//b713dae2-4536-43e1-99d7-fb7bfc9bff7a
        Host: "", //mail.privateemail.com
        Username: "", // hello@conic-isv.com
        Password: "", // *****
        From: "", // hello@conic-isv.com
    },
    errorLog: "production",
    DateTimeFormat: "yyyy-MM-dd HH:mm",
    StatusQuery: 0,
    Member: {
        CheckMemberIsExist: true,
        SsnIsRequired: false,

    },
    Employee: {
        CheckEmployeeIsExist: true,
    },
    Dashboard: {
        Layout: "Public",
        ShowPanelGroup: {
            Items: true,
            Members: true,
            MembersActive: true,
            MsgCredit: true,
            Clients: true,
            Suppliers: true,
            Purchases: true,
            Sales: true,
            Visits: true,

        }
    },
    PointOfSale: {
        Layout: "Public",
        WithImage: false,
        QtyCounter: false,
        CreateEntry: false,
        CreateDelivery: false,
        CheckQtyItem: false,
        DeliveryUrl: "http://localhost:8090/test1/OrderDelivery/Create"
    },
    Purchase: {
        Layout: "Public",
        BillOfEntery: true,
        QtyCounter: false,
        CreateEntry: false,
    },
    CashPoolLayout: "Restaurant",
    WorkShopLayout: "Pubilc",
    Payment: {
        Layout: "Public",
        CreateEntry: true
    },
    Receive: {
        Layout: "Public",
        CreateEntry: true
    },
    MembershipMovement: {
        OneInBodyFreeForeach30Days: false,
        InComeAccountId: 2,
    },
    Visit: {
        Layout: "Public",
        CreateEntry: false
    },
    timeQuery: ["00:00:00", "23:59:59"],
    printers: ["Casher", "WorkTable1", "WorkTable2"],
    triger: {
        "BackUp": {
            turnOn: true,
            Directory: "C:\\BackUp\\",
            LastRun: "July 21, 1983 01:15:00",
            OnClock: 24 /// 24 base
        },
        "CheckMembers": {
            turnOn: false,
            LastRun: "July 21, 1983 01:15:00",
            OnClock: 7 /// 24 base
        }
    },
    windowStyle: "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1100,height=550,top=55,left=500",
    pickerOptions: {
        shortcuts: [{
            text: "اليوم",
            days: 0,
            default: false,

        },
        {
            text: "البارحة",
            days: 1,
            default: true,
        },
        {
            text: "قبل أسبوع",
            days: 7,
            default: false,
        },
        {
            text: "قبل شهر",
            days: 30,
            default: false,
        },
        {
            text: "قبل 3 أشهر",
            days: 90,
            default: false,
        },
        {
            text: "قبل 1 سنة",
            days: 365,
            default: false,
        },
        ],
    },
    ItemMoveDec: [{
        value: "value",
        label: "label"
    },]
}