import { Link } from "react-router-dom";

function Bar() {
  return (
    <div>
      <h1>Bar</h1>
      <Link to="/">Go to foo</Link>
    </div>
  );
}

export default Bar;
