import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { postParams } from "../utils/api";
import Key from "../utils/types/Key";
import ParamsRequest from "../utils/types/ParamsRequest";

function Home() {
  const initialValues: ParamsRequest = {
    key: Key.C,
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
            {Object.values(Key).map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
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
