<template>
  <!-- <el-popover placement="left-start" width="100%" trigger="click">
    <el-button
      v-bind:disabled="imagesScanned.length == 0"
      type="warning"
      @click="createData()"
      >{{ $t("AddVendors.Save") }}</el-button
    >
    <el-button @click="scanToJpg" type="primary">بدء</el-button>
  <div id="images"></div>
    <el-button
      icon="el-icon-receiving"
      type="success"
      slot="reference"
    ></el-button>
  </el-popover> -->

  <el-button icon="el-icon-receiving" type="success" @click="scanToJpg" />
</template>
<script>

import { Create } from '@/api/File'
export default {
  props: {
    objectId: {
      type: String,
      required: true
    },
    tableName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      imagesScanned: []
    }
  },
  methods: {
    scanToJpg() {
      scanner.scan(this.displayImagesOnPage, {
        output_settings: [
          {
            type: 'return-base64',
            format: 'jpg'
          }
        ]
      })
    },
    createData(scannedImage) {
      const file = {
        Id: undefined,
        FileType: 'image',
        File: scannedImage.src.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
        Status: 0,
        TableName: this.tableName,
        FKTable: this.objectId
      }
      Create(file).then((response) => {
        if (response) {
          this.imagesScanned.splice(0, 1)
          if (this.imagesScanned.length !== 0) {
            this.createData()
          } else {
            this.Visibles = false
            this.$notify({
              title: 'تم ',
              message: 'تم الإضافة بنجاح',
              type: 'success',
              duration: 2000
            })
          }
        }
      })
    },
    displayImagesOnPage(successful, mesg, response) {
      if (!successful) {
        // On error
        console.error('Failed: ' + mesg)
        return
      }
      if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) {
        // User cancelled.
        console.info('User cancelled')
        return
      }

      var scannedImages = scanner.getScannedImages(response, true, false) // returns an array of ScannedImage
      for (var i = 0; scannedImages instanceof Array && i < scannedImages.length; i++) {
        var scannedImage = scannedImages[i]
        this.imagesScanned.push(scannedImage)
        this.createData(scannedImage)

        // this.processScannedImage(scannedImage);
      }
    },
    processScannedImage(scannedImage) {
      this.imagesScanned.push(scannedImage)
      //  var elementImg = scanner.createDomElementFromModel({
      //    name: "img",
      //    attributes: {
      //       class: "scanned",
      //         src: scannedImage.src,
      //      },
      //    });
      // document.getElementById("images").appendChild(elementImg);
    }
  }
}
</script>
<style>
img.scanned {
  height: 200px; /** Sets the display size */
  margin-right: 12px;
}

div#images {
  margin-top: 20px;
}
</style>
