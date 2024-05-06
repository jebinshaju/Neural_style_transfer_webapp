import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Import the CSS file containing the login styles

const LoginComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to handle loading animation
  const [resetResponse, setResetResponse] = useState('');

  const handleSignIn = async () => {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }

      setIsLoading(true); // Start loading animation

      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const responseData = await response.json();

        if (response.ok) {
          if (responseData.success) {
            navigate('/styletransfer');
          } else {
            setError('Invalid email or password');
          }
        } else {
          setError(responseData.error || 'An error occurred. Please try again later.');
        }
      } catch (error) {
        setError('An error occurred. Please try again later.');
      }

      setIsLoading(false); // Stop loading animation
    };

    const handleForgotPassword = async () => {
      if (!email) {
        setError('Please enter your email.');
        return;
      }

      setIsLoading(true); // Start loading animation

      try {
        const response = await fetch('http://localhost:5000/reset_password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const responseData = await response.json();


        if (response.ok) {
          setResetResponse(responseData.message);
        } else {
          setError(responseData.error || 'An error occurred. Please try again later.');
        }
      } catch (error) {
        setError('An error occurred. Please try again later.');
      }

      setIsLoading(false); // Stop loading animation
    };


  return (
    <div className="login-page">
      <section className="ftco-section">
      <div className="box">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center mb-5">
              <h2 className="heading-section">LOGIN</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6 col-l">
              <div className="login-wrap p-0">
                <form className="signin-form">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group password-wrap">
                    <input
                      id="password-field"
                      type="password"
                      style={{color:"white"}}
                      className="form-control"
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      toggle="#password-field"
                      className="fa fa-fw fa-eye field-icon toggle-password"
                    ></span>
                  </div>

                  <div className="form-group">
                    <button
                      type="button"
                      onClick={handleSignIn}
                      className="form-control btn btn-primary submit px-3"
                    >
                      {isLoading ? (
                        <div className="loader"></div> // Loading animation
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </div>
                  {error && <div className="error-notification">{error}</div>}
                  {resetResponse && <div className="reset-notification">{resetResponse}</div>}
                  <div className="form-group d-md-flex align-items-center justify-content-between">
                    <div>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="forgot-password-button"
                      >
                        Forgot Password.
                      </button>
                    </div>

                    <div>
                      <a href="/signup" className="r1">
                        Don't have an account?
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
};

export default LoginComponent;
