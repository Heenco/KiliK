<template>
  <div class="mt-2">
    <div class="flex flex-wrap gap-1">
      <Button
        v-for="type in foodTypes"
        :key="type.id"
        :variant="modelValue.includes(type.id) ? 'default' : 'outline'"
        :class="[
          'text-[11px] px-1.5 py-0.5 h-6 rounded font-segoe transition-colors',
          modelValue.includes(type.id) 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
        ]"
        @click="toggleType(type.id)"
      >
        {{ type.label }}
      </Button>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const foodTypes = [
  { id: 'bakery', label: 'Bakery' },
  { id: 'beverages', label: 'Beverages Store' },
  { id: 'butcher', label: 'Butcher Shop' },
  { id: 'chocolate', label: 'Chocolate Shop' },
  { id: 'coffee', label: 'Coffee Shop' },
  { id: 'convenience', label: 'Convenience Store' },
  { id: 'deli', label: 'Deli' },
  { id: 'health_food', label: 'Health Food Store' },
  { id: 'produce', label: 'Produce Market' },
  { id: 'supermarket', label: 'Supermarket' },
  { id: 'tea', label: 'Tea Shop' },
  { id: 'wholesale', label: 'Wholesale Store' }
]

const toggleType = (typeId) => {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(typeId)
  
  if (index === -1) {
    newValue.push(typeId)
  } else {
    newValue.splice(index, 1)
  }
  
  emit('update:modelValue', newValue)
}
</script>