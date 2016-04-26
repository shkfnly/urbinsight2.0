import React from 'react'
import CitizenSurveyIntro from 'layouts/DataInputLayout/DataInputPanes/Survey/SurveyPanes/citizenSurveyIntro'
import CitizenSurveyLocation from 'layouts/DataInputLayout/DataInputPanes/Survey/SurveyPanes/citizenSurveyLocation'
import CitizenSurveyForm from 'layouts/DataInputLayout/DataInputPanes/Survey/SurveyPanes/citizenSurveyForm'

let fieldValues = {
  lon: null,
  lat: null,
  employment: null,
  healthcare: null,
  family: null,
  stability: null,
  relationships: null,
  recreation: null,
  education: null,
  vacation: null,
  housing: null,
  environment: null,
  discrimination: null,
  religion: null,
  mobility: null,
  movement: null,
  safety: null,
  governance: null
}
class CitizenSurvey extends React.Component {
  props: Props;
  constructor () {
    super()
    this.state = {
      active: 1
    }
    this.nextStep = this.nextStep.bind(this)
    this.previousStep = this.previousStep.bind(this)
    this.formReset = this.formReset.bind(this)
  }

  nextStep () {
    this.setState({
      active: this.state.active + 1
    })
  }

  previousStep () {
    this.setState({
      active: this.state.active - 1
    })
  }

  formReset () {
    let fields = {
      lon: null,
      lat: null,
      employment: null,
      healthcare: null,
      family: null,
      stability: null,
      relationships: null,
      recreation: null,
      education: null,
      vacation: null,
      housing: null,
      environment: null,
      discrimination: null,
      religion: null,
      mobility: null,
      movement: null,
      safety: null,
      governance: null
    }
    fieldValues = Object.assign({}, fieldValues, fields)
    this.setState({
      active: 1
    })
  }

  saveValues (fields) {
    return (function () {
      fieldValues = Object.assign({}, fieldValues, fields)
    })()
  }
  render () {
    switch (this.state.active) {
      case 1:
        return <CitizenSurveyIntro nextStep={this.nextStep}/>
      case 2:
        return <CitizenSurveyLocation previousStep={this.previousStep}
          nextStep={this.nextStep}
          fieldValues={fieldValues}
          saveValues={this.saveValues}
          formReset={this.formReset}/>
      case 3:
        return <CitizenSurveyForm previousStep={this.previousStep}
          fieldValues={fieldValues}
          saveValues={this.saveValues}
          formReset={this.formReset}/>
    }
  }
}

export default CitizenSurvey
