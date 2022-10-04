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
    background: #212428;
    border-bottom: 0;
    box-shadow: 0 4px 20px 0 rgba(10,10,10, .8);
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: #fff;
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: none !important;
  }
  header#myHeader .logo .d-4{
    display: block !important;
  }
  .navbar .search #quick_search{
    border-radius: 20px;
  }
  .navbar .navbar-item .lines {
    border-bottom: 2px solid #ff343f;
  }
  .navbar .mainside a{
    text-align: center;
    color: #fff !important;
    background: #ff343f;
    border-radius: 30px;
  }
  .navbar .mainside a:hover {
    box-shadow: 2px 2px 20px 0 #ff343f;
    transition: all .3s ease;
  }
  .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
    background: #fff;
  }
  .item-dropdown{
    color: #fff !important;
    background: rgba(33, 36, 40, .9);
    box-shadow: 2px 2px 30px 0px rgba(20, 20, 20, 0.1);
  }
  .item-dropdown .dropdown a{
    color: #fff !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .item-dropdown .dropdown a:hover{
    color: #fff !important;
    background: #ff343f;
  }
  footer.footer-light .subfooter span img.d-1{
    display: none !important;
  }
  footer.footer-light .subfooter span img.d-4{
    display: inline-block !important;
  }
  .de_countdown{
    right: 10px;
    color: #fff;
  }
  .author_list_pp{
    margin-left:0;
  }
  footer.footer-light .subfooter{
    border-top: 1px solid rgba(255,255,255,.1);
  }
  #scroll-to-top div {
    background: #ff343f;
  }
  @media only screen and (max-width: 1199px) { 
    .navbar {
      background: #212428;
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
    <div className="greyscheme">
    <GlobalStyles/>

      <section className='jumbotron breadcumb no-bg' style={{backgroundImage: `url(${'./img/background/6.jpg'})`}}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row align-items-center px-0'>
              <div className="col-lg-4 offset-lg-4 m-auto px-0">
                <div className="box-login">
                  <h3 className="mb10">Sign In</h3>
                  <p>Login using an existing account or create a new account <span>here</span>.</p>
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
                            <div className="field-set">
                              <Field className="form-control" type="email" name="identifier" />
                              <ErrorMessage name="identifier" component="div" />
                            </div>
                            <div className="field-set">
                              <Field className="form-control" type="password" name="password" />
                              <ErrorMessage name="password" component="div" />
                            </div>
                            <div className="field-set">
                              <input type='submit' id='send_message' value='Submit' className="btn btn-main btn-fullwidth color-2"/>
                            </div>
                            <div className="clearfix"></div>
                            <div className="spacer-single"></div>
                            <ul className="list s3">
                              <li>Login with:</li>
                              <li><span >Facebook</span></li>
                              <li><span >Google</span></li>
                            </ul>
                            <div className="spacer-half"></div>
                          </Form>
                        )}
                    }
                  </Formik>
                  <form name="contactForm" id='contact_form' className="form-border" action='#'>

                      <div className="field-set">
                          <input type='text' name='email' id='email' className="form-control" placeholder="username"/>
                      </div>
                    
                    <div className="field-set">
                          <input type='password' name='password' id='password' className="form-control" placeholder="password"/>
                      </div>
                    
                    <div className="field-set">
                      <input type='submit' id='send_message' value='Submit' className="btn btn-main btn-fullwidth color-2"/>
                    </div>
                    
                    <div className="clearfix"></div>  
                      <ul className="list s3">
                          <li>Login with:</li>
                          <li><span >Facebook</span></li>
                          <li><span >Google</span></li>
                      </ul>
                      <div className="spacer-half"></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
};
export default logintwo;