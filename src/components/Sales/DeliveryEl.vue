<template>
  <el-row type="flex">
    <el-col :span="10">
      <el-input v-model="name" @change="SetText" placeholder="الاسم" />
    </el-col>
    <el-col :span="8">
      <el-select
        @change="SetText"
        filterable
        v-model="city"
        placeholder="المنطقة"
      >
        <el-option
          v-for="item in cities"
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
      <VuePhoneNumberInput
        :translations="{
          countrySelectorLabel: 'رمز البلد',
          countrySelectorError: 'تاكد من رقم',
          phoneNumberLabel: 'رقم الهاتف'
        }"
        :no-country-selector="true"
        default-country-code="JO"
        v-model="phone"
        @update="SetText"
      />
    </el-col>
  </el-row>
</template>

<script>
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
export default {
  components: { VuePhoneNumberInput },

  data() {
    return {
      name: "",
      phone: "",
      city: "الثامنة",
      cities: [
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
          value: "الجمعية - سكن الاطباء - شويخ مول",
          label: "الجمعية - سكن الاطباء - شويخ مول",
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
          value: "الوحدات (الشرقية + الغربية + الشعبية)",
          label: "الوحدات (الشرقية + الغربية + الشعبية)",
          price: 1.5
        },
        {
          value: "التاسعة + سيتي سنتر + الحرفية + الكرامة + الحادي عشر",
          label: "التاسعة + سيتي سنتر + الحرفية + الكرامة + الحادي عشر",
          price: 1.5
        },
        {
          value: "المفوضية + البنك العربي + كلية العقبة",
          label: "المفوضية + البنك العربي + كلية العقبة",
          price: 1.5
        },
        {
          value: "الشلالة + الخزان",
          label: "الشلالة + الخزان",
          price: 2.0
        },
        {
          value: "الكورنيش + المنارة + البلد القديمة + صلاح الدين",
          label: "الكورنيش + المنارة + البلد القديمة + صلاح الدين",
          price: 2.0
        },
        {
          value: "الجامعة الاردنية + مستشفى هاشم",
          label: "الجامعة الاردنية + مستشفى هاشم",
          price: 2.0
        },
        {
          value: "مرسى زايد ( قرية الراحة )",
          label: "مرسى زايد ( قرية الراحة )",
          price: 3.0
        },
        {
          value: "المدينة الصناعية + محطة المناصير",
          label: "المدينة الصناعية + محطة المناصير",
          price: 3.0
        },
        {
          value:
            "ميناء الحاويات + القرية اللوجستية + المطار + الشامية + المعامل",
          label:
            "ميناء الحاويات + القرية اللوجستية + المطار + الشامية + المعامل",
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
          value: "الطريق الخلفي + جامعة العقبة للتكنولوجيا",
          label: "الطريق الخلفي + جامعة العقبة للتكنولوجيا",
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
  created(){
    this.SetText()
  },
  methods: {
    SetVal(val) {
      this.$emit("Set", val.toString());
      this.$emit(
        "SetDeliveryPrice",
        this.cities.find(element => element.value == this.city).price
      );
    },
    SetText(v) {
      this.SetVal(this.name + " / " + this.city + " / " + "0" + this.phone);
    }
  }
};
</script>
