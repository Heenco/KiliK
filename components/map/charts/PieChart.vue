<script>
import { defineComponent, h } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// Register the components needed by pie chart
ChartJS.register(ArcElement, Tooltip, Legend)

export default defineComponent({
  name: 'PieChart',
  components: {
    Pie
  },
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            align: 'center',
            labels: {
              boxWidth: 8,
              padding: 8,
              font: {
                size: 8
              }
            }
          },
          tooltip: {
            backgroundColor: 'white',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: '#ccc',
            borderWidth: 1,
            padding: 8,
            boxPadding: 4,
            usePointStyle: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`;
              }
            }
          }
        }
      })
    }
  },
  setup(props) {
    return () =>
      h(Pie, {
        data: props.chartData,
        options: props.chartOptions
      })
  }
})
</script>