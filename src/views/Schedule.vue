<template>
  <div class="text-white">
    <h2 class="text-white text-center text-3xl font-semibold pt-1">
      Horarios de disponibilidad
    </h2>

    <div class="flex justify-center items-center mt-10">
      <div class="p-8 pb-4 bg-gray-700 border-2 border-gray-600 rounded-xl">
        <p class="pl-3 text-lg">Días</p>
        <div class="flex mt-1">
          <button
            class="mx-2 py-3 px-4 transition-all ease-in-out hover:bg-opacity-70 rounded-xl shadow-lg select-none"
            :class="
              (day.state == 1
                ? 'bg-blue-500'
                : day.state == 2
                ? 'bg-green-600'
                : 'bg-gray-600') + (day.selected ? ' transform scale-105' : '')
            "
            @click="selectDay(day)"
            v-for="day in days"
            :key="day.day"
          >
            <span class="font-bold">{{ day.name }}</span>
          </button>
        </div>

        <div class="mt-8">
          <p class="pl-3 text-lg">Horarios</p>
          <div class="mt-1 flex justify-center font-medium">
            <span>De: </span>
            <input
              type="time"
              v-model="start_hour"
              class="ml-2 px-2 rounded-lg bg-gray-500 outline-none cursor-pointer text-white"
            />
            <span class="ml-5">Hasta: </span>
            <input
              type="time"
              v-model="end_hour"
              class="ml-2 px-2 rounded-lg bg-gray-500 outline-none cursor-pointer text-white"
            />
          </div>
          <div class="mt-10 flex ">
            <button class="btn-success mx-auto">Guardar horarios</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Schedule",
  data: function() {
    return {
      days: [
        { name: "Lunes", day: 1, state: 0, selected: false },
        { name: "Martes", day: 2, state: 0, selected: false },
        { name: "Miercoles", day: 3, state: 0, selected: false },
        { name: "Jueves", day: 4, state: 0, selected: false },
        { name: "Viernes", day: 5, state: 0, selected: false },
      ],
      start_hour: null,
      end_hour: null,
    };
  },
  created() {
    this.getSchedule().then(() => {
      this.schedule.forEach((element) => {
        let found_day = this.days.find(
          (day) => day.day == parseInt(element.day)
        );

        if (found_day) {
          console.log("lol");
          found_day.state = 2;
        }
      });
    });
  },
  computed: {
    ...mapState({
      schedule: (state) => state.schedule.schedule,
    }),
  },
  methods: {
    ...mapActions(["addSchedule", "getSchedule"]),
    selectDay(day_selected) {
      this.days.find((day) => day.day == day_selected.day).selected = !day_selected.selected;
      if (day_selected.state == 1) {
        this.days.find((day) => day.day == day_selected.day).state = 0;
      } else if (day_selected.state == 0) {
        this.days.find((day) => day.day == day_selected.day).state = 1;
      }
    },
    saveSchedule() {},
  },
};
</script>

<style></style>
