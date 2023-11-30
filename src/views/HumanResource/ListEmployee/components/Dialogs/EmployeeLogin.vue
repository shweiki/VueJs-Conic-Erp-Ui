<template>
  <div>
    <el-button
      v-permission="['admin']"
      type="info"
      icon="el-icon-bottom"
      @click="Visibles = true"
    >
      Login
    </el-button>
    <el-dialog style="margin-top: -13vh" title="تسجيل دخول" :visible.sync="Visibles">
      <el-form
        ref="EmployeeLogForm"
        :model="Temp"
        label-position="top"
        class="demo-form-inline"
      >
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item prop="EmployeeName" label="اسم الموظف">
              <!-- <Employee-Search-Any
                @Set="
                  (v) => {
                    Temp.EmployeeId = v.Id;
                  }
                "
              /> -->
              <el-input v-model="Name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="EmployeeId" label="الرقم الوظيفي">
              <el-input v-model="Id" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="وقت الدخول" prop="StartDateTime">
              <Fake-Date
                :value="Temp.StartDateTime"
                @Set="
                  (v) => {
                    Temp.StartDateTime = v;
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
        <el-button @click="Visibles = false">{{ $t("AddVendors.Cancel") }}</el-button>
        <el-button type="primary" @click="create()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EmployeeSearchAny from '@/components/HumanResource/EmployeeSearchAny'
import permission from '@/directive/permission/index.js'
import FakeDate from '@/components/Date/FakeDate.vue'
export default {
  components: { EmployeeSearchAny, FakeDate },
  directives: { permission },
  props: ['Name', 'Id'],

  data() {
    return {
      Temp: {
        Id: undefined,
        EmployeeId: undefined,
        StartDateTime: '',
        EndDateTime: '',
        DeviceId: 1,
        Status: 0,
        Description: 'Manual User Register Employee Login'
      },
      Visibles: false
    }
  },
  methods: {
    create() {
      this.$refs['EmployeeLogForm'].validate((valid) => {
        if (valid) {
          this.Temp.EmployeeId = this.Id
          Create(this.Temp)
            .then((response) => {
              this.Visibles = false
              this.$notify({
                title: 'تم ',
                message: 'تم الإضافة بنجاح',
                type: 'success',
                duration: 2000
              })
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
