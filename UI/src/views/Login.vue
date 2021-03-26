<template>
  <section class="login">
    <b-form-group
      id="username"
      description="Enter your username."
      label="Username"
      label-for="username--input"
      valid-feedback="Thank you!"
      :invalid-feedback="invalidFeedback"
      :state="state"
    >
      <b-form-input id="username--input" v-model="username" :state="state" trim></b-form-input>
    </b-form-group>
    <b-form-group
      id="password"
      description="Enter your password."
      label="Password"
      label-for="password--input"
      valid-feedback="Thank you!"
      :invalid-feedback="invalidFeedback"
      :state="state"
    >
      <b-form-input id="password--input" v-model="password" :state="state" trim></b-form-input>
    </b-form-group>
  </section>
</template>

<script>
export default {
  computed: {
    state() {
      return this.username.length >= 4;
    },
    invalidFeedback() {
      console.log(this.username);
      if (this.username.length > 0) {
        return 'Enter at least 4 characters.';
      }
      return 'Please enter something.';
    },
  },
  data() {
    return {
      username: '',
    };
  },
};
</script>
