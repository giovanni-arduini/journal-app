<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-10 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center absolute"
    >
      <div class="bg-white flex flex-col rounded-md min-w-[300px] p-4">
        <button class="self-end" type="button" @click="$emit('close')">
          X
        </button>
        <div class="flex flex-col py-4 px-12">
          <!-- Header -->
          <div class="flex justify-center items-center mb-4">
            <h2 class="text-lg font-semibold">{{ title }}</h2>
          </div>

          <!-- Form dinamico -->
          <form @submit.prevent="handleSubmit">
            <div
              v-for="field in fields"
              :key="field.name"
              class="flex flex-col gap-1 mb-6"
            >
              <label :for="field.name">{{ field.label }}</label>
              <input
                v-if="
                  field.type === 'text' ||
                  field.type === 'date' ||
                  field.type === 'number'
                "
                :type="field.type"
                :id="field.name"
                v-model="formData[field.name]"
                :placeholder="field.placeholder"
                class="border rounded px-2"
              />
              <select
                v-else-if="field.type === 'select' || field.type === 'boolean'"
                :id="field.name"
                v-model="formData[field.name]"
                class="border rounded px-2"
              >
                <option v-for="opt in field.options" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>
              <select
                v-else-if="field.type === `boolean`"
                :id="field.name"
                v-model="formData[field.name]"
                class="border rounded xp-2"
              >
                <option :value="true">true</option>
                <option :value="false">false</option>
              </select>

              <p v-if="errors[field.name]" class="text-red-500 text-sm">
                {{ errors[field.name] }}
              </p>

              <!-- Aggiungi altri tipi se necessario -->
            </div>
            <div class="flex justify-end mt-4 gap-2">
              <slot name="footer">
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {{ submitLabel }}
                </button>
                <button
                  type="button"
                  class="px-4 py-2 bg-gray-300 rounded"
                  @click="$emit('close')"
                >
                  Chiudi
                </button>
              </slot>
            </div>
          </form>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: "" },
  fields: { type: Array, default: () => [] },
  initialValues: { type: Object, default: () => ({}) },
  submitLabel: { type: String, default: "Conferma" },
  previousList: { type: Array, default: () => [] },
});
const emit = defineEmits(["submit", "close"]);

const formData = ref({ ...props.initialValues });
const errors = ref({});

watch(
  () => props.initialValues,
  (val) => {
    formData.value = { ...val };
    errors.value = {};
  }
);

function validateField(field) {
  const value = formData.value[field.name];

  if (field.required && !formData.value[field.name]) {
    errors.value[field.name] = `${field.label} è obbligatorio`;
  } else if (
    field.name === "name" &&
    props.previousList.some(
      (existingName) => existingName.toLowerCase() === value?.toLowerCase()
    )
  ) {
    errors.value[field.name] = "Nome già utilizzato";
  } else {
    delete errors.value[field.name];
  }
}

const isFormValid = computed(() => Object.keys(errors.value).length === 0);

function handleSubmit() {
  // controlla tutti i campi prima di emettere
  props.fields.forEach(validateField);

  if (!isFormValid.value) return;

  emit("submit", { ...formData.value });
  emit("close");
}
</script>
