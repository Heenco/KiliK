<template>
  <div class="p-6 bg-gray-800 rounded-lg shadow-lg">
    <h2 class="text-xl font-bold text-blue-400 mb-2">Inspection Checklist</h2>
    <p class="text-gray-300 text-sm mb-4">Ensure the property meets all necessary standards.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- House Exterior Section -->
      <div class="border border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-bold text-gray-300 mb-2">House Exterior</h3>
        <ul class="space-y-4">
          <li v-for="(question, index) in checklistQuestions.slice(0, 4)" :key="index" class="flex items-center justify-between">
            <span class="text-gray-300">{{ question }}</span>
            <label class="flex items-center space-x-2">
              <span class="text-gray-300">No</span>
              <input type="checkbox" v-model="answers[index]" class="toggle-switch">
              <span class="text-gray-300">Yes</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- Roof Section -->
      <div class="border border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-bold text-gray-300 mb-2">Roof</h3>
        <ul class="space-y-4">
          <li v-for="(question, index) in checklistQuestions.slice(4, 7)" :key="index + 4" class="flex items-center justify-between">
            <span class="text-gray-300">{{ question }}</span>
            <label class="flex items-center space-x-2">
              <span class="text-gray-300">No</span>
              <input type="checkbox" v-model="answers[index + 4]" class="toggle-switch">
              <span class="text-gray-300">Yes</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- Foundations/Ground Section -->
      <div class="border border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-bold text-gray-300 mb-2">Foundations/Ground</h3>
        <ul class="space-y-4">
          <li v-for="(question, index) in checklistQuestions.slice(7, 10)" :key="index + 7" class="flex items-center justify-between">
            <span class="text-gray-300">{{ question }}</span>
            <label class="flex items-center space-x-2">
              <span class="text-gray-300">No</span>
              <input type="checkbox" v-model="answers[index + 7]" class="toggle-switch">
              <span class="text-gray-300">Yes</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- Garden Section -->
      <div class="border border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-bold text-gray-300 mb-2">Garden</h3>
        <ul class="space-y-4">
          <li v-for="(question, index) in gardenQuestions" :key="index" class="flex items-center justify-between">
            <span class="text-gray-300">{{ question }}</span>
            <label class="flex items-center space-x-2">
              <span class="text-gray-300">No</span>
              <input type="checkbox" v-model="gardenAnswers[index]" class="toggle-switch">
              <span class="text-gray-300">Yes</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- Deck/Porch Section -->
      <div class="border border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-bold text-gray-300 mb-2">Deck/Porch</h3>
        <ul class="space-y-4">
          <li v-for="(question, index) in deckQuestions" :key="index" class="flex items-center justify-between">
            <span class="text-gray-300">{{ question }}</span>
            <label class="flex items-center space-x-2">
              <span class="text-gray-300">No</span>
              <input type="checkbox" v-model="deckAnswers[index]" class="toggle-switch">
              <span class="text-gray-300">Yes</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- Other - External Section -->
      <div class="border border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-bold text-gray-300 mb-2">Other - External</h3>
        <ul class="space-y-4">
          <li v-for="(question, index) in otherExternalQuestions" :key="index" class="flex items-center justify-between">
            <span class="text-gray-300">{{ question }}</span>
            <label class="flex items-center space-x-2">
              <span class="text-gray-300">No</span>
              <input type="checkbox" v-model="otherExternalAnswers[index]" class="toggle-switch">
              <span class="text-gray-300">Yes</span>
            </label>
          </li>
        </ul>
      </div>



      <!-- Living/Dining Section -->
      <div class="border border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-bold text-gray-300 mb-2">Living/Dining</h3>
        <ul class="space-y-4">
          <li v-for="(question, index) in livingQuestions" :key="index" class="flex items-center justify-between">
            <span class="text-gray-300">{{ question }}</span>
            <label class="flex items-center space-x-2">
              <span class="text-gray-300">No</span>
              <input type="checkbox" v-model="livingAnswers[index]" class="toggle-switch">
              <span class="text-gray-300">Yes</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- Kitchen Section -->
      <div class="border border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-bold text-gray-300 mb-2">Kitchen</h3>
        <ul class="space-y-4">
          <li v-for="(question, index) in kitchenQuestions" :key="index" class="flex items-center justify-between">
            <span class="text-gray-300">{{ question }}</span>
            <label class="flex items-center space-x-2">
              <span class="text-gray-300">No</span>
              <input type="checkbox" v-model="kitchenAnswers[index]" class="toggle-switch">
              <span class="text-gray-300">Yes</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- Bathroom Section -->
      <div class="border border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-bold text-gray-300 mb-2">Bathroom</h3>
        <ul class="space-y-4">
          <li v-for="(question, index) in bathroomQuestions" :key="index" class="flex items-center justify-between">
            <span class="text-gray-300">{{ question }}</span>
            <label class="flex items-center space-x-2">
              <span class="text-gray-300">No</span>
              <input type="checkbox" v-model="bathroomAnswers[index]" class="toggle-switch">
              <span class="text-gray-300">Yes</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- Bedroom(s) Section -->
      <div class="border border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-bold text-gray-300 mb-2">Bedroom(s)</h3>
        <ul class="space-y-4">
          <li v-for="(question, index) in bedroomQuestions" :key="index" class="flex items-center justify-between">
            <span class="text-gray-300">{{ question }}</span>
            <label class="flex items-center space-x-2">
              <span class="text-gray-300">No</span>
              <input type="checkbox" v-model="bedroomAnswers[index]" class="toggle-switch">
              <span class="text-gray-300">Yes</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- Laundry Section -->
      <div class="border border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-bold text-gray-300 mb-2">Laundry</h3>
        <ul class="space-y-4">
          <li v-for="(question, index) in laundryQuestions" :key="index" class="flex items-center justify-between">
            <span class="text-gray-300">{{ question }}</span>
            <label class="flex items-center space-x-2">
              <span class="text-gray-300">No</span>
              <input type="checkbox" v-model="laundryAnswers[index]" class="toggle-switch">
              <span class="text-gray-300">Yes</span>
            </label>
          </li>
        </ul>
      </div>


            <!-- Other - Internal Section -->
      <div class="border border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-bold text-gray-300 mb-2">Other - Internal</h3>
        <ul class="space-y-4">
          <li v-for="(question, index) in otherInternalQuestions" :key="index" class="flex items-center justify-between">
            <span class="text-gray-300">{{ question }}</span>
            <label class="flex items-center space-x-2">
              <span class="text-gray-300">No</span>
              <input type="checkbox" v-model="otherInternalAnswers[index]" class="toggle-switch">
              <span class="text-gray-300">Yes</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- Miscellaneous Section -->
      <div class="border border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-bold text-gray-300 mb-2">Miscellaneous</h3>
        <ul class="space-y-4">
          <li v-for="(question, index) in miscellaneousQuestions" :key="index" class="flex items-center justify-between">
            <span class="text-gray-300">{{ question }}</span>
            <label class="flex items-center space-x-2">
              <span class="text-gray-300">No</span>
              <input type="checkbox" v-model="miscellaneousAnswers[index]" class="toggle-switch">
              <span class="text-gray-300">Yes</span>
            </label>
          </li>
        </ul>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const checklistQuestions = ref([
  "Are the stumps in good condition?",
  "Is there any damage or cracking on the sides of the house?",
  "Are the doors and windows watertight?",
  "Is the paintwork in good condition?",
  "Is the roof in good shape with no missing parts?",
  "Is the gutter in good condition without any clogs, holes, stains or rust?",
  "Is the antenna working and in good condition?",
  "Is the foundation cracked, wet or leaning badly?",
  "Is there moss on the ground?",
  "Is the land slanted?"
]);

const gardenQuestions = ref([
  "Are the trees touching the building or any power lines? If so, consider regular tree trimming costs.",
  "Are there any large trees you would like to remove? If yes, some trees are protected and you may need council approval and an arborist.",
  "If you have pets, is the garden secure?"
]);

const livingQuestions = ref([
  "Is the room large enough to accommodate your furniture and other appliances?",
  "Are the floors level?",
  "Are there signs of rising damp (any noticeable smells, bubbles in plaster or dark spongy timber floors)?",
  "If the floors are timber, are they firm and not bouncy? Bouncy floors could mean the house stumps need attention.",
  "If the floors are concrete, are they without cracks?",
  "Are there enough power points? Are they where you need them?"
]);

const deckQuestions = ref([
  "Is the railing intact?",
  "Is the flooring even and properly nailed?",
  "Do the supporting beams of the deck have any signs of insect damage or rot?"
]);

const otherExternalQuestions = ref([
  "Are the fences in good condition?",
  "Are the fence posts firmly intact?",
  "Is there a pool? Check the filtration, heating and see if the fence meets council regulations."
]);

const otherInternalQuestions = ref([
  "Is the insulation adequate?",
  "Does the cooling system work effectively?",
  "Is the flooring in good condition?",
  "Are there any visible cracks in the walls or ceiling?",
  "Are fly screens installed and in good condition?",
  "Do doors and windows open and close properly?",
  "Is the painting in good condition?",
  "Is the lighting sufficient?"
]);

const kitchenQuestions = ref([
  "Is the kitchen big enough for your needs (check bench space, cupboard space and pantry).",
  "Does the sink drain fast enough? Are there any dripping taps?",
  "Is there sufficient room for white goods (fridge, microwave, dishwasher)?",
  "Is the stove in good condition? Is it large enough for your needs? Turn it on to see that it works.",
  "Does the exhaust fan work properly? Is there enough ventilation?"
]);

const bathroomQuestions = ref([
  "Is the tap/shower head dripping water?",
  "Does the water drain fast enough?",
  "Does the shower door leak?",
  "Is there enough storage?",
  "Are the bathroom walls and tiles in good condition? Cracked tiles and bad grout could be difficult to repair.",
  "Does the toilet work properly?",
  "Is there a steam extractor fan or a window for ventilation?"
]);

const bedroomQuestions = ref([
  "Will the room be affected by noise, light, street traffic?",
  "Will the room be cool in summer?",
  "Is there enough storage in the built-in wardrobes? Will you need to purchase more storage?",
  "Are there enough power points? Are they where you need them?"
]);

const laundryQuestions = ref([
  "Can the electrical wiring withstand the load?",
  "Does the tap and drain in the laundry sink work? Are there any leakages?",
  "Is there enough ventilation?"
]);

const miscellaneousQuestions = ref([
  "Was the house added on as an extension? Was this approved by the Council?",
  "If needed, is there room to extend the house?",
  "Is the water heater capacity large enough?",
  "Are there any hazardous chemicals like asbestos? Not sure? ",
  "Are there any signs of pests? e.g. termites, rats, possums. Not sure? ",
  "Will the house require any immediate renovations? ",
   "Will you need to purchase any new furniture or white goods for the house? "
]);

const answers = ref(Array(checklistQuestions.value.length).fill(true));
const gardenAnswers = ref(Array(gardenQuestions.value.length).fill(true));
const livingAnswers = ref(Array(livingQuestions.value.length).fill(true));
const deckAnswers = ref(Array(deckQuestions.value.length).fill(true));
const otherExternalAnswers = ref(Array(otherExternalQuestions.value.length).fill(true));

const kitchenAnswers = ref(Array(kitchenQuestions.value.length).fill(true));
const bathroomAnswers = ref(Array(bathroomQuestions.value.length).fill(true));
const bedroomAnswers = ref(Array(bedroomQuestions.value.length).fill(true));
const laundryAnswers = ref(Array(laundryQuestions.value.length).fill(true));
const otherInternalAnswers = ref(Array(otherInternalQuestions.value.length).fill(true));
const miscellaneousAnswers = ref(Array(miscellaneousQuestions.value.length).fill(true));
</script>

<style scoped>
.toggle-switch {
  appearance: none;
  width: 40px;
  height: 20px;
  background: #ccc;
  border-radius: 9999px;
  position: relative;
  outline: none;
  cursor: pointer;
  transition: background 0.3s;
}
.toggle-switch:checked {
  background: #4caf50;
}
.toggle-switch:before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
}
.toggle-switch:checked:before {
  transform: translateX(20px);
}
</style>
