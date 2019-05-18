import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";


const styles = (theme) => ({
    titleBox: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        }
    },
    title: {
        ...theme.typography.h6,
        lineHeight: 1.2,
        color: "#fff"
    },
    subtitle: {
        ...theme.typography.h6,
        fontSize: 10,
        lineHeight: 1,
        color: "#fff"
    }
});

class Header extends React.Component {

    render() {
        const {classes, wsConnected} = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <div className={classes.titleBox}>
                            <Typography className={classes.title} component="h1">
                                airviz
                            </Typography>
                            <Typography className={classes.subtitle} component="h2">
                                View Eth 2.0 testnet data
                            </Typography>
                        </div>
                        <div>
                            {wsConnected ? "connected" : "no connection"}
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

const ConnectedHeader = connect(state => ({
    wsConnected: state.graph.ws.status === 'open'
}))(Header);

const StyledHeader = withStyles(styles)(ConnectedHeader);

export default withRouter(StyledHeader)