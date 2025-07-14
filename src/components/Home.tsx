import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">
      <h1 className="title">Book Compass</h1>

      <section>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
          distinctio aut atque velit. Esse ex nemo qui aliquid vel consequuntur
          aliquam soluta debitis obcaecati iusto minima, eveniet cupiditate quia
          repellat!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
          distinctio aut atque velit. Esse ex nemo qui aliquid vel consequuntur
          aliquam soluta debitis obcaecati iusto minima, eveniet cupiditate quia
          repellat!
        </p>
      </section>

      <Link to="/login" className="btn">
        Get Started
      </Link>
    </div>
  );
}

export default Home;
