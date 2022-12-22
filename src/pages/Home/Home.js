import { AplicarAViaje } from '../AplicarAViaje(passenger)/AplicarAViaje';
import './Home.scss';

export const Home = () => {
  return (
    <>
      <div className="Home">
        <div className="Home-Content shadow">
          <AplicarAViaje />
        </div>

        {
          //<Map />
        }
        <div id="loader" className="loading">
          <span className="loader"></span>
        </div>
      </div>
    </>
  );
};
