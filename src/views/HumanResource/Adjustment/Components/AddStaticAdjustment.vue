<template>
  <div>
    <el-button
      type="success"
      icon="el-icon-circle-plus"
      @click="dialogFormVisible = true"
       round
    >
    <span style="font-size: 14px;">
    اضافة تسوية دورية
    </span>
    </el-button>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :visible.sync="dialogFormVisible"
    >
      <div slot="title" class="dialog-footer">
        <el-col :span="4">
          <el-button
            icon="fa fa-save"
            style="float: left"
            type="primary"
            @click="createData()"
          />
        </el-col>
        <el-col :span="20">
          <el-divider> إضافة تسوية دورية </el-divider>
        </el-col>
      </div>
      <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-row :gutter="24">
           <el-col :span="24">
           <el-form-item
          
          prop="ChequeNumber"
        >
         <el-row :gutter="20" type="flex">
          <el-col :span="12">
        <el-divider content-position="right"> إسم التسوية الدورية </el-divider>
        </el-col>
        </el-row>
          <el-input type="text" v-model="tempForm.Name"></el-input>
        </el-form-item>
           </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="12">
        <el-divider content-position="right"> نوع التسوية الدورية </el-divider>
        </el-col>
        </el-row>
<el-row :gutter="20">
  <el-col :span="24">
    <el-radio-group v-model="type">
      <el-radio-button label="1"> زيادة</el-radio-button>
      <el-radio-button label="2"> خصم</el-radio-button>
    </el-radio-group>
  </el-col>
  <br><br>
  </el-row>
<el-row :gutter="20">
  <el-col :span="24">
         <el-radio v-model="radio" label="1" >بالقيمة النقدية</el-radio>
         <el-radio v-model="radio" label="2" >بالقيمة المئوية</el-radio>
  </el-col>
  <br><br>
  </el-row>

        <el-row :gutter="20" >
          <el-col :span="23" v-if="radio == 1">
            <el-form-item
              prop="AdjustmentAmount"
            >
              <el-input-number
                v-model="tempForm.AdjustmentAmount"
                :precision="3"
                :step="1"
                :min="0.0"
                :max="1500"
                @focus="$event.target.select()"
              ></el-input-number>
            </el-form-item>
          </el-col>
            <el-col :span="23" v-if="radio == 2">
            <el-form-item
              prop="AdjustmentAmount"
            >
              <el-input-number
                v-model="tempForm.AdjustmentAmount"
                :precision="3"
                :step="1"
                :min="0.01"
                :max="100"
                @focus="$event.target.select()"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { Create } from "@/api/Adjustment";
export default {
  name: "StaticAdjustment",
  data() {
    return {
      radio: '1',
      type:'1',
      dialogFormVisible: false,
      tempForm: {
        Id: undefined,
        Name: "",
        AdjustmentAmount:1.000,
        Type: "",
        IsStaticAdjustment: true,
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur"
          },
          {
            min: 3,
            max: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.resetTempForm();
  },
  methods: {
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: "",
        AdjustmentAmount:0.0,
        Desription: "",
      };
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
       if (this.type==2){
            if(this.radio==1){
              this.tempForm.Type= "CashValue";
              this.tempForm.AdjustmentAmount= -this.tempForm.AdjustmentAmount;
            };
            if(this.radio==2){
              this.tempForm.Type="Percentage";
              this.tempForm.AdjustmentAmount = -(this.tempForm.AdjustmentAmount)/100;
              };
          }
          if (this.type==1){
            if(this.radio==1){this.tempForm.Type= "CashValue";};
            if(this.radio==2){
              this.tempForm.AdjustmentAmount = (this.tempForm.AdjustmentAmount)/100;
              this.tempForm.Type="Percentage";};
          }
          this.tempForm.IsStaticAdjustment = true;
          Create(this.tempForm)
            .then(response => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    
  }
};
</script>
