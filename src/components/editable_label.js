import React from 'react'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

import 'components/editable_label/editable_label.css'

library.add(faEdit)

class EditableLabel extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      editLabelMode: false
    }

    this.setEditLabelModeTrue = this.setEditLabelModeTrue.bind(this)
    this.setEditLabelModeFalse = this.setEditLabelModeFalse.bind(this)
    this.saveNewLabel = this.saveNewLabel.bind(this)
  }

  setEditLabelModeTrue() {
    this.setState({
      editLabelMode: true
    })
  }

  setEditLabelModeFalse() {
    this.setState({
      editLabelMode: false
    })
  }

  saveNewLabel(e) {
    if (e.keyCode === 13) {
      console.log('saveNewLabel()')
      this.props.saveNewLabel(e.target.value, this.props.identifier)
      this.setEditLabelModeFalse()
    }
  }

  render() {
    if (this.state.editLabelMode === false) {
      return (
        <div className="EditableLabel name" onClick={this.setEditLabelModeTrue}>
          Label: {this.props.label}
          <FontAwesomeIcon icon="edit" />
        </div>
      )
    } else {
      return (
        <div className="EditableLabel">
          <span>Label: </span>
          <input type="text" ref={this.props.identifier} onKeyDown={this.saveNewLabel}></input>
        </div>
      )
    }
  }
}

export default EditableLabel
