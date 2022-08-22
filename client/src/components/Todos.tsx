import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[],
  doneTodos: Todo[],
  pendingTodos: Todo[],
  loadingTodos: boolean,
  title: string,
  description: string,
  gotNewData: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    doneTodos: [],
    pendingTodos: [],
    title: '',
    description: '',
    loadingTodos: true,
    gotNewData: true
  }

  handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('event.target.value', event.target.value )
    this.setState({ title: event.target.value })
  }
  
  handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('event.target.value2', event.target.value )
    this.setState({ description: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async () => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        title: this.state.title,
        description: this.state.description,
        dueDate
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
        gotNewData: true
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId !== todoId)
      })
      this.setState({
        gotNewData: true
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (todoId: any) => {
    try {
      const todo = this.state.todos.filter(todo => todo.todoId == todoId)[0];
      await patchTodo(this.props.auth.getIdToken(), todoId, {
        title: todo.title,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      await getTodos(this.props.auth.getIdToken())
      this.setState({
        gotNewData: true,
        loadingTodos: true
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      const doneTodos = todos.filter(todo => todo.done == true)
      const pendingTodos = todos.filter(todo => todo.done == false)
      this.setState({
        todos,
        doneTodos,
        pendingTodos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }

  async componentWillUpdate(prevProps: any, prevState: any) {
    if (prevState.gotNewData) {
      const todos = await getTodos(this.props.auth.getIdToken())
      const doneTodos = todos.filter(todo => todo.done == true)
      const pendingTodos = todos.filter(todo => todo.done == false)
      this.setState({
        todos,
        doneTodos,
        pendingTodos,
        gotNewData: false,
        loadingTodos: false
      })
    }
  }

  render() {
    
    const pendingTodos = this.state.pendingTodos.length > 0;
    const doneTodos = this.state.doneTodos.length > 0;
    return (
      <div>
        <Header as="h1">Task Manager</Header>

        {this.renderCreateTodoInput()}

        {pendingTodos && this.renderTodos()}
        
        {doneTodos && this.renderDoneTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              content: 'Title'
            }}
            fluid
            actionPosition="left"
            placeholder="Title..."
            onChange={this.handleTitle}
          />
          <Input
            action={{
              content: 'Description'
            }}
            fluid
            actionPosition="left"
            placeholder="Description..."
            onChange={this.handleDescription}
          />
          <Button
            positive
            fluid
            action={{
              icon: 'add',
              content: 'Description',
            }}
            onClick={this.onTodoCreate}
          >
              Add Task
          </Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderDoneTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderDoneTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
      <h1> {this.state.pendingTodos.length} Pending</h1>
        {this.state.pendingTodos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.todoId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() =>  this.onTodoCheck(todo.todoId)}
                  checked={todo.done}
                />
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={2} floated="right">
                {todo.title}
              </Grid.Column>
              <Grid.Column width={4} floated="right">
                {todo.description}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  renderDoneTodosList() {
    return (
      <Grid padded>
        <h1>{this.state.doneTodos.length} Done</h1>
        {this.state.doneTodos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.todoId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() =>  this.onTodoCheck(todo.todoId)}
                  checked={todo.done}
                />
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={2} floated="right">
                {todo.title}
              </Grid.Column>
              <Grid.Column width={4} floated="right">
                {todo.description}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
