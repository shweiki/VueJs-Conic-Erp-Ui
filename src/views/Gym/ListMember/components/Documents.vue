<template>
  <div class="demo-image__preview">
    <el-button type="primary" @click="GetFiles" icon="el-icon-refresh"></el-button>
    <el-image
      style="width: 100px; height: 100px"
      v-for="item in List"
      :key="item.Id"
      :src="item.File"
      :preview-src-list="srcList"
    >
      <div slot="placeholder" class="image-slot">Loading<span class="dot">...</span></div>
    </el-image>
  </div>
</template>

<script>
import { GetFilesByObjId } from "@/api/File";

export default {
  props: ["ObjectId", "TableName"],
  data() {
    return {
      srcList: [],
      List: [],
    };
  },
  methods: {
    GetFiles() {
      GetFilesByObjId({ TableName: this.TableName, ObjId: this.ObjectId })
        .then((response) => {
          this.List = response;
          this.srcList = response.map((x) => x.File);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    b64toBlob(b64Data, contentType = "", sliceSize = 512) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
  },
};
</script>
