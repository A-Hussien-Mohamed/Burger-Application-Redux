import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.css'
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { updateObject , checkValidity } from '../../shared/utility';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Your password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 7
                },
                valid: false,
                touched: false
            }
        }, isSignup: true
    }

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControles =
            updateObject(this.state.controls, {
                [controlName]: updateObject(this.state.controls[controlName], {
                    value: event.target.value,
                    valid: checkValidity(event.target.value,
                        this.state.controls[controlName].validation),
                    touched: true
                })
            })
        this.setState({ controls: updatedControles });
    }

    Submithandler = (event) => {
        event.preventDefault();
        let authData = {
            email: this.state.controls.email.value,
            password: this.state.controls.password.value
        }
        this.state.isSignup ? this.props.onRegister(authData) : this.props.onSignin(authData);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                isSignup: !prevState.isSignup
            }
        })
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let form = formElementsArray.map(formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, formElement.id)}
            />
        ))
        if (this.props.isAuthenticated) {
            return <Redirect to={this.props.authRedirectPath} />
        }
        return (
            <div className={classes.Auth}>
                <form onSubmit={this.Submithandler}>
                    {form}
                    <Button btnType="Success">Submit</Button>
                </form>
                <Button
                    btnType="Danger"
                    clicked={this.switchAuthModeHandler}>   SWITCH To {this.state.isSignup ? 'SIGN IN' : 'SIGN UP'}</Button>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDistpatchToProps = dispatch => {
    return {
        onRegister: (authData) => dispatch(actions.signup(authData)),
        onSignin: (authData) => dispatch(actions.signIn(authData)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDistpatchToProps)(Auth);