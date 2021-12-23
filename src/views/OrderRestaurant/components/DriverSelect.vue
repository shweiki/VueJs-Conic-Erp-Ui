<template>
  <div>
    <el-row type="flex">
      <el-col :span="12">
        <el-select
          v-model="Driver"
          filterable
          :v-bind:placeholder="$t('Delivery.Driver')"
        >
          <el-option
            v-for="item in Drivers"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col v-if="$store.getters.device != 'mobile'" :span="3">
        <el-tooltip v-bind:content="$t('Delivery.AddDriver')" placement="top">
          <add-driver />
        </el-tooltip>
      </el-col>
      <el-col :span="9">
        <el-button
          style="float: left"
          type="success"
          icon="fa fa-save"
          :size="$store.getters.size"
          @click="AssignDriver()"
          >{{ $t("Delivery.Assign") }}</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { GetDriversLabel } from "@/api/Driver";
import AddDriver from "@/components/Drivers/AddDriver.vue";
export default {
  components: { AddDriver },
  props: ["Id"],
  data() {
    return {
      Driver: "",
      Drivers: [],
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetDriversLabel()
        .then((response) => {
          // handle success
          console.log(response);
          this.Drivers = response;
          this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    AssignDriver() {
      // console.log(this.Drivers.find((element) => element.value == this.Driver));
      this.$emit(
        "Set",
        this.Drivers.find((element) => element.value == this.Driver)
      );
    },
  },
};
</script>
