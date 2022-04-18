<template>
  <div>
    <el-button
      type="success"
      icon="el-icon-camera-solid"
      circle
      @click="Visible = true"
    ></el-button>

    <el-dialog style="margin-top: -13vh" title="تصوير" :visible.sync="Visible">
      <el-row type="flex">
        <el-col :span="24">
          <video
            id="video-player"
            class="video"
            width="300"
            height="300"
          ></video>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-button type="primary" @click="start()">لبدء اضغط 2 مرة</el-button>

        <el-button type="success" @click="capture()">التقاط</el-button>
        <canvas id="canvas" class="canvas" width="640" height="480"></canvas>
        <img :src="img" height="50" />
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visible = false">{{
          $t("AddVendors.Cancel")
        }}</el-button>
        <el-button type="primary" @click="createData()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Create } from "@/api/File";
export default {
  name: "WebCam",
  props: {
    ObjectId: {
      type: Number,
      default: () => {
        return undefined;
      },
    },
    TableName: {
      type: String,
      default: () => {
        return undefined;
      },
    },
    Type: {
      type: String,
      default: () => {
        return "ProfilePicture";
      },
    },
  },
  data() {
    return {
      Visible: false,
      stream: null,
      video: {},
      canvas: {},
      img: null,
    };
  },
  methods: {
    start() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          this.stream = stream;
        });
        this.video = document.getElementById("video-player");
        this.video.srcObject = this.stream;

        this.video.play();
        console.log(this.video, this.stream);
      }
    },
    capture() {
      this.canvas = document.getElementById("canvas");
      var context = this.canvas
        .getContext("2d")
        .drawImage(this.video, 0, 0, 640, 480);
      this.img = canvas.toDataURL("image/png");
    },
    createData() {
      if (this.img != null) {
        let file = {
          Id: undefined,
          FileType: "image",
          File: this.img.replace(/^data:image\/(png|jpg);base64,/, ""),
          Status: 0,
          Type: this.Type,
          TableName: this.TableName,
          FKTable: this.ObjectId,
        };
        Create(file).then((response) => {
          if (response) {
            this.Visibles = false;
            this.$notify({
              title: "تم ",
              message: "تم الإضافة بنجاح",
              type: "success",
              duration: 2000,
            });
            this.$nextTick(() => {
              this.$router.replace({
                path: "/redirect" + this.$route.fullPath,
              });
            });
          }
        });
      }
    },
  },
};
</script>

<style>
.video {
  background-color: #000000;
}
.canvas {
  display: none;
}
</style>
