import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createMuiTheme } from '@material-ui/core'
//import { green } from '@material-ui/core/colors'
import { MuiThemeProvider } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#6fbf73', // same as '#FFCC80'
      main: '#4caf50', // same as orange[600]
      dark: '#357a38',
      contrastText: 'rgb(0,0,0)'
    }
  },
  typography: {
    useNextVariants: true,
  }
})

class ThemeChanger extends Component {
  render(){
    return(
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<ThemeChanger/>, document.getElementById('root'));