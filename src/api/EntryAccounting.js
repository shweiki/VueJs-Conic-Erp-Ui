import request from '@/utils/RequestApi'
import qs from 'qs';
import i18n from "@/lang";

export function GetEntryAccounting(query) {
    return request({
        url: '/EntryAccounting/GetEntryAccounting',
        method: 'get',
        params: query
    })
}
export function GetByListQ(data) {
    return request({
        url: '/EntryAccounting/GetByListQ',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function GetAccountStatement(data) {
    return request({
        url: '/EntryAccounting/GetAccountStatement',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function GetEntryById(query) {
    return request({
        url: '/EntryAccounting/GetEntryById',
        method: 'get',
        params: query
    })
}
export function Edit(data) {
    return request({
        url: '/EntryAccounting/Edit',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function EditEntryByFktable(data) {
    return request({
        url: '/EntryAccounting/EditEntryByFktable',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function CreateEntry(data) {
    return request({
        url: '/EntryAccounting/Create',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function GenerateSaleInvoiceEntry(temp, vendor, InComeAccountId, CashAccountId ,BankAccountId) {
    return new Promise((resolve, reject) => {
        console.log("vendor" ,vendor)
        let E = {
            Id: undefined,
            FakeDate: temp.FakeDate,
            Description: "",
            Type: "Auto",
            EntryMovements: [
                {
                    Id: undefined,
                    AccountId: vendor.AccountId,
                    Debit: 0.0,
                    Credit: temp.Total,
                    Description: "فاتورة مبيعات " + i18n.t("PaymentMethod." + temp.PaymentMethod + "") // translate  PaymentMethod
                        + " رقم " + temp.Id + " ",
                    EntryId: undefined,
                    TableName: "SaleInvoice",
                    Fktable: temp.Id,
                },
                {
                    Id: undefined,
                    AccountId: InComeAccountId,
                    Debit: temp.Total,
                    Credit: 0.0,
                    Description:
                        "فاتورة مبيعات " +
                        vendor.Name + "  " +
                        i18n.t("PaymentMethod." + temp.PaymentMethod + "") // translate  PaymentMethod
                        + " رقم " +
                        temp.Id +
                        " ",
                    EntryId: undefined,
                    TableName: "SaleInvoice",
                    Fktable: temp.Id,
                }
            ],
        };
        if (temp.PaymentMethod == "Cash") {
            E.EntryMovements.push({
                Id: undefined,
                AccountId: vendor.AccountId,
                Debit: temp.Total,
                Credit: 0,
                Description: "تسديد فاتورة مبيعات رقم " + temp.Id + " ",
                EntryId: undefined,
                TableName: "SaleInvoice",
                Fktable: temp.Id,
            },
                {
                    Id: undefined,
                    AccountId: CashAccountId,
                    Debit: 0.0,
                    Credit: temp.Total,
                    Description:
                        "فاتورة مبيعات " +
                        vendor.Name +
                        i18n.t("PaymentMethod." + temp.PaymentMethod + "") // translate  PaymentMethod
                        + "  رقم " +
                        temp.Id +
                        " ",
                    EntryId: undefined,
                    TableName: "SaleInvoice",
                    Fktable: temp.Id,
                });
        }
        if (temp.PaymentMethod == "Visa") {
            E.EntryMovements.push({
                Id: undefined,
                AccountId: vendor.AccountId,
                Debit: temp.Total,
                Credit: 0,
                Description: "تسديد فاتورة مبيعات رقم " + temp.Id + " ",
                EntryId: undefined,
                TableName: "SaleInvoice",
                Fktable: temp.Id,
            },
                {
                    Id: undefined,
                    AccountId: BankAccountId,
                    Debit: 0.0,
                    Credit: temp.Total,
                    Description:
                        "فاتورة مبيعات " +
                        vendor.Name +
                        i18n.t("PaymentMethod." + temp.PaymentMethod + "") // translate  PaymentMethod
                        + "  رقم " +
                        temp.Id +
                        " ",
                    EntryId: undefined,
                    TableName: "SaleInvoice",
                    Fktable: temp.Id,
                });
        }
        if (temp.PaymentMethod == "Cheque") {
            E.EntryMovements.push({
                Id: undefined,
                AccountId: vendor.AccountId,
                Debit: temp.Total,
                Credit: 0,
                Description: "تسديد فاتورة مبيعات رقم " + temp.Id + " ",
                EntryId: undefined,
                TableName: "SaleInvoice",
                Fktable: temp.Id,
            },
                {
                    Id: undefined,
                    AccountId: BankAccountId,
                    Debit: 0.0,
                    Credit: temp.Total,
                    Description:
                        "فاتورة مبيعات " +
                        vendor.Name +
                        i18n.t("PaymentMethod." + temp.PaymentMethod + "") // translate  PaymentMethod
                        + "  رقم " +
                        temp.Id +
                        " ",
                    EntryId: undefined,
                    TableName: "SaleInvoice",
                    Fktable: temp.Id,
                });
        }
        resolve(E);
    })
}
