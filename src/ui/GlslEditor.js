/**
 * This file is taken from https://GLSL.io/
 * https://github.com/glslio/glsl.io/blob/master/client/src/screens/editor/GlslEditor/index.js
 */

/** @jsx React.DOM */
var React = require("react");
var _ = require("lodash");
var ace = window.ace;
ace.require("ace/ext/language_tools");

var GlslEditor = React.createClass({
  propTypes: {
    initialGlsl: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    onCursorTokenChange: React.PropTypes.func,
    onSave: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  },
  getDefaultProps: function () {
    return {
      onChange: _.noop,
      onSave: _.noop,
      onCursorTokenChange: _.noop
    };
  },
  getInitialState: function () {
    return { glsl: this.props.initialGlsl };
  },
  getSession: function () {
    return this.session;
  },
  render: function () {
    var width = this.props.width ? this.props.width+"px" : "100%";
    var height = this.props.height ? this.props.height+"px" : "100%";
    return <div className="glsl-editor" style={{ width: width, height: height }}></div>;
  },
  componentDidMount: function () {
    this._lastWidth = this.props.width;
    this._lastHeight = this.props.height;
    var node = this.getDOMNode();
    var editor = ace.edit(node);
    editor.setOptions({
      enableBasicAutocompletion: true
    });
    editor.commands.addCommand({
      name: 'save',
      bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
      exec: _.bind(function () {
        this.props.onSave();
      }, this),
      readOnly: true
    });
    editor.setFontSize("14px");
    editor.setShowPrintMargin(false);
    var session = editor.getSession();
    session.setTabSize(2);
    session.setMode("ace/mode/glsl");
    session.setUseWrapMode(true);
    editor.focus();
    this.session = session;
    this.editor = editor;
    session.setValue(this._lastGlsl = this.state.glsl);
    session.on("change", _.bind(function () {
      var glsl = session.getValue();
      this.setState({ glsl: this._lastGlsl = glsl });
      this.props.onChange(this.state.glsl);
    }, this));
    this._lastToken = null;
    var onCursorTokenChange = _.bind(function (e, selection) {
      var p = selection.getRange().end;
      var token = session.getTokenAt(p.row, p.column);
      if (!_.isEqual(this._lastToken, token)) {
        this._lastToken = token;
        this.props.onCursorTokenChange(token);
      }
    }, this);
    session.selection.on("changeSelection", onCursorTokenChange);
    session.selection.on("changeCursor", onCursorTokenChange);
  },
  componentDidUpdate: function () {
    var glslChanged = this._lastGlsl !== this.state.glsl;
    var resized = this._lastWidth !== this.props.width || this._lastHeight !== this.props.height;
    if (resized) {
      this.editor.resize();
    }
    if (glslChanged) {
      this.session.setValue(this.state.glsl);
    }
  },
  componentWillUnmount: function () {
    this.editor.destroy();
    delete this.editor;
    delete this.session;
  }
});

module.exports = GlslEditor;
