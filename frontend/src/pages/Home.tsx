import { ErrorMessage, Field, Form, Formik } from "formik";
import { Key } from "../utils/types/Key";
import * as Yup from "yup";

type Request = {
  key: Key;
  tempo: number;
};

function Home() {
  const initialValues: Request = {
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
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
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
