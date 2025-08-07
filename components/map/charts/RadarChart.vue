<script>
import { defineComponent, h } from 'vue'
import { Radar } from 'vue-chartjs'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

// Register the components needed by radar chart
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default defineComponent({
  name: 'RadarChart',
  components: {
    Radar
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
            display: false
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
              title: () => null // Remove title
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            angleLines: {
              display: true,
              color: 'rgba(0,0,0,0.1)',
            },
            ticks: {
              display: false,
              stepSize: 2,
              max: 10
            },
            pointLabels: {
              font: {
                size: 8
              },
              color: '#555'
            }
          }
        }
      })
    }
  },
  setup(props) {
    return () =>
      h(Radar, {
        data: props.chartData,
        options: props.chartOptions
      })
  }
})
</script>