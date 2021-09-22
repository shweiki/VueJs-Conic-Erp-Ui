
import JSPM from "jsprintmanager";
import store from '@/store'

export default function getPrinterDevice() {
  if (JSPM.JSPrintManager.auto_reconnect) return true
  JSPM.JSPrintManager.auto_reconnect = true;
  JSPM.JSPrintManager.start();
  JSPM.JSPrintManager.WS.onStatusChanged = () => {
    store.dispatch("app/setPrinters");
  };
  return true
}
