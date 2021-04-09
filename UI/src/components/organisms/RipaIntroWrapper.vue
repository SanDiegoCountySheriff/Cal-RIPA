<template>
  <v-card class="mx-auto my-12" max-width="600">
    <v-card-title>RIPA Stop App</v-card-title>

    <v-card-text>
      <div>Initiate a new Stop</div>
      <v-divider></v-divider>
      <div class="tw-mt-4">About this App:</div>
      <p>
        The Racial and Identity Profiling Act of 2015 (AB 953) requires state
        and local law enforcement agencies, to collect data regarding stops of
        individuals, including perceived demographic information on the person
        stopped, and to report this data to the California Attorney General's
        (AG) Office.
      </p>
      <p>
        The AG’s Office has adopted
        <a href="https://ripademo.azurewebsites.net/regulation"
          >these regulations</a
        >
        on November 7, 2017. For more information please see the
        <a href="https://oag.ca.gov/ab953/regulations">AG's Website</a>.
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ripa-intro-wrapper',
}
</script>
