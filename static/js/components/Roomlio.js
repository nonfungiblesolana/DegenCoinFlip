import React from 'react';

export default class Roomlio extends React.Component {
    constructor(props) {
      super(props);
    }
  async componentDidMount() {
    if (!window.rmlLoaded) {
      window.rmlLoaded = true;
      window.rmlCalls = {};

      // Cannot be a ES6 arrow function.
      window.rml = function() {
        let ri = arguments[1].roomElementID;
        if (!window.rmlCalls[ri]) window.rmlCalls[ri] = [];
        window.rmlCalls[ri].push(arguments);
      };

      let s = document.createElement('script');
      s.setAttribute('async', 'async');
      s.setAttribute('src', 'https://embed.roomlio.com/embed.js');
      document.body.appendChild(s);
    }

    window.rml('config', {
      options: {
        embedPosition: 'bottomLeft',
        // embedPosition: this.props.isMobile ? 'bottomLeft' : 'dockLeft',
        collapsedMode: 'tab',
        collapsedModeOnlineLabel: 'Chat (Beta)',
        collapsedModeOfflineLabel: 'Chat (Beta)',
        greetingMessageUsername: 'Chat Room (Beta)',
        greetingMessage: 'Welcome Fucker. :wave:',
        chatLayout: 'stacked', // 'stacked' or 'sideBySide'
        showRoomMemberList: false, // defaults to true, false will hide the chip and sidebar showing users in a room
        styles: { 
          // collapsed mode styles (do not apply when embedPosition equals 'inline')
          '--rml-collapsed-background-color': 'rgba(220, 38, 38, 0.9)',
          '--rml-collapsed-background-color-hover': 'darkRed',
          '--rml-collapsed-background-color-active': '#8e4e4e',
          '--rml-collapsed-text-color': 'rgb(255, 255, 255)',
        },
      },
      widgetID: 'wgt_c7j3k9v9h5ieuetaijrg',
      pk: 'Rmrau39SigkaDFO0dUd9BAe2oBLSOKVllHWoh4Yo-Q2j',
      // Replace with the ID of the room-containing element.
      roomElementID: 'rml-room-1'
    });

    // Change userID, displayName, first and last to your user's ones
    // Change roomKey and roomName to your own ones
    window.rml('register', {
      options: {
        userID: `${this.props?.walletId?.slice(0,8)}`,
        displayName: this.props.nickname?.slice(0,50).replace(/[^a-zA-Z0-9 ]/g, ""),
        roomKey: 'dcf-new',
        roomName: 'dcf',
      },
      // Replace with the ID of the room-containing element.
      roomElementID: 'rml-room-1',
    });
  }

  componentWillUnmount() {}

  render() {
    return (
      <div
        id="rml-room-1"
        data-rml-room
        data-rml-version="09.mar.2020"
      ></div>
    );
  }
}

