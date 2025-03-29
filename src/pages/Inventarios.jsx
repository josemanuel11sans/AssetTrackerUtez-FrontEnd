import { useParams } from "react-router-dom";
const Inventarios = () => {
  const { id } = useParams();
    return (
      <div>
        <h1>inventarios</h1>
        <p>El id del incentario que se esta buscando es {id}</p>
      </div>
    )
  }
  
  export default Inventarios
  
  