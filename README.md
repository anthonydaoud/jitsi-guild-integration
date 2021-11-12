# <p align="center">Jitsi <> Guild.xyz Hackathon</p>

This document details the features I've implemented to allow for token gated access to Jitsi conference rooms. At a high level, my implementation modifies primarily the welcome page and the lobby screen to achieve this integration. 

## Welcome Page Edits

The welcome page now has a button that allows you to connect your MetaMask wallet, or that shows you the address of the wallet that is currently connected. 

It also has a button that allows you to gate your conference with a guild. When a user attempts to add this requirement, the App first verifies their membership in the guild and their ownership of the wallet. If these checks pass, the user can then start the meeting with the guild requirement or remove/change it.


## Lobby Screen Edits

When a conference requires permission to access, a user is shown the lobby screen instead. If the conference has a guild requirement, then the lobby screen will display a link to the guild as well as a button allowing the user to prove their membership in the guild.

If the user's wallet is not connected, the button allows them to sign in via metamask. If the user's wallet is connected and they are part of the guild, the button requests a signature from the user with a verification code (the user doesn't need to retain the code). On signing, their signature will be verified and if valid, they will enter the conference room. 


## How it works

Under the hood, Jitsi sets up a conference by making calls to an XMPP server that handles their particular conference configuration. If a user specifies a guild requirement, then during the creation of the conference, a unique verification string is generated. This string and the particular guild url are saved in the server room's description. The server is also set to only allow members to join the conference.

When a user seeks to join a gated conference, they will automatically be put into the lobby screen waiting room. The client will then check if the conference description contains a guild requirement, and if so, the lobby screen described previously will be shown instead of the default one. When a user signs the verification message so they can join the conference, their message is sent to the server and stored as an attribute of the user. 

The client of the user then attempts to join the conference, and the client of the conference moderator (the user who created the conference) reads the attributes of the user from the server. The conference moderator's client then checks that the signature is valid and from a wallet that is a member of the guild. If the user passes these checks, then they are approved to join the conference. If not, they are automatically rejected.

# Other features

* After creating a guild-gated conference, the conference moderator can turn off and on the guild restriction at will. It's a feature in the Security Options tab of the conference


# How to install

The install process is unchanged, please go to the [jitsi install](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-web) page.
