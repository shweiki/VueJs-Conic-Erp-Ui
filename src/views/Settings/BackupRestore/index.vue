<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-button
        style="margin-left: 10px"
        :size="$store.getters.size"
        type="primary"
        :loading="loading"
        @click="SubmitBackUp"
      >
        BackUp DataBase</el-button>
      <el-input
        v-model="RestoreDirectory"
        icon="el-icon-files"
        placeholder="Directory Path"
      />

      <el-button
        style="margin-left: 10px"
        :size="$store.getters.size"
        type="success"
        :loading="loading"
        @click="SubmitRestore()"
      >Submit Restore to server</el-button>
    </el-card>
    <el-table
      v-loading="loading"
      :data="tableData"
      fit
      max-height="700"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="#" prop="Id" width="50" />

      <el-table-column
        :label="$t('AddVendors.Name')"
        prop="Name"
        align="center"
      />
      <el-table-column
        :label="$t('Backup.DataBaseName')"
        prop="DataBaseName"
      />
      <el-table-column
        :label="$t('Backup.DateTime')"
        prop="DateTime"
      />
      <el-table-column
        :label="$t('Backup.UserId')"
        prop="UserId"
      />
    </el-table>
  </div>
</template>

<script>
import { BackUp, Restore, GetBackUp } from '@/api/BackupRestore'

export default {
  name: 'BackupRestore',
  data() {
    return {
      loading: false,
      tableData: [],
      search: '',
      RestoreDirectory: this.$store.state.settings.triger.BackUp.Directory
    }
  },
  created() {
    this.getdata()
  },
  methods: {
    getdata() {
      this.loading = true
      GetBackUp()
        .then((response) => {
          // handle success
          console.log(response)
          this.tableData = response.reverse()
          this.loading = false
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
    },
    SubmitRestore() {
      this.loading = true

      Restore({ DirectoryBak: this.RestoreDirectory }).then((response) => {
        if (response) {
          this.$notify({
            title: 'تم ',
            message: 'تم استرجاع قاعدة البيانات بنجاح :)',
            type: 'success',
            duration: 2000
          })
          this.loading = true
          this.getdata()
        }
      })
    },
    SubmitBackUp() {
      this.loading = true
      BackUp({ BackUpPath: this.RestoreDirectory }).then((response) => {
        if (response) {
          this.$notify({
            title: 'تم ',
            message: 'تم اخذ نسخة احتياطية بنجاح',
            type: 'success',
            duration: 2000
          })
          this.loading = true
          this.getdata()
        }
      })
    }
  }
}
</script>
