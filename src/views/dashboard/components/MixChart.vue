<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
import resize from '@/components/Charts/mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    id: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "200px",
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: "200px",
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.initChart(val);
      },
    },
    autoResize: {
      deep: true,
      handler(val) {
         this.chart.resize()
      },
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart({ xAxis, Series } = {}) {
      this.chart = echarts.init(document.getElementById(this.id));
      const xData = xAxis;
      this.chart.setOption({
        backgroundColor: "#344b58",
        title: {
          text: this.$t("Account.Statistics"),
          x: "20",
          top: "20",
          textStyle: {
            color: "#fff",
            fontSize: "22",
          },
          subtextStyle: {
            color: "#90979c",
            fontSize: "16",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            textStyle: {
              color: "#fff",
            },
          },
        },
        grid: {
          left: "5%",
          right: "5%",
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          x: "5%",
          top: "10%",
          textStyle: {
            color: "#90979c",
          },
          data: Object.keys(Series).map((x) => this.$t("Account." + x + "")),
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#90979c",
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitArea: {
              show: false,
            },
            axisLabel: {
              interval: 0,
            },
            data: xData,
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#90979c",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
            },
            splitArea: {
              show: false,
            },
          },
        ],
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon:
              "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
            handleSize: "110%",
            handleStyle: {
              color: "#d3dee5",
            },
            textStyle: {
              color: "#fff",
            },
            borderColor: "#90979c",
          },
          {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35,
          },
        ],
        series: [
          {
            name: this.$t("Account." + Object.keys(Series)[0] + ""),
            type: "bar",
            stack: "total",
            barMaxWidth: 35,
            barGap: "10%",
            itemStyle: {
              normal: {
                color: "rgba(255,144,128,1)",
                label: {
                  show: true,
                  textStyle: {
                    color: "#fff",
                  },
                  position: "insideTop",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  },
                },
              },
            },
            data: Series[Object.keys(Series)[0]],
          },

          {
            name: this.$t("Account." + Object.keys(Series)[1] + ""),
            type: "bar",
            stack: "total",
            itemStyle: {
              normal: {
                color: "rgba(0,191,183,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "top",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  },
                },
              },
            },
            data: Series[Object.keys(Series)[1]],
          },
          {
            name: this.$t("Account." + Object.keys(Series)[2] + ""),
            type: "line",
            stack: "total",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(252,230,48,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "top",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  },
                },
              },
            },
            data: Series[Object.keys(Series)[2]],
          },
        ],
      });
    },
  },
};
</script>
