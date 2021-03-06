/*
Copyright 2017 Bitnami.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// @flow
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import type { Func } from 'utils/Types'
import RuntimeHelper from 'utils/RuntimeHelper'
import './FuncParams.scss'

const initialState = {
  name: '',
  handler: '',
  runtime: RuntimeHelper.defaultRuntime().value,
  type: 'HTTP'
}
export default class FuncParams extends Component {

  props: {
    func?: Func,
  }

  state = initialState

  componentWillMount() {
    const { func } = this.props
    if (func) {
      this.setState({
        name: func.metadata.name,
        handler: func.spec.handler,
        runtime: func.spec.runtime,
        type: func.spec.type
      })
    } else {
      this.setState(initialState)
    }
  }

  getParams(): {[string]: string} {
    return this.state
  }

  render() {
    const runtimes = RuntimeHelper.getAllRuntimes().map(r => {
      return <MenuItem key={r.value} value={r.value} primaryText={r.label} />
    })
    const types = [
      <MenuItem key={1} value='HTTP' primaryText='HTTP' />,
      <MenuItem key={2} value='PubSub' primaryText='PubSub' />
    ]
    return (
      <div className='funcParams'>
        <div className='inputGroup'>
          <TextField
            floatingLabelText='Function name'
            floatingLabelFixed
            hintText='hello'
            disabled={!!this.props.func}
            value={this.state.name}
            onChange={(e, value) => this.setState({ name: value })}
          /><br />
          <TextField
            floatingLabelText='Handler'
            floatingLabelFixed
            hintText='hello.word'
            value={this.state.handler}
            onChange={(e, value) => this.setState({ handler: value })}
          />
        </div>
        <div className='inputGroup'>
          <SelectField
            floatingLabelText='Type'
            value={this.state.type}
            onChange={(e, i, value) => this.setState({ type: value })}
          >
            {types}
          </SelectField><br />
          <SelectField
            floatingLabelText='Runtime'
            value={this.state.runtime}
            onChange={(e, i, value) => this.setState({ runtime: value })}
          >
            {runtimes}
          </SelectField><br />
        </div>
      </div>
    )
  }

}
