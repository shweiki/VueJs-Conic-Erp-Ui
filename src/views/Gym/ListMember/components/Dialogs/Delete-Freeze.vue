<template>
  <div>
    <el-button icon="el-icon-edit" circle @click="Visibles = true"></el-button>

    <el-dialog
      style="margin-top: -13vh; text-align: center;"
      title="تسجيل تجميد"
      @opened="getdata"
      :visible.sync="Visibles"
    >


    </el-dialog>
  </div>
</template>

<script>
import { Edit, GetById } from "@/api/MembershipMovementOrder";
import EditorsUser from "@/components/Gym/EditorsUser";

export default {
  components: { EditorsUser },

  props: {
    MemberShipMovementOrderId: {
      type: Number,
      default: () => {
        return undefined;
      },
    },
    MinFreezeLimit: {
      type: Number,
      default: () => {
        return undefined;
      },
    },
    MaxFreezeLimit: {
      type: Number,
      default: () => {
        return undefined;
      },
    },
  },
  data() {
    return {
      EnableSave: false,
      tempForm: {},
      FreezeBetween: [],
      Visibles: false,
      Days: 0,
      ValidateNote: "",
      pickerOptions: {
        disabledDate(time) {
          console.log(time);
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  methods: {
    getdata() {
      GetById({ Id: this.MemberShipMovementOrderId })
        .then((response) => {
          console.log(response);
          this.tempForm = response;
          this.FreezeBetween = [this.tempForm.StartDate,this.tempForm.EndDate] ;
          this.Visibles = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    create() {
      this.Days = Math.round(
        Math.abs(
          (new Date(this.FreezeBetween[0]) - new Date(this.FreezeBetween[1])) /
            (24 * 60 * 60 * 1000)
        )
      );
      console.log(this.Days);
      if (
        this.Days >= this.MinFreezeLimit &&
        this.Days <= this.MaxFreezeLimit
      ) {
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            this.EnableSave = true;
            this.tempForm.StartDate = this.FreezeBetween[0];
            this.tempForm.EndDate = this.FreezeBetween[1];
            Edit(this.tempForm)
              .then((response) => {
                if (response) {
                  this.Visibles = false;
                  this.EnableSave = false;
                  this.$notify({
                    title: "تم ",
                    message: "تم تعديل بنجاح",
                    type: "success",
                    duration: 2000,
                  });
                  this.$nextTick(() => {
                    this.$router.replace({
                      path: "/redirect" + this.$route.fullPath,
                    });
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      } else {
        this.ValidateNote = "عدد الايام المطلوب تجميدها غير المسموح بها";
      }
    },
  },
};
</script>
