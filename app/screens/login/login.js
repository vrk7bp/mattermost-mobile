// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {injectIntl, intlShape} from 'react-intl';
import {
    ActivityIndicator,
    Image,
    InteractionManager,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Button from 'react-native-button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation';

import ErrorText from 'app/components/error_text';
import FormattedText from 'app/components/formatted_text';
import StatusBar from 'app/components/status_bar';
import PushNotifications from 'app/push_notifications';
import {GlobalStyles} from 'app/styles';

import logo from 'assets/images/logo.png';

import {RequestStatus} from 'mattermost-redux/constants';

class Login extends PureComponent {
    static propTypes = {
        intl: intlShape.isRequired,
        navigator: PropTypes.object,
        theme: PropTypes.object,
        actions: PropTypes.shape({
            handleLoginIdChanged: PropTypes.func.isRequired,
            handlePasswordChanged: PropTypes.func.isRequired,
            handleSuccessfulLogin: PropTypes.func.isRequired,
            getSession: PropTypes.func.isRequired,
            checkMfa: PropTypes.func.isRequired,
            login: PropTypes.func.isRequired
        }).isRequired,
        config: PropTypes.object.isRequired,
        license: PropTypes.object.isRequired,
        loginId: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        checkMfaRequest: PropTypes.object.isRequired,
        loginRequest: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            error: null
        };
    }

    componentWillMount() {
        Orientation.addOrientationListener(this.orientationDidChange);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.loginRequest.status === RequestStatus.STARTED && nextProps.loginRequest.status === RequestStatus.SUCCESS) {
            this.props.actions.handleSuccessfulLogin().then(this.props.actions.getSession).then(this.goToLoadTeam);
        }
    }

    componentWillUnmount() {
        Orientation.removeOrientationListener(this.orientationDidChange);
    }

    goToLoadTeam = (expiresAt) => {
        const {intl, navigator, theme} = this.props;

        if (expiresAt) {
            PushNotifications.localNotificationSchedule({
                date: new Date(expiresAt),
                message: intl.formatMessage({
                    id: 'mobile.session_expired',
                    defaultMessage: 'Session Expired: Please log in to continue receiving notifications.'
                }),
                userInfo: {
                    localNotification: true
                }
            });
        }

        navigator.resetTo({
            screen: 'LoadTeam',
            title: '',
            animated: false,
            backButtonTitle: '',
            navigatorStyle: {
                statusBarHidden: false,
                statusBarHideWithNavBar: false,
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg
            }
        });
    };

    goToMfa = () => {
        const {intl, navigator, theme} = this.props;
        navigator.push({
            screen: 'MFA',
            title: intl.formatMessage({id: 'mobile.routes.mfa', defaultMessage: 'Multi-factor Authentication'}),
            animated: true,
            backButtonTitle: '',
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg
            }
        });
    };

    blur = () => {
        this.loginId.blur();
        this.passwd.blur();
    };

    preSignIn = () => {
        this.setState({error: null});
        Keyboard.dismiss();
        InteractionManager.runAfterInteractions(() => {
            if (!this.props.loginId) {
                // it's slightly weird to be constructing the message ID, but it's a bit nicer than triply nested if statements
                let msgId = 'login.no';
                if (this.props.config.EnableSignInWithEmail === 'true') {
                    msgId += 'Email';
                }
                if (this.props.config.EnableSignInWithUsername === 'true') {
                    msgId += 'Username';
                }
                if (this.props.license.IsLicensed === 'true' && this.props.config.EnableLdap === 'true') {
                    msgId += 'LdapUsername';
                }

                this.setState({
                    error: {
                        intl: {
                            id: msgId,
                            defaultMessage: '',
                            values: {
                                ldapUsername: this.props.config.LdapLoginFieldName ||
                                this.props.intl.formatMessage({
                                    id: 'login.ldapUsernameLower',
                                    defaultMessage: 'AD/LDAP username'
                                })
                            }
                        }
                    }
                });
                return;
            }

            if (!this.props.password) {
                this.setState({
                    error: {
                        intl: {
                            id: 'login.noPassword',
                            defaultMessage: 'Please enter your password'
                        }
                    }
                });
                return;
            }

            if (this.props.config.EnableMultifactorAuthentication === 'true') {
                this.props.actions.checkMfa(this.props.loginId).then((result) => {
                    if (result.data) {
                        this.goToMfa();
                    } else {
                        this.signIn();
                    }
                });
            } else {
                this.signIn();
            }
        });
    };

    signIn = () => {
        const {actions, loginId, loginRequest, password} = this.props;
        if (loginRequest.status !== RequestStatus.STARTED) {
            actions.login(loginId.toLowerCase(), password);
        }
    };

    createLoginPlaceholder() {
        const {formatMessage} = this.props.intl;
        const license = this.props.license;
        const config = this.props.config;

        const loginPlaceholders = [];
        if (config.EnableSignInWithEmail === 'true') {
            loginPlaceholders.push(formatMessage({id: 'login.email', defaultMessage: 'Email'}));
        }

        if (config.EnableSignInWithUsername === 'true') {
            loginPlaceholders.push(formatMessage({id: 'login.username', defaultMessage: 'Username'}));
        }

        if (license.IsLicensed === 'true' && license.LDAP === 'true' && config.EnableLdap === 'true') {
            if (config.LdapLoginFieldName) {
                loginPlaceholders.push(config.LdapLoginFieldName);
            } else {
                loginPlaceholders.push(formatMessage({id: 'login.ldapUsername', defaultMessage: 'AD/LDAP Username'}));
            }
        }

        if (loginPlaceholders.length >= 2) {
            return loginPlaceholders.slice(0, loginPlaceholders.length - 1).join(', ') +
                ` ${formatMessage({id: 'login.or', defaultMessage: 'or'})} ` +
                loginPlaceholders[loginPlaceholders.length - 1];
        } else if (loginPlaceholders.length === 1) {
            return loginPlaceholders[0];
        }

        return '';
    }

    getLoginErrorMessage = () => {
        return (
            this.getServerErrorForLogin() ||
            this.props.checkMfaRequest.error ||
            this.state.error
        );
    };

    getServerErrorForLogin = () => {
        const {error} = this.props.loginRequest;
        if (!error) {
            return null;
        }
        const errorId = error.server_error_id;
        if (!errorId) {
            return error.message;
        }
        if (
            errorId === 'store.sql_user.get_for_login.app_error' ||
            errorId === 'ent.ldap.do_login.user_not_registered.app_error'
        ) {
            return {
                intl: {
                    id: 'login.userNotFound',
                    defaultMessage: "We couldn't find an account matching your login credentials."
                }
            };
        } else if (
            errorId === 'api.user.check_user_password.invalid.app_error' ||
            errorId === 'ent.ldap.do_login.invalid_password.app_error'
        ) {
            return {
                intl: {
                    id: 'login.invalidPassword',
                    defaultMessage: 'Your password is incorrect.'
                }
            };
        }
        return error.message;
    };

    loginRef = (ref) => {
        this.loginId = ref;
    };

    passwordRef = (ref) => {
        this.passwd = ref;
    };

    passwordFocus = () => {
        this.passwd.focus();
    };

    orientationDidChange = () => {
        this.scroll.scrollToPosition(0, 0, true);
    };

    scrollRef = (ref) => {
        this.scroll = ref;
    };

    render() {
        const isLoading = this.props.loginRequest.status === RequestStatus.STARTED;

        let proceed;
        if (isLoading) {
            proceed = (
                <ActivityIndicator
                    animating={true}
                    size='small'
                />
            );
        } else {
            const additionalStyle = {};
            if (this.props.config.EmailLoginButtonColor) {
                additionalStyle.backgroundColor = this.props.config.EmailLoginButtonColor;
            }
            if (this.props.config.EmailLoginButtonBorderColor) {
                additionalStyle.borderColor = this.props.config.EmailLoginButtonBorderColor;
            }

            const additionalTextStyle = {};
            if (this.props.config.EmailLoginButtonTextColor) {
                additionalTextStyle.color = this.props.config.EmailLoginButtonTextColor;
            }

            proceed = (
                <Button
                    onPress={this.preSignIn}
                    containerStyle={[GlobalStyles.signupButton, additionalStyle]}
                >
                    <FormattedText
                        id='login.signIn'
                        defaultMessage='Sign in'
                        style={[GlobalStyles.signupButtonText, additionalTextStyle]}
                    />
                </Button>
            );
        }

        return (
            <View style={style.container}>
                <StatusBar/>
                <TouchableWithoutFeedback onPress={this.blur}>
                    <KeyboardAwareScrollView
                        ref={this.scrollRef}
                        style={style.container}
                        contentContainerStyle={style.innerContainer}
                    >
                        <Image
                            source={logo}
                        />
                        <View>
                            <Text style={GlobalStyles.header}>
                                {this.props.config.SiteName}
                            </Text>
                            <FormattedText
                                style={GlobalStyles.subheader}
                                id='web.root.signup_info'
                                defaultMessage='The Premier Team Based Care Communication Platform'
                            />
                        </View>
                        <ErrorText error={this.getLoginErrorMessage()}/>
                        <TextInput
                            ref={this.loginRef}
                            value={this.props.loginId}
                            onChangeText={this.props.actions.handleLoginIdChanged}
                            style={GlobalStyles.inputBox}
                            placeholder={this.createLoginPlaceholder()}
                            autoCorrect={false}
                            autoCapitalize='none'
                            keyboardType='email-address'
                            returnKeyType='next'
                            underlineColorAndroid='transparent'
                            onSubmitEditing={this.passwordFocus}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            ref={this.passwordRef}
                            value={this.props.password}
                            onChangeText={this.props.actions.handlePasswordChanged}
                            style={GlobalStyles.inputBox}
                            placeholder={this.props.intl.formatMessage({id: 'login.password', defaultMessage: 'Password'})}
                            secureTextEntry={true}
                            autoCorrect={false}
                            autoCapitalize='none'
                            underlineColorAndroid='transparent'
                            returnKeyType='go'
                            onSubmitEditing={this.preSignIn}
                        />
                        {proceed}
                    </KeyboardAwareScrollView>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    innerContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 50
    }
});

export default injectIntl(Login);
