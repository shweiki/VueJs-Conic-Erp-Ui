<template>
  <el-popover placement="top" width="400" v-model="visible">
    <el-row type="flex">
      <el-col :span="24">
        <el-button icon="fa fa-save" type="primary" :size="$store.getters.size" @click="Save()"></el-button>
      </el-col>
    </el-row>
    <el-form>
      <el-form-item label="رقم ST9">
        <el-input placeholder="رقم ST9" v-model="tempForm.St9"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="success" slot="reference">St9 :{{ ST9 }}</el-button>
  </el-popover>
</template>
<script>
import { PinST9BillOfEntery } from "@/api/BillOfEntery";

export default {
  props: ["BillOfEnteryId", "ST9"],
  data() {
    return {
      visible: false,
      tempForm: {
        St9: ""
      }
    };
  }, watch: {
    BillOfEnteryId(value) {
   //   console.log("prop", value)
      if (value != null && value != undefined && value != "" && value > 0) {
        this.BillOfEnteryId = value
      }
    },
  },
  methods: {
    Save() {
      PinST9BillOfEntery({
        BillOfEnteryId:
          this.BillOfEnteryId,
        St9: this.tempForm.St9,
      })
        .then((response) => {
          this.visible = false;
          this.ST9 =  this.tempForm.St9
          this.$notify({
            title: "تم ",
            message: "تم الإضافة بنجاح",
            type: "success",
            duration: 2000,
          });
        })
        .catch((error) => {
          reject(error);
        });
    },
  },
};
</script>
