<template>
  <el-card style="margin-bottom: 20px">
    <div slot="header" >
      <div class="user-name text-center">{{ user.name }}</div>
    </div>

    <div class="user-profile">
      <span>About me : {{ user.name }}</span>

      <div class="box-center">
        <pan-thumb
          :height="'100px'"
          :width="'100px'"
          :image="user.avatar"
          :hoverable="false"
        >
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="imagecropperShow = true"
          ></el-button>
          <web-cam TableName="User" :ObjectId="user.phone" />
        </pan-thumb>
        <image-cropper
          v-show="imagecropperShow"
          :key="imagecropperKey"
          :width="150"
          :height="150"
          lang-type="ar"
          TableName="User"
          :ObjectId="user.phone"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </div>
      <div class="box-center">
        <div class="user-role text-center text-muted">
          {{ user.role | uppercaseFirst }}
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from "@/components/PanThumb";
import WebCam from "@/components/WebCam";
import ImageCropper from "@/components/ImageCropper";
export default {
  components: { PanThumb, WebCam, ImageCropper },
  data() {
    return { imagecropperShow: false, imagecropperKey: 0 };
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          Id: "",
          name: "",
          phone: 0,
          email: "",
          avatar: "",
          roles: "",
        };
      },
    },
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    close() {
      this.imagecropperShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
