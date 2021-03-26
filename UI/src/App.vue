<template>
  <main id="app">
    <header>
      <b-navbar toggleable="sm" type="dark" variant="dark">
        <b-navbar-brand href="#">CSSA | RIPA</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item to="/login">Login</b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown text="User" variant="primary">
              <b-dropdown-item to="/profile">Profile</b-dropdown-item>
              <b-dropdown-item to="/stops">Stops</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                Admin
              </template>
              <b-dropdown-item href="/login">Login</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>
    <b-container>
      <router-view />
    </b-container>
  </main>
</template>

<style lang="scss">
.container {
  border-radius: 0.25rem;
  margin-top: 1.5rem;
  padding: 1.5rem;
  @include shadow;
}
.navbar-nav {
  a {
    font-weight: bold;
    color: $black;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
