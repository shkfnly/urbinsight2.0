import React, { PropTypes } from 'react'
import { Button, Input, Col, Row, Well } from 'react-bootstrap'
import { mapClickHandlerSwitcher } from 'utils/mapUtils'

type Props = {
  saveValues: PropTypes.func,
  nextStep: PropTypes.func,
  previousStep: PropTypes.func,
  map: PropTypes.object,
  updateValues: PropTypes.func,
  lat: PropTypes.number,
  lon: PropTypes.number,
  formReset: PropTypes.func,
  audits: PropTypes.object
}

class CitizenSurveyLocation extends React.Component {
  props: Props;
  constructor () {
    super()
    this.nextStep = this.nextStep.bind(this)
    this.updateValues = this.updateValues.bind(this)
    this.previousStep = this.previousStep.bind(this)
  }
  previousStep (e) {
    e.preventDefault()
    this.props.formReset()
  }
  nextStep (e) {
    e.preventDefault()
    let data = {
      geoCoordinates: [this.refs.lon.getValue(), this.refs.lat.getValue()]
    }
    this.props.saveValues(data)
    this.props.nextStep()
  }
  updateValues (lat, lon) {
    this.props.updateValues(lat, lon)
  }
  render () {
    const { lat, lon } = this.props
    return (
      <div className='survey-data'>
        <h3>Citizen Survey - Survey Location</h3>
        <Well>
          <h5>
            Begin a Citizen Survey by clicking the map to select a location.
          </h5>
          <h5>
            This could be the location the survey was taken, or the household location of the respondent.
            Additionally, the Latitude and Longitude can be entered directly if known.
          </h5>
        </Well>
        <br />
        <Row>
          <Col md={6}>
            <Input type='text' ref='lat'
              label='Latitude'
              placeholder='Enter Latitude'
              value={lat || ''}/>
          </Col>
          <Col md={6}>
            <Input type='text' ref='lon'
              label='Longitude'
              placeholder='Enter Longitude'
              value={lon || ''}
              />
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          <Col xs={6} sm={6} md={6}>
            <Button bsStyle='info' onClick={this.previousStep} block>
              <span className='glyphicon glyphicon-circle-arrow-left'></span> Start Over
            </Button>
          </Col>
          <Col xs={6} sm={6} md={6} >
            <Button bsStyle='success' onClick={this.nextStep} block>
              Continue <span className='glyphicon glyphicon-circle-arrow-right'></span>
            </Button>
          </Col>
        </Row>
      </div>
    )
  }

  componentDidMount () {
    mapClickHandlerSwitcher(this.props.map, 'surveyLocation', {updateValues: this.updateValues})
  }
  componentWillReceiveProps (np) {
    if (np.activeInput === 'Survey' && np.inputOpened) {
      mapClickHandlerSwitcher(np.map, 'surveyLocation', {updateValues: this.updateValues})
    } else if (!np.inputOpened) {
      if (typeof np.map.getLayer('point') !== 'undefined') np.map.removeLayer('point')
      mapClickHandlerSwitcher(np.map, 'featureSelection', {audits: this.props.audits})
    }
  }
  componentWillUnmount () {
    mapClickHandlerSwitcher(this.props.map, 'featureSelection', {audits: this.props.audits})
  }
}

export default CitizenSurveyLocation
