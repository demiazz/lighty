import Engine from './engine';


function create(builder, onStart) {
  return new Engine(builder, onStart);
}


export default create;
