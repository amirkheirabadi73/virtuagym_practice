import React, { Component } from 'react'
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'
import Layout from '../Layout'
import PlanExercise from './PlanExercise'
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc'
import ReactModal from 'react-modal'

export default class PlanForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      exercises: [],
      showDayForm: false,
      showModal: false,

      plan: {
        plan_name: '',
        plan_description: '',
        plan_difficulty: '',
        days: []
      },

      exerciseData: [],
      exerciseAction: '',
      exerciseEditId: 0,
      dayName: '',

      dayAction: '',
      dayActionId: 0
    }
  }

  componentDidMount () {
    if (this.props.match.params.id) {
    } else {
      fetch('/plans/create')
        .then(res => res.json())
        .then(data => {
          this.setState({
            exercises: data.exercises
          })
        })
    }
  }

  findExerciseName (id) {
    let name = ''
    for (const ex of this.state.exercises) {
      if (ex.id == id) {
        name = ex.exercise_name
      }
    }

    return name
  }

  onSortEndExercise ({ oldIndex, newIndex }) {
    this.setState({
      exerciseData: arrayMove(this.state.exerciseData, oldIndex, newIndex)
    })
  }

  onSortEndDays ({ oldIndex, newIndex }) {
    this.setState(prevState => ({
      plan: {
        ...prevState.plan,
        days: arrayMove(this.state.plan.days, oldIndex, newIndex)
      }
    }))
  }

  storeExercise (data) {
    let exerciseData = this.state.exerciseData

    if (this.state.exerciseAction == 'edit') {
      exerciseData[this.state.exerciseEditId] = {
        exercis: data.selectedExercise,
        duration: data.duration
      }
    } else {
      exerciseData.push({
        exercis: data.selectedExercise,
        duration: data.duration
      })
    }

    this.setState({
      exerciseData: exerciseData,
      showModal: false
    })
  }

  newExercise () {
    this.setState({
      duration: 0,
      selectedExercise: 0,
      exerciseAction: 'create',
      showModal: true
    })
  }

  exercisEdit (index) {
    let ex = this.state.exerciseData[index]
    this.setState({
      duration: ex.duration,
      selectedExercise: ex.exercis,
      showModal: true,
      exerciseAction: 'edit',
      exerciseEditId: index
    })
  }

  exercisDelete (index) {
    let ex = this.state.exerciseData
    ex.splice(index, 1)
    this.setState({
      exerciseData: ex
    })
  }

  storeDay () {
    let days = this.state.plan.days
    days.push({
      name: this.state.dayName,
      exercises: this.state.exerciseData
    })
    this.setState(prevState => ({
      plan: {
        ...prevState.plan,
        days: days
      },
      dayName: '',
      exerciseData: [],
      exerciseAction: '',
      exerciseEditId: 0,
      showDayForm: false,
      showModal: false
    }))
  }

  dayEdit (index) {
    console.log('click')
    let day = this.state.plan.days[index]

    this.setState(prevState => ({
      dayName: day.name,
      exerciseData: day.exercises,
      exerciseAction: '',
      exerciseEditId: 0,
      showDayForm: true,
      showModal: false
    }))
  }

  dayDelete (index) {
    let days = this.state.plan.days
    days.splice(index, 1)
    this.setState(prevState => ({
      plan: {
        ...prevState.plan,
        days: days
      }
    }))
  }

  render () {
    const SortableItem = SortableElement(({ value, id }) => <li><div className='alert alert-primary' >{value}
      <Button
        bsStyle='primary'
        onClick={this.dayEdit.bind(this, id)}
      >
        <span className='fa fa-edit' ></span>
      </Button>

      <Button
        bsStyle='danger'
        onClick={this.dayDelete.bind(this, id)}
        >
        <span className='fa fa-trash'></span>
      </Button></div></li>)

    const SortableItemExercise = SortableElement(({ value, id }) => <li><div className='alert alert-primary' >{value}
      <Button
        bsStyle='primary'
        onClick={this.exercisEdit.bind(this, id)}
        >
        <i className='fa fa-edit' />
      </Button>

      <Button
        bsStyle='danger'
        onClick={this.exercisDelete.bind(this, id)}
        >
        <i className='fa fa-trash' />
      </Button>
    </div></li>)

    const SortableListExercise = SortableContainer(({ exercise }) => {
      return (
        <ul className='sortableList'>
          {exercise.map((value, index) => (
            <SortableItemExercise key={`exercise-${index}`} index={index} value={this.findExerciseName(value.exercis) + ' - ' + value.duration} id={index} />
      ))}
        </ul>
      )
    })

    const SortableListDay = SortableContainer(({ exercise }) => {
      return (
        <ul className='sortableList'>
          {exercise.map((value, index) => (
            <SortableItem key={`day-${index}`} index={index} value={value.name} id={index} />
      ))}
        </ul>
      )
    })

    return (
      <Layout>
        <div className='card'>
          <div className='card-header'>Plan Management</div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-4'>
                <FormGroup>
                  <ControlLabel>Plan Name</ControlLabel>
                  <FormControl
                    value={this.state.plan.plan_nam}
                    onChange={event => {
                      this.setState(prevState => ({
                        plan: {
                          ...prevState.plan,
                          plan_name: event.target.value
                        }
                      }))
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Plan Description</ControlLabel>
                  <FormControl
                    componentClass='textarea'
                    value={this.state.plan.plan_description}
                    onChange={event => {
                      this.setState(prevState => ({
                        plan: {
                          ...prevState.plan,
                          plan_description: event.target.value
                        }
                      }))
                    }}
                  />
                </FormGroup>

                <FormGroup controlId='formControlsSelect'>
                  <ControlLabel>Plan Difficulty</ControlLabel>
                  <FormControl
                    componentClass='select'
                    placeholder='select'
                    value={this.state.plan.plan_difficulty}
                    onChange={event => {
                      this.setState(prevState => ({
                        plan: {
                          ...prevState.plan,
                          plan_difficulty: event.target.value
                        }
                      }))
                    }}
                  >
                    <option value='1'>Easy</option>
                    <option value='2'>Normal</option>
                    <option value='3'>Hard</option>
                  </FormControl>
                </FormGroup>
              </div>

              <div className='col-md-4'>
                <Button
                  bsStyle='primary'
                  onClick={() => {
                    this.setState({
                      showDayForm: true
                    })
                  }}
                >
                  Add Day
                </Button>

                <SortableListDay
                  exercise={this.state.plan.days}
                  onSortEnd={this.onSortEndDays.bind(this)}
                />
              </div>

              {this.state.showDayForm && (
                <div className='col-md-4'>
                  <FormGroup>
                    <ControlLabel>Day Name</ControlLabel>
                    <FormControl
                      value={this.state.dayName}
                      onChange={event => {
                        this.setState({
                          dayName: event.target.value
                        })
                      }}
                  />
                  </FormGroup>

                  <Button
                    bsStyle='primary'
                    onClick={this.newExercise.bind(this)}
                >
                  Add Exercise
                </Button>

                  <Button
                    bsStyle='success'
                    onClick={this.storeDay.bind(this)}
                >
                  Save Day
                </Button>

                  <SortableListExercise
                    exercise={this.state.exerciseData}
                    onSortEnd={this.onSortEndExercise.bind(this)}
                  />
                </div>
              )}
            </div>
            <Button
              bsStyle='success'
              onClick={() => {
                // this.props.submit(this.state)
              }}
            >
              Create
            </Button>
          </div>
        </div>

        <ReactModal
          isOpen={this.state.showModal}
          ariaHideApp={false}
          shouldCloseOnEsc
          shouldCloseOnOverlayClick
          onRequestClose={() => {
            this.setState({
              showModal: false
            })
          }}
          contentLabel='Exercises Management'
        >

          <PlanExercise info={{
            exercises: this.state.exercises,
            duration: this.state.duration,
            selectedExercise: this.state.selectedExercise
          }} storeExercise={this.storeExercise.bind(this)} />
        </ReactModal>
      </Layout>
    )
  }
}