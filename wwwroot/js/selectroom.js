﻿'use strict';

/**
 * Select your Room name and identity (screen name).
 * @param $modal - modal for selecting your Room name and identity
 * @param error - Error from the previous Room session, if any
 */
function selectRoom($modal, error) {
    const $alert = $('div.alert', $modal);
    //const $identity = $('#screen-name', $modal);
    const $join = $('button.btn-primary', $modal);
    const $roomName = $('#room-name', $modal);

    if (error) {
        $alert.html(`<h5>${error.name}${error.message
            ? `: ${error.message}`
            : ''}</h5>${getUserFriendlyError(error)}`);
        $alert.css('display', '');
    } else {
        $alert.css('display', 'none');
    }

    return new Promise(resolve => {

        $modal.on('shown.bs.modal', function onShow() {
            $modal.off('shown.bs.modal', onShow);

            $join.click(function onJoin() {
                //const identity = $identity.val();
                const roomName = $roomName.val();
                if (/*identity &&*/ roomName) {
                    // Append the Room name to the web application URL.
                    //addUrlParams({ roomName });

                    // Save the user name.
                    //localStorage.setItem('userName', identity);

                    $join.off('click', onJoin);
                    $modal.modal('hide');
                }
            });
        });

        $modal.on('hidden.bs.modal', function onHide() {
            $modal.off('hidden.bs.modal', onHide);
            //const identity = $identity.val();
            const roomName = $roomName.val();
            resolve({ /*identity,*/ roomName });
        });

        $modal.modal({
            backdrop: 'static',
            focus: true,
            keyboard: false,
            show: true
        });
    });

}