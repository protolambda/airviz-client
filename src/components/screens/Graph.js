import React from "react";
import CytoscapeComponent from 'react-cytoscapejs';
import Fab from '@material-ui/core/Fab';
import connect from "react-redux/es/connect/connect";
import {withStyles} from "@material-ui/core";
import Shuffle from 'mdi-material-ui/Shuffle';

const styles = theme => ({
    fallback: {
        padding: 10 * theme.spacing.unit
    },
    fab: {
        margin: theme.spacing.unit,
    },
    graph: {
        width: '100%',
        height: '100%',
        minHeight: 500,
        minWidth: 200,
        position: "absolute",
        zIndex: 20,
        top: 0,
        left: 0
    },
    graphButtons: {
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: 50
    }
});

class Graph extends React.Component {

    constructor(props) {
        super(props);
    }

    makeCyRef = (cy) => {
        this.cy = cy;
        this.layout();
    };

    layout = () => {
        if (this.cy) {
            const layout = this.cy.layout({ name: 'cose' });
            layout.run();
        }
    };

    render() {
        const {classes, blocks} = this.props;

        const cytoData = [];

        return (<div style={{height: '100%', width: '100%'}}>
                <CytoscapeComponent elements={cytoData} stylesheet={[{
                    selector: 'edge',
                    style: {
                        'curve-style': 'bezier',
                        'target-arrow-shape': 'triangle'
                    }
                },]} layout={{name: "cose"}} className={classes.graph} pan={{x: 0, y: 0}} cy={this.makeCyRef}/>
                <div className={classes.graphButtons}>
                    <Fab color="primary" aria-label="Layout" className={classes.fab} onClick={this.layout}>
                        <Shuffle />
                    </Fab>
                </div>
            </div>
        );
    }
}

// eh..., connected with redux, not related to the "graph"
const ConnectedGraph = connect(state => ({
    blocks: state.graph.graphs.blocks
}))(Graph);

export default withStyles(styles)(ConnectedGraph);
