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
var _ = require("lodash");
var SoundEditor = require("./SoundEditor");
var SoundViz = require("./SoundViz");
var examples = require("../examples");

var UI = React.createClass({
  render: function () {
    var sounds = _.map(examples, function (glsl, name) {
      return <a key={name} href={"?example="+name}>{name}</a>;
    }, this);
    return <div>
      <SoundViz buffer={this.props.buffer} width={this.props.bufferWidth} height={this.props.bufferHeight} />
      <SoundEditor onChangeSuccess={this.props.onGlslChange} onChangeFailure={this.props.onGlslFailed} initialGlsl={this.props.initialGlsl} width={600} height={400} />
      <nav>
        {sounds}
      </nav>
    </div>;
  }
});

module.exports = UI;
