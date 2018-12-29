import React, { Component } from 'react'
import {FIREBASE_CONFIG} from './firebase/config'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'typeface-roboto'
import {  List,ListItem,
          ListItemText,
          Typography,
          TextField,
          Paper,
          ListItemSecondaryAction,
          Button,
          IconButton,
          withStyles
} from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import firebaseui from 'firebaseui'

firebase.initializeApp(FIREBASE_CONFIG);
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);
const db = firebase.firestore();

//style override
const StyledButton = withStyles({
  root: {
    verticalAlign: 'bottom',
  },
})(Button);

const styles = {
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 400
  },
  form: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-evenly'
  }
}

export default withStyles(styles)(
  class App extends Component {

    state = {
      exercises: [
        //配列の中身の例 idはString型の日付　titleはメモデータ
        // { id: 1123141412, title: 'Bench Press' },
        // { id: 2534253532, title: 'Deadlift' },
        // { id: 3352414233, title: 'Squats' }
        // { id: , title: }
      ],
      title: ''
    }

    //コンポーネントのマウント時に一回だけ実行される
    UNSAFE_componentWillMount() {
      db.collection("memos").get().then((querySnapshot) => {
        querySnapshot.forEach((docs) => {
          console.log(`${docs.id} => memo:${docs.data().memo}`);
          this.setState(({ exercises }) => ({
            exercises: [
            ...exercises,
              { id: docs.id, title: docs.data().memo},
            ]
          }))
        })
      })
    }

    //よくわかってない
    handleChange = ({ target: { name, value } }) =>
      this.setState({
        [name]: value
      })

    //データを追加するハンドル
    handleCreate = e => {
      //メモデータを配列に追加
      const StringGetDateNow = String(Date.now())
      e.preventDefault()
      if (this.state.title) {
        this.setState(({ exercises, title }) => ({
          exercises: [
            ...exercises,
            {
              title,
              id: StringGetDateNow
            }
          ],
          title: ''
        }))

        //DBにメモデータを追加
        db.collection("memos").doc(StringGetDateNow).set({
        memo: this.state.title
        })
      }
    }

    //データを削除するハンドル
    handleDelete = id => {
      //配列からメモデータを削除
      this.setState(({ exercises }) => ({
        exercises: exercises.filter(ex => ex.id !== id)
    }))
      //DBからメモデータを削除
      db.collection('memos').doc(id).delete()
    }

    render() {
      const { title, exercises } = this.state
      const { classes } = this.props
      return <Paper className={classes.root}>
        <Typography variant='h4' align='center' gutterBottom>
          Memos
        </Typography>
        <form onSubmit={this.handleCreate}>
          <TextField
            name='title'
            label='new memo'
            value={title}
            onChange={this.handleChange}
            margin='normal'
          />
          <StyledButton type="submit" color="primary" variant="contained">
            Create
          </StyledButton>
        </form>
        <List>
          {exercises.map(({ id, title }) =>
            <ListItem key={id}>
              <ListItemText primary={title} />
              <ListItemSecondaryAction>
                <IconButton color='primary' onClick={() => this.handleDelete(id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )}
        </List>
      </Paper>
    }
  }
)
