'use strict';

const $modals = $('#modals');
const $joinRoomModal = $('#join-room', $modals);

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
    const formData = await selectRoom($joinRoomModal, error);

    const { identity, roomName } = formData;

    try {

        // Fetch an AccessToken from backend to join the Room.
        var token = await getAccessToken();

        // Add the specified audio device ID to ConnectOptions.
        connectOptions.audio = { deviceId: { exact: deviceIds.audio } };

        // Add the specified Room name to ConnectOptions.
        connectOptions.name = roomName;

        // Add the specified video device ID to ConnectOptions.
        connectOptions.video.deviceId = { exact: deviceIds.video };

        // Join the Room.
        await joinRoom(token, connectOptions);

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


async function getAccessToken(identity) {
    return $.ajax({
        dataType: 'json',
        type: 'get',
        url: "/Video/GetAccessToken",
        data: { 'identity': identity },
        success: function (res) {

        },
        error: function (err) {
            console.log("Error => Get access token");
        }
    });
}