/** @jsx React.DOM */
var React = require("react");

var StatusMessage = React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf([ "success", "error", "warning", "info", "unknown" ])
  },
  render: function () {
    return <div ref="status" className={"status-message "+this.props.type}>{this.props.children}</div>;
  },
  componentDidUpdate: function () {
  }
});

module.exports = StatusMessage;
