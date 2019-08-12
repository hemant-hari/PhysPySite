const Login = {
  template: `
  <div class="w3-container w3-row w3-padding-large">
    <div class="w3-container w3-third"></div>
    <div class="w3-card-4 w3-third">
      <div class="w3-container w3-theme-l1">
        <h2>Login</h2>
      </div>

      <form class="w3-container">
        <div class="w3-row w3-section">
          <input class="w3-input w3-border w3-padding" name="email" type="email" placeholder="E-mail">
        </div>

        <div class="w3-section">
          <input class="w3-input w3-border w3-padding" name="password" type="password" placeholder="Password">
        </div>

        <p>
        <button class="w3-button w3-red w3-hover-orange w3-padding">Login</button></p>
      </form>
    </div>
  </div>`
};

const Register = {
  template: `
  <div class="w3-container w3-row w3-padding-large">
    <div class="w3-container w3-third"></div>
    <div class="w3-card w3-third">
      <div class="w3-container w3-theme-l1">
        <h2>Register an account!</h2>
      </div>

      <form class="w3-container w3-row">
        <div class="w3-row w3-section">
          <input class="w3-input w3-border w3-half w3-padding" name="first" type="text" placeholder="First Name">
          <input class="w3-input w3-border w3-half w3-padding" name="last" type="text" placeholder="Last Name">
        </div>

        <div class="w3-row w3-section">
          <input class="w3-input w3-border w3-padding" name="email" type="email" placeholder="E-mail">
        </div>

        <div class="w3-section">
          <input class="w3-input w3-border w3-padding" name="password" type="password" placeholder="Password">
        </div>

        <div class="w3-section">
          <input class="w3-input w3-border w3-padding" name="confirm" type="password" placeholder="Confirm Password">
        </div>

        <p>
        <button class="w3-button w3-red w3-hover-orange w3-padding">Register</button></p>
      </form>
    </div>
  </div>`
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
    {path: '/login', component: Login},
    {path: '/register', component: Register}
  ]
})

const app = new Vue({
  router,
  data: {
    loginState: {
      loggedIn: false,
      userName: ''
    }
  },
  mounted() {
    if (localStorage.loginState) {
      this.loginState = localStorage.loginState;
    }
  },
  watch: {
    loginState(newState) {
      localStorage.loginState = this.loginState;
    }
  }
}).$mount('#app')
