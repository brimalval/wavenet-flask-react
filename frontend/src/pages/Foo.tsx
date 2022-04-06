import { Link } from "react-router-dom";

function Foo() {
  return (
    <div>
      <h1 className="text-xl">Foo</h1>
      <Link to="/bar">Go to bar</Link>
    </div>
  );
}

export default Foo;
