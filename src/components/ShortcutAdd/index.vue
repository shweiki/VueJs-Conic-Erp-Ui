<template>
  <div>
    <el-popover v-model="visible" placement="bottom" width="250" trigger="manual">
      <el-row type="flex">
        <el-col :span="12"><Add-Item /></el-col>
        <el-col :span="12">صنف جديد</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12"> <Add-Member /> </el-col>
        <el-col :span="12"> مشترك جديد </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12"> <Add-Vendor /> </el-col>
        <el-col :span="12"> عميل/مورد جديد </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12"> <Add-Inventory /> </el-col>
        <el-col :span="12"> مخزن جديد </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12"> <Add-Membership /> </el-col>
        <el-col :span="12"> إشتراك جديد </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12"> <Add-Menu-Item /> </el-col>
        <el-col :span="12"> تصنيف جديد </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12"> <Add-Cash /> </el-col>
        <el-col :span="12"> إضافة كاش </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12"> <Add-Cheque /> </el-col>
        <el-col :span="12"> إضافة شيك </el-col>
      </el-row>
      <i
        v-permission="['admin']"
        class="el-icon-plus avatar-container Right-Menu-item hover-effect"
        slot="reference"
        @click="visible = !visible"
      >
        <i class="el-icon-caret-bottom"
      /></i>
    </el-popover>
  </div>
</template>

<script>
import AddItem from "@/components/Item/AddItem.vue";
import AddMember from "@/components/Member/AddMember.vue";
import AddVendor from "@/components/Vendor/AddVendor.vue";
import AddInventory from "../Add/AddInventory.vue";
import AddMembership from "../Gym/AddMembership.vue";
import AddCash from "../Add/AddCash.vue";
import AddCheque from "../Add/AddCheque.vue";
import AddMenuItem from "../Add/AddMenuItem.vue";
import permission from "@/directive/permission/index.js";

export default {
  directives: { permission },
  components: {
    AddItem,
    AddMember,
    AddVendor,
    AddInventory,
    AddMembership,
    AddCash,
    AddCheque,
    AddMenuItem,
  },
  data() {
    return {
      visible: false,
    };
  },
};
</script>
<style lang="scss" scoped>
.Right-Menu {
  height: 100%;
  line-height: 50px;
  &:focus {
    outline: none;
  }

  .Right-Menu-item {
    display: inline-block;
    padding: 0 8px;
    font-size: 18px;
    color: #ffffff;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    .avatar-wrapper {
      margin-top: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -10px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.errLog-container {
  display: inline-block;
  vertical-align: top;
}
</style>
