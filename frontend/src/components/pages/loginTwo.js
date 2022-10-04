import React from 'react';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import auth, { loginUrl } from '../../core/auth';
import request from '../../core/auth/request';
import { navigate } from '@reach/router';

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #403f83;
    border-bottom: solid 1px #403f83;
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;

const validationSchema = Yup.object().shape({
  identifier: Yup.lazy(() =>
    Yup.string()
      .required('Username is required')
  ),
  password: Yup.lazy(() =>
    Yup.string()
      .required('Password is required')
  ),
});

const initialValues = {
  identifier: '',
  password: ''
};

const logintwo = () => {

  const redirectUser = (path) => {
    navigate(path);
  }
  
  const handleSubmitForm = async (data) => {
    const requestURL = loginUrl;

    await request(requestURL, { method: 'POST', body: data})
      .then((response) => {
        auth.setToken(response.jwt, false);
        auth.setUserInfo(response.user, false);
        redirectUser('/Author/1');
      }).catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
    <GlobalStyles/>

      <section className='jumbotron breadcumb no-bg' style={{backgroundImage: `url(${'./img/background/subheader.jpg'})`}}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row'>
              <div className="col-md-12 text-center">
                  <h1>User Login</h1>
                  <p>Anim pariatur cliche reprehenderit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='container'>
        <div className="row">
        <div className="col-md-6 offset-md-3">
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={initialValues}
          validateOnMount={validationSchema.isValidSync(initialValues)}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            // const submitData = pick(values, [...requiredFields]);
            console.log(values)
            setSubmitting(true);
            await handleSubmitForm(values);
            setSubmitting(false);
            resetForm();
          }}
        >
          { 
            ({ values, isSubmitting, isValid }) => {
              // const isAllValid = isValid;
              // const submitValidationMessage = 'Please fill in all required fields';

              return (
                <Form className="form-border">
                  <h3>Login to your account</h3>
                  <div className="field-set">
                    <label>Username</label>
                    <Field className="form-control" type="email" name="identifier" />
                    <ErrorMessage name="identifier" component="div" />
                  </div>
                  <div className="field-set">
                    <Field className="form-control" type="password" name="password" />
                    <ErrorMessage name="password" component="div" />
                  </div>
                  <div id='submit'>
                      <input type='submit' id='send_message' value='Login' className="btn btn-main color-2"/>
                      <div className="clearfix"></div>

                      <div className="spacer-single"></div>

                      <ul className="list s3">
                          <li>Or login with:</li>
                          <li><span>Facebook</span></li>
                          <li><span>Google</span></li>
                          <li><span>Instagram</span></li>
                      </ul>
                  </div>
                </Form>
              )}
            }
          </Formik>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
};
export default logintwo;