import {
  Autocomplete,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Paper,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import DashboardCard from "../components/DashboardCard";
import { Key, Note, Scale } from "../utils/types/Key";

function Dashboard() {
  type KeyOption = {
    label: string;
    value: Key;
    scale: string;
    scaleString: Scale;
  };
  const keyOptions: KeyOption[] = [];
  Object.entries(Scale).forEach(([scale, scaleString]) =>
    Object.values(Note).forEach((note) =>
      keyOptions.push({
        label: `${note} ${scale}`,
        value: `${note}${scaleString}`,
        scale: `${scale} Scale`,
        scaleString: scaleString,
      })
    )
  );
  enum SoundOptions {
    Piano = "Piano",
    Violin = "Violin",
    Flute = "Flute",
    Clarinet = "Clarinet",
    Guitar = "Guitar",
  }
  return (
    <div className="w-full p-6">
      <Formik
        initialValues={{
          variedRhythm: false,
          melodyCount: 1,
          key: keyOptions[0],
          sound: SoundOptions.Piano,
          tempo: 120,
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, setFieldValue, errors, values, handleChange }) => (
          <form>
            <Grid container rowSpacing={2}>
              <Grid item xs={12} sm={6} md={3} className="sm:pr-3">
                <DashboardCard title="Melody Characteristics">
                  <TextField
                    label="No. of Melodies"
                    id="melodyCount"
                    name="melodyCount"
                    type="number"
                    value={values.melodyCount}
                    onChange={handleChange}
                    inputProps={{
                      min: 1,
                      max: 10,
                    }}
                  />
                  <Autocomplete
                    id="sound"
                    value={values.sound}
                    onChange={(event, newValue) => {
                      setFieldValue("sound", newValue);
                    }}
                    options={Object.values(SoundOptions)}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sound"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />
                </DashboardCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3} className="md:pr-3">
                <DashboardCard title="Key">
                  <Autocomplete
                    id="key"
                    defaultValue={keyOptions[0]}
                    groupBy={(option) => option.scale}
                    onChange={(event, value) => {
                      setFieldValue("key", value?.value);
                    }}
                    options={keyOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        placeholder="Select Key"
                        id="key"
                        error={!!errors.key}
                        onChange={handleChange}
                        name="key"
                      />
                    )}
                  />
                </DashboardCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <DashboardCard title="Rhythm Characteristics">
                  <Grid container className="mb-2" spacing={4}>
                    <Grid item xs={6} className="flex flex-col space-y-8">
                      <TextField
                        fullWidth
                        label="Time Signature"
                        id="timeSignature"
                        name="timeSignature"
                        type="number"
                      />
                      <TextField
                        fullWidth
                        label="Note Duration"
                        id="noteDuration"
                        name="noteDuration"
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <Typography id="tempo">Tempo:</Typography>
                        <Slider
                          value={values.tempo}
                          onChange={(event, newValue) => {
                            setFieldValue("tempo", newValue);
                          }}
                          aria-labelledby="tempo-slider"
                          valueLabelDisplay="auto"
                          step={1}
                          min={45}
                          max={280}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </DashboardCard>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default Dashboard;
