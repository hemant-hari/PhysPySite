const Login = {
  template: `
  <div class="w3-container w3-row w3-padding-large">
    <div
      id="warningMessage"
      class="w3-panel w3-yellow w3-border w3-row"
      v-if="!validForm"
    >
      <span
        onclick="this.parentElement.style.display='none'"
        class="w3-button w3-yellow w3-col"
        style="width:5%"
      >
        x
      </span>
      <ul class="w3-ul w3-rest">
        <li v-if="isLoading"> Logging in... </li>
        <li v-for="error in errors">
          {{ error }}
        </li>
      </ul>
    </div>
    <div class="w3-container w3-third"></div>
    <div class="w3-card-4 w3-third">
      <div class="w3-container w3-theme-l1">
        <h2>Login</h2>
      </div>

      <form
        class="w3-container"
        @submit="checkForm"
        action="/api/register"
        method="post"
      >
        <div class="w3-row w3-section">
          <input
          class="w3-input w3-border w3-padding"
          name="email"
          type="email"
          v-model="userEmail"
          placeholder="E-mail">
        </div>

        <div class="w3-section">
          <input
            class="w3-input w3-border w3-padding"
            name="password"
            type="password"
            v-model="password"
            placeholder="Password">
        </div>

        <p>
          <input
            class="w3-button w3-red w3-hover-orange w3-padding"
            type="submit"
            value="Login"
          ></input>
        </p>
      </form>
    </div>
  </div>`,
  data: function() {
    return {
      userEmail: "",
      password: "",
      isLoading: false,
      validForm: true,
      errors: []
    }
  },
  methods: {
    checkForm: function(e) {
      var self = this;
      this.errors = [];
      e.preventDefault();

      if (this.isLoading){
        return;
      }

      if (!this.userEmail) {
        this.errors.push('Email required');
      }
      else if (!this.validEmail(this.userEmail)) {
        this.errors.push('Valid email required.');
      }

      if (!this.password) {
        this.errors.push("Password required.");
      }

      if (!this.errors.length) {
        this.isLoading = true;
        fetch("/api/authenticate", {
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            email: self.userEmail,
            password: self.password,
          })
        }).then(res => res.json())
          .then((result) => {
              self.isLoading = false;
              if (!result.success){
                self.errors.push(result.message);
                self.validForm = false;
                return false;
              }
              var newLoginState = {
                loggedIn: true,
                authToken: result.token,
                userName: result.user.name
              }
              self.$root.$data.loginState = newLoginState;
              self.$router.push('/');
            },
            (error) => {
              console.log(error);
              self.isLoading = false;
              self.errors.push("Login failed, try again in a while!");
            });
      }

      this.validForm = false;
      if (document.getElementById("warningMessage")){
        document.getElementById("warningMessage").style.display = 'block';
      }
    },
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
};

const Register = {
  template: `
  <div class="w3-container w3-row w3-padding-large">
    <div
      id="warningMessage"
      class="w3-panel w3-yellow w3-border w3-row"
      v-if="!validForm"
    >
      <span
        onclick="this.parentElement.style.display='none'"
        class="w3-button w3-yellow w3-col"
        style="width:5%"
      >
        x
      </span>
      <ul class="w3-ul w3-rest">
        <li v-for="error in errors">
          {{ error }}
        </li>
      </ul>
    </div>
    <div class="w3-container w3-quarter"></div>
    <div class="w3-card w3-half">
      <div class="w3-container w3-theme-l1">
        <h2>Register an account!</h2>
      </div>

      <form
        class="w3-container w3-row"
        @submit="checkForm"
        action="/api/register"
        method="post"
      >
        <div class="w3-row w3-section">
          <input
            class="w3-input w3-border w3-half w3-padding"
            name="first"
            type="text"
            v-model="firstName"
            placeholder="First Name"
          >
          <input
            class="w3-input w3-border w3-half w3-padding"
            name="last"
            type="text"
            v-model="lastName"
            placeholder="Last Name"
          >
        </div>

        <div class="w3-row w3-section">
          <input
            class="w3-input w3-border w3-padding"
            name="email"
            type="email"
            v-model="userEmail"
            placeholder="E-mail"
          >
        </div>

        <div class="w3-section">
          <input
            class="w3-input w3-border w3-padding"
            name="password"
            type="password"
            v-model="password"
            placeholder="Password"
          >
        </div>

        <div class="w3-section">
          <input
            class="w3-input w3-border w3-padding"
            name="confirm"
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm Password"
          >
        </div>

        <p>
          <input
            class="w3-button w3-red w3-hover-orange w3-padding"
            type="submit"
            value="Register"
          >
        </p>
      </form>
    </div>
  </div>`,
  data: function() {
    return {
      userEmail: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      isLoading: false,
      validForm: true,
      errors: []
    }
  },
  methods: {
    checkForm: function(e) {
      var self = this;
      this.errors = [];
      e.preventDefault();

      if (this.isLoading){
        return;
      }

      if (!this.userEmail) {
        this.errors.push('Email required');
      }
      else if (!this.validEmail(this.userEmail)) {
        this.errors.push('Valid email required.');
      }

      if (!this.firstName) {
        this.errors.push("First name required.");
      }

      if (!this.lastName) {
        this.errors.push("Last name required.");
      }

      if (!this.password) {
        this.errors.push("Password required.");
      }
      else if (this.password != this.confirmPassword) {
        this.errors.push("Confirmation password not the same");
      }

      if (!this.errors.length) {
        this.isLoading = true;
        fetch("/api/register", {
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            email: self.userEmail,
            password: self.password,
            first: self.firstName,
            last: self.lastName
          })
        }).then(res => res.json())
          .then((result) => {
              self.isLoading = false;
              if (!result.success){
                self.errors.push("Registering failed, try again in a while!");
                return false;
              }
              self.$router.push('/');
            },
            (error) => {
              self.isLoading = false;
              self.errors.push("Registering failed, try again in a while!");
            });
      }

      this.validForm = false;
      document.getElementById("warningMessage").style.display = 'block';
    },
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
};

var Snippet = {
  template: `
  <div class="w3-container w3-row">
    <div class="w3-container w3-quarter"></div>
    <div class="w3-half w3-theme-light">
      <h2 class="w3-container w3-xxlarge w3-theme-d3"> Title </h2>
      <div
        id="description"
        class="w3-panel w3-theme-light"
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
        qui officia deserunt mollit anim id est laborum.

        <p>
          When \\(a \\ne 0\\), there are two solutions to \\(ax^2 + bx + c = 0\\) and they are
          $$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$
        </p>

        <p>
            $$y = { \\int_a^b x }.$$
        </p>

        <p>
          $$\\sum_{i=1}^{\\left[\\frac{n}{2}\\right]}\\binom{x_{i,i+1}^{i^{2}}}
          {\\left[\\frac{i+3}{3}\\right]}\\frac{\\sqrt{\\mu(i)^{\\frac{3}
          {2}}(i^{2}-1)}}{\\sqrt[3]{\\rho(i)-2}+\\sqrt[3]{\\rho(i)-1}}.$$
        </p>
      </div>

      <div
        class="w3-container w3-theme-l3"
        style="height:386px;"
      >
        <div
          id="plotly"
          style="height:350px;"
        ></div>
      </div>
    </div>
  </div>
  `,

}

const Play = {
  template: `
  <div class="w3-row">
    <div class="w3-container w3-theme-dark w3-padding"> {{ pyodideLoaded ? "Python is now loaded!" : "Python is loading..." }} </div>
    <div class="w3-half w3-container w3-deep-orange" style="height:386px;"><div id="plotly" style="height:350px;"></div></div>
    <div class="w3-half w3-container w3-indigo">
      <div id="codeEditor" class="w3-panel"></div>
      <button class="w3-button w3-red w3-margin-bottom" v-on:click="runCode">Run it!</button>
    </div>
    <div id='log' class="w3-half w3-container w3-light-gray" style="overflow-y:scroll;height:300px;max-height:300px">
    </div>
    <div class="w3-half w3-container w3-light-gray">
      <h2>Pick options for the plot below!</h2>
      <div id="plot-form">
        <form class="w3-container">
          <div class="w3-panel">
            <h3>Type of Plot</h3>
            <p>
            <input type="radio" name="plot-type" value="lines+markers" v-model="plotType" checked/>
            <label>Lines and Markers</label></p>
            <p>
            <input type="radio" name="plot-type" value="lines" v-model="plotType"/>
            <label>Line</label></p>
            <p>
            <input type="radio" name="plot-type" value="markers" v-model="plotType"/>
            <label>Scatter</label></p>
          </div>
          <div class="w3-panel">
            <h3>Variables to plot</h3>
            <label>X-Axis Array Name</label>
            <input class="w3-input" type="text" value="X" v-model="xArray">

            <label>Y-Axis Array Name</label>
            <input class="w3-input" type="text" value="Y" v-model="yArray">
          </div>
        </form>
      </div>
    </div>
  </div>`,
  data: function() {
    return {
      code: '# Python code goes here :)',
      pyodideLoaded: false,
      consoleOutput: '',
      plotType: "lines+markers",
      xArray: "X",
      yArray: "Y"
    }
  },
  methods: {
    runCode: function(){
      if (!this.pyodideLoaded) return;
      var self = this;
      console.log(self.code);
      pyodide.runPythonAsync(this.code).then(function(val){
          console.log(pyodide.globals);
          Plotly.newPlot('plotly', {
            data: [{
              x: pyodide.globals[self.xArray],
              y: pyodide.globals[self.yArray],
              mode: self.plotType,
              transforms: [{
                type: 'filter',
                operation: '<=',
                target: pyodide.globals[self.xArray],
                value: 0.0
              }]
            }],
            layout: {
              updatemenus: [{
                type: 'buttons',
                xanchor: 'left',
                yanchor: 'top',
                direction: 'right',
                x: 0,
                y: 0,
                pad: {t: 60},
                showactive: false,
                buttons: [{
                  label: 'Play',
                  method: 'animate',
                  args: [null, {
                    transition: {duration: 0},
                    frame: {duration: 20, redraw: false},
                    mode: 'immediate',
                    fromcurrent: true,
                  }]
                }, {
                  label: 'Pause',
                  method: 'animate',
                  args: [[null], {
                    frame: {duration: 0, redraw: false},
                    mode: 'immediate',
                  }]
                }]
              }],
              sliders: [{
                currentvalue: {
                  prefix: 'X = ',
                  xanchor: 'right'
                },
                pad: {l: 130, t: 30},
                transition: {
                  duration: 0,
                },
                steps: Array.from(pyodide.globals[self.xArray]).map(function(t, i) {
                  return {
                    label: t,
                    method: 'animate',
                    args: [[i], {
                      frame: {duration: 0, redraw: false},
                      mode: 'immediate',
                    }]
                  }
                })
              }]
            },
            frames: Array.from(pyodide.globals[self.xArray]).map(function(t, i) {
              return {
              name: i,
              data: [{y: pyodide.globals[self.yArray].slice(0, i+1)}]
              }
            }),
            config: { responsive: true }
          })

      });
    }
  },
  mounted: function(){
    var inst = this;
    var old = console.log;
    var logger = document.getElementById('log');
    window.console.log = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
        } else {
            logger.innerHTML += arguments[i] + '<br />';
        }
      }
    }
    languagePluginLoader.then(function (){
      inst.pyodideLoaded = true;
      pyodide.loadPackage(['numpy']);
    });
    self.myCodeMirror = CodeMirror(document.getElementById("codeEditor"), {
      value: '#Put Python code here! :)',
      lineNumbers: true,
      indentWithTabs: true
    });
    self.myCodeMirror.on("change", function(instance, changeObj){
      inst.code = instance.getValue();
    });
  }
}

const router = new VueRouter({
  routes: [
    {path: '/play', component: Play},
    {path: '/snippet', component: Snippet},
    {path: '/login', component: Login},
    {path: '/register', component: Register}
  ]
})

const app = new Vue({
  router,
  data: {
    loginState: {
      loggedIn: false,
      authToken: '',
      userName: ''
    }
  },
  methods: {
    logoutUser: function(e) {
      e.preventDefault();

      this.loginState = {
        loggedIn: false,
        authToken: '',
        userName: ''
      };

      this.$router.push('/');
    }
  },
  mounted() {
    if (localStorage.loginState) {
      console.log("state loaded!");
      this.loginState = JSON.parse(localStorage.loginState);
    }
  },
  watch: {
    loginState(newState) {
      console.log(this.loginState);
      localStorage.loginState = JSON.stringify(this.loginState);
    }
  }
}).$mount('#app')
