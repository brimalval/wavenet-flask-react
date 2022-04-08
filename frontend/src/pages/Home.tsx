import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { postParams } from "../utils/api";
import { Note, Scale } from "../utils/types/Key";
import ParamsRequest from "../utils/types/ParamsRequest";

function Home() {
  const initialValues: ParamsRequest = {
    key: "C#maj",
    tempo: 120,
  };
  const validationSchema = Yup.object({
    key: Yup.string().required("Key is required"),
    tempo: Yup.number().required("Tempo is required").min(45).max(280),
  });
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const resp = await postParams(values);
        console.log(resp);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <Field name="key" as="select">
            {Object.entries(Scale).map(([scale, scaleString]) => (
              <optgroup key={scale} label={`${scale} Scale`}>
                {Object.values(Note).map((note) => (
                  <option key={note} value={`${note}${scaleString}`}>
                    {note} {scale}
                  </option>
                ))}
              </optgroup>
            ))}
          </Field>

          <Field name="tempo" />
          {errors.tempo && <div className="text-red-500">{errors.tempo}</div>}

          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default Home;
