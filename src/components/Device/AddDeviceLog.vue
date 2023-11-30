<template>
  <div>
    <el-button v-permission="['admin']" type="primary" icon="el-icon-plus" @click="Visibles = true" />

    <el-dialog style="margin-top: -13vh" title="تسجيل دخول" :visible.sync="Visibles">
      <el-form ref="DeviceLogForm" :model="Temp" :rules="rulesForm" label-position="top" class="demo-form-inline">
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item prop="Fk" :label="TableName == 'Employee' ? 'موظف' : 'مشترك'">
              <el-input v-model="Temp.FkName" :disabled="true" class="input-with-select">
                <svg-icon slot="append" class-name="search-icon" icon-class="search" @click.stop="click" />
              </el-input>
              <Member-Search-Any
                v-if="TableName == 'Member'"
                @Set="
                  (v) => {
                    Temp.Fk = v.Id;
                    Temp.FkName = `(${v.Id}) ${v.Name}`;
                  }
                "
              />

              <employee-search-any
                v-if="TableName == 'Employee'"
                :employee-id="Fk"
                @Set="
                  (v) => {
                    Temp.Fk = v.Id;
                    Temp.FkName = `(${v.Id}) ${v.Name}`;
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <select-device :value="Temp.DeviceId" @Set="(v) => (Temp.DeviceId = v.Id)" />
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item :label="$t('AddVendors.Description')" prop="DateTime">
              <Fake-Date
                :value="Temp.DateTime"
                @Set="
                  (v) => {
                    Temp.DateTime = v;
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('AddVendors.Description')" prop="Description">
              <el-input v-model="Temp.Description" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{
          $t("AddVendors.Cancel")
        }}</el-button>
        <el-button type="primary" @click="create()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Create } from '@/api/DeviceLog'
import permission from '@/directive/permission/index.js'
import FakeDate from '@/components/Date/FakeDate.vue'
import SelectDevice from './SelectDevice.vue'
import EmployeeSearchAny from '../HumanResource/EmployeeSearchAny.vue'
import MemberSearchAny from '@/components/Member/MemberSearchAny.vue'

export default {
  name: 'AddDeviceLog',
  components: { FakeDate, SelectDevice, EmployeeSearchAny, MemberSearchAny },
  directives: { permission },
  props: ['Fk', 'TableName'],
  data() {
    return {
      Temp: {
        Id: undefined,
        Type: 'Manual',
        Fk: undefined,
        FkName: '',
        DateTime: '',
        DeviceId: 1,
        Status: 0,
        TableName: this.TableName,
        Description: 'Manual Register Log'
      },
      rulesForm: {
        Fk: [
          {
            required: true,
            message: 'يرجى اختيار المشترك',
            trigger: 'blur'
          }
        ]
      },
      Visibles: false
    }
  },
  methods: {
    create() {
      this.$refs['DeviceLogForm'].validate((valid) => {
        if (valid) {
          Create(this.Temp)
            .then((response) => {
              this.Visibles = false
              this.$notify({
                title: 'تم ',
                message: 'تم الإضافة بنجاح',
                type: 'success',
                duration: 2000
              })
              this.$emit('Done')
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
    }
  }
}
</script>
