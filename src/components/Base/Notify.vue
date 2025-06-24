<template>
  <div v-if="notify.isShow" :class="['notify', notifyClass]">
    <WarningIcon v-if="notify.type === 'warning'" />
    <ErrorIcon v-if="notify.type === 'error'" />
    <SuccessIcon v-if="notify.type === 'success'" />
    <span class="notify__text">{{ notify.message }}</span>
  </div>
</template>
    
<script>
import WarningIcon from "../../assets/images/icons/warning-icon.vue";
import ErrorIcon from "../../assets/images/icons/error-icon.vue";
import SuccessIcon from "../../assets/images/icons/success-icon.vue";

export default {
  name: "notify",
  components: {
    WarningIcon,
    ErrorIcon,
    SuccessIcon,
  },
  computed: {
    notify() {
      return this.$store.getters["notify/getNotify"];
    },
    notifyClass() {
      return this.notify.type ? `-` + this.notify.type : "";
    },
  },
};
</script>

<style lang="scss" scoped>
.notify {
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 100;
  right: 10px;
  top: 40px;
  box-shadow: rgba(0, 0, 0, 0.541) 0px 5px 15px;
  background-color: rgba(255, 255, 255, 0.507);
  padding: 40px 10px;
  width: 500px;
  border-left: 8px solid;
  border-radius: 15px;

  &.-error {
    border-color: #ff0000;
    background: linear-gradient(90deg, rgba(207, 27, 27, 0.3) 0%, rgba(15, 16, 33, 0.4) 47%, rgba(15, 16, 33, 0.5) 87%);
  }

  &.-warning {
    border-color: #ff8800;
    background: linear-gradient(90deg, rgba(207, 126, 27, 0.3) 0%, rgba(15, 16, 33, 0.4) 47%, rgba(15, 16, 33, 0.5) 87%);
  }

  &.-success {
    border-color: #4de910;
    background: linear-gradient(90deg, rgba(42, 207, 27, 0.3) 0%, rgba(15, 16, 33, 0.4) 47%, rgba(15, 16, 33, 0.5) 87%);
  }

  &__text {
    font-size: 18px;
    margin-left: 30px;
    color: #cecece;
  }
}
</style>