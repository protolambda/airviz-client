import React from "react";
import { connect } from 'react-redux';
import { MuiThemeProvider } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import pageContext from "./pageContext";
import {createTheme} from "./theming";
import {CssBaseline} from "@material-ui/core";
import Inner from "./Inner";
import {withRouter} from "react-router-dom";


class AppInner extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            uiTheme: null,
            theme: pageContext.theme
        }
    }


    static getDerivedStateFromProps(props, state) {
        if (!props.uiTheme) return null;
        if (
            !state.uiTheme || (
                state.uiTheme.paletteType !== props.uiTheme.paletteType ||
                state.uiTheme.direction !== props.uiTheme.direction
            )
        ) {
            const nextTheme = createTheme(props.uiTheme);

            return {
                uiTheme: props.uiTheme,
                theme: nextTheme
            };

        }
        return null;
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (document.body && !!this.state.uiTheme) {
            document.body.dir = this.state.uiTheme.direction;
        }
    }

    render() {
        return (
            <div style={{height: '100%'}}>
                <CssBaseline />
                <MuiThemeProvider theme={this.state.theme}>
                    <Inner />
                </MuiThemeProvider>
            </div>
        );
    }

}

// Hack to separate lifecycles from layered component
const App = (props) => <AppInner {...props}/>;

App.propTypes = {
    uiTheme: PropTypes.object.isRequired
};

const connectedApp = connect(state => ({
    uiTheme: state.theme
}))(App);

export default withRouter(connectedApp);
