import Engine from './engine';


function createEngine(builder, onStart) {
  return new Engine(builder, onStart);
}


export default createEngine;
