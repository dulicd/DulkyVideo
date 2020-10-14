'use strict';

const { createLocalTracks } = Twilio.Video;

/**
 * Get the list of input devices of a given kind.
 * @param kind - 'audio' | 'video'
 * @returns {Promise<MediaDeviceInfo[]>} the list of media devices
 */
async function getInputDevices(kind) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === `${kind}input`);
}


/**
 * Start capturing media from the given input device.
 * @param kind - 'audio' or 'video'
 * @param deviceId - the input device ID
 * @returns {Promise<void>} Promise that is resolved if successful
 */
async function applyInputDevice(kind, deviceId) {

    // Create a new LocalTrack from the given Device ID.
    const [track] = await createLocalTracks({ [kind]: { deviceId } });
}


async function selectMedia(kind) {

    // Get the list of available media input devices.
    try {
        var promise = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        let devices = await getInputDevices(kind);
        await applyInputDevice(kind, devices[0].deviceId);


        return new Promise(resolve => {
            resolve(devices[0].deviceId);
        });
    } catch (e) {
        console.log(e);
    }
    
}