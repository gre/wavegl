/** @jsx React.DOM */

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


var React = require("react");

var BufferViz = React.createClass({
  propTypes: {
    data: React.PropTypes.instanceOf(Uint8Array),
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    scale: React.PropTypes.number
  },
  getDefaultProps: function () {
    return {
      scale: 1
    };
  },
  render: function () {
    var scale = this.props.scale;
    var width = this.props.width;
    var height = this.props.height;
    return <canvas className="buffer-viz" ref="canvas" width={this.props.width} height={this.props.height} style={{ width: Math.floor(width*scale)+"px", height: Math.floor(height*scale)+"px" }}></canvas>;
  },
  componentDidMount: function () {
    this.drawCanvas();
  },
  componentDidUpdate: function () {
    this.drawCanvas();
  },
  drawCanvas: function () {
    var data = this.props.data;
    var width = this.props.width;
    var height = this.props.height;
    if (data) {
      var canvas = this.refs.canvas.getDOMNode();
      var ctx = canvas.getContext("2d");
      var imgdata = ctx.createImageData(width, height);
      imgdata.data.set(data);
      ctx.putImageData(imgdata, 0, 0);
    }
    /*
    if (buffer) {
      var canvas = this.refs.canvas.getDOMNode();
      var ctx = canvas.getContext("2d");
      var border = 0;
      var fill = 7;
      var pH = border + fill;
      var pW = border + fill;
      var fH = canvas.height;
      var fW = canvas.width;
      var data = ctx.createImageData(fW, fH);
      var outBuffer = data.data;

      function mult(e, n) {
        var buffer = new Uint8Array(n);
        for (var i = 0; i < n; i ++) {
          buffer[i] = e;
        }
        return buffer;
      }

      function multb(b, n) {
        var buffer = new Uint8Array(b.length * n);
        for (var i = 0; i < n; i++) {
          buffer.set(b, i * b.length);
        }
        return buffer;
      }

      function drawX(pixel) {
        var buffer = new Uint8Array(pW * 4);

        buffer.set(multb(mult(255, 4), border), 0);
        buffer.set(multb(pixel, fill), border * 4);

        return buffer;
      }

      for (var y = 0; y < height; y++) {
        var line = new Uint8Array(pW * 4 * width);
        var startY = ( 4 * y * width )
        for (var x = 0; x < width; x++) {
          var startX = startY + ( 4 * x ),
              pixel = buffer.subarray(startX, startX + 4);
          line.set(drawX(pixel), x * pW * 4);
        }
        outBuffer.set(multb(mult(255, 4), fW * border), 4 * y * pH * fW);
        outBuffer.set(multb(line, fill), 4 * (y * pH + border) * fW);

        ctx.putImageData(data, 0, 0);
      }
    }
    */
  }
});

module.exports = BufferViz;
