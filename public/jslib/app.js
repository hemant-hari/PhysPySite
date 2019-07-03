self.myCodeMirror = {}

window.onload = function(){
    var old = console.log;
    var logger = document.getElementById('log');
    /*console.log = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
        } else {
            logger.innerHTML += arguments[i] + '<br />';
        }
      }
    }*/
}

var app = new Vue({
  el: '#app',
  data: {
    code: '# Python code goes here :)',
    codeWindow: self.myCodeMirror,
    pyodideLoaded: false,
    consoleOutput: ''
  },
  methods: {
    runCode: function(){
      if (!this.pyodideLoaded) return;
      pyodide.runPythonAsync(this.code).then(function(val){
        console.log(val);
        Plotly.plot(document.getElementById('plotly'), [{
          x: pyodide.globals.X,
          y: pyodide.globals.Y}], {
          margin: { t: 0 } } );
      });
    }
  },
  mounted: function(){
    languagePluginLoader.then(function (){
      app.pyodideLoaded = true;
      console.log('wahey');
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
