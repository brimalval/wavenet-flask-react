import { Form, Formik } from "formik";
import * as Yup from "yup";
import { postParams } from "../utils/api";
import { Key, Note, Scale } from "../utils/types/Key";
import ParamsRequest from "../utils/types/ParamsRequest";
import {
  Autocomplete,
  Button,
  FormHelperText,
  Input,
  Slider,
  TextField,
  Typography,
} from "@mui/material";

function ParameterForm() {
  const MIN_TEMPO = 45;
  const MAX_TEMPO = 280;
  const initialValues: ParamsRequest = {
    key: "C#maj",
    tempo: 120,
  };
  // TODO : Make validation schema match ParamRequest
  // with ObjectSchema<ParamRequest>
  const validationSchema = Yup.object({
    key: Yup.string().required("Key is required"),
    tempo: Yup.number()
      .required("Tempo is required")
      .min(MIN_TEMPO)
      .max(MAX_TEMPO),
    fart: Yup.boolean(),
  });
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const resp = await postParams(values);
        console.log(resp);
        alert(
          `You posted: ${JSON.stringify(values)}\n You got: ${JSON.stringify(
            resp
          )}`
        );
        setSubmitting(false);
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        isSubmitting,
        setFieldValue,
        errors,
      }) => (
        <Form className="flex flex-col space-y-5 justify-center">
          <Autocomplete
            options={keyOptions.sort((a, b) => a.scale.localeCompare(b.scale))}
            onChange={(event, value) => {
              setFieldValue("key", value?.value);
            }}
            groupBy={(option) => (option as KeyOption).scale}
            getOptionLabel={(option) => (option as KeyOption).label}
            renderInput={(params) => (
              <TextField
                {...params}
                name="key"
                label="Key"
                error={!!errors.key}
                helperText={errors.key}
                variant="outlined"
              />
            )}
          />

          <div className="flex space-x-5">
            <div className="grow">
              <Typography>Tempo</Typography>
              <Slider
                value={values.tempo}
                valueLabelDisplay="auto"
                name="tempo"
                onBlur={handleBlur}
                onChange={handleChange}
                min={MIN_TEMPO}
                max={MAX_TEMPO}
              />
            </div>
            <Input
              value={values.tempo}
              name="tempo"
              onBlur={handleBlur}
              onChange={handleChange}
              error={!!errors.tempo}
              inputProps={{
                min: MIN_TEMPO,
                max: MAX_TEMPO,
                type: "number",
              }}
            />
          </div>
          <FormHelperText error>{errors.tempo ?? " "}</FormHelperText>
          <div className="flex justify-center">
            <Button variant="outlined" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ParameterForm;
