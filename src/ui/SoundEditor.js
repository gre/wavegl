/** @jsx React.DOM */

/**
 * Heavy inspired from GLSL.io code
 */

var React = require("react");
var GlslEditor = require("./GlslEditor");
var StatusMessage = require("./StatusMessage");
var createWebGLCanvas = require("../createWebGLCanvas");
var createGenerator = require("../createGenerator");
var glslAudioWrapper = require("../glslAudioWrapper");

var webglCanvas = createWebGLCanvas(100, 100);

var HEADER_LINES = 5;

function validate (source) {
  var details, error, i, lineStr, line, lines, log, message, status, _i, _len;
  if (!source) {
    return { compiles: false, message: "source code is "+source };
  }
  try {
    var context = webglCanvas.gl;
    var shader = context.createShader(context.FRAGMENT_SHADER);
    context.shaderSource(shader, glslAudioWrapper(source));
    context.compileShader(shader);
    status = context.getShaderParameter(shader, context.COMPILE_STATUS);
    if (!status) {
      log = context.getShaderInfoLog(shader);
    }
    context.deleteShader(shader);
  } catch (e) {
    return { compiles: false, line: 0, message: e.getMessage };
  }
  if (status === true) {
    try {
      var generate = createGenerator(webglCanvas, 44100, source);
      generate.destroy();
    }
    catch (e) {
      // Parse a glsl-parser error
      var msg = ''+(e.message || e);
      var r = msg.split(' at line ');
      if (r.length === 2) {
        var line = parseInt(r[1], 10);
        return { compiles: false, line: line, message: r[0] };
      }
      else return { compiles: false, line: 0, message: msg };
    }
    return { compiles: true };
  } else {
    lines = log.split('\n');
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      i = lines[_i];
      if (i.substr(0, 5) === 'ERROR') {
        error = i;
      }
    }
    if (!error) {
      return { compiles: false, line: 0, message: 'Unknown error.' };
    }
    details = error.split(':');
      if (details.length < 4) {
        return { compiles: false, line: 0, message: error };
      }
      lineStr = details[2];
      line = parseInt(lineStr, 10);
      if (isNaN(line)) line = 0;
      message = details.splice(3).join(':');
      return { compiles: false, line: line-HEADER_LINES, message: message };
    }
}

var SoundEditor = React.createClass({
  propTypes: {
    onChangeSuccess: React.PropTypes.func.isRequired,
    onChangeFailure: React.PropTypes.func.isRequired
  },
  getInitialState: function () {
    return this.compile(this.props.initialGlsl);
  },
  isCompiling: function () {
    return this.state.compilationStatus === "success";
  },
  compile: function (glsl) {
    var compile = validate(glsl);
    var result;
    if (compile.compiles) {
      result = {
        line: null,
        compilationStatus: "success",
        compilationMessage: "Shader successfully compiled"
      };
    }
    else if ('line' in compile) {
      var line = Math.max(0, compile.line - 1);
      var msg = compile.message;
      result = {
        line: line,
        compilationStatus: "error",
        compilationMessage: "Line " + line + " : " + msg
      };
    }
    else {
      result = {
        line: 0,
        compilationStatus: "error",
        compilationMessage: "Shader cannot be empty"
      };
    }
    return result;
  },
  onChange: function (glsl) {
    var result = this.compile(glsl);
    this.setState(result);
    if (result.compilationStatus === "success") {
      this.props.onChangeSuccess(glsl, result);
    }
    else {
      this.props.onChangeFailure(glsl, result);
    }
  },
  componentDidUpdate: function () {
    var line = this.state.compilationStatus === "success" ? null : this.state.line;
    if (this.lastLine !== line) {
      this.lastLine = line;
      var session = this.refs.editor.getSession();
      if (this.marker) {
        session.removeMarker(this.marker.id);
        this.marker = null;
      }
      if (line !== null) {
        this.marker = session.highlightLines(line, line);
      }
    }
  },
  render: function () {
    return <div className="sound-editor" style={{ width: this.props.width+"px", height: this.props.height+"px" }}>
      {this.transferPropsTo(<GlslEditor height={this.props.height-30} ref="editor" onChange={this.onChange} />)}
      <StatusMessage type={this.state.compilationStatus}>{this.state.compilationMessage}</StatusMessage>
    </div>;
  }
});

module.exports = SoundEditor;
