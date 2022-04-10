import { Paper } from "@mui/material";
import ParameterForm from "../components/ParameterForm";

function Home() {
  return (
    <Paper className="md:w-2/3 sm:w-full mx-auto p-5" elevation={5}>
      <ParameterForm />
    </Paper>
  );
}

export default Home;
