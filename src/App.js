import React, { Component } from 'react';
import logo from './logo.svg';
import {render} from 'react-dom';
import {Map, TileLayer,Marker,Popup} from 'react-leaflet';
import L from 'leaflet';
import './App.css';
import HorizontalScrollbar from 'react-scrollbar-js';
import HorizontalTimeline from 'react-horizontal-timeline';
import Timeline from 'react-visjs-timeline';
import {Graph, GraphBuilder} from 'greycat';

import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';

import WorldMap from './WorldMap';


const stamenTonerTiles = 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png';
const stamenTonerAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const mapCenter = [39.9528, -75.1638];
const zoomLevel = 12;

// http://visjs.org/docs/timeline/#Configuration_Options
const options = {
  width: '100%',
  height: '60px',
  stack: false,
  showMajorLabels: true,
  showCurrentTime: false,
  zoomMin: 1000000,

  format: {
    minorLabels: {
      minute: 'h:mma',  type: 'background',
      hour: 'ha'
    }
  }
}

const train = {
                  iconUrl: 'Train.png',
                  shadowUrl: 'ShadowTrain.png',

                  iconSize:   [50,50],
                  shadowSize: [70,70],
                  iconAnchor:   [25, 50],
                  shadowAnchor: [30, 53],
                  popupAnchor:  [-3, -76]
}

const trainIcon = L.icon(train);

const car = {
                  iconUrl: 'Car.png',
                  shadowUrl: 'ShadowCar.png',

                  iconSize:   [50,50],
                  shadowSize: [70,70],
                  iconAnchor:   [25, 50],
                  shadowAnchor: [35, 60],
                  popupAnchor:  [-3, -76]
}

const carIcon = L.icon(car);

function stringifyObject (object) {
      if (!object) return;
      var replacer = function(key, value) {
        if (value && value.tagName) {
          return "DOM Element";
        } else {
          return value;
        }
      }
      return JSON.stringify(object, replacer)
}

function logEvent(properties) {
      var log = document.getElementById('log');
      var msg = document.createElement('div');
      msg.innerHTML = 'time=' + properties.time;
      log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
}

function clickHandler(props){
    logEvent(props);
}

function test() {
        this.width = this.width*0.9;
}

class timeline extends Timeline{
    constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.state = {count: 0};
    }

    handleClick() {
        this.setState({
        count: this.state.count + 1
        }, function(){
            console.log("Job's done");
        });
    }

    render(){
    <div>
        <Timeline
            options={options}
            clickHandler={logEvent}

        >
            Blabla
        </Timeline>
    </div>
    }


}



class ScrollableComponent extends React.Component {

  render() {
    const myScrollbar = {
    };
    return(
      <HorizontalScrollbar style={myScrollbar}>
        <div className="should-have-a-children scroll-me">
          <p>And Nowaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
        </div>
      </HorizontalScrollbar>
    )
  }

}

class BarChart extends Component {
   constructor(props){
      super(props)
      this.createBarChart = this.createBarChart.bind(this)
   }

   componentDidMount() {
      this.createBarChart()
   }

   componentDidUpdate() {
      this.createBarChart()
   }

   createBarChart() {
      const node = this.node
      const dataMax = max(this.props.data)
      const yScale = scaleLinear()
         .domain([0, dataMax])
         .range([0, this.props.size[1]])

   select(node)
      .selectAll('rect')
      .data(this.props.data)
      .enter()
      .append('rect')

   select(node)
      .selectAll('rect')
      .data(this.props.data)
      .exit()
      .remove()

   select(node)
      .selectAll('rect')
      .data(this.props.data)
      .style('fill', '#fe9922')
      .attr('x', (d,i) => i * 25)
      .attr('y', d => this.props.size[1] - yScale(d))
      .attr('height', d => yScale(d))
      .attr('width', 25)
   }

    render() {
      return <svg ref={node => this.node = node}
      width={500} height={500}>
      </svg>
   }
}

class App2 extends Component {
    render() {
        return (
            <div className="Map">
                <Map
                    center={mapCenter}
                    zoom={zoomLevel}
                >
                    <TileLayer
                        attribution={stamenTonerAttr}
                        url={stamenTonerTiles}
                        maxZoom={18}
                    />
                </Map>
            </div>
        );
    }
}

class MyMap extends React.Component {
  constructor () {
    super()
    this.state = {
      lat: 49.62559,
      lng: 6.160,
      zoom: 17
    }
  }

  render () {
    const position = [this.state.lat, this.state.lng]
    return (
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
              <span>Blabla.<br/>Blablabla.</span>
            </Popup>
          </Marker>
        </Map>
      )
  }
}


class TimeMap extends Component {
  constructor() {
    super();
    this.state = {
      carMarkers: [[49.62559, 6.160]],
      trainMarkers: [],
      isCar: false
    };
  }

  addMarker = (e) => {
    const {carMarkers,trainMarkers,isCar} = this.state
    if (isCar)
    {carMarkers.push(e.latlng)}
    else{trainMarkers.push(e.latlng)}
    this.setState({carMarkers,trainMarkers,
      isCar: !this.state.isCar})

  }

  render() {
    return (

    <div className="TimeMap">
      <div className="Map">
        <Map
         center={[49.62559, 6.160]}
         onClick={this.addMarker}
         zoom={13}
         >
         <TileLayer
           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
           url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
         />
         {this.state.carMarkers.map((position, idx) =>
           <Marker key={`marker-${idx}`} position={position} icon={carIcon}>
           <Popup>
             <span>I'm a car. <br/> lat: {position[0]}<br/> lng: {position[1]}</span>
           </Popup>
         </Marker>
         )}
         {this.state.trainMarkers.map((position, idx) =>
           <Marker key={`marker-${idx}`} position={position} icon={trainIcon}>
           <Popup>
             <span>I'm a train. <br/> lat: {position[0]}<br/> lng: {position[1]}</span>
           </Popup>
         </Marker>
         )}
        </Map>
      </div>

      <div className = "time">
                  <Timeline
                      options={options}
                      clickHandler={clickHandler}
                  />
      </div>

      <div id="log" />
    </div>



    );
  }
}

class App3 extends Component {

    render() {
        return (
        <div className="Map">
             <script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet.js"
               integrity="sha512-A7vV8IFfih/D732iSSKi20u/ooOfj/AGehOKq0f4vLT1Zr2Y+RX7C+w8A1gaSasGtRUZpF/NZgzSAu4/Gc41Lg=="
               crossorigin=""></script>
            <div>
                <Map
                    center={[51.505, -0.09]}
                    zoom={13}
                >
                    <TileLayer
                        attribution={'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'}
                        url={'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'}
                        maxZoom= {18}
                        id= {'mapbox.streets'}
                        accessToken= {'your.mapbox.access.token'}
                    />
                </Map>
            </div>
        </div>
        );
    }
}

class App extends Component {
  render() {

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          Un, deux. Un, deux.
        </p>

        <div className="Map">
              <TimeMap/>
        </div>
      </div>
    );
  }
}

//, document.getElementById('blank-point')

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 ? false : true
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Move #" + move : "Game start";
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

//ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;