<template>
  <el-popover placement="left" width="400" v-model="visible">
    <el-row type="flex">
      <el-col :span="18">
        <el-button
          icon="fa fa-save"
          type="primary"
          :size="$store.getters.size"
          @click="Save()"
        ></el-button>
      </el-col>

      <el-col :span="6"><h4>بيان جمركي</h4></el-col>
    </el-row>

    <el-form-item
      prop="FakeDate"
      v-bind:label="$t('NewPurchaseInvoice.ReleaseDate')"
      :rules="[
        {
          required: true,
          message: 'لايمكن ترك التاريخ فارغ',
          trigger: 'blur',
        },
      ]"
    >
      <Fake-Date :Value="tempForm.FakeDate" @Set="(v) => (tempForm.FakeDate = v)" />
    </el-form-item>
    <el-form-item prop="BonId" label="رقم البيان">
      <el-input placeholder="رقم البيان" v-model="tempForm.BonId"></el-input>
    </el-form-item>
    <div style="text-align: right; margin: 0">
      <el-input
        type="textarea"
        v-model="tempForm.Description"
        :rules="[{ required: true, message: 'لايمكن ترك الخصم فارغ', trigger: 'blur' }]"
      ></el-input>
    </div>
    <el-button icon="el-icon-circle-plus" slot="reference">بيان جمركي</el-button>
  </el-popover>
</template>

<script>
import FakeDate from "@/components/Date/FakeDate";
import { GetBillOfEnteryById as GetById } from "@/api/BillOfEntery";
export default {
  props: ["PurchaseId"],
  components: { FakeDate },
  data() {
    return {
      visible: false,
      tempForm: {
        Id: undefined,
        BonId: "",
        ItemsIds: [],
        FakeDate: "",
        Description: "",
        Status: 0,
        PurchaseInvoiceId: undefined,
      },
    };
  },
  watch: {
    PurchaseId(value) {
      if (value != null && value != undefined && value != "" && value > 0) {
        GetById({ Id: value }).then((res) => {
          this.tempForm = res;
          this.$emit("Done", this.tempForm);
        });
      }
    },
  },
  methods: {
    Save() {
      this.visible = false;
      this.$emit("Done", this.tempForm);
      this.$notify({
        title: "تم ",
        message: "تم الإضافة بنجاح",
        type: "success",
        duration: 2000,
      });
    },
  },
};
</script>
