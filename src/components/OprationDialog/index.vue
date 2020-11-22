<template>
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
      <el-form-item label="ملاحظات للعملية " prop="description">
        <el-input type="textarea" v-model="tempOpration.Description"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        :type="textOpration.ClassName"
        @click="createOprationData()"
      >{{textOpration.OprationDescription}}</el-button>
    </div>
  </el-dialog>
</template>