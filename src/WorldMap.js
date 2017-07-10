import React, { Component } from 'react'
import './App.css'
import world from './world'
import { geoMercator, geoPath } from 'd3-geo'
class WorldMap extends Component {
   render() {
      const projection = geoMercator()
      const pathGenerator = geoPath().projection(projection)
      const countries = world.features
         .map((d,i) => <path
         key={'path' + i}
         d={pathGenerator(d)}
         className='countries'
         />)
   return <svg width={1500} height={600}>
   {countries}
   <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
   </svg>
   }
}
export default WorldMap