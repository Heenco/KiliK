<template>
  <div class="mt-2">
    <div class="flex flex-wrap gap-1">
    
     
      <Button
        v-for="type in healthTypes"
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

const healthTypes = [
  { id: 'pharmacy', label: 'Pharmacy' },
  { id: 'doctors', label: 'Doctor\'s Office' },
  { id: 'dentist', label: 'Dental Clinic' },
  { id: 'hospital', label: 'Hospital' },
  { id: 'clinic', label: 'Medical Clinic' },
  { id: 'optician', label: 'Optician' },
  { id: 'physiotherapist', label: 'Physiotherapy' },
  { id: 'alternative', label: 'Alternative Medicine' },
  { id: 'laboratory', label: 'Medical Lab' },
  { id: 'veterinary', label: 'Veterinary' }
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