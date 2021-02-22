<template>
  <div>
    <el-button
      v-for="(NOprations, index) in NextOprations"
      :key="index"
      :type="NOprations.ClassName"
      round
      @click="handleOprationsys(ObjID, NOprations)"
      >{{ NOprations.OprationDescription }}</el-button
    >
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :title="textOpration.OprationDescription"
      :visible.sync="dialogOprationVisible"
    >
      <el-form
        ref="dataOpration"
        :rules="rulesOpration"
        :model="tempOpration"
        label-position="top"
        label-width="70px"
        style="width: 400px margin-left:50px"
      >
        <el-form-item label="ملاحظات للعملية " prop="Description">
          <el-input type="textarea" v-model="tempOpration.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :type="textOpration.ClassName" @click="Create()">{{
          textOpration.OprationDescription
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ChangeObjStatusByTableName } from "@/api/Oprationsys";

export default {
  name: "NextOprations",
  props: {
    Status: {
      type: Number,
      default: undefined,
    },
    TableName: {
      type: String,
    },
    ObjID: Number,
  },
  data() {
    return {
      NextOprations: {},
      dialogOprationVisible: false,
      textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: "",
        Status: 0,
      },
      tempOpration: {
        ObjID: undefined,
        OprationID: undefined,
        Description: "",
      },
      rulesOpration: {
        Description: [
          {
            required: true,
            message: "يجب إدخال ملاحظة للعملية",
            trigger: "blur",
          },
          {
            minlength: 5,
            maxlength: 150,
            message: "الرجاء إدخال اسم لا يقل عن 5 حروف و لا يزيد عن 150 حرف",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    Status(val) {
      this.Status = val;
      this.getdata();
    },
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.NextOprations = this.$store.getters.Oprations.filter((Item) => {
        return Item.TableName == this.TableName && Item.ReferenceStatus == this.Status;
      });
    },
    handleOprationsys(ObjID, Opration) {
      this.dialogOprationVisible = true;
      // text
      this.textOpration.OprationDescription = Opration.OprationDescription;
      this.textOpration.ArabicOprationDescription = Opration.ArabicOprationDescription;
      this.textOpration.IconClass = Opration.IconClass;
      this.textOpration.ClassName = Opration.ClassName;
      /// temp

      this.tempOpration.Status = Opration.Status;
      this.tempOpration.ObjID = ObjID;
      this.tempOpration.OprationID = Opration.Id;
      this.tempOpration.Description = "";
    },
    Create() {
      ChangeObjStatusByTableName({
        ObjID: this.tempOpration.ObjID,
        TableName: this.TableName,
        Status: this.tempOpration.Status,
        Description: this.tempOpration.Description,
      })
        .then((response) => {
          if (response) this.$emit("Done");

          this.dialogOprationVisible = false;
          this.$notify({
            title: "تم  ",
            message: "تمت العملية بنجاح",
            type: "success",
            duration: 2000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style scoped>
.price {
  font-size: 9px;
  color: #f78123;
}
</style>
