/*
 * This file is part of wavegl: https://github.com/gre/wavegl
 *
 * Copyright 2014 Zengularity
 *
 * wavegl is free software: you can redistribute it and/or modify
 * it under the terms of the AFFERO GNU General Public License as published by
 * the Free Software Foundation.
 *
 * wavegl is distributed "AS-IS" AND WITHOUT ANY WARRANTY OF ANY KIND,
 * INCLUDING ANY IMPLIED WARRANTY OF MERCHANTABILITY,
 * NON-INFRINGEMENT, OR FITNESS FOR A PARTICULAR PURPOSE. See
 * the AFFERO GNU General Public License for the complete license terms.
 *
 * You should have received a copy of the AFFERO GNU General Public License
 * along with wavegl.  If not, see <http://www.gnu.org/licenses/agpl-3.0.html>
 */


/** @jsx React.DOM */
var React = require("react");

var SoundViz = React.createClass({
  propTypes: {
    buffer: React.PropTypes.instanceOf(Uint8Array),
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },
  render: function () {
    var width = this.props.width;
    var height = this.props.height;
    return <div className="sound-viz">
      <canvas ref="canvas" width={width} height={height}></canvas>
    </div>;
  },
  componentDidMount: function () {
    this.drawCanvas();
  },
  componentDidUpdate: function () {
    this.drawCanvas();
  },
  drawCanvas: function () {
    var buffer = this.props.buffer;
    if (buffer) {
      var canvas = this.refs.canvas.getDOMNode();
      var ctx = canvas.getContext("2d");
      var data = ctx.createImageData(canvas.width, canvas.height);
      data.data.set(buffer);
      ctx.putImageData(data, 0, 0);
    }
  }
});

module.exports = SoundViz;
