<template>
  <div class="demo-image__preview">
    <el-row type="flex">
      <el-col :span="6">
        <button-scan :object-id="objectId" :table-name="tableName" />
      </el-col>
      <el-col :span="6">
        <el-button type="success" icon="el-icon-upload" @click="imagecropperShow = true" />
        <image-cropper
          v-show="imagecropperShow"
          :key="imagecropperKey"
          :width="150"
          :height="150"
          lang-type="ar"
          :table-name="tableName"
          :object-id="objectId"
          @close="close"
          @crop-upload-success="cropSuccess"
        /></el-col>
      <el-col :span="6">
        <web-cam :table-name="tableName" :object-id="objectId" />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" icon="el-icon-refresh" @click="GetFiles" />
      </el-col>
    </el-row>
    <el-col v-for="item in List" :key="item.Id" :span="24 / List.length">
      <el-card :body-style="{ padding: '3px' }">
        <el-image style="width: 100px; height: 100px" :src="item.FileUrl" :preview-src-list="srcList">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
        <div style="padding: 14px">
          <el-select v-model="item.Type" placeholder="النوع" @change="SetType(item)">
            <el-option v-for="type in options" :key="type.value" :label="type.label" :value="type.value" />
          </el-select>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import { GetFilesByObjId, SetTypeByObjId } from '@/api/File'
import WebCam from '@/components/WebCam'
import ImageCropper from '@/components/ImageCropper'
import ButtonScan from '@/components/Device/ButtonScan.vue'

export default {
  components: { ImageCropper, WebCam, ButtonScan },
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
      srcList: [],
      List: [],
      imagecropperShow: false,
      imagecropperKey: 0,
      options: [
        {
          value: 'ProfilePicture',
          label: 'شخصية'
        },
        {
          value: 'ID',
          label: 'الهوية'
        },
        {
          value: 'Passport',
          label: 'جواز'
        }
      ],
      value: ''
    }
  },
  watch: {
    ObjectId(val) {
      if (val) this.GetFiles()
    }
  },
  created() {
    //   this.GetFiles();
  },
  methods: {
    GetFiles() {
      GetFilesByObjId({ TableName: this.tableName, ObjId: this.objectId })
        .then((response) => {
          this.List = response
          this.srcList = response.map((x) => x.FileUrl)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    SetType(item) {
      SetTypeByObjId({ Id: item.Id, Type: item.Type }).then((res) => {
        this.$notify({
          title: 'تم ',
          message: 'تم الإضافة بنجاح ' + res + ' ',
          type: 'success',
          duration: 2000
        })
      })
    },
    b64toBlob(b64Data, contentType = '', sliceSize = 512) {
      const byteCharacters = atob(b64Data)
      const byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)

        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }

      const blob = new Blob(byteArrays, { type: contentType })
      return blob
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>
