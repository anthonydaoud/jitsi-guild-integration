// @flow

import React from 'react';

import { translate } from '../../../base/i18n';
import { ActionButton, InputField, PreMeetingScreen } from '../../../base/premeeting';
import { LoadingIndicator } from '../../../base/react';
import { connect } from '../../../base/redux';
import AbstractLobbyScreen, {
    _mapStateToProps
} from '../AbstractLobbyScreen';
import WalletSignInButton from './WalletSignInButton';
import { storeGuildRequirement, setChallenge } from '../../../web3/actions';
import { ALL_GUILDS_URL, MAIN_GUILD_URL, METAMASK_MAIN_URL } from '../../../web3/constants'

/**
 * Implements a waiting screen that represents the participant being in the lobby.
 */
class LobbyScreen extends AbstractLobbyScreen {
    /**
     * Implements {@code PureComponent#render}.
     *
     * @inheritdoc
     */
    render() {
        const { _deviceStatusVisible, showCopyUrlButton, t } = this.props;

        return (
            <PreMeetingScreen
                className = 'lobby-screen'
                showCopyUrlButton = { showCopyUrlButton }
                showDeviceStatus = { _deviceStatusVisible }
                title = { t(this._getScreenTitleKey()) }>
                { this._renderContent() }
            </PreMeetingScreen>
        );
    }

    /**
     * Fetches all guilds, then stores the required one
     * 
     * @param {string} guildUrlName 
     */
    _setupGuildData(guildUrlName) {
        fetch(ALL_GUILDS_URL).then((res) => {
            return res.json()
        }).then( (allGuilds) => {
            let i = 0;
            for (; i < allGuilds.length; i++) {
                if (allGuilds[i].urlName === guildUrlName) {
                    this.props.dispatch(storeGuildRequirement(allGuilds[i]));
                    break;
                }
            }
        }).catch((err) => {
            console.error(err);
        });
    }

    /**
     * Helper to extract the guild url name and challenge string before
     * passing this info on or storing it.
     * 
     * @param {string} guildEntryRequirement 
     */
    _setupWalletAccess(guildEntryRequirement) {
        //Input string will be formatted like Guild:...;Challenge:...
        const guildUrl = guildEntryRequirement.split(';')[0];        
        const challenge = guildEntryRequirement.split(';')[1];
        this._setupGuildData(guildUrl.split(':')[1])
        this.props.dispatch(setChallenge(challenge.split(':')[1]))
    }

    /**
     * On mounting, check the lobby room description. If the conference requires
     * guild access, description will have the entry requirements
     * 
     * @inheritdoc
     */
    componentDidMount() {
        const roomName = Object.keys(APP.connection.xmpp.connection.emuc.rooms)[0];
        const getInfo = $iq({
            type: 'get',
            to: roomName
        }).c('query', { xmlns: Strophe.NS.DISCO_INFO });
        APP.connection.xmpp.connection.sendIQ(getInfo, 
            (res) => {
                res = $(res).find('>query>x>field[var="muc#roominfo_description"]');
                const guildEntryRequirement = res[0].textContent;
                if (guildEntryRequirement !== "") {
                    this._setupWalletAccess(guildEntryRequirement)
                } else {
                    this.props.dispatch(storeGuildRequirement(null));
                }
            }, 
            (err)=> {
                console.error(err)
            }
        );
    }

    _getScreenTitleKey: () => string;

    _onAskToJoin: () => boolean;

    _onCancel: () => boolean;

    _onChangeDisplayName: Object => void;

    _onChangeEmail: Object => void;

    _onChangePassword: Object => void;

    _onEnableEdit: () => void;

    _onJoinWithPassword: () => void;

    _onSubmit: () => boolean;

    _onSwitchToKnockMode: () => void;

    _onSwitchToPasswordMode: () => void;

    _renderContent: () => React$Element<*>;

    /**
     * Renders the joining (waiting) fragment of the screen.
     *
     * @inheritdoc
     */
    _renderJoining() {
        return (
            <div className = 'lobby-screen-content'>
                <div className = 'spinner'>
                    <LoadingIndicator size = 'large' />
                </div>
                <span className = 'joining-message'>
                    { this.props.t('lobby.joiningMessage') }
                </span>
                { this._renderStandardButtons() }
            </div>
        );
    }

    /**
     * Renders the participant form to let the knocking participant enter its details.
     *
     * NOTE: We don't use edit action on web since the prejoin functionality got merged.
     * Mobile won't use it either once prejoin gets implemented there too.
     *
     * @inheritdoc
     */
    _renderParticipantForm() {
        return this._renderParticipantInfo();
    }

    /**
     * Renders the participant info fragment when we have all the required details of the user.
     *
     * @inheritdoc
     */
    _renderParticipantInfo() {
        const { displayName } = this.state;
        const { t } = this.props;

        return (
            <InputField
                onChange = { this._onChangeDisplayName }
                placeHolder = { t('lobby.nameField') }
                testId = 'lobby.nameField'
                value = { displayName } />
        );
    }

    /**
     * Renders the password form to let the participant join by using a password instead of knocking.
     *
     * @inheritdoc
     */
    _renderPasswordForm() {
        const { _passwordJoinFailed, t } = this.props;

        return (
            <>
                <InputField
                    className = { _passwordJoinFailed ? 'error' : '' }
                    onChange = { this._onChangePassword }
                    placeHolder = { t('lobby.passwordField') }
                    testId = 'lobby.password'
                    type = 'password'
                    value = { this.state.password } />

                {_passwordJoinFailed && <div
                    className = 'prejoin-error'
                    data-testid = 'lobby.errorMessage'>{t('lobby.invalidPassword')}</div>}
            </>
        );
    }

    /**
     * Renders the password join button (set).
     *
     * @inheritdoc
     */
    _renderPasswordJoinButtons() {
        const { t } = this.props;

        return (
            <>
                <ActionButton
                    onClick = { this._onJoinWithPassword }
                    testId = 'lobby.passwordJoinButton'
                    type = 'primary'>
                    { t('prejoin.joinMeeting') }
                </ActionButton>
                <ActionButton
                    onClick = { this._onSwitchToKnockMode }
                    testId = 'lobby.backToKnockModeButton'
                    type = 'secondary'>
                    { t('lobby.backToKnockModeButton') }
                </ActionButton>
            </>
        );
    }

    _renderGuildButtons() {
        const { displayName } = this.state;
        const { t, _guildRequirement } = this.props;
        
        const hasMetamask = typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
        if (!hasMetamask) {

            return (
                <div className='lobby-metamask-install'>
                    <a href={METAMASK_MAIN_URL} target="_blank">MetaMask </a>
                    is required to join this meeting, please install it first 
                </div>
            );
        }
    
        const link = <a href={MAIN_GUILD_URL+"/guild/"+_guildRequirement.urlName} target="_blank">
                        {_guildRequirement.name}
                        </a>;
        return (
            <div className='lobby-guild-form'>
                <div className='guild-text'>
                    This meeting requires access to the {link} guild
                </div>
                <InputField
                    onChange = { this._onChangeDisplayName }
                    placeHolder = { t('lobby.nameField') }
                    testId = 'lobby.nameField'
                    value = { displayName } />
                <WalletSignInButton />
            </div>
        )
    }

    /**
     * Renders the standard button set.
     *
     * @inheritdoc
     */
    _renderStandardButtons() {
        const { _knocking, _renderPassword, t } = this.props;

        return (
            <>
                { _knocking || <ActionButton
                    disabled = { !this.state.displayName }
                    onClick = { this._onAskToJoin }
                    testId = 'lobby.knockButton'
                    type = 'primary'>
                    { t('lobby.knockButton') }
                </ActionButton> }
                {_renderPassword && <ActionButton
                    onClick = { this._onSwitchToPasswordMode }
                    testId = 'lobby.enterPasswordButton'
                    type = 'secondary'>
                    { t('lobby.enterPasswordButton') }
                </ActionButton> }
            </>
        );
    }
}

export default translate(connect(_mapStateToProps)(LobbyScreen));
