<template>
  <el-row type="flex">
    <el-col :span="10">
      <el-input v-model="name" @change="SetVal" placeholder="الاسم" />
    </el-col>
    <el-col :span="8">
      <el-select
        @change="SetVal"
        filterable
        v-model="Region"
        placeholder="المنطقة"
      >
        <el-option
          v-for="item in Regions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{
            item.price
          }}</span>
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="6">
      <el-input v-model="phone" @change="SetVal" placeholder="رقم الهاتف" />
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    Region: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      Regions: [
        {
          value: "الثامنة",
          label: "الثامنة",
          price: 1.0
        },
        {
          value: "الثالثة",
          label: "الثالثة",
          price: 1.25
        },
        {
          value: "السادسة",
          label: "السادسة",
          price: 1.25
        },
        {
          value: "السابعة",
          label: "السابعة",
          price: 1.25
        },
        {
          value: "العاشرة",
          label: "العاشرة",
          price: 1.25
        },
        {
          value: "العالمية",
          label: "العالمية",
          price: 1.25
        },
        {
          value: "المحدود",
          label: "المحدود",
          price: 1.25
        },
        {
          value: "الرمال",
          label: "الرمال",
          price: 1.25
        },
        {
          value: "شويخ مول",
          label: "شويخ مول",
          price: 1.25
        },
        {
          value: "سكن الاطباء",
          label: "سكن الاطباء",
          price: 1.25
        },
        {
          value: "الجمعية",
          label: "الجمعية",
          price: 1.25
        },
        {
          value: "الخامسة",
          label: "الخامسة",
          price: 1.5
        },
        {
          value: "السوق التجاري",
          label: "السوق التجاري",
          price: 1.5
        },
        {
          value: "الوحدات الشرقية",
          label: "الوحدات الشرقية",
          price: 1.5
        },
        {
          value: "الوحدات الغربية",
          label: "الوحدات الغربية",
          price: 1.5
        },
        {
          value: "الوحدات الشعبية",
          label: "الوحدات الشعبية",
          price: 1.5
        },
        {
          value: "التاسعة",
          label: "التاسعة",
          price: 1.5
        },
        {
          value: "ايلة",
          label: "ايلة",
          price: 1.5
        },
        {
          value: "سيتي سنتر",
          label: "سيتي سنتر",
          price: 1.5
        },
        {
          value: "الحرفية",
          label: "الحرفية",
          price: 1.5
        },
        {
          value: "الكرامة",
          label: "الكرامة",
          price: 1.5
        },
        {
          value: "الحادي عشر",
          label: "الحادي عشر",
          price: 1.5
        },
        {
          value: "المفوضية",
          label: "المفوضية",
          price: 1.5
        },
        {
          value: "البنك العربي",
          label: "البنك العربي",
          price: 1.5
        },
        {
          value: "كلية العقبة",
          label: "كلية العقبة",
          price: 1.5
        },
        {
          value: "النخيل",
          label: "النخيل",
          price: 1.5
        },
        {
          value: "الشلالة",
          label: "الشلالة",
          price: 2.0
        },
        {
          value: "الخزان",
          label: "الخزان",
          price: 2.0
        },
        {
          value: "الكورنيش",
          label: "الكورنيش",
          price: 2.0
        },
        {
          value: "المنارة",
          label: "المنارة",
          price: 2.0
        },
        {
          value: "سوق البلد",
          label: "سوق البلد",
          price: 2.0
        },
        {
          value: "البلد القديمة",
          label: "البلد القديمة",
          price: 2.0
        },
        {
          value: "صلاح الدين",
          label: "صلاح الدين",
          price: 2.0
        },
        {
          value: "شارع الفنادق",
          label: "شارع الفنادق",
          price: 2.0
        },
        {
          value: "الجامعة الاردنية",
          label: "الجامعة الاردنية",
          price: 2.0
        },
        {
          value: "مستشفى هاشم",
          label: "مستشفى هاشم",
          price: 2.0
        },
        {
          value: "مرسى زايد ( قرية الراحة )",
          label: "مرسى زايد ( قرية الراحة )",
          price: 3.0
        },
        {
          value: "محطة المناصير",
          label: "محطة المناصير",
          price: 3.0
        },
        {
          value: "المدينة الصناعية",
          label: "المدينة الصناعية",
          price: 3.0
        },
        {
          value: "المعامل",
          label: "المعامل",
          price: 4.0
        },
        {
          value: "الشامية",
          label: "الشامية",
          price: 4.0
        },
        {
          value: "المطار",
          label: "المطار",
          price: 4.0
        },
        {
          value: "القرية اللوجستية",
          label: "القرية اللوجستية",
          price: 4.0
        },
        {
          value: "ميناء الحاويات",
          label: "ميناء الحاويات",
          price: 4.0
        },
        {
          value: "الشاطئ الجنوبي (الغاية المتنزه البحري)",
          label: "الشاطئ الجنوبي (الغاية المتنزه البحري)",
          price: 5.0
        },
        {
          value: "تالابيه",
          label: "تالابيه",
          price: 6.0
        },
        {
          value: "الطريق الخلفي",
          label: "الطريق الخلفي",
          price: 6.0
        },
        {
          value: "جامعة العقبة للتكنولوجيا",
          label: "جامعة العقبة للتكنولوجيا",
          price: 6.0
        },
        {
          value: "الميناء الجديد (المجمع الصناعي)",
          label: "الميناء الجديد (المجمع الصناعي)",
          price: 8.0
        }
      ]
    };
  },
  watch: {
    name(val) {
      this.name = val;
    },
    phone(val) {
      this.phone = val;
    },
    Region(val) {
      this.Region = val;
    }
  },
  created() {
    this.SetVal();
  },
  methods: {
    SetVal() {
      this.$emit(
        "SetDeliveryPrice",
        this.Regions.find(element => element.value == this.Region).price
      );
      this.$emit(
        "SetRegion",
        this.Regions.find(element => element.value == this.Region).value
      );
      this.$emit("SetPhoneNumber", this.phone);
      this.$emit("SetName", this.name);
    }
  }
};
</script>
