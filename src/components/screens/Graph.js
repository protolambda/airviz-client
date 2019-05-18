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

    addToElements = (elements, viewport, graphTopicData, labelPrefix) => {
        const end = viewport.time + viewport.length;
        for (let i = viewport.time; i < end; i++) {
            const atIndex = graphTopicData[i];
            const ks = Object.keys(atIndex);
            for (let k of ks) {
                const v = atIndex[k];
                elements.push({
                    data: {
                        id: v.selfKey,
                        label: labelPrefix + '~' + i + '~' + k,
                        position: {
                            x: i * 10,
                            y: k * 5
                        }
                    }
                });
                if (v.parentKey !== '0000000000000000000000000000000000000000000000000000000000000000') {
                    elements.push({
                        data: {
                            source: v.selfKey,
                            target: v.parentKey,
                        }
                    });
                }
            }
        }
    };

    render() {
        const {classes, viewport, blocks} = this.props;

        const elements = [];
        this.addToElements(elements, viewport, blocks, 'block');

        return (<div style={{height: '100%', width: '100%'}}>
                <CytoscapeComponent elements={elements} stylesheet={[{
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
    blocks: state.graph.graphs.blocks,
    viewport: state.graph.viewport
}))(Graph);

export default withStyles(styles)(ConnectedGraph);
