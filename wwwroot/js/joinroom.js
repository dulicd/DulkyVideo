'use strict';

const { connect, createLocalVideoTrack } = Twilio.Video;

const $room = $('#room');
const $activeParticipant = $('div#active-participant > div.participant.main', $room);
const $activeVideo = $('video', $activeParticipant);
const $participants = $('div#participants > div.row.participantlist', $room);
const $leave = $('div#participants > div.row.leave-room > div > button', $room);

// The current active Participant in the Room.
let activeParticipant = null;

// Whether the user has selected the active Participant by clicking on
// one of the video thumbnails.
let isActiveParticipantPinned = false;


/**
 * Set the active Participant's video.
 * @param participant - the active Participant
 */
function setActiveParticipant(participant) {
    if (activeParticipant) {
        const $activeParticipant = $(`div#${activeParticipant.sid}`, $participants);
        $activeParticipant.removeClass('active');
        $activeParticipant.removeClass('pinned');

        // Detach any existing VideoTrack of the active Participant.
        const { track: activeTrack } = Array.from(activeParticipant.videoTracks.values())[0] || {};
        if (activeTrack) {
            activeTrack.detach($activeVideo.get(0));
            $activeVideo.css('opacity','0');
        }
    }

    // Set the new active Participant.
    activeParticipant = participant;
    const { identity, sid } = participant;
    const $participant = $(`div#${sid}`, $participants);

    $participant.addClass('active');
    if (isActiveParticipantPinned) {
        $participant.addClass('pinned');
    }

    // Attach the new active Participant's video.
    const { track } = Array.from(participant.videoTracks.values())[0] || {};
    if (track) {
        track.attach($activeVideo.get(0));
        $activeVideo.css('opacity', '');
    }

    // Set the new active Participant's identity
    $activeParticipant.attr('data-identity', identity)
}


/**
 * Set the current active Participant in the Room.
 * @param room - the Room which contains the current active Participant
 */
function setCurrentActiveParticipant(room) {
    const { dominantSpeaker, localParticipant } = room;
    setActiveParticipant(dominantSpeaker || localParticipant);
}



/**
 * Set up the Participant's media container.
 * @param participant - the Participant whose media container is to be set up
 * @param room - the Room that the Participant joined
 */
function setupParticipantContainer(participant, room) {
    const { identity, sid } = participant;

    // Add a container for the Participant's media.
    const $container = $(`<div class="participant" data-identity="${identity}" id=${sid}>
                            <audio autoplay ${participant === room.localParticipant ? 'muted' : ''} style="opacity: 0"></audio>
                            <video autoplay muted playsinline style="opacity: 0"></video>
                          </div>`);
    // Toggle the pinning of the active Participant's video.
    $container.on('click', () => {
        if (activeParticipant === participant && isActiveParticipantPinned) {
            // Unpin the RemoteParticipant and update the current active Participant.
            isActiveParticipantPinned = false;
            setCurrentActiveParticipant(room);
        } else {
            // Pin the RemoteParticipant as the active Participant.
            isActiveParticipantPinned = true;
            setActiveParticipant(participant);
        }
    });

    $participants.append($container);

}

/**
 * Attach a Track to the DOM.
 * @param track - the Track to attach
 * @param participant - the Participant which published the Track
 */
function attachTrack(track, participant) {
    // Attach the Participant's Track to the thumbnail.
    const $media = $(`div#${participant.sid} > ${track.kind}`, $participants);
    $media.css('opacity', '');
    track.attach($media.get(0));

    // If the attached Track is a VideoTrack that is published by the active
    // Participant, then attach it to the main video as well.
    if (track.kind === 'video' && participant === activeParticipant) {
        track.attach($activeVideo.get(0));
        $activeVideo.css('opacity', '');
    }
}

/**
 * Detach a Track from the DOM.
 * @param track - the Track to be detached
 * @param participant - the Participant that is publishing the Track
 */
function detachTrack(track, participant) {
    // Detach the Participant's Track from the thumbnail.
    const $media = $(`div#${participant.sid} > ${track.kind}`, $participants);
    $media.css('opacity', '0');
    track.detach($media.get(0));

    // If the detached Track is a VideoTrack that is published by the active
    // Participant, then detach it from the main video as well.
    if (track.kind === 'video' && participant === activeParticipant) {
        track.detach($activeVideo.get(0));
        $activeVideo.css('opacity', '0');
    }
}



/**
 * Handle the Participant's media.
 * @param participant - the Participant
 * @param room - the Room that the Participant joined
 */
function participantConnected(participant, room) {
    // Set up the Participant's media container.
    setupParticipantContainer(participant, room);

    // Handle the TrackPublications already published by the Participant.
    participant.tracks.forEach(publication => {
        trackPublished(publication, participant);
    });

    // Handle theTrackPublications that will be published by the Participant later.
    participant.on('trackPublished', publication => {
        trackPublished(publication, participant);
    });
}


/**
 * Handle a disconnected Participant.
 * @param participant - the disconnected Participant
 * @param room - the Room that the Participant disconnected from
 */
function participantDisconnected(participant, room) {
    // If the disconnected Participant was pinned as the active Participant, then
    // unpin it so that the active Participant can be updated.
    if (activeParticipant === participant && isActiveParticipantPinned) {
        isActiveParticipantPinned = false;
        setCurrentActiveParticipant(room);
    }

    // Remove the Participant's media container.
    $(`div#${participant.sid}`, $participants).remove();
}


/**
 * Handle to the TrackPublication's media.
 * @param publication - the TrackPublication
 * @param participant - the publishing Participant
 */
function trackPublished(publication, participant) {
    // If the TrackPublication is already subscribed to, then attach the Track to the DOM.
    if (publication.track) {
        attachTrack(publication.track, participant);
    }

    // Once the TrackPublication is subscribed to, attach the Track to the DOM.
    publication.on('subscribed', track => {
        attachTrack(track, participant);
    });

    // Once the TrackPublication is unsubscribed from, detach the Track from the DOM.
    publication.on('unsubscribed', track => {
        detachTrack(track, participant);
    });

}



/**
 * Join a Room.
 * @param token - the AccessToken used to join a Room
 * @param connectOptions - the ConnectOptions used to join a Room
 */
async function joinRoom(token, connectOptions) {

    // Join to the Room with the given AccessToken and ConnectOptions.
    const room = await connect(token, connectOptions);

    // Save the LocalVideoTrack.
    let localVideoTrack = Array.from(room.localParticipant.videoTracks.values())[0].track;

    // Make the Room available in the JavaScript console for debugging.
    //window.room = room;

    // Handle the LocalParticipant's media.
    participantConnected(room.localParticipant, room);

    // Subscribe to the media published by RemoteParticipants already in the Room.
    room.participants.forEach(participant => {
        participantConnected(participant, room);
    });

    // Subscribe to the media published by RemoteParticipants joining the Room later.
    room.on('participantConnected', participant => {
        participantConnected(participant, room);
    });

    // Handle a disconnected RemoteParticipant.
    room.on('participantDisconnected', participant => {
        participantDisconnected(participant, room);
    });

    // Set the current active Participant.
    setCurrentActiveParticipant(room);

    // Leave the Room when the "Leave Room" button is clicked.
    $leave.click(function onLeave() {
        $leave.off('click', onLeave);
        room.disconnect();
    });

    return new Promise((resolve, reject) => {
        // Leave the Room when the "beforeunload" event is fired.
        window.onbeforeunload = () => {
            room.disconnect();
        };

        room.once('disconnected', (room, error) => {
            // Clear the event handlers on document and window..
            window.onbeforeunload = null;

            // Stop the LocalVideoTrack.
            localVideoTrack.stop();

            // Handle the disconnected LocalParticipant.
            participantDisconnected(room.localParticipant, room);

            // Handle the disconnected RemoteParticipants.
            room.participants.forEach(participant => {
                participantDisconnected(participant, room);
            });

            // Clear the active Participant's video.
            $activeVideo.get(0).srcObject = null;

            // Clear the Room reference used for debugging from the JavaScript console.
            window.room = null;

            if (error) {
                // Reject the Promise with the TwilioError so that the Room selection
                // modal (plus the TwilioError message) can be displayed.
                reject(error);
            } else {
                // Resolve the Promise so that the Room selection modal can be
                // displayed.
                resolve();
            }

        });
    });
}