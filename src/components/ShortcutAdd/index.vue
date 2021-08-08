<template>
<div>
 <el-button type="primary"
      icon="el-icon-plus"
      circle
      @click="Open = true" style="background-color: #1b3459;"></el-button>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      title="إضافة"
      :visible.sync="Open"
    >
    <template>
      <el-col :span="20">
        <Add-Item/>
      </el-col>
      <el-col :span="4">
        صنف جديد
      </el-col>
    </template>
        <template>
      <el-col :span="20">
        <Add-Member/>
      </el-col>
      <el-col :span="4">
        مشترك جديد
      </el-col>
    </template>
           <template>
      <el-col :span="20">
        <Add-Vendor/>
      </el-col>
      <el-col :span="4">
        عميل/مورد جديد
      </el-col>
    </template>
      <template>
      <el-col :span="20">
        <add-inventory/>
      </el-col>
      <el-col :span="4">
        مخزن جديد
      </el-col>
    </template>
      <template>
      <el-col :span="20">
        <add-membership/>
      </el-col>
      <el-col :span="4">
        إشتراك جديد
      </el-col>
    </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Open = false">{{
          $t("permission.cancel")
        }}</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
import AddItem from "@/components/Item/AddItem.vue";
import AddMember from "@/components/Member/AddMember.vue";
import AddVendor from "@/components/Vendor/AddVendor.vue";
import AddInventory from '../Add/AddInventory.vue';
import AddMembership from '../Gym/AddMembership.vue';
export default {
  components:{AddItem, AddMember, AddVendor, AddInventory, AddMembership},
 data() {
    return {
      Open: false,

    };
  },
};
</script>
