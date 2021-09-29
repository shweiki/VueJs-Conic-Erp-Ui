<template>
  <el-popover placement="left-start" width="100%" trigger="click">
    <label>Scanner:</label>
    <el-select v-model="scannerDevices">
      <el-option v-for="i in scannerDevices" :key="i" :label="i" :value="i"></el-option>
    </el-select>
    <label>Resolution (DPI):</label>
    <el-input v-model="resolution" />
    <label>Pixel Mode:</label>
    <el-select v-model="pixelMode">
      <el-option label="Grayscale" value="Grayscale"></el-option>
      <el-option label="Color" value="Color"></el-option>
    </el-select>
    <label>Image Format:</label>
    <el-select v-model="imageFormat">
      <el-option label="JPG" value="JPG"></el-option>
      <el-option label="PNG" value="PNG"></el-option>
    </el-select>
    <el-button @click="doScanning" type="primary">Scan Now...</el-button>
    <img id="scanOutput" />
    <el-button type="info" slot="reference">Scan Printer</el-button>
  </el-popover>
</template>
<script>
import JSPM from "jsprintmanager";
export default {
  data() {
    return {
      loading: false,
      scannerName: "",
      pixelMode: "Color",
      resolution: 200,
      imageFormat: "JPG",
      scannerDevices: [],
    };
  },
  created() {
    JSPM.JSPrintManager.auto_reconnect = true;
    JSPM.JSPrintManager.start();
    JSPM.JSPrintManager.WS.onStatusChanged = function () {
      if (this.jspmWSStatus) {
        //get scanners
        JSPM.JSPrintManager.getScanners().then(function (scannersList) {
          this.scannerDevices = scannersList;
        });
      }
    };
  },
  methods: {
    jspmWSStatus() {
      if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Open) return true;
      else if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Closed) {
        console.warn(
          "JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm"
        );
        return false;
      } else if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Blocked) {
        alert("JSPM has blocked this website!");
        return false;
      }
    },
    //Do scanning...
    doScanning() {
      if (this.jspmWSStatus()) {
        //create ClientScanJob
        var csj = new JSPM.ClientScanJob();
        //scanning settings
        csj.scannerName = this.scannerName;
        csj.pixelMode = JSPM.PixelMode[this.pixelMode];
        csj.resolution = parseInt(this.resolution);
        csj.imageFormat = JSPM.ScannerImageFormatOutput[this.imageFormat];
        //get output image
        csj.onUpdate = (data, last) => {
          if (!(data instanceof Blob)) {
            console.info(data);
            return;
          }
          var imgBlob = new Blob([data]);

          if (imgBlob.size == 0) return;

          var data_type = "image/jpg";
          if (csj.imageFormat == JSPM.ScannerImageFormatOutput.PNG)
            data_type = "image/png";
          //create html image obj from scan output
          var img = URL.createObjectURL(imgBlob, { type: data_type });
          //scale original image to be screen size friendly
          var imgScale = {
            width: Math.round((96.0 / csj.resolution) * 100.0) + "%",
            height: "auto",
          };
          console.log("imgScale", imgScale);
          console.log("img", img);
        };

        csj.onError = function (data, is_critical) {
          console.error(data);
        };

        //Send scan job to scanner!
        csj.sendToClient().then((data) => console.info(data));
      }
    },
  },
};
</script>
