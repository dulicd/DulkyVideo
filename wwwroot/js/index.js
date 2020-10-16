﻿'use strict';

const $modals = $('#modals');

const connectOptions = {

    // Comment this line to disable verbose logging.
    logLevel: 'debug',

    // Comment this line if you are playing music.
    maxAudioBitrate: 16000,

    // Capture 720p video @ 24 fps.
    video: { height: 720, frameRate: 24, width: 1280 }
};

const deviceIds = {
    audio: "",
    video: ""
};

/**
 * Select your Room name, your screen name and join.
 * @param [error=null] - Error from the previous Room session, if any
 */
async function selectAndJoinRoom(error = null) {
    const formData = await selectRoom(error);

    const { roomName } = formData;

    try {
        var accessToken;

        // Fetch an AccessToken from backend to create the Room.
        var ajaxResponse = await getAccessTokenToCreateRoom(roomName);
        if (ajaxResponse.statusCode === 200) {
            accessToken = ajaxResponse.value;
        }
        else if (ajaxResponse.statusCode === 400) {
            error.message = ajaxResponse.message;
            throw
        }


        // Add the specified audio device ID to ConnectOptions.
        connectOptions.audio = { deviceId: { exact: deviceIds.audio } };

        // Add the specified video device ID to ConnectOptions.
        connectOptions.video.deviceId = { exact: deviceIds.video };

        // Join the Room.
        await joinRoom(accessToken, connectOptions);

        // After the video session, display the room selection modal.
        return selectAndJoinRoom();

    } catch (error) {
        return selectAndJoinRoom(error);
    }
}


/**
 * Select your camera.
 */
async function selectCamera() {

    try {
        deviceIds.video = await selectMedia('video');
    } catch (error) {

    }
    return selectAndJoinRoom();
}

/**
 * Select your microphone.
 */
async function selectMicrophone() {

    try {
        deviceIds.audio = await selectMedia('audio');
    } catch (error) {

    }
    return selectCamera();
}


window.addEventListener('load', selectMicrophone);


function getAccessTokenToCreateRoom(roomName) {
    return $.ajax({
        type: 'get',
        url: "/Video/GetAccessTokenToCreateRoom",
        data: { 'roomName': roomName },
        success: function (res) {
           
        },
        error: function (err) {
            console.log("Error => Get access token to create room");
        }
    });
}