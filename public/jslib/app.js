self.myCodeMirror = {}

window.onload = function(){
    var console = {}
    var logger = document.getElementById('log');
    console.log = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
            logger.scrollTop = logger.scrollHeight;
        } else {
            logger.innerHTML += arguments[i] + '<br />';

        }
      }
    }
    window.console = console;
}

var app = new Vue({
  el: '#app',
  data: {
    code: '# Python code goes here :)',
    codeWindow: self.myCodeMirror,
    pyodideLoaded: false,
    consoleOutput: '',
    plotType: "lines+markers"
  },
  methods: {
    runCode: function(){
      if (!this.pyodideLoaded) return;
      pyodide.runPythonAsync(this.code).then(function(val){
          Plotly.newPlot('plotly', {
            data: [{
              x: pyodide.globals.X,
              y: pyodide.globals.Y,
              mode: app.plotType,
              transforms: [{
                type: 'filter',
                operation: '<=',
                target: pyodide.globals.X,
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
                steps: Array.from(pyodide.globals.X).map((t,i) => ({
                  label: t,
                  method: 'animate',
                  args: [[i], {
                    frame: {duration: 0, redraw: false},
                    mode: 'immediate',
                  }]
                }))
              }]
            },
            frames: Array.from(pyodide.globals.X).map((t, i) => ({
              name: i,
              data: [{y: pyodide.globals.Y.slice(0, i)}]
            })),
            config: { responsive: true }
          })

      });
    }
  },
  mounted: function(){
    languagePluginLoader.then(function (){
      app.pyodideLoaded = true;
    });
    self.myCodeMirror = CodeMirror(document.getElementById("codeEditor"), {
      value: '#Put Python code here! :)',
      lineNumbers: true,
      indentWithTabs: true
    });
  },
  updated: function(){
      self.myCodeMirror.on("change", function(instance, changeObj){
        app.code = instance.getValue();
      });
  }
})

/*
languagePluginLoader.then(() => {
  // pyodide is now ready to use...
  console.log(pyodide.runPython('import sys\nsys.version'));
  console.log(testpy);
  pyodide.loadPackage(['matplotlib']).then(() => {
    //console.log(pyodide.runPython("from matplotlib import pyplot as plt; import numpy as np; x = np.linspace(1,10,10); y = np.square(np.linspace(1,10,10)); plt.figure(); plt.plot(x,y); plt.show();"));
    console.log(pyodide.runPython(testpy));
    console.log(pyodide.globals.X, pyodide.globals.Y, pyodide.globals.plt.show());
    Plotly.plot(document.getElementById('plotly'), [{
      x: pyodide.globals.X,
      y: pyodide.globals.Y}], {
      margin: { t: 0 } } );
  });
});
*/
