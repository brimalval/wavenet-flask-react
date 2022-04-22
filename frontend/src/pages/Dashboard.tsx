import {
  Autocomplete,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import { Form, Formik } from "formik";
import DashboardCard from "../components/DashboardCard";
import { Key, Note, Scale } from "../utils/types/Key";
import Song from "../utils/types/Song";
import { postKey } from "../utils/api";
import { useState } from "react";
import MelodyList from "../components/MelodyList";
import { InstrumentName } from "soundfont-player";
import instrumentNamesArray from "../utils/types/Instrument";

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
  // Combine songs and instrument into a single state
  const [{ songs, instrument }, setState] = useState<{
    songs: Song[];
    instrument: InstrumentName;
  }>({
    songs: [],
    instrument: "acoustic_grand_piano",
  });
  const setSongs = (songs: Song[]) =>
    setState((prevState) => ({ ...prevState, songs }));
  const setInstrument = (instrument: InstrumentName) =>
    setState((prevState) => ({ ...prevState, instrument }));
  return (
    <div className="w-full p-6 flex flex-col space-y-4">
      <Formik
        initialValues={{
          variedRhythm: false,
          melodyCount: 1,
          key: keyOptions[0],
          sound: "acoustic_grand_piano" as InstrumentName,
          tempo: 120,
          measureCount: 0,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const response = await postKey({
            ...values,
            key: values.key.value,
          });
          if (response.status === 200) {
            setState({
              songs: response.data as Song[],
              instrument: values.sound,
            });
          } else {
            console.error(response.data);
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, setFieldValue, errors, values, handleChange }) => (
          <Form>
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
                    options={instrumentNamesArray}
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
                <DashboardCard title="Key" className="h-full">
                  <Autocomplete
                    id="key"
                    defaultValue={keyOptions[0]}
                    groupBy={(option) => option.scale}
                    onChange={(event, value) => {
                      setFieldValue("key", value);
                    }}
                    isOptionEqualToValue={(option, check) =>
                      option.value === check.value
                    }
                    options={keyOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        placeholder="Select Key"
                        id="key"
                        error={!!errors.key}
                      />
                    )}
                  />
                </DashboardCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <DashboardCard
                  title="Rhythm Characteristics"
                  className="h-full"
                >
                  <Grid container spacing={4}>
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
                    <Grid item xs={6} className="flex flex-col justify-between">
                      <FormControl>
                        <div className="flex space-x-4">
                          <Typography id="tempo">Tempo:</Typography>
                          <Input
                            id="tempo"
                            name="tempo"
                            type="number"
                            size="small"
                            value={values.tempo}
                            onChange={handleChange}
                            inputProps={{
                              min: 45,
                              max: 280,
                            }}
                            error={!!errors.tempo}
                          />
                        </div>
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
                        <FormHelperText>{errors.tempo}</FormHelperText>
                      </FormControl>

                      <TextField
                        fullWidth
                        label="No. of Measures"
                        id="measureCount"
                        name="measureCount"
                        type="number"
                        value={values.measureCount}
                        onChange={handleChange}
                        error={!!errors.measureCount}
                      />
                    </Grid>
                  </Grid>
                </DashboardCard>
              </Grid>

              <Grid item xs={1}>
                <LoadingButton
                  loading={isSubmitting}
                  loadingPosition="start"
                  startIcon={<AddIcon />}
                  type="submit"
                  variant="contained"
                  className="bg-primary"
                >
                  Generate
                </LoadingButton>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      {songs.length > 0 && <MelodyList songs={songs} instrument={instrument} />}
    </div>
  );
}

export default Dashboard;
