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
                : 'bg-gray-600') + (day.selected ? ' transform scale-110' : '')
            "
            @click="selectDay(day)"
            v-for="day in days"
            :key="day.day"
          >
            <span class="font-bold">{{ day.name }}</span>
          </button>
        </div>

        <div class="mt-8">
          <p class="pl-3 text-lg">Horarios (24 hrs)</p>
          <div class="mt-3 flex justify-center items-center font-medium">
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
            <button
              @click="confirmDeletion()"
              :class="scheduleTakenSelected ? 'btn-danger' : 'btn-disabled'"
              class="text-xs ml-2 px-1 py-0.5 flex items-center"
            >
              <span class="material-icons">
                delete
              </span>
            </button>
          </div>

          <div class="mt-5 flex">
            <button @click="saveSchedule()" class="btn-success mx-auto">
              Guardar horarios
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import showAlert from "@/utils/alerts.js";
import { mapActions, mapState } from "vuex";

export default {
  name: "Schedule",
  data: function() {
    return {
      days: [
        { name: "Lunes", day: 1, state: 0, selected: false },
        { name: "Martes", day: 2, state: 0, selected: false },
        { name: "Miércoles", day: 3, state: 0, selected: false },
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
          found_day.state = 2;
        }
      });
    });
  },
  computed: {
    ...mapState({
      schedule: (state) => state.schedule.schedule,
    }),
    scheduleTakenSelected() {
      return (
        this.days.find((day) => day.selected && day.state == 2) &&
        this.days.find((day) => day.selected && day.state != 2) == undefined
      );
    },
  },
  methods: {
    ...mapActions(["addSchedule", "getSchedule", "removeSchedule"]),
    selectDay(selected_day) {
      if (selected_day.state == 0) {
        this.days.find((day) => day.day == selected_day.day).state = 1;
      } else if (selected_day.state == 1) {
        this.days.find((day) => day.day == selected_day.day).state = 0;
      } else if (selected_day.state == 2) {
        if (!selected_day.selected) {
          // Asigno la hora de inicio que tiene
          this.start_hour = this.schedule.find(
            (day) => day.day == selected_day.day
          ).start_hour;
          // Asigno la hora de fin que tiene
          this.end_hour = this.schedule.find(
            (day) => day.day == selected_day.day
          ).end_hour;
        } else {
          this.start_hour = null;
          this.end_hour = null;
        }

        this.days.forEach((day) => {
          // Deselecciono todas menos la que se quiere seleccionar
          if (day.state == 2 && day.day != selected_day.day) {
            day.selected = false;
          }
          if (
            day.selected &&
            selected_day.selected &&
            day.day != selected_day.day
          ) {
            // Asigno la hora de inicio de otra que este seleccioada
            let found_day = this.schedule.find(
              (d) => parseInt(d.day) == day.day
            );
            this.start_hour = found_day ? found_day.start_hour : null;
            // Asigno la hora de fin de otra que este seleccioada
            found_day = this.schedule.find((d) => parseInt(d.day) == day.day);
            this.end_hour = found_day ? found_day.end_hour : null;
          }
        });
      }
      // Seleccionando el dia
      this.days.find(
        (day) => day.day == parseInt(selected_day.day)
      ).selected = !selected_day.selected;
    },
    saveSchedule() {
      if (!this.start_hour || !this.end_hour) {
        showAlert({
          type: "error",
          message: "Debes indicar la hora de disponibilidad",
        });
      } else {
        this.days.forEach((day) => {
          if (day.selected) {
            let data = {
              day: day.day,
              start_hour: this.start_hour,
              end_hour: this.end_hour,
            };
            this.addSchedule(data).then(() => {
              day.state = 2;
              day.selected = false;
              this.start_hour = null;
              this.end_hour = null;
              showAlert({
                type: "success",
                message: "Horarios de disponibilidad actualizada correctamente",
              });
            });
          }
        });
      }
    },
    confirmDeletion() {
      let day_to_delete = "";

      this.days.forEach((day) => {
        if (day.selected) {
          day_to_delete = day_to_delete + `${day.name}`;
        }
      });
      let alert = this.$swal.mixin({
        toast: false,
        position: "center",
        showConfirmButton: true,
        showDenyButton: true,
        timer: 60000,
        timerProgressBar: true,
        iconColor: "white",
        heightAuto: true,
        customClass: {
          popup: "colored-toast",
        },
      });
      alert
        .fire({
          html: `<span class="text-white">¿Estas segurx de eliminar tus horarios del <b>${day_to_delete}</b>? </span>  `,
          showCancelButton: false,
          confirmButtonText: `Eliminar`,
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.days.forEach((day) => {
              if (day.selected) {
                this.removeSchedule({ day: parseInt(day.day) }).then(() => {
                  day.state = 0;
                  day.selected = false;
                  this.start_hour = null;
                  this.end_hour = null;
                  showAlert({
                    type: "success",
                    message:
                      "Horarios de disponibilidad eliminados correctamente",
                  });
                });
              }
            });
          }
        });
    },
  },
};
</script>

<style></style>
