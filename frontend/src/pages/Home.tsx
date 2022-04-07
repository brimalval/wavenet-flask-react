import { ErrorMessage, Field, Form, Formik } from "formik";

function Home() {
  return (
    <Formik
      initialValues={{ name: "" }}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        setSubmitting(false);
      }}
    >
      {({ values, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <Field
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
          />
          <ErrorMessage name="name" component="div" />
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default Home;
