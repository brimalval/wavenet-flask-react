import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import { useFormik } from "formik";
import DashboardCard from "../components/DashboardCard";
import { Key, Note, Scale } from "../utils/types/Key";
import Song from "../utils/types/Song";
import { postParams } from "../utils/api";
import { useState } from "react";
import MelodyList from "../components/MelodyList";
import { InstrumentName } from "soundfont-player";
import instrumentNamesArray from "../utils/types/Instrument";
import * as Yup from "yup";
import Footer from "../components/Footer";
import { toast } from "material-react-toastify";

function Dashboard() {
  type KeyOption = {
    label: string;
    value: Key;
    scale: string;
    scaleString: Scale;
    mood: string;
  };
  const [sortKey, setSortKey] = useState<keyof KeyOption>("scale");
  const keyOptions: KeyOption[] = [];
  Object.entries(Scale).forEach(([scale, scaleString]) =>
    Object.values(Note).forEach((note) =>
      keyOptions.push({
        label: `${note} ${scale}`,
        value: `${note}${scaleString}`,
        scale: `${scale} Scale`,
        scaleString: scaleString,
        mood: "",
      })
    )
  );
  const keysByMood = {
    upbeat: [
      "Amaj",
      "A#maj",
      "Cmaj",
      "C#maj",
      "D#maj",
      "Emaj",
      "Gmaj",
      "G#maj",
      "Amin",
      "Bmin",
    ],
    mellow: [
      "Amaj",
      "Bmaj",
      "G#maj",
      "A#min",
      "Cmin",
      "C#min",
      "Dmin",
      "D#min",
      "Emin",
      "Fmin",
      "F#min",
      "Gmin",
      "G#min",
    ],
    neutral: ["Dmaj", "Fmaj", "F#maj"],
  };
  Object.entries(keysByMood).forEach(([mood, keys]) => {
    keys.forEach((key) => {
      const keyOption = keyOptions.find((k) => k.value === key);
      if (keyOption) {
        // Capitalize first letter of mood
        keyOption.mood = mood.charAt(0).toUpperCase() + mood.slice(1);
      }
    });
  });
  keyOptions.push({
    label: "A Major",
    value: "Amaj",
    scale: "Major Scale",
    scaleString: Scale.Major,
    mood: "Upbeat",
  });
  keyOptions.push({
    label: "G# Major",
    value: "G#maj",
    scale: "Major Scale",
    scaleString: Scale.Major,
    mood: "Upbeat",
  });
  const keyOptionsUnique: KeyOption[] = [];
  const uniquenessChecker: string[] = [];
  keyOptions.forEach((option) => {
    if (!uniquenessChecker.includes(option.value)) {
      keyOptionsUnique.push(option);
      uniquenessChecker.push(option.value);
    }
  });
  // Sort by mood, then alphabetically
  keyOptions.sort((a, b) => {
    if (a.mood === b.mood) {
      return a.label.localeCompare(b.label);
    } else {
      return a.mood.localeCompare(b.mood);
    }
  });
  const [songs, setSongs] = useState<Song[]>([]);
  const noteDurations = [
    {
      label: "Whole (1)",
      value: "whole",
    },
    {
      label: "Half (1/2)",
      value: "half",
    },
    {
      label: "Quarter (1/4)",
      value: "quarter",
    },
    {
      label: "Eighth (1/8)",
      value: "eighth",
    },
    {
      label: "Sixteenth (1/16)",
      value: "16th",
    },
  ];
  const validationSchema = Yup.object({
    variedRhythm: Yup.boolean().required(),
    melodyCount: Yup.number()
      .required()
      .max(10, "Enter a number bet. 1-10")
      .min(1, "Enter a number bet. 1-10"),
    key: Yup.object({
      value: Yup.string().required("Please select a key"),
    }).typeError("Please select a key"),
    sound: Yup.string().required("Please select an instrument"),
    noteCount: Yup.number()
      .required("Please enter a number [1-50]")
      .max(50, "Enter a number between 1-50")
      .min(1, "Enter a number between 1-50"),
    noteDuration: Yup.string().when("variedRhythm", {
      is: false,
      then: Yup.string().required("Note duration is required"),
    }),
  });
  const {
    handleSubmit,
    values,
    handleChange,
    errors,
    setFieldValue,
    isSubmitting,
  } = useFormik({
    initialValues: {
      variedRhythm: false,
      melodyCount: 1,
      key: keyOptions[0],
      sound: "acoustic_grand_piano" as InstrumentName,
      noteCount: 20,
      noteDuration: "quarter",
      primeMelodies: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const response = await postParams({
        ...values,
        key: values.key.value,
      });
      if (response.status === 200) {
        setSongs(response.data as Song[]);
      } else {
        console.error(response.data);
      }
      setSubmitting(false);
    },
  });

  return (
    <>
      <div className="w-full p-6 flex flex-col space-y-4">
        <form onSubmit={handleSubmit}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12} sm={6} md={3} className="sm:pr-3">
              <DashboardCard title="Melody Characteristics">
                <Grid container>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
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
                      error={!!errors.melodyCount}
                      helperText={errors.melodyCount ?? " "}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Tooltip
                      title="Prime the melodies with a section of the model's training set; this will usually make the melodies sound better. Normally, the melodies are primed with random notes within the selected key."
                      placement="top"
                    >
                      <FormControlLabel
                        className="-mt-3"
                        control={
                          <Checkbox
                            name="primeMelodies"
                            color="primary"
                            checked={values.primeMelodies}
                            onChange={handleChange}
                          />
                        }
                        label={<FormHelperText>Prime</FormHelperText>}
                        labelPlacement="top"
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
                <Tooltip
                  title="The sound that will be used to play the notes in the melody/ies. Note that the sound does not persist on the downloaded files; they are MIDI files, you get to control what sound will be used to play the notes with other software."
                  placement="top"
                >
                  <Autocomplete
                    id="sound"
                    value={values.sound}
                    defaultValue={undefined}
                    onChange={(event, newValue) => {
                      setFieldValue("sound", newValue ?? "");
                    }}
                    options={instrumentNamesArray}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sound"
                        variant="outlined"
                        margin="normal"
                        error={!!errors.sound}
                        helperText={errors.sound ?? " "}
                        fullWidth
                      />
                    )}
                  />
                </Tooltip>
              </DashboardCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className="md:pr-3">
              <DashboardCard title="Key" className="h-full">
                <FormControl className="mb-10">
                  <InputLabel id="sortbyLabel">Sort By</InputLabel>
                  <Select
                    value={sortKey}
                    labelId="sortbyLabel"
                    label="Sort By"
                    onChange={(event) => {
                      setSortKey(event.target.value as keyof KeyOption);
                    }}
                  >
                    <MenuItem value="mood">Mood</MenuItem>
                    <MenuItem value="scale">Scale</MenuItem>
                  </Select>
                </FormControl>
                <Tooltip
                  title="The key of the song(s) to be generated. The key will limit the range of notes that are used in the song(s)."
                  placement="top"
                >
                  <Autocomplete
                    id="key"
                    defaultValue={keyOptions[0]}
                    groupBy={(option) => option[sortKey]}
                    onChange={(event, value) => {
                      setFieldValue("key", value);
                    }}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, check) =>
                      option.value === check.value
                    }
                    options={sortKey === "mood" ? keyOptions : keyOptionsUnique}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Key"
                        id="key"
                        error={!!errors.key}
                        helperText={errors.key ?? " "}
                      />
                    )}
                  />
                </Tooltip>
              </DashboardCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <DashboardCard title="Rhythm Characteristics" className="h-full">
                <Grid container spacing={4}>
                  <Grid item xs={6} className="flex items-center">
                    <Tooltip
                      placement="top"
                      title="Dictates whether the melodies' notes will all have the same note, or if the model should decide what their durations will be."
                    >
                      <FormControlLabel
                        value="start"
                        className="mb-10"
                        control={
                          <Checkbox
                            name="variedRhythm"
                            color="primary"
                            checked={values.variedRhythm}
                            onChange={handleChange}
                          />
                        }
                        label="Varied Rhythm"
                        labelPlacement="start"
                      />
                    </Tooltip>
                    {/* <TextField
                    fullWidth
                    label="Lowest Note Duration"
                    id="rhythmType"
                    onChange={handleChange}
                    name="rhythmType"
                    type="number"
                  /> */}
                  </Grid>
                  <Grid item xs={6}>
                    {/* Spacer */}
                  </Grid>
                  <Grid item xs={6}>
                    <Tooltip
                      placement="top"
                      title='All generated notes will have the selected duration. This only applies if "Varied Rhythm" is checked.'
                    >
                      <FormControl fullWidth>
                        <InputLabel id="noteDurationLabel">
                          Note Duration
                        </InputLabel>
                        <Select
                          disabled={values.variedRhythm}
                          inputProps={{
                            readOnly: values.variedRhythm,
                          }}
                          value={values.noteDuration}
                          labelId="noteDurationLabel"
                          label="Note Duration"
                          id="noteDuration"
                          name="noteDuration"
                          onChange={handleChange}
                          type="number"
                          error={!!errors.noteDuration}
                        >
                          {noteDurations.map((noteDuration) => (
                            <MenuItem
                              key={noteDuration.value}
                              value={noteDuration.value}
                            >
                              {noteDuration.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText error={!!errors.noteDuration}>
                          {errors.noteDuration ?? " "}
                        </FormHelperText>
                      </FormControl>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="No. of Notes"
                      id="noteCount"
                      name="noteCount"
                      type="number"
                      value={values.noteCount}
                      onChange={handleChange}
                      error={!!errors.noteCount}
                      helperText={errors.noteCount ?? " "}
                    />
                  </Grid>
                </Grid>
              </DashboardCard>
            </Grid>

            <Grid item xs={12} className="text-right">
              <LoadingButton
                loading={isSubmitting}
                loadingPosition="start"
                startIcon={<AddIcon />}
                type="submit"
                onClick={() => {
                  if (Object.keys(errors).length !== 0) {
                    Object.keys(errors).forEach((key) => {
                      const errorKey = key as keyof typeof errors;
                      if (errors[errorKey]) {
                        const error = errors[errorKey];
                        toast.error(`${key}: ${error}`);
                      }
                    });
                  }
                }}
                variant="contained"
                className="bg-primary"
              >
                Generate
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
        <MelodyList songs={songs} instrument={values.sound} />
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
