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
var BufferViz = require("./BufferViz");
var _ = require("lodash");

var SoundViz = React.createClass({
  propTypes: {
    buffers: React.PropTypes.array,
    bufferWidth: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    currentTime: React.PropTypes.number
  },
  render: function () {
    var bufferWidth = this.props.bufferWidth;
    var width = this.props.width;
    var scale = width / bufferWidth;
    var height = this.props.height;
    var currentTime = this.props.currentTime;
    var timeWindow = width * height;
    var all = this.props.buffers.map(function (buffer) {
      return <div className="sound-viz-buffer" key={buffer.bufferTime} style={{ top: Math.floor(scale * (buffer.bufferTime-currentTime)/(bufferWidth*4))+"px" }}>
        {BufferViz(_.extend({ scale: scale }, buffer))}
      </div>;
    }, this);
    return <div className="sound-viz" style={{ width: Math.floor(width)+"px", height: Math.floor(height)+"px" }}>
      {all}
    </div>;
  }
});

module.exports = SoundViz;

