<template>
  <div>
    <el-button-group>
      <el-button
        v-for="op in $store.getters.Oprations.filter(Item => {
          return Item.TableName == TableName;
        })"
        :key="op.Id"
        v-bind:label="op.Status"
        v-bind:type="op.ClassName"
        v-bind:icon="op.IconClass"
        @click="handleOprationsys(op)"
        >{{ op.OprationDescription }}</el-button
      >
    </el-button-group>
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
          <el-input
            type="textarea"
            v-model="tempOpration.Description"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :type="textOpration.ClassName" @click="approval()">{{
          textOpration.OprationDescription
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ChangeArrObjStatus } from "@/api/Oprationsys";

export default {
  props: {
    TableName: String,
    ArrObjIds: Array
  },
  data() {
    return {
      Oprations: [],
      Status: null,
      dialogOprationVisible: false,
      textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: "",
        Status: 0
      },
      tempOpration: {
        //  ObjId: undefined,
        OprationId: undefined,
        Description: "",
        Status: 0
      },
      rulesOpration: {
        Description: [
          {
            required: true,
            message: "يجب إدخال ملاحظة للعملية",
            trigger: "blur"
          },
          {
            minlength: 5,
            maxlength: 150,
            message: "الرجاء إدخال اسم لا يقل عن 5 حروف و لا يزيد عن 150 حرف",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    SetVal(val) {
      this.Status = val;
      this.$emit("Set", this.Status);
    },
    handleOprationsys(Opration) {
      this.dialogOprationVisible = true;
      // text
      this.textOpration.OprationDescription = Opration.OprationDescription;
      this.textOpration.ArabicOprationDescription =
        Opration.ArabicOprationDescription;
      this.textOpration.IconClass = Opration.IconClass;
      this.textOpration.ClassName = Opration.ClassName;
      /// temp

      this.tempOpration.Status = Opration.Status;
      //  this.tempOpration.ObjId = ObjId;
      this.tempOpration.OprationID = Opration.Id;
      //     this.tempOpration.Description = "";
    },
    approval() {
      if (this.ArrObjIds.length > 0)
        ChangeArrObjStatus({
          ObjsId: this.ArrObjIds,
          TableName: this.TableName,
          Status: this.tempOpration.Status,
          Description: this.tempOpration.Description
        }).then(response => {
          console.log(response);
          this.$notify({
            title: "تم ",
            message: "تم الإضافة بنجاح",
            type: "success",
            duration: 2000
          });
          this.$nextTick(() => {
            this.$router.replace({
              path: "/redirect" + this.$route.fullPath
            });
          });
        });
    }
  }
};
</script>
